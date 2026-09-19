# Upskill Hero — the living world

An interactive React Native / Expo UI concept for presenting a new adventure screen. Existing lesson content, battles, matchmaking, and accounts remain outside this prototype. Entry panels use **Finish lesson** / **Finish battle** to demonstrate the visible progression.

## Product strategy

**Make learning feel like an adventure you inhabit.** Upskill Hero already has lessons and battles. This project explores a different way to reach them: a small fantasy world where progress changes the places around you.

The intended audience is learners using the existing iPhone app, and the immediate audience for this repository is the team evaluating that direction. This is a presentation prototype, not a replacement for the existing lesson, battle, or account systems.

### The problem we are exploring

The current adventure screen communicates progress clearly, but its chain of circular lesson nodes feels too close to Duolingo. The opportunity is to give Upskill Hero a more distinctive identity through its knight, companion, Orin, and fantasy settings while keeping the next learning step understandable.

Our hypothesis is that movement, optional discoveries, and visible changes to the world can make a linear curriculum feel more personal and less like a checklist. That is a design hypothesis to test with learners, not an established retention or learning-outcome claim.

### The approach

- **Keep the curriculum guided; give exploration room.** Nine lessons remain sequential within each module. The player can wander sideways, investigate scenery, and take small detours. A next-objective prompt and optional follow-the-trail action keep navigation approachable.
- **Turn destinations into invitations.** A lesson is a place in the world. It lights up when the player is close and ready to enter. Finishing it leaves a visible mark and makes the next place available.
- **Make progress change the environment.** Orin’s wagon opens after lesson four. Finishing the module opens its exit: a gate lifts, a barrier moves, or a troll steps aside. The world reflects what the learner has done.
- **Use curiosity without creating an obligation.** Hidden discoveries have no signposted roads or large labels. The companion gives a gentle nearby hint. Discoveries, companion outings, and PvP encounters do not gate lessons.
- **Let surprise respect the player’s time.** A rival can interrupt a walk with an ambush reveal, but the learner can return to the battle later. The unfinished encounter stays in the locale for the current session.
- **Build variety through reusable environments.** A shared progression structure supports woodland, coast, desert, snow, celestial, volcanic, castle, city, town, and cave themes. A new adventure samples five distinct themes. Longer term, more environments and authored layout variants could make adventures feel different without changing lesson logic.
- **Add life without adding clutter.** Small creatures enter from the edges, wander briefly, and leave. They are background atmosphere. Essential navigation, lesson readiness, and the real PvP encounter must remain more prominent.

### What stays familiar

The existing knight and companion appearances, Orin, account header, streak and rank indicators, notifications, profile, and bottom navigation remain represented. The world controls occupy a collapsible side rail so they fit around the app’s existing navigation. Orin travels in a covered wagon, giving every module a nearby meeting place without requiring a return to a central hub.

### What this prototype should help us decide

Can someone find and enter the next lesson without explanation? Does wandering feel pleasant rather than slow? Are discoveries findable without labels? Does the companion hint help without giving the hiding place away? Can someone defer a battle confidently? Does the world feel recognizably like Upskill Hero?

In a small moderated comparison with the current adventure screen, observe time to the first lesson, navigation mistakes, requests for help, successful battle deferral and return, and reactions to discoveries. Compare perceived freedom and visual identity alongside these usability observations. Success thresholds and any longer-term retention study should be agreed by the team after a baseline; this repository contains no analytics or measured results.

### Delivery strategy

1. **Evaluate the concept:** use this demo to choose the navigation and visual direction.
2. **Integrate a vertical slice:** connect one locale to existing lesson, Orin, and battle flows, with reliable return-to-world behavior and saved progress.
3. **Validate on iPhone:** tune navigation time, touch targets, accessibility, animation intensity, and performance on the team’s supported devices.
4. **Expand the world library:** add reusable environments and layout variants only after the core loop works well.

Keep the first implementation focused on the adventure screen. Procedural world generation, new battle rules, matchmaking, an economy, and multiplayer avatars are outside this prototype’s scope.

