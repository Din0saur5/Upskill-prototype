export type Point = { x: number; y: number };
export type Theme = {
  id: string; name: string; subtitle: string; motif: 'forest' | 'coast' | 'desert' | 'snow' | 'sky' | 'volcanic' | 'castle' | 'city' | 'town' | 'cave';
  dark?: boolean;
  ground: string; groundLight: string; accent: string; foliage: string; foliageLight: string;
  path: string; water: string; ink: string; obstacle: string; clearing: string; lessons: string[];
};
export const THEMES: Theme[] = [
  { id:'woods', name:'Whispering Woods', subtitle:'Follow a little curiosity', motif:'forest', ground:'#dce7c7', groundLight:'#edf0d8', accent:'#9577b5', foliage:'#638a74', foliageLight:'#a9bd91', path:'#f2e3c2', water:'#9ac6c7', ink:'#3d5748', obstacle:'Drawbridge', clearing:'The bridge lowers', lessons:['Lantern clearing','The old well','Mossy archive','Fern pavilion','The stone circle','Willow workshop','Watchtower hollow','The hidden library','The wisdom tree'] },
  { id:'coast', name:'Pearlwater Coast', subtitle:'Let wonder wash ashore', motif:'coast', ground:'#ece6cf', groundLight:'#f8f0dd', accent:'#599d9e', foliage:'#719b8a', foliageLight:'#9cc5a4', path:'#fff7e8', water:'#7ec5ce', ink:'#365d60', obstacle:'Tide gate', clearing:'The tide gate opens', lessons:['Shellfire camp','The pearl well','Coral archive','Sailcloth pavilion','The tide circle','Driftwood workshop','Seabird lookout','The chart room','The old lighthouse'] },
  { id:'desert', name:'Amberdune Oasis', subtitle:'Every horizon holds a story', motif:'desert', ground:'#ead2ae', groundLight:'#f7e5c6', accent:'#b77659', foliage:'#8aab89', foliageLight:'#b6c199', path:'#f9efd9', water:'#85b5ac', ink:'#765745', obstacle:'Fallen boulder', clearing:'The boulder rolls aside', lessons:['Caravan clearing','The oasis well','Sandstone archive','Silk pavilion','The sundial circle','Copper workshop','Dune watchtower','The scroll house','The sun temple'] },
  { id:'snow', name:'Frostlight Highlands', subtitle:'Small sparks in a quiet world', motif:'snow', ground:'#dde7ef', groundLight:'#f4f6fa', accent:'#7e8fc2', foliage:'#789ca4', foliageLight:'#b3c9cc', path:'#fdf9ef', water:'#a9cbde', ink:'#4c637d', obstacle:'Frozen arch', clearing:'The ice melts away', lessons:['Ember clearing','The glacial well','Frostbound archive','Woollen pavilion','The aurora circle','Hearth workshop','Snowbell lookout','The winter library','The northern beacon'] },
  { id:'sky', name:'Starlit Sanctuary', subtitle:'A little closer to the impossible', motif:'sky', ground:'#dcd7ef', groundLight:'#eeebfa', accent:'#9875c8', foliage:'#9c92c4', foliageLight:'#c6b9e1', path:'#f8eddb', water:'#b6b3df', ink:'#61537e', obstacle:'Star seal', clearing:'The star seal dissolves', lessons:['Stardust clearing','The wishing well','Moonstone archive','Cloud pavilion','The orbit circle','Starlight workshop','Comet lookout','The dream library','The celestial observatory'] },
  { id:'volcanic', name:'Emberfall Crater', subtitle:'Great ideas begin with a spark', motif:'volcanic', dark:true, ground:'#211e25', groundLight:'#30292d', accent:'#dc8c54', foliage:'#39323c', foliageLight:'#595059', path:'#514446', water:'#f57232', ink:'#674d46', obstacle:'Basalt barrier', clearing:'The basalt barrier moves', lessons:['Cinder clearing','The spring well','Basalt archive','Ember pavilion','The lava circle','Obsidian workshop','Crater watchtower','The ash library','The fire beacon'] },
  { id:'castle', name:'Rosekeep Citadel', subtitle:'A kingdom built one idea at a time', motif:'castle', ground:'#d9dfcf', groundLight:'#eee8d6', accent:'#a47e9c', foliage:'#77947b', foliageLight:'#b6c39d', path:'#ece1ce', water:'#a1bcc0', ink:'#576452', obstacle:'Castle portcullis', clearing:'The portcullis rises', lessons:['Market square','The wishing well','The royal archive','Garden pavilion','The round table','Guild workshop','The watchtower','The grand library','The crown observatory'] },
  { id:'city', name:'Gildhaven City', subtitle:'Cobblestones, castle walls, and curious minds', motif:'city', ground:'#d9d3cd', groundLight:'#eee6dc', accent:'#6c7d96', foliage:'#8faaa0', foliageLight:'#bfcdc0', path:'#c2bbb3', water:'#88b7bb', ink:'#495966', obstacle:'Canal bridge', clearing:'The canal bridge lowers', lessons:['Market square','The fountain court','The civic archive','The grand arcade','The clock plaza','Artisan guild','The bell tower','The reading room','The royal academy'] },
  { id:'town', name:'Bramblewick Town', subtitle:'Small streets, familiar faces', motif:'town', ground:'#d9e2bb', groundLight:'#eff0d5', accent:'#ae785d', foliage:'#799363', foliageLight:'#b7c78e', path:'#e7ceb0', water:'#92babc', ink:'#5d6447', obstacle:'Village gate', clearing:'The village gate opens', lessons:['Village green','The wishing well','The bookshop','Market stall','The gathering circle','The potter’s workshop','Windmill hill','The schoolhouse','The old town hall'] },
  { id:'cave', name:'Hollowglow Caverns', subtitle:'Wonder waits beneath the surface', motif:'cave', dark:true, ground:'#22282f', groundLight:'#303843', accent:'#79c7bf', foliage:'#485464', foliageLight:'#728094', path:'#4a545f', water:'#41778b', ink:'#4c6473', obstacle:'Crystal barrier', clearing:'The crystals part', lessons:['Glowcap clearing','The echo well','The buried archive','Lantern refuge','The crystal circle','The miner’s workshop','The stone lookout','The deep library','The heart of the cavern'] },
];
export const WORLD = { width:920, height:2180 };
export const START: Point = {x:450,y:2040};
export const ORIN: Point = {x:570,y:1260};
export const EXIT: Point = {x:460,y:218};
export const AMBUSH: Point = {x:445,y:1640};
export const CHESTS: Point[] = [{x:740,y:1830},{x:145,y:1080},{x:755,y:500}];
export const LESSONS: Point[] = [{x:260,y:1930},{x:650,y:1760},{x:300,y:1580},{x:580,y:1390},{x:260,y:1170},{x:630,y:980},{x:270,y:790},{x:650,y:600},{x:460,y:400}];
export const ROAD:Point[] = [{x:450,y:2200},{x:455,y:2020},{x:340,y:1940},{x:650,y:1795},{x:475,y:1660},{x:360,y:1585},{x:580,y:1440},{x:520,y:1280},{x:338,y:1200},{x:535,y:1040},{x:630,y:1010},{x:348,y:830},{x:570,y:635},{x:460,y:450},{x:460,y:80}];
export type Scenery = Point & {r:number; kind:'rock'|'tree'|'planter'};
export const SCENERY:Scenery[] = [
  {x:420,y:1980,r:30,kind:'rock'},{x:690,y:1910,r:23,kind:'tree'},
  {x:490,y:1730,r:36,kind:'rock'},{x:680,y:1640,r:31,kind:'planter'},
  {x:245,y:1490,r:30,kind:'tree'},{x:655,y:1325,r:33,kind:'rock'},
  {x:300,y:1060,r:31,kind:'planter'},{x:530,y:970,r:25,kind:'rock'},
  {x:270,y:900,r:28,kind:'tree'},{x:530,y:690,r:32,kind:'rock'},
  {x:350,y:530,r:27,kind:'planter'},{x:580,y:370,r:30,kind:'rock'},
];
export const SET_PIECES = [{x:605,y:2070,r:50},{x:190,y:1830,r:50},{x:755,y:1680,r:50},{x:185,y:1430,r:50},{x:770,y:1130,r:50},{x:165,y:900,r:50},{x:755,y:735,r:50},{x:195,y:510,r:50}];
export const COLLIDERS = [...SCENERY,...SET_PIECES,...LESSONS.map(p=>({x:p.x,y:p.y-10,r:30})),{x:ORIN.x,y:ORIN.y-12,r:39},...CHESTS.map(p=>({...p,r:22}))];
export const approach=(point:Point):Point=>point.y<250?{x:point.x,y:point.y+65}:{x:point.x+(point.x>WORLD.width/2?-78:78),y:point.y+30};
export type Battle = { point:Point; complete:boolean };
export type Progress = { lessons:number; orin:boolean; chests:number[]; revealed:number[]; battle:Battle|null };
export type Stage = 'fresh' | 'orin' | 'final' | 'exit';
export const newProgress = ():Progress => ({lessons:0,orin:false,chests:[],revealed:[],battle:null});
export const distance = (a:Point,b:Point) => Math.hypot(a.x-b.x,a.y-b.y);
export const IN_RANGE=92;
export const DISCOVERY_RANGE=88;
export function revealDiscoveries(p:Progress,position:Point):Progress {
  const found=CHESTS.flatMap((point,index)=>distance(point,position)<=DISCOVERY_RANGE&&!(p.revealed??[]).includes(index)?[index]:[]);
  return found.length?{...p,revealed:[...(p.revealed??[]),...found]}:p;
}
export function companionSensesDiscovery(p:Progress,position:Point,away:boolean):boolean {
  return !away&&CHESTS.some((point,index)=>!p.chests.includes(index)&&!(p.revealed??[]).includes(index)&&distance(point,position)<=170);
}
export function lessonAvailable(index:number,p:Progress) {return index===p.lessons && (index<4 || p.orin);}
export function orinReady(p:Progress) {return p.lessons>=4;}
export function exitOpen(p:Progress) {return p.lessons===9 && p.orin;}
export function finishLesson(p:Progress,index:number):Progress {return lessonAvailable(index,p)?{...p,lessons:p.lessons+1}:p;}
export function finishOrin(p:Progress):Progress {return orinReady(p)?{...p,orin:true}:p;}
export function finishBattle(p:Progress):Progress {return p.battle?{...p,battle:{...p.battle,complete:true}}:p;}
export function stageProgress(stage:Stage):Progress {return {...newProgress(),lessons:stage==='exit'?9:stage==='final'?8:stage==='orin'?4:0,orin:stage==='exit'||stage==='final'};}
export function nextObjective(p:Progress): {point:Point;label:string} {
  if(orinReady(p)&&!p.orin)return {point:ORIN,label:'Orin’s lanterns are lit'};
  if(p.lessons<9)return {point:LESSONS[p.lessons],label:`Find lesson ${p.lessons+1}`};
  return {point:EXIT,label:'A new horizon is open'};
}
export function walkable(point:Point,p:Progress,padding=12):boolean {
  if(point.x<40||point.x>WORLD.width-40||point.y<95||point.y>2090)return false;
  if(point.y<244&&(!exitOpen(p)||Math.abs(point.x-EXIT.x)>44))return false;
  return !COLLIDERS.some(c=>distance(point,c)<c.r+padding);
}
export function clearSegment(a:Point,b:Point,p:Progress):boolean {
  const steps=Math.max(1,Math.ceil(distance(a,b)/7));
  for(let i=1;i<=steps;i++)if(!walkable({x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps},p))return false;
  return true;
}
export function movePlayer(old:Point,v:Point,amount:number,p:Progress):Point {
  let point={...old};const steps=Math.max(1,Math.ceil(amount/4));
  for(let i=0;i<steps;i++){
    const dx=v.x*amount/steps,dy=v.y*amount/steps;
    const next={x:point.x+dx,y:point.y+dy};
    if(walkable(next,p))point=next;
    else if(walkable({x:point.x+dx,y:point.y},p))point.x+=dx;
    else if(walkable({x:point.x,y:point.y+dy},p))point.y+=dy;
  }
  return point;
}

