# Upskill Hero — the living world

An interactive React Native / Expo UI concept for presenting a new adventure screen. Existing lesson content, battles, matchmaking, and accounts remain outside this prototype. Entry panels use **Finish lesson** / **Finish battle** to demonstrate the visible progression.

## Run

```sh
npm install
npm run web
```

The local browser preview runs at http://localhost:8081. The iPhone 17 Pro simulator runs the same app through Expo Go at port 8082. To launch another compatible iOS simulator, use `npm run ios` (Expo SDK 57). A physical iPhone has not been tested.

## App navigation and account UI

The original app chrome is represented with Welcome / codeman6, notification badge, player profile, streak 1, rank #1, and the Home / Feed / + / Paths / Review bottom bar. These account and global navigation elements are visual placeholders. The world’s Adventure, Atlas, and Show stages actions live in a rounded, collapsible rail on the right of the map; tap its chevron to collapse or its menu icon to expand.

## Present the concept

1. **Walk into range.** Use the joystick, arrow keys/WASD, or tap the map. The camera follows the knight across a world 920 × 2180 world with horizontal and vertical camera tracking. Tapping a distant landmark walks toward it; tap again when it glows to enter.
2. **Enter a lesson.** A short, theme-aware animated sequence plays. Press **Finish lesson** to return to the map, leave a checkmark, fill a progress segment, and activate the next landmark. Completed places can be revisited.
3. **Meet Orin.** Finishing lesson four lights the covered wagon’s lantern, opens its doorway, and reveals chimney smoke. Visit Orin once in that locale to unlock lesson five. His wagon parks beside the main road in every module, with no dedicated branch path.
4. **Discover a rival.** Walking through the grass near the third lesson triggers an ambush. Enter the battle or choose **Return to this battle later**. The encounter stays at that location. Completing it leaves a victory marker and never blocks lesson progression.
5. **Open the passage.** Finish all nine lessons and the Orin visit to reveal the cleared exit. The setting determines the obstacle: drawbridge, tide gate, boulder, ice arch, star seal, basalt barrier, castle portcullis, canal bridge, village gate, or crystal barrier. Enter the open passage to move to the next module.
6. **Explore the atlas.** Five modules each retain independent progress for the current session. The atlas deliberately allows previewing any module for the presentation. **New adventure · reset & shuffle** clears demo progress and chooses five unique themes from ten. **Try an environment in this chapter** previews any style while keeping chapter progress; if that style is already assigned elsewhere, the two themes swap.

### Presentation shortcuts

Desktop controls and the iPhone’s right-side **Show stages** panel offer:

- **Fresh trail:** no lessons completed.
- **Orin ready:** four lessons completed; the wagon is open.
- **Last lesson:** eight lessons and the Orin visit complete. Finish lesson nine to demonstrate the obstacle opening.
- **Exit open:** the module is complete, with the character beside its cleared exit.
- **Replay an ambush:** trigger the surprise wherever the knight is standing.
- **Walkthrough shortcut · next landmark:** skip the walk to the next lesson / Orin / exit.

Stage shortcuts replace only the current locale’s progress. They are demo controls, not part of the proposed player experience. Refreshing the app resets the entire prototype.

## Hidden discoveries

Discoveries sit off the road with no connecting path or destination label. A bush or rock gives an occasional rustle and tiny glint. Within 88 world units, a small chest appears; it stays discovered for that chapter until the demo resets. Only nearby uncollected chests show a compact **Open** prompt.

While present, the sidekick perks up within 170 world units of an undiscovered spot: a small question bubble and **Something nearby…** hint encourage exploration without revealing the exact location. Hints pause during the companion’s two-minute adventure. Reduced motion uses a steady glint instead of rustling.

Trees, planted scenery, and tree clusters stay outside both the main road and lesson branch paths. Light rock obstacles remain available to walk around.

## Environments

The initial adventure showcases woodland, coast, desert, snowy highlands, and a celestial/crystal grove. The theme pool also includes a dark, ashy volcanic crater, castle citadel, medieval city with castle towers and cobbled streets, cottage town, and underground cavern. Every theme supplies its palette, scenery, lesson names, and exit obstacle independently of progression logic, so more environments can be added without reimplementing lessons.

## Ambient world life

Small, non-interactive creatures occasionally cross the visible world and fade away: rabbits and foxes in the greener locales and medieval settlements, crabs on the coast, tumbleweeds in the desert, and bats or little monsters underground and around the volcano. Only one appears at a time. Ground routes avoid the existing obstacle geometry.

Use **Show stages → Preview a passing creature** to demonstrate it immediately, or toggle **World life: on / off** to compare the effect. Ambient motion pauses while panels, encounters, or entry animations are open, when the app is in the background, and when reduced motion is enabled. These are decorative encounters, separate from the player’s PvP ambush.

The desert also contains bleached rib cages and horned dragon-skull obstacles. Their collision uses the same footprints as the scenery they replace.

## Animation video

`output/video/upskill-hero-lesson-entry.mp4` is a short recording from the iPhone simulator showing a glowing landmark, its entry animation, the finish modal, and completed status. The animation itself runs locally in React Native; there is no remote video generation, media dependency, or API cost. It supports skipping and reduced motion.

## Implementation and boundaries

- `src/journey.ts`: theme definitions, locations, shuffle, progression, obstacle collision, tap-walk routing, and gate rules.
- `src/World.tsx`: native SVG world scenery and landmark artwork.
- `src/WorldLife.tsx`: occasional ambient creatures, animation scheduling, and motion preferences.
- `src/Discovery.tsx`: concealed scenery, proximity reveal, and compact chest interaction.
- `src/Cinematic.tsx`: entry and gate-opening animation sequences.
- `src/AppChrome.tsx`: original account header, global navigation placeholders, and collapsible world controls.
- `src/Sprite.tsx`: the knight and companion from the supplied screenshot, displayed through approximate SVG silhouette clipping. Replace with original transparent sprite files for production fidelity.
- `App.tsx`: camera, movement, proximity, panels, and presentation controls.
- `tests/journey.test.mjs`: progression, route reachability, scenery collision, and gate invariants.

Movement has light collision around central rocks, trees, planters, buildings, chests, and lesson landmarks. Tap-to-walk finds a route around these obstacles; joystick movement slides along their edges. The companion follows the player’s traveled path. Perimeter scenery is decorative; the northern module passage remains progress-gated. Lessons use local placeholders, with no fact API or real battle content. State lives in memory and survives locale switches, not app reloads.

## Verification

```sh
npm run typecheck
npm test
npx expo export --platform web --platform ios
```

Browser checks include proximity glow, lesson entry and completion, Orin’s visit unlocking lesson five, finishing lesson nine to open the exit, travel to the next locale, deferred-battle completion, and reshuffling to five distinct environments. The native iPhone 17 Pro simulator was used to verify the scrolling layout, entry sequence, finish action, and completed marker and to record the video.
