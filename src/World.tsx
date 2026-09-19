import React, { memo, useId } from 'react';
import { TrollBridge } from './TrollBridge';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Pattern, Rect, Stop } from 'react-native-svg';
import { WORLD, LESSONS, ROAD, SCENERY, SET_PIECES, AMBUSH, distance, type Theme } from './journey';

function Plant({x,y,seed,t}:{x:number;y:number;seed:number;t:Theme}) {
  const size=.8+(seed%4)*.17;
  return <G transform={`translate(${x},${y}) scale(${size})`}>
    <Ellipse cy="8" rx="29" ry="10" fill={t.ink} opacity=".1"/>
    {t.motif==='desert'?<><Path d="M-5 10V-58Q0-69 6-58V10M-4-18Q-26-10-26-33V-40M5-35Q24-24 24-47" fill="none" stroke={t.foliage} strokeWidth="12" strokeLinecap="round"/><Path d="M0-56V4" stroke={t.foliageLight} strokeWidth="2"/><Circle cx="1" cy="-64" r="5" fill="#db9a92"/></>:
    t.motif==='coast'?<><Path d="M-3 10Q12-26 2-57" stroke="#b39978" strokeWidth="8" fill="none"/><Path d="M2-58Q-35-76-40-34Q-18-59 2-58Q28-91 41-48Q17-68 2-58Q-19-92-22-54Q-9-70 2-58Q34-58 33-22Q15-49 2-58" fill={t.foliage}/><Path d="M2-58Q-12-68-26-54M2-58Q23-59 30-41" stroke={t.foliageLight} strokeWidth="3" fill="none"/></>:
    t.dark?<><Path d="M-30 10L-24-28L-9-69L8-47L26-13L33 9Z" fill={t.foliage}/><Path d="M-9-69L-5-13L-30 10L-24-28Z" fill={t.foliageLight}/><Path d="M-4-40L5-22L0-9L14 4" stroke={t.accent} strokeWidth="2" fill="none"/>{t.motif==='cave'&&<><Path d="M21 7V-9M-22 9V-2" stroke="#a6cbc1" strokeWidth="3"/><Path d="M9-8Q20-27 33-8ZM-31-1Q-22-15-13-1Z" fill={t.accent}/></>}</>:t.motif==='sky'?<><Path d="M-5 8L-23-26L-10-63L11-54L21-17L8 8Z" fill={seed%2?t.accent:'#acbadd'}/><Path d="M-10-63L-3-17L-5 8L-23-26Z" fill={'#d9d5f0'}/><Path d="M-10-63L11-54L-3-17Z" fill={'#eee8fa'}/><Path d="M28-23V-39M20-31H36" stroke="#fffaf2" strokeWidth="2"/></>:
    <><Path d="M-4 10L-3-34H4L6 10Z" fill="#947d62"/><Path d="M0-84L-23-49H-15L-34-17H-25L-37 0Q0 18 37 0L25-17H34L15-49H23Z" fill={seed%4===0?t.accent:t.foliage}/><Path d="M0-84L-8-39L-3-26L-15-2L4 4L9-25L4-42Z" fill={t.foliageLight} opacity=".7"/>{t.motif==='snow'&&<Path d="M0-84L-23-49L-10-50L0-61L10-50H23ZM-18-29L-34-17L-20-15L-8-26L3-19L15-26L29-17H34L18-40L3-36Z" fill="#f8fbff"/>}</>}
  </G>;
}
function Building({x,y,city,t,seed}:{x:number;y:number;city:boolean;t:Theme;seed:number}) {
  if(city)return <G transform={`translate(${x},${y})`}>
    <Ellipse cy="12" rx="55" ry="19" fill="#575b5a" opacity=".18"/>
    {seed%3!==1?<>
      <Path d="M-39 8V-98H-46V-126H-29V-113H-11V-126H8V-113H26V-126H44V-98H37V8Z" fill="#9ca09a"/>
      <Path d="M-39-96H37M-39-69H37M-39-42H37M-39-15H37M-14-96V-69M17-69V-42M-15-42V-15M16-15V8" stroke="#c4c4b8" strokeWidth="3"/>
      <Path d="M-46-103H44V-94H-46Z" fill="#c8c5b7"/>
      <Path d="M-11 9V-21Q0-40 11-21V9Z" fill="#585852"/><Path d="M-6-63V-79Q0-89 6-79V-63Z" fill="#4b5c60"/>
      <Path d="M24-93V-38L13-47L3-38V-93Z" fill={t.accent}/><Path d="M13-80V-56M7-69H19" stroke="#dfc88d" strokeWidth="3"/>
      <Path d="M-31-129V-153M-30-151H-6L-13-140H-30" stroke="#806b54" strokeWidth="2" fill={t.accent}/>
    </>:<>
      <Path d="M-43 7V-92L0-128L43-92V7Z" fill="#d9c7a8"/>
      <Path d="M-54-91L0-146L54-91L45-84L0-130L-45-84Z" fill="#647c85"/>
      <Path d="M-37 5V-92M37 5V-92M0 5V-129M-39-55H39M-37-92L37-55M37-92L-37-55M-37-52L0-11M37-52L0-11" stroke="#7c6954" strokeWidth="5"/>
      <Path d="M-12 8V-21Q0-39 12-21V8Z" fill="#675948"/>
      {[-21,21].map(cx=><G key={cx}><Path d={`M${cx-7}-62V-80Q${cx}-92 ${cx+7}-80V-62Z`} fill="#b1c0ae"/><Path d={`M${cx}-84V-63`} stroke="#6c715e" strokeWidth="2"/></G>)}
    </>}
  </G>;
  const h=56;
  return <G transform={`translate(${x},${y})`}>
    <Ellipse cy="15" rx="57" ry="20" fill={t.ink} opacity=".12"/>
    <Rect x="-45" y={-h} width="90" height={h+8} rx="3" fill={city?'#c7b9a6':'#e7d6b7'}/>
    <Path d={`M-54 ${-h}L0 ${-h-37}L54 ${-h}L44 ${-h+7}H-44Z`} fill={seed%2?t.accent:city?'#7e777f':'#8f735e'}/>
    <Path d={`M-39 ${-h+8}V6M39 ${-h+8}V6M-40 -16H40`} stroke={city?'#e4d8c7':'#967952'} strokeWidth="5"/>
    {Array.from({length:city?3:1},(_,i)=><G key={i}>{[-23,23].map(cx=><G key={cx}><Rect x={cx-8} y={-h+18+i*28} width="16" height="18" rx="3" fill="#7b9898"/><Path d={`M${cx} ${-h+19+i*28}v16`} stroke="#e8ddc6" strokeWidth="2"/></G>)}</G>)}
    <Path d="M-9 8V-18Q0-29 9-18V8Z" fill="#736961"/>
    {!city&&<><Path d="M-58 21H58M-58 32H58M-52 14V39M-31 14V39M31 14V39M52 14V39" stroke="#b49d75" strokeWidth="3"/><Ellipse cx="-37" cy="4" rx="17" ry="10" fill={t.foliage}/></>}
  </G>;
}
function DragonSkull({scale=1}:{scale?:number}) {
  return <G transform={`scale(${scale})`}>
    <Ellipse cy="10" rx="43" ry="25" fill="#977b5d" opacity=".18"/>
    <Path d="M-24-22Q-44-41-45-64Q-31-44-12-39M24-22Q44-41 45-64Q31-44 12-39" fill="#e4d6b4" stroke="#b6a080" strokeWidth="2"/>
    <Path d="M-31-25Q-27-49 0-44Q27-49 31-25L26-4L15 9L12 29H-12L-15 9L-26-4Z" fill="#eee2c2" stroke="#bba98c" strokeWidth="2"/>
    <Path d="M-25-25Q-12-30-7-12L-22-8ZM25-25Q12-30 7-12L22-8Z" fill="#7c705f"/>
    <Path d="M-5 12L-8 23H-1L0 14L2 23H9L5 12Z" fill="#8e7b61"/>
    <Path d="M-24-4L-21 12L-16 3M24-4L21 12L16 3M-10 28V36L-4 29M10 28V36L4 29" fill="#fff2d0"/>
    <Path d="M0-41L-4-27L2-19L-2-5" stroke="#c2b193" strokeWidth="2" fill="none"/>
  </G>;
}
function Bones(){return <G stroke="#e7d8b8" strokeWidth="5" fill="none" strokeLinecap="round"><Path d="M-29 8L29-8M-18 4Q-25-23-8-22M-7 0Q-13-28 3-26M5-4Q1-31 15-28M16-6Q15-27 26-24M-18 4Q-14 25-2 23M-6 0Q1 23 11 19M5-4Q14 18 23 12"/><Path d="M-36 22L-20 32M-34 30L-23 22" strokeWidth="4"/></G>}
const roadPath=()=>{
  let d=`M${ROAD[0].x} ${ROAD[0].y}`;
  for(let i=1;i<ROAD.length-1;i++){const p=ROAD[i],next=ROAD[i+1];d+=`Q${p.x} ${p.y} ${(p.x+next.x)/2} ${(p.y+next.y)/2}`;}
  return d+`L${ROAD.at(-1)!.x} ${ROAD.at(-1)!.y}`;
};
export const World = memo(function World({theme:t}:{theme:Theme}) {
  const id=useId().replace(/:/g,'');
  const road=roadPath(),urban=t.motif==='city'||t.motif==='town';
  const lava='M865 2220L814 2020L851 1850L806 1685L857 1480L815 1220L865 1050L827 790L870 550L809 300';
  return <Svg width={WORLD.width} height={WORLD.height} viewBox={`0 0 ${WORLD.width} ${WORLD.height}`}>
    <Defs><LinearGradient id={`ground${id}`} x2="0" y2="1"><Stop stopColor={t.ground}/><Stop offset="1" stopColor={t.groundLight}/></LinearGradient><Pattern id={`cobbles${id}`} width="36" height="26" patternUnits="userSpaceOnUse"><Rect x="1" y="1" width="16" height="10" rx="4" fill="#aaa99e" stroke="#8f928a" strokeWidth=".8"/><Rect x="19" y="1" width="16" height="10" rx="4" fill="#b8b5a8" stroke="#8f928a" strokeWidth=".8"/><Rect x="-8" y="14" width="16" height="10" rx="4" fill="#bcb9ad" stroke="#8f928a" strokeWidth=".8"/><Rect x="10" y="14" width="16" height="10" rx="4" fill="#a4a89f" stroke="#8f928a" strokeWidth=".8"/><Rect x="28" y="14" width="16" height="10" rx="4" fill="#bcb9ad" stroke="#8f928a" strokeWidth=".8"/></Pattern></Defs>
    <Rect width={WORLD.width} height={WORLD.height} fill={`url(#ground${id})`}/>
    {Array.from({length:10},(_,i)=><Path key={i} d={`M-80 ${i*245}Q230 ${i*245-100} 430 ${i*245+60}T1000 ${i*245+20}L1000 ${i*245+125}Q605 ${i*245+150} 295 ${i*245+90}T-80 ${i*245+130}Z`} fill={i%2?t.groundLight:t.foliageLight} opacity={t.motif==='desert'?.3:.13}/>)}
    {t.motif==='coast'&&<><Path d="M0 0H73Q21 198 75 400T34 860T65 1200T45 1670T70 2180H0Z" fill={t.water}/><Path d="M57 0Q10 198 64 400T23 860T54 1200T34 1670T59 2180" stroke="#ffffff99" strokeWidth="4" fill="none"/></>}
    {t.motif==='volcanic'&&<>
      <Path d={lava} stroke="#101015" strokeWidth="72" fill="none"/><Path d={lava} stroke="#b63820" strokeWidth="35" fill="none"/><Path d={lava} stroke="#f98137" strokeWidth="16" fill="none"/><Path d={lava} stroke="#ffd074" strokeWidth="4" fill="none"/>
      {[{x:235,y:2050},{x:600,y:1810},{x:240,y:1450},{x:680,y:1060},{x:260,y:670}].map((p,i)=><G key={i} transform={`translate(${p.x},${p.y})`}><Ellipse rx="55" ry="24" fill="#ef5819" opacity=".07"/><Path d="M-42-8L-19 0L-8-17L3 1L37 15M3 1L-6 20M-19 0L-25 15" stroke="#923825" strokeWidth="5" fill="none"/><Path d="M-42-8L-19 0L-8-17L3 1L37 15" stroke="#ef9149" strokeWidth="1.5" fill="none"/></G>)}
    </>}
    {t.motif==='cave'&&<>
      {[{x:195,y:2020},{x:720,y:1490},{x:180,y:930},{x:755,y:380}].map((p,i)=><G key={i} transform={`translate(${p.x},${p.y})`}><Ellipse rx="68" ry="34" fill="#192228"/><Ellipse rx="54" ry="25" fill={t.water} opacity=".7"/><Path d="M-31-1Q0 12 34-1M-19 12H12" fill="none" stroke={t.accent} strokeWidth="2" opacity=".5"/></G>)}
      {[0,1].map(side=><Path key={side} d={`M${side?920:0} 0V2180H${side?840:80}Q${side?790:130} 1900 ${side?850:70} 1630T${side?835:85} 1090T${side?850:70} 545T${side?835:85} 0Z`} fill="#151c23"/>)}
    </>}
    {(t.motif==='castle'||t.motif==='city')&&[30,840].map(x=><G key={x}><Rect x={x} y="260" width="48" height="1740" rx="8" fill="#c1bcb2" opacity=".6"/>{Array.from({length:24},(_,i)=><G key={i}><Rect x={x-5} y={260+i*74} width="57" height="13" fill="#ddd3c0"/><Path d={`M${x+24} ${273+i*74}v50`} stroke="#eee3d0" strokeWidth="2"/></G>)}</G>)}
    {t.motif==='snow'&&Array.from({length:55},(_,i)=><Ellipse key={i} cx={(i*91)%920} cy={(i*263)%2180} rx={25+i%3*14} ry="8" fill="#fff" opacity=".45"/>)}
    {t.motif==='sky'&&Array.from({length:23},(_,i)=><G key={i} opacity=".6"><Ellipse cx={i%2?887:28} cy={i*103} rx="53" ry="20" fill="#fff"/><Ellipse cx={i%2?865:59} cy={i*103-8} rx="28" ry="19" fill="#fff"/></G>)}
    {t.motif==='city'&&<Rect x="95" y="270" width="730" height="1910" fill={`url(#cobbles${id})`} opacity=".3"/>}
    <Path d={road} stroke={t.dark?'#14151b':t.ink} opacity={t.dark?.5:.06} strokeWidth="72" fill="none"/>
    <Path d={road} stroke={t.path} strokeWidth={urban?63:53} strokeLinecap="round" fill="none"/>
    {LESSONS.map((p,i)=>{const nearest=ROAD.reduce((best,q)=>distance(p,q)<distance(p,best)?q:best,ROAD[0]);return <Path key={i} d={`M${nearest.x} ${nearest.y}Q${p.x} ${nearest.y} ${p.x} ${p.y}`} stroke={t.path} strokeWidth={30} fill="none" strokeLinecap="round"/>})}
    {t.motif==='city'&&<><Path d={road} stroke={`url(#cobbles${id})`} strokeWidth="60" fill="none"/>{LESSONS.map((p,i)=><G key={i}><Ellipse cx={p.x} cy={p.y+5} rx="76" ry="38" fill="#c3bbb0"/><Ellipse cx={p.x} cy={p.y+5} rx="65" ry="30" fill="none" stroke="#e8dfd0" strokeWidth="3"/></G>)}</>}
    <Path d="M-10 155Q160 107 320 149T601 151T930 120L930 212Q678 246 533 209T312 212T-10 207Z" fill={t.motif==='volcanic'?'#f27632':t.motif==='desert'?'#9c8583':t.water}/>
    <Path d="M8 167Q122 140 288 167M580 183Q701 201 878 167" stroke={t.dark?t.accent:'#ffffff66'} strokeWidth="3" fill="none"/>
    {urban?Array.from({length:t.motif==='city'?24:16},(_,i)=><Building key={i} x={i%2?810:110} y={350+Math.floor(i/2)*(t.motif==='city'?155:235)} city={t.motif==='city'} t={t} seed={i}/>):Array.from({length:70},(_,i)=><Plant key={i} x={i%2?830+(i*17)%65:20+(i*13)%70} y={88+i*31} seed={i} t={t}/>)}
    {SET_PIECES.map((p,i)=>urban?<Building key={i} x={p.x} y={p.y} city={t.motif==='city'} t={t} seed={i}/>:t.motif==='desert'&&i===0?<G key={i} transform={`translate(${p.x},${p.y})`}><DragonSkull scale={1.15}/></G>:<G key={i}><Plant x={p.x-19} y={p.y-12} seed={i} t={t}/><Plant x={p.x+18} y={p.y+10} seed={i+1} t={t}/></G>)}
    {SCENERY.map((p,i)=><G key={i} transform={`translate(${p.x},${p.y})`}>
      <Ellipse cy="6" rx={p.r+7} ry={p.r*.7} fill={t.dark?'#101217':t.ink} opacity=".2"/>
      {t.motif==='desert'&&p.kind==='rock'&&i===2?<Bones/>:t.motif==='city'&&p.kind==='rock'?<><Ellipse rx={p.r} ry={p.r*.7} fill="#a8a298"/><Ellipse cy="-4" rx={p.r-5} ry={p.r*.54} fill={t.water}/><Path d="M-5-5L-3-37H4L7-5Z" fill="#d3c9b7"/><Ellipse cy="-37" rx="13" ry="6" fill="#e4daca"/><Path d="M-11-35Q-20-23-22-8M11-35Q20-23 22-8" stroke="#c0e3df" strokeWidth="2" fill="none"/></>:
      urban&&p.kind==='tree'?<><Rect x="-26" y="-10" width="52" height="15" rx="3" fill="#a48c73"/><Path d="M-21 4V13M21 4V13M-22-12V-31H22V-12" stroke="#7e7e70" strokeWidth="4" fill="none"/><Path d="M0-11V-72" stroke="#747773" strokeWidth="3"/><Rect x="-7" y="-82" width="14" height="19" rx="3" fill="#e9d29d" stroke="#747773" strokeWidth="3"/></>:
      p.kind==='tree'&&!urban?<Plant x={0} y={0} seed={i} t={t}/>:
      p.kind==='planter'&&!t.dark?<><Ellipse rx={p.r} ry={p.r*.67} fill={urban?'#a18a72':t.foliage}/><Ellipse cy="-7" rx={p.r-5} ry={p.r*.55} fill={t.foliageLight}/>{[-15,0,15].map(x=><Circle key={x} cx={x} cy={-9+(x%3)} r="4" fill={t.accent}/>)}</>:
      <><Path d={`M${-p.r} 5L${-p.r*.8} ${-p.r*.55}L${-p.r*.15} ${-p.r}L${p.r*.7} ${-p.r*.65}L${p.r} 3L${p.r*.55} ${p.r*.6}L${-p.r*.6} ${p.r*.6}Z`} fill={t.dark?t.foliage:t.motif==='desert'?'#bc9d79':urban?'#a79a89':'#a4aba0'}/><Path d={`M${-p.r*.8} ${-p.r*.55}L0 -7L${-p.r*.15} ${-p.r}M0 -7L${p.r} 3M0 -7L${p.r*.55} ${p.r*.6}`} stroke={t.dark?t.foliageLight:t.motif==='desert'?'#ddc3a0':'#c7c8b7'} strokeWidth="3" fill="none"/>{t.dark&&<Path d="M-6-20L3-9L-2 1L7 11" stroke={t.accent} strokeWidth="2" fill="none"/>}</>}
    </G>)}
    {Array.from({length:170},(_,i)=>{const x=100+(i*137)%730,y=285+(i*83)%1830;return urban?<Circle key={i} cx={x} cy={y} r="1" fill={t.foliage} opacity=".15"/>:t.dark?<G key={i} opacity=".45"><Circle cx={x} cy={y} r={i%4===0?1.8:.8} fill={i%5===0?t.accent:t.foliageLight}/>{i%9===0&&<Path d={`M${x} ${y}l8-3 7 6`} stroke={t.foliageLight} fill="none"/>}</G>:<G key={i} opacity=".4"><Path d={`M${x} ${y}l-3-6m3 6l4-5`} stroke={t.foliage} strokeWidth="1.5" strokeLinecap="round"/>{i%3===0&&<Circle cx={x+4} cy={y-8} r="2" fill={i%6===0?t.accent:'#fffdf0'}/>}</G>})}
    <G opacity=".65">{[0,1,2,3,4].map(i=><Path key={i} d={`M${AMBUSH.x-40+i*22} ${AMBUSH.y+12+i%2*9}l-4-24m4 24l12-27m-12 27l-13-19`} stroke={t.foliageLight} strokeWidth="3" fill="none" strokeLinecap="round"/>)}</G>
  </Svg>;
});

