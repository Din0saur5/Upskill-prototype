import React, { useId, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, G, Image as SvgImage, Path, Rect } from 'react-native-svg';

const PURPLE='#9b7bcc';
type IconName='home'|'feed'|'plus'|'paths'|'review'|'bell'|'flame'|'trophy'|'atlas'|'stages'|'collapse'|'expand';
function Icon({name,color='#536052',size=23}:{name:IconName;color?:string;size?:number}) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {name==='home'?<><Path d="M4 10L12 4L20 10V20H4Z" fill={color} stroke={color}/><Path d="M10 20V14H14V20" stroke="#fffaf4"/></>:
    name==='feed'?<><Path d="M8 4H18Q21 4 21 7V13Q21 16 18 16H13L8 20V16Q5 16 5 13V7Q5 4 8 4Z"/><Path d="M4 9Q2 10 2 13V18L5 20"/></>:
    name==='plus'?<Path d="M12 5V19M5 12H19"/>:
    name==='paths'?<><Path d="M5 4Q12 2 18 6L20 16Q18 22 12 20L5 18Q2 12 5 4Z"/><Path d="M10 8L16 10L12 16L10 8Z"/></>:
    name==='review'?<><Path d="M12 6Q8 2 3 4V19Q8 17 12 21Q16 17 21 19V4Q16 2 12 6V21"/><Path d="M6 8L9 9M6 12L9 13M15 9L18 8"/></>:
    name==='bell'?<><Path d="M5 16L7 13V9a5 5 0 0 1 10 0V13L19 16Q12 19 5 16Z"/><Path d="M10 20Q12 22 14 20M12 4V2"/></>:
    name==='flame'?<><Path d="M13 2Q17 7 15 10L18 8Q23 17 16 21Q6 25 4 16Q3 12 8 7Q7 12 10 11Q13 8 13 2Z" fill={color} stroke="none"/><Path d="M12 12Q16 18 12 20Q8 19 10 16Z" fill="#e9dcfa" stroke="none"/></>:
    name==='trophy'?<><Path d="M7 3H17V9a5 5 0 0 1-10 0Z" fill={color}/><Path d="M7 5H3V8Q3 12 8 12M17 5H21V8Q21 12 16 12M12 14V19M8 21H16M9 19H15"/></>:
    name==='atlas'?<><Path d="M3 5L9 3L15 5L21 3V19L15 21L9 19L3 21V5ZM9 3V19M15 5V21"/><Circle cx="15" cy="10" r="2.5" fill="#fffdf7"/></>:
    name==='stages'?<><Path d="M4 7H20M4 17H20M8 4V10M16 14V20"/><Circle cx="8" cy="7" r="2" fill="#fffdf7"/><Circle cx="16" cy="17" r="2" fill="#fffdf7"/></>:
    name==='collapse'?<Path d="M8 8L12 12L16 8M8 14L12 18L16 14"/>:
    <><Path d="M5 7H19M5 12H19M5 17H19"/><Circle cx="17" cy="5" r="2.5" fill={PURPLE} stroke="#fffdf7"/></>}
  </Svg>;
}

export function AccountHeader() {
  const clip=useId().replace(/:/g,'');
  return <View style={c.account}>
    <View style={c.accountRow}>
      <View><Text style={c.welcome}>Welcome!</Text><Text style={c.username}>codeman6</Text></View>
      <View style={c.accountActions}>
        <View accessible accessibilityRole="image" accessibilityLabel="Notifications, unread notification (preview)" style={c.notification}><Icon name="bell" size={23}/><View style={c.unread}/></View>
        <View accessible accessibilityRole="image" accessibilityLabel="Player profile (preview)" style={c.profile}>
          <Svg width="39" height="39" viewBox="307 42 39 39"><Defs><ClipPath id={clip}><Circle cx="326.5" cy="61.5" r="19"/></ClipPath></Defs><SvgImage href={require('../assets/reference/current-adventure.jpeg')} x="0" y="0" width="360" height="778" clipPath={`url(#${clip})`}/></Svg>
        </View>
      </View>
    </View>
    <View style={c.stats}>
      <View accessible accessibilityLabel="Streak: 1 day" style={c.statPill}><View style={c.statIcon}><Icon name="flame" color={PURPLE} size={18}/></View><Text style={c.statValue}>1</Text></View>
      <View accessible accessibilityLabel="Rank: number 1" style={c.statPill}><View style={c.statIcon}><Icon name="trophy" color={PURPLE} size={18}/></View><Text style={c.statValue}>#1</Text></View>
    </View>
  </View>;
}

export function MainNavigation() {
  return <View style={c.bottomBar}>
    {(['home','feed','plus','paths','review'] as const).map((name,index)=><View key={name} accessible accessibilityRole="image" accessibilityLabel={`${['Home, current tab','Feed','Add','Paths','Review, unread item'][index]} (preview)`} style={c.navItem}>
      {name==='plus'?<View style={c.addButton}><Icon name="plus" color="#786094" size={27}/></View>:<>
        <View style={c.navIcon}><Icon name={name} color={name==='home'?PURPLE:'#536052'}/>{name==='review'&&<View style={c.reviewDot}/>}</View>
        <Text style={[c.navLabel,name==='home'&&{color:PURPLE,fontWeight:'600'}]}>{['Home','Feed','','Paths','Review'][index]}</Text>
      </>}
    </View>)}
  </View>;
}

