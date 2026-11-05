(function(){
const W=12,D=10,H=4,EYE=1.6;
const canvas=document.getElementById('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputEncoding=THREE.sRGBEncoding;
const scene=new THREE.Scene();scene.background=new THREE.Color(0xeeeeee);
const cam=new THREE.PerspectiveCamera(70,1,0.1,50);cam.position.set(0,EYE,0);
scene.add(new THREE.HemisphereLight(0xffffff,0xd8d2c8,0.85));
const dl=new THREE.DirectionalLight(0xffffff,0.35);dl.position.set(2,6,3);scene.add(dl);

function rng(s){return()=>{s=(s*16807)%2147483647;return(s-1)/2147483646}}
function cvs(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t}
// 牆面材質（程式生成，無外部檔案）
const wallTex={
 white:cvs(256,256,(g,w,h)=>{g.fillStyle='#f4f3f0';g.fillRect(0,0,w,h)}),
 wood:cvs(256,256,(g,w,h)=>{const r=rng(7);for(let x=0;x<w;x+=32){const v=150+r()*30|0;g.fillStyle=`rgb(${v},${v*0.72|0},${v*0.5|0})`;g.fillRect(x,0,32,h);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x,0,1,h);for(let i=0;i<14;i++){g.fillStyle=`rgba(60,30,10,${r()*.15})`;g.fillRect(x+r()*32,0,1+r()*2,h)}}}),
 concrete:cvs(256,256,(g,w,h)=>{g.fillStyle='#a9a7a2';g.fillRect(0,0,w,h);const r=rng(3);for(let i=0;i<5000;i++){const v=140+r()*60|0;g.fillStyle=`rgba(${v},${v},${v-4},.35)`;g.fillRect(r()*w,r()*h,2,2)}g.strokeStyle='rgba(0,0,0,.12)';g.strokeRect(0,0,w,h);for(const[a,b]of[[40,40],[216,40],[40,216],[216,216]]){g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.arc(a,b,4,0,7);g.fill()}})
};
for(const k in wallTex){wallTex[k].wrapS=wallTex[k].wrapT=THREE.RepeatWrapping;wallTex[k].repeat.set(k==='concrete'?4:6,k==='concrete'?1.4:1)}
const wallMat=new THREE.MeshStandardMaterial({map:wallTex.white,roughness:.95});
const floorTex=cvs(256,256,(g,w,h)=>{g.fillStyle='#d9d4cc';g.fillRect(0,0,w,h);g.fillStyle='rgba(0,0,0,.06)';for(let y=0;y<h;y+=64)g.fillRect(0,y,w,1)});
floorTex.wrapS=floorTex.wrapT=THREE.RepeatWrapping;floorTex.repeat.set(4,4);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshStandardMaterial({map:floorTex,roughness:.6}));floor.rotation.x=-Math.PI/2;scene.add(floor);
const ceil=new THREE.Mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshBasicMaterial({color:0xfafafa}));ceil.rotation.x=Math.PI/2;ceil.position.y=H;scene.add(ceil);
// 4 walls: [width, position, rotY]
const walls=[[W,[0,H/2,-D/2],0],[W,[0,H/2,D/2],Math.PI],[D,[-W/2,H/2,0],Math.PI/2],[D,[W/2,H/2,0],-Math.PI/2]];
walls.forEach(([w,p,r])=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,H),wallMat);m.position.set(...p);m.rotation.y=r;scene.add(m)});
// 踢腳線
const base=new THREE.MeshStandardMaterial({color:0x222222});
walls.forEach(([w,p,r])=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,.08,.02),base);m.position.set(p[0],.04,p[2]);m.rotation.y=r;m.translateZ(.01);scene.add(m)});

// 示範作品圖：程式生成抽象畫
function artTex(a){const s=512,asp=a.w/a.h,cw=asp>=1?s:s*asp|0,ch=asp>=1?s/asp|0:s;
 return cvs(cw,ch,(g,w,h)=>{const r=rng(a.seed*999);const pals=[["#e8e2d6","#c4553b","#2d3a4a","#d9a441"],["#1f2f3a","#5c8a99","#d8e2e0","#e3b26b"],["#f1ece4","#111","#888","#b23a2e"],["#dfe6e2","#6b7f75","#2f3b35","#cfc2a8"]];const p=pals[a.seed%4];
 g.fillStyle=p[0];g.fillRect(0,0,w,h);const n=6+r()*10|0;for(let i=0;i<n;i++){g.fillStyle=p[1+(r()*3|0)];g.globalAlpha=.5+r()*.5;const t=r();g.beginPath();if(t<.4)g.arc(r()*w,r()*h,20+r()*w*.3,0,7);else if(t<.8)g.rect(r()*w,r()*h,r()*w*.6,r()*h*.5);else{g.moveTo(r()*w,r()*h);g.lineTo(r()*w,r()*h);g.lineTo(r()*w,r()*h)}g.fill()}g.globalAlpha=1;})}
