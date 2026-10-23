// Confirmed facts only. Run `node tools/build.cjs` after editing to refresh the HTML.
window.PORTFOLIO_PROJECTS = {
  lensfocus: {
    name: 'LensFocus', number: '01', category: '摄影小程序', href: 'lensfocus.html',
    intro: '一个摄影小程序项目，从用户需求到产品体验的实践。',
    status: '待补充', role: '待补充', contribution: '待补充', problem: '待补充', challenge: '待补充', next: 'office',
    tags: ['摄影小程序', '案例资料待补充'],
    media: [
      { id: 'hero', src: 'assets/placeholder-mobile.svg', title: '小程序代表界面', caption: '真实产品截图待补充；当前为明确标记的占位图。', alt: 'LensFocus 小程序截图占位，非真实产品界面', kind: 'placeholder' },
      { id: 'architecture', src: 'assets/placeholder-flow.svg', title: '产品模块关系', caption: '真实产品架构待补充；不假设具体模块。', alt: 'LensFocus 产品架构图占位，尚无真实架构图', kind: 'placeholder' },
      { id: 'prd', src: 'assets/placeholder-document.svg', title: 'PRD 文档', caption: '需求说明、关键规则和边界条件待补充。', alt: 'LensFocus PRD 文档占位', kind: 'placeholder' },
      { id: 'prototype-1', src: 'assets/placeholder-mobile.svg', title: '原型 · 关键页面', caption: '页面目标、交互说明及真实原型待补充。', alt: 'LensFocus 关键页面原型占位', kind: 'placeholder' },
      { id: 'prototype-2', src: 'assets/placeholder-mobile.svg', title: '原型 · 后续流程', caption: '真实流程及前后页面关系待补充。', alt: 'LensFocus 后续流程原型占位', kind: 'placeholder' },
      { id: 'built', src: 'assets/placeholder-mobile.svg', title: '实际产品界面', caption: '真实截图、对应功能和实现状态待补充。', alt: 'LensFocus 实际产品截图占位', kind: 'placeholder' }
    ]
  },
  office: {
    name: '掌上帮', previousName: '掌上办公平台', number: '02', category: '办公软件', href: 'zhangshangbang.html',
    intro: '一个办公软件项目，围绕产品结构与业务流程展开。',
    status: '待补充', role: '待补充', contribution: '待补充', problem: '待补充', challenge: '待补充', next: 'lensfocus',
    tags: ['办公软件', '案例资料待补充'],
    media: [
      { id: 'hero', src: 'assets/placeholder-desktop.svg', title: '办公软件代表界面', caption: '真实产品截图待补充；不假设具体办公功能。', alt: '掌上帮办公软件截图占位，非真实产品界面', kind: 'placeholder' },
      { id: 'architecture', src: 'assets/placeholder-flow.svg', title: '产品功能架构', caption: '真实功能分组、层级与模块关系待补充。', alt: '掌上帮产品功能架构图占位', kind: 'placeholder' },
      { id: 'workflow', src: 'assets/placeholder-flow.svg', title: '业务流程与状态', caption: '真实流程节点、分支及状态变化待补充。', alt: '掌上帮业务流程图占位', kind: 'placeholder' },
      { id: 'prd', src: 'assets/placeholder-document.svg', title: 'PRD 与业务规则', caption: '真实文档、规则说明和异常边界待补充。', alt: '掌上帮 PRD 文档占位', kind: 'placeholder' },
      { id: 'prototype-1', src: 'assets/placeholder-desktop.svg', title: '原型 · 核心页面', caption: '真实页面结构及交互依据待补充。', alt: '掌上帮核心页面原型占位', kind: 'placeholder' },
      { id: 'prototype-2', src: 'assets/placeholder-desktop.svg', title: '原型 · 关联页面', caption: '真实页面衔接及流程说明待补充。', alt: '掌上帮关联页面原型占位', kind: 'placeholder' },
      { id: 'built', src: 'assets/placeholder-desktop.svg', title: '实际产品界面', caption: '真实截图、功能说明及实现状态待补充。', alt: '掌上帮实际产品界面占位', kind: 'placeholder' }
    ]
  }
};
window.CASE_SECTIONS = [
  { id: 'overview', title: '项目概览与当前状态', summary: '项目范围与当前状态：待补充。', fields: ['项目定位', '时间与范围', '当前状态', '成果形式'] },
  { id: 'problem', title: '用户问题与背景', summary: '目标用户、使用情境与需要解决的问题：待补充。', fields: ['目标用户', '使用情境', '现有替代方案', '核心痛点与影响'] },
  { id: 'research', title: '研究与支持证据', summary: '研究过程、资料来源与观察记录：待补充。', fields: ['研究方法与样本', '可公开的研究材料', '关键观察', '证据局限'] },
  { id: 'insight', title: '关键洞察', summary: '从观察到洞察的推导过程：待补充。', fields: ['观察到的事实', '洞察与依据', '仍未验证的假设'] },
  { id: 'alternatives', title: '备选方案与取舍', summary: '真实备选方案、比较维度与权衡：待补充。', fields: ['方案 A 与适用情境', '方案 B 与适用情境', '收益、成本与风险', '比较依据'] },
  { id: 'decisions', title: '产品决策', summary: '最终选择、选择理由和未解决的问题：待补充。', fields: ['选择了什么', '为何作出选择', '放弃了什么', '验证或回退条件'] },
  { id: 'prototype', title: '交互流程与原型', summary: '真实用户流程、截图或可交互原型：待补充。', fields: ['核心用户流程', '关键交互与异常状态', '截图或原型地址', '原型与实际实现的差异'] },
  { id: 'implementation', title: '实现与个人贡献', summary: '实现方式、协作范围及我的实际贡献：待补充。', fields: ['实现方式与技术边界', '我的角色与交付', '协作分工', '可公开的实现依据'] },
  { id: 'evaluation', title: '评估、结果与限制', summary: '评估方法、实际观察结果与局限：待补充。', fields: ['评估方法与成功标准', '实际测量结果', '证据与时间范围', '限制与未验证内容'] },
  { id: 'reflection', title: '复盘与下一步', summary: '经验、仍存疑问和下一步验证计划：待补充。', fields: ['学到了什么', '会如何重新选择', '下一步行动', '待验证的问题'] }
];
// Keep each claim traceable to real, public evidence. Missing fields stay pending.
window.CASE_CONTENT = { lensfocus: {}, office: {} };
