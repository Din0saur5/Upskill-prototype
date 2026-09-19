import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, AppState, Easing, Platform, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { clearSegment, walkable, WORLD, type Point, type Progress, type Theme } from './journey';

type Creature='rabbit'|'fox'|'tumbleweed'|'slime'|'bat'|'crab';
type Sighting={from:Point;to:Point;kind:Creature};
function Critter({kind,t}:{kind:Creature;t:Theme}){
  return <Svg width="38" height="34" viewBox="0 0 44 40">
    {kind==='tumbleweed'?<><Circle cx="22" cy="20" r="14" fill="#c8a16f55" stroke="#ac8655" strokeWidth="2"/><Path d="M10 10L32 30L26 5L16 35L8 22L35 16L12 30L18 6L33 11L7 15L29 34M9 13Q31 1 33 25Q19 38 12 19Q19 6 29 21" stroke="#b08d5e" strokeWidth="1.5" fill="none"/></>:
    kind==='bat'?<><Path d="M22 19Q12 1 2 8L8 25L15 22L22 29L29 22L36 25L42 8Q32 1 22 19" fill="#9a8bab"/><Ellipse cx="22" cy="21" rx="6" ry="10" fill="#6b617e"/><Path d="M17 14L16 5L22 11L28 5L27 14" fill="#6b617e"/><Circle cx="20" cy="17" r="1.5" fill="#eee1ac"/><Circle cx="25" cy="17" r="1.5" fill="#eee1ac"/></>:
    kind==='slime'?<><Path d="M5 31Q3 14 14 12L18 5L24 11Q38 13 39 31Q32 37 22 33Q11 38 5 31Z" fill={t.dark?'#bc846f':'#9dba94'}/><Circle cx="26" cy="21" r="2" fill="#464958"/><Circle cx="34" cy="21" r="2" fill="#464958"/><Ellipse cx="13" cy="19" rx="4" ry="6" fill="#fff" opacity=".24"/></>:
    kind==='crab'?<><Path d="M9 24L2 31M11 28L6 36M32 24L42 31M30 28L37 36M12 20L5 11M31 20L39 11" stroke="#b87760" strokeWidth="3" fill="none"/><Ellipse cx="22" cy="25" rx="14" ry="10" fill="#d89979"/><Path d="M1 5L6 9L10 4L10 13L4 15ZM34 4L39 9L43 5L42 15L35 13Z" fill="#d89979"/><Circle cx="18" cy="18" r="2" fill="#504f4b"/><Circle cx="26" cy="18" r="2" fill="#504f4b"/></>:
    <><Path d={kind==='fox'?'M14 25Q-8 31 4 12L15 21Z':'M12 24Q0 12 4 27Z'} fill={kind==='fox'?'#b9825f':'#f0e9d5'}/><Ellipse cx="22" cy="25" rx="13" ry="9" fill={kind==='fox'?'#c89267':'#ded8c6'}/><Circle cx="33" cy="19" r="8" fill={kind==='fox'?'#c89267':'#eee7d6'}/><Path d={kind==='fox'?'M27 14L26 4L34 11L39 5L40 18Z':'M28 15Q20-8 29 3L33 14M33 13Q31-8 38 2L38 15'} fill={kind==='fox'?'#c89267':'#eee7d6'}/><Path d="M14 31L11 35H19M29 31L28 35H35" stroke={kind==='fox'?'#8a684e':'#b9b4a7'} strokeWidth="3" fill="none"/><Circle cx="36" cy="18" r="1.7" fill="#414843"/><Path d="M39 23L43 21L40 18" fill={kind==='fox'?'#f4e1bf':'#d6cab8'}/></>}
  </Svg>;
}
export function WorldLife({theme,position,progress,paused,enabled,preview}:{theme:Theme;position:Point;progress:Progress;paused:boolean;enabled:boolean;preview:number}) {
  const latest=useRef({position,progress});latest.current={position,progress};
  const [sighting,setSighting]=useState<Sighting|null>(null);
  const [reduced,setReduced]=useState(true),[foreground,setForeground]=useState(AppState.currentState==='active');
  const travel=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    let alive=true;AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(alive)setReduced(value)});
    const motion=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduced);
    const state=AppState.addEventListener('change',value=>setForeground(value==='active'));
    return()=>{alive=false;motion.remove();state.remove()};
  },[]);
  useEffect(()=>{
    if(paused||!enabled||reduced||!foreground){setSighting(null);return;}
    let alive=true,timer:ReturnType<typeof setTimeout>;
    const spawn=()=>{
      const {position:p,progress:state}=latest.current;
      let route:Sighting|null=null;
      const options:Creature[]=theme.motif==='desert'?['tumbleweed','tumbleweed','fox']:theme.motif==='coast'?['crab']:theme.motif==='cave'?['bat','slime']:theme.motif==='volcanic'?['slime','bat']:theme.motif==='sky'?['rabbit','slime']:theme.motif==='city'||theme.motif==='castle'?['fox','rabbit']:['rabbit','fox'];
      for(let i=0;i<24&&!route;i++){
        const direction=Math.random()<.5?1:-1;
        const from={x:Math.max(60,Math.min(WORLD.width-60,p.x-direction*(70+Math.random()*80))),y:Math.max(300,Math.min(2040,p.y-70-Math.random()*170))};
        const to={x:Math.max(60,Math.min(WORLD.width-60,from.x+direction*(160+Math.random()*90))),y:from.y+(Math.random()-.5)*90};
        if(walkable(from,state,18)&&clearSegment(from,to,state))route={from,to,kind:options[Math.floor(Math.random()*options.length)]};
      }
      if(!route){timer=setTimeout(spawn,1500);return;}
      setSighting(route);travel.setValue(0);
      Animated.timing(travel,{toValue:1,duration:route.kind==='tumbleweed'?4900:3600,easing:Easing.linear,useNativeDriver:Platform.OS!=='web'}).start(({finished})=>{
        if(alive&&finished){setSighting(null);timer=setTimeout(spawn,8500+Math.random()*7000)}
      });
    };
    timer=setTimeout(spawn,preview?150:2600);
    return()=>{alive=false;clearTimeout(timer);travel.stopAnimation()};
  },[theme.id,paused,enabled,reduced,foreground,preview]);
  if(!sighting)return null;
  const {from,to,kind}=sighting;
  return <Animated.View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{position:'absolute',left:from.x-19,top:from.y-29,width:38,height:38,opacity:travel.interpolate({inputRange:[0,.12,.82,1],outputRange:[0,1,1,0]}),transform:[{translateX:travel.interpolate({inputRange:[0,1],outputRange:[0,to.x-from.x]})},{translateY:travel.interpolate({inputRange:[0,1],outputRange:[0,to.y-from.y]})}]}}>
    <View style={{position:'absolute',bottom:0,left:5,width:29,height:7,borderRadius:16,backgroundColor:'#29352d20'}}/>
    <Animated.View style={{transform:[{scaleX:kind==='tumbleweed'||to.x>from.x?1:-1},{translateY:travel.interpolate({inputRange:[0,.125,.25,.375,.5,.625,.75,.875,1],outputRange:[0,-5,0,-5,0,-5,0,-5,0]})},{rotate:travel.interpolate({inputRange:[0,1],outputRange:['0deg',kind==='tumbleweed'?'720deg':'0deg']})}]}}><Critter kind={kind} t={theme}/></Animated.View>
  </Animated.View>;
}
