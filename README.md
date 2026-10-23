# Jiale531 / AI Product Lab

在线地址：https://jiale531.github.io/

纯 HTML、CSS、JavaScript 的交互作品集，无框架、无打包步骤、无第三方运行时或字体依赖。GitHub Pages 保持从 `main` 分支根目录部署，保留 `.nojekyll`。

## 内容状态

仅以下项目名称由本人确认：**LensFocus**、**掌上办公平台**。问题、角色、贡献、项目阶段、研究、决策、原型和成果尚未提供，全部标记为“待补充”。首页的图形是案例结构示意，不是产品截图。

首页“决策实验”是独立的**演示原型**，比较首次输入体验的两种假设方案，不是任一项目的真实决策，也没有测量数据。请在有真实依据后再替换。网站没有机器人、追踪、表单提交或后台服务。

## 文件结构

- `index.html`：四个首页区块、恰好两个项目入口、方法与 GitHub 联系链接。
- `styles.css`：暖白、电蓝、编辑式排版；共享案例样式；700px/1000px 响应式规则；reduced-motion 支持。
- `projects.js`：两个项目的基本资料、十项案例结构、逐项目内容覆盖。
- `case-study.html`：共用案例页，使用 `?project=lensfocus` 或 `?project=office` 选择项目。
- `app.js`：两种方案 × 三个目标的定性比较；案例渲染、目录定位、全部展开、项目间导航。
- `.nojekyll`：按普通静态文件发布。

## 怎样填项目资料

1. 在 `projects.js` 的 `PORTFOLIO_PROJECTS` 中填写状态、角色、贡献。不要把“资料待补充”误当成真实项目尚未上线。
2. 在 `CASE_CONTENT.lensfocus` 或 `CASE_CONTENT.office` 中按段落 ID 增加真实资料。每项支持 `summary` 和 `fields`，字段名称与 `CASE_SECTIONS` 中保持一致。

```js
window.CASE_CONTENT = {
  lensfocus: {
    problem: {
      summary: '填写实际的用户问题摘要',
      fields: {
        '目标用户': '填写真实目标用户',
        '使用情境': '填写真实使用情境'
      }
    }
  },
  office: {}
};
```

缺少的字段会继续显示“待补充”。内容作为纯文本渲染，不会执行 HTML；截图/真实原型需要在 `app.js` 中的 `prototype` 段插入语义化图片或有效链接，图片应有 alt 文本、尺寸及必要说明，不放入凭证或内部资料。

3. 同步更新 `index.html` 两张卡片的问题、角色、挑战、状态和导读，保持首页与案例一致。目前首页是静态 HTML，以便无 JavaScript 时仍可浏览。
4. 资料齐备后，更新 `case-study.html` 的摘要、提示及状态标签；若两个项目进度不同，请改为逐项目数据驱动，避免移除另一项目的缺失提示。
5. 有真实研究后，再替换 `app.js` 的 `options`、`fits` 和首页决策背景。未验证前保留“演示原型”和验证局限，不把假设写成结果。
6. 添加联系渠道时只使用你希望公开、且验证过的地址。目前仅使用既有 GitHub 主页。

十项段落：概览、问题、研究、洞察、备选方案、决策、交互原型、实现贡献、评估限制、复盘。目录支持直接链接，例如 `case-study.html?project=lensfocus#research`；深层链接会自动展开对应段落。

## 本地预览与发布

在本目录启动静态服务器，例如：

```sh
python -m http.server 8765 --bind 127.0.0.1
```

打开 `http://127.0.0.1:8765/`。不要只用 file URL 判断 Pages 导航是否正常。

提交上述文件到 `main` 根目录即可自动部署。在仓库 Settings → Pages 确认 `Deploy from a branch`、`main`、`/ (root)`。不需要依赖安装或 Actions 自定义构建。发布后访问主页、两个案例与深层链接确认最新内容；旧缓存可用强制刷新清除。

## 验证记录

- JavaScript 语法检查通过。
- 本地浏览器渲染通过；桌面、768px 平板、390px 手机和320px窄屏检查，无横向溢出。
- 六组目标/方案组合更新流程、收益、代价、适配说明及验证方法。
- 两个案例各含十段结构；逐项展开、全展开/收起、目录深层链接和项目切换通过。
- Enter/Space 操作案例按钮、Enter 操作详情与方案按钮通过；焦点样式清晰。
- CSS 针对 `prefers-reduced-motion: reduce` 关闭平滑滚动、动画和过渡；默认内容不依赖动画或 hover 才可见。
- 无效项目 ID 显示返回提示，不误加载其他项目；控制台未见 JavaScript 错误。

此版本交付的是可用框架。真实项目证据、截图、结果及各项目专属演示仍待补充，不声称已完成两篇真实案例。
