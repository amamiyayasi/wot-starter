#!/usr/bin/env node
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import readline from 'node:readline/promises'
import process, { stdin as input, stdout as output } from 'node:process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const templatesDir = path.join(rootDir, 'templates')

const categoryMap = {
  pages: '页面模版',
  apps: '业务模块',
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  }
  catch {
    return false
  }
}

async function loadCategories() {
  const entries = await fs.readdir(templatesDir, { withFileTypes: true })
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => ({
      value: entry.name,
      label: categoryMap[entry.name] ?? entry.name,
    }))
}

async function loadTemplates(category) {
  const categoryDir = path.join(templatesDir, category)
  const entries = await fs.readdir(categoryDir, { withFileTypes: true })
  const templates = []

  for (const entry of entries) {
    if (!entry.isDirectory())
      continue

    const templateDir = path.join(categoryDir, entry.name)
    const metaPath = path.join(templateDir, 'meta.json')
    let meta = { name: entry.name, description: '' }

    if (await pathExists(metaPath)) {
      try {
        const metaRaw = await fs.readFile(metaPath, 'utf8')
        meta = { ...meta, ...JSON.parse(metaRaw) }
      }
      catch (error) {
        console.warn(`无法读取模版描述 ${metaPath}: ${error.message}`)
      }
    }

    templates.push({
      value: entry.name,
      label: meta.name,
      hint: meta.description,
    })
  }

  if (!templates.length)
    throw new Error(`未在 ${category} 分类下找到模版`)

  return templates
}

function slugify(input) {
  return input
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^\da-z]+/gi, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

function toPascalCase(input) {
  return slugify(input)
    .split('-')
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}

function toCamelCase(input) {
  const pascal = toPascalCase(input)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function toUpperSnakeCase(input) {
  return slugify(input).replace(/-/g, '_').toUpperCase()
}

function buildContext({ name, title, layout }) {
  const kebabName = slugify(name)
  if (!kebabName)
    throw new Error('请输入合法的英文名称或标识')

  return {
    rawName: name,
    kebabName,
    pascalName: toPascalCase(kebabName),
    camelName: toCamelCase(kebabName),
    upperSnakeName: toUpperSnakeCase(kebabName),
    title,
    layout,
    layoutLine: layout ? `  layout: '${layout}',\n` : '',
  }
}

function applyReplacements(content, context) {
  const replacements = new Map([
    ['__PAGE_NAME__', context.kebabName],
    ['__PAGE_TITLE__', context.title],
    ['__KEBAB_NAME__', context.kebabName],
    ['__PASCAL_NAME__', context.pascalName],
    ['__CAMEL_NAME__', context.camelName],
    ['__UPPER_SNAKE_NAME__', context.upperSnakeName],
  ])

  let result = content
  for (const [key, value] of replacements.entries())
    result = result.replaceAll(key, value)

  result = result.replace(/^ {2}\/\/ __LAYOUT_PLACEHOLDER__\r?\n?/gm, context.layoutLine)

  return result
}

function replaceInPath(targetPath, context) {
  return targetPath
    .replaceAll('__PAGE_NAME__', context.kebabName)
    .replaceAll('__PAGE_TITLE__', context.title)
    .replaceAll('__KEBAB_NAME__', context.kebabName)
    .replaceAll('__PASCAL_NAME__', context.pascalName)
    .replaceAll('__CAMEL_NAME__', context.camelName)
    .replaceAll('__UPPER_SNAKE_NAME__', context.upperSnakeName)
}

async function collectTemplateEntries(templateDir, destRoot, context) {
  const queue = [{ dir: templateDir, relative: '' }]
  const files = []

  while (queue.length) {
    const current = queue.pop()
    const entries = await fs.readdir(current.dir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.name === 'meta.json' || entry.name === '.DS_Store')
        continue

      const srcPath = path.join(current.dir, entry.name)
      const replacedRelative = replaceInPath(path.join(current.relative, entry.name), context)
      const destPath = path.join(destRoot, replacedRelative)

      if (entry.isDirectory()) {
        queue.push({ dir: srcPath, relative: path.join(current.relative, entry.name) })
        files.push({ srcPath, destPath, isDirectory: true })
      }
      else {
        files.push({ srcPath, destPath, isDirectory: false })
      }
    }
  }

  return files
}

async function copyTemplateFiles(files, context) {
  for (const file of files) {
    if (file.isDirectory) {
      await fs.mkdir(file.destPath, { recursive: true })
      continue
    }

    await fs.mkdir(path.dirname(file.destPath), { recursive: true })
    const raw = await fs.readFile(file.srcPath, 'utf8')
    const content = applyReplacements(raw, context)
    await fs.writeFile(file.destPath, content, 'utf8')
  }
}

