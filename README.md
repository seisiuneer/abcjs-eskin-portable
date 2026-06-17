# abcjs-eskin-portable

Fork of abcjs with additional notation rendering and playback features based on those available with the ABC Transcription Tools 

## Files

Load the files in this order:

```html
<link rel="stylesheet" href="abcjs-eskin-audio.css">

<script src="abcjs-eskin-chord-intervals.js"></script>
<script src="abcjs-eskin-portable-min.js"></script>
<script src="your-application.js"></script>
```

`abcjs-eskin-chord-intervals.js` must load before `abcjs-eskin-portable-min.js` when chord accompaniment is used.

## Quick start: add tune display and playback to an existing website

This is the shortest complete path from an existing page to working notation
and playback.

### Required resources

Your page must be able to load:

- `abcjs-eskin-audio.css`
- `abcjs-eskin-chord-intervals.js`
- `abcjs-eskin-portable-min.js`
- The instrument-note files under the configured soundfont URL
- Reverb impulse-response files when reverb is enabled

Resources hosted on another origin must allow cross-origin access with
appropriate CORS response headers. Serve the page through HTTP or HTTPS rather
than opening it directly with a `file:` URL.

### Lifecycle

First render:

```text
Apply settings
→ renderAbc()
→ create SynthController
→ load()
→ await setTune()
→ user clicks Play
```

After ABC or settings change:

```text
destroy old controller
→ clear an affected cache when necessary
→ apply settings
→ render again
→ create a new controller
→ load()
→ await setTune()
→ user clicks Play
```

`setTune()` prepares audio. It does not start playback automatically. The user
starts playback with the generated Play button, which also satisfies the normal
browser requirement that audio begin in response to a user gesture.

### Complete copy-and-paste example

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>ABC tune display and playback</title>
  <link rel="stylesheet" href="abcjs-eskin-audio.css">

  <style>
    body {
      max-width: 900px;
      margin: 30px auto;
      padding: 0 18px;
      font-family: Arial, sans-serif;
    }

    #paper {
      margin-bottom: 12px;
    }

    #error {
      min-height: 1.4em;
      color: #a00000;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <h1>ABC tune</h1>

  <div id="paper"></div>
  <div id="audio-controls"></div>
  <p id="error" role="alert"></p>

  <script src="abcjs-eskin-chord-intervals.js"></script>
  <script src="abcjs-eskin-portable-min.js"></script>

  <script>
    "use strict";

    const abcText =
      "X:1\n" +
      "T:Cooley's\n" +
      "C:Traditional\n" +
      "R:Reel\n" +
      "M:4/4\n" +
      "L:1/8\n" +
      "Q:1/2=90\n" +
      "K:Edor\n" +
      '|:"Em"EBBA B2 EB|B2 AB dBAG|"D"F/E/D AD BDAD|F/E/D AD BAGF|\n' +
      '"Em"EBBA B2 EB|B2 AB defg|"D"afge dBAF|1 DEFD "Em"E3D:|2 DEFD "Em"E2gf||\n' +
      '|:"Em"eB (3BBB eBgf|eBB2 gedB|"D"A/A/A FA DAFA|A/A/A FA defg|\n' +
      '"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]';

    let controller = null;

    const renderParams = {
      responsive: "resize",
      expandToWidest: "true",
      selectTypes: false
    };

    const playerOptions = {
      displayLoop: true,
      displayRestart: true,
      displayPlay: true,
      displayProgress: true,
      displayWarp: true
    };

    const synthOptions = {
      program: 0,
      chordsOff: false
    };

    function applySettings() {
      ABCJS.eskinConfig.setSoundFontUrl(
        "https://michaeleskin.com/abctools/soundfonts/fatboy_4/"
      );

      ABCJS.eskinConfig.setReverb({
        enabled: true,
        style: "chamber1",
        dry: 0.9,
        wet: 0.1
      });

      ABCJS.eskinConfig.setIrishRolls(true);
      ABCJS.eskinConfig.setSwing(false, 0.25);
      ABCJS.eskinConfig.setCustomGMSounds(true);
      ABCJS.eskinConfig.setPlayerDefaults(100, false);
    }

    async function renderAndPrepare(abc) {
      const errorElement = document.getElementById("error");
      errorElement.textContent = "";

      try {
        if (controller && typeof controller.destroy === "function") {
          controller.destroy();
        }

        controller = null;
        document.getElementById("paper").replaceChildren();
        document.getElementById("audio-controls").replaceChildren();

        applySettings();

        const tunes = ABCJS.renderAbc("paper", abc, renderParams);

        if (!Array.isArray(tunes) || !tunes.length) {
          throw new Error("No tune was rendered.");
        }

        controller = new ABCJS.synth.SynthController();

        // Cursor tracking is optional. Pass null for the simplest setup.
        controller.load("#audio-controls", null, playerOptions);

        await controller.setTune(tunes[0], false, synthOptions);
      } catch (error) {
        console.error(error);
        errorElement.textContent =
          error && error.message ? error.message : String(error);
      }
    }

    renderAndPrepare(abcText);
  </script>
