/* Standalone, dependency-free interactions. All editable case text uses textContent. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const goal = $('decision-goal');
  if (goal) {
    let approach = 'guided';
    const options = {
      guided: { label: 'A / GUIDED INPUT', title: '先降低「不知道怎么问」的门槛。', flow: ['选择任务', '补齐信息', '预览并提交'], benefit: '通过明确步骤和示例，帮助新用户组织需求。', cost: '步骤增加；预设任务可能限制复杂或非典型需求。' },
      open: { label: 'B / OPEN INPUT', title: '把表达空间交还给用户。', flow: ['描述需求', '澄清上下文', '确认并提交'], benefit: '用户可以表达非典型任务，熟练用户也能直接开始。', cost: '起步门槛更高；输入可能遗漏上下文，需要澄清机制。' }
    };
    const fits = {
      start: { guided: '倾向先测试引导式：让新用户知道下一步做什么，但仍需验证步骤是否过多。', open: '自由输入对熟练用户直接，但新用户可能面对空白框无从下手；需要测试示例提示是否足够。', test: '对比首次任务完成率、放弃位置，以及用户能否解释输入要求；当前没有测量结果。' },
      flexibility: { guided: '固定字段可能漏掉非典型任务；可尝试可跳过步骤和补充输入，但会增加交互复杂度。', open: '倾向先测试自由输入：表达空间更大，但需检查不同任务是否被正确理解，不能把灵活等同于有效。', test: '让用户提交不同类型的任务，比较需求表达的完整性、修改次数与任务适配情况；当前没有测量结果。' },
      reliability: { guided: '必填上下文字段有助于减少遗漏，但填完整不等于信息正确，也可能引入无效填写。', open: '信息完整性更依赖用户；可加入提交前澄清，但需要权衡额外轮次与遗漏风险。', test: '在相同任务下记录缺失信息、澄清轮次和错误理解；当前没有测量结果。' }
    };
    function renderDecision() {
      const item = options[approach], fit = fits[goal.value];
      $('decision-output-label').textContent = item.label;
      $('decision-output-title').textContent = item.title;
      $('decision-benefit').textContent = item.benefit;
      $('decision-cost').textContent = item.cost;
      $('decision-fit').textContent = fit[approach];
      $('decision-test').textContent = fit.test;
      const flow = $('decision-flow'); flow.replaceChildren();
      item.flow.forEach((label, i) => {
        if (i) { const arrow = document.createElement('b'); arrow.textContent = '→'; arrow.setAttribute('aria-hidden', 'true'); flow.append(arrow); }
        const step = document.createElement('span'); step.textContent = label; flow.append(step);
      });
      document.querySelectorAll('[data-approach]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.approach === approach)));
    }
    document.querySelectorAll('[data-approach]').forEach(button => button.addEventListener('click', () => { approach = button.dataset.approach; renderDecision(); }));
    goal.addEventListener('change', renderDecision);
    renderDecision();
  }
  if (!document.querySelector('[data-case-page]')) return;
  const projects = window.PORTFOLIO_PROJECTS;
  const id = new URLSearchParams(location.search).get('project');
  const project = projects && Object.prototype.hasOwnProperty.call(projects, id) ? projects[id] : null;
  if (!project) {
    $('case-title').textContent = '选择一个项目';
    $('case-summary').textContent = '此项目地址不存在。请从下方返回首页，选择 LensFocus 或掌上办公平台。';
    $('case-notice').textContent = '没有加载任何项目内容，避免把无效地址误认为真实案例。';
    return;
  }
  document.title = `${project.name} — Jiale531 / Case Study`;
  $('case-number').textContent = `PROJECT ${project.number} / CASE FILE`;
  $('case-title').textContent = project.name;
  $('case-status').textContent = project.status;
  $('case-role').textContent = project.role;
  $('case-contribution').textContent = project.contribution;
  const overrides = window.CASE_CONTENT[id];
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  window.CASE_SECTIONS.forEach((schema, index) => {
    const content = overrides[schema.id] || {};
    const section = element('section', 'case-block'); section.id = schema.id;
    const title = element('h2'); title.id = `${schema.id}-title`;
    title.append(element('span', 'section-number', String(index + 1).padStart(2, '0')), document.createTextNode(schema.title));
    section.setAttribute('aria-labelledby', title.id);
    section.append(title, element('p', '', content.summary || schema.summary));
    const details = element('details');
    details.append(element('summary', '', '展开细节与依据'));
    const body = element('div', 'detail-content'), list = element('dl');
    schema.fields.forEach(label => {
      const row = element('div'); row.append(element('dt', '', label), element('dd', '', content.fields?.[label] || '待补充')); list.append(row);
    });
    body.append(list); details.append(body); section.append(details);
    if (schema.id === 'prototype') {
      const slot = element('div', 'evidence-slot');
      slot.append(element('span', '', 'PROTOTYPE / 待补充'), document.createTextNode('尚未提供真实截图、流程或原型。不以装饰性界面替代产品证据。'));
      section.append(slot);
    }
    $('case-sections').append(section);
    const link = element('a', '', `${String(index + 1).padStart(2, '0')} ${schema.title}`); link.href = `#${schema.id}`; $('case-toc').append(link);
  });
  const next = projects[project.next];
  $('next-project').href = `case-study.html?project=${project.next}`;
  $('next-project').textContent = `下一个：${next.name} ↗`;
  $('case-tools').hidden = false;
  const detailNodes = [...document.querySelectorAll('.case-block details')];
  function syncDetailsButton() {
    const allOpen = detailNodes.every(detail => detail.open);
    $('toggle-details').textContent = allOpen ? '收起全部细节' : '展开全部细节';
    $('toggle-details').setAttribute('aria-expanded', String(allOpen));
  }
  $('toggle-details').addEventListener('click', () => {
    const shouldOpen = !detailNodes.every(detail => detail.open);
    detailNodes.forEach(detail => { detail.open = shouldOpen; }); syncDetailsButton();
  });
  detailNodes.forEach(detail => detail.addEventListener('toggle', syncDetailsButton));
  function navigateToHash() {
    const target = document.getElementById(location.hash.slice(1));
    if (target?.classList.contains('case-block')) {
      target.querySelector('details').open = true;
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }
  window.addEventListener('hashchange', navigateToHash);
  navigateToHash();
})();
