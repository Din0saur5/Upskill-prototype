import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { TrollBridge } from './TrollBridge';
import { LandmarkArt } from './World';
import type { Theme } from './journey';
export type Film = { title:string; subtitle:string; kind:'lesson'|'battle'|'wagon'|'gate'|'chest'; index?:number; complete?:boolean; onEnd:()=>void };

// A local animated entry sequence, rather than a downloaded video: theme-aware,
// replayable, and reduced-motion-aware on both native and web.
export function Cinematic({film,theme}:{film:Film;theme:Theme}) {
  const progress=useRef(new Animated.Value(0)).current;
  const ended=useRef(false);
  const [trollCleared,setTrollCleared]=useState(false);
  useEffect(()=>{const timer=setTimeout(()=>setTrollCleared(true),550);return()=>clearTimeout(timer)},[]);
  const latest=useRef(film.onEnd);latest.current=film.onEnd;
  const end=()=>{if(!ended.current){ended.current=true;latest.current()}};
  useEffect(()=>{
    let alive=true;
    AccessibilityInfo.isReduceMotionEnabled().then(reduced=>{
      if(!alive)return;
      Animated.timing(progress,{toValue:1,duration:reduced?250:1900,easing:Easing.inOut(Easing.cubic),useNativeDriver:Platform.OS!=='web'}).start(({finished})=>{if(finished&&alive)end()});
    });
    return()=>{alive=false;progress.stopAnimation()};
  },[]);
  return <Animated.View accessibilityViewIsModal style={[styles.cover,{backgroundColor:theme.groundLight,opacity:progress.interpolate({inputRange:[0,.12,.86,1],outputRange:[0,1,1,0]})}]}>
    <View style={[styles.aura,{backgroundColor:theme.accent+'22'}]}/>
    {Array.from({length:12},(_,i)=><Animated.Text key={i} style={[styles.spark,{left:`${12+(i*19)%80}%`,top:`${15+(i*23)%65}%`,color:theme.accent,opacity:progress.interpolate({inputRange:[0,.3,.75,1],outputRange:[0,.8,.7,0]}),transform:[{translateY:progress.interpolate({inputRange:[0,1],outputRange:[30,-60]})}]}]}>✦</Animated.Text>)}
    <Animated.View style={{width:170,height:170,transform:[{scale:progress.interpolate({inputRange:[0,.2,.8,1],outputRange:[.5,.92,1.3,1.65]})},{translateY:progress.interpolate({inputRange:[0,1],outputRange:[22,-12]})}]}}>{film.kind==='gate'&&film.subtitle==='Chapter complete'&&theme.motif==='forest'?<TrollBridge ready={trollCleared}/>:film.kind==='gate'&&film.subtitle==='Chapter complete'?<>
      <Animated.View style={{position:'absolute',inset:0,opacity:progress.interpolate({inputRange:[0,.25,.65,1],outputRange:[1,1,0,0]}),transform:[{translateX:progress.interpolate({inputRange:[0,.25,.8,1],outputRange:[0,0,theme.motif==='desert'||theme.motif==='volcanic'?85:0,85]})},{scaleY:progress.interpolate({inputRange:[0,.25,.75,1],outputRange:[1,1,.15,.15]})}]}}><LandmarkArt kind="gate" theme={theme}/></Animated.View>
      <Animated.View style={{position:'absolute',inset:0,opacity:progress.interpolate({inputRange:[0,.35,.7,1],outputRange:[0,0,1,1]})}}><LandmarkArt kind="gate" theme={theme} ready/></Animated.View>
    </>:<LandmarkArt kind={film.kind} index={film.index} theme={theme} ready done={film.complete}/>}</Animated.View>
    <Animated.View style={{alignItems:'center',opacity:progress.interpolate({inputRange:[0,.2,.7,1],outputRange:[0,1,1,0]})}}>
      <Text style={[styles.kicker,{color:theme.accent}]}>{film.subtitle.toUpperCase()}</Text>
      <Text style={[styles.title,{color:theme.dark?'#f3eae3':theme.ink}]}>{film.title}</Text>
    </Animated.View>
    <Animated.View style={[styles.bar,{top:0,transform:[{scaleY:progress.interpolate({inputRange:[0,.12,.85,1],outputRange:[0,1,1,0]})}]}]}/>
    <Animated.View style={[styles.bar,{bottom:0,transform:[{scaleY:progress.interpolate({inputRange:[0,.12,.85,1],outputRange:[0,1,1,0]})}]}]}/>
    <Pressable accessibilityRole="button" onPress={end} style={styles.skip}><Text style={styles.skipText}>Skip animation</Text></Pressable>
  </Animated.View>;
}
const styles=StyleSheet.create({cover:{...StyleSheet.absoluteFill,zIndex:20,justifyContent:'center',alignItems:'center'},aura:{position:'absolute',width:280,height:280,borderRadius:150},spark:{position:'absolute',fontSize:15},title:{fontSize:27,lineHeight:34,fontWeight:'600',textAlign:'center',maxWidth:300,marginTop:12,letterSpacing:-.8},kicker:{fontSize:9,letterSpacing:2,fontWeight:'700',marginTop:25},bar:{position:'absolute',left:0,right:0,height:58,backgroundColor:'#29392f'},skip:{position:'absolute',bottom:20,right:22,padding:12},skipText:{fontSize:10,color:'#f8f5e9'}});