export function LandmarkArt({kind,index=0,theme:t,ready=false,done=false}:{kind:'lesson'|'wagon'|'chest'|'gate'|'battle';index?:number;theme:Theme;ready?:boolean;done?:boolean}) {
  if(kind==='gate'&&t.motif==='forest')return <TrollBridge ready={ready}/>;
  const color=done?'#8ba688':t.accent;
  return <Svg width="100%" height="100%" viewBox="0 0 120 120">
    <Ellipse cx="60" cy="99" rx="43" ry="12" fill={t.ink} opacity=".13"/>
    {kind==='wagon'?<>
      <Path d="M19 86H107V94H19Z" fill="#8c705b"/><Path d="M21 57H96V86H21Z" fill="#c4a078"/>
      <Path d="M18 62V45Q19 19 46 18H73Q99 17 99 43V63Z" fill={t.accent}/>
      <Path d="M30 60V43Q29 25 48 22M49 60V40Q49 23 57 20M70 59V38Q70 21 66 20M88 59V43Q88 28 79 23" stroke="#e7d9ed" strokeWidth="5" fill="none" opacity=".62"/>
      <Path d="M79 86V54a11 11 0 0 1 22 0V86Z" fill={ready?'#ffdf98':'#795e62'}/>
      {ready&&<><Path d="M81 58L70 61V90L81 85Z" fill="#775b73"/><Path d="M81 91L73 104H109L100 91Z" fill="#f5d7a4" opacity=".7"/><Path d="M87 25Q77 13 92 8" stroke="#fffcf3" strokeWidth="6" fill="none" opacity=".8"/></>}
      <Path d="M79 92H104M77 97H108" stroke="#a88863" strokeWidth="4"/>
      {[35,78].map(x=><G key={x}><Circle cx={x} cy="92" r="12" fill="#675963"/><Circle cx={x} cy="92" r="7" fill="#bca589"/><Path d={`M${x} 85V99M${x-7} 92H${x+7}`} stroke="#6d5e62" strokeWidth="2"/></G>)}
      <Rect x="27" y="67" width="24" height="15" rx="4" fill="#eee0c0"/><Path d="M39 70V78M35 74H43" stroke={t.accent} strokeWidth="2"/>
      <Path d="M107 52V73" stroke="#847054" strokeWidth="2"/><Rect x="102" y="60" width="10" height="13" rx="3" fill={ready?'#ffd878':'#a7a294'}/>{ready&&<Circle cx="107" cy="67" r="16" fill="#ffdf882d"/>}
    </>:kind==='chest'?<>
      <Rect x="28" y="62" width="64" height="35" rx="7" fill={t.accent}/>
      <Path d={done?'M28 54L34 26H88L92 54Z':'M28 65V55Q28 39 42 39H77Q92 39 92 55V65Z'} fill="#c2aada" stroke="#e5d8ee" strokeWidth="3"/>
      <Path d="M43 64V95M77 64V95" stroke="#e4d7ed" strokeWidth="7"/>
      {done?<><Ellipse cx="60" cy="62" rx="28" ry="7" fill="#665270"/><Path d="M54 38L59 22L66 38L82 42L67 49L61 66L54 50L39 45Z" fill="#ffe0a2"/></>:<Rect x="53" y="62" width="14" height="19" rx="4" fill="#f2d9a0"/>}
    </>:kind==='battle'?<>
      <Ellipse cx="60" cy="89" rx="37" ry="17" fill={done?'#b8d5b5':'#d2b7ec'} opacity=".6"/><Ellipse cx="60" cy="88" rx="29" ry="11" stroke={color} strokeWidth="2" fill="none"/>
      {done?<Path d="M42 61L55 75L80 42" fill="none" stroke="#70916d" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>:<><Path d="M36 33L80 78M83 31L39 78" stroke="#faf5ec" strokeWidth="12" strokeLinecap="round"/><Path d="M36 33L80 78M83 31L39 78M28 68L48 87M70 86L91 64" stroke={t.accent} strokeWidth="5" strokeLinecap="round"/></>}
    </>:kind==='gate'?<>
      {(t.motif==='castle'||t.motif==='town')?<>
        <Path d="M10 101V30H22V20H34V30H46V101M76 101V30H88V20H100V30H112V101" fill="#bcb2a7"/>
        <Path d="M38 44Q60 19 85 44V56Q60 36 38 56Z" fill="#d8cab5"/>
        <Path d="M13 52H44M12 77H44M77 52H111M78 77H111" stroke="#e9dcc7" strokeWidth="3"/>
        <Path d="M17 16V-1M92 16V-1" stroke="#947a65" strokeWidth="2"/><Path d="M18 0H38L34 13H18M93 0H111L108 13H93" fill={t.accent}/>
        {!ready&&<><Path d="M44 52V101M55 46V101M66 46V101M78 51V101M43 63H80M43 80H80M43 96H80" stroke="#8b8085" strokeWidth="4"/><Rect x="54" y="68" width="14" height="15" rx="3" fill="#e0bd78"/></>}
      </>:t.motif==='forest'||t.motif==='coast'||t.motif==='city'?<>
        <Path d="M22 22H35V104H22M87 22H99V104H87" fill="#9d8467"/>
        {ready?<><Path d="M32 17H88V104H32Z" fill="#a88b66"/>{[25,40,55,70,85,100].map(y=><Path key={y} d={`M34 ${y}H86`} stroke="#dfc69a" strokeWidth="11"/>)}</>:<><Path d="M32 65H88V103H32Z" fill="#957555"/>{[70,83,96].map(y=><Path key={y} d={`M34 ${y}H86`} stroke="#cfb287" strokeWidth="9"/>)}<Path d="M24 23L36 71M96 23L85 71" stroke="#6c6c69" strokeWidth="3"/></>}
        <Circle cx="29" cy="20" r="8" fill="#cab48e"/><Circle cx="93" cy="20" r="8" fill="#cab48e"/>
      </>:(t.motif==='desert'||t.motif==='volcanic')?<G transform={ready?'translate(32,0) scale(.65)':'translate(0,0)'}><Path d="M14 81L22 44L50 23L90 39L106 74L89 97L35 103Z" fill={t.dark?'#403a43':'#ae927c'}/><Path d="M22 44L57 59L50 23M57 59L89 97M57 59L106 74" stroke={t.dark?'#70616b':'#d5bca3'} strokeWidth="4" fill="none"/><Path d="M59 37L64 50L57 67L67 77" stroke="#877569" strokeWidth="3" fill="none"/></G>:
      t.motif==='snow'?<><Path d="M19 103V45Q60-13 103 45V103H85V51Q60 15 37 51V103Z" fill="#a1bdd3"/><Path d="M25 101V47Q60 1 96 47" stroke="#e9f8ff" strokeWidth="8" fill="none"/>{!ready&&<Path d="M34 102L39 45L57 25L76 46L89 103Z" fill="#cceaf5" opacity=".9"/>}</>:
      <><Path d="M19 103V45Q60-13 103 45V103H85V51Q60 15 37 51V103Z" fill={t.dark?t.foliageLight:'#a494c2'}/>{!ready&&<><Ellipse cx="60" cy="69" rx="26" ry="35" fill={t.dark?t.accent:'#c6b0e5'} opacity=".85"/><Path d="M60 41L66 57L82 63L67 70L62 88L54 72L39 66L53 57Z" fill="#fff1c5"/></>}</>}
    </>:index%3===0?<>
      <Path d="M22 89L29 43H88L99 89Z" fill={t.dark?'#62575c':'#e7d7bc'}/><Path d="M16 46L60 9L104 46L92 52H27Z" fill={color}/><Path d="M29 44L60 17L90 45" stroke="#e3d7ed" strokeWidth="3" fill="none"/><Path d="M50 91V68a11 11 0 0 1 22 0V91Z" fill={ready?'#ffe0a1':'#8c7b78'}/><Rect x="30" y="63" width="12" height="14" rx="4" fill="#b4c8ba"/><Path d="M48 95H76" stroke="#b8a68a" strokeWidth="4"/>
    </>:index%3===1?<>
      <Path d="M27 70L33 43H84L94 72V88Q60 109 26 88Z" fill={t.dark?'#645b64':'#c6bbaa'}/><Ellipse cx="60" cy="69" rx="34" ry="16" fill={t.dark?'#8a7c80':'#e6dccb'}/><Ellipse cx="60" cy="69" rx="25" ry="10" fill={ready?t.water:'#939c94'}/><Path d="M31 65V27M87 64V26M25 28H94" stroke="#b39374" strokeWidth="6"/><Path d="M60 28V61" stroke="#9a8a73" strokeWidth="2"/><Path d="M23 29L60 8L96 29Z" fill={color}/><Circle cx="60" cy="75" r="4" fill={ready?'#ffefb7':'#cad2c4'}/>
    </>:<>
      <Path d="M21 99V51Q20 37 34 37H43V100M78 100V38H89Q102 38 102 51V99" fill={t.dark?'#5c5763':'#b7b5b4'}/><Path d="M28 41Q60-6 95 41L86 49Q61 17 39 48Z" fill={t.dark?'#8a7d86':'#d5cdc1'}/><Path d="M23 60H43M21 78H42M80 56H101M80 75H102" stroke="#e9e0d1" strokeWidth="3"/><Ellipse cx="61" cy="84" rx="13" ry="8" fill={ready?'#eac781':'#a6aea2'}/><Path d="M24 91Q8 54 32 40M96 93Q111 62 94 52" stroke={t.foliage} strokeWidth="4" fill="none"/>
    </>}
    {done&&kind!=='gate'&&<G><Circle cx="98" cy="29" r="12" fill="#7b9f7a" stroke="#fffdf1" strokeWidth="3"/><Path d="M92 29L96 33L104 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/></G>}
  </Svg>;
}
