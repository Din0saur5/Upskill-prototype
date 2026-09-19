import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { LandmarkArt } from './World';
import type { Point, Theme } from './journey';

// Hidden spots are scenery, not tappable destinations. Only proximity reveals a chest.
export function Discovery({point,theme:t,revealed,done,near,onPress}:{point:Point;theme:Theme;revealed:boolean;done:boolean;near:boolean;onPress:()=>void}) {
  const rustle=useRef(new Animated.Value(0)).current;
  const reveal=useRef(new Animated.Value(revealed?1:0)).current;
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    let alive=true;
    AccessibilityInfo.isReduceMotionEnabled().then(value=>{if(alive)setReduced(value)});
    const subscription=AccessibilityInfo.addEventListener('reduceMotionChanged',setReduced);
    return()=>{alive=false;subscription.remove()};
  },[]);
  useEffect(()=>{
    if(revealed||reduced){rustle.setValue(0);return;}
    const animation=Animated.loop(Animated.sequence([
      Animated.delay(2600+(point.y%3)*350),
      ...[1,-1,.6,0].map(toValue=>Animated.timing(rustle,{toValue,duration:110,useNativeDriver:Platform.OS!=='web'})),
    ]));animation.start();return()=>animation.stop();
  },[revealed,reduced]);
  useEffect(()=>{
    Animated.timing(reveal,{toValue:revealed?1:0,duration:reduced?0:400,useNativeDriver:Platform.OS!=='web'}).start();
  },[revealed,reduced]);
  const rocky=t.dark||t.motif==='desert'||t.motif==='sky';
  return <View pointerEvents="box-none" style={{position:'absolute',left:point.x-38,top:point.y-54,width:76,height:84}}>
    <Animated.View pointerEvents="none" accessible={false} style={{position:'absolute',width:76,height:70,opacity:revealed?.4:1,transform:[{translateX:rustle.interpolate({inputRange:[-1,1],outputRange:[-1.6,1.6]})}]}}>
      <Svg width="76" height="70" viewBox="0 0 76 70">
        <Ellipse cx="38" cy="58" rx="31" ry="9" fill={t.dark?'#14191e':t.ink} opacity=".18"/>
        {rocky?<><Path d="M9 53L16 30L32 21L58 29L69 50L55 61H24Z" fill={t.foliage}/><Path d="M16 30L36 43L32 21M36 43L55 61L69 50" stroke={t.foliageLight} strokeWidth="3" fill="none"/></>:<><Ellipse cx="22" cy="46" rx="17" ry="15" fill={t.foliage}/><Ellipse cx="52" cy="44" rx="18" ry="17" fill={t.foliage}/><Circle cx="36" cy="37" r="19" fill={t.foliageLight}/><Ellipse cx="39" cy="52" rx="24" ry="12" fill={t.foliage}/>{t.motif==='snow'&&<Path d="M18 29Q35 13 51 29L44 34L35 29L26 34Z" fill="#eef7fb"/>}</>}
      </Svg>
      {!revealed&&<Animated.Text style={{position:'absolute',left:47,top:27,fontSize:12,color:t.dark?'#efd6a0':'#fff9d6',opacity:reduced?.7:rustle.interpolate({inputRange:[-1,0,1],outputRange:[.75,.15,1]})}}>✧</Animated.Text>}
    </Animated.View>
    {revealed&&<Animated.View style={{opacity:reveal,transform:[{translateY:reveal.interpolate({inputRange:[0,1],outputRange:[10,0]})},{scale:reveal.interpolate({inputRange:[0,1],outputRange:[.7,1]})}]}}>
      <Pressable accessibilityRole="button" accessibilityLabel={done?'Discovered treasure, collected':near?'Discovered treasure, open':'Discovered treasure, walk closer'} onPress={onPress} style={{width:76,height:84,alignItems:'center'}}>
        <View pointerEvents="none" style={{width:76,height:70}}><LandmarkArt kind="chest" theme={t} done={done} ready/></View>
        {near&&!done&&<Text style={{fontSize:9,color:t.dark?'#f6e3b4':t.ink,backgroundColor:t.dark?'#242028dd':'#fff9dfdd',paddingHorizontal:8,paddingVertical:3,borderRadius:7,marginTop:-5}}>Open</Text>}
      </Pressable>
    </Animated.View>}
  </View>;
}