</body>
</html>
```

Replace the example soundfont URL with the actual URL containing your
instrument-note files.

### Optional working cursor tracking

Playback works without a cursor. To add note-following, replace `null` in
`controller.load()` with this object:

```js
const cursorControl = {
  cursor: null,

  onStart() {
    const svg = document.querySelector("#paper svg");
    if (!svg) return;

    this.cursor = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    this.cursor.setAttribute("stroke", "red");
    this.cursor.setAttribute("stroke-width", "2");
    svg.appendChild(this.cursor);
  },

  onEvent(event) {
    if (!this.cursor || !event || event.left == null) return;

    this.cursor.setAttribute("x1", event.left - 2);
    this.cursor.setAttribute("x2", event.left - 2);
    this.cursor.setAttribute("y1", event.top);
    this.cursor.setAttribute("y2", event.top + event.height);
  },

  onFinished() {
    if (!this.cursor) return;

    this.cursor.setAttribute("x1", 0);
    this.cursor.setAttribute("x2", 0);
    this.cursor.setAttribute("y1", 0);
    this.cursor.setAttribute("y2", 0);
  }
};
```

Then:

```js
controller.load("#audio-controls", cursorControl, playerOptions);
```

### Complete note-highlighting playback example

The following standalone Cooley's example highlights the currently sounding
notation in red instead of drawing a line cursor. The render option
`add_classes: true` is required so the callback can apply a CSS class to the
SVG notation elements supplied in `event.elements`.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cooley's — Playback Note Highlighting</title>
  <link rel="stylesheet" href="abcjs-eskin-audio.css">
  <style>
    :root { color-scheme: light; }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #ffffff;
      color: #222;
    }
    main {
      width: min(960px, calc(100% - 32px));
      margin: 32px auto;
    }
    h1 {
      margin: 0 0 8px;
      font-size: clamp(1.5rem, 4vw, 2.25rem);
    }
    p { margin: 0 0 20px; }
    
    body {
      max-width: 900px;
      margin: 30px auto;
      padding: 0 18px;
      font-family: Arial, sans-serif;
    }

    #paper {
      margin-bottom: 12px;
    }

    /* The callback adds this class to the SVG elements that are sounding. */
    .abcjs-playing-note {
      fill: #d62828 !important;
      stroke: #d62828 !important;
    }
  </style>
</head>
<body>
<main>
  <h1>Cooley's — Playback Note Highlighting</h1>
  <p>The currently sounding notes are highlighted in red.</p>
  <div id="paper"></div>
  <div id="audio"></div>
</main>

<script src="abcjs-eskin-chord-intervals.js"></script>
<script src="abcjs-eskin-portable-min.js"></script>
<script>
(function () {
  "use strict";

  const abc = String.raw`X: 1
