import{t as e}from"./plane-africa-state-DLv8TrHS.js";import{$n as t,A as n,Ar as r,Bt as i,Cr as a,F as o,Fr as s,G as c,I as l,K as u,Kn as d,Kt as f,Lt as p,M as m,Mt as h,N as g,Nt as _,Pt as v,Qn as y,R as b,S as x,Wn as S,Wt as C,X as w,Xn as T,Xt as E,Z as D,b as O,bt as k,cn as A,it as j,jr as M,jt as N,kr as P,kt as F,lr as I,m as L,n as R,nn as z,nt as ee,p as B,pr as V,r as H,sn as U,t as W,tt as te,xr as ne}from"./resources-DxOJZy_3.js";import{a as re,o as ie}from"./BufferGeometryUtils-Bd2IG5PO.js";import{A as ae,a as oe,c as se,i as ce,l as le,n as ue,o as de,r as fe,s as pe,t as me}from"./renderer-G3SwxwRi.js";var he=6371e3,ge=1800,_e=1.8;function ve(e){return e+Math.max(0,e-ge)*.8}function ye(e,t){return he-Math.sqrt(Math.max(0,he**2-e**2-t**2))}function be(e){let t=ye(e.x,e.z);return e.y=ve(e.y+t)-t,e}var xe=e=>`/thesis-defence/world/plane-africa/terrain/${e}`;async function Se(e,t){let n=await fetch(e,{signal:t});if(!n.ok)throw Error(`Flight landscape ${e}: ${n.status}`);let r=await n.arrayBuffer(),i=new Uint8Array(r,0,Math.min(2,r.byteLength));if(i[0]!==31||i[1]!==139)return r;let a=new Blob([r]).stream().pipeThrough(new DecompressionStream(`gzip`));return new Response(a).arrayBuffer()}function Ce(e){let t=new DataView(e);if(t.getUint32(0,!0)!==825250886)throw Error(`Unsupported flight terrain geometry`);let n=t.getUint32(4,!0),i=t.getUint32(8,!0),a=16+n*12,o=a+n*8;if(e.byteLength!==o+i*4)throw Error(`Truncated flight terrain geometry`);let s=new L;s.setAttribute(`position`,new B(new Float32Array(e,16,n*3),3)),s.setAttribute(`uv`,new B(new Float32Array(e,a,n*2),2)),s.setIndex(new B(new Uint32Array(e,o,i),1));let c=new r,l=s.attributes.position;for(let e=0;e<l.count;e++)be(c.fromBufferAttribute(l,e)),l.setY(e,c.y);return s.computeBoundingBox(),s.computeBoundingSphere(),s}function we(e,n,r){return new t({defines:r?{CORRIDOR_MAP:1}:{},uniforms:{surfaceMap:{value:e},landscapeTime:n,cloudShadowStrength:{value:.13},...r?{corridorMap:{value:r.map},corridorBounds:{value:new M(...r.boundsEastNorthMetres)},corridorBlendMetres:{value:r.edgeBlendMetres}}:{}},toneMapped:!1,fog:!1,vertexShader:`varying vec2 surfaceUv;
      varying vec3 terrainPosition;
      varying float terrainDistance;
      void main() {
        surfaceUv=uv; terrainPosition=position;
        vec4 view=modelViewMatrix*vec4(position,1.);
        terrainDistance=length(view.xyz);
        gl_Position=projectionMatrix*view;
      }`,fragmentShader:`uniform sampler2D surfaceMap;
      #ifdef CORRIDOR_MAP
        uniform sampler2D corridorMap;
        uniform vec4 corridorBounds;
        uniform float corridorBlendMetres;
      #endif
      uniform float landscapeTime,cloudShadowStrength;
      varying vec2 surfaceUv;
      varying vec3 terrainPosition;
      varying float terrainDistance;
      float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float noise(vec2 p) {
        vec2 cell=floor(p),f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(hash(cell),hash(cell+vec2(1.,0.)),f.x),
          mix(hash(cell+vec2(0.,1.)),hash(cell+vec2(1.)),f.x),f.y);
      }
      void main() {
        float plains=1.-smoothstep(2300.,4100.,terrainPosition.y);
        vec3 colour=texture2D(surfaceMap,surfaceUv,plains*4.5).rgb;
        #ifdef CORRIDOR_MAP
          vec2 ground=vec2(terrainPosition.x,-terrainPosition.z);
          vec2 detailUv=(ground-corridorBounds.xy)/(corridorBounds.zw-corridorBounds.xy);
          vec2 edge=min(ground-corridorBounds.xy,corridorBounds.zw-ground);
          float weight=smoothstep(0.,corridorBlendMetres,min(edge.x,edge.y));
          vec4 detailColour=texture2D(corridorMap,clamp(detailUv,vec2(0.),vec2(1.)),plains*4.5);
          colour=mix(colour,detailColour.rgb,weight*detailColour.a);
        #endif
        float evening=max(0.,landscapeTime)/(max(0.,landscapeTime)+180.);
        // Warm skylight lifts occluded forest without bleaching the measured surface colour.
        float luminance=dot(colour,vec3(.2126,.7152,.0722));
        float shaded=1.-smoothstep(.08,.38,luminance);
        vec3 warmFill=sqrt(max(colour,vec3(0.)))*vec3(1.055,1.015,.965);
        colour=mix(colour,warmFill,shaded*.38);
        colour=mix(colour,vec3(.68,.48,.35),shaded*.055);
        vec2 wind=vec2(3.2,-1.1)*landscapeTime;
        vec2 groundPosition=terrainPosition.xz-wind;
        vec2 shadowAxis=normalize(vec2(.70,.71));
        vec2 p=vec2(dot(groundPosition,shadowAxis)/(1.+evening*.14),
          dot(groundPosition,vec2(-shadowAxis.y,shadowAxis.x)))*.00018;
        float cover=noise(p)*.68+noise(p*2.07+vec2(8.4,2.7))*.32;
        float shadow=smoothstep(.46,.76,cover)*cloudShadowStrength;
        colour*=1.-shadow;
        // The fixed terrain bake retains its shadows; only the last light's tint evolves.
        colour*=mix(vec3(1.),vec3(1.025,.992,.965),evening);
        float air=1.-exp(-max(0.,terrainDistance-9000.)*.000004);
        // Warm atmospheric fill keeps the distant plains calm without veiling the summit's ice.
        float quietGround=plains*(.86+.06*smoothstep(8000.,30000.,terrainDistance));
        float value=dot(colour,vec3(.2126,.7152,.0722));
        colour=mix(colour,vec3(value)*vec3(1.12,.98,.88),quietGround*.45);
        vec3 distantPlain=vec3(.84,.63,.49)*(1.-shadow*.45);
        colour=mix(colour,distantPlain,quietGround);
        colour=mix(colour,vec3(1.,.82,.69),air);
        gl_FragColor=vec4(colour,1.);
      }`})}async function Te({texture:e,scheduler:t,signal:n}){let i=new w;i.name=`Measured Kilimanjaro terrain`;let a={value:0},o=await fetch(xe(`metadata.json`),{signal:n});if(!o.ok)throw Error(`Flight landscape metadata: ${o.status}`);let s=await o.json(),c=new Float32Array(await Se(xe(s.heightQuery.file),n)),l=[];try{let o=s.foregroundDetail,u=o?{...o,map:await e(`terrain/${o.texture}`,!1)}:null;for(let[r,o]of Object.entries(s.meshes)){let s=await Se(xe(o.geometry),n),c=await e(`terrain/${o.texture}`,!1),d=()=>{if(n?.aborted)throw new DOMException(`Flight landscape cancelled`,`AbortError`);let e=Ce(s),t=we(c,a,u?.meshes.includes(r)?u:null);l.push(t);let o=new h(e,t);o.name=`Measured ${r} terrain`,i.add(o)};t?await t.run(`Build ${r} flight terrain`,d):d()}let d=Object.fromEntries(Object.entries(s.anchors).map(([e,t])=>[e,be(new r(...t))]));function f(e,t){let n=s.heightQuery,[r,i,a,o]=n.boundsEastNorthMetres,l=F.clamp((e-r)/(a-r)*(n.width-1),0,n.width-1),u=F.clamp((o-t)/(o-i)*(n.height-1),0,n.height-1),d=Math.min(Math.floor(l),n.width-2),f=Math.min(Math.floor(u),n.height-2),p=l-d,m=u-f,h=f*n.width+d;return ve(F.lerp(F.lerp(c[h],c[h+1],p),F.lerp(c[h+n.width],c[h+n.width+1],p),m))-ye(e,-t)}return i.userData.landscape={triangles:s.totalTriangles,textureBytes:s.estimatedTextureRgbaMipmappedBytes,prototype:s.prototype,displayReliefScale:_e,displayReliefBaseMetres:1800},{object:i,metadata:s,anchors:d,heightAt:f,update(e){a.value=e},setCloudShadowStrength(e){l.forEach(t=>{t.uniforms.cloudShadowStrength.value=e})}}}catch(e){throw i.traverse(e=>e.geometry?.dispose()),l.forEach(e=>e.dispose()),i.clear(),e}}function Ee(){let e=new Uint8Array(64**3),t=[],r=4988721,i=()=>(r=Math.imul(r,1664525)+1013904223>>>0,r/4294967296);for(let e of[8,16,32,64])t.push({knots:e,values:Float32Array.from({length:e**3},i)});let a=[.52,.27,.14,.07],o=e=>e*e*(3-2*e);for(let n=0;n<64;n++)for(let r=0;r<64;r++)for(let i=0;i<64;i++){let s=0;for(let e=0;e<t.length;e++){let{knots:c,values:l}=t[e],u=i/64*c,d=r/64*c,f=n/64*c,p=Math.floor(u),m=Math.floor(d),h=Math.floor(f),g=o(u-p),_=o(d-m),v=o(f-h),y=0;for(let e=0;e<2;e++)for(let t=0;t<2;t++)for(let n=0;n<2;n++)y+=l[((h+e)%c*c+(m+t)%c)*c+(p+n)%c]*(n?g:1-g)*(t?_:1-_)*(e?v:1-v);s+=y*a[e]}e[(n*64+r)*64+i]=Math.round(s*255)}let s=new n(e,64,64,64);return s.format=S,s.type=ne,s.minFilter=s.magFilter=k,s.wrapS=s.wrapT=s.wrapR=d,s.unpackAlignment=1,s.generateMipmaps=!1,s.needsUpdate=!0,s.name=`Seeded four-octave scalar cloud density noise`,s}var De=`
attribute vec3 cloudCentre;
attribute vec4 cloudShape, cloudDetail, cloudVolume, cloudSeed;
varying vec3 centreInView;
varying vec2 planeOffset;
varying mat3 viewToUnit;
varying vec4 seedAndKind;
varying float puffOpacity, highCloud;
void main(){
  vec4 centre=modelViewMatrix*vec4(cloudCentre,1.);
  float objectScale=length(modelMatrix[0].xyz);
  vec2 base=(uv-.5)*cloudShape.xy*objectScale;
  planeOffset=vec2(base.x+cloudDetail.z*base.y,base.y+cloudDetail.x*base.x);
  float c=cos(cloudVolume.w),s=sin(cloudVolume.w);
  mat3 axes=mat3(vec3(c,0.,s)*cloudVolume.x,vec3(0.,cloudVolume.y,0.),vec3(-s,0.,c)*cloudVolume.z);
  viewToUnit=inverse(mat3(modelViewMatrix)*axes);
  centreInView=centre.xyz; seedAndKind=cloudSeed;
  puffOpacity=cloudShape.w*smoothstep(90.,650.,-centre.z);
  highCloud=cloudDetail.w;
  gl_Position=projectionMatrix*(centre+vec4(planeOffset,0.,0.));
}`,Oe=`
uniform sampler3D densityNoise;
uniform sampler2D contactMap;
uniform sampler2D sceneDepth;
uniform vec2 cloudRenderSize;
uniform float sceneDepthEnabled;
uniform vec3 sunInView,upInView;
uniform mat4 projectionMatrix,viewToLandscape;
uniform vec4 contactBounds;
uniform float evolutionTime,lowCloudCeiling;
varying vec3 centreInView;
varying vec2 planeOffset;
varying mat3 viewToUnit;
varying vec4 seedAndKind;
varying float puffOpacity,highCloud;
float field(vec3 p){
  float support=1.-dot(p,p);
  if(support<=0.)return 0.;
  vec3 seed=seedAndKind.xyz;
  float kind=seedAndKind.w;
  vec3 drift=vec3(evolutionTime*.0009,0.,evolutionTime*.0005);
  vec3 q=p;
  q.x+=.13*sin(p.z*3.+seed.x*21.);
  if(highCloud>.5)q*=vec3(.22,1.8,2.2);
  float coarse=texture(densityNoise,q*.24+seed+drift).r;
  float detail=texture(densityNoise,q*.74+seed.zxy+coarse*.12+drift*.35).r;
  float fbm=coarse*.72+detail*.28;
  if(highCloud>.5){
    float edgeThreshold=.42+.18*pow(clamp(1.-support,0.,1.),2.);
    return smoothstep(0.,.04,support)*smoothstep(edgeThreshold,edgeThreshold+.18,fbm)*.65;
  }
  // A broad condensation base supports unequal rising lobes. Their density is
  // three-dimensional, so the towers keep their depth through the camera arc.
  vec3 basePoint=p*vec3(1.12,1.85,1.12)+vec3(0.,.53,0.);
  float body=1.-dot(basePoint,basePoint);
  vec3 crown=p-vec3((fract(seed.x*9.)-.5)*.28,.22,(fract(seed.z*7.)-.5)*.25);
  float shape=max(body,(.61-dot(crown,crown))*1.65);
  vec3 left=p-vec3(-.35,.06+fract(seed.y*13.)*.19,.14);
  vec3 right=p-vec3(.32,.08+fract(seed.z*11.)*.23,-.17);
  shape=max(shape,(.32-dot(left,left))*2.1);
  shape=max(shape,(.29-dot(right,right))*2.2);
  vec3 shoulder=p-vec3(.08,.42+fract(seed.x*17.)*.12,.36);
  shape=max(shape,(.19-dot(shoulder,shoulder))*2.2);
  // Density varies throughout the body, not only in its last opaque shell.
  // Uneven cores admit light into the folds between rising billows.
  float erosion=(coarse-.5)*2.75+(detail-.5)*.95;
  float density=smoothstep(.14,.68,shape*.62+erosion);
  density*=.7+.3*smoothstep(.32,.68,fbm);
  // Deep interiors stay coherent when erosion opens the outer folds. This is
  // weaker than an opaque core, so internal light and density still vary.
  float core=smoothstep(.36,.82,shape)*(.24+.10*coarse);
  density=max(density,core);
  float base=smoothstep(-.77,-.57,p.y+(coarse-.5)*.13);
  return density*smoothstep(0.,.035,support)*base;

}
void main(){
  if(puffOpacity<.004)discard;
  vec3 ray=normalize(centreInView+vec3(planeOffset,0.));
  vec3 origin=viewToUnit*(-centreInView),direction=viewToUnit*ray;
  float a=dot(direction,direction),b=dot(origin,direction),c=dot(origin,origin)-1.;
  float discriminant=b*b-a*c;
  if(discriminant<=0.)discard;
  float nearT=max(0.,(-b-sqrt(discriminant))/a),farT=(-b+sqrt(discriminant))/a;
  if(sceneDepthEnabled>.5){
    float depth=texture2D(sceneDepth,gl_FragCoord.xy/cloudRenderSize).r;
    float surfaceZ=-projectionMatrix[3][2]/(depth*2.-1.+projectionMatrix[2][2]);
    farT=min(farT,surfaceZ/ray.z);
  }
  if(farT<=nearT)discard;
  vec3 lightDirection=normalize(viewToUnit*sunInView);
  float forward=pow(max(0.,dot(ray,sunInView)),6.);
  float depth=-centreInView.z;
  float steps=highCloud>.5?8.:(depth>65000.?4.:(depth>24000.?8.:10.));
  // Distant banks and thin cirrus cannot resolve a second shadow probe. Keep
  // both probes on nearby cumulus, where their folds carry the sense of volume.
  bool fullShadow=highCloud<.5&&depth<24000.;
  float stride=(farT-nearT)/steps;
  float jitter=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453);
  vec3 colour=vec3(0.);float transmission=1.,firstT=farT;
  vec3 landscapeRay=(viewToLandscape*vec4(ray,0.)).xyz;
  float cameraAltitude=viewToLandscape[3].y;
  // Altitude is affine along the ray. Reject a segment that cannot contain any
  // density below the inversion before evaluating the noise volume.
  if(highCloud<.5&&min(cameraAltitude+landscapeRay.y*nearT,
    cameraAltitude+landscapeRay.y*farT)>=lowCloudCeiling)discard;
  float opticalStep=length(direction)*stride;
  for(int i=0;i<10;i++){
    if(float(i)>=steps||transmission<.015)break;
    float t=nearT+(float(i)+.46+jitter*.08)*stride;
    float ceiling=highCloud>.5?1.:1.-smoothstep(lowCloudCeiling-90.,lowCloudCeiling,cameraAltitude+landscapeRay.y*t);
    if(ceiling<=0.)continue;
    vec3 p=origin+direction*t;
    float density=field(p)*puffOpacity*ceiling;
    if(density>.015){
      firstT=min(firstT,t);
      // Optical depth towards the low sun gives the towers a shaded body.
      // The broad sky fill is cooler underneath, without an additive bright rim.
      float nearDensity=field(p+lightDirection*.21)*puffOpacity;
      float farDensity=fullShadow?field(p+lightDirection*.59)*puffOpacity:nearDensity*.55;
      float sun=exp(-(nearDensity*1.25+farDensity*.85));
      float top=smoothstep(-.65,.75,p.y);
      float localFacing=clamp(.48+(density-nearDensity)*2.1,0.,1.);
      float illumination=clamp(.18+sun*.28+localFacing*.42+top*.12,0.,1.);
      vec3 shadeColour=mix(vec3(.48,.40,.45),vec3(.72,.51,.49),top);
      vec3 radiance=mix(shadeColour,vec3(1.,.81,.63),illumination);
      radiance+=vec3(1.,.71,.42)*sun*forward*.02;
      // Thin high ice fibres retain the low sun's peach light through their
      // depth; the dense cumulus base's cool fill does not belong in them.
      if(highCloud>.5)radiance=mix(vec3(.91,.56,.48),vec3(1.,.82,.64),sun*.7+top*.3);
      float alpha=1.-exp(-density*opticalStep*7.);
      colour+=radiance*alpha*transmission;
      transmission*=1.-alpha;
    }
  }
  float alpha=1.-transmission;
  if(alpha<.005)discard;
  colour/=max(1.-transmission,.001);
  vec3 surface=ray*firstT;
  if(highCloud<.5){
    vec3 terrainPoint=(viewToLandscape*vec4(surface,1.)).xyz;
    vec2 groundUv=(terrainPoint.xz-contactBounds.xy)/(contactBounds.zw-contactBounds.xy);
    if(all(greaterThanEqual(groundUv,vec2(0.)))&&all(lessThanEqual(groundUv,vec2(1.)))){
      float ground=texture2D(contactMap,groundUv).r;
      alpha*=smoothstep(18.,150.,terrainPoint.y-ground);
    }
    alpha*=1.-smoothstep(lowCloudCeiling-40.,lowCloudCeiling,terrainPoint.y);
  }
  if(alpha<.005)discard;
  float haze=1.-exp(-length(centreInView)*.000018);
  colour=mix(colour,vec3(1.,.79,.66),haze*.22);
  vec4 projected=projectionMatrix*vec4(surface,1.);
  gl_FragDepth=clamp(projected.z/projected.w*.5+.5,0.,1.);
  gl_FragColor=vec4(colour,alpha);
}`,ke=38e3,Ae=23e4,je=[26e3,35e3],Me=[205e3,225e3],Ne=[22e3,36e3],Pe=(e,t,n)=>{let r=Math.max(0,Math.min(1,(e-t)/(n-t)));return r*r*(3-2*r)},Fe=e=>{let t=Math.imul(e^e>>>16,2246822507);return t=Math.imul(t^t>>>13,3266489909),((t^t>>>16)>>>0)/4294967296};function Ie(e,t,n){let r=e.filter(e=>e.kind===t),i=Math.ceil(Math.sqrt(r.length)),a=Math.ceil(r.length/i),o=2*n/i,s=2*n/a;for(let e=0;e<r.length;e++){let t=r[e],a=e%i,c=Math.floor(e/i);t.x=-n+(a+.5+(Fe(t.clusterId*13+81)-.5)*.78)*o,t.z=-n+(c+.5+(Fe(t.clusterId*23+191)-.5)*.78)*s;let l=t.x*t.x+t.z*t.z,u=6371e3-Math.sqrt(Math.max(0,6371e3**2-l));t.y=t.nominalAltitude-u,t.current.set(t.x,t.y,t.z),t.blendDepth=-(t.x*8+t.z*28)}}function Le(e,t,n,r,i,a={}){let o=e.high||e.kind===`far`,s=o?Ae:ke,c=s*2,l=e.x+t,u=e.z+n,d=Math.floor((l-r+s)/c),f=Math.floor((u-i+s)/c);a.x=l-d*c,a.z=u-f*c,a.distance=Math.hypot(a.x-r,a.z-i);let p=o?Me:je;return a.visibility=1-Pe(a.distance,p[0],p[1]),e.kind===`far`&&(a.visibility*=Pe(a.distance,Ne[0],Ne[1])),a.cellEast=d,a.cellSouth=f,a.generation=d===0&&f===0?0:Math.imul(d,73856093)^Math.imul(f,19349663)|0,a}function Re({responseSeconds:e=.22}={}){let t=new N,n=new N,r=new N,i={east:0,south:0,velocityEast:-5,velocitySouth:-3,sampleCount:0,meanScreenX:0,meanScreenY:0,minimumNoseToTail:0,desiredEast:-5,desiredSouth:-3,axis:[-1,0]},a=!1,o=0,s=0;function c(e=[]){a=!1,i.east=i.south=i.sampleCount=i.meanScreenX=i.meanScreenY=0,i.velocityEast=i.desiredEast=-5,i.velocitySouth=i.desiredSouth=-3;for(let t of e)t.flowEast=t.flowSouth=0,t.velocityEast=-5,t.velocitySouth=-3;return i}function l(c,l,u,d,f=!1,p=[-1,0],m=[500,0]){if(!l||!u||!Number.isFinite(c)||c<0)return i;t.multiplyMatrices(l.matrixWorldInverse,u);let h=l.projectionMatrix.elements[0]*640,g=l.projectionMatrix.elements[5]*360;a||=(n.copy(l.matrixWorldInverse),o=h,s=g,!0),r.multiplyMatrices(n,u);let _=t.elements,v=r.elements,y=Math.hypot(...p)||1,b=p[0]/y,x=p[1]/y;i.axis[0]=b,i.axis[1]=x;let S=0,C=0,w=0,T=1/0,E=0,D=0,O=0,k=Math.exp(-c/e);for(let e of d){e.flowEast??=0,e.flowSouth??=0;let t=e.high?.2:e.kind===`far`?3:1,n=m[0]*t,r=m[1]*t,i=Math.exp(-c/1.5),a=n+((e.velocityEast??n)-n)*i,l=r+((e.velocitySouth??r)-r)*i,{x:u,y:d,z:p}=e.current,y=_[0]*u+_[4]*d+_[8]*p+_[12],A=_[1]*u+_[5]*d+_[9]*p+_[13],j=-(_[2]*u+_[6]*d+_[10]*p+_[14]),M=640+h*y/j,N=360-g*A/j,P=-(v[2]*u+v[6]*d+v[10]*p+v[14]);if(j>400&&j<24e4&&P>100&&M>-240&&M<1520&&N>-240&&N<960){let t=v[0]*u+v[4]*d+v[8]*p+v[12],n=v[1]*u+v[5]*d+v[9]*p+v[13],r=c>0?(h*y/j-o*t/P)/c:0,i=c>0?(-g*A/j+s*n/P)/c:0,f=1/(j*j),m=h*(_[0]*j+y*_[2])*f,E=h*(_[8]*j+y*_[10])*f,D=-g*(_[1]*j+A*_[2])*f,O=-g*(_[9]*j+A*_[10])*f,I=m*b+D*x,L=E*b+O*x,R=I*I+L*L,z=r*b+i*x,ee=1-F.smoothstep(j,1800,14e3),B=1-F.smoothstep(j,18e3,65e3),V=e.high?8:8+B*57+ee*150;if(R>1e-12){let e=V-z-I*a-L*l;a+=I*e/R*(1-k),l+=L*e/R*(1-k);let t=V*.65-z-I*a-L*l;t>0&&(a+=I*t/R,l+=L*t/R)}if(c>0)for(let e=0;e<4;e++){let e=u+a*c,r=p+l*c,i=6371e3,f=Math.sqrt(Math.max(1,i*i-u*u-p*p)),m=Math.sqrt(Math.max(1,i*i-e*e-r*r)),v=d+m-f,y=_[0]*e+_[4]*v+_[8]*r+_[12],S=_[1]*e+_[5]*v+_[9]*r+_[13],C=-(_[2]*e+_[6]*v+_[10]*r+_[14]);if(C<100)break;let w=((h*y/C-o*t/P)*b+(-g*S/C+s*n/P)*x)/c,T=V*.65+1-w;if(T<=0)break;let E=-e/m,D=-r/m,O=(e,t,n)=>(h*(e*C+y*n)*b-g*(t*C+S*n)*x)/(C*C),k=O(_[0]+_[4]*E,_[1]+_[5]*E,_[2]+_[6]*E),A=O(_[8]+_[4]*D,_[9]+_[5]*D,_[10]+_[6]*D),j=k*k+A*A;if(j<1e-14)break;a+=k*T/j,l+=A*T/j}let H=Math.hypot(a,l);if(H>2e5&&(a*=2e5/H,l*=2e5/H),e.visibility>.05&&M>0&&M<1280&&N>0&&N<720){let e=r+m*a+E*l,t=i+D*a+O*l;C+=e,w+=t,T=Math.min(T,e*b+t*x),S++}}else{let e=1-Math.exp(-c/2);a+=(n-a)*e,l+=(r-l)*e}!f&&c>0&&(e.flowEast+=a*c,e.flowSouth+=l*c,e.velocityEast=a,e.velocitySouth=l),E+=a,D+=l,O++}return i.sampleCount=S,i.meanScreenX=S?C/S:0,i.meanScreenY=S?w/S:0,i.minimumNoseToTail=S?T:0,i.velocityEast=i.desiredEast=E/Math.max(1,O),i.velocitySouth=i.desiredSouth=D/Math.max(1,O),!f&&c>0&&(i.east+=i.velocityEast*c,i.south+=i.velocitySouth*c),n.copy(l.matrixWorldInverse),o=h,s=g,i}return{state:i,reset:c,update:l}}var G=new r(-.40551699,.06060188,-.91207641).normalize();`${G.toArray().map(e=>e.toFixed(8)).join(`,`)}`;function ze(){let e={value:G.clone()},t={value:0};return{sun:e,progress:t,update(n){t.value=1-Math.exp(-Math.max(0,n)/300),e.value.copy(G),e.value.y-=.027*t.value,e.value.normalize()}}}function Be(e,t=1,n){e.onBeforeCompile=e=>{e.uniforms.flightSunDirection=n?.sun??{value:G},e.uniforms.flightEveningProgress=n?.progress??{value:0},e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
uniform vec3 flightSunDirection; uniform float flightEveningProgress;`),e.fragmentShader=e.fragmentShader.replace(`#include <lights_fragment_begin>`,`
      vec3 geometryPosition = -vViewPosition;
      vec3 geometryNormal = normal;
      vec3 geometryViewDir = isOrthographic ? vec3(0.,0.,1.) : normalize(vViewPosition);
      vec3 geometryClearcoatNormal = vec3(0.);
      #ifdef USE_CLEARCOAT
        geometryClearcoatNormal = clearcoatNormal;
      #endif
      vec3 eveningNormal = inverseTransformDirection(normal, viewMatrix);
      IncidentLight eveningKey;
      eveningKey.direction = normalize((viewMatrix * vec4(flightSunDirection,0.)).xyz);
      eveningKey.color = vec3(10.1,6.55,3.7) * ${t.toFixed(3)};
      eveningKey.color *= mix(vec3(1.),vec3(1.02,.95,.90),flightEveningProgress);
      eveningKey.visible = true;
      RE_Direct(eveningKey, geometryPosition, geometryNormal, geometryViewDir,
        geometryClearcoatNormal, material, reflectedLight);
      float skyHemisphere = smoothstep(-.45,.62,eveningNormal.y);
      vec3 irradiance = mix(vec3(.55,.375,.39),vec3(2.55,1.83,1.47),skyHemisphere);
      irradiance += vec3(.22,.13,.085) * max(0.,dot(eveningNormal,normalize(vec3(-.25,.6,1.))));
      irradiance *= ${t.toFixed(3)};
      vec3 radiance = vec3(0.), iblIrradiance = vec3(0.), clearcoatRadiance = vec3(0.);
    `)},e.customProgramCacheKey=()=>`africa-apricot-evening-shaped-fill-${t}`}var Ve={east:-5,south:-3},He=185e3,Ue=[-50578,-40854,49466,48201],We=6371e3,K=Math.atan2(Ve.south,Ve.east);function Ge(e){let t=711319,n=()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296),i=[],a=(e,t)=>We-Math.sqrt(Math.max(0,We**2-e*e-t*t)),o=(t,n)=>{if(t<Ue[0]||t>Ue[2]||n<Ue[1]||n>Ue[3])return-a(t,n);let r=e?.(t,-n);return Number.isFinite(r)?r:-a(t,n)};function s(e,t,s,c,l,u,d,f=`deck`){let p=a(e,t),m=o(e,t),h=l-p;if(f!==`high`&&m>h+u*.2)return;let g=n(),_=f===`tower`?2:f===`belt`?1:g<.64?0:g<.85?1:3,v=f===`high`?16+Math.floor(n()*4):_*4+Math.floor(n()*4),y=K+(n()-.5)*.9;if(f!==`high`){let e=[[1,1,1],[1.2,.97,.76],[.88,.9,1],[.8,.78,.72]][_];s*=e[0]*(.82+n()*.34),c*=e[1]*(.82+n()*.34),u*=e[2]*(.86+n()*.26),d*=_===3?.65+n()*.2:.9+n()*.1,f===`tower`&&(s=Math.max(s*1.35,u*3.1),c=Math.max(c*1.35,u*3.1)),f!==`tower`&&(l=Math.min(l,2850-u)),h=l-p}i.push({x:e,y:h,z:t,width:s,height:u,breadth:c,bearing:y,nominalAltitude:l,thickness:c*.45,opacity:d,kind:f,belt:f===`belt`,high:f===`high`,tile:v,morphology:f===`high`?`cirrus`:[`cumulus`,`stratocumulus`,`congestus`,`fragment`][_],phase:n()*Math.PI*2,evolution:n()*Math.PI*2,evolutionHeight:f===`high`?5:14,rotation:0,blendDepth:-(e*8+t*28),clusterId:i.length,current:new r(e,h,t)})}for(let e=-48e3;e<=48e3;e+=4500){let t=n()*6200;for(let r=-52e3+t;r<=52e3;r+=6200){if(n()<.19)continue;let t=e+Math.sin(r/18e3+e/11e3)*900;for(let e=0;e<2;e++){let i=r+e*1800+(n()-.5)*900,a=t+(n()-.5)*1500,o=Math.cos(K)*i-Math.sin(K)*a,c=Math.sin(K)*i+Math.cos(K)*a,l=Math.hypot(o,c);l>54e3||l>22e3&&l<35e3||s(o,c,1900+n()*1300,1450+n()*950,2200+n()*220,520+n()*330,.86+n()*.1)}}}for(let e=-37e3;e<=37e3;e+=1900){let t=n()*1900;for(let r=-37e3+t;r<=37e3;r+=1900){let t=r+(n()-.5)*1300,i=e+(n()-.5)*1200,a=Math.cos(K)*t-Math.sin(K)*i,o=Math.sin(K)*t+Math.cos(K)*i,c=Math.hypot(a,o);c<21e3||c>36500||n()<.26||s(a,o,740+n()*700,660+n()*550,2200+n()*160,280+n()*185,.84+n()*.12)}}for(let e=0;e<Math.PI*2;e+=.31){let t=13e3+2200*Math.sin(e*2.7)+n()*1700;s(-311+Math.cos(e)*t,955+Math.sin(e)*t,2300+n()*1700,1400+n()*900,2450+n()*140,420+n()*180,.78+n()*.16,`belt`),n()<.38&&s(-311+Math.cos(e+.12)*(t+2800),955+Math.sin(e+.12)*(t+2800),1800+n()*1100,1500+n()*900,2850+n()*100,1050+n()*300,.95,`tower`)}for(let e=57e3;e<=He;e+=15500){let t=12500/e,r=n()*t;for(let i=r;i<Math.PI*2+r;i+=t){let t=e+(n()-.5)*7e3;s(Math.cos(i)*t,Math.sin(i)*t,11500+n()*6500,5500+n()*3300,2150+n()*220,540+n()*220,.64+n()*.18,`far`)}}t=191955;for(let[e,[t,n,r,a,o,c]]of[[0,6500,2e4,28e3,6600,.92],[-6e4,6500,9e4,14e3,4e3,.9],[-2e4,6500,6e4,25200,5600,.91],[1e4,12e3,2e4,25200,6600,.9],[-1e5,6500,8e4,14e3,4e3,.9],[-1e5,6500,3e4,14e3,4e3,.91],[-1e4,6500,2e4,21e3,5e3,.9],[2e4,18e3,3e4,14e3,4e3,.88],[-1e5,6500,4e4,21e3,5e3,.9],[-6e4,6500,1e5,14e3,4e3,.91],[0,6500,4e4,33e3,5e3,.9],[5e4,6500,5e4,33e3,5e3,.9],[2e4,6500,3e4,3e4,4e3,.89],[-3e4,6500,8e4,21e3,5e3,.9],[3e4,6500,-3e4,28e3,6600,.9],[-9e4,12e3,8e4,14e3,4e3,.9],[1e4,15e3,4e4,16e3,6500,.94],[-7e4,18e3,5e4,16e3,4e3,.94],[-2e4,15e3,1e4,1e4,4e3,.94],[1e4,18e3,3e4,1e4,6500,.94],[-5e4,18e3,5e4,16e3,4e3,.94],[2e4,12e3,-1e4,1e4,4e3,.94],[1e4,12e3,1e4,1e4,4e3,.94],[5e4,15e3,-1e4,16e3,6500,.94],[-5e3,18e3,45e3,22e3,6500,.94]].entries())s(t,r,a,o,n,500,c,`high`),i.at(-1).tile=16+e%4;return Ie(i,`deck`,ke),Ie(i,`far`,Ae),i}var Ke=4320,q=256,qe=Ue,Je=(e,t)=>e.blendDepth-t.blendDepth,Ye=6371e3;async function Xe({texture:e,scheduler:n,heightAt:i,sunDirection:a=G}){let o=()=>{let e=new Uint16Array(q**2);for(let t=0;t<q;t++)for(let n=0;n<q;n++){let r=F.lerp(qe[0],qe[2],n/255),a=F.lerp(qe[1],qe[3],t/255),o=i?.(r,-a)??0;e[t*q+n]=g.toHalfFloat(Number.isFinite(o)?o:0)}let n=new m(e,q,q,S,D);n.minFilter=n.magFilter=k,n.generateMipmaps=!1,n.needsUpdate=!0,n.name=`Measured cloud terrain contact heights`;let o=Ge(i).sort(Je),s=o.length;for(let e of o)e.generation=0,e.renderTile=e.tile,e.renewalScale=e.sizeScale=e.visibility=1;let c=new ee,l=new E(1,1);c.index=l.index,c.attributes={...l.attributes};let u=new Float32Array(s*3),d=new Float32Array(s*4),f=new Float32Array(s*4);c.setAttribute(`cloudCentre`,new te(u,3).setUsage(b)),c.setAttribute(`cloudShape`,new te(d,4).setUsage(b)),c.setAttribute(`cloudDetail`,new te(f,4).setUsage(b));let p=new Float32Array(s*4),_=new Float32Array(s*4);for(let e=0;e<s;e++){let t=o[e],n=e*4;_[n]=Math.sin(t.clusterId*12.9898+4.1)*43758.5453%1,_[n+1]=Math.sin(t.clusterId*78.233+19.7)*19542.3981%1,_[n+2]=Math.sin(t.clusterId*39.425+91.3)*31942.2934%1,_[n+3]=t.high?4:[`cumulus`,`stratocumulus`,`congestus`,`fragment`].indexOf(t.morphology)}c.setAttribute(`cloudVolume`,new te(p,4).setUsage(b)),c.setAttribute(`cloudSeed`,new te(_,4)),c.instanceCount=s;let v={densityNoise:{value:Ee()},sceneDepth:{value:null},sceneDepthEnabled:{value:0},cloudRenderSize:{value:new P(1,1)},contactMap:{value:n},contactBounds:{value:new M(...qe)},viewToLandscape:{value:new N},evolutionTime:{value:0},lowCloudCeiling:{value:Ke},sunInView:{value:new r},upInView:{value:new r}},y=new t({uniforms:v,transparent:!0,depthTest:!0,depthWrite:!1,fog:!1,toneMapped:!1,vertexShader:De,fragmentShader:Oe}),x=new h(c,y);x.name=`Spatial cumulus sea and high sunset streaks`,x.frustumCulled=!1,x.renderOrder=5;let C=o.filter((e,t)=>t%Math.max(1,Math.floor(s/4))===0).slice(0,4),w=new r,T={time:0,windTime:0,windSpeedScale:1,particleCount:s,clusterCount:new Set(o.map(e=>e.clusterId)).size,exampleWorldPositions:C.map(()=>[0,0,0])};x.userData.cloudMotion=T;let O=0,A=null,j=Re(),I=new r,L=new r,R=new r,z=[-1,0],B=[500,0];T.flow=j.state;let V=new N,H=new N,U=new r,W=new r,ne={};function re(e){e&&V.multiplyMatrices(e.matrixWorldInverse,x.matrixWorld);let t=V.elements;for(let n=0;n<s;n++){let r=o[n],i=1+(r.belt?.065:.035)*Math.sin(O/83+r.evolution),a=n*4;r.current.toArray(u,n*3);let s=Math.cos(r.bearing),c=Math.sin(r.bearing),l=r.width*r.sizeScale*i,m=r.breadth*r.sizeScale/i,h=(t[0]*s+t[8]*c)*l/2,g=(t[1]*s+t[9]*c)*l/2,_=(t[2]*s+t[10]*c)*l/2,v=(-t[0]*c+t[8]*s)*m/2,y=(-t[1]*c+t[9]*s)*m/2,b=(-t[2]*c+t[10]*s)*m/2,x=t[4]*r.height,S=t[5]*r.height,C=t[6]*r.height,w=h*h+v*v+x*x,T=h*g+v*y+x*S,E=g*g+y*y+S*S,D=Math.sqrt(w),k=Math.sqrt(E),A=!1;if(e){U.copy(r.current).applyMatrix4(V);let t=Math.max(1,-U.z),n=_*_+b*b+C*C,i=h*_+v*b+x*C,a=g*_+y*b+S*C,o=(e,t,r,o=0)=>e*U.x+t*U.y+r*U.z+o+Math.sqrt(Math.max(0,e*e*w+t*t*E+r*r*n+2*(e*t*T+e*r*i+t*r*a)))<0,s=e.projectionMatrix.elements;A=o(s[0],0,-1)||o(-s[0],0,-1)||o(0,s[5],-1)||o(0,-s[5],-1)||o(0,0,-1,-e.near)||o(0,0,1,e.far);let c=t*t-n;if(!A&&c>1){let e=(e,n,r)=>{let i=-e*t-r,a=Math.sqrt(Math.max(0,i*i-c*(e*e-n)));return Math.max(Math.abs((-i-a)/c*t-e),Math.abs((-i+a)/c*t-e))};D=e(U.x,w,h*_+v*b+x*C),k=e(U.y,E,g*_+y*b+S*C)}else A||(D=Math.abs(U.x)+t/e.projectionMatrix.elements[0],k=Math.abs(U.y)+t/e.projectionMatrix.elements[5])}if(d[a]=A?0:D*2.06,d[a+1]=A?0:k*2.06,p[a]=l/2,p[a+1]=r.height,p[a+2]=m/2,p[a+3]=r.bearing,d[a+2]=r.renderTile,d[a+3]=A?0:r.opacity*r.visibility,!r.high&&e&&!A){U.copy(r.current).applyMatrix4(V);let t=Math.max(1,-U.z),n=e.projectionMatrix.elements,i=D*n[0]/t,o=k*n[5]/t;d[a+3]*=1-Math.max(F.smoothstep(i,.34,.62),F.smoothstep(o,.32,.56))}if(r.high&&e&&(U.copy(r.current).applyMatrix4(V),U.z<0)){let t=e.projectionMatrix.elements,n=(D+0)*1.08,r=(k+0)*1.08,i=640*(1+(U.x-n)/-U.z*t[0]),o=640*(1+(U.x+n)/-U.z*t[0]),s=360*(1-(U.y+r)/-U.z*t[5]),c=360*(1-(U.y-r)/-U.z*t[5]),l=Math.max(78-o,i-485,18-c,s-151),u=1-F.smoothstep(l,24,100);d[a+3]*=1-u}f[a]=0/D,f[a+2]=0/k,f[a+1]=Math.min(Math.hypot(_,b,C)*.52,r.height*.8),f[a+3]=+!!r.high}c.attributes.cloudCentre.needsUpdate=c.attributes.cloudShape.needsUpdate=c.attributes.cloudDetail.needsUpdate=c.attributes.cloudVolume.needsUpdate=!0}function ie(e){if(!e)return;x.updateWorldMatrix(!0,!1),e.updateWorldMatrix(!0,!1),H.copy(x.matrixWorld).invert(),W.setFromMatrixPosition(e.matrixWorld).applyMatrix4(H);let t=0;for(let e of o){Le(e,e.flowEast??0,e.flowSouth??0,W.x,W.z,ne);let{x:n,z:r,generation:i}=ne,a=Ye-Math.sqrt(Math.max(0,Ye**2-n*n-r*r)),o=e.nominalAltitude-a+(e.evolutionHeight??22)*(Math.sin(O/93+e.evolution)-Math.sin(e.evolution));if(i!==e.generation){let t=Math.imul(e.clusterId+17,1664525)^Math.imul(i,1013904223);t=Math.imul(t^t>>>16,2246822507)>>>0,e.renderTile=i===0?e.tile:e.high?16+t%4:t%16,e.renewalScale=i===0?1:.86+t%1024/1023*.28,e.generation=i}t+=i===0?0:1,e.visibility=ne.visibility;let s=Math.hypot(n-W.x,r-W.z);e.sizeScale=e.renewalScale*(e.kind===`far`?F.lerp(.35,1,F.smoothstep(s,5e3,25e3)):1),e.current.set(n,o,r)}re(e),v.sunInView.value.copy(a).transformDirection(e.matrixWorldInverse),v.upInView.value.set(0,1,0).transformDirection(x.matrixWorld).transformDirection(e.matrixWorldInverse),v.viewToLandscape.value.copy(x.matrixWorld).invert().multiply(e.matrixWorld),v.evolutionTime.value=O,T.time=O,T.windTime=O,T.highWindSpeedScale=T.windSpeedScale,T.renewedBanks=t;for(let e=0;e<C.length;e++)w.copy(C[e].current).applyMatrix4(x.matrixWorld).toArray(T.exampleWorldPositions[e])}re();let ae={mode:`Live procedural fBm density volumes with bounded view and light sampling`,particles:s,nearParticles:o.filter(e=>e.kind===`deck`).length,highParticles:o.filter(e=>e.high).length,beltParticles:o.filter(e=>e.belt).length,draws:1,triangles:s*2,atlas:null,densityVolumeResolution:64,densityTextureMiB:.25,nearViewSamples:10,middleViewSamples:8,farViewSamples:4,highViewSamples:8,sampleDepthBoundariesMetres:[24e3,65e3],minimumRayTransmission:.015,lightSamplesPerViewSample:2,distantLightSamplesPerViewSample:1,noiseLookupsPerDensitySample:2,morphologyCounts:Object.fromEntries([`cumulus`,`stratocumulus`,`congestus`,`fragment`,`cirrus`].map(e=>[e,o.filter(t=>t.morphology===e).length])),farParticles:o.filter(e=>e.kind===`far`).length,coverageRadiusMetres:He,highCloudBaseWindMetresPerSecond:Ve,lowCloudCeilingMetres:Ke,windTargetPixelsPerSecond:{near:215,middle:65,horizon:8,cirrus:8,minimumFraction:.65},atlasMiBWithMipmaps:0,terrainContactMiB:q**2*2/1024**2,altitudeMetres:[Math.min(...o.map(e=>e.y)),Math.max(...o.map(e=>e.y))],blendOrder:`Fixed initial local tracking axis (8, 0, 28)`,motion:`Depth-aware world-space wind maintains nose-to-tail flow through camera and lens moves; independent 2D renewal keeps the horizon populated`,nearRenewalHalfSpanMetres:ke,farRenewalHalfSpanMetres:Ae};return x.userData.cloudField=ae,{object:x,metrics:ae,generationAt(e){return o[e]?.generation??0},update(e,t,n=!1,r=null){let i=n?0:Math.max(0,r?.time??e);if(O=i,(n||A===null||i<A)&&j.reset(o),x.updateWorldMatrix(!0,!1),t){oe(e,I),I.x-=20,I.y+=42,L.copy(I).add(de(e,R).normalize().multiplyScalar(40)),I.project(t),L.project(t);let n=(I.x-L.x)*640,r=(L.y-I.y)*360,i=Math.hypot(n,r)||1;z[0]=n/i,z[1]=r/i,H.copy(x.matrixWorld).invert(),de(e,R).transformDirection(H).multiplyScalar(-650),B[0]=R.x,B[1]=R.z}j.update(A===null||n||i<A?0:i-A,t,x.matrixWorld,o,n,z,B),A=i,ie(t)}}};return n?n.run(`Build spatial cloud banks`,o):o()}var Ze=31,Qe=`
varying vec2 cloudUv;
void main(){ cloudUv=uv; gl_Position=vec4(position.xy,0.,1.); }
`,$e=`
uniform sampler2D cloudColour,sceneDepth;
uniform vec2 cloudSize;
uniform mat4 projectionMatrix;
varying vec2 cloudUv;
float viewDistance(float depth){
  return projectionMatrix[3][2]/(depth*2.-1.+projectionMatrix[2][2]);
}
void main(){
  float surfaceDistance=viewDistance(texture2D(sceneDepth,cloudUv).r);
  vec2 samplePosition=cloudUv*cloudSize-.5;
  vec2 base=floor(samplePosition)+.5,blend=fract(samplePosition);
  vec4 cloud=vec4(0.);float weightSum=0.;
  for(int y=0;y<2;y++)for(int x=0;x<2;x++){
    vec2 offset=vec2(float(x),float(y)),sampleUv=(base+offset)/cloudSize;
    vec2 bilinear=mix(1.-blend,blend,offset);
    float neighbourDistance=viewDistance(texture2D(sceneDepth,sampleUv).r);
    // A nearer-clipped neighbour is still valid at a farther surface. Reject
    // only colour that could cross a closer mountain or narrow aircraft edge.
    float difference=max(neighbourDistance-surfaceDistance,0.)/max(4.,surfaceDistance*.025);
    float weight=bilinear.x*bilinear.y*exp(-difference*difference);
    cloud+=texture2D(cloudColour,sampleUv)*weight;weightSum+=weight;
  }
  if(weightSum<.0001)discard;
  cloud/=weightSum;
  if(cloud.a<.005)discard;
  // The offscreen blend already premultiplied RGB. Apply it only once.
  gl_FragColor=cloud;
}
`;function et({renderer:e,clouds:n}){let r=n.object,i=r.layers.mask,c=new s(1,1,{format:A,type:ne,minFilter:k,magFilter:k,depthBuffer:!1,stencilBuffer:!1,generateMipmaps:!1});c.texture.name=`Flight half-resolution premultiplied cloud colour`,c.texture.colorSpace=``;let d=new l(1,1,a);d.format=o,d.name=`Flight full-resolution opaque depth resolve`;let f={cloudColour:{value:c.texture},sceneDepth:{value:d},cloudSize:{value:new P(1,1)}},p=new t({uniforms:f,vertexShader:Qe,fragmentShader:$e,transparent:!0,premultipliedAlpha:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,fog:!1}),m=new h(new E(2,2),p);m.name=`Depth-aware half-resolution cloud composite`,m.frustumCulled=!1,m.renderOrder=r.renderOrder,r.add(m),r.layers.set(Ze);let g=new y,_=r.material.clone();_.uniforms={...r.material.uniforms,sceneDepth:{value:d},sceneDepthEnabled:{value:1},cloudRenderSize:f.cloudSize},_.depthWrite=_.depthTest=!1;let v=new h(r.geometry,_);v.frustumCulled=!1,v.matrixAutoUpdate=!1,v.matrixWorldAutoUpdate=!1,g.add(v);let b=new P,S=new x,C=e.getContext(),w=!1,T=!1,D=!1,O=!1,j=null,M=null,N={resolutionScale:.5,draws:2,additionalDraws:1,depthBlits:1,width:1,height:1,fullWidth:1,fullHeight:1,colourFormat:`RGBA8`,depthFormat:`DEPTH24_STENCIL8`,depthType:`UnsignedInt248Type`,colourBytesPerPixel:4,depthAllocatedBytesPerPixel:4,textureMiB:8/1024**2,samples:0,preservesMainCanvasMSAA:!0};r.userData.cloudRenderPass=N;function F(){if(w)return;e.getDrawingBufferSize(b);let t=Math.max(1,b.x),n=Math.max(1,b.y),r=Math.ceil(t/2),i=Math.ceil(n/2);(c.width!==r||c.height!==i||d.image.width!==t||d.image.height!==n)&&(c.setSize(r,i),f.cloudSize.value.set(r,i),d.dispose(),d.image.width=t,d.image.height=n,d.needsUpdate=!0,Object.assign(N,{width:r,height:i,fullWidth:t,fullHeight:n,textureMiB:(r*i*4+t*n*N.depthAllocatedBytesPerPixel)/1024**2}),T=!1)}function I(t){let n=e.getRenderTarget(),r=e.getActiveCubeFace(),i=e.getActiveMipmapLevel();e.getClearColor(S);let a=e.getClearAlpha(),o=e.autoClear,s=e.shadowMap.autoUpdate,l=e.shadowMap.needsUpdate;try{return e.setRenderTarget(c),e.autoClear=!1,e.shadowMap.autoUpdate=!1,e.shadowMap.needsUpdate=!1,e.setClearColor(0,0),e.clear(!0,!1,!1),t()}finally{e.setClearColor(S,a),e.autoClear=o,e.shadowMap.autoUpdate=s,e.shadowMap.needsUpdate=l,e.setRenderTarget(n,r,i)}}function L(t){let n=C.getParameter(C.READ_FRAMEBUFFER_BINDING),r=C.getParameter(C.DRAW_FRAMEBUFFER_BINDING),i=C.isEnabled(C.SCISSOR_TEST);try{return e.state.setScissorTest(!1),t(r)}finally{e.state.bindFramebuffer(C.READ_FRAMEBUFFER,n),e.state.bindFramebuffer(C.DRAW_FRAMEBUFFER,r),e.state.setScissorTest(i)}}function R(){if(F(),!(w||T)){if(D||L(()=>{e.state.bindFramebuffer(C.DRAW_FRAMEBUFFER,null);let t=C.getFramebufferAttachmentParameter(C.DRAW_FRAMEBUFFER,C.DEPTH,C.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE),n=C.getParameter(C.DEPTH_BITS),r=C.getParameter(C.STENCIL_BITS),i=t===C.FLOAT;if(!C.getContextAttributes().stencil||r!==8||n!==(i?32:24))throw Error(`Flight clouds require a packed 24/8 or 32F/8 canvas depth attachment`);d.type=i?u:a,d.needsUpdate=!0,Object.assign(N,{depthFormat:i?`DEPTH32F_STENCIL8`:`DEPTH24_STENCIL8`,depthType:i?`FloatType`:`UnsignedInt248Type`,depthAllocatedBytesPerPixel:i?8:4,sourceDepthBits:n,sourceStencilBits:r,sourceDepthComponent:i?`FLOAT`:`UNSIGNED_NORMALIZED`}),N.textureMiB=(N.width*N.height*4+N.fullWidth*N.fullHeight*N.depthAllocatedBytesPerPixel)/1024**2,D=!0}),e.initRenderTarget(c),e.initTexture(d),M||=C.createFramebuffer(),!M)throw Error(`Flight cloud depth framebuffer unavailable`);L(()=>{if(e.state.bindFramebuffer(C.DRAW_FRAMEBUFFER,M),C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.DEPTH_STENCIL_ATTACHMENT,C.TEXTURE_2D,e.properties.get(d).__webglTexture,0),C.drawBuffers([C.NONE]),e.state.bindFramebuffer(C.READ_FRAMEBUFFER,M),C.readBuffer(C.NONE),C.checkFramebufferStatus(C.DRAW_FRAMEBUFFER)!==C.FRAMEBUFFER_COMPLETE)throw Error(`Flight cloud depth framebuffer is incomplete`)}),I(()=>{}),T=!0}}return m.onBeforeRender=(t,n,i)=>{O&&!w&&i===j&&e.getRenderTarget()===null&&(O=!1,R(),L(t=>{e.state.bindFramebuffer(C.READ_FRAMEBUFFER,t),e.state.bindFramebuffer(C.DRAW_FRAMEBUFFER,M),C.blitFramebuffer(0,0,N.fullWidth,N.fullHeight,0,0,N.fullWidth,N.fullHeight,C.DEPTH_BUFFER_BIT,C.NEAREST)}),r.updateWorldMatrix(!0,!1),v.matrix.copy(r.matrixWorld),v.matrixWorld.copy(r.matrixWorld),I(()=>e.render(g,i)))},{metrics:N,resize:F,renderBefore(e){if(w)return;let t=!0;for(let e=r;e;e=e.parent)t&&=e.visible;m.visible=O=t,j=e},async prepare(t,{signal:n}={}){W(n),R(),await H(e,n)},dispose(){w||(w=!0,O=!1,r.layers.mask=i,m.removeFromParent(),m.geometry.dispose(),p.dispose(),_.dispose(),f.cloudColour.value=f.sceneDepth.value=null,c.dispose(),d.dispose(),M&&C.deleteFramebuffer(M),g.clear())}}}var tt=`
  uniform vec3 eveningSun; uniform float eveningProgress;
  vec3 flightSkyColour(vec3 ray) {
    float altitude=max(0.,ray.y);
    float angle=acos(clamp(dot(ray,eveningSun),-1.,1.));
    float broad=exp(-angle*angle*6.), inner=exp(-angle*angle*100.);
    vec3 colour=mix(vec3(.985,.785,.620),vec3(.925,.672,.661),smoothstep(.01,.34,altitude));
    float dusk=smoothstep(.18,.82,altitude)*(1.-broad*.85);
    // The high, anti-solar sky stays rose-gold through the low camera angles.
    colour=mix(colour,vec3(.86,.565,.525),dusk);
    colour=mix(vec3(.92,.74,.64),colour,smoothstep(-.14,.01,ray.y));
    colour=mix(colour,colour*vec3(1.015,.98,.95),eveningProgress*.35);
    colour=mix(colour,vec3(1.,.855,.53),broad*.83);
    colour=mix(colour,vec3(1.,.94,.68),inner*.82);
    float glare=exp(-angle*angle*850.);
    colour+=vec3(.20,.14,.045)*glare;
    float disc=1.-smoothstep(.016,.022,angle);
    return mix(colour,vec3(1.,.988,.795),disc);
  }
`;function nt(e,n){let r={eveningSun:e?.sun??{value:G},eveningProgress:e?.progress??{value:0},cameraWorld:{value:new N},projectionInverse:{value:new N}},i=new t({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,uniforms:r,vertexShader:`varying vec2 skyUv; void main(){skyUv=uv;gl_Position=vec4(position.xy,1.,1.);}`,fragmentShader:`varying vec2 skyUv; uniform mat4 cameraWorld,projectionInverse; ${tt}
      void main(){
        vec3 viewRay=(projectionInverse*vec4(skyUv*2.-1.,1.,1.)).xyz;
        vec3 ray=normalize(mat3(cameraWorld)*viewRay);
        float grain=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-.5;
        gl_FragColor=vec4(flightSkyColour(ray)+grain/255.,1.);
      }`}),a=new h(new E(2,2),i);a.name=`Directional peach atmosphere and golden sun`,a.frustumCulled=!1,a.renderOrder=-1e3,a.raycast=()=>{},a.onBeforeRender=(e,t,n)=>{r.cameraWorld.value.copy(n.matrixWorld),r.projectionInverse.value.copy(n.projectionMatrixInverse)};let o=it(e,n),s=new w;return s.name=`Sunset sky and camera glare`,s.add(a,o.object),s.userData.sunLens=o.metrics,{object:s,update(e){o.update(e)}}}function rt(e){let n=new y,r=new re(e),i=new I(10,32,16),a=new t({side:1,toneMapped:!1,uniforms:{eveningSun:{value:G},eveningProgress:{value:0}},vertexShader:`varying vec3 skyDirection; void main(){skyDirection=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec3 skyDirection; ${tt}
      void main(){
        vec3 ray=normalize(skyDirection), colour=flightSkyColour(ray);
        colour=mix(vec3(.20,.14,.105),colour,smoothstep(-.35,.025,ray.y));
        vec3 linearColour=mix(colour/12.92,pow((colour+.055)/1.055,vec3(2.4)),step(vec3(.04045),colour));
        // The sun retains radiance above display white in the filtered reflection source.
        float glint=exp(-pow(acos(clamp(dot(ray,eveningSun),-1.,1.)),2.)*2200.);
        linearColour+=vec3(30.,20.,8.5)*glint;
        gl_FragColor=vec4(linearColour,1.);
      }`});n.add(new h(i,a));try{return r.fromScene(n,.025,.1,100,{size:128})}finally{r.dispose(),i.dispose(),a.dispose(),n.clear()}}function it(e,n){let i={sunScreen:{value:new P},aspect:{value:16/9},strength:{value:0}},a=new t({uniforms:i,transparent:!0,blending:5,blendEquation:100,blendSrc:209,blendDst:201,blendEquationAlpha:100,blendSrcAlpha:200,blendDstAlpha:201,depthTest:!1,depthWrite:!1,toneMapped:!1,fog:!1,vertexShader:`varying vec2 lensUv;void main(){lensUv=uv;gl_Position=vec4(position.xy,0.,1.);}`,fragmentShader:`varying vec2 lensUv;uniform vec2 sunScreen;uniform float aspect,strength;
      float ghost(vec2 point,float size,float ring){
        float radius=length(point*vec2(aspect,1.));
        return mix(exp(-radius*radius/(size*size)),exp(-pow((radius-size)/(size*.22),2.)),ring);
      }
      void main(){
        if(strength<.0001)discard;
        vec2 q=(lensUv-sunScreen)*vec2(aspect,1.);float radius=length(q);
        float veil=exp(-radius*radius*4.5)*.21;
        float bloom=exp(-radius*radius*30.)*.46+exp(-radius*radius*650.)*.75;
        float streak=exp(-abs(q.x)*2.1)*exp(-q.y*q.y*85000.)*1.15
          +exp(-abs(q.x)*3.8)*exp(-q.y*q.y*6500.)*.18;
        float rays=pow(abs(cos(atan(q.y,q.x)*3.)),24.)*exp(-radius*12.)*.12;
        vec2 axis=sunScreen-.5;
        vec3 ghosts=vec3(1.,.67,.34)*ghost(lensUv-(.5-axis*.65),.038,.65)*.27;
        ghosts+=vec3(1.,.86,.62)*ghost(lensUv-(.5-axis*1.7),.022,.1)*.42;
        ghosts+=vec3(1.,.48,.27)*ghost(lensUv-(.5-axis*3.1),.092,.75)*.20;
        ghosts+=vec3(1.,.78,.50)*ghost(lensUv-(.5-axis*4.6),.052,.4)*.16;
        float readingSky=1.-smoothstep(.66,.82,lensUv.y);
        vec3 light=(vec3(1.,.75,.42)*veil+vec3(1.,.77,.34)*(bloom+streak+rays)+ghosts)*strength*readingSky;
        gl_FragColor=vec4(1.-exp(-light),1.);
      }`}),o=new h(new E(2,2),a);o.name=`Warm lens glare, ghosts and anamorphic streak`,o.frustumCulled=!1,o.renderOrder=9,o.raycast=()=>{};let s=new r,c=new r,l=new r,u=new r,d=new N,f={draws:1,triangles:2,textureBytes:0,renderTargets:0,alignment:0,strength:0,terrainVisibility:1,screen:[0,0]};o.userData.sunLens=f;function p(t){if(!t)return;let r=e?.sun.value??G;t.getWorldDirection(c);let a=F.clamp(c.dot(r),-1,1);a>.001?(s.copy(r).multiplyScalar(1e5).add(t.position).project(t),i.sunScreen.value.set((s.x+1)*.5,(s.y+1)*.5)):i.sunScreen.value.set(2,2),i.aspect.value=t.aspect;let o=1;n?.heightAt&&(n.object.updateWorldMatrix(!0,!1),d.copy(n.object.matrixWorld).invert(),l.copy(t.position).applyMatrix4(d),u.copy(r).transformDirection(d),o=ot(l,u,n.heightAt)),i.strength.value=at(a,o),f.terrainVisibility=o,f.alignment=a,f.strength=i.strength.value,i.sunScreen.value.toArray(f.screen)}return o.onBeforeRender=(e,t,n)=>p(n),{object:o,metrics:f,update:p}}function at(e,t=1){let n=Math.acos(F.clamp(e,-1,1));return(.22+.78*Math.exp(-n*n*8))*F.smoothstep(e,.4,.8)*t}function ot(e,t,n){let r=1/0;for(let i=500;i<=6e4;i+=500){let a=n(e.x+t.x*i,-(e.z+t.z*i));Number.isFinite(a)&&(r=Math.min(r,Math.atan2(e.y+t.y*i-a,i)))}let i=F.clamp(r/.022,-1,1);return(Math.acos(-i)+i*Math.sqrt(Math.max(0,1-i*i)))/Math.PI}var J=1024;function st(e,t,n){e.updateWorldMatrix(!0,!0);let a=e.matrixWorld.clone().invert(),o=e.getWorldQuaternion(new z).invert(),c=G.clone().applyQuaternion(o).normalize(),l=new y,u=new r(-3,1,0),d=new f(-26,26,24,-24,1,130);d.position.copy(u).addScaledVector(c,70),d.lookAt(u),d.updateMatrixWorld(),d.updateProjectionMatrix();let p=new N().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1).multiply(d.projectionMatrix).multiply(d.matrixWorldInverse),m=new v({depthPacking:U,side:2});m.toneMapped=!1;let g=new Map,_=new Map;for(let e of n){let t=new N().multiplyMatrices(a,e.matrixWorld),n=new h(e.geometry,m);n.matrixAutoUpdate=!1,n.matrix.copy(t),l.add(n),g.set(e,p.clone().multiply(t));let i=new r().setFromMatrixScale(t);_.set(e,.1/Math.min(i.x,i.y,i.z))}let b=new s(J,J,{minFilter:i,magFilter:i,depthBuffer:!0,stencilBuffer:!1,generateMipmaps:!1});b.texture.name=`A320 cached aircraft-only sun depth`;let S={target:t.getRenderTarget(),face:t.getActiveCubeFace(),mip:t.getActiveMipmapLevel(),colour:t.getClearColor(new x),alpha:t.getClearAlpha(),viewport:t.getViewport(new M),scissor:t.getScissor(new M),scissorTest:t.getScissorTest(),autoClear:t.autoClear,shadows:t.shadowMap.enabled,shadowAuto:t.shadowMap.autoUpdate};try{t.shadowMap.enabled=!1,t.autoClear=!0,t.setRenderTarget(b),t.setScissorTest(!1),t.setClearColor(16777215,1),t.clear(),t.render(l,d)}finally{t.setRenderTarget(S.target,S.face,S.mip),t.setViewport(S.viewport),t.setScissor(S.scissor),t.setScissorTest(S.scissorTest),t.setClearColor(S.colour,S.alpha),t.autoClear=S.autoClear,t.shadowMap.enabled=S.shadows,t.shadowMap.autoUpdate=S.shadowAuto,l.clear(),m.dispose()}return{texture:b.texture,matrices:g,normalOffsets:_,dispose:()=>b.dispose()}}function ct(e,t,n,r){let i=e.onBeforeCompile;e.onBeforeCompile=e=>{i(e),e.uniforms.airframeDepth={value:t},e.uniforms.airframeSunMatrix={value:n},e.uniforms.airframeNormalOffset={value:r},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
      uniform mat4 airframeSunMatrix;
      uniform float airframeNormalOffset;
      varying vec3 airframeSunCoord;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
        airframeSunCoord = (airframeSunMatrix * vec4(transformed + normalize(objectNormal) * airframeNormalOffset, 1.)).xyz;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
      uniform sampler2D airframeDepth;
      varying vec3 airframeSunCoord;`).replace(`#include <envmap_physical_pars_fragment>`,ie.envmap_physical_pars_fragment.replace(`return PI * envMapColor.rgb * envMapIntensity;`,`return PI * envMapColor.rgb * envMapIntensity * mix(vec3(.30,.245,.205),vec3(1.),smoothstep(-.15,.2,worldNormal.y));`).replace(`return envMapColor.rgb * envMapIntensity;`,`return envMapColor.rgb * envMapIntensity * mix(vec3(.30,.245,.205),vec3(1.),smoothstep(-.15,.2,reflectVec.y));`)).replace(`#include <packing>`,`#include <packing>
      float airframeSunVisibility() {
        vec3 p = airframeSunCoord;
        if (min(p.x,p.y) < .002 || max(p.x,p.y) > .998 || p.z < 0. || p.z > 1.) return 1.;
        float visibility = 0.;
        for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
          float depth = unpackRGBAToDepth(texture2D(airframeDepth,p.xy+vec2(float(x),float(y))*1.35/${J.toFixed(1)}));
          visibility += step(p.z-.00055,depth);
        }
        return visibility / 9.;
      }`).replace(`eveningKey.visible = true;`,`eveningKey.color *= mix(.16,1.,airframeSunVisibility());
      eveningKey.visible = true;`).replace(`#include <lights_fragment_end>`,`iblIrradiance *= .16;
      #include <lights_fragment_end>`)},e.customProgramCacheKey=()=>`africa-airframe-clearcoat-cached-shadow-v5`}function lt(e){let t=new I(1,8,6),n=new _({toneMapped:!1,fog:!1}),r=[{point:[-5.03,1.39,17.1],colour:[.05,.9,.24],size:.125,kind:`steady`},{point:[-5.03,1.39,-17.18],colour:[1,.035,.012],size:.125,kind:`steady`},{point:[-21.39,1.62,-.03],colour:[1,.94,.83],size:.1,kind:`steady`},{point:[-1.3,2.25,-.03],colour:[1,.025,.008],size:.12,kind:`beacon`},{point:[-1.3,-1.89,-.03],colour:[1,.025,.008],size:.09,kind:`beacon`},{point:[-6.16,1.4,17.14],colour:[1,.98,.94],size:.1,kind:`strobe`},{point:[-6.16,1.4,-17.22],colour:[1,.98,.94],size:.1,kind:`strobe`}],i=new j(t,n,r.length);i.name=`Navigation lights, beacon and wing strobes`;let a=new N,o=new x;for(let e=0;e<r.length;e++){let t=r[e];a.makeScale(t.size,t.size,t.size).setPosition(...t.point),i.setMatrixAt(e,a),i.setColorAt(e,o.setRGB(...t.colour))}i.instanceColor.setUsage(b),i.computeBoundingSphere();function s(t,n){let a=(t%1.18+1.18)%1.18,s=a<.045||a>.12&&a<.155,c=.035+.965*Math.exp(-(((a-.54)/.075)**2));for(let t=0;t<r.length;t++){let a=r[t],l=a.kind===`steady`?1.6*(1+.25*(e?.progress.value||0)):n?.4:a.kind===`beacon`?c*2.3:s?3.8:.035;i.setColorAt(t,o.setRGB(...a.colour).multiplyScalar(l))}i.instanceColor.needsUpdate=!0}return{object:i,update:s}}function ut(){let e=new O(1.025,48);e.rotateY(Math.PI/2);let n={value:0},r=new t({uniforms:{fanTime:n},side:0,fog:!1,vertexShader:`varying vec2 fanUv;
      void main() {
        fanUv = uv * 2. - 1.;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position,1.);
      }`,fragmentShader:`uniform float fanTime; varying vec2 fanUv;
      void main() {
        float radius = length(fanUv), angle = atan(fanUv.y,fanUv.x);
        float blade = .5+.5*sin(24.*(angle+fanTime*9.5+radius*.21));
        float brushed = smoothstep(.12,.21,radius) * (.055+.023*blade);
        gl_FragColor = vec4(vec3(brushed*.99,brushed*.97,brushed*.92),1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`}),i=new j(e,r,2);i.name=`Turning engine fans behind the original inlet lips`;let a=new N;return i.setMatrixAt(0,a.makeTranslation(3.8,-1.532,4.885)),i.setMatrixAt(1,a.makeTranslation(3.8,-1.532,-5.465)),i.computeBoundingSphere(),{object:i,update:(e,t)=>{n.value=t?0:e}}}async function dt({jet:e,renderer:t,livery:n,surface:r,environment:i,evening:a}){let o=[];e.traverse(e=>{e.isMesh&&o.push(e)});let s=st(e,t,o);for(let e of o){let t=e.material,o=t.map;e.castShadow=e.receiveShadow=!1,e.material=new p({map:n,roughnessMap:r,metalnessMap:r,roughness:1,metalness:1,clearcoat:1,clearcoatRoughness:.085,envMap:i?.texture??i,envMapIntensity:1.45,transparent:!1,depthWrite:!0,fog:!1}),e.material.name=`White enamel, reflective glazing and brushed aluminium`,Be(e.material,.8,a),ct(e.material,s.texture,s.matrices.get(e),s.normalOffsets.get(e)),o&&o!==n&&(o.dispose(),o.image?.close?.()),t.dispose()}let c=lt(a),l=ut();return e.add(c.object,l.object),c.update(0,!1),{update(e,t=!1){c.update(e,t),l.update(e,t)},dispose(){s.dispose(),c.object.dispose(),l.object.dispose()},metrics:{shadow:[J,J],cachedShadowBytes:J*J*4,cachedShadowDepthBytes:J*J*4,addedDraws:2,addedTriangles:c.object.geometry.index.count/3*c.object.count+l.object.geometry.index.count/3*l.object.count}}}var ft=`Africa Closing Italianno`,pt=`Thank you.`,Y=2048,X=768,Z=2.35,Q={width:140,height:52.5,depth:180,referenceFov:44,scale:1.04,anchor:[.5,.17],pixels:[Y,X]},mt=[{name:`T cap`,duration:.22,pause:.1,start:[166,420],curves:[[137,401,120,372,140,351,29,1.3],[178,307,276,330,397,339,26,.75],[455,343,512,353,558,338,21,.75]]},{name:`T stem`,duration:.22,pause:.1,start:[452,350],curves:[[418,353,402,378,390,406,25,1.6],[366,463,347,520,317,570,26,1.7],[275,641,241,666,199,661,25,1.4],[159,657,142,634,146,581,16,1.1]]},{name:`hank`,duration:.7,pause:.2,start:[692,321],curves:[[701,286,669,280,635,293,21,1.3],[542,312,471,468,391,642,23,1.7],[426,577,492,498,531,489,12,.55],[550,483,525,532,502,579,27,1.6],[485,615,472,640,494,642,27,1.35],[522,643,570,596,606,549,13,.6],[637,503,674,477,701,492,21,.95],[673,480,634,507,601,556,24,1.2],[577,591,563,635,578,642,26,1.5],[609,643,672,571,703,509,15,.6],[715,487,727,486,735,489,22,1.1],[709,515,684,573,668,611,28,1.7],[651,646,668,652,697,634,27,1.3],[742,607,787,539,828,488,11,.55],[838,485,849,484,855,478,20,1.1],[819,533,795,589,770,646,27,1.7],[796,586,862,506,901,492,12,.55],[927,480,915,512,899,544,26,1.4],[877,586,859,627,873,640,28,1.7],[892,654,932,612,961,565,15,.8],[1003,510,1051,353,1131,305,8,.55],[1171,281,1217,281,1215,312,13,1.2],[1220,280,1170,280,1131,305,23,1.25],[1050,352,1001,519,947,641,27,1.7],[977,586,1035,508,1083,492,12,.55],[1106,483,1110,492,1104,507,22,1.2],[1081,483,1048,510,1017,545,18,.9],[1027,574,1034,626,1052,640,25,1.7],[1076,658,1121,611,1153,566,16,.8]]},{name:`y`,duration:.28,pause:.08,start:[1248,574],curves:[[1285,525,1320,491,1345,491,14,.65],[1363,486,1331,546,1312,585,28,1.7],[1295,622,1281,645,1306,642,30,1.3],[1350,637,1404,547,1428,510,13,.6],[1441,494,1454,490,1463,491,20,1.1],[1420,499,1406,608,1364,694,27,1.7],[1323,782,1244,851,1170,849,28,1.65],[1127,850,1101,821,1109,762,19,1.3]]},{name:`ou`,duration:.32,pause:.08,start:[1561,491],curves:[[1519,482,1467,553,1454,598,25,1.1],[1431,653,1467,654,1502,628,27,1.3],[1541,598,1582,533,1582,503,27,1.6],[1582,486,1570,485,1561,491,19,1.3],[1594,491,1556,568,1519,608,12,.55],[1559,615,1590,607,1631,565,14,.65],[1662,529,1685,493,1702,491,14,.65],[1717,485,1688,539,1667,583,28,1.7],[1647,622,1634,647,1660,642,27,1.35],[1706,631,1761,545,1785,493,13,.6],[1798,495,1812,489,1821,486,20,.8],[1784,512,1765,564,1749,602,27,1.7],[1730,643,1742,651,1769,637,27,1.3],[1801,622,1830,592,1852,566,14,.65]]},{name:`full stop`,duration:.05,pause:0,start:[1874,639],curves:[[1874,639,1874,639,1874,639,30,1]]}];function ht(e,t){let n=[],r=[],i=0;for(let a of mt){let o=[],s=[...a.start],c=0;for(let n of a.curves){let[r,i,a,l,u,d,f,p]=n,m=Math.hypot(r-s[0],i-s[1])+Math.hypot(a-r,l-i)+Math.hypot(u-a,d-l),h=Math.max(2,Math.ceil(m/1.2)),g=s[0],_=s[1];for(let n=0;n<=h;n++){let m=n/h,v=1-m,y=v*v*v*s[0]+3*v*v*m*r+3*v*m*m*a+m*m*m*u,b=v*v*v*s[1]+3*v*v*m*i+3*v*m*m*l+m*m*m*d;c+=Math.hypot(y-g,b-_)*p*(o.length<12?1.25:1),o.push({x:y+e,y:b+t,radius:f,distance:c}),g=y,_=b}s[0]=u,s[1]=d}let l=a.duration*Z/2.35,u=i,d=i+l;for(let e of o)e.time=c?u+e.distance/c*l:u+l*.5,r.push(e);n.push({name:a.name,start:u,end:d,points:o}),i=d+a.pause*Z/2.35}return{strokes:n,samples:r}}function gt(e,t){let n=e.getImageData(0,0,Y,X).data,r={left:Y,top:X,right:0,bottom:0},i=new Float32Array(Y*X).fill(1/0),a=Array.from({length:512},()=>[Y,X,0,0]);for(let e of t){let t=e.radius+1,n=Math.max(0,Math.floor(e.x-t)),r=Math.min(2047,Math.ceil(e.x+t)),a=Math.max(0,Math.floor(e.y-t)),o=Math.min(767,Math.ceil(e.y+t)),s=t*t;for(let t=a;t<=o;t++)for(let a=n;a<=r;a++){if((a+.5-e.x)**2+(t+.5-e.y)**2>s)continue;let n=t*Y+a;e.time<i[n]&&(i[n]=e.time)}}let o=0;for(let e=0;e<i.length;e++){if(n[e*4+3]){let t=e%Y,n=Math.floor(e/Y);r.left=Math.min(r.left,t),r.right=Math.max(r.right,t+1),r.top=Math.min(r.top,n),r.bottom=Math.max(r.bottom,n+1)}if(n[e*4+3]&&Number.isFinite(i[e])){let t=a[Math.min(511,Math.floor(i[e]/Z*512))],n=e%Y,r=Math.floor(e/Y);t[0]=Math.min(t[0],n),t[1]=Math.min(t[1],r),t[2]=Math.max(t[2],n+1),t[3]=Math.max(t[3],r+1)}n[e*4+3]&&!Number.isFinite(i[e])&&o++;let t=Math.min(65535,Math.round(i[e]/Z*65534));n[e*4]=t>>8,n[e*4+1]=t&255,n[e*4+2]=0}for(let e=1;e<a.length;e++){let t=a[e-1],n=a[e];n[0]=Math.min(n[0],t[0]),n[1]=Math.min(n[1],t[1]),n[2]=Math.max(n[2],t[2]),n[3]=Math.max(n[3],t[3])}let s=new m(n,Y,X);return s.flipY=!0,s.magFilter=k,s.minFilter=k,s.generateMipmaps=!1,s.needsUpdate=!0,{map:s,untraced:o,inkBounds:r,revealBounds:a}}async function _t(){let e=new FontFace(ft,`url(/thesis-defence/world/plane-africa/fonts/Italianno-Regular.ttf)`,{weight:`400`,style:`normal`});await e.load(),document.fonts.add(e);let n=document.createElement(`canvas`);n.width=Y,n.height=X;let r=n.getContext(`2d`,{willReadFrequently:!0});r.font=`400 600px "${ft}"`,r.textAlign=`left`,r.textBaseline=`alphabetic`;let i=r.measureText(pt),a=(Y-i.actualBoundingBoxLeft-i.actualBoundingBoxRight)/2+i.actualBoundingBoxLeft,o=(X+i.actualBoundingBoxAscent-i.actualBoundingBoxDescent)/2;r.fillStyle=`#000000`,r.fillText(pt,a,o);let s=ht(a-120,o-650),{map:c,untraced:l,inkBounds:u,revealBounds:d}=gt(r,s.samples),f={inkMap:{value:c},writingProgress:{value:0},inkColor:{value:new x(`#151216`)}},p=new t({uniforms:f,transparent:!0,depthTest:!0,depthWrite:!1,toneMapped:!1,vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,fragmentShader:`uniform sampler2D inkMap; uniform float writingProgress; uniform vec3 inkColor; varying vec2 vUv;
      void main(){
        vec4 ink=texture2D(inkMap,vUv);
        float arrival=(ink.r*65280.+ink.g*255.)/65534.;
        float alpha=ink.a*step(arrival,writingProgress);
        if(alpha<.001) discard;
        gl_FragColor=vec4(inkColor,alpha);
        #include <colorspace_fragment>
      }`}),m=new h(new E(Q.width,Q.height),p);m.name=pt,m.renderOrder=10,Object.assign(m.userData,{writingDuration:Z,writingProgress:0,writingTime:0,activeStroke:``,penDown:!1,penTip:{x:0,y:0},untracedInkPixels:l,inkBounds:u,inkRevealBounds:d,inkPixels:[Y,X],screenAnchor:Q.anchor,writingStrokes:s.strokes.map(({name:e,start:t,end:n})=>({name:e,start:t,end:n}))});let g=-1;return m.userData.setWritingTime=e=>{let t=F.clamp(e,0,Z);if(t===g)return;g=t,m.visible=t>0,p.opacity=+(t>0),f.writingProgress.value=t/Z,m.userData.writingTime=t,m.userData.writingProgress=t/Z,m.userData.revealedInkBounds=t>0?d[Math.min(511,Math.floor(t/Z*512))]:null;let n=null;for(let e of s.strokes)if(t>=e.start&&t<=e.end){n=e;break}if(m.userData.penDown=!!n&&t>0,m.userData.activeStroke=n?.name||``,n){let e=n.points[n.points.length-1];for(let r of n.points)if(r.time>=t){e=r;break}m.userData.penTip.x=e.x/Y,m.userData.penTip.y=e.y/X}},m.userData.setWritingTime(0),{object:m,disposeFont(){document.fonts.delete(e)}}}var vt=1.25;function yt(t,n,i,a,{entranceRequired:o=!1}={}){let s=new r,c=new r,l=new r,u={travelTime:0,cloudTime:0},d=!1,f=!o,p=!1,m=null,h=0,g=0,_=null,v=null,y=null,b=.1,x=700,S={step:0,farewellTime:0,aircraftPathTime:0,aircraftHidden:!1,departureTime:0,departureFinished:!1,exitTime:null,textOpacity:0,writingTime:0,writingProgress:0,cameraStopped:!1,subjectOrbitTime:0,subjectOrbitRate:1,subjectOrbitStopped:!1,awaitingEntrance:!1,penDelay:vt};function C(){y&&=(y.near=b,y.far=x,y.updateProjectionMatrix(),null)}function w(t=g,n=!1){if(!p)return;let r=v===null?0:n?1:Math.max(0,t-v);Object.assign(e,{active:!0,step:S.step,departed:!1,written:S.writingProgress,writingStartedAt:_,writtenAt:v,sinceWritten:r,acknowledgementsReady:S.writingProgress===1&&r>=1})}function T(e){let t=n.userData.writingDuration||2.35;S.writingTime=F.clamp(e,0,t),S.writingProgress=S.writingTime/t,S.textOpacity=+(S.writingTime>0),n.userData.setWritingTime?n.userData.setWritingTime(S.writingTime):(n.visible=S.textOpacity>0,n.material.opacity=S.textOpacity)}function E(){m=_=v=null,S.farewellTime=0,T(0)}function D(e){e.getWorldDirection(s),n.position.copy(e.position).addScaledVector(s,Q.depth),n.quaternion.copy(e.quaternion),n.scale.setScalar(Q.scale*Math.tan(F.degToRad(e.fov/2))/Math.tan(F.degToRad(Q.referenceFov/2))),c.set(1,0,0).applyQuaternion(e.quaternion),l.set(0,1,0).applyQuaternion(e.quaternion);let t=Q.anchor,r=Q.depth*Math.tan(F.degToRad(e.fov/2))/e.zoom;n.position.addScaledVector(c,(t[0]*2-1)*r*e.aspect).addScaledVector(l,(1-t[1]*2)*r),n.userData.screenAnchor=t,n.userData.screenScale=Q.scale}return{state:S,releaseCamera:C,setActive(t){p!==!!t&&(p=!!t,p?w():Object.assign(e,{active:!1,step:0,departed:!1,written:0,writingStartedAt:null,writtenAt:null,sinceWritten:0,acknowledgementsReady:!1}))},reset(){C(),d=!1,f=!o,S.step=0,S.awaitingEntrance=!1,h=g=0,E(),a?.reset(),w(),t.visible=!0,i.object=t},setStep(e,t=h){let n=e>=1;n!==d&&(d=n,S.step=Number(n),E(),d&&f&&(m=t),S.awaitingEntrance=d&&!f,w())},setEntranceReady(e,t=h){f=!!e,d&&f&&m===null&&(m=t),S.awaitingEntrance=d&&!f},update(e,r,o,s,c=r){h=r,g=c;let l=o?.camera;if(l&&[`planeAfrica`,`planeAfricaConclusions`].includes(o.shot)?(y!==l&&(C(),y=l,b=l.userData.worldNear??l.near,x=l.userData.worldFar??l.far),(l.near!==20||l.far!==5e5)&&(l.near=20,l.far=me,l.updateProjectionMatrix())):l&&C(),u.travelTime=u.cloudTime=r,S.aircraftPathTime=o?.shotTime??r,S.subjectOrbitTime=o?.motionTiming?.subjectOrbitTime??a?.orbitTime??r,S.subjectOrbitRate=o?.motionTiming?.subjectOrbitRate??1,t.visible=!0,i.object=t,l&&D(l),!d||!f)return T(0),w(c),u;m===null&&(m=r);let p=Math.max(0,r-m),E=n.userData.writingDuration||2.35;return S.farewellTime=p,_===null&&(_=s?c:c-p+vt),T(s?E:p-vt),S.writingProgress===1&&v===null&&(v=s?c:_+E),w(c,s),u}}}var bt=80,$=12,xt=330,St=4.5,Ct=Math.hypot(-20-ue.x,-ue.z)*fe,wt=xt/Ct;function Tt(e){let n=new L,i=2106,a=new Float32Array(i*3),o=new Float32Array(i*3),s=new Float32Array(i*2),c=new Float32Array(i),l=[];for(let e=0;e<2;e++)for(let t=0;t<=bt;t++)for(let n=0;n<=$;n++){let r=(e*81+t)*13+n;if(s.set([t/bt,n/$],r*2),c[r]=e,t<bt&&n<$){let e=r+$+1;l.push(r,r+1,e,r+1,e+1,e)}}n.setAttribute(`position`,new B(a,3).setUsage(b)),n.setAttribute(`normal`,new B(o,3).setUsage(b)),n.setAttribute(`wakeUv`,new B(s,2)),n.setAttribute(`wakeSeed`,new B(c,1)),n.setIndex(l);let u={wakeTime:{value:0},wakeStrength:{value:1},wakeLifetime:{value:wt},wakeEye:{value:new r},wakeSun:{value:G}},d=new t({uniforms:u,transparent:!0,depthWrite:!1,depthTest:!0,toneMapped:!1,vertexShader:`attribute vec2 wakeUv; attribute float wakeSeed;
      varying vec2 wake; varying vec3 wakePosition,wakeNormal; varying float trailSeed;
      void main(){wake=wakeUv;trailSeed=wakeSeed;wakePosition=position;wakeNormal=normal;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform float wakeTime,wakeStrength,wakeLifetime; uniform vec3 wakeEye,wakeSun;
      varying vec2 wake; varying vec3 wakePosition,wakeNormal; varying float trailSeed;
      float hash(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
      float noise(vec3 p){
        vec3 cell=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(mix(hash(cell),hash(cell+vec3(1,0,0)),f.x),
                       mix(hash(cell+vec3(0,1,0)),hash(cell+vec3(1,1,0)),f.x),f.y),
                   mix(mix(hash(cell+vec3(0,0,1)),hash(cell+vec3(1,0,1)),f.x),
                       mix(hash(cell+vec3(0,1,1)),hash(cell+vec3(1,1,1)),f.x),f.y),f.z);
      }
      void main(){
        vec3 n=normalize(wakeNormal), view=normalize(wakeEye-wakePosition);
        // Front-facing density integrates through the tube, fading before its polygonal rim.
        float facing=max(0.,dot(n,view));
        float fresh=1.-smoothstep(.025,.18,wake.x);
        float silhouette=pow(facing,mix(1.8,1.2,fresh));
        vec2 around=vec2(cos(wake.y*6.2831853),sin(wake.y*6.2831853));
        // Noise follows emission time, not the moving airframe. Separate seeds stop paired stamps.
        float born=wakeTime-wake.x*wakeLifetime;
        vec3 p=vec3(born*2.8+trailSeed*47.3,around*1.85+trailSeed*11.7);
        float mature=smoothstep(.015,.22,wake.x);
        p.yz+=mature*vec2(sin(born*1.7+wakeTime*.53),cos(born*.93-wakeTime*.41))*1.35;
        p.x+=mature*.28*sin(around.x*3.1+around.y*2.7+wakeTime*.38+trailSeed*2.);
        float coarse=noise(p);
        float detail=noise(p*2.4+vec3(13.1,-5.7,9.2));
        float fine=noise(p*5.6+vec3(-7.3,19.2,4.8));
        float billows=coarse*.72+detail*.22+fine*.06;
        // Eroded lobes form gaps in old ice; the fresh dense core never becomes dashed.
        float erosion=mix(.34,.49,smoothstep(.06,.60,wake.x));
        float fragments=smoothstep(erosion,erosion+.18,billows+facing*.025);
        float coherentIce=(1.-smoothstep(.14,.58,wake.x))*(.28+.18*detail);
        fragments=max(fragments,coherentIce);
        fragments=mix(fragments,.88+.12*detail,fresh);
        float density=smoothstep(0.,.012,wake.x)*(1.-smoothstep(.52,1.,wake.x));
        float fringe=smoothstep(.04,.48,facing+(.5-billows)*mature*.42);
        float sun=smoothstep(-.6,.8,dot(n,wakeSun));
        float skylight=smoothstep(-.7,.6,n.y);
        float transmitted=pow(max(0.,-dot(view,wakeSun)),3.);
        float illumination=min(1.,.28+.40*sun+.19*skylight+.32*transmitted);
        vec3 colour=mix(vec3(.83,.49,.42),vec3(1.,.86,.69),illumination);
        // Thin fringes catch warm forward scattering while the recesses stay rose.
        float silverGold=pow(1.-facing,2.)*sun*(.25+.75*transmitted);
        colour=mix(colour,vec3(1.,.91,.73),silverGold*.55);
        colour=mix(colour,vec3(1.,.83,.66),fresh*(.64+.15*transmitted));
        colour*=.95+.05*detail;
        gl_FragColor=vec4(colour,silhouette*fringe*density*fragments*mix(.9,1.,fresh)*wakeStrength);
      }`}),f=new h(n,d);f.name=`Sunlit engine condensation wakes`,f.frustumCulled=!1,f.renderOrder=6;let p=new C,m=new C,g=new N,_=new N,v=new r(0,1,0),y=new r(Ve.east,0,Ve.south).applyQuaternion(ce),x=new r,S=new r,w=new r,T=new r,E=new r,D=new r,O=new Float32Array(13),k=new Float32Array(13);for(let e=0;e<=$;e++)O[e]=Math.cos(e/$*Math.PI*2),k[e]=Math.sin(e/$*Math.PI*2);let A={draws:1,triangles:3840,textureBytes:0,maximumLengthMetres:xt,formationGapMetres:St,lifetimeSeconds:wt,nozzleWidthMetres:2.1,nozzleHeightMetres:.945,maximumWidthMetres:22.93212,maximumHeightMetres:18.345696,independentEngineSeeds:!0,proceduralDensityOctaves:3,worldWindMetresPerSecond:y.toArray(),historicalEmission:!0,dissipateAfterClearanceSeconds:.9};return f.userData.contrails=A,{object:f,metrics:A,update(t,r,i=!1,s){let c=s?.exitTime==null?0:Math.max(0,s.departureTime-s.exitTime);if(u.wakeStrength.value=1-F.smoothstep(c,0,.9),f.visible=u.wakeStrength.value>0&&(e.visible||s?.exitTime!=null),!r||!f.visible)return;e.updateWorldMatrix(!0,!1);let l=i?0:s?.aircraftPathTime??t;se(l,p),p.updateMatrix(),g.copy(p.matrix).invert().premultiply(e.matrixWorld),u.wakeEye.value.copy(r.position);let d=i?0:t;u.wakeTime.value=d;for(let e=0;e<=bt;e++){let t=e/bt,n=t*wt,r=n+St/Ct,i=d-n;m.position.copy(p.position).sub(ue).applyAxisAngle(v,-r*fe).add(ue),m.rotation.set(-.032+Math.sin((l-r)/29)*.004,p.rotation.y-r*fe,.016,`YXZ`),m.scale.copy(p.scale),m.updateMatrix(),_.multiplyMatrices(g,m.matrix),x.set(1,0,0).transformDirection(_),S.set(0,0,1).transformDirection(_),w.crossVectors(S,x).normalize();for(let r=0;r<2;r++){let s=1.05+4.85*t**.6,c=.45+.35*F.smoothstep(t,.08,.42),l=F.smoothstep(t,.005,.1),u=1+l*(Math.sin(i*2.7+n*.95+r*2.3)*.42+Math.sin(i*6.3-n*.63+r*3.7)*.16);T.set(.9,-1.53,r?-5.465:4.885).applyMatrix4(_).addScaledVector(y,n),T.addScaledVector(S,(Math.sin(i*1.6+n*1.4+r*2.2)*5.2+Math.sin(i*3.9-n*.8+r*4.1)*1.4)*l),T.y+=(Math.cos(i*1.25-n*1.05+r*1.8)*2.8+Math.sin(i*2.8+n*.7+r*3.1)*.9)*l-t*t*1.8;for(let t=0;t<=$;t++){let d=O[t],f=k[t],p=t/$*Math.PI*2,m=1+l*(Math.sin(p*2+i*2.1+n*.9+r*2.7)*.14+Math.cos(p*3-i*1.3+n*.7+r*1.9)*.09);E.copy(S).multiplyScalar(d).addScaledVector(w,f/c).normalize(),D.copy(T).addScaledVector(S,d*s*u*m).addScaledVector(w,f*s*u*m*c);let h=((r*81+e)*13+t)*3;D.toArray(a,h),E.toArray(o,h)}}}n.attributes.position.needsUpdate=!0,n.attributes.normal.needsUpdate=!0}}}function Et(){let e=0,t=0;return{get rate(){return 1},get time(){return e},get orbitTime(){return t},get orbitRate(){return 1},snapshot(){return{time:e,orbitTime:t,rate:1,orbitRate:1}},projectedAdvance(e){return Math.max(0,e)},motionTiming(e={},n=0,r){return e.timeRate=e.subjectOrbitRate=1,e.subjectOrbitTime=(r?.orbitTime??t)+Math.max(0,n),e},advance(n){if(!Number.isFinite(n)||n<0)throw RangeError(`Flight pace delta must be finite and nonnegative`);return e+=n,t+=n,n},syncOrbit(e){t=e},reset(){e=t=0}}}function Dt(){let e=new L,n=[],i=[],a=[],o=[[-6100,3100,-10100,480],[-8500,2700,-14800,670],[3300,2800,-17300,410]],s=new r(-.6973,-.0606,-.7142).normalize(),l=new r(.715,0,-.699),u=new r,d=new r;for(let[e,t,r,c]of o){let o=n.length/3;u.set(e,t,r);for(let e of[0,1])for(let t of[-1,1])d.copy(u).addScaledVector(s,e*12e3).addScaledVector(l,c*t*(1+e*1.1)),n.push(...d),i.push(e,t);a.push(o,o+2,o+1,o+1,o+2,o+3)}e.setAttribute(`position`,new c(n,3)),e.setAttribute(`uv`,new c(i,2)),e.setIndex(a);let f={value:0},p=new t({uniforms:{shaftTime:f},transparent:!0,depthTest:!0,depthWrite:!1,side:2,toneMapped:!1,blending:2,vertexShader:`varying vec2 beam;void main(){beam=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 beam;uniform float shaftTime;
      void main(){
        float edge=pow(max(0.,1.-beam.y*beam.y),3.);
        float lengthFade=smoothstep(0.,.15,beam.x)*(1.-smoothstep(.4,1.,beam.x));
        float breath=.85+.15*sin(shaftTime/31.+beam.x*4.);
        gl_FragColor=vec4(1.,.72,.43,edge*lengthFade*breath*.065);
      }`}),m=new h(e,p);return m.name=`Warm shafts through mountain cloud gaps`,m.renderOrder=4,m.userData.shafts={draws:1,triangles:6,textureBytes:0},{object:m,update(e){f.value=e}}}var Ot=e=>`/thesis-defence/world/plane-africa/${e}`;async function kt({renderer:e,scheduler:t,signal:n,onProgress:r}){let i=new w,a=[],o=new Set;i.name=`Passenger flight over East Africa`;let s={object:null},c=!1,l=!1,u=null,d=!1,f,p,m,h,g,_,v,y,b=Et({subjectOrbit:le.motion.subjectOrbit,framing:le}),x=b.motionTiming();i.userData.cameraMotion=x;let S=ze(),C={progress:0,sunDirection:[0,0,0]};i.userData.evening=C;let E,D,O;async function k(e){let t=await fetch(e,{signal:n});if(!t.ok)throw Error(`Flight asset ${e}: ${t.status}`);return t.arrayBuffer()}async function A(r,i=!0,s=!1){let c=await k(s?`/thesis-defence/models/plane-africa/${r}`:Ot(r));W(n);let l=await createImageBitmap(new Blob([c]),{imageOrientation:s?`none`:`flipY`,premultiplyAlpha:`none`,colorSpaceConversion:`none`});o.add(l),W(n);let u=e.capabilities.maxTextureSize,d=Math.min(1,u/l.width,u/l.height);if(d<1){let e=await createImageBitmap(l,{resizeWidth:Math.max(1,Math.floor(l.width*d)),resizeHeight:Math.max(1,Math.floor(l.height*d)),resizeQuality:`high`,imageOrientation:`none`,premultiplyAlpha:`none`,colorSpaceConversion:`none`});o.add(e),o.delete(l),l.close(),l=e,W(n)}return t.run(`Decode ${r}`,()=>{let t=new V(l);return t.flipY=!1,t.colorSpace=i?T:``,t.anisotropy=e.capabilities.getMaxAnisotropy(),t.needsUpdate=!0,a.push(t),t})}function j(){if(c)return;c=!0;let e=new Set;i.traverse(t=>{for(let n of t.material?[].concat(t.material):[]){g&&n.envMap===g.texture&&(n.envMap=null);for(let t of Object.values(n))t?.isTexture&&e.add(t);for(let t of Object.values(n.uniforms||{}))t.value?.isTexture&&e.add(t.value)}});for(let t of e)t.image?.close&&o.add(t.image);y?.releaseCamera(),y?.setActive(!1),v?.disposeFont(),_?.dispose(),O?.dispose(),p?.dispose?.(),g?.dispose(),R(i),a.forEach(t=>{e.has(t)||t.dispose()}),o.forEach(e=>e.close()),i.clear()}try{let a=await k(`/thesis-defence/models/plane-africa/a320.glb`),o=await new ae().parseAsync(a,``);h=new w,h.name=`Airbus A320 by amvlab`,h.add(o.scene),i.add(h),W(n),se(0,h);let c=await A(`a320-dswb-livery.webp`,!0,!0);r(.15,`Passenger jet ready`),f=await Te({texture:A,scheduler:t,signal:n}),pe(f.object),i.add(f.object),i.userData.landscape=f.object.userData.landscape,p=await Xe({texture:A,scheduler:t,heightAt:f.heightAt,sunDirection:S.sun.value}),pe(p.object),i.add(p.object),O=et({renderer:e,clouds:p}),i.userData.cloudRenderPass=O.metrics,D=Dt(),pe(D.object),i.add(D.object),m=nt(S,f),i.add(m.object),r(.75,`Measured mountain and cloud volumes ready`),g=await t.run(`Filter warm sky reflections`,()=>rt(e));let T=await A(`a320-surface.webp`,!1,!0);_=await t.run(`Bake aircraft self-shadow`,()=>dt({jet:h,renderer:e,livery:c,surface:T,environment:g,evening:S})),i.userData.aircraftFinish=_.metrics,E=Tt(h),i.add(E.object),i.userData.contrails=E.metrics,v=await _t(),i.add(v.object),y=yt(h,v.object,s,b,{entranceRequired:!0}),i.userData.closing=y.state,r(1,`Africa closing ready`);function M(e,t,n){!l&&u===null&&(u=t-e);let r=l?0:Math.max(0,t-u),a=l?0:n?.shotTime??r;S.update(a),C.progress=S.progress.value,S.sun.value.toArray(C.sunDirection),y.setActive(d&&n?.shot===`planeAfrica`),se(a,h),y.setEntranceReady(l||!n?.moving,r),y.update(e,r,n,l,t),_.update(r,l),E.update(r,n?.camera,l,y.state),f.update(a,n?.camera),p.update(a,n?.camera,l,{time:r,departureSeconds:0,departing:!1}),D.update(a),m.update(n?.camera,a),i.userData.flightTime=r,i.userData.flightPathTime=a,i.userData.worldMotionRate=b.rate}return{id:`planeAfrica`,object:i,atmosphericSky:!0,depthCues:!1,anchors:{},subjects:{africaClosing:s},cameraClipping:{near:20,far:me},warmup:[{shot:`planeAfrica`,step:0},{shot:`planeAfrica`,step:1}],setStep(e){let t=e.shot??e.station,n=t===`planeAfrica`||t===`planeAfricaConclusions`;n&&!d&&(u=null,y.reset()),d=n,l=!!e.reduced,n||y.releaseCamera(),y.setActive(t===`planeAfrica`&&!e.preparing),y.setStep(t===`planeAfrica`?Math.min(1,e.step||0):0)},cameraAdvance(e,t){if(!t.moving){let t=b.advance(e);return b.motionTiming(x),t}return b.advance(e),b.syncOrbit(t.shotTime+e),b.motionTiming(x),x.timeRate=x.subjectOrbitRate=1,x.subjectOrbitTime=t.shotTime+e,e},cameraMotionTiming:x,get cameraRate(){return b.rate},prepare:O.prepare,resize:O.resize,renderBefore(e,t){O.renderBefore(t)},update:M,dispose:j}}catch(e){throw j(),e}}export{kt as default};