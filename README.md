# Jiale531 / Product Portfolio

在线地址：https://jiale531.github.io/

春日暖色的多页面产品作品集。首页是单屏 WebGL 草地方块入口，其他内容通过独立页面跳转。纯 HTML / CSS / JavaScript，无框架、无 npm 依赖、无外部字体。GitHub Pages 继续从 `main` 根目录发布。

## 页面与浏览方式

- `index.html`：单屏春日入口，奶油暖色背景、浓密草叶与带厚度的土壤方块、双项目跳转；首页已移除 About / Lab / GitHub 导航及拨草提示文字。
- `meadow.css`：首页独立样式，适配桌面与手机；极短屏幕或放大字体时允许内容自然延伸，保留可访问性。
- `meadow.js`：原生 WebGL，分段三角形草叶、轨道摄像机、程序化土壤纹理、柔和阴影、微风与鼠标局部拨草。无需 CDN 或第三方库。
- `tools/home.cjs`：首页模板；修改后运行 `node tools/build.cjs`，不要只改生成的 `index.html`。
- `lensfocus.html`：LensFocus，摄影小程序案例。
- `zhangshangbang.html`：掌上帮，办公软件案例。保留原名“掌上办公平台”作为数据别名。
- `about.html`：个人介绍、工作方法、六项能力的案例证据入口、GitHub 联系方式。
- `lab.html`：独立 Product Thinking Lab，保留原有三种目标 × 两种输入方案比较。
- `case-study.html` + `legacy.js`：保留旧 `?project=lensfocus` / `?project=office` 链接和证据锚点，转到新案例。

每个案例有六章：Overview、Research、Solution、PRD & Prototype、Built Product、Reflection。**点击章节会导航到单独的 URL 视图，每次只显示一章**，例如 `lensfocus.html?section=requirements#case-view`，支持分享、刷新、浏览器返回和前后章节跳转。原有十项证据结构没有删除，分别组织到六章中。细节按钮只展开当前章。

旧首页 `#decision` / `#lab` 自动转到 `lab.html`，`#about` 转到 `about.html`；`#projects` 继续作为项目入口。

### 草坪动效

- 独立方形草坪，上方最高 34,000 株草叶，下方为 1.7 单位厚的土壤；包含草根过渡、土层颗粒与阴影。
- 斜侧 / 俯视 / 侧面按钮切换预设摄像机；拖动草坪区域自由旋转。鼠标悬停时射线映射到草坪表面，附近草叶弯曲。
- 手机采用更少草叶，限制像素比和 30fps；切到后台暂停绘制。
- 首页提供暂停 / 开启动效按钮。系统设置减少动态效果时默认静止，可手动开启。
- WebGL 不可用、编译失败或上下文丢失时保留 CSS 静态草地与全部页面链接；恢复上下文后重新初始化。
- 项目材料仍为待补充；首页交互场景不代表项目实际成果。

## 视觉与交互

- `styles.css`：CSS variables 管理颜色、系统字体、最大宽度和基础间距；奶油暖白、深绿正文、嫩绿强调；统一导航、按钮、页脚、图片组件。
- 首页单屏草地方块与双项目跳转；LensFocus 使用纵向图稿布局，掌上帮使用横向架构、流程布局。
- 移动菜单支持 Enter、Tab、Escape，页面状态使用 `aria-current`。
- 图片点击打开原生 dialog；支持关闭按钮、Escape、双向焦点循环、关闭后焦点恢复。
- 图片预览支持适应窗口、150% / 200% / 300% / 400% 缩放，画布可滚动，保持原始比例。
- 达到缩放边界后将焦点保留在可用控件上。
- 图片有 alt、尺寸、异步解码；首屏案例主图优先加载，其余懒加载。
- 尊重 reduced-motion；手机不启用进入动画。章节动效不负责隐藏重要内容。
- HTML 包含正文和证据字段，脚本失败时仍可阅读；章节单视图、菜单折叠和图片预览由脚本增强。

## 已确认与待补充

已确认：LensFocus 是摄影小程序，掌上帮是办公软件。具体功能、项目状态、角色、贡献、研究、流程、结果与反思均待补充。不根据产品名称推测功能，不虚构指标或成果。

`assets/placeholder-*.svg` **全部是标明“非真实产品界面或图稿”的素材占位**，不是产品截图。它们用于使画廊及缩放组件在没有真实素材时仍可使用，不代表已完成产品。实验室比较同样标注为演示假设，不代表两个项目的真实决策。

需要补充的真实资料：

1. 两个项目的代表性产品截图、核心原型图及简短设计解释。
2. LensFocus 的需求研究、竞品比较、模块关系、PRD 和实际产品界面。
3. 掌上帮的功能架构、业务流程（节点、分支、状态）、PRD 和实际产品界面。
4. 项目阶段、个人贡献、可公开的研究依据、评估结果及限制。

仅保留已确认的 GitHub 联系链接，没有新增私人联系方式或个人信息。

## 如何维护内容

页面是预生成的静态 HTML。**修改 `projects.js` 或模板后，在仓库目录运行：**

```sh
node tools/build.cjs
```

不需要安装依赖。将生成后的 HTML 连同源码提交即可，GitHub Pages 无需运行 Node。

- 项目基本资料：`projects.js` 的 `PORTFOLIO_PROJECTS`。
- 案例字段：`CASE_CONTENT.lensfocus` / `CASE_CONTENT.office`，使用原有十项 `CASE_SECTIONS` 的段落 ID、摘要及字段名。缺失值继续显示“待补充”。
- 页面布局、章节摘要及首页文案：`tools/build.cjs`。
- 交互：`app.js`。
- 图片：在 `projects.js` 的 `media` 中替换路径、标题、说明、alt、原始 width / height，并将 `kind` 从 `placeholder` 改为 `actual`。图片放入 `assets/`，不要删除仍被其他槽位引用的占位文件。真实图片优先使用适当尺寸的 WebP / JPEG / PNG。

例如：

```js
{ id: 'hero', src: 'assets/lensfocus-home.webp', width: 750, height: 1334,
  title: '实际页面标题', caption: '真实的页面目的与设计说明',
  alt: '准确描述截图内容', kind: 'actual' }
```

槽位 ID 不变。填写真实图稿后，同步更新模板中的“当前为占位”提示以及案例说明；别把混合状态的图组整体标为已完成。

案例覆盖示例：

```js
window.CASE_CONTENT.lensfocus.research = {
  summary: '填写真实研究摘要',
  fields: { '研究方法与样本': '填写实际方法和样本范围' }
};
```

所有数据均以转义文本生成，不能直接插入 HTML。需要复杂结构时修改模板；只放公开、可验证的材料。

## 本地预览与发布

在仓库根目录启动：

```sh
python -m http.server 8765 --bind 127.0.0.1
```

访问 `http://127.0.0.1:8765/`。发布方式仍为 Settings → Pages → Deploy from a branch → main → / (root)，保留 `.nojekyll`。提交静态文件即可部署。若看到旧版，可强制刷新。

## 验证

JavaScript 语法、静态链接与资源路径、桌面/平板/手机布局、菜单键盘操作、图片缩放/关闭/焦点管理、案例深层链接、实验室六组比较均进行检查。部署后还需确认 GitHub Pages 构建成功及线上页面可访问。没有引入机器人、跟踪、登录或后台服务。
