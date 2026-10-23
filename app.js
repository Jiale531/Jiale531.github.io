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
})();

/* Shared navigation, native image dialog, disclosures and progressive motion. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = $('primary-nav');
  if (header && toggle && nav) {
    function setMenu(open, restoreFocus = false) {
      header.toggleAttribute('data-menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('span').textContent = open ? '−' : '＋';
      if (restoreFocus) toggle.focus();
    }
    toggle.hidden = false;
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
    header.addEventListener('keydown', event => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { event.preventDefault(); setMenu(false, true); }
    });
    const narrow = matchMedia('(max-width:650px)');
    narrow.addEventListener('change', () => setMenu(false));
    document.documentElement.classList.add('js');
  }
  const panel = $('lab-panel');
  function openHashTarget() {
    if (panel && ['#lab','#decision'].includes(location.hash)) {
      panel.open = true;
      if (location.hash === '#decision') $('lab').scrollIntoView({behavior:'instant',block:'start'});
    }
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(hash);
    if (target?.matches('details.evidence-detail')) {
      target.open = true; target.scrollIntoView({behavior:'instant',block:'start'});
    }
  }
  window.addEventListener('hashchange', openHashTarget);
  openHashTarget();
  // Same-hash links should reopen a panel that the visitor previously closed.
  document.querySelectorAll('a[href="#lab"],a[href="#decision"]').forEach(link => link.addEventListener('click', () => { if(panel) panel.open = true; }));
  const allDetails = [...document.querySelectorAll('.evidence-detail')];
  const allToggle = $('toggle-details');
  if (allToggle) {
    const currentDetails=()=>allDetails.filter(detail=>!detail.closest('.case-section').hidden);
    function sync() {
      const allOpen = currentDetails().every(detail => detail.open);
      allToggle.textContent = allOpen ? '收起本章细节' : '展开本章细节';
      allToggle.setAttribute('aria-expanded', String(allOpen));
      allDetails.forEach(detail => { detail.querySelector('summary span').textContent = detail.open ? '收起依据 −' : '展开依据 ＋'; });
    }
    allToggle.addEventListener('click', () => { const next=!currentDetails().every(detail=>detail.open); currentDetails().forEach(detail=>{detail.open=next;}); sync(); });
    allDetails.forEach(detail=>detail.addEventListener('toggle',sync));
    sync();
  }
  const dialog = $('media-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    const image=$('media-image'), stage=dialog.querySelector('.dialog-stage');
    let sourceButton=null, zoom=1, fitWidth=0;
    const steps=[1,1.5,2,3,4];
    function applyZoom() {
      if (!image.naturalWidth) return;
      fitWidth = Math.min(stage.clientWidth, stage.clientHeight * image.naturalWidth / image.naturalHeight);
      image.style.width = `${Math.max(1,fitWidth * zoom)}px`;
      $('zoom-level').textContent=`${Math.round(zoom*100)}%`;
      // Preserve a visible focus target when a zoom limit disables its button.
      if ((zoom === steps[0] && document.activeElement === $('zoom-out')) ||
          (zoom === steps[steps.length-1] && document.activeElement === $('zoom-in'))) {
        $('zoom-reset').focus();
      }
      $('zoom-out').disabled=zoom===steps[0];
      $('zoom-in').disabled=zoom===steps[steps.length-1];
    }
    function resetZoom() { zoom=1; applyZoom(); stage.scrollTop=0; stage.scrollLeft=0; }
    image.addEventListener('load',resetZoom);
    image.addEventListener('error',()=>{ $('media-description').textContent='图片加载失败。请检查素材路径，或稍后重试。'; });
    document.querySelectorAll('[data-media-src]').forEach(button=>button.addEventListener('click',()=>{
      sourceButton=button; zoom=1;
      $('media-title').textContent=button.dataset.mediaTitle;
      $('media-description').textContent=button.dataset.mediaCaption;
      image.alt=button.querySelector('img').alt;
      image.removeAttribute('style');
      image.src=button.dataset.mediaSrc;
      dialog.showModal();
      $('close-media').focus();
      if(image.complete && image.naturalWidth)resetZoom();
    }));
    $('close-media').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('keydown',event=>{
      if (event.key !== 'Tab') return;
      const stops=[...dialog.querySelectorAll('button:not(:disabled),[tabindex="0"]')];
      const first=stops[0], last=stops[stops.length-1];
      if (event.shiftKey && document.activeElement===first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement===last) { event.preventDefault(); first.focus(); }
    });
    dialog.addEventListener('close',()=>{ if(sourceButton?.isConnected)sourceButton.focus({preventScroll:true}); });
    dialog.addEventListener('click',event=>{
      if(event.target!==dialog)return;
      const bounds=dialog.getBoundingClientRect();
      if(event.clientX<bounds.left || event.clientX>bounds.right || event.clientY<bounds.top || event.clientY>bounds.bottom)dialog.close();
    });
    $('zoom-in').addEventListener('click',()=>{zoom=steps[Math.min(steps.indexOf(zoom)+1,steps.length-1)];applyZoom();});
    $('zoom-out').addEventListener('click',()=>{zoom=steps[Math.max(steps.indexOf(zoom)-1,0)];applyZoom();});
    $('zoom-reset').addEventListener('click',resetZoom);
    window.addEventListener('resize',()=>{if(dialog.open)applyZoom();});
  }
  // Never hide content while waiting for a scroll observer or an animation.
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches && innerWidth>650) {
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        if(!reducedMotion.matches) entry.target.animate([{opacity:.65,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:220,easing:'ease-out'});
        observer.unobserve(entry.target);
      });
    },{threshold:.15});
    document.querySelectorAll('.section-heading,.case-section-heading').forEach(node=>observer.observe(node));
  }
})();
/* Compact routes: a case is a sequence of destinations, not one long page. */
(() => {
  const page=document.body.dataset.page;
  if(page==='home' && ['#decision','#lab'].includes(location.hash)) { location.replace('lab.html'); return; }
  if(page==='home' && location.hash==='#about') { location.replace('about.html'); return; }
  if(page==='lab') document.getElementById('lab-panel').open=true;
  const chapters=[...document.querySelectorAll('#case-evidence > .case-section')];
  if(!chapters.length)return;
  const links=[...document.querySelectorAll('.case-subnav a')];
  const body=document.querySelector('.case-body');
  const pager=document.createElement('nav');pager.className='chapter-pager';pager.setAttribute('aria-label','案例章节翻页');body.insertBefore(pager,body.querySelector('.next-project'));
  function showChapter(){
    let hash='';try{hash=decodeURIComponent(location.hash.slice(1));}catch{}
    const target=document.getElementById(hash);
    const requested=target?.closest('.case-section')?.id || new URLSearchParams(location.search).get('section') || 'overview-section';
    const active=chapters.find(chapter=>chapter.id===requested)||chapters[0];
    chapters.forEach(chapter=>{chapter.hidden=chapter!==active;});
    document.body.classList.add('case-reader');document.body.classList.toggle('chapter-overview',active===chapters[0]);
    links.forEach(link=>{if(new URL(link.href).searchParams.get('section')===active.id)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    const index=chapters.indexOf(active);pager.replaceChildren();
    for(const [offset,label] of [[-1,'← Previous chapter'],[1,'Next chapter →']]){
      const next=links[index+offset];const item=document.createElement(next?'a':'span');item.textContent=label;if(next)item.href=next.href;pager.append(item);
    }
    const details=active.querySelector('.evidence-detail');if(details)details.dispatchEvent(new Event('toggle'));
    if(target?.matches('.evidence-detail')){target.open=true;target.scrollIntoView({behavior:'instant',block:'start'});}
  }
  showChapter();window.addEventListener('hashchange',showChapter);
})();
