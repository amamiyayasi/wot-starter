<h2 align="center">
Wot Starter
</h2>

<p align="center">基于<a href="https://github.com/uni-helper/vitesse-uni-app">vitesse-uni-app</a>的深度整合 Wot UI 组件库的快速起手项目</p>

<p align="center">
  <a href="https://starter-demo.wot-ui.cn/">📱 在线预览</a>
  <a href="https://starter.wot-ui.cn/">📖 在线文档</a>
</p>

## 特性

- ⚡️ [Vue 3](https://github.com/vuejs/core), [Vite](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/), [esbuild](https://github.com/evanw/esbuild) - 就是快！

- 🗂 [基于文件的路由](./src/pages)

- 📦 [组件自动化加载](./src/components)

- 📑 [布局系统](./src/layouts)

- 🎨 [UnoCSS](https://github.com/unocss/unocss) - 高性能且极具灵活性的即时原子化 CSS 引擎

- 😃 [各种图标集为你所用](https://github.com/antfu/unocss/tree/main/packages/preset-icons)

- 🔥 使用 [新的 `<script setup>` 语法](https://github.com/vuejs/rfcs/pull/227)

- 📥 [API 自动加载](https://github.com/antfu/unplugin-auto-import) - 直接使用 Composition API 无需引入

- 🦾 [TypeScript](https://www.typescriptlang.org/) & [ESLint](https://eslint.org/) - 保证代码质量

- 🐂 [Wot UI](https://github.com/Moonofweisheng/wot-design-uni) - 基于Vue3+TS开发的uni-app组件库，提供70+高质量组件，支持暗黑模式、国际化和自定义主题

- 🎉 [Uni Mini Router](https://github.com/Moonofweisheng/uni-mini-router) - 适用于uni-app&vue3的轻量级路由库

- 🎉 [Uni Mini CI](https://github.com/Moonofweisheng/uni-mini-ci) - 一个小程序端持续集成的插件

- 🎉 [Alova](https://alova.js.org/zh-CN/) - 极致高效的请求工具集

## 模版生成工具

为了快速根据业务需求搭建页面或功能模块，项目内置了命令行模版生成器：

```bash
pnpm gen:template
```

运行后可在终端中完成以下操作：

- 选择模版类型（页面模版 / 业务模块）。
- 选择具体模版，例如「运营数据面板」「项目管理列表」「多步骤表单」等。
- 输入目录英文名、导航标题，并决定是否加入 Tabbar。

生成器会自动完成：

- 将模版文件复制到 `src/pages` 或相关目录，自动替换占位符。
- 更新 `src/pages.json` 中的路由配置，可选加入自定义 Tabbar。
- 如果选择业务模块模版，会同步生成 Pinia Store 与示例接口文件，方便继续扩展。

> 新增模版：在 `templates` 目录中新增子目录并编写 `meta.json` 描述即可被脚本识别。

## 鸣谢

- [uni-helper](https://github.com/uni-helper) - 感谢 uni-helper 团队为 uni-app 开发体验优化做出的贡献。
- [vitesse-uni-app](https://github.com/uni-helper/vitesse-uni-app) - 感谢 vitesse-uni-app 提供的快速起手项目。