// A small grid search for tap-to-walk. The joystick uses the same collision geometry.
export function planWalk(from:Point,requested:Point,p:Progress):Point[] {
  let goal={x:Math.max(44,Math.min(WORLD.width-44,requested.x)),y:Math.max(exitOpen(p)?100:255,Math.min(2080,requested.y))};
  if(!walkable(goal,p)){
    let found:Point|undefined;
    for(let radius=20;radius<=160&&!found;radius+=20)for(let i=0;i<16;i++){
      const candidate={x:goal.x+Math.cos(i*Math.PI/8)*radius,y:goal.y+Math.sin(i*Math.PI/8)*radius};
      if(walkable(candidate,p)){found=candidate;break;}
    }
    if(!found)return [];goal=found;
  }
  if(clearSegment(from,goal,p))return [goal];
  const cell=24,columns=Math.ceil(WORLD.width/cell);
  type Node={point:Point;g:number;f:number;parent:number|null};
  const nodes=new Map<number,Node>(),open=new Set<number>(),closed=new Set<number>();
  const key=(point:Point)=>Math.round(point.y/cell)*columns+Math.round(point.x/cell);
  let seed:Point|undefined;
  for(let ring=0;ring<4&&!seed;ring++)for(let x=-ring;x<=ring&&!seed;x++)for(let y=-ring;y<=ring;y++){
    const point={x:(Math.round(from.x/cell)+x)*cell,y:(Math.round(from.y/cell)+y)*cell};
    if(walkable(point,p)&&clearSegment(from,point,p)){seed=point;break;}
  }
  if(!seed)return [];
  const first=key(seed);nodes.set(first,{point:seed,g:0,f:distance(seed,goal),parent:null});open.add(first);
  while(open.size){
    let current=-1,best=Infinity;
    for(const id of open){const f=nodes.get(id)!.f;if(f<best){best=f;current=id}}
    const node=nodes.get(current)!;open.delete(current);closed.add(current);
    if(distance(node.point,goal)<cell*2&&clearSegment(node.point,goal,p)){
      const raw:Point[]=[goal];let id:number|null=current;
      while(id!==null){const n:Node=nodes.get(id)!;raw.unshift(n.point);id=n.parent;}
      const route:Point[]=[];let previous=from,index=0;
      while(index<raw.length){let furthest=index;for(let j=index+1;j<raw.length;j++){if(clearSegment(previous,raw[j],p))furthest=j;else break}route.push(raw[furthest]);previous=raw[furthest];index=furthest+1;}
      return route;
    }
    for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){
      if(!dx&&!dy)continue;
      const point={x:node.point.x+dx*cell,y:node.point.y+dy*cell};
      if(!walkable(point,p)||!clearSegment(node.point,point,p))continue;
      const id=key(point);if(closed.has(id))continue;
      const g=node.g+Math.hypot(dx,dy)*cell;
      if(!nodes.has(id)||g<nodes.get(id)!.g){nodes.set(id,{point,g,f:g+distance(point,goal),parent:current});open.add(id)}
    }
  }
  return [];
}

export const MODULE_COUNT=5;
export function shuffleThemes(random:()=>number=Math.random): number[] {
  const result=THEMES.map((_,i)=>i);
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result.slice(0,MODULE_COUNT);
}
