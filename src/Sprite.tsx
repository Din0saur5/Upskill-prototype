import React, { useId } from 'react';
import Svg, { Defs, ClipPath, Path, Image as SvgImage } from 'react-native-svg';
export function Sprite({ companion = false, small = false }: { companion?: boolean; small?: boolean }) {
  const clipId = useId().replace(/:/g, "");
  const factor = companion ? (small ? .53 : .65) : .46;
  const crop = companion ? {x:67,y:530,w:34,h:53} : {x:35,y:335,w:106,h:181};
  const outline = companion
    ? 'M76 533L82 531L88 534L96 532L99 536L92 542L94 552L90 557L96 572L92 579L84 577L79 580L73 577L76 565L71 557L75 550L72 542L68 537L76 538Z'
    : 'M81 337L87 339L91 349L96 345L94 357L91 365L102 370L109 380L111 396L109 416L105 427L115 438L120 436L129 417L135 413L142 420L132 437L125 446L121 463L114 473L108 470L103 461L98 471L106 491L93 492L87 480L80 482L80 498L68 497L69 483L60 495L42 499L42 488L48 478L44 471L38 459L38 443L56 437L59 427L66 423L60 416L58 396L59 381L64 373L78 366L78 355Z';
  return <Svg width={crop.w*factor} height={crop.h*factor} viewBox={`${crop.x} ${crop.y} ${crop.w} ${crop.h}`}>
    <Defs><ClipPath id={clipId}><Path d={outline}/></ClipPath></Defs>
    <SvgImage href={require('../assets/reference/current-adventure.jpeg')} x="0" y="0" width="360" height="778" clipPath={`url(#${clipId})`}/>
  </Svg>;
}