export function WorldRail({accent,onAdventure,onAtlas,onStages,disabled=false}:{accent:string;onAdventure:()=>void;onAtlas:()=>void;onStages:()=>void;disabled?:boolean}) {
  const [expanded,setExpanded]=useState(true);
  const expansion=useRef(new Animated.Value(1)).current;
  const toggle=()=>{if(disabled)return;setExpanded(!expanded);Animated.timing(expansion,{toValue:expanded?0:1,duration:210,useNativeDriver:false}).start()};
  return <Animated.View style={[c.rail,{height:expansion.interpolate({inputRange:[0,1],outputRange:[48,211]})}]}>
    <Pressable accessibilityRole="button" accessibilityLabel={expanded?'Collapse world controls':'Expand world controls'} accessibilityState={{expanded,disabled}} disabled={disabled} onPress={toggle} style={c.railToggle}><Icon name={expanded?'collapse':'expand'} color={accent} size={20}/></Pressable>
    {expanded&&<Animated.View style={{opacity:expansion}}>
      {([{name:'Adventure',icon:'home',action:onAdventure},{name:'Atlas',icon:'atlas',action:onAtlas},{name:'Show stages',icon:'stages',action:onStages}] as const).map(({name,icon,action},index)=><Pressable key={name} accessibilityRole="button" accessibilityLabel={name==='Atlas'?'World atlas':name} disabled={disabled} onPress={action} style={({pressed})=>[c.railItem,index===0&&{backgroundColor:accent+'13'},pressed&&{opacity:.65}]}><Icon name={icon} color={index===0?accent:'#75806c'} size={20}/><Text style={[c.railLabel,index===0&&{color:accent}]}>{name}</Text></Pressable>)}
    </Animated.View>}
  </Animated.View>;
}
const c=StyleSheet.create({
  account:{paddingBottom:10,marginBottom:9,borderBottomWidth:1,borderBottomColor:'#eeece7'},accountRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},welcome:{fontSize:10,color:'#8b8d80',marginBottom:3},username:{fontSize:15,fontWeight:'700',color:'#354432'},accountActions:{flexDirection:'row',gap:12,alignItems:'center'},notification:{width:38,height:38,borderRadius:20,borderWidth:1,borderColor:'#e0ded7',backgroundColor:'#fffdfa',alignItems:'center',justifyContent:'center'},unread:{position:'absolute',width:5,height:5,backgroundColor:'#df8d8f',borderRadius:3,right:9,top:7,borderWidth:1,borderColor:'#fffdf7'},profile:{width:39,height:39,borderRadius:20,overflow:'hidden',backgroundColor:'#eee7f7'},stats:{flexDirection:'row',gap:8,marginTop:9},statPill:{flexDirection:'row',alignItems:'center',gap:7,paddingRight:12,height:27,borderRadius:15,backgroundColor:'#f0eafa'},statIcon:{height:27,width:28,borderRadius:15,backgroundColor:'#e5d8f4',alignItems:'center',justifyContent:'center'},statValue:{fontSize:11,fontWeight:'700',color:'#776487'},
  bottomBar:{height:67,flexDirection:'row',alignItems:'center',justifyContent:'space-around',backgroundColor:'#fffdf9',borderTopWidth:1,borderTopColor:'#ece9e8',paddingHorizontal:9},navItem:{flex:1,alignItems:'center',justifyContent:'center',height:60},navIcon:{width:30,height:29,alignItems:'center',justifyContent:'center'},navLabel:{fontSize:9,color:'#7c8479',marginTop:3},addButton:{width:53,height:53,borderRadius:28,backgroundColor:'#ddc9f5',borderWidth:5,borderColor:'#f6f0fd',alignItems:'center',justifyContent:'center',marginTop:-18,boxShadow:'0 4px 10px #9876bd30'},reviewDot:{position:'absolute',width:7,height:7,borderRadius:4,right:0,top:0,backgroundColor:PURPLE,borderWidth:1,borderColor:'#fffdf9'},
  rail:{position:'absolute',right:11,top:88,width:59,borderRadius:29,backgroundColor:'#fffdf6f5',borderWidth:1,borderColor:'#e5dfeb',boxShadow:'0 4px 18px #403c5020',overflow:'hidden',alignItems:'center'},railToggle:{height:46,width:57,alignItems:'center',justifyContent:'center'},railItem:{width:49,height:51,marginHorizontal:4,marginBottom:2,borderRadius:16,alignItems:'center',justifyContent:'center',gap:4},railLabel:{fontSize:8,color:'#7b8372',textAlign:'center'},
});