T: Cooley's
C: Traditional
R: Reel
M: 4/4
L: 1/8
Q: 1/2=90
K: Edor
|:"Em"EBBA B2 EB|B2 AB dBAG|"D"F/E/D AD BDAD|F/E/D AD BAGF|
"Em"EBBA B2 EB|B2 AB defg|"D"afge dBAF|1 DEFD "Em"E3D:|2 DEFD "Em"E2gf||
|:"Em"eB (3BBB eBgf|eBB2 gedB|"D"A/A/A FA DAFA|A/A/A FA defg|
"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]`;

  const visualObj = ABCJS.renderAbc("paper", abc, {
    responsive: "resize",
    add_classes: true
  })[0];

  const highlighted = new Set();

  function clearHighlights() {
    highlighted.forEach(function (element) {
      if (element && element.classList) {
        element.classList.remove("abcjs-playing-note");
      }
    });
    highlighted.clear();
  }

  const cursorControl = {
    onStart: clearHighlights,

    onEvent: function (event) {
      clearHighlights();

      if (!event || !Array.isArray(event.elements)) return;

      event.elements.forEach(function (group) {
        const elements = Array.isArray(group) ? group : [group];

        elements.forEach(function (element) {
          if (!element || !element.classList) return;
          element.classList.add("abcjs-playing-note");
          highlighted.add(element);
        });
      });
    },

    onFinished: clearHighlights
  };

  const synthControl = new ABCJS.synth.SynthController(abc);

  synthControl.load("#audio", cursorControl, {
    displayLoop: true,
    displayRestart: true,
    displayPlay: true,
    displayProgress: true,
    displayWarp: true
  });

  synthControl.setTune(visualObj, false, {}).catch(function (error) {
    console.error("Unable to prepare playback:", error);
    document.getElementById("audio").textContent =
      "Audio could not be initialized in this browser.";
  });
})();
</script>
</body>
</html>
```

### Rebuilding after a change

Use one rebuild path for ABC changes and configuration changes:

```js
async function rebuild(abcText) {
  if (controller && typeof controller.destroy === "function") {
    controller.destroy();
  }

  controller = null;

  // Clear only the affected cache when required.
  // ABCJS.eskinConfig.clearNoteCache();
  // ABCJS.eskinConfig.clearReverbCache();

  applySettings();

  const tunes = ABCJS.renderAbc("paper", abcText, renderParams);

  controller = new ABCJS.synth.SynthController();
  controller.load("#audio-controls", null, playerOptions);

  await controller.setTune(tunes[0], false, synthOptions);
}
```

Use `clearNoteCache()` after changing the soundfont or instrument mapping. Use
`clearReverbCache()` after changing the reverb style.

### Single-tune playback

The normal integration prepares:

```js
tunes[0]
```

This is the first rendered tune. The demo's multi-tune examples are display
tests that intentionally disable playback; they are not the normal single-player
integration path.

## Basic rendering and playback

```html
<div id="paper"></div>
<div id="audio-controls"></div>
```

```js
const renderParams = {
  responsive: "resize",
  expandToWidest: "true",
  selectTypes: false
};

const tunes = ABCJS.renderAbc("paper", abcText, renderParams);

const controller = new ABCJS.synth.SynthController();

controller.load("#audio-controls", cursorControl, {
  displayLoop: true,
  displayRestart: true,
  displayPlay: true,
  displayProgress: true,
  displayWarp: true
});

await controller.setTune(tunes[0], false, {
  program: 0,
  chordsOff: false
});
```

The `program` passed to `setTune()` is a fallback. Any global or voice-specific
`%%MIDI program` directive in the ABC takes precedence.

## Rebuilding after configuration changes

Settings that affect parsing, rendering, sequencing, sample selection, timing,
or audio routing should be applied before rendering and preparing audio.

```js
if (controller && typeof controller.destroy === "function") {
  controller.destroy();
}
controller = null;

