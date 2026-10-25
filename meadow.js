/* Local WebGL garden diorama: dense grass, layered soil, orbit camera. No dependencies. */
(() => {
  'use strict';
  const redirects={'#decision':'lab.html','#lab':'lab.html','#about':'about.html'};
  if(redirects[location.hash]){location.replace(redirects[location.hash]);return;}
  const canvas=document.getElementById('meadow'),stage=document.getElementById('scene-stage');
  const toggle=document.getElementById('motion-toggle'),views=[...document.querySelectorAll('[data-view]')];
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let gl,frame=0,lost=false;
  function fallback(){document.body.classList.remove('webgl-ready');toggle.hidden=true;views.forEach(b=>{b.disabled=true;});}
  try{gl=canvas.getContext('webgl',{alpha:true,antialias:true,powerPreference:'low-power'});}catch(_){}
  if(!gl){fallback();return;}
  const cameraGLSL=`
    uniform vec3 uEye,uRight,uUp,uForward;
    uniform float uAspect;
    vec4 project(vec3 p){
      vec3 d=p-uEye;float depth=dot(d,uForward);
      return vec4(dot(d,uRight)*2.0/uAspect,dot(d,uUp)*2.0,1.002*depth-.2002,depth);
    }`;
  function program(vertex,fragment){
    function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('Shader compilation failed');return s;}
    const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('Shader linking failed');
    return p;
  }
  let grass,earth;
  try{
    grass=program(`precision highp float;
      attribute vec2 aRoot,aShape;attribute vec4 aStyle;
      uniform float uTime,uInteraction;uniform vec2 uPointer;
      varying vec3 vColor;varying float vHeight;
      ${cameraGLSL}
      void main(){
        float h=aShape.y,seed=aStyle.w,angle=aStyle.z;
        vec3 p=vec3(aRoot.x,h*aStyle.x,aRoot.y);
        float wave=sin(aRoot.x*1.3+aRoot.y*.8+uTime*1.1)+.35*sin(aRoot.y*3.1-uTime*1.8+seed*5.);
        vec2 delta=aRoot-uPointer;
        float touch=exp(-dot(delta,delta)*3.4)*uInteraction;
        vec2 bend=vec2(.06+wave*.085,wave*.045)+normalize(delta+vec2(.001))*touch*.38;
        p.xz+=vec2(cos(angle),sin(angle))*aShape.x*aStyle.y+bend*h*h;
        p.y-=touch*.08*h*h;
        gl_Position=project(p);
        vec3 base=mix(vec3(.14,.27,.055),vec3(.25,.38,.075),seed);
        vec3 tip=mix(vec3(.37,.59,.14),vec3(.66,.75,.29),pow(seed,2.));
        float light=.80+.20*abs(dot(normalize(vec3(sin(angle),.5,cos(angle))),normalize(vec3(-.6,1.,.7))));
        vColor=mix(base,tip,pow(h,.7))*light;
        vHeight=h;
      }`,`precision mediump float;varying vec3 vColor;varying float vHeight;
      void main(){gl_FragColor=vec4(vColor,1.);}`);
    earth=program(`precision highp float;attribute vec3 aPosition,aNormal;varying vec3 vPosition,vNormal;
      ${cameraGLSL}
      void main(){vPosition=aPosition;vNormal=aNormal;gl_Position=project(aPosition);}`,
      `precision highp float;varying vec3 vPosition,vNormal;uniform float uShadow;
      float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
      float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
      void main(){
        if(uShadow>.5){float r=length(vPosition.xz/vec2(4.7,4.1));float alpha=(1.-smoothstep(.25,1.,r))*.17;gl_FragColor=vec4(.28,.29,.15,alpha);return;}
        vec3 p=vPosition;
        float coarse=noise(p*3.2),fine=hash(floor(p*105.));
        float layer=sin(p.y*14.+coarse*2.5)*.018;
        vec3 color=mix(vec3(.29,.17,.09),vec3(.55,.36,.19),coarse*.7+.2);
        color+=(fine-.5)*.07+layer;
        float stone=noise(p*22.);
        color=mix(color,vec3(.65,.49,.30),smoothstep(.78,.9,stone)*.55);
        float topEdge=-.12+noise(p*vec3(13.,1.,13.))*.09;
        color=mix(color,vec3(.25,.32,.09),smoothstep(topEdge-.05,topEdge,p.y));
        if(vNormal.y>.5)color=vec3(.23,.34,.075);
        // Fine root streaks in the upper soil; no external textures.
        float roots=pow(noise(vec3(p.x*39.,p.y*1.8,p.z*39.)),13.)*smoothstep(-1.2,-.1,p.y);
        color+=roots*vec3(.55,.39,.19);
        float light=.61+.39*max(0.,dot(vNormal,normalize(vec3(-.6,1.,.7))));
        color*=light*(.92+.08*smoothstep(-1.7,0.,p.y));
        gl_FragColor=vec4(color,1.);
      }`);
  }catch(_){fallback();return;}
  const uniformNames=['uEye','uRight','uUp','uForward','uAspect','uTime','uInteraction','uPointer','uShadow'];
  const uniforms=new Map([grass,earth].map(p=>[p,Object.fromEntries(uniformNames.map(n=>[n,gl.getUniformLocation(p,n)]))]));
  let seed=531;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};
  const compact=innerWidth<701||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<5);
  const blades=compact?19000:34000,data=[];
  // 5.2 x 5.2 turf patch: over 1,200 individually shaded blades per square unit on desktop.
  for(let i=0;i<blades;i++){
    const x=(random()-.5)*5.16,z=(random()-.5)*5.16;
    const tuft=(Math.sin(x*8.)*Math.sin(z*9.)+1.)*.5;
    const h=.17+random()*.22+tuft*.07,w=.016+random()*.021,a=random()*Math.PI,s=random();
    for(let j=0;j<5;j++){
      const lo=j/5,hi=(j+1)/5,wl=Math.pow(1-lo,.8)*.5,wh=Math.pow(1-hi,.8)*.5;
      [[-wl,lo],[wl,lo],[-wh,hi],[-wh,hi],[wl,lo],[wh,hi]].forEach(([sx,sy])=>data.push(x,z,sx,sy,h,w,a,s));
    }
  }
  function makeBuffer(values){const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(values),gl.STATIC_DRAW);return b;}
  const grassCount=data.length/8,grassBuffer=makeBuffer(data);data.length=0;
  const solid=[];
  function face(a,b,c,d,n){[a,b,c,a,c,d].forEach(v=>solid.push(...v,...n));}
  face([-5,-1.88,-5],[-5,-1.88,5],[5,-1.88,5],[5,-1.88,-5],[0,1,0]);
  const r=2.6,b=-1.7,t=-.012;
  face([-r,t,-r],[-r,t,r],[r,t,r],[r,t,-r],[0,1,0]);
  face([-r,b,r],[r,b,r],[r,t,r],[-r,t,r],[0,0,1]);
  face([r,b,-r],[-r,b,-r],[-r,t,-r],[r,t,-r],[0,0,-1]);
  face([r,b,r],[r,b,-r],[r,t,-r],[r,t,r],[1,0,0]);
  face([-r,b,-r],[-r,b,r],[-r,t,r],[-r,t,-r],[-1,0,0]);
  face([-r,b,r],[-r,b,-r],[r,b,-r],[r,b,r],[0,-1,0]);
  const earthBuffer=makeBuffer(solid);
  let width=1,height=1,aspect=1,paused=preference.matches,time=0,last=0,lastDraw=0;
  let yaw=.69,pitch=.56,targetYaw=yaw,targetPitch=pitch,eye,right,up,forward;
  let pointer=[99,99],smoothPointer=[99,99],strength=0,targetStrength=0;
  const presets={perspective:[.69,.56],top:[.0,1.36],side:[.0,.19]};
  function camera(){
    const sy=Math.sin(yaw),cy=Math.cos(yaw),sp=Math.sin(pitch),cp=Math.cos(pitch),radius=10.5;
    eye=[sy*cp*radius,sp*radius-.55,cy*cp*radius];
    right=[cy,0,-sy];up=[-sy*sp,cp,-cy*sp];forward=[-sy*cp,-sp,-cy*cp];
  }
  function cameraUniforms(p){const u=uniforms.get(p);gl.uniform3fv(u.uEye,eye);gl.uniform3fv(u.uRight,right);gl.uniform3fv(u.uUp,up);gl.uniform3fv(u.uForward,forward);gl.uniform1f(u.uAspect,aspect);return u;}
  function attribute(p,name,size,stride,offset){const loc=gl.getAttribLocation(p,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,offset);}
  function draw(){
    if(lost)return;camera();gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    // Attribute arrays are rebound for each mesh; both materials use their own program.
    for(let i=0;i<3;i++)gl.disableVertexAttribArray(i);
    gl.useProgram(earth);const e=cameraUniforms(earth);gl.bindBuffer(gl.ARRAY_BUFFER,earthBuffer);
    attribute(earth,'aPosition',3,24,0);attribute(earth,'aNormal',3,24,12);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform1f(e.uShadow,1);gl.drawArrays(gl.TRIANGLES,0,6);gl.disable(gl.BLEND);
    gl.uniform1f(e.uShadow,0);gl.drawArrays(gl.TRIANGLES,6,36);
    for(let i=0;i<3;i++)gl.disableVertexAttribArray(i);
    gl.useProgram(grass);const g=cameraUniforms(grass);gl.bindBuffer(gl.ARRAY_BUFFER,grassBuffer);
    attribute(grass,'aRoot',2,32,0);attribute(grass,'aShape',2,32,8);attribute(grass,'aStyle',4,32,16);
    gl.uniform1f(g.uTime,time);gl.uniform1f(g.uInteraction,strength);gl.uniform2fv(g.uPointer,smoothPointer);
    gl.drawArrays(gl.TRIANGLES,0,grassCount);
  }
  function resize(){
    const rect=stage.getBoundingClientRect();width=Math.max(1,rect.width);height=Math.max(1,rect.height);aspect=width/height;
    const dpr=Math.min(devicePixelRatio||1,compact?1.6:2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    gl.viewport(0,0,canvas.width,canvas.height);draw();
  }
  function needsFrame(){return !paused||Math.abs(yaw-targetYaw)+Math.abs(pitch-targetPitch)>.0005;}
  function animate(stamp){
    frame=0;if(document.hidden||lost)return;
    if(stamp-lastDraw>32){
      const dt=Math.min((stamp-last)/1000,.06);if(!paused)time+=dt;
      const blend=preference.matches?1:.16;yaw+=(targetYaw-yaw)*blend;pitch+=(targetPitch-pitch)*blend;
      strength+=(targetStrength-strength)*.14;smoothPointer[0]+=(pointer[0]-smoothPointer[0])*.2;smoothPointer[1]+=(pointer[1]-smoothPointer[1])*.2;
      draw();lastDraw=stamp;last=stamp;
    }
    if(needsFrame())frame=requestAnimationFrame(animate);
  }
  function start(){if(!frame&&!document.hidden&&!lost){last=performance.now();frame=requestAnimationFrame(animate);}}
  function stop(){cancelAnimationFrame(frame);frame=0;}
  function buttonState(){toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'开启风动':'暂停风动';}
  views.forEach(button=>button.addEventListener('click',()=>{
    [targetYaw,targetPitch]=presets[button.dataset.view];
    // Choose the nearest equivalent orbit angle to avoid an unnecessary full spin.
    while(targetYaw-yaw>Math.PI)targetYaw-=Math.PI*2;while(targetYaw-yaw<-Math.PI)targetYaw+=Math.PI*2;
    views.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));targetStrength=0;start();
  }));
  let drag=null;
  function interact(event){
    const rect=canvas.getBoundingClientRect(),nx=((event.clientX-rect.left)/width*2-1)*aspect/2,ny=(1-(event.clientY-rect.top)/height*2)/2;
    const ray=forward.map((v,i)=>v+right[i]*nx+up[i]*ny);
    if(ray[1]>=-.01){targetStrength=0;return;}
    const t=-eye[1]/ray[1],next=[eye[0]+ray[0]*t,eye[2]+ray[2]*t];
    if(Math.abs(next[0])>2.8||Math.abs(next[1])>2.8){targetStrength=0;return;}
    if(pointer[0]===99)smoothPointer=next.slice();pointer=next;targetStrength=1;
  }
  canvas.addEventListener('pointerdown',event=>{drag={id:event.pointerId,x:event.clientX,y:event.clientY,yaw:targetYaw,pitch:targetPitch};canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{
    if(drag&&drag.id===event.pointerId){
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(Math.abs(dx)+Math.abs(dy)>3){targetYaw=drag.yaw-dx*.008;targetPitch=Math.max(.12,Math.min(1.43,drag.pitch+dy*.006));views.forEach(b=>b.setAttribute('aria-pressed','false'));targetStrength=0;start();}
    }else if(!paused)interact(event);
  },{passive:true});
  function release(event){if(drag&&drag.id===event.pointerId){drag=null;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);}targetStrength=0;}
  canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',()=>{drag=null;});
  canvas.addEventListener('pointerleave',()=>{targetStrength=0;});
  toggle.addEventListener('click',()=>{paused=!paused;buttonState();if(needsFrame())start();else stop();});
  const change=()=>{paused=preference.matches;buttonState();if(needsFrame())start();else stop();};
  if(preference.addEventListener)preference.addEventListener('change',change);else preference.addListener(change);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(needsFrame())start();});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;stop();fallback();});
  canvas.addEventListener('webglcontextrestored',()=>location.reload());
  gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
  document.body.classList.add('webgl-ready');toggle.hidden=false;buttonState();camera();
  new ResizeObserver(resize).observe(stage);resize();if(needsFrame())start();
})();
