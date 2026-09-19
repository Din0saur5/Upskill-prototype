import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, AppState, Easing, Platform, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { ambientRoute, creaturesFor, type AmbientRoute, type Creature, type WorldWindow, type Point, type Progress, type Theme } from './journey';

type Sighting=AmbientRoute & {kind:Creature};
function Critter({kind,t}:{kind:Creature;t:Theme}){
  return <Svg width="38" height="34" viewBox="0 0 44 40">
    {kind==='imp'?<><Path d="M13 22Q0 7 2 23L11 29M29 22Q44 7 42 23L33 29" fill="#863e48"/><Path d="M12 30Q0 40 4 25L1 22" stroke="#cf7356" strokeWidth="3" fill="none"/><Path d="M0 22L6 24L3 18Z" fill="#e7a460"/><Ellipse cx="23" cy="27" rx="10" ry="9" fill="#c96e54"/><Circle cx="23" cy="15" r="10" fill="#d9835c"/><Path d="M15 9L12 0L21 6M27 6L35 0L32 12" fill="#ebcd96"/><Path d="M15 32L13 39H20M27 32L31 39H36" stroke="#83484c" strokeWidth="3" fill="none"/><Path d="M17 14L22 16M26 16L31 13" stroke="#ffe49a" strokeWidth="3"/><Path d="M23 22L29 21" stroke="#6f3940" strokeWidth="2"/></>:
    kind==='goblin'?<><Path d="M13 14L1 7L5 23L16 22M29 14L43 6L39 23L29 23" fill="#82a773"/><Path d="M13 27L11 36H34L30 25Z" fill="#86715d"/><Circle cx="23" cy="17" r="12" fill="#91b37c"/><Path d="M25 18L38 23L26 26Z" fill="#a6bb84"/><Path d="M15 8L22 0L28 7" fill="#5f825e"/><Path d="M16 35L14 39M29 35L33 39" stroke="#789367" strokeWidth="4"/><Circle cx="20" cy="16" r="2" fill="#384f3d"/><Circle cx="29" cy="16" r="2" fill="#384f3d"/><Path d="M23 27L26 31L29 26" fill="#f4e1b4"/></>:
    kind==='tumbleweed'?<><Circle cx="22" cy="20" r="14" fill="#c8a16f55" stroke="#ac8655" strokeWidth="2"/><Path d="M10 10L32 30L26 5L16 35L8 22L35 16L12 30L18 6L33 11L7 15L29 34M9 13Q31 1 33 25Q19 38 12 19Q19 6 29 21" stroke="#b08d5e" strokeWidth="1.5" fill="none"/></>:
    kind==='bat'?<><Path d="M22 19Q12 1 2 8L8 25L15 22L22 29L29 22L36 25L42 8Q32 1 22 19" fill="#9a8bab"/><Ellipse cx="22" cy="21" rx="6" ry="10" fill="#6b617e"/><Path d="M17 14L16 5L22 11L28 5L27 14" fill="#6b617e"/><Circle cx="20" cy="17" r="1.5" fill="#eee1ac"/><Circle cx="25" cy="17" r="1.5" fill="#eee1ac"/></>:
    kind==='slime'?<><Path d="M5 31Q3 14 14 12L18 5L24 11Q38 13 39 31Q32 37 22 33Q11 38 5 31Z" fill={t.dark?'#bc846f':'#9dba94'}/><Circle cx="26" cy="21" r="2" fill="#464958"/><Circle cx="34" cy="21" r="2" fill="#464958"/><Ellipse cx="13" cy="19" rx="4" ry="6" fill="#fff" opacity=".24"/></>:
    kind==='crab'?<><Path d="M9 24L2 31M11 28L6 36M32 24L42 31M30 28L37 36M12 20L5 11M31 20L39 11" stroke="#b87760" strokeWidth="3" fill="none"/><Ellipse cx="22" cy="25" rx="14" ry="10" fill="#d89979"/><Path d="M1 5L6 9L10 4L10 13L4 15ZM34 4L39 9L43 5L42 15L35 13Z" fill="#d89979"/><Circle cx="18" cy="18" r="2" fill="#504f4b"/><Circle cx="26" cy="18" r="2" fill="#504f4b"/></>:
    <><Path d={kind==='fox'?'M14 25Q-8 31 4 12L15 21Z':'M12 24Q0 12 4 27Z'} fill={kind==='fox'?'#b9825f':'#f0e9d5'}/><Ellipse cx="22" cy="25" rx="13" ry="9" fill={kind==='fox'?'#c89267':'#ded8c6'}/><Circle cx="33" cy="19" r="8" fill={kind==='fox'?'#c89267':'#eee7d6'}/><Path d={kind==='fox'?'M27 14L26 4L34 11L39 5L40 18Z':'M28 15Q20-8 29 3L33 14M33 13Q31-8 38 2L38 15'} fill={kind==='fox'?'#c89267':'#eee7d6'}/><Path d="M14 31L11 35H19M29 31L28 35H35" stroke={kind==='fox'?'#8a684e':'#b9b4a7'} strokeWidth="3" fill="none"/><Circle cx="36" cy="18" r="1.7" fill="#414843"/><Path d="M39 23L43 21L40 18" fill={kind==='fox'?'#f4e1bf':'#d6cab8'}/></>}
  </Svg>;
}
export function WorldLife({theme,position,view,progress,paused,enabled,preview}:{theme:Theme;position:Point;view:WorldWindow;progress:Progress;paused:boolean;enabled:boolean;preview:number}) {
  const latest=useRef({position,view,progress});latest.current={position,view,progress};
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
      const {position:p,view:window,progress:state}=latest.current;
      const path=ambientRoute(window,p,state);
      if(!path){timer=setTimeout(spawn,1800);return;}
      const options=creaturesFor(theme.motif);
      const route:Sighting={...path,kind:options[Math.floor(Math.random()*options.length)]};
      setSighting(route);travel.setValue(0);
      Animated.timing(travel,{toValue:1,duration:route.kind==='tumbleweed'?6500:5400,easing:Easing.linear,useNativeDriver:Platform.OS!=='web'}).start(({finished})=>{
        if(alive&&finished){setSighting(null);timer=setTimeout(spawn,8500+Math.random()*7000)}
      });
    };
    timer=setTimeout(spawn,preview?150:2600);
    return()=>{alive=false;clearTimeout(timer);travel.stopAnimation()};
  },[theme.id,paused,enabled,reduced,foreground,preview]);
  if(!sighting)return null;
  const {points:[from,mid,to],kind}=sighting;
  const timing=kind==='tumbleweed'?[0,.48,.52,1]:[0,.4,.58,1];
  return <Animated.View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{position:'absolute',left:from.x-19,top:from.y-29,width:38,height:38,opacity:travel.interpolate({inputRange:[0,.12,.82,1],outputRange:[0,1,1,0]}),transform:[{translateX:travel.interpolate({inputRange:timing,outputRange:[0,mid.x-from.x,mid.x-from.x,to.x-from.x]})},{translateY:travel.interpolate({inputRange:timing,outputRange:[0,mid.y-from.y,mid.y-from.y,to.y-from.y]})}]}}>
    <View style={{position:'absolute',bottom:0,left:5,width:29,height:7,borderRadius:16,backgroundColor:'#29352d20'}}/>
    <Animated.View style={{transform:[{scaleX:travel.interpolate({inputRange:[0,.49,.5,1],outputRange:[mid.x>=from.x?1:-1,mid.x>=from.x?1:-1,to.x>=mid.x?1:-1,to.x>=mid.x?1:-1]})},{translateY:travel.interpolate({inputRange:[0,.125,.25,.375,.5,.625,.75,.875,1],outputRange:[0,-5,0,-5,0,-5,0,-5,0]})},{rotate:travel.interpolate({inputRange:[0,1],outputRange:['0deg',kind==='tumbleweed'?'720deg':'0deg']})}]}}><Critter kind={kind} t={theme}/></Animated.View>
  </Animated.View>;
}
