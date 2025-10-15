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

## 模板生成器

为了便于快速开始业务开发，项目内置了可交互的页面/应用模板生成器，支持输出带有示例数据、交互逻辑和样式的页面骨架。

```bash
pnpm new
```

1. 选择模板类型（`page` 或 `app`）。
2. 根据命令行提示选择具体模板并输入名称、标题。
3. 脚手架将自动在 `src/pages` 或相关目录下生成对应文件，并替换占位符（如 `__NAME__`、`__TITLE__`）。

### 内置模板

| 类型 | 标识 | 说明 | 主要输出 |
| ---- | ---- | ---- | -------- |
| page | `basic-page` | 展示型基础信息页，包含项目要点与操作按钮。 | `src/pages/<name>/index.vue` |
| page | `list-page` | 带搜索、筛选和进度展示的数据列表页。 | `src/pages/<name>/index.vue` |
| page | `form-page` | 含基础校验逻辑的需求采集表单页。 | `src/pages/<name>/index.vue` |
| page | `news-page` | 新闻资讯页，提供顶部分类切换与图文列表布局。 | `src/pages/<name>/index.vue` |
| app  | `starter-app` | 含仪表盘与设置页的双页面模块，集成 Pinia store 与模拟服务。 | `src/pages/<name>/**`, `src/store/use<Name>Store.ts` |

生成后的文件仅作示例，请结合实际业务进行二次调整，例如补齐接口调用、替换静态数据或调整导航配置。

## 鸣谢

- [uni-helper](https://github.com/uni-helper) - 感谢 uni-helper 团队为 uni-app 开发体验优化做出的贡献。
- [vitesse-uni-app](https://github.com/uni-helper/vitesse-uni-app) - 感谢 vitesse-uni-app 提供的快速起手项目。
