import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, Text, useWindowDimensions, View } from 'react-native';
import { World, LandmarkArt } from './src/World';
import { WorldLife } from './src/WorldLife';
import { Discovery } from './src/Discovery';
import { Sprite } from './src/Sprite';
import { Cinematic, type Film } from './src/Cinematic';
import { s } from './src/styles';
import { AccountHeader, MainNavigation, WorldRail } from './src/AppChrome';
import { AMBUSH, CHESTS, EXIT, IN_RANGE, LESSONS, MODULE_COUNT, ORIN, START, THEMES, WORLD, revealDiscoveries, companionSensesDiscovery, approach, planWalk, distance, exitOpen, finishBattle, finishLesson, finishOrin, lessonAvailable, movePlayer, newProgress, nextObjective, orinReady, shuffleThemes, stageProgress, type Point, type Progress, type Stage } from './src/journey';

type Place = { kind:'lesson'|'wagon'|'chest'|'gate'|'battle'; index?:number; point:Point; name:string; available:boolean; done:boolean };
type Panel = { kind:'lesson'|'wagon'|'chest'|'battle'|'ambush'|'atlas'|'demo'|'companion'|'complete'; index?:number } | null;
const nativeDriver=Platform.OS!=='web';
function Button({children,onPress,secondary=false,color}:{children:React.ReactNode;onPress:()=>void;secondary?:boolean;color?:string}) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={({pressed})=>[s.button,color?{backgroundColor:color}:null,secondary&&s.secondary,pressed&&{opacity:.7}]}><Text style={[s.buttonText,secondary&&{color:'#796689'}]}>{children}</Text></Pressable>;
}
export default function App() {
  const {width,height}=useWindowDimensions();
  const desktop=width>860;
  const [route,setRoute]=useState([0,1,2,3,4]);
  const [active,setActive]=useState(0);
  const [modules,setModules]=useState<Progress[]>(()=>Array.from({length:MODULE_COUNT},newProgress));
  const [position,setPosition]=useState<Point>(START);
  const [follower,setFollower]=useState<Point>({x:START.x-32,y:START.y+20});
  const [viewport,setViewport]=useState({width:386,height:620});
  const [panel,setPanel]=useState<Panel>(null);
  const [film,setFilm]=useState<(Film&{key:number})|null>(null);
  const [surprise,setSurprise]=useState(false);
  const [knob,setKnob]=useState<Point>({x:0,y:0});
  const [toast,setToast]=useState('');
  const [sentUntil,setSentUntil]=useState<number|null>(null);
  const [seconds,setSeconds]=useState(0);
  const [lifeEnabled,setLifeEnabled]=useState(true),[lifePreview,setLifePreview]=useState(0);
  const mapRef=useRef<View>(null);
  const positionRef=useRef(position),followerRef=useRef(follower);
  const modulesRef=useRef(modules),activeRef=useRef(active);
  const blocked=useRef(false),vector=useRef<Point>({x:0,y:0}),target=useRef<Point|null>(null);
  const waypoints=useRef<Point[]>([]),breadcrumbs=useRef<Point[]>([START]);
  const eventTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const reveal=useRef(new Animated.Value(0)).current;
  const flash=useRef(new Animated.Value(0)).current;
  const shake=useRef(new Animated.Value(0)).current;
  const pulse=useRef(new Animated.Value(.45)).current;
  const filmCounter=useRef(0);
  const p=modules[active],theme=THEMES[route[active]];
  const scale=viewport.width/430;
  const visibleHeight=viewport.height/scale;
  const camera={x:Math.max(0,Math.min(WORLD.width-430,position.x-215)),y:Math.max(0,Math.min(Math.max(0,WORLD.height-visibleHeight),position.y-visibleHeight*.58))};
  const cameraRef=useRef(camera);cameraRef.current=camera;
  modulesRef.current=modules;activeRef.current=active;
  const objective=nextObjective(p);
  const companionCurious=companionSensesDiscovery(p,position,!!sentUntil);
  const places:Place[]=[
    ...LESSONS.map((point,index)=>({kind:'lesson' as const,index,point,name:theme.lessons[index],available:lessonAvailable(index,p),done:index<p.lessons})),
    {kind:'wagon',point:ORIN,name:'Orin’s traveling wagon',available:orinReady(p),done:p.orin},
    ...CHESTS.map((point,index)=>({kind:'chest' as const,index,point,name:'A hidden discovery',available:true,done:p.chests.includes(index)})),
    {kind:'gate',point:EXIT,name:theme.obstacle,available:exitOpen(p),done:exitOpen(p)},
    ...(p.battle?[{kind:'battle' as const,point:p.battle.point,name:p.battle.complete?'Battle complete':'Rowan awaits',available:true,done:p.battle.complete}]:[]),
  ];
  function stop(){vector.current={x:0,y:0};target.current=null;waypoints.current=[];setKnob({x:0,y:0})}
  function walkTo(goal:Point){
    vector.current={x:0,y:0};waypoints.current=planWalk(positionRef.current,goal,modulesRef.current[activeRef.current]);target.current=waypoints.current.shift()??null;
  }
  function openPanel(value:Panel){stop();blocked.current=!!value;setPanel(value);reveal.setValue(0);Animated.timing(reveal,{toValue:1,duration:260,easing:Easing.out(Easing.cubic),useNativeDriver:nativeDriver}).start()}
  function closePanel(){setPanel(null);blocked.current=false}
  function updateProgress(update:(old:Progress)=>Progress){
    const next=modulesRef.current.map((item,i)=>i===activeRef.current?update(item):item);
    modulesRef.current=next;setModules(next);
  }
  function teleport(point:Point){stop();breadcrumbs.current=[{...point}];positionRef.current={...point};followerRef.current={x:point.x-30,y:point.y+20};setPosition(positionRef.current);setFollower(followerRef.current)}
  function runFilm(details:Omit<Film,'onEnd'>,onEnd:()=>void=()=>{}) {
    stop();setPanel(null);blocked.current=true;setFilm({...details,key:++filmCounter.current,onEnd:()=>{setFilm(null);blocked.current=false;onEnd()}});
  }
  function switchModule(index:number){
    if(eventTimer.current)clearTimeout(eventTimer.current);
    setSurprise(false);setPanel(null);setFilm(null);blocked.current=false;setActive(index);activeRef.current=index;
    teleport(START);setToast(`Welcome to ${THEMES[route[index]].name}.`);
  }
  function previewStage(stage:Stage){
    if(blocked.current&&film)return;
    setPanel(null);blocked.current=false;updateProgress(()=>stageProgress(stage));
    teleport(stage==='fresh'?START:stage==='orin'?approach(ORIN):stage==='final'?approach(LESSONS[8]):{x:EXIT.x,y:EXIT.y+70});
    setToast(stage==='fresh'?'A fresh trail. Walk toward the first landmark.':stage==='orin'?'Four lessons complete. Orin’s lanterns are lit.':stage==='final'?'One more lesson. The way ahead is almost open.':`${theme.clearing}. All nine lessons are complete.`);
  }
  function previewEnvironment(themeIndex:number){
    const next=[...route],existing=next.indexOf(themeIndex);
    if(existing>=0)next[existing]=next[active];
    next[active]=themeIndex;setRoute(next);closePanel();teleport(START);setToast(`Welcome to ${THEMES[themeIndex].name}.`);
  }
  function freshAdventure(){
    if(eventTimer.current)clearTimeout(eventTimer.current);
    const next=Array.from({length:MODULE_COUNT},newProgress);modulesRef.current=next;setModules(next);
    setRoute(shuffleThemes());setActive(0);activeRef.current=0;setPanel(null);setFilm(null);setSurprise(false);blocked.current=false;setSentUntil(null);teleport(START);setToast('Five new places. One new adventure.');
  }
  function ambush(){
    if(blocked.current)return;
    blocked.current=true;stop();setSurprise(true);
    updateProgress(old=>({...old,battle:{point:{x:positionRef.current.x+30,y:positionRef.current.y-15},complete:false}}));
    flash.setValue(0);shake.setValue(0);
    Animated.parallel([
      Animated.sequence([Animated.timing(flash,{toValue:.7,duration:120,useNativeDriver:nativeDriver}),Animated.timing(flash,{toValue:0,duration:350,useNativeDriver:nativeDriver})]),
      Animated.sequence([6,-6,4,-4,0].map(toValue=>Animated.timing(shake,{toValue,duration:65,useNativeDriver:nativeDriver}))),
    ]).start();
    eventTimer.current=setTimeout(()=>{setSurprise(false);openPanel({kind:'ambush'})},900);
  }
  const ambushRef=useRef(ambush);ambushRef.current=ambush;
  function enter(place:Place){
    if(blocked.current)return;
    const near=distance(positionRef.current,place.point)<=IN_RANGE;
    if(!near){walkTo(approach(place.point));setToast('Walk closer. Tap the landmark when it lights up.');return}
    if(!place.available&&!place.done){
      setToast(place.kind==='wagon'?'Orin arrives after lesson four.':place.kind==='gate'?'Finish nine lessons and visit Orin to open this passage.':p.lessons>=4&&!p.orin?'Orin is waiting. Visit his wagon first.':'Finish the earlier lesson to awaken this place.');return;
    }
    if(place.kind==='gate'){
      runFilm({kind:'gate',title:active===MODULE_COUNT-1?'A world of possibilities':THEMES[route[active+1]].name,subtitle:'A new horizon'},()=>active<MODULE_COUNT-1?switchModule(active+1):openPanel({kind:'complete'}));return;
    }
    const panelKind=place.kind;
    runFilm({kind:panelKind,index:place.index,title:place.name,subtitle:place.done?'A familiar place':place.kind==='battle'?'A friendly challenge':place.kind==='wagon'?'Come in, traveler':'A little curiosity',complete:place.done},()=>openPanel({kind:panelKind,index:place.index}));
  }
  function finishCurrent(){
    if(!panel)return;
    const current=panel;
    closePanel();
    if(current.kind==='lesson'){
      const index=current.index!;const next=finishLesson(p,index);updateProgress(()=>next);
      if(next.lessons===4&&!next.orin){teleport(approach(ORIN));runFilm({kind:'wagon',title:'Orin’s lanterns are lit',subtitle:'A friend along the way'},()=>setToast('Orin is ready. Walk to his glowing wagon.'))}
      else if(exitOpen(next)){teleport({x:EXIT.x,y:EXIT.y+85});runFilm({kind:'gate',title:theme.clearing,subtitle:'Chapter complete'},()=>setToast('Tap the open passage to continue your adventure.'))}
      else setToast(`Lesson ${next.lessons} complete. A new place is ready.`);
    } else if(current.kind==='wagon'){updateProgress(finishOrin);setToast('A little wiser. Lesson five is ready for you.')}
    else if(current.kind==='battle'){updateProgress(finishBattle);setToast('Battle complete. A victory marker stays in the world.')}
    else if(current.kind==='chest'){updateProgress(old=>({...old,chests:[...new Set([...old.chests,current.index!])]}));setToast('A discovery worth the detour.');}
  }
  useEffect(()=>{
    const current=modulesRef.current[activeRef.current];
    const next=revealDiscoveries(current,position);
    if(next!==current)updateProgress(()=>next);
  },[position,active]);
  useEffect(()=>{
    const animation=Animated.loop(Animated.sequence([Animated.timing(pulse,{toValue:1,duration:950,useNativeDriver:nativeDriver}),Animated.timing(pulse,{toValue:.45,duration:950,useNativeDriver:nativeDriver})]));animation.start();return()=>animation.stop();
  },[]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),3300);return()=>clearTimeout(timer)},[toast]);
  useEffect(()=>()=>{if(eventTimer.current)clearTimeout(eventTimer.current)},[]);
  useEffect(()=>{
    if(!sentUntil)return;
    const tick=()=>{const remaining=Math.max(0,Math.ceil((sentUntil-Date.now())/1000));setSeconds(remaining);if(!remaining){setSentUntil(null);followerRef.current={x:positionRef.current.x-30,y:positionRef.current.y+20};setFollower(followerRef.current);setToast('Your little explorer is back.')}};
    tick();const interval=setInterval(tick,1000);return()=>clearInterval(interval);
  },[sentUntil]);
  useEffect(()=>{
    let last=Date.now();const interval=setInterval(()=>{
      const now=Date.now(),dt=Math.min(.05,(now-last)/1000);last=now;if(blocked.current)return;
      let v=vector.current,amount=145*dt;
      if(target.current){const d=distance(positionRef.current,target.current);if(d<1){target.current=waypoints.current.shift()??null;return}amount=Math.min(amount,d);v={x:(target.current.x-positionRef.current.x)/d,y:(target.current.y-positionRef.current.y)/d}}
      if(!v.x&&!v.y)return;
      const state=modulesRef.current[activeRef.current];
      const next=movePlayer(positionRef.current,v,amount,state);
      if(distance(next,positionRef.current)<.1){target.current=null;waypoints.current=[];return}
      positionRef.current=next;setPosition(next);
      breadcrumbs.current.push(next);
      let trailLength=0,index=breadcrumbs.current.length-1;
      while(index>0&&trailLength<34){trailLength+=distance(breadcrumbs.current[index],breadcrumbs.current[index-1]);index--;}
      if(trailLength>=34){followerRef.current=breadcrumbs.current[index];setFollower(followerRef.current);breadcrumbs.current=breadcrumbs.current.slice(index);}
      if(!state.battle&&distance(next,AMBUSH)<56)ambushRef.current();
    },32);return()=>clearInterval(interval);
  },[]);
  useEffect(()=>{
    if(Platform.OS!=='web')return;
    const keys=new Set<string>();const accepted=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'];
    const update=()=>{if(blocked.current)return;const x=Number(keys.has('ArrowRight')||keys.has('d'))-Number(keys.has('ArrowLeft')||keys.has('a')),y=Number(keys.has('ArrowDown')||keys.has('s'))-Number(keys.has('ArrowUp')||keys.has('w')),n=Math.max(1,Math.hypot(x,y));vector.current={x:x/n,y:y/n};setKnob({x:x/n*24,y:y/n*24});target.current=null;waypoints.current=[]};
    const down=(e:KeyboardEvent)=>{if(accepted.includes(e.key)){e.preventDefault();keys.add(e.key);update()}};
    const up=(e:KeyboardEvent)=>{if(accepted.includes(e.key)){keys.delete(e.key);update()}};
    const blur=()=>{keys.clear();vector.current={x:0,y:0};setKnob({x:0,y:0})};
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur)};
  },[]);
  const joystick=useRef(PanResponder.create({
    onStartShouldSetPanResponder:()=>!blocked.current,onMoveShouldSetPanResponder:()=>!blocked.current,
    onPanResponderGrant:()=>{target.current=null;waypoints.current=[]},
    onPanResponderMove:(_,g)=>{if(blocked.current)return;const n=Math.max(1,Math.hypot(g.dx,g.dy)/29),x=g.dx/n,y=g.dy/n;setKnob({x,y});vector.current={x:x/29,y:y/29}},
    onPanResponderRelease:()=>{vector.current={x:0,y:0};setKnob({x:0,y:0})},onPanResponderTerminate:()=>{vector.current={x:0,y:0};setKnob({x:0,y:0})},
  })).current;
  const stageControls=<View style={s.stageRow}>{(['fresh','orin','final','exit'] as Stage[]).map((stage,i)=><Pressable key={stage} accessibilityRole="button" onPress={()=>previewStage(stage)} style={s.stageButton}><Text style={s.stageText}>{['Fresh trail','Orin ready','Last lesson','Exit open'][i]}</Text></Pressable>)}</View>;
  const compassSymbol=objective.point.y<position.y-70?'↑':objective.point.y>position.y+70?'↓':objective.point.x>position.x?'→':'←';
  const currentPlace=panel?places.find(place=>place.kind===panel.kind&&(place.index===panel.index)):undefined;
  return <View style={s.page}>
    <StatusBar barStyle="dark-content"/>
    {desktop&&<View style={s.presentation}>
      <View style={s.brandMark}><Text style={{fontSize:24,color:theme.accent}}>✧</Text></View>
      <Text style={s.eyebrow}>UPSKILL HERO / THE LIVING WORLD</Text>
      <Text style={s.title}>A world that grows{'\n'}with every little win.</Text>
      <Text style={s.intro}>Wander, discover, and leave your mark. Each chapter has nine places to learn—and a familiar face along the way.</Text>
      <View style={s.rule}/>
      <Text style={s.stepTitle}>The place becomes the invitation.</Text><Text style={s.stepBody}>Walk close. The landmark glows. Tap it to enter, then finish the lesson to change the world.</Text>
      <Text style={s.stepTitle}>Orin travels with the story.</Text><Text style={s.stepBody}>After four lessons, his wagon lights up. Meet him once in every locale, then continue your adventure.</Text>
      <Text style={s.stepTitle}>A different horizon, every time.</Text><Text style={s.stepBody}>Five chapters, chosen from {THEMES.length} environments. Explore the atlas or shuffle a new adventure.</Text>
      <Text style={[s.eyebrow,{marginTop:6}]}>SHOW A STAGE</Text>{stageControls}
      <Button color={theme.accent} onPress={()=>{if(!blocked.current)ambush()}}>✦  Replay an ambush</Button>
      <Pressable accessibilityRole="button" onPress={()=>{if(!film&&!surprise)openPanel({kind:'atlas'})}} style={s.demoLink}><Text style={s.demoLinkText}>Browse the five locations  →</Text></Pressable>
      <Text style={s.caption}>INTERACTIVE UI STUDY · USE ARROWS, JOYSTICK, OR TAP THE MAP</Text>
    </View>}
    <SafeAreaView style={[s.phone,{height:desktop?Math.min(880,height-38):height},desktop&&s.phoneDesktop]}>
      <View style={s.header}>
        <AccountHeader/>
        <View style={s.headerTop}><View style={{flex:1}}><Text style={[s.eyebrow,{fontSize:8}]}>CHAPTER {active+1} OF {MODULE_COUNT}</Text><Text style={[s.regionTitle,{color:theme.ink,fontSize:18}]}>{theme.name}</Text></View><Text style={[s.moduleText,{color:theme.accent,fontWeight:'700'}]}>{p.lessons} / 9</Text></View>
        <View style={s.progressRow}>{LESSONS.map((_,i)=><View key={i} style={[s.progressSegment,i<p.lessons&&{backgroundColor:theme.accent}]}/>)}</View>
      </View>
      <Animated.View ref={mapRef} style={[s.map,{backgroundColor:theme.ground,transform:[{translateX:shake}]}]} onLayout={e=>{const {width,height}=e.nativeEvent.layout;setViewport({width,height})}}>
        <Pressable accessibilityRole="button" accessibilityLabel="Walk on the map" style={{position:'absolute',inset:0}} onPress={e=>{
          if(blocked.current)return;const {pageX,pageY}=e.nativeEvent;
          mapRef.current?.measureInWindow((x,y,w)=>{walkTo({x:(pageX-x)/(w/430)+cameraRef.current.x,y:(pageY-y)/(w/430)+cameraRef.current.y})});
        }}/>
        <View pointerEvents="box-none" style={[s.canvas,{left:-camera.x*scale,top:-camera.y*scale,width:WORLD.width,height:WORLD.height,transform:[{scale}]}]}>
          <View pointerEvents="none"><World theme={theme}/></View>
          <View pointerEvents="none" style={{position:'absolute',left:EXIT.x-72,top:54,width:145,alignItems:'center'}}><Text style={{fontSize:14,color:theme.dark?'#eee5df':theme.ink,fontWeight:'600'}}>Beyond the horizon</Text><Text style={{fontSize:9,color:theme.dark?'#eee5df':theme.ink,opacity:.6,marginTop:5}}>{exitOpen(p)?'The way is open':'A new chapter awaits'}</Text></View>
          {places.map(place=>{
            if(place.kind==='chest')return <Discovery key={`${active}-chest-${place.index}`} point={place.point} theme={theme} revealed={(p.revealed??[]).includes(place.index!)||place.done} done={place.done} near={distance(position,place.point)<=IN_RANGE} onPress={()=>enter(place)}/>;
            const near=distance(position,place.point)<=IN_RANGE;
            const glowing=near&&place.available&&(!place.done||place.kind==='gate');
            const label=place.done?(place.kind==='gate'?'The way is open':`✓ ${place.name}`):place.kind==='lesson'?`${(place.index??0)+1}. ${place.name}`:place.name;
            const hint=place.done?(place.kind==='gate'?(near?'Tap to travel':'Walk closer'):''):!place.available?(place.kind==='wagon'?'After lesson 4':place.kind==='gate'?'Finish this chapter':'Not yet'):(near?'Tap to enter':place.kind==='wagon'?'Come in, traveler':place.kind==='battle'?'Return whenever you’re ready':'Walk closer');
            return <Pressable key={`${place.kind}-${place.index??0}`} accessibilityRole="button" accessibilityLabel={`${place.name}, ${place.done?'complete':glowing?'in range':!place.available?'locked':'walk closer'}`} onPress={()=>enter(place)} style={[s.landmark,{left:place.point.x-60,top:place.point.y-90,opacity:!place.available&&!place.done?(theme.dark?.8:.58):1}]}>
              {glowing&&<Animated.View pointerEvents="none" style={[s.glow,{opacity:pulse}]}/>}
              <View pointerEvents="none" style={s.landmarkArt}><LandmarkArt kind={place.kind} index={place.index} theme={theme} ready={place.available} done={place.done}/></View>
              <View pointerEvents="none" style={[s.landmarkLabel,place.done&&s.completeLabel,glowing&&{backgroundColor:'#fff8d7',borderWidth:1,borderColor:'#e7cc87'}]}><Text style={[s.landmarkTitle,glowing&&{color:theme.ink}]}>{label}</Text>{!!hint&&<Text style={s.landmarkHint}>{hint}</Text>}</View>
            </Pressable>;
          })}
          <WorldLife theme={theme} position={position} progress={p} paused={!!panel||!!film||surprise} enabled={lifeEnabled} preview={lifePreview}/>
          {!sentUntil&&<View pointerEvents="none" style={[s.actor,{left:follower.x,top:follower.y,transform:[{translateX:-12},{translateY:-33}]}]}><Sprite companion/>{companionCurious&&<View style={{position:'absolute',top:-19,left:1,width:21,height:21,borderRadius:11,backgroundColor:'#fff7d7',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:14,color:'#977843',fontWeight:'700'}}>?</Text></View>}</View>}
          <View pointerEvents="none" style={[s.actor,{left:position.x,top:position.y}]}><View style={s.shadow}/><Sprite/>{surprise&&<View style={s.exclamation}><Text style={{color:theme.accent,fontSize:30,fontWeight:'900'}}>!</Text></View>}</View>
        </View>
        <View pointerEvents="none" style={s.objective}><Text style={[s.objectiveIcon,{color:theme.accent}]}>{compassSymbol}</Text><View><Text style={s.objectiveTitle}>{objective.label}{p.lessons<9&&!(orinReady(p)&&!p.orin)?` · ${theme.lessons[p.lessons]}`:''}</Text><Text style={s.objectiveSub}>{p.lessons===0?'Walk toward the first landmark. Watch it light up.':p.orin?'Orin visited ✓ · Keep following your curiosity.':'One little step, then another.'}</Text></View></View>
        <View pointerEvents="box-none" style={s.controls}>
          <View accessible accessibilityLabel="Drag joystick to walk" style={s.joystick} {...joystick.panHandlers}><View style={s.joystickTrack}/><View style={[s.knob,{transform:[{translateX:knob.x},{translateY:knob.y}]}]}/></View>
          <View><Pressable accessibilityRole="button" accessibilityLabel="Walk toward the next objective" style={s.compass} onPress={()=>{if(!blocked.current){walkTo(approach(objective.point));setToast('Following the trail. Tap the landmark when you arrive.')}}}><Text style={s.compassText}>{compassSymbol}  Follow the trail</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Companion adventure" onPress={()=>{if(!film&&!surprise)openPanel({kind:'companion'})}} style={s.companionChip}><Sprite companion small/><Text style={s.companionText}>{sentUntil?`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')} · exploring`:companionCurious?'Something nearby…':'Your little sidekick'}</Text></Pressable></View>
        </View>
        <WorldRail accent={theme.accent} disabled={!!film||surprise} onAdventure={()=>{if(!film&&!surprise)closePanel()}} onAtlas={()=>{if(!film&&!surprise)openPanel({kind:'atlas'})}} onStages={()=>{if(!film&&!surprise)openPanel({kind:'demo'})}}/>
        {surprise&&<View pointerEvents="none" style={s.surpriseTitle}><Text style={s.surpriseText}>Someone’s here…</Text></View>}
        <Animated.View pointerEvents="none" style={{position:'absolute',inset:0,backgroundColor:'#eee0ff',opacity:flash}}/>
        {!!toast&&<View pointerEvents="none" style={s.toast}><Text style={s.toastText}>{toast}</Text></View>}
      </Animated.View>
      <MainNavigation/>
      {panel&&<View style={s.overlay}>
        <Pressable accessibilityRole="button" accessibilityLabel="Close panel" style={s.scrim} onPress={closePanel}/>
        <Animated.View accessibilityViewIsModal style={[s.sheet,{opacity:reveal,transform:[{translateY:reveal.interpolate({inputRange:[0,1],outputRange:[45,0]})}]}]}>
          <View style={s.handle}/><ScrollView showsVerticalScrollIndicator={false}>
          {['lesson','wagon','battle','chest'].includes(panel.kind)?<>
            <View style={s.sheetArt}><LandmarkArt kind={panel.kind as 'lesson'} index={panel.index} theme={theme} ready done={currentPlace?.done}/></View>
            <Text style={s.eyebrow}>{currentPlace?.done?'A LITTLE WIN, REMEMBERED':panel.kind==='wagon'?'A VISIT WITH ORIN':panel.kind==='battle'?'A FRIENDLY CHALLENGE':panel.kind==='chest'?'A SMALL DISCOVERY':`LESSON ${(panel.index??0)+1} OF 9`}</Text>
            <Text style={s.sheetTitle}>{currentPlace?.name}</Text>
            {panel.kind==='chest'?<Text style={s.sheetBody}>An octopus has three hearts. A small discovery, just for wandering off the path.</Text>:<Text style={s.sheetBody}>{currentPlace?.done?'You’ve already left your mark here.':panel.kind==='wagon'?'A warm lantern, a familiar voice. Your once-per-module visit with Orin goes here.':'A quick stop in your adventure. Finish to see how the world changes.'}</Text>}
            {!currentPlace?.done&&<Button color={theme.accent} onPress={finishCurrent}>{panel.kind==='battle'?'Finish battle':panel.kind==='chest'?'Collect discovery':panel.kind==='wagon'?'Finish lesson with Orin':'Finish lesson'}</Button>}
            <Button secondary onPress={closePanel}>{currentPlace?.done?'Back to the world':panel.kind==='battle'?'Return to this battle later':'Back to the world'}</Button>
          </>:panel.kind==='ambush'?<>
            <View style={s.sheetArt}><LandmarkArt kind="battle" theme={theme}/></View>
            <Text style={s.eyebrow}>A RIVAL CROSSES YOUR PATH</Text><Text style={s.sheetTitle}>An unexpected challenger.</Text><Text style={s.sheetBody}>Rowan, the Wandering Scholar, is ready for a friendly battle. Feeling curious?</Text>
            <Button color={theme.accent} onPress={()=>runFilm({kind:'battle',title:'A friendly challenge',subtitle:'Rowan awaits'},()=>openPanel({kind:'battle'}))}>Enter battle  →</Button>
            <Button secondary onPress={()=>{closePanel();setToast('Rowan will wait here. Explore at your own pace.')}}>Return to this battle later</Button><Text style={s.sheetFootnote}>The encounter stays in this locale until you finish it.</Text>
          </>:panel.kind==='atlas'?<>
            <Text style={s.eyebrow}>FIVE PLACES. ONE ADVENTURE.</Text><Text style={s.sheetTitle}>A world of possibility.</Text><Text style={s.sheetBody}>Preview any locale for the presentation. Each keeps its own lessons, Orin visit, discoveries, and battle.</Text>
            {route.map((themeIndex,index)=>{const t=THEMES[themeIndex],state=modules[index];return <Pressable accessibilityRole="button" accessibilityLabel={`Preview ${t.name}`} key={index} onPress={()=>switchModule(index)} style={[s.atlasCard,{backgroundColor:t.groundLight,borderColor:active===index?t.accent:'#e7e2d5'}]}><View style={[s.atlasNumber,{backgroundColor:t.accent+'25'}]}><Text style={{color:t.accent,fontWeight:'700'}}>{exitOpen(state)?'✓':index+1}</Text></View><View style={{flex:1}}><Text style={[s.atlasName,t.dark&&{color:'#f0e8e2'}]}>{t.name}</Text><Text style={[s.atlasDetail,t.dark&&{color:'#c3b9b5'}]}>{state.lessons}/9 lessons · Orin {state.orin?'visited':orinReady(state)?'ready':'resting'}</Text></View><Text style={{color:t.accent}}>→</Text></Pressable>})}
            <Text style={[s.eyebrow,{marginTop:18,marginBottom:10}]}>TRY AN ENVIRONMENT IN THIS CHAPTER</Text>
            <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginBottom:18}}>{THEMES.map((t,index)=><Pressable key={t.id} accessibilityRole="button" accessibilityLabel={`Use ${t.name}`} onPress={()=>previewEnvironment(index)} style={{width:'48%',padding:12,borderRadius:14,backgroundColor:t.groundLight,borderWidth:1,borderColor:theme.id===t.id?t.accent:'transparent'}}><View style={{width:20,height:4,borderRadius:3,backgroundColor:t.accent,marginBottom:8}}/><Text style={{fontSize:12,fontWeight:'600',color:t.dark?'#eee7e2':t.ink}}>{t.name}</Text></Pressable>)}</View>
            <Button secondary onPress={freshAdventure}>New adventure · reset & shuffle</Button><Text style={s.sheetFootnote}>Draws five different environments from a pool of {THEMES.length}. Resets this demo’s progress.</Text>
          </>:panel.kind==='demo'?<>
            <Text style={s.eyebrow}>PRESENTATION CONTROLS</Text><Text style={s.sheetTitle}>Show how the world changes.</Text><Text style={s.sheetBody}>Jump to a stage in this locale. Then walk to the glowing landmark and tap to enter.</Text>
            {stageControls}<Text style={s.demoHint}>Fresh trail: 0 lessons. Orin ready: 4. Last lesson: 8. Exit open: all 9 complete, with Orin visited.</Text>
            <Button color={theme.accent} onPress={()=>{closePanel();ambush()}}>Replay an ambush</Button>
            <Button secondary onPress={()=>{closePanel();const place=places.find(item=>item.kind===(orinReady(p)&&!p.orin?'wagon':p.lessons===9?'gate':'lesson')&&(item.kind!=='lesson'||item.index===p.lessons))!;teleport(approach(place.point));setToast('You’re in range. Tap the glowing landmark.')}}>Walkthrough shortcut · next landmark</Button>
            <Button secondary onPress={()=>{setLifeEnabled(true);closePanel();setLifePreview(value=>value+1)}}>Preview a passing creature</Button>
            <Button secondary onPress={()=>setLifeEnabled(value=>!value)}>World life: {lifeEnabled?'on':'off'}</Button>
            <Button secondary onPress={()=>openPanel({kind:'atlas'})}>Browse world locations</Button><Text style={s.sheetFootnote}>These controls are for the concept presentation.</Text>
          </>:panel.kind==='companion'?<>
            <View style={{alignSelf:'center',marginBottom:18}}><Sprite companion/></View><Text style={s.eyebrow}>A LITTLE ADVENTURE OF THEIR OWN</Text><Text style={s.sheetTitle}>{sentUntil?'Off finding a small wonder.':'Small friend. Big curiosity.'}</Text><Text style={s.sheetBody}>{sentUntil?'They’ll return when their two-minute adventure is over.':companionCurious?'Your friend’s ears perk up. Something is tucked into the scenery nearby—try wandering a little off the road.':'Your sidekick perks up near undiscovered treasures, giving a small hint without revealing the hiding place. You can also send them on a two-minute adventure.'}</Text>
            <Button color={theme.accent} onPress={()=>{setSentUntil(sentUntil?null:Date.now()+120000);closePanel();setToast(sentUntil?'Your friend is back.':'Off they go! Back in two minutes.')}}>{sentUntil?'Preview their return':'Send on a 2-minute adventure'}</Button>
          </>:<><Text style={s.eyebrow}>ADVENTURE COMPLETE</Text><Text style={s.sheetTitle}>Look how far you’ve come.</Text><Text style={s.sheetBody}>The final passage is open. There’s always another world waiting for a curious mind.</Text><Button color={theme.accent} onPress={()=>openPanel({kind:'atlas'})}>Look back at your journey</Button></>}
          <Pressable accessibilityRole="button" onPress={closePanel} style={s.closeLink}><Text style={s.closeText}>Close</Text></Pressable>
          </ScrollView>
        </Animated.View>
      </View>}
      {film&&<Cinematic key={film.key} film={film} theme={theme}/>}
    </SafeAreaView>
  </View>;
}
