"use strict";

/**
 * Builds and manages the Instructions and Application Integration dialog.
 *
 * Keeping this large documentation block in its own module makes index.html
 * easier to read and lets developers reuse or replace the instructions UI
 * without touching the rendering and playback example code in demo.js.
 */
(function () {
  const INSTRUCTIONS_MARKUP = `    <section class="instructions-section">
      <button id="instructions-button" class="instructions-button" type="button">
        Demo Instructions and Integration Guide
      </button>
    </section>

    <dialog id="instructions-dialog" aria-labelledby="instructions-title">
      <div class="modal-header">
        <h2 id="instructions-title">abcjs-eskin-portable Demo Instructions and Integration Guide</h2>
        <button id="instructions-close-x" class="modal-close-x" type="button" aria-label="Close instructions">×</button>
      </div>
      <div class="modal-content">
        <h3>Using the demo</h3>
        <ol>
          <li>Select an example or load a local <code>.abc</code> or <code>.txt</code> file.</li>
          <li>Select the fallback instrument program.</li>
          <li>Adjust the visible reverb, swing, and hosted GM replacement controls.</li>
          <li>Changes regenerate notation and audio. The multi-tune display examples render each tune separately and deliberately disable playback.</li>
          <li>Use Diagnostics and the smoke tests to verify the integration.</li>
        </ol>

        <h3>Instrument program behavior</h3>
        <p>The Instrument program dropdown is passed to <code>setTune()</code> as a fallback. Global and voice-specific <code>%%MIDI program</code> directives in the ABC take precedence.</p>


        <h3>Quick start for an existing website</h3>
        <p>This is the shortest complete path to adding notation and playback to an existing page.</p>

        <h4>Required resources</h4>
        <ul>
          <li><code>abcjs-eskin-audio.css</code></li>
          <li><code>abcjs-eskin-chord-intervals.js</code></li>
          <li><code>abcjs-eskin-portable-min.js</code></li>
          <li>Instrument-note files under the configured soundfont URL</li>
          <li>Reverb impulse-response files when reverb is enabled</li>
        </ul>
        <p>Resources hosted on another origin must allow CORS access. Serve the page through HTTP or HTTPS rather than opening it with a <code>file:</code> URL.</p>

        <h4>Lifecycle</h4>
        <pre><code>Apply settings
→ renderAbc()
→ create SynthController
→ load()
→ await setTune()
→ user clicks Play</code></pre>
        <p><code>setTune()</code> prepares audio but does not start playback. The generated Play button supplies the user gesture browsers normally require.</p>

        <h4>Complete copy-and-paste example</h4>
        <pre><code>&lt;!doctype html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
  &lt;title&gt;ABC tune display and playback&lt;/title&gt;
  &lt;link rel="stylesheet" href="abcjs-eskin-audio.css"&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="paper"&gt;&lt;/div&gt;
  &lt;div id="audio-controls"&gt;&lt;/div&gt;
  &lt;p id="error" role="alert"&gt;&lt;/p&gt;

  &lt;script src="abcjs-eskin-chord-intervals.js"&gt;&lt;/script&gt;
  &lt;script src="abcjs-eskin-portable-min.js"&gt;&lt;/script&gt;

  &lt;script&gt;
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
      '|:"Em"EBBA B2 EB|B2 AB dBAG|\n' +
      '"D"F/E/D AD BDAD|F/E/D AD BAGF|';

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
        "https://example.com/soundfonts/fatboy_4/"
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
    }

    async function renderAndPrepare(abc) {
      const errorElement = document.getElementById("error");
      errorElement.textContent = "";

      try {
        if (controller &amp;&amp; typeof controller.destroy === "function") {
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

        controller.load("#audio-controls", null, playerOptions);

        await controller.setTune(
          tunes[0],
          false,
          synthOptions
        );
      } catch (error) {
        console.error(error);
        errorElement.textContent =
          error &amp;&amp; error.message
            ? error.message
            : String(error);
      }
    }

    renderAndPrepare(abcText);
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
        <p>Replace the example soundfont URL with the actual URL used by your site.</p>

        <h4>No-cursor option</h4>
        <p>Cursor tracking is optional. Pass <code>null</code> to <code>load()</code>:</p>
        <pre><code>controller.load("#audio-controls", null, playerOptions);</code></pre>

        <h4>Optional cursor tracking</h4>
        <pre><code>const cursorControl = {
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
};</code></pre>

        <h4>Rebuild after ABC or settings changes</h4>
        <pre><code>if (controller &amp;&amp; typeof controller.destroy === "function") {
  controller.destroy();
}
controller = null;

// Clear only the affected cache when necessary.
// ABCJS.eskinConfig.clearNoteCache();
// ABCJS.eskinConfig.clearReverbCache();

applySettings();

const tunes = ABCJS.renderAbc("paper", abcText, renderParams);

controller = new ABCJS.synth.SynthController();
controller.load("#audio-controls", null, playerOptions);

await controller.setTune(tunes[0], false, synthOptions);</code></pre>
        <p><code>tunes[0]</code> prepares the first rendered tune. The demo's multi-tune examples are display tests and intentionally disable playback.</p>

        <h3>Application integration</h3>
        <p>Load <code>abcjs-eskin-audio.css</code>, then <code>abcjs-eskin-chord-intervals.js</code>, then <code>abcjs-eskin-portable-min.js</code>, and finally your application script.</p>
        <pre><code>&lt;link rel="stylesheet" href="abcjs-eskin-audio.css"&gt;
&lt;script src="abcjs-eskin-chord-intervals.js"&gt;&lt;/script&gt;
&lt;script src="abcjs-eskin-portable-min.js"&gt;&lt;/script&gt;
&lt;script src="your-application.js"&gt;&lt;/script&gt;</code></pre>

        <h3>Minimal render and playback</h3>
        <pre><code>const renderParams = {
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
});</code></pre>
        <p>The <code>program</code> passed to <code>setTune()</code> is a fallback. Program directives in the ABC take precedence.</p>

        <h3>Rebuilding after setting changes</h3>
        <p>Destroy and recreate the controller after changing settings that affect parsing, rendering, sequencing, samples, timing, or audio routing.</p>

        <h3>Complete API reference</h3>
        <p>All methods below are present in <code>ABCJS.eskinConfig</code>. Setters return <code>undefined</code>; getters return the current setting.</p>

        <h4>Soundfont and samples</h4>
        <ul>
          <li><code>setSoundFontUrl(url)</code> / <code>getSoundFontUrl()</code></li>
          <li><code>clearNoteCache()</code></li>
          <li><code>setSampleAvailability({ online, allowOffline })</code> / <code>getSampleAvailability()</code></li>
        </ul>

        <h4>Automatic per-tune <code>%soundfont</code> parsing</h4>
        <p>The library recognizes directives such as <code>%soundfont fatboy</code> and <code>%soundfont arachno</code>, using the syntax <code>%soundfont &lt;soundfont_name&gt;</code>.</p>
        <table>
          <thead><tr><th>Name</th><th>Sample URL</th></tr></thead>
          <tbody>
            <tr><td><code>fluid</code></td><td><code>https://paulrosen.github.io/midi-js-soundfonts/FluidR3_GM/</code></td></tr>
            <tr><td><code>fatboy</code></td><td><code>https://michaeleskin.com/abctools/soundfonts/fatboy_4/</code></td></tr>
            <tr><td><code>canvas</code></td><td><code>https://michaeleskin.com/abctools/soundfonts/canvas/</code></td></tr>
            <tr><td><code>mscore</code></td><td><code>https://michaeleskin.com/abctools/soundfonts/mscore_2/</code></td></tr>
            <tr><td><code>arachno</code></td><td><code>https://michaeleskin.com/abctools/soundfonts/arachno_3/</code></td></tr>
            <tr><td><code>fluidhq</code></td><td><code>https://michaeleskin.com/abctools/soundfonts/fluidhq_1/</code></td></tr>
          </tbody>
        </table>
        <ul>
          <li>A valid directive overrides <code>setSoundFontUrl()</code> for that tune.</li>
          <li>Without a valid directive, the host soundfont remains the fallback.</li>
          <li>Independent players can safely use different soundfonts because decoded-note caches are separated by soundfont URL.</li>
        </ul>
        <p>After editing, adding, or removing <code>%soundfont</code>, rerender the tune and rebuild its controller and audio. Invalid names are ignored.</p>

        <h4>Reverb</h4>
        <ul>
          <li><code>setReverb({ enabled, style, dry, wet })</code> / <code>getReverb()</code></li>
          <li><code>clearReverbCache()</code></li>
        </ul>
        <p>Styles: <code>room1</code>–<code>room3</code>, <code>chamber1</code>–<code>chamber3</code>, <code>hall1</code>–<code>hall3</code>, and <code>church1</code>.</p>

        <h4>Automatic per-tune <code>%reverb</code> parsing</h4>
        <p>The library recognizes <code>%reverb chamber 0.95 0.05</code>, using the syntax <code>%reverb &lt;reverb_style&gt; &lt;dry_fraction&gt; &lt;wet_fraction&gt;</code>.</p>
        <ul>
          <li>A valid directive enables reverb for that tune during audio preparation.</li>
          <li>Supported styles are <code>room</code>, <code>room1</code>–<code>room3</code>, <code>chamber</code>, <code>chamber1</code>–<code>chamber3</code>, <code>hall</code>, <code>hall1</code>–<code>hall3</code>, <code>church</code>, and <code>church1</code>.</li>
          <li>Dry and wet fractions must each be from <code>0</code> through <code>1</code>.</li>
          <li>The tune directive overrides <code>setReverb()</code> for that tune.</li>
          <li>Without a valid directive, host reverb settings remain the fallback.</li>
          <li>Independent players can use different reverb settings.</li>
        </ul>
        <p>Rerender and rebuild audio after editing the directive. Invalid styles or fractions are ignored.</p>

        <h4>Automatic per-tune <code>%swing_offset</code> parsing</h4>
        <p>The library recognizes <code>%swing_offset 2</code>, using the syntax <code>%swing_offset &lt;offset_value&gt;</code>.</p>
        <ul>
          <li>Integer and decimal offsets are accepted.</li>
          <li>The tune directive overrides <code>setSwingOffset()</code>.</li>
          <li>Without a valid directive, the host offset remains the fallback.</li>
          <li>The value affects custom Eskin swing only.</li>
          <li>Independent players can use different offsets.</li>
        </ul>
        <p>Rerender and rebuild audio after editing the directive. Invalid values are ignored.</p>

        <h4>Swing and tuning</h4>
        <ul>
          <li><code>setSwing(enabled, factor)</code> / <code>getSwing()</code></li>
          <li><code>setSwingOffset(offset)</code> / <code>getSwingOffset()</code></li>
          <li><code>setABCJSSwing(enabled, factor)</code> / <code>getABCJSSwing()</code></li>
          <li><code>setVoiceTuning(centsArray)</code> / <code>getVoiceTuning()</code></li>
        </ul>

        <h4>Automatic per-tune <code>%swing</code> parsing</h4>
        <p>The portable library automatically recognizes a standalone directive such as:</p>
        <pre><code>%swing 0.25</code></pre>
        <p>The host application does not need to inspect the ABC or call <code>setSwing(true, 0.25)</code> for that tune. The value is stored with the rendered tune and applied when its synth is prepared.</p>
        <ul>
          <li>Accepted values are <code>-0.9</code> through <code>0.9</code>.</li>
          <li><code>%swing 0</code> explicitly disables custom Eskin swing for that tune.</li>
          <li>A valid tune directive overrides <code>ABCJS.eskinConfig.setSwing()</code>.</li>
          <li>A valid tune directive also overrides the separate abcjs-compatible swing mode for that tune.</li>
          <li>Without a valid directive, the host swing setting remains the fallback.</li>
          <li>Different independent tune players can use different values without changing one another.</li>
        </ul>
        <p>The directive is applied while audio is prepared. After editing, adding, or removing <code>%swing</code>, rerender the tune and rebuild its controller and audio. Invalid or out-of-range values are ignored.</p>

        <h4>Instrument mappings</h4>
        <ul>
          <li><code>setCustomGMSounds(enabled)</code> / <code>getCustomGMSounds()</code></li>
          <li><code>setCustomGMSoundsOverride({ enabled, value })</code> / <code>getCustomGMSoundsOverride()</code></li>
          <li><code>setBodhranPitch(pitch)</code> / <code>getBodhranPitch()</code></li>
          <li><code>setBanjoStyle(style)</code> / <code>getBanjoStyle()</code></li>
        </ul>

        <h4>Automatic per-tune <code>%use_custom_gm_sounds</code> parsing</h4>
        <pre><code>%use_custom_gm_sounds false</code></pre>
        <p>Syntax: <code>%use_custom_gm_sounds &lt;true|false&gt;</code>.</p>
        <ul>
          <li>Custom General MIDI replacement instruments are allowed by default.</li>
          <li><code>false</code> disables the Eskin custom replacements for that tune, causing MIDI programs to use the corresponding standard instruments from the selected soundfont.</li>
          <li><code>true</code> explicitly allows the custom replacements.</li>
          <li>A valid tune directive takes precedence over the host custom-GM setting and is isolated per rendered tune and synth instance.</li>
          <li>Values other than <code>true</code> or <code>false</code> are ignored.</li>
        </ul>
        <p>After editing, adding, or removing the directive, rerender the tune and rebuild its controller and audio.</p>

        <h4>Automatic per-tune <code>%banjo_style</code> parsing</h4>
        <pre><code>%banjo_style 3</code></pre>
        <p>Syntax: <code>%banjo_style &lt;banjo_style_number&gt;</code>.</p>
        <ul>
          <li>The numeric value selects the banjo replacement used for that tune when custom General MIDI replacements are allowed.</li>
          <li>A valid tune directive takes precedence over <code>setBanjoStyle()</code> and is isolated per rendered tune and synth instance.</li>
          <li>If custom GM sounds are disabled for the tune, the banjo-style selection is not applied.</li>
          <li>Invalid values are ignored and the host banjo style remains the fallback.</li>
        </ul>
        <p>After editing, adding, or removing the directive, rerender the tune and rebuild its controller and audio.</p>

        <h4>Player defaults and callbacks</h4>
        <ul>
          <li><code>setPlayerDefaults(warp, repeat)</code> / <code>getPlayerDefaults()</code></li>
          <li><code>setPlaybackCallbacks({ preStart, start, loop, sequence })</code> / <code>getPlaybackCallbacks()</code></li>
          <li><code>setRenderProgressLogging(enabled)</code> / <code>getRenderProgressLogging()</code></li>
        </ul>
        <p><code>preStart(continuePlayback)</code> must call its continuation function.</p>

        <h4>Rhythm and grace notes</h4>
        <ul>
          <li><code>setRhythmPatternOverrides(overrides)</code></li>
          <li><code>getRhythmPatternOverrides()</code></li>
          <li><code>clearRhythmPatternOverrides()</code></li>
          <li><code>setGraceNoteOptions({ duration, tuneType, missingTempo })</code> / <code>getGraceNoteOptions()</code></li>
        </ul>

        <h4>Irish rolls</h4>
        <ul>
          <li><code>setIrishRolls(enabled)</code> / <code>getIrishRolls()</code></li>
          <li><code>setIrishRollOverrides({ forceEnable, forceDisable })</code> / <code>getIrishRollOverrides()</code></li>
          <li><code>setIrishRollOptions(options)</code> / <code>getIrishRollOptions()</code></li>
        </ul>
        <pre><code>ABCJS.eskinConfig.setIrishRolls(true);

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
});</code></pre>
        <p>The demo enables Irish rolls before every render.</p>

        <h4>Ornaments and tremolo</h4>
        <ul>
          <li><code>setOrnamentTiming({ divider, offset })</code> / <code>getOrnamentTiming()</code></li>
          <li><code>setTremoloDivider(divider)</code> / <code>getTremoloDivider()</code></li>
        </ul>

        <h4>Titles and Solfege</h4>
        <ul>
          <li><code>setLeftJustifyTitles(enabled)</code> / <code>getLeftJustifyTitles()</code></li>
          <li><code>setTitleReverser(enabled)</code> / <code>getTitleReverser()</code></li>
          <li><code>setSolfegeABC(abc)</code> / <code>getSolfegeABC()</code></li>
        </ul>

        <h4>Tablature</h4>
        <ul>
          <li><code>setTabStaffSelection("all" | "first" | "second")</code> / <code>getTabStaffSelection()</code></li>
          <li><code>setTablatureOnly(enabled)</code> / <code>getTablatureOnly()</code></li>
        </ul>
        <p>Tablature plugin selection is supplied to <code>renderAbc()</code> through its <code>tablature</code> option.</p>

        <h4>Accompaniment</h4>
        <ul>
          <li><code>setBackupNoteFractions({ boom, chick })</code> / <code>getBackupNoteFractions()</code></li>
          <li><code>setStrummedChords(enabled, { divider })</code> / <code>getStrummedChords()</code></li>
          <li><code>setAccompanimentOctaveShifts({ bass, chords })</code> / <code>getAccompanimentOctaveShifts()</code></li>
          <li><code>setUseGChord(enabled)</code> / <code>getUseGChord()</code></li>
          <li><code>setDurationExtension(value)</code> / <code>getDurationExtension()</code></li>
        </ul>

        <h4>Chord interpretation</h4>
        <ul>
          <li><code>setAllowLowercaseChords(enabled)</code> / <code>getAllowLowercaseChords()</code></li>
          <li><code>setPlayAlternateChords(enabled, override)</code> / <code>getPlayAlternateChords()</code></li>
          <li><code>setForcePowerChords(enabled)</code> / <code>getForcePowerChords()</code></li>
        </ul>

        <h4>Rendering and visibility</h4>
        <ul>
          <li><code>setRenderingParams(params)</code> / <code>getRenderingParams()</code></li>
          <li><code>setInformationVisibility({ hideLabels, hideRhythm, hideComposer, hideParts, hideDynamics })</code> / <code>getInformationVisibility()</code></li>
          <li><code>setHideCautionaryKeySignatures(enabled)</code> / <code>getHideCautionaryKeySignatures()</code></li>
        </ul>

        <h4>Whistle and recorder tablature transposition</h4>
        <ul>
          <li><code>setWhistleTabTranspose({ enabled, octave, semitone })</code> / <code>getWhistleTabTranspose()</code></li>
          <li><code>setRecorderTabTranspose({ enabled, octave, semitone })</code> / <code>getRecorderTabTranspose()</code></li>
        </ul>

        <h4>SVG hyperlinks and loop state</h4>
        <ul>
          <li><code>setSvgHyperlinks({ enabled, forceDisable })</code> / <code>getSvgHyperlinks()</code></li>
          <li><code>setLoopStateCaching(enabled)</code> / <code>getLoopStateCaching()</code></li>
        </ul>

        <h4>Complete feature snapshot</h4>
        <p><code>getFeatureState()</code> returns the current feature-oriented configuration as one object.</p>

        <h3>Smoke tests</h3>
        <p>The demo verifies every API method, calls every clear method, round-trips each setter/getter pair, restores the original values, and also tests notation, tablature, multi-tune display, and invalid-ABC handling.</p>

      </div>
    </dialog>`;

  /**
   * Returns an element by ID.
   *
   * @param {string} id Element ID to locate.
   * @returns {HTMLElement|null} The matching element, or null when absent.
   */
  function byId(id) {
    return document.getElementById(id);
  }

  /**
   * Opens the native dialog, with a basic open-attribute fallback for browsers
   * that do not implement HTMLDialogElement.showModal().
   */
  function openInstructions() {
    const dialog = byId("instructions-dialog");
    if (!dialog) return;

    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    // Start each visit at the beginning of the documentation.
    const content = dialog.querySelector(".modal-content");
    if (content) content.scrollTop = 0;
  }

  /**
   * Closes the instructions dialog using the native API when available.
   */
  function closeInstructions() {
    const dialog = byId("instructions-dialog");
    if (!dialog) return;

    if (typeof dialog.close === "function") {
      if (dialog.open) dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  /**
   * Handles clicks on the dialog backdrop. Clicks inside the dialog content
   * are ignored; clicking the dialog element outside its inner panel closes it.
   *
   * @param {MouseEvent} event Dialog click event.
   */
  function handleDialogBackdropClick(event) {
    if (event.target === byId("instructions-dialog")) {
      closeInstructions();
    }
  }

  /**
   * Handles the Escape-key cancel event and closes the dialog consistently.
   *
   * @param {Event} event Native dialog cancel event.
   */
  function handleDialogCancel(event) {
    event.preventDefault();
    closeInstructions();
  }

  /**
   * Injects the button and dialog markup, then connects all modal controls.
   * This is the only function that mutates the instructions mount point.
   */
  function initializeInstructions() {
    const mount = byId("instructions-mount");
    if (!mount) return;

    mount.innerHTML = INSTRUCTIONS_MARKUP;

    byId("instructions-button")?.addEventListener("click", openInstructions);
    byId("instructions-close-x")?.addEventListener("click", closeInstructions);

    const dialog = byId("instructions-dialog");
    dialog?.addEventListener("click", handleDialogBackdropClick);
    dialog?.addEventListener("cancel", handleDialogCancel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeInstructions);
  } else {
    initializeInstructions();
  }
})();
