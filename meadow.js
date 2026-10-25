/* A dependency-free WebGL meadow: segmented 3D blades, perspective, wind and local interaction. */
(() => {
  'use strict';
  const redirect = { '#decision':'lab.html', '#lab':'lab.html', '#about':'about.html' };
  if (redirect[location.hash]) { location.replace(redirect[location.hash]); return; }
  const canvas = document.getElementById('meadow');
  const toggle = document.getElementById('motion-toggle');
  const hint = document.getElementById('scene-hint');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let gl;
  try { gl = canvas.getContext('webgl', { alpha:true, antialias:false, powerPreference:'low-power' }); } catch (_) { /* fallback below */ }
  const fallback = () => {
    document.body.classList.remove('webgl-ready');
    toggle.hidden = true;
    hint.textContent = '春日常在，欢迎探索我的作品';
  };
  if (!gl) { fallback(); return; }
  const vertex = `
    precision highp float;
    attribute vec2 aRoot;
    attribute vec2 aShape;
    attribute vec4 aStyle;
    uniform float uTime, uAspect, uGround, uInteraction;
    uniform vec2 uPointer;
    varying vec3 vColor;
    varying float vFog;
    void main() {
      float h = aShape.y;
      float seed = aStyle.w;
      float angle = aStyle.z;
      vec3 p = vec3(aRoot.x, h * aStyle.x, aRoot.y);
      p.x += cos(angle) * aShape.x * aStyle.y;
      p.z += sin(angle) * aShape.x * aStyle.y;
      float wind = sin(aRoot.x * .65 + aRoot.y * .4 + uTime * 1.05);
      wind += .45 * sin(aRoot.y * 1.8 - uTime * 1.6 + seed * 4.0);
      vec2 delta = aRoot - uPointer;
      float influence = exp(-dot(delta, delta) * .65) * uInteraction;
      vec2 bend = vec2(.18 + wind * .22, wind * .12);
      bend += normalize(delta + vec2(.001)) * influence * 1.15;
      p.xz += bend * h * h;
      p.y -= influence * .18 * h * h;
      vec3 d = p - vec3(0., 1.7, 7.5);
      float depth = dot(d, vec3(0., -.345, -.9386));
      float vertical = dot(d, vec3(0., .9386, -.345));
      float near = .1;
      float far = 100.;
      gl_Position = vec4(d.x * 1.55 / uAspect, vertical * 1.55 - .85 * depth, (far+near)/(far-near)*depth-2.*far*near/(far-near), depth);
      vec3 low = mix(vec3(.20,.31,.10), vec3(.35,.43,.14),seed);
      vec3 tip = mix(vec3(.53,.66,.28),vec3(.73,.77,.39),seed);
      vColor = mix(low,tip,pow(h,.7)) * (.88 + .12 * cos(angle));
      if(uGround > .5) vColor = vec3(.38,.46,.20);
      vFog = smoothstep(7., 25., depth);
    }`;
  const fragment = `
    precision mediump float;
    varying vec3 vColor;
    varying float vFog;
    void main(){ gl_FragColor=vec4(mix(vColor,vec3(.925,.92,.81),vFog),1.); }`;
  let program;
  try {
    const compile = (type, source) => {
      const s = gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s);
      if (!gl.getShaderParameter(s,gl.COMPILE_STATUS)) { gl.deleteShader(s); throw new Error('Meadow shader failed'); }
      return s;
    };
    program = gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error('Meadow program failed');
  } catch (_) { fallback(); return; }
  gl.useProgram(program);
  const uniforms = {};
  ['uTime','uAspect','uGround','uInteraction','uPointer'].forEach(k => { uniforms[k]=gl.getUniformLocation(program,k); });
  const vertices = [];
  // First six vertices form the ground; all subsequent triangles are individual curved grass blades.
  const add = (x,z,sx,sy,h,w,angle,seed) => vertices.push(x,z,sx,sy,h,w,angle,seed);
  [[-65,-55],[65,-55],[-65,7.2],[-65,7.2],[65,-55],[65,7.2]].forEach(([x,z])=>add(x,z,0,0,0,0,0,0));
  let randomState = 531;
  const random = () => { randomState=(Math.imul(1664525,randomState)+1013904223)|0; return (randomState>>>0)/4294967296; };
  const compact = innerWidth < 700 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 5);
  const bladeCount = compact ? 11500 : 23000;
  for (let i=0;i<bladeCount;i++) {
    const x=(random()-.5)*(compact?18:39), z=random()*37-30;
    const height=.28+random()*.58, width=.035+random()*.055, angle=random()*Math.PI, seed=random();
    for(let j=0;j<4;j++) {
      const y0=j/4,y1=(j+1)/4,w0=(1-y0)*.5,w1=(1-y1)*.5;
      [[-w0,y0],[w0,y0],[-w1,y1],[-w1,y1],[w0,y0],[w1,y1]].forEach(([sx,sy])=>add(x,z,sx,sy,height,width,angle,seed));
    }
  }
  const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
  [['aRoot',2,0],['aShape',2,8],['aStyle',4,16]].forEach(([name,size,offset])=>{
    const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,32,offset);
  });
  const vertexCount=vertices.length/8;
  gl.enable(gl.DEPTH_TEST); gl.clearColor(0,0,0,0);
  let width=1,height=1,aspect=1,paused=media.matches,contextLost=false;
  let pointer=[999,999],smoothed=[999,999],strength=0,targetStrength=0;
  let frameId=0,last=0,time=0,lastDraw=0;
  function resize(){
    width=innerWidth;height=innerHeight;aspect=width/height;
    const dpr=Math.min(devicePixelRatio||1,compact?1.35:1.65);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    gl.viewport(0,0,canvas.width,canvas.height);gl.uniform1f(uniforms.uAspect,aspect);
    draw();
  }
  function draw(){
    if(contextLost)return;
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(uniforms.uTime,time);gl.uniform2f(uniforms.uPointer,smoothed[0],smoothed[1]);
    gl.uniform1f(uniforms.uInteraction,strength);
    gl.uniform1f(uniforms.uGround,1);gl.drawArrays(gl.TRIANGLES,0,6);
    gl.uniform1f(uniforms.uGround,0);gl.drawArrays(gl.TRIANGLES,6,vertexCount-6);
  }
  function animate(stamp){
    frameId=0;
    if(paused||document.hidden||contextLost)return;
    // Cap to 30 fps to keep the decorative scene inexpensive on laptops and phones.
    if(stamp-lastDraw>32){
      const delta=Math.min((stamp-last)/1000,.06);time+=delta;
      strength+=(targetStrength-strength)*.12;
      smoothed[0]+=(pointer[0]-smoothed[0])*.18;smoothed[1]+=(pointer[1]-smoothed[1])*.18;
      draw();lastDraw=stamp;last=stamp;
    }
    frameId=requestAnimationFrame(animate);
  }
  function start(){ if(!frameId&&!paused&&!document.hidden&&!contextLost){last=performance.now();frameId=requestAnimationFrame(animate);} }
  function stop(){cancelAnimationFrame(frameId);frameId=0;}
  function updateButton(){toggle.setAttribute('aria-pressed',String(paused));toggle.innerHTML=paused?'开启风动 <span aria-hidden="true">▷</span>':'暂停风动 <span aria-hidden="true">Ⅱ</span>';hint.textContent=paused?'风暂时停了，想法继续生长':'移动鼠标，和风一起拨动草叶';}
  function move(event){
    // Unproject the cursor ray onto the y=0 plane using the same camera basis as the shader.
    const nx=(event.clientX/width*2-1)*aspect/1.55,ny=(1-event.clientY/height*2+.85)/1.55;
    const dy=-.345+ny*.9386,dz=-.9386-ny*.345;
    if(dy>=-.015){targetStrength=0;return;}
    const t=-1.7/dy;
    const next=[nx*t,7.5+dz*t];
    if(pointer[0]===999)smoothed=next.slice();pointer=next;targetStrength=1;
  }
  window.addEventListener('pointermove',move,{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>{targetStrength=0;});
  window.addEventListener('pointerup',event=>{if(event.pointerType==='touch')targetStrength=0;},{passive:true});
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',()=>{document.hidden?stop():start();});
  toggle.addEventListener('click',()=>{paused=!paused;updateButton();paused?stop():start();});
  const preferenceChange=()=>{paused=media.matches;updateButton();paused?stop():start();};
  if(media.addEventListener)media.addEventListener('change',preferenceChange);else media.addListener(preferenceChange);
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();contextLost=true;stop();fallback();});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  document.body.classList.add('webgl-ready');toggle.hidden=false;updateButton();resize();start();
})();
