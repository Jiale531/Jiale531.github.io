// Only the names are confirmed. Replace pending fields with sourced, public evidence.
window.PORTFOLIO_PROJECTS = {
  lensfocus: { name: 'LensFocus', number: '01', status: '待补充', role: '待补充', contribution: '待补充', problem: '待补充', challenge: '待补充', next: 'office' },
  office: { name: '掌上办公平台', number: '02', status: '待补充', role: '待补充', contribution: '待补充', problem: '待补充', challenge: '待补充', next: 'lensfocus' }
};
// The ten-section schema is shared; each project's content can be edited independently.
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
// Per-project overrides. Keep absent metrics as pending; never infer results.
window.CASE_CONTENT = { lensfocus: {}, office: {} };
// Example (replace with actual evidence, then remove this comment):
// CASE_CONTENT.lensfocus.research = {
//   summary: '真实研究摘要', fields: { '研究方法与样本': '真实方法与样本说明' }
// };