## Product and interaction specification

Read [SPEC.md](SPEC.md) for the agreed direction, current state transitions, interaction rules, environment guidance, acceptance scenarios, and the proposed integration boundaries. It explicitly separates implemented behavior, presentation shortcuts, and future work.

## Run

```sh
npm install
npm run web
```

The local browser preview runs at http://localhost:8081. The iPhone 17 Pro simulator runs the same app through Expo Go at port 8082. To launch another compatible iOS simulator, use `npm run ios` (Expo SDK 57). A physical iPhone has not been tested.

## App navigation and account UI

The original app chrome is represented with Welcome / codeman6, notification badge, player profile, streak 1, rank #1, and the Home / Feed / + / Paths / Review bottom bar. These account and global navigation elements are visual placeholders. The world’s Adventure, Atlas, and Show stages actions live in a rounded, collapsible rail on the right of the map; tap its chevron to collapse or its menu icon to expand.

## Present the concept

1. **Walk into range.** Use the joystick, arrow keys/WASD, or tap the map. The camera follows the knight across a 920 × 2180 world with horizontal and vertical camera tracking. Tapping a distant landmark walks toward it; tap again when it glows to enter.
2. **Enter a lesson.** A short, theme-aware animated sequence plays. Press **Finish lesson** to return to the map, leave a checkmark, fill a progress segment, and activate the next landmark. Completed places can be revisited.
3. **Meet Orin.** Finishing lesson four lights the covered wagon’s lantern, opens its doorway, and reveals chimney smoke. Visit Orin once in that locale to unlock lesson five. His wagon parks beside the main road in every module, with no dedicated branch path.
4. **Discover a rival.** Walking through the grass near the third lesson triggers an ambush. Enter the battle or choose **Return to this battle later**. The encounter stays at that location. Completing it leaves a victory marker and never blocks lesson progression.
5. **Open the passage.** Finish all nine lessons and the Orin visit to reveal the cleared exit. The setting determines the obstacle: troll-guarded woodland bridge, tide gate, boulder, ice arch, star seal, basalt barrier, castle portcullis, canal bridge, village gate, or crystal barrier. Enter the open passage to move to the next module.
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

Small, non-interactive creatures occasionally cross the visible world and fade away: rabbits and foxes in the greener locales and medieval settlements, crabs on the coast, tumbleweeds in the desert, bats and goblins underground, and little imps around the volcano. Only one appears at a time. Creatures enter from varied screen edges, make short detours with occasional pauses, and retreat out of view. Routes avoid the existing obstacle geometry and keep a 105-unit buffer around the player at spawn.

Use **Show stages → Preview a passing creature** to demonstrate it immediately, or toggle **World life: on / off** to compare the effect. Ambient motion pauses while panels, encounters, or entry animations are open, when the app is in the background, and when reduced motion is enabled. These are decorative encounters, separate from the player’s PvP ambush.

The woodland bridge is guarded by an idle troll that sways and scratches its head. After nine lessons and the Orin visit, it steps aside with a friendly expression; the passage uses the same module-completion rule. Use **Last lesson** and **Exit open** to compare the two states.

The desert’s obstacles are predominantly sandstone rocks, with one large horned dragon skull and a single rib cage as sparse accents. Their collision uses the same footprints as the scenery they replace.

## Animation video

`output/video/upskill-hero-lesson-entry.mp4` is a short recording from the iPhone simulator showing a glowing landmark, its entry animation, the finish modal, and completed status. The animation itself runs locally in React Native; there is no remote video generation, media dependency, or API cost. It supports skipping and reduced motion.

## Implementation and boundaries

- `src/journey.ts`: theme definitions, locations, shuffle, progression, obstacle collision, tap-walk routing, and gate rules.
- `src/World.tsx`: native SVG world scenery and landmark artwork.
- `src/TrollBridge.tsx`: idle woodland gatekeeper and step-aside animation.
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