ABCJS.eskinConfig.setIrishRolls(true);
ABCJS.eskinConfig.setReverb({
  enabled: true,
  style: "chamber1",
  dry: 0.9,
  wet: 0.1
});

const tunes = ABCJS.renderAbc("paper", abcText, renderParams);

controller = new ABCJS.synth.SynthController();
controller.load("#audio-controls", cursorControl, playerOptions);

await controller.setTune(tunes[0], false, synthOptions);
```

## Tablature render parameters

### Mandolin notation and tablature

```js
const renderParams = {
  responsive: "resize",
  expandToWidest: "true",
  selectTypes: false,
  tablature: [{
    instrument: "violin",
    label: "Mandolin",
    tuning: ["G,", "D", "A", "e"],
    highestNote: "f'",
    capo: 0
  }]
};
```

### Mandolin tablature only

```js
renderParams.tablatureOnly = true;
```

### Guitar notation and tablature

```js
const renderParams = {
  responsive: "resize",
  expandToWidest: "true",
  selectTypes: false,
  tablature: [{
    instrument: "guitar",
    label: "Guitar",
    tuning: ["E,", "A,", "D", "G", "B", "e"],
    highestNote: "f'",
    capo: 0
  }]
};
```

## Complete `ABCJS.eskinConfig` reference

All setters return `undefined`. Getters return the current setting. Objects and
arrays returned by the facade are copied where required so callers cannot
accidentally mutate internal state.

### Version

#### `ABCJS.eskinConfig.version`

Read-only string identifying this portable facade.

```js
console.log(ABCJS.eskinConfig.version);
```

### Soundfont and sample loading

#### `setSoundFontUrl(url)` / `getSoundFontUrl()`

Sets or returns the base URL used for instrument-note files. Empty strings are
ignored.

```js
ABCJS.eskinConfig.setSoundFontUrl(
  "https://michaeleskin.com/abctools/soundfonts/fatboy_4/"
);
const url = ABCJS.eskinConfig.getSoundFontUrl();
```

#### Automatic per-tune `%soundfont` parsing

The portable library automatically recognizes a standalone directive inside an
individual tune:

```abc
%soundfont fatboy
```

or:

```abc
%soundfont arachno
```

Syntax:

```text
%soundfont <soundfont_name>
```

Supported names and sample URLs are:

| Name | Sample URL |
|---|---|
| `fluid` | `https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/` |
| `fatboy` | `https://michaeleskin.com/abctools/soundfonts/fatboy_4/` |
| `canvas` | `https://michaeleskin.com/abctools/soundfonts/canvas/` |
| `mscore` | `https://michaeleskin.com/abctools/soundfonts/mscore_2/` |
| `arachno` | `https://michaeleskin.com/abctools/soundfonts/arachno_3/` |
| `fluidhq` | `https://michaeleskin.com/abctools/soundfonts/fluidhq_1/` |

A valid directive overrides the host URL from
`ABCJS.eskinConfig.setSoundFontUrl()` for that tune. Without a valid directive,
the host soundfont remains the fallback.

The selected name and URL are stored with the rendered tune and snapshotted by
its synth. The decoded-note cache is separated by soundfont URL, so independent
players on the same page can safely use different soundfonts without reusing
note buffers from another soundfont.

After editing, adding, or removing `%soundfont`, rerender the tune and rebuild
its controller and audio. Invalid names are ignored.

#### `clearNoteCache()`

Clears decoded instrument notes held by the library.

```js
ABCJS.eskinConfig.clearNoteCache();
```

#### `setSampleAvailability(options)` / `getSampleAvailability()`

```js
ABCJS.eskinConfig.setSampleAvailability({
  online: true,
  allowOffline: false
});

const value = ABCJS.eskinConfig.getSampleAvailability();
// { online, allowOffline }
```

### Reverb

#### `setReverb(options)` / `getReverb()`