async function updatePagesJson(context, layout) {
  const pagesJsonPath = path.join(rootDir, 'src/pages.json')
  const raw = await fs.readFile(pagesJsonPath, 'utf8')
  const data = JSON.parse(raw)

  const pagePath = `pages/${context.kebabName}/index`
  if (Array.isArray(data.pages)) {
    const exists = data.pages.some(page => page.path === pagePath)
    if (exists)
      throw new Error(`pages.json 中已存在路径 ${pagePath}`)

    const pageEntry = {
      path: pagePath,
      type: 'page',
      name: context.kebabName,
      style: {
        navigationBarTitleText: context.title,
      },
    }

    if (layout)
      pageEntry.layout = layout

    data.pages.push(pageEntry)
  }
  else {
    data.pages = [
      {
        path: pagePath,
        type: 'page',
        name: context.kebabName,
        style: {
          navigationBarTitleText: context.title,
        },
        ...(layout ? { layout } : {}),
      },
    ]
  }

  await fs.writeFile(pagesJsonPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

async function promptSelect(rl, message, options) {
  console.log(`\n${message}`)
  options.forEach((option, index) => {
    const hint = option.hint ? ` - ${option.hint}` : ''
    console.log(`  ${index + 1}. ${option.label}${hint}`)
  })

  while (true) {
    const answer = (await rl.question('请输入编号：')).trim()
    const index = Number.parseInt(answer, 10)

    if (!Number.isNaN(index) && index >= 1 && index <= options.length)
      return options[index - 1].value

    console.log('请输入有效的编号。')
  }
}

async function promptText(rl, message, { placeholder = '', defaultValue = '', validator } = {}) {
  while (true) {
    const hint = placeholder ? `（${placeholder}）` : ''
    const defaultHint = defaultValue ? ` [默认: ${defaultValue}]` : ''
    const answer = (await rl.question(`${message}${hint}${defaultHint}: `)).trim()
    const value = answer || defaultValue

    if (validator) {
      const error = validator(value)
      if (error) {
        console.log(error)
        continue
      }
    }

    if (!value) {
      console.log('输入不能为空。')
      continue
    }

    return value
  }
}

async function promptConfirm(rl, message, defaultValue = false) {
  const suffix = defaultValue ? ' (Y/n)' : ' (y/N)'
  while (true) {
    const answer = (await rl.question(`${message}${suffix}: `)).trim().toLowerCase()
    if (!answer)
      return defaultValue
    if (['y', 'yes'].includes(answer))
      return true
    if (['n', 'no'].includes(answer))
      return false
    console.log('请输入 y 或 n。')
  }
}

async function run() {
  console.log('==============================')
  console.log(' Wot Starter 模版生成器')
  console.log('==============================\n')

  if (!(await pathExists(templatesDir))) {
    throw new Error('未找到 templates 目录，请先创建模版')
  }

  const rl = readline.createInterface({ input, output })

  try {
    const categories = await loadCategories()
    const category = await promptSelect(rl, '选择模版类型', categories)

    const templateOptions = await loadTemplates(category)
    const templateName = await promptSelect(rl, '选择具体模版', templateOptions)

    const rawName = await promptText(rl, '输入页面或模块英文名称（用于目录）', {
      placeholder: '如 analytics-dashboard',
      validator: (value) => {
        if (!value || !value.trim())
          return '名称不能为空'
        return ''
      },
    })

    const defaultTitle = rawName
      .split(/[-_\s]+/)
      .filter(Boolean)
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ')

    const title = await promptText(rl, '输入页面标题（导航栏展示）', {
      placeholder: '如 数据驾驶舱',
      defaultValue: defaultTitle,
      validator: (value) => {
        if (!value || !value.trim())
          return '标题不能为空'
        return ''
      },
    })

    const layoutChoice = await promptSelect(rl, '选择页面布局（可选）', [
      { value: '', label: '默认布局' },
      { value: 'tabbar', label: 'Tabbar 布局' },
    ])

    const context = buildContext({ name: rawName, title: title.trim(), layout: layoutChoice })

    const templateDir = path.join(templatesDir, category, templateName)
    const destRoot = category === 'pages'
      ? path.join(rootDir, 'src/pages', context.kebabName)
      : path.join(rootDir, 'src')

    if (category === 'pages' && await pathExists(destRoot))
      throw new Error(`页面目录 ${path.relative(rootDir, destRoot)} 已存在，生成终止`)

    const files = await collectTemplateEntries(templateDir, destRoot, context)

    const conflicts = []
    for (const file of files) {
      if (file.isDirectory)
        continue

      if (await pathExists(file.destPath))
        conflicts.push(path.relative(rootDir, file.destPath))
    }

    if (conflicts.length)
      throw new Error(`以下文件已存在，生成中止:\n${conflicts.map(item => `  - ${item}`).join('\n')}`)

    await copyTemplateFiles(files, context)
    await updatePagesJson(context, layoutChoice)

    const addTab = await promptConfirm(rl, '是否将页面加入自定义 Tabbar？', false)
    if (addTab)
      await updateTabbar(context)

    console.log('\n✅ 模版已生成，目标目录：', path.relative(rootDir, destRoot))
  }
  finally {
    rl.close()
  }
}

async function updateTabbar(context) {
  const pagesJsonPath = path.join(rootDir, 'src/pages.json')
  const raw = await fs.readFile(pagesJsonPath, 'utf8')
  const data = JSON.parse(raw)

  if (!data.tabBar || !Array.isArray(data.tabBar.list))
    return

  const pagePath = `pages/${context.kebabName}/index`
  const exists = data.tabBar.list.some(item => item.pagePath === pagePath)

  if (!exists) {
    data.tabBar.list.push({ pagePath })
    await fs.writeFile(pagesJsonPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  }
}

run().catch((error) => {
  console.error(`\n❌ ${error.message}`)
  process.exit(1)
})
