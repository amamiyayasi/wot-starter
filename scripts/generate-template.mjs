#!/usr/bin/env node
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const configPath = path.join(repoRoot, 'templates', 'templates.config.json')

async function loadConfig() {
  const raw = await readFile(configPath, 'utf8')
  return JSON.parse(raw)
}

function toKebabCase(value) {
  return value
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    .replace(/\s+/g, '-')
    .replace(/_{2,}/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function toPascalCase(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}

function toCamelCase(value) {
  const pascal = toPascalCase(value)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function toTitleCase(value) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

function applyPlaceholders(content, replacements) {
  return Object.entries(replacements)
    .sort((a, b) => b[0].length - a[0].length)
    .reduce((acc, [key, value]) => {
      return acc.replace(new RegExp(key, 'g'), value)
    }, content)
}

async function pathExists(target) {
  try {
    await stat(target)
    return true
  }
  catch {
    return false
  }
}

async function ensureOutputSafe(template, outputDir) {
  if (template.outputDir === '.')
    return
  if (await pathExists(outputDir)) {
    const stats = await stat(outputDir)
    if (!stats.isDirectory())
      throw new Error(`目标路径 ${path.relative(repoRoot, outputDir)} 已存在且不是文件夹。`)
    const files = await readdir(outputDir)
    if (files.length > 0)
      throw new Error(`目标目录 ${path.relative(repoRoot, outputDir)} 已存在，请更换名称。`)
  }
}

async function copyTemplate(template, replacements) {
  const sourceRoot = path.join(repoRoot, template.sourceDir)
  const outputRoot = path.resolve(repoRoot, applyPlaceholders(template.outputDir, replacements))
  await ensureOutputSafe(template, outputRoot)
  const created = []

  async function walk(current) {
    const entries = await readdir(current, { withFileTypes: true })
    for (const entry of entries) {
      const sourcePath = path.join(current, entry.name)
      const relativePath = path.relative(sourceRoot, sourcePath)
      const replacedRelative = applyPlaceholders(relativePath, replacements)
      const targetPath = path.join(outputRoot, replacedRelative)
      if (entry.isDirectory()) {
        await mkdir(targetPath, { recursive: true })
        await walk(sourcePath)
        continue
      }
      if (await pathExists(targetPath))
        throw new Error(`文件 ${path.relative(repoRoot, targetPath)} 已存在，已终止生成。`)
      await mkdir(path.dirname(targetPath), { recursive: true })
      const content = await readFile(sourcePath, 'utf8')
      const replacedContent = applyPlaceholders(content, replacements)
      await writeFile(targetPath, replacedContent, 'utf8')
      created.push(path.relative(repoRoot, targetPath))
    }
  }

  await walk(sourceRoot)
  return created
}

async function main() {
  const rl = createInterface({ input, output })
  try {
    const config = await loadConfig()
    const { templates } = config
    const templateTypes = Array.from(new Set(templates.map((item) => item.type)))
    console.log('\n📦 模板生成向导\n')
    console.log(`可用类型: ${templateTypes.join(', ')}`)
    const typeAnswer = (await rl.question('请选择模板类型 (page/app) [page]: ')).trim().toLowerCase()
    const templateType = typeAnswer || 'page'

    const available = templates.filter((item) => item.type === templateType)
    if (available.length === 0) {
      console.error(`未找到类型 ${templateType} 对应的模板，已退出。`)
      process.exitCode = 1
      return
    }

    console.log('\n可选模板：')
    available.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.name} (${item.id}) - ${item.description}`)
    })

    const indexAnswer = (await rl.question('\n请输入模板序号: ')).trim()
    const index = Number.parseInt(indexAnswer, 10)
    if (Number.isNaN(index) || index < 1 || index > available.length)
      throw new Error('模板序号无效，请重新运行命令。')

    const selected = available[index - 1]

    const nameAnswer = (await rl.question('请输入英文名称 (建议使用kebab-case): ')).trim()
    if (!nameAnswer)
      throw new Error('名称不能为空。')
    const kebabName = toKebabCase(nameAnswer)
    if (!kebabName)
      throw new Error('名称格式不正确，请使用字母、数字或连字符。')

    const defaultTitle = toTitleCase(kebabName)
    const titleAnswer = (await rl.question(`请输入页面/应用标题 [${defaultTitle}]: `)).trim()
    const finalTitle = titleAnswer || defaultTitle

    const replacements = {
      __NAME__: kebabName,
      __NAME_CAMEL__: toCamelCase(kebabName),
      __NAME_PASCAL__: toPascalCase(kebabName),
      __TITLE__: finalTitle,
    }

    const createdFiles = await copyTemplate(selected, replacements)
    console.log('\n✅ 模板生成完成，创建了以下文件：')
    createdFiles.forEach((file) => console.log(`  - ${file}`))
    console.log('\n下一步建议：')
    if (selected.type === 'page') {
      console.log('  • 在 pages.json 或页面配置中确认导航标题。')
      console.log('  • 根据实际业务调整数据与交互逻辑。')
    }
    else {
      console.log('  • 在需要的入口添加新页面的入口链接。')
      console.log('  • 根据需求扩展 store 与服务接口实现。')
    }
  }
  catch (error) {
    console.error(`❌ 生成失败：${error.message}`)
    process.exitCode = 1
  }
  finally {
    rl.close()
  }
}

main()