```js
ABCJS.eskinConfig.setReverb({
  enabled: true,
  style: "chamber1",
  dry: 0.9,
  wet: 0.1
});

const value = ABCJS.eskinConfig.getReverb();
// { enabled, style, dry, wet }
```

Supported reverb styles in this build are:

- `room1`, `room2`, `room3`
- `chamber1`, `chamber2`, `chamber3`
- `hall1`, `hall2`, `hall3`
- `church1`

#### Automatic per-tune `%reverb` parsing

The portable library automatically recognizes:

```abc
%reverb chamber 0.95 0.05
```

Syntax:

```text
%reverb <reverb_style> <dry_fraction> <wet_fraction>
```

A valid directive enables reverb for that tune and applies it during audio
preparation. The hosting application does not need to inspect the ABC or call
`setReverb()` for that tune.

Supported styles are:

- `room`, `room1`, `room2`, `room3`
- `chamber`, `chamber1`, `chamber2`, `chamber3`
- `hall`, `hall1`, `hall2`, `hall3`
- `church`, `church1`

Both fractions must be from `0` through `1`.

Precedence:

1. A valid `%reverb` directive in the tune.
2. `ABCJS.eskinConfig.setReverb()`.
3. Reverb disabled when neither source enables it.

The setting is stored per rendered tune and per synth instance. Independent
players can therefore use different reverb styles and dry/wet mixes without
changing one another.

After editing, adding, or removing `%reverb`, rerender the tune and rebuild its
controller and audio. Invalid styles or out-of-range fractions are ignored, and
the host reverb configuration remains the fallback.

#### `clearReverbCache()`

Clears decoded reverb impulse responses and the current reverb node reference.

```js
ABCJS.eskinConfig.clearReverbCache();
```

### Swing and voice tuning

#### `setSwing(enabled, factor)` / `getSwing()`

Controls the Eskin swing implementation.

```js
ABCJS.eskinConfig.setSwing(true, 0.25);
const value = ABCJS.eskinConfig.getSwing();
// { enabled, factor }
```

#### Automatic per-tune `%swing` parsing

The portable library automatically recognizes a standalone directive inside an
individual tune:

```abc
%swing 0.25
```

The hosting application does not need to scan the ABC or call
`setSwing(true, 0.25)` for that tune. The directive is stored with the rendered
tune and applied when that tune's synth is prepared.

Accepted values are from `-0.9` through `0.9`.

```abc
%swing 0
```

explicitly disables custom Eskin swing for that tune.

Precedence is:

1. A valid `%swing <factor>` directive in the tune.
2. The host setting from `ABCJS.eskinConfig.setSwing()`.
3. No custom swing.

A tune-level `%swing` directive also takes precedence over the separate
abcjs-compatible swing mode for that tune. Because the value is stored per
rendered tune and per synth instance, independent players on the same page can
use different swing values without changing one another.

The directive is applied during audio preparation, not dynamically each time
the Play button is pressed. After editing, adding, or removing `%swing`, rerender
the tune and rebuild its audio:

```js
const tunes = ABCJS.renderAbc("paper", abcText, renderParams);

controller = new ABCJS.synth.SynthController();
controller.load("#audio-controls", cursorControl, playerOptions);

await controller.setTune(tunes[0], false, synthOptions);
```

Invalid or out-of-range `%swing` values are ignored and the host configuration
remains the fallback.

#### Automatic per-tune `%swing_offset` parsing

The portable library automatically recognizes:

```abc
%swing_offset 2
```

Syntax:

```text
%swing_offset <offset_value>
```

The value is added to the pickup-derived offset used by the Eskin custom-swing
implementation. Integer and decimal values are accepted.

Precedence:

1. A valid `%swing_offset` directive in the tune.
2. `ABCJS.eskinConfig.setSwingOffset()`.
3. The library default.

The directive affects custom Eskin swing only. It does not change the separate
abcjs-compatible swing path. It is stored per rendered tune and per synth
instance, so independent players can use different offsets.

