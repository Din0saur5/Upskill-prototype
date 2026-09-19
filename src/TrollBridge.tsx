import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, AppState, Easing, Platform, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

export function TrollBridge({ready=false}:{ready?:boolean}) {
  const idle=useRef(new Animated.Value(0)).current,aside=useRef(new Animated.Value(ready?1:0)).current;
  const [reduced,setReduced]=useState(true),[active,setActive]=useState(AppState.currentState==='active');
  useEffect(()=>{
    let alive=true;AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(alive)setReduced(value)});
    const motion=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduced);
    const state=AppState.addEventListener('change',value=>setActive(value==='active'));
    return()=>{alive=false;motion.remove();state.remove()};
  },[]);
  useEffect(()=>{
    if(reduced||!active){idle.setValue(0);return;}
    const animation=Animated.loop(Animated.timing(idle,{toValue:1,duration:5200,easing:Easing.linear,useNativeDriver:Platform.OS!=='web'}));
    animation.start();return()=>{animation.stop();idle.setValue(0)};
  },[reduced,active]);
  useEffect(()=>{Animated.timing(aside,{toValue:ready?1:0,duration:reduced?0:850,easing:Easing.inOut(Easing.cubic),useNativeDriver:Platform.OS!=='web'}).start()},[ready,reduced]);
  return <View style={{width:'100%',height:'100%'}}>
    <Svg width="100%" height="100%" viewBox="0 0 120 120">
      <Ellipse cx="60" cy="101" rx="47" ry="12" fill="#526b53" opacity=".18"/>
      <Path d="M29 15H84V103H29Z" fill="#937759"/>
      {[22,36,50,64,78,92].map(y=><Path key={y} d={`M30 ${y}H83`} stroke="#d7bd90" strokeWidth="11"/>)}
      <Path d="M21 18V105M92 18V105M23 29L26 87M90 29L87 87" stroke="#877153" strokeWidth="4"/>
      {[22,91].map(x=><Rect key={x} x={x-5} y="13" width="10" height="17" rx="3" fill="#ad946d"/>)}
    </Svg>
    <Animated.View style={{position:'absolute',left:'24%',top:'22%',width:'54%',height:'72%',transform:[{translateX:aside.interpolate({inputRange:[0,1],outputRange:[0,38]})},{translateY:idle.interpolate({inputRange:[0,.25,.5,.75,1],outputRange:[0,-1,0,1,0]})},{rotate:aside.interpolate({inputRange:[0,1],outputRange:['0deg','-8deg']})}]}}>
      <Svg width="100%" height="100%" viewBox="0 0 65 86">
        <Ellipse cx="32" cy="79" rx="27" ry="6" fill="#4d654e" opacity=".2"/>
        <Path d="M17 63L12 79H28L29 64M39 63L39 79H55L48 62" fill="#819568"/>
        <Path d="M11 36Q-1 45 6 62L17 58M50 36Q66 46 59 63L48 59" fill="#8da273"/>
        <Path d="M12 37Q30 24 51 38L54 67Q32 77 10 66Z" fill="#90a779"/>
        <Ellipse cx="32" cy="54" rx="16" ry="17" fill="#b2bd8a"/>
        <Path d="M10 64L54 64L58 74L42 70L32 76L21 70L7 74Z" fill="#84765a"/>
        <Path d="M15 14L2 10L8 28L20 25M47 14L63 10L56 29L46 26" fill="#849c70"/>
        <Rect x="14" y="7" width="37" height="32" rx="14" fill="#a2b37e"/>
        <Path d="M15 13L20 2L27 6L35 0L43 7L49 4L49 15" fill="#668167"/>
        <Path d="M19 19L27 18M38 18L45 20" stroke="#53694f" strokeWidth="3" strokeLinecap="round"/>
        <Circle cx="24" cy="23" r="2" fill="#374c3e"/><Circle cx="42" cy="23" r="2" fill="#374c3e"/>
        <Ellipse cx="33" cy="27" rx="8" ry="5" fill="#bbc495"/>
        <Path d={ready?'M25 33Q33 39 42 32':'M25 35Q33 32 42 35'} stroke="#5f7352" strokeWidth="2" fill="none"/>
        <Path d="M25 34L27 28L30 35M39 35L42 28L43 34" fill="#eee3bc"/>
      </Svg>
      <Animated.View style={{position:'absolute',right:-3,top:24,width:24,height:35,transformOrigin:'bottom center',transform:[{rotate:idle.interpolate({inputRange:[0,.4,.5,.58,.66,.75,1],outputRange:['0deg','0deg','-52deg','-38deg','-52deg','0deg','0deg']})}]}}><Svg width="24" height="35" viewBox="0 0 24 35"><Path d="M5 32L3 15Q0 4 9 5Q19 3 20 12L16 31Z" fill="#8fa675"/><Path d="M7 8V15M12 8V15" stroke="#b2c18b" strokeWidth="2"/></Svg></Animated.View>
      <Animated.View style={{position:'absolute',top:-20,left:12,opacity:idle.interpolate({inputRange:[0,.35,.45,.7,.8,1],outputRange:[0,0,.9,.9,0,0]}),backgroundColor:'#fff6dd',paddingHorizontal:6,borderRadius:8}}><Text style={{fontSize:13,color:'#758561'}}>{ready?'♪':'…'}</Text></Animated.View>
    </Animated.View>
  </View>;
}
