import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { newProgress, finishLesson, finishOrin, finishBattle, exitOpen, orinReady, lessonAvailable, stageProgress, movePlayer, walkable, clearSegment, planWalk, approach, START, ORIN, CHESTS, EXIT, SCENERY, SET_PIECES, ROAD, revealDiscoveries, companionSensesDiscovery, THEMES, LESSONS, shuffleThemes } from '../src/journey.ts';

test('nine lessons remain sequential, with one Orin visit after lesson four',()=>{
  let p=newProgress();
  assert.equal(finishLesson(p,2),p);
  assert.equal(finishOrin(p),p);
  for(let i=0;i<4;i++)p=finishLesson(p,i);
  assert.ok(orinReady(p));
  assert.equal(lessonAvailable(4,p),false);
  assert.equal(finishLesson(p,4),p);
  p=finishOrin(p);
  for(let i=4;i<9;i++)p=finishLesson(p,i);
  assert.equal(p.lessons,9);
  assert.ok(exitOpen(p));
  assert.equal(finishLesson(p,8),p);
});
test('a deferred battle keeps its location when completed and never gates lessons',()=>{
  const point={x:277,y:1650};const p={...newProgress(),battle:{point,complete:false}};
  const result=finishBattle(p);
  assert.deepEqual(result.battle,{point,complete:true});assert.equal(p.battle.complete,false);
  assert.ok(lessonAvailable(0,p));assert.ok(lessonAvailable(0,result));
});
test('exit collision follows progress, including presentation presets',()=>{
  assert.ok(movePlayer({x:EXIT.x,y:250},{x:0,y:-1},50,newProgress()).y>=244);
  assert.ok(Math.abs(movePlayer({x:EXIT.x,y:250},{x:0,y:-1},50,stageProgress('exit')).y-200)<.001);
  assert.ok(lessonAvailable(8,stageProgress('final')));assert.equal(exitOpen(stageProgress('final')),false);
  assert.ok(orinReady(stageProgress('orin')));assert.equal(exitOpen(stageProgress('orin')),false);
});
test('ten theme options each contain nine lessons and shuffle to five unique modules',()=>{
  assert.equal(THEMES.length,10);assert.equal(new Set(THEMES.map(t=>t.motif)).size,10);
  const shuffled=shuffleThemes(()=>.5);assert.equal(shuffled.length,5);assert.equal(new Set(shuffled).size,5);
  THEMES.forEach(t=>assert.equal(t.lessons.length,LESSONS.length));
});

test('tap-to-walk routes around scenery and reaches every landmark approach',()=>{
  const p=newProgress();
  assert.equal(clearSegment(START,approach(LESSONS[0]),p),false);
  for(const goal of [...LESSONS,ORIN,...CHESTS,EXIT].map(approach)){
    assert.ok(walkable(goal,p),JSON.stringify(goal));
    const route=planWalk(START,goal,p);assert.ok(route.length>0,JSON.stringify(goal));
    let previous=START;
    for(const point of route){assert.ok(clearSegment(previous,point,p));previous=point;}
    assert.deepEqual(previous,goal);
  }
});
test('large movement steps cannot tunnel through scenery or locked exits',()=>{
  const p=newProgress(),rock=SCENERY[0];
  const next=movePlayer({x:rock.x,y:rock.y+100},{x:0,y:-1},180,p);
  assert.ok(next.y>=rock.y+rock.r+12);
  assert.ok(walkable(next,p));
  assert.ok(movePlayer({x:EXIT.x,y:280},{x:0,y:-1},180,p).y>=244);
  assert.ok(movePlayer({x:EXIT.x+100,y:280},{x:0,y:-1},180,stageProgress('exit')).y>=244);
});

test('discoveries require proximity, persist after leaving, and sidekick hints respect absence',()=>{
  const p=newProgress(),spot=CHESTS[0],nearby={x:spot.x-140,y:spot.y};
  assert.equal(revealDiscoveries(p,START),p);
  assert.equal(revealDiscoveries(p,nearby),p);
  assert.ok(companionSensesDiscovery(p,nearby,false));
  assert.equal(companionSensesDiscovery(p,nearby,true),false);
  const found=revealDiscoveries(p,{x:spot.x-60,y:spot.y});
  assert.deepEqual(found.revealed,[0]);assert.deepEqual(p.revealed,[]);
  assert.equal(revealDiscoveries(found,START),found);
  assert.equal(companionSensesDiscovery(found,nearby,false),false);
  assert.equal(companionSensesDiscovery({...p,chests:[0]},nearby,false),false);
});
test('tree and planted obstacle footprints stay clear of the rendered road and lesson paths',()=>{
  const samples=[];
  const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const curve=(a,b,c)=>{for(let i=0;i<=100;i++){const t=i/100,u=1-t;samples.push({x:u*u*a.x+2*u*t*b.x+t*t*c.x,y:u*u*a.y+2*u*t*b.y+t*t*c.y})}};
  let last=ROAD[0];
  for(let i=1;i<ROAD.length-1;i++){const end={x:(ROAD[i].x+ROAD[i+1].x)/2,y:(ROAD[i].y+ROAD[i+1].y)/2};curve(last,ROAD[i],end);last=end;}
  curve(last,last,ROAD.at(-1));
  const orinDistance=Math.min(...samples.map(q=>distance(ORIN,q)));
  assert.ok(orinDistance>60&&orinDistance<110,'Orin parks beside the main road');
  for(const point of LESSONS){const n=ROAD.reduce((best,q)=>distance(point,q)<distance(point,best)?q:best,ROAD[0]);curve(n,{x:point.x,y:n.y},point);}
  for(const obstacle of [...SCENERY.filter(p=>p.kind!=='rock'),...SET_PIECES]){
    assert.ok(Math.min(...samples.map(q=>distance(obstacle,q)))>obstacle.r+36,JSON.stringify(obstacle));
  }
});