After editing, adding, or removing `%swing_offset`, rerender the tune and rebuild
its controller and audio. Invalid values are ignored and the host offset remains
the fallback.

#### `setSwingOffset(offset)` / `getSwingOffset()`

```js
ABCJS.eskinConfig.setSwingOffset(0);
const offset = ABCJS.eskinConfig.getSwingOffset();
```

#### `setABCJSSwing(enabled, factor)` / `getABCJSSwing()`

Controls the separate abcjs-compatible swing path.

```js
ABCJS.eskinConfig.setABCJSSwing(true, 50);
const value = ABCJS.eskinConfig.getABCJSSwing();
// { enabled, factor }
```

#### `setVoiceTuning(centsArray)` / `getVoiceTuning()`

Sets one cents offset per voice. Passing a non-array clears voice tuning.

```js
ABCJS.eskinConfig.setVoiceTuning([0, -5, 7]);
const tuning = ABCJS.eskinConfig.getVoiceTuning();
```

### Instrument mappings

#### `setCustomGMSounds(enabled)` / `getCustomGMSounds()`

Enables or disables the Eskin replacement mappings for supported GM programs.

```js
ABCJS.eskinConfig.setCustomGMSounds(true);
```

#### `setCustomGMSoundsOverride(options)` / `getCustomGMSoundsOverride()`

Controls the explicit override flag and override value.

```js
ABCJS.eskinConfig.setCustomGMSoundsOverride({
  enabled: true,
  value: false
});

const value = ABCJS.eskinConfig.getCustomGMSoundsOverride();
// { enabled, value }
```

#### Automatic per-tune `%use_custom_gm_sounds` parsing

The portable library automatically recognizes:

```abc
%use_custom_gm_sounds false
```

Syntax:

```text
%use_custom_gm_sounds <true|false>
```

Custom General MIDI replacement instruments are allowed by default. A value of
`false` disables the Eskin custom replacements for that tune, so its MIDI
programs use the corresponding standard instruments from the selected
soundfont. A value of `true` explicitly allows the custom replacements.

A valid tune directive takes precedence over the host custom-GM setting for that
tune. The value is stored with the rendered tune and snapshotted by its synth,
so independent players can use different settings. After editing, adding, or
removing the directive, rerender the tune and rebuild its controller and audio.
Values other than `true` or `false` are ignored.

#### `setBodhranPitch(pitch)` / `getBodhranPitch()`

```js
ABCJS.eskinConfig.setBodhranPitch("a");
```

#### `setBanjoStyle(style)` / `getBanjoStyle()`

```js
ABCJS.eskinConfig.setBanjoStyle("2");
```

#### Automatic per-tune `%banjo_style` parsing

The portable library automatically recognizes:

```abc
%banjo_style 3
```

Syntax:

```text
%banjo_style <banjo_style_number>
```

The numeric value selects the banjo replacement used for that tune when custom
General MIDI replacement instruments are allowed. A valid tune directive takes
precedence over the host value from `ABCJS.eskinConfig.setBanjoStyle()` and is
stored per rendered tune and synth instance. If custom GM sounds are disabled
for the tune, the banjo-style selection is not applied.

After editing, adding, or removing `%banjo_style`, rerender the tune and rebuild
its controller and audio. Invalid values are ignored and the host banjo style
remains the fallback.

### Player defaults and callbacks

#### `setPlayerDefaults(warp, repeat)` / `getPlayerDefaults()`

Sets defaults used by subsequently created playback controls.

```js
ABCJS.eskinConfig.setPlayerDefaults(100, false);
const value = ABCJS.eskinConfig.getPlayerDefaults();
// { warp, repeat }
```

#### `setPlaybackCallbacks(callbacks)` / `getPlaybackCallbacks()`

```js
ABCJS.eskinConfig.setPlaybackCallbacks({
  preStart(continuePlayback) {
    continuePlayback();
  },
  start() {},
  loop() {},
  sequence(noteMapTracks, callbackContext) {}
});
```