const items=[],frameMat=new THREE.MeshStandardMaterial({color:0x1b1b1b,roughness:.5});
const loader=new THREE.TextureLoader();
// 分配：前牆3、右牆2、後牆3、左牆2
const slots=[];const put=(wi,n)=>{const [w]=walls[wi];for(let i=0;i<n;i++)slots.push([wi,-w/2+w*(i+1)/(n+1)])};put(0,3);put(3,2);put(1,3);put(2,2);
ARTWORKS.slice(0,slots.length).forEach((a,i)=>{const[wi,off]=slots[i],[,p,r]=walls[wi];
 const g=new THREE.Group();g.position.set(p[0],EYE,p[2]);g.rotation.y=r;g.translateX(off);g.translateZ(.03);
 const fr=new THREE.Mesh(new THREE.BoxGeometry(a.w+.08,a.h+.08,.04),frameMat);g.add(fr);
 const mat=new THREE.MeshBasicMaterial({map:artTex(a)});
 if(a.img)loader.load(a.img,t=>{t.encoding=THREE.sRGBEncoding;mat.map=t;mat.needsUpdate=true});
 const pic=new THREE.Mesh(new THREE.PlaneGeometry(a.w,a.h),mat);pic.position.z=.021;g.add(pic);
 fr.userData.i=pic.userData.i=i;scene.add(g);items.push(fr,pic);
 a._yaw=Math.atan2(-(g.position.x),-(g.position.z));a._dist=Math.hypot(g.position.x,g.position.z);
});

// 控制：拖曳旋轉 yaw/pitch、雙指/滾輪縮放 FOV、點擊選取
let yaw=0,pitch=0,fov=70,tYaw=0,tPitch=0,tFov=70;
const pts=new Map();let moved=0,pinch0=0,fov0=70;
canvas.addEventListener('pointerdown',e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);moved=0;if(pts.size===2){const[a,b]=[...pts.values()];pinch0=Math.hypot(a[0]-b[0],a[1]-b[1]);fov0=tFov}});
canvas.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;const[px,py]=pts.get(e.pointerId);const dx=e.clientX-px,dy=e.clientY-py;pts.set(e.pointerId,[e.clientX,e.clientY]);moved+=Math.abs(dx)+Math.abs(dy);
 if(pts.size===1){tYaw+=dx*.005*(tFov/70);tPitch=Math.max(-.4,Math.min(.4,tPitch+dy*.003))}else if(pts.size===2){const[a,b]=[...pts.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);tFov=Math.max(30,Math.min(80,fov0*pinch0/d))}hideHint()});
const up=e=>{if(pts.size===1&&moved<8)pick(e);pts.delete(e.pointerId)};
canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',e=>pts.delete(e.pointerId));
canvas.addEventListener('wheel',e=>{tFov=Math.max(30,Math.min(80,tFov+e.deltaY*.03));e.preventDefault()},{passive:false});
const ray=new THREE.Raycaster(),v2=new THREE.Vector2();
function pick(e){v2.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(v2,cam);const h=ray.intersectObjects(items)[0];h?show(h.object.userData.i):hide()}
const card=document.getElementById('card');
function show(i){const a=ARTWORKS[i];document.getElementById('ct').textContent=a.title;document.getElementById('ca').textContent=a.artist;
 document.getElementById('cm').innerHTML=`${a.medium}<br>${a.size}・${a.year}<br><span style="color:#aaa">示範素材</span>`;
 document.getElementById('cta').href=`mailto:${INQUIRY_EMAIL}?subject=${encodeURIComponent('作品詢價：'+a.title)}`;
 card.classList.add('show');let d=a._yaw-tYaw;d=Math.atan2(Math.sin(d),Math.cos(d));tYaw+=d;tPitch=-.05;tFov=Math.max(30,Math.min(70,2*Math.atan((a.h*1.9)/(2*a._dist))*180/Math.PI));hideHint()}
function hide(){card.classList.remove('show');tFov=70}
document.getElementById('x').onclick=hide;
document.querySelectorAll('.mats button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.mats button').forEach(x=>x.classList.remove('on'));b.classList.add('on');wallMat.map=wallTex[b.dataset.m];wallMat.needsUpdate=true});
let hinted=0;function hideHint(){if(!hinted){hinted=1;document.getElementById('hint').style.opacity=0}}
function resize(){renderer.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',resize);resize();
let idle=0;(function loop(){requestAnimationFrame(loop);yaw+=(tYaw-yaw)*.1;pitch+=(tPitch-pitch)*.1;fov+=(tFov-fov)*.1;
 cam.fov=fov;cam.updateProjectionMatrix();cam.rotation.set(0,0,0);cam.rotateY(yaw);cam.rotateX(pitch);renderer.render(scene,cam)})();
window.__demo={show,setMat:m=>document.querySelector(`[data-m=${m}]`).click()};
const q=new URLSearchParams(location.hash.slice(1));if(q.get("mat"))__demo.setMat(q.get("mat"));if(q.get("art"))setTimeout(()=>__demo.show(+q.get("art")),50);if(q.get("yaw"))tYaw=yaw=+q.get("yaw");
})();