Callback behavior:

- `preStart(continuePlayback)` runs before playback and must call the supplied
  continuation function.
- `start()` runs when playback starts.
- `loop()` runs at a playback loop boundary.
- `sequence(noteMapTracks, callbackContext)` runs when sequence data is built.

Passing an empty object clears all four callbacks.

#### `setRenderProgressLogging(enabled)` / `getRenderProgressLogging()`

Controls Eskin render-progress messages in the browser console.

### Rhythm-pattern overrides

#### `setRhythmPatternOverrides(overrides)`

```js
ABCJS.eskinConfig.setRhythmPatternOverrides({
  "10/8": {
    pattern: [
      "boom", "boom2", "boom2", "boom2", "boom",
      "boom2", "boom2", "boom", "boom2", "boom2"
    ],
    threshold: 5
  }
});
```

#### `getRhythmPatternOverrides()`

Returns a copy of the current override object.

#### `clearRhythmPatternOverrides()`

Restores an empty override object.

### Grace notes

#### `setGraceNoteOptions(options)` / `getGraceNoteOptions()`

```js
ABCJS.eskinConfig.setGraceNoteOptions({
  duration: 0.045,
  tuneType: "",
  missingTempo: false
});

const value = ABCJS.eskinConfig.getGraceNoteOptions();
// { duration, tuneType, missingTempo }
```

### Irish rolls

#### `setIrishRolls(enabled)` / `getIrishRolls()`

When enabled, the ABC tilde decoration uses the Eskin Irish-roll
implementation.

```js
ABCJS.eskinConfig.setIrishRolls(true);
```

The demo enables this before every render, including ABC loaded from a file.

#### `setIrishRollOverrides(options)` / `getIrishRollOverrides()`

```js
ABCJS.eskinConfig.setIrishRollOverrides({
  forceEnable: false,
  forceDisable: false
});
```

`forceDisable` prevents custom Irish-roll handling even when the ordinary or
force-enable setting is active.

#### `setIrishRollOptions(options)` / `getIrishRollOptions()`

```js
ABCJS.eskinConfig.setIrishRollOptions({
  useOriginalSolution: false,
  quarter: {
    duration1: 0.95,
    duration2: 0.8,
    fraction1: 1.0,
    fraction2: 0.75,
    fraction3: 0.9,
    volume1: 1.0,
    volume2: 0.75,
    volume3: 1.0
  },
  dottedQuarter: {
    duration1: 1.45,
    duration2: 0.6,
    fraction1: 1.0,
    fraction2: 0.75,
    fraction3: 0.9,
    volume1: 1.0,
    volume2: 0.75,
    volume3: 1.0
  }
});
```

Partial option objects are allowed; unspecified values remain unchanged.

### Ornament and tremolo timing

#### `setOrnamentTiming(options)` / `getOrnamentTiming()`

```js
ABCJS.eskinConfig.setOrnamentTiming({
  divider: 32,
  offset: 2
});
```

#### `setTremoloDivider(divider)` / `getTremoloDivider()`

```js
ABCJS.eskinConfig.setTremoloDivider(8);
```

### Titles and Solfege source

#### `setLeftJustifyTitles(enabled)` / `getLeftJustifyTitles()`

Controls the global one-tune title-justification setting.

#### `setTitleReverser(enabled)` / `getTitleReverser()`

Controls title reversal.

#### `setSolfegeABC(abc)` / `getSolfegeABC()`

Sets or returns the ABC source used by the Solfege instrument path. Passing
`null` clears it.

### Tablature behavior

#### `setTabStaffSelection(selection)` / `getTabStaffSelection()`

Accepted values:

- `"all"`
- `"first"`
- `"second"`

```js
ABCJS.eskinConfig.setTabStaffSelection("first");
```

#### `setTablatureOnly(enabled)` / `getTablatureOnly()`

Controls the global tablature-only flag. For ordinary host rendering, the
per-render `tablatureOnly` option remains the clearest choice.

### Accompaniment timing and voicing

#### `setBackupNoteFractions(options)` / `getBackupNoteFractions()`

```js
ABCJS.eskinConfig.setBackupNoteFractions({
  boom: 0.5,
  chick: 0.5
});
```

#### `setStrummedChords(enabled, options)` / `getStrummedChords()`

```js
ABCJS.eskinConfig.setStrummedChords(true, {
  divider: 8
});
```

#### `setAccompanimentOctaveShifts(options)` / `getAccompanimentOctaveShifts()`

```js
ABCJS.eskinConfig.setAccompanimentOctaveShifts({
  bass: -1,
  chords: 1
});
```

#### `setUseGChord(enabled)` / `getUseGChord()`

Selects the alternate gchord playback path.

#### `setDurationExtension(value)` / `getDurationExtension()`

Sets the duration-extension value used by the extended-duration playback path.

### Chord interpretation

#### `setAllowLowercaseChords(enabled)` / `getAllowLowercaseChords()`

Controls whether lowercase chord names are accepted by the Eskin chord path.

#### `setPlayAlternateChords(enabled, override)` / `getPlayAlternateChords()`

```js
ABCJS.eskinConfig.setPlayAlternateChords(true, false);
```

Returns:

```js
{ enabled, override }
```

#### `setForcePowerChords(enabled)` / `getForcePowerChords()`

Forces power-chord handling.

### Rendering parameters and visibility

#### `setRenderingParams(params)` / `getRenderingParams()`

Stores or returns the Eskin global rendering-parameter object. Passing a
non-object clears it.

```js
ABCJS.eskinConfig.setRenderingParams({
  scale: 0.9,
  staffwidth: 700
});
```

#### `setInformationVisibility(options)` / `getInformationVisibility()`

```js
ABCJS.eskinConfig.setInformationVisibility({
  hideLabels: false,
  hideRhythm: false,
  hideComposer: false,
  hideParts: false,
  hideDynamics: false
});
```

Returns the same five properties.

#### `setHideCautionaryKeySignatures(enabled)` /
`getHideCautionaryKeySignatures()`

Controls cautionary key-signature suppression.

### Whistle and recorder tablature transposition

#### `setWhistleTabTranspose(options)` / `getWhistleTabTranspose()`

```js
ABCJS.eskinConfig.setWhistleTabTranspose({
  enabled: true,
  octave: 0,
  semitone: -2
});
```

#### `setRecorderTabTranspose(options)` / `getRecorderTabTranspose()`

```js
ABCJS.eskinConfig.setRecorderTabTranspose({
  enabled: true,
  octave: 0,
  semitone: 2
});
```

Both getters return:

```js
{ enabled, octave, semitone }
```

### SVG hyperlinks

#### `setSvgHyperlinks(options)` / `getSvgHyperlinks()`

```js
ABCJS.eskinConfig.setSvgHyperlinks({
  enabled: true,
  forceDisable: false
});
```

Returns:

```js
{ enabled, forceDisable }
```

### Loop-state caching

#### `setLoopStateCaching(enabled)` / `getLoopStateCaching()`

Controls whether playback loop state may be retained.

### Feature-state snapshot

#### `getFeatureState()`

Returns a snapshot of all feature-oriented settings exposed by the facade.

```js
const state = ABCJS.eskinConfig.getFeatureState();
console.log(state.irishRolls);
console.log(state.strummedChords);
console.log(state.informationVisibility);
```

This snapshot does not include note caches, reverb nodes, or playback objects.

## Demo smoke tests

The demo smoke-test suite:

- Checks that every facade method exists.
- Checks that `version` is present.
- Calls every clear/reset method.
- Round-trips every setter/getter pair.
- Restores the original setting after each round-trip.
- Exercises notation, tablature, multi-tune display, and invalid-ABC handling.

The tests are integration checks. Audible sound quality and browser audio output
still require listening tests.
