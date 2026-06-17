"use strict";

(function () {
  const examples = {
    basic: `X: 1
T: Cooley's — Basic reel with chords
C: Traditional
R: Reel
M: 4/4
L: 1/8
Q: 1/2=90
K: Edor
|:"Em"EBBA B2 EB|B2 AB dBAG|"D"F/E/D AD BDAD|F/E/D AD BAGF|
"Em"EBBA B2 EB|B2 AB defg|"D"afge dBAF|1 DEFD "Em"E3D:|2 DEFD "Em"E2gf||
|:"Em"eB (3BBB eBgf|eBB2 gedB|"D"A/A/A FA DAFA|A/A/A FA defg|
"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]`,
    reverb: `X: 1
T: Cooley's — Reverb enabled
C: Traditional
R: Reel
M: 4/4
L: 1/8
Q: 1/2=90
K: Edor
|:"Em"EBBA B2 EB|B2 AB dBAG|"D"F/E/D AD BDAD|F/E/D AD BAGF|
"Em"EBBA B2 EB|B2 AB defg|"D"afge dBAF|1 DEFD "Em"E3D:|2 DEFD "Em"E2gf||
|:"Em"eB (3BBB eBgf|eBB2 gedB|"D"A/A/A FA DAFA|A/A/A FA defg|
"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]`,
    swing: `X: 1
T: Cooley's — Hornpipe swing
C: Traditional
R: Reel
M: 4/4
L: 1/8
Q: 1/2=90
K: Edor
|:"Em"EBBA B2 EB|B2 AB dBAG|"D"F/E/D AD BDAD|F/E/D AD BAGF|
"Em"EBBA B2 EB|B2 AB defg|"D"afge dBAF|1 DEFD "Em"E3D:|2 DEFD "Em"E2gf||
|:"Em"eB (3BBB eBgf|eBB2 gedB|"D"A/A/A FA DAFA|A/A/A FA defg|
"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]`,
    tablature: `X: 1
T: Cooley's — Guitar notation and tablature
C: Traditional
R: Reel
M: 4/4
L: 1/8
Q: 1/2=90
K: Edor
%%staffsep 60
|:"Em"EBBA B2 EB|B2 AB dBAG|"D"F/E/D AD BDAD|F/E/D AD BAGF|
"Em"EBBA B2 EB|B2 AB defg|"D"afge dBAF|1 DEFD "Em"E3D:|2 DEFD "Em"E2gf||
|:"Em"eB (3BBB eBgf|eBB2 gedB|"D"A/A/A FA DAFA|A/A/A FA defg|
"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]`,
    mandolinTablature: `X: 1
T: Cooley's — Mandolin tablature only
C: Traditional
R: Reel
M: 4/4
L: 1/8
Q: 1/2=90
K: Edor
%%staffsep 80
|:"Em"EBBA B2 EB|B2 AB dBAG|"D"F/E/D AD BDAD|F/E/D AD BAGF|
"Em"EBBA B2 EB|B2 AB defg|"D"afge dBAF|1 DEFD "Em"E3D:|2 DEFD "Em"E2gf||
|:"Em"eB (3BBB eBgf|eBB2 gedB|"D"A/A/A FA DAFA|A/A/A FA defg|
"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]`,
    mandolinStandard: `X: 1
T: Cooley's — Mandolin notation and tablature
C: Traditional
R: Reel
M: 4/4
L: 1/8
Q: 1/2=90
K: Edor
%%staffsep 60
|:"Em"EBBA B2 EB|B2 AB dBAG|"D"F/E/D AD BDAD|F/E/D AD BAGF|
"Em"EBBA B2 EB|B2 AB defg|"D"afge dBAF|1 DEFD "Em"E3D:|2 DEFD "Em"E2gf||
|:"Em"eB (3BBB eBgf|eBB2 gedB|"D"A/A/A FA DAFA|A/A/A FA defg|
"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]`,
    tablatureOnly: `X: 1
T: Cooley's — Guitar tablature only
C: Traditional
R: Reel
M: 4/4
L: 1/8
Q: 1/2=90
K: Edor
%%staffsep 100
|:"Em"EBBA B2 EB|B2 AB dBAG|"D"F/E/D AD BDAD|F/E/D AD BAGF|
"Em"EBBA B2 EB|B2 AB defg|"D"afge dBAF|1 DEFD "Em"E3D:|2 DEFD "Em"E2gf||
|:"Em"eB (3BBB eBgf|eBB2 gedB|"D"A/A/A FA DAFA|A/A/A FA defg|
"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]`,
    multiTuneMandolinStandard: `X: 1
T: Cooley's
C: Traditional
R: Reel
M: 4/4
L: 1/8
Q: 1/2=90
K: Edor
%%staffsep 60
|:"Em"EBBA B2 EB|B2 AB dBAG|"D"F/E/D AD BDAD|F/E/D AD BAGF|
"Em"EBBA B2 EB|B2 AB defg|"D"afge dBAF|1 DEFD "Em"E3D:|2 DEFD "Em"E2gf||
|:"Em"eB (3BBB eBgf|eBB2 gedB|"D"A/A/A FA DAFA|A/A/A FA defg|
"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]

X: 1
T: The Kesh
C: Traditional
R: Jig
M: 6/8
L: 1/8
Q: 3/8=120
K: Gmaj
%%staffsep 60
|:"G"GAG GAB|"D"ABA ABd|"G"edd gdd|"C"edB "D"dBA|
"G"GAG GAB|"D"ABA ABd|"G"edd gdB|"D"AGF "G"G3:|
|:"G"BAB dBd|"C"ege "D"dBA|"G"BAB dBG|"D"ABA AGA|
"G"BAB dBd|"C"ege "G"dBd|"C"gfg "D"aga|"G"bgf g3:|

X: 1
T: Alexander's
C: Traditional
R: Hornpipe
M: 4/4
L: 1/8
Q: 1/2=80
K: Dmaj
%%staffsep 60
|:(3gfe|"D"dAFA DFAd|fdcd Adef|"G"g2 ge "D"fdcd|"A"(3efe (3dcB A2 (3gfe|
"D"dAFA DFAd|fdcd Adef|"G"g2 ge "D"fdcd|"A"(3efe dc"D"d2:|
|:AG|"D"FAdA FAdA|"G"GBdB GBdB|"A"Acec Acec|"D"dfaf "A"(3gfe (3dAG|
"D"FAdA FAdA|"G"GBdB GBdB|"A"Acef gecd|(3efe dc"D"d2:|`,
    multiTuneMandolinOnly: `X: 1
T: Cooley's
C: Traditional
R: Reel
M: 4/4
L: 1/8
Q: 1/2=90
K: Edor
%%staffsep 80
|:"Em"EBBA B2 EB|B2 AB dBAG|"D"F/E/D AD BDAD|F/E/D AD BAGF|
"Em"EBBA B2 EB|B2 AB defg|"D"afge dBAF|1 DEFD "Em"E3D:|2 DEFD "Em"E2gf||
|:"Em"eB (3BBB eBgf|eBB2 gedB|"D"A/A/A FA DAFA|A/A/A FA defg|
"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]

X: 1
T: The Kesh
C: Traditional
R: Jig
M: 6/8
L: 1/8
Q: 3/8=120
K: Gmaj
%%staffsep 80
|:"G"GAG GAB|"D"ABA ABd|"G"edd gdd|"C"edB "D"dBA|
"G"GAG GAB|"D"ABA ABd|"G"edd gdB|"D"AGF "G"G3:|
|:"G"BAB dBd|"C"ege "D"dBA|"G"BAB dBG|"D"ABA AGA|
"G"BAB dBd|"C"ege "G"dBd|"C"gfg "D"aga|"G"bgf g3:|

X: 1
T: Alexander's
C: Traditional
R: Hornpipe
M: 4/4
L: 1/8
Q: 1/2=80
K: Dmaj
%%staffsep 80
|:(3gfe|"D"dAFA DFAd|fdcd Adef|"G"g2 ge "D"fdcd|"A"(3efe (3dcB A2 (3gfe|
"D"dAFA DFAd|fdcd Adef|"G"g2 ge "D"fdcd|"A"(3efe dc"D"d2:|
|:AG|"D"FAdA FAdA|"G"GBdB GBdB|"A"Acec Acec|"D"dfaf "A"(3gfe (3dAG|
"D"FAdA FAdA|"G"GBdB GBdB|"A"Acef gecd|(3efe dc"D"d2:|`,
    multiTune: `X: 1
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
"Em"eB (3BBB eBgf|eBBB defg|"D"afge dBAF|1 DEFD "Em"E2gf:|2 DEFD "Em"E4|]

X: 1
T: The Kesh
C: Traditional
R: Jig
M: 6/8
L: 1/8
Q: 3/8=120
K: Gmaj
|:"G"GAG GAB|"D"ABA ABd|"G"edd gdd|"C"edB "D"dBA|
"G"GAG GAB|"D"ABA ABd|"G"edd gdB|"D"AGF "G"G3:|
|:"G"BAB dBd|"C"ege "D"dBA|"G"BAB dBG|"D"ABA AGA|
"G"BAB dBd|"C"ege "G"dBd|"C"gfg "D"aga|"G"bgf g3:|

X: 1
T: Alexander's
C: Traditional
R: Hornpipe
M: 4/4
L: 1/8
Q: 1/2=80
K: Dmaj
|:(3gfe|"D"dAFA DFAd|fdcd Adef|"G"g2 ge "D"fdcd|"A"(3efe (3dcB A2 (3gfe|
"D"dAFA DFAd|fdcd Adef|"G"g2 ge "D"fdcd|"A"(3efe dc"D"d2:|
|:AG|"D"FAdA FAdA|"G"GBdB GBdB|"A"Acec Acec|"D"dfaf "A"(3gfe (3dAG|
"D"FAdA FAdA|"G"GBdB GBdB|"A"Acef gecd|(3efe dc"D"d2:|`
  };

  /**
   * Convenience DOM lookup used throughout the demo.
   *
   * @param {string} id Element ID.
   * @returns {HTMLElement|null}
   */
  const $ = (id) => document.getElementById(id);
  const state = {
    visualObj: null,
    synthControl: null,
    renderedAbc: "",
    busy: false,
    tests: [],
    extensionRebuildTimer: null,
    extensionRebuildPending: false,
    initialized: false
  };

/**
   * Creates the timestamp prefix used on every diagnostics line.
   *
   * @returns {string} Local time in 24-hour format.
   */
  function timestamp() {
    return new Date().toLocaleTimeString([], { hour12: false });
  }

/**
   * Writes a message to both the on-page diagnostics panel and the browser
   * console, then scrolls the diagnostics panel to the newest entry.
   *
   * @param {string} message Text to record.
   * @param {string} [level="INFO"] INFO, WARN, ERROR, EVENT, or TEST.
   */
  function log(message, level = "INFO") {
    const line = `[${timestamp()}] ${level.padEnd(5)} ${message}`;
    $("log").textContent += line + "\n";
    $("log").scrollTop = $("log").scrollHeight;
    console[level === "ERROR" ? "error" : level === "WARN" ? "warn" : "log"](line);
  }

/**
   * Copies the complete diagnostics log to the clipboard. It uses the modern
   * Clipboard API when available and falls back to a temporary textarea.
   *
   * @returns {Promise<void>}
   */
  async function copyDiagnostics() {
    const text = $("log").textContent;
    if (!text) {
      log("Diagnostics are empty; nothing to copy.", "WARN");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand("copy");
        helper.remove();
        if (!copied) throw new Error("Browser copy command returned false.");
      }

      const button = $("copy-log");
      const original = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = original;
      }, 1200);
    } catch (error) {
      reportError("Copying diagnostics failed", error);
    }
  }


/**
   * Debounces changes made to portable-extension controls. Once the user stops
   * changing a control, the existing synth is destroyed and rebuilt.
   *
   * @param {string} sourceId ID of the control that requested the rebuild.
   */
  function scheduleExtensionRebuild(sourceId) {
    if (!state.initialized) return;

    clearTimeout(state.extensionRebuildTimer);
    state.extensionRebuildTimer = setTimeout(async () => {
      if (state.busy) {
        state.extensionRebuildPending = true;
        return;
      }

      state.extensionRebuildPending = false;
      log(`Portable extension changed (${sourceId}); rebuilding audio.`);
      await renderAndPrepare({ silent: true });
      log("Portable extension rebuild complete.");
    }, 300);
  }

/**
   * Connects every portable-extension control to the debounced rebuild path.
   * Range and text controls use input events; other controls use change events.
   */
  function bindAutomaticExtensionRebuild() {
    const ids = [
      "reverb-enabled",
      "reverb-style",
      "reverb-dry",
      "reverb-wet",
      "swing-enabled",
      "swing-factor",
      "custom-gm"
    ];

    // Attach the correct live-update event to each extension control.
    ids.forEach((id) => {
      const element = $(id);
      const eventName =
        element.type === "range" || element.type === "text" ? "input" : "change";
      element.addEventListener(eventName, () => scheduleExtensionRebuild(id));
    });
  }

/**
   * Updates the shared busy flag and disables actions that must not overlap a
   * render or smoke-test operation.
   *
   * @param {boolean} busy Whether a long-running operation is active.
   */
  function setBusy(busy) {
    state.busy = busy;
    $("load-abc-file").disabled = busy;
    $("render-button").disabled = busy;
    $("run-tests").disabled = busy;
  }

/**
   * Converts an Error or arbitrary thrown value into a useful diagnostics line.
   *
   * @param {string} context Description of the operation that failed.
   * @param {*} error Error object or thrown value.
   */
  function reportError(context, error) {
    const detail = error && (error.stack || error.message) ? (error.stack || error.message) : String(error);
    log(`${context}: ${detail}`, "ERROR");
  }

/**
   * Splits a multi-tune ABC string at tune-starting X: fields. This deliberately
   * avoids ABCJS.TuneBook and returns independent single-tune strings.
   *
   * @param {string} abcText ABC containing one or more tunes.
   * @returns {string[]} Individual trimmed tune strings.
   */
  function splitAbcIntoSingleTunes(abcText) {
    const normalized = String(abcText || "").replace(/\r\n?/g, "\n");
    const starts = [];
    const matcher = /^X\s*:/gm;
    let match;

    while ((match = matcher.exec(normalized)) !== null) {
      starts.push(match.index);
    }

    if (!starts.length) return [];
    starts.push(normalized.length);

    return starts.slice(0, -1)
      .map((start, index) => normalized.slice(start, starts[index + 1]).trim())
      .filter(Boolean);
  }

/**
   * Reports whether an example uses the special independent multi-tune render
   * path where playback is disabled.
   *
   * @param {string} [exampleKey] Example selector value.
   * @returns {boolean}
   */
  function isMultiTuneExample(exampleKey = $("example-select").value) {
    return [
      "multiTune",
      "multiTuneMandolinStandard",
      "multiTuneMandolinOnly"
    ].includes(exampleKey);
  }

/**
   * Builds the abcjs render options for an example. It adds the appropriate
   * mandolin or guitar tablature plugin and enables tablature-only mode for the
   * standalone tablature examples.
   *
   * @param {string} exampleKey Example selector value.
   * @returns {Object} Options passed to ABCJS.renderAbc().
   */
  function getExampleRenderParameters(exampleKey) {
    const params = {
      responsive: "resize",
      expandToWidest: "true",
      selectTypes: false,
      add_classes: true
    };

    if (
      exampleKey === "mandolinStandard" ||
      exampleKey === "mandolinTablature" ||
      exampleKey === "multiTuneMandolinStandard" ||
      exampleKey === "multiTuneMandolinOnly"
    ) {
      params.tablature = [{
        instrument: "violin",
        label: "Mandolin",
        tuning: ["G,", "D", "A", "e"],
        highestNote: "f'",
        capo: 0
      }];
    } else if (exampleKey === "tablature" || exampleKey === "tablatureOnly") {
      params.tablature = [{
        instrument: "guitar",
        label: "Guitar",
        tuning: ["E,", "A,", "D", "G", "B", "e"],
        highestNote: "f'",
        capo: 0
      }];
    }

    if (
      exampleKey === "mandolinTablature" ||
      exampleKey === "tablatureOnly" ||
      exampleKey === "multiTuneMandolinOnly"
    ) {
      params.tablatureOnly = true;
    }

    return params;
  }

/**
   * Adds a small amount of vertical room to generated SVGs so the lowest
   * tablature lines or barlines are not clipped in ordinary single-tune mode.
   *
   * @param {HTMLElement} container Element containing rendered SVGs.
   * @param {number} [extraPixels=24] Additional SVG units/pixels to reserve.
   */
  function addRenderedSvgBottomAllowance(container, extraPixels = 24) {
    container.querySelectorAll("svg").forEach((svg) => {
      const viewBox = svg.getAttribute("viewBox");
      if (viewBox) {
        const parts = viewBox.trim().split(/[ ,]+/).map(Number);
        if (parts.length === 4 && parts.every(Number.isFinite)) {
          parts[3] += extraPixels;
          svg.setAttribute("viewBox", parts.join(" "));
        }
      }

      const height = parseFloat(svg.getAttribute("height"));
      if (Number.isFinite(height)) {
        svg.setAttribute("height", String(height + extraPixels));
      }

      svg.style.overflow = "visible";
      svg.style.display = "block";
    });
  }

/**
   * Returns a promise that resolves on the browser's next animation frame.
   * Useful when measurements must wait for layout to finish.
   *
   * @returns {Promise<DOMHighResTimeStamp>}
   */
  function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(resolve));
  }

/**
   * Measures painted SVG elements in multi-tune mode and adjusts responsive
   * wrapper sizing to reduce unused vertical space. This helper is isolated
   * from the normal single-tune playback path.
   *
   * @param {HTMLElement} container Multi-tune rendering container.
   * @param {number} [bottomPadding=18] Visible padding below painted content.
   * @returns {Promise<void>}
   */
  async function fitMultiTuneSvgsToContent(container, bottomPadding = 18) {
    // Responsive abcjs rendering uses an absolutely positioned SVG inside an
    // .abcjs-container whose padding-bottom reserves the aspect-ratio height.
    // Both the SVG viewBox and that wrapper padding must be updated together.
    await nextAnimationFrame();
    await nextAnimationFrame();

    const paintedSelector = [
      "path",
      "text",
      "line",
      "polyline",
      "polygon",
      "circle",
      "ellipse",
      "use",
      "image"
    ].join(",");

    container.querySelectorAll(".rendered-tune svg").forEach((svg) => {

      const viewBoxText = svg.getAttribute("viewBox");
      if (!viewBoxText) return;

      const viewBox = viewBoxText.trim().split(/[ ,]+/).map(Number);
      if (
        viewBox.length !== 4 ||
        !viewBox.every(Number.isFinite) ||
        viewBox[2] <= 0 ||
        viewBox[3] <= 0
      ) {
        return;
      }

      const svgRect = svg.getBoundingClientRect();
      if (
        !Number.isFinite(svgRect.width) ||
        !Number.isFinite(svgRect.height) ||
        svgRect.width <= 0 ||
        svgRect.height <= 0
      ) {
        return;
      }

      let paintedBottom = svgRect.top;

      svg.querySelectorAll(paintedSelector).forEach((element) => {
        const style = getComputedStyle(element);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity) === 0
        ) {
          return;
        }

        const rect = element.getBoundingClientRect();
        if (
          Number.isFinite(rect.bottom) &&
          Number.isFinite(rect.width) &&
          Number.isFinite(rect.height) &&
          (rect.width > 0 || rect.height > 0)
        ) {
          paintedBottom = Math.max(paintedBottom, rect.bottom);
        }
      });

      const paintedPixelHeight = paintedBottom - svgRect.top;
      if (!Number.isFinite(paintedPixelHeight) || paintedPixelHeight <= 0) {
        return;
      }

      const unitsPerPixelY = viewBox[3] / svgRect.height;
      const fittedHeight =
        paintedPixelHeight * unitsPerPixelY +
        bottomPadding * unitsPerPixelY;

      if (
        !Number.isFinite(fittedHeight) ||
        fittedHeight <= 0 ||
        fittedHeight >= viewBox[3] - 2
      ) {
        return;
      }

      if (
        !Number.isFinite(fittedHeight) ||
        fittedHeight <= 0
      ) {
        return;
      }


      viewBox[3] = fittedHeight;
      svg.setAttribute("viewBox", viewBox.join(" "));

      // Keep abcjs's normal responsive SVG model. Do not assign an explicit
      // pixel height to the absolutely positioned SVG.
      svg.removeAttribute("height");
      svg.style.removeProperty("height");
      svg.style.removeProperty("min-height");
      svg.style.removeProperty("width");
      svg.style.display = "inline-block";
      svg.style.position = "absolute";
      svg.style.top = "0";
      svg.style.left = "0";

      const responsiveWrapper = svg.closest(".abcjs-container");
      if (responsiveWrapper) {
        responsiveWrapper.style.height = "";
        responsiveWrapper.style.minHeight = "0";
        responsiveWrapper.style.paddingBottom =
           `${(fittedHeight / viewBox[2]) * 100}%`;
        responsiveWrapper.style.overflow = "hidden";
      }
    });

    await nextAnimationFrame();
  }

/**
   * Reads the current UI controls and applies them through ABCJS.eskinConfig.
   * Playback lifecycle callbacks are also installed here before synth creation.
   */
  function applyPortableSettings() {
    if (!window.ABCJS || !ABCJS.eskinConfig) throw new Error("ABCJS.eskinConfig is unavailable.");

    const soundfontUrl = $("soundfont-url").value.trim();
    if (!soundfontUrl) throw new Error("A soundfont base URL is required.");

    ABCJS.eskinConfig.setSoundFontUrl(soundfontUrl.endsWith("/") ? soundfontUrl : soundfontUrl + "/");
    ABCJS.eskinConfig.setReverb({
      enabled: $("reverb-enabled").checked,
      style: $("reverb-style").value,
      dry: Number($("reverb-dry").value),
      wet: Number($("reverb-wet").value)
    });
    const appliedReverb = ABCJS.eskinConfig.getReverb();
    log(`Reverb configuration: ${appliedReverb.enabled ? "enabled" : "disabled"}, style=${appliedReverb.style}, dry=${appliedReverb.dry.toFixed(2)}, wet=${appliedReverb.wet.toFixed(2)}.`);
    ABCJS.eskinConfig.setSwing($("swing-enabled").checked, Number($("swing-factor").value));

    // Enable Eskin Irish-roll handling for every built-in example and every
    // ABC file loaded into the editor.
    ABCJS.eskinConfig.setIrishRolls(true);

    ABCJS.eskinConfig.setCustomGMSounds($("custom-gm").checked);
    ABCJS.eskinConfig.setPlayerDefaults(100, false);
    ABCJS.eskinConfig.setPlaybackCallbacks({
      preStart: (continuePlayback) => {
        log("Playback pre-start callback received.", "EVENT");
        if (typeof continuePlayback === "function") {
          continuePlayback();
        } else {
          log("Playback pre-start callback did not receive a continuation function.", "WARN");
        }
      },
      start: () => log("Playback start callback received.", "EVENT"),
      loop: () => log("Playback loop callback received.", "EVENT"),
      sequence: () => log("Sequence callback received.", "EVENT")
    });
  }

/**
   * Returns the ABC source unchanged for rendering and playback.
   *
   * The Instrument program dropdown is passed separately to setTune() as the
   * fallback program. It must not be injected into or substituted inside the
   * ABC because doing so can overwrite a global or voice-specific
   * %%MIDI program directive. Preserving the source lets every voice retain
   * its own instrument, including Eskin extension program numbers above 128.
   *
   * @param {string} abc Source ABC.
   * @returns {string} The original ABC source.
   */
  function withProgram(abc) {
    return String(abc || "");
  }

/**
   * Creates the callback object used by SynthController to draw and move the
   * red playback cursor over the first rendered SVG.
   *
   * @returns {Object} onStart, onEvent, and onFinished callbacks.
   */
  function cursorControl() {
    const cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
    cursor.setAttribute("class", "abcjs-cursor");
    cursor.setAttributeNS(null, "x1", "0");
    cursor.setAttributeNS(null, "y1", "0");
    cursor.setAttributeNS(null, "x2", "0");
    cursor.setAttributeNS(null, "y2", "0");

    return {
      /**
       * Attaches the cursor line to the current SVG when playback begins.
       */
      onStart() {
        const svg = document.querySelector("#paper svg");
        if (svg && !cursor.parentNode) svg.appendChild(cursor);
        log("Cursor onStart callback received.", "EVENT");
      },
      /**
       * Moves the cursor to the note event currently being played.
       *
       * @param {Object} ev abcjs timing event.
       */
      onEvent(ev) {
        // The first playable note in a measure is reported with
        // measureStart=true and must still move the cursor. Ignore only timing
        // events that do not provide a usable horizontal position.
        if (!ev || ev.left == null) return;

        cursor.setAttribute("x1", String(ev.left - 2));
        cursor.setAttribute("x2", String(ev.left - 2));
        cursor.setAttribute("y1", String(ev.top));
        cursor.setAttribute("y2", String(ev.top + ev.height));
      },
      /**
       * Hides the cursor by resetting its coordinates after playback ends.
       */
      onFinished() {
        cursor.setAttribute("x1", "0");
        cursor.setAttribute("x2", "0");
        cursor.setAttribute("y1", "0");
        cursor.setAttribute("y2", "0");
        log("Cursor onFinished callback received.", "EVENT");
      }
    };
  }

/**
   * Stops the current controller. With destroy=true it also releases the
   * controller and clears references so audio can be rebuilt from scratch.
   *
   * @param {Object} [options]
   * @param {boolean} [options.destroy=false] Fully destroy the controller.
   * @returns {Promise<void>}
   */
  async function stopPlayback(options = {}) {
    try {
      if (state.synthControl) {
        if (options.destroy && typeof state.synthControl.destroy === "function") {
          state.synthControl.destroy();
        } else {
          if (typeof state.synthControl.pause === "function") {
            state.synthControl.pause();
          }
          if (typeof state.synthControl.restart === "function") {
            state.synthControl.restart();
          }
        }
      }
    } catch (error) {
      reportError(options.destroy ? "Destroying previous audio" : "Stopping playback", error);
    }

    if (options.destroy) {
      state.synthControl = null;
      state.visualObj = null;
      state.renderedAbc = "";
    }
  }

/**
   * Main rendering workflow. It tears down old audio, applies settings, renders
   * notation, handles independent multi-tune display, creates playback controls
   * for a single tune, and prepares the synth samples.
   *
   * @param {Object} [options]
   * @param {boolean} [options.silent=false] Suppress the final Ready log line.
   * @returns {Promise<boolean>} True when rendering/preparation succeeds.
   */
  async function renderAndPrepare(options = {}) {
    if (state.busy) return false;
    setBusy(true);
    const started = performance.now();

    try {
      // Completely discard the previous synth, rendered tune, audio buffers,
      // controller UI, and reverb convolution state before rebuilding.
      await stopPlayback({ destroy: true });
      $("paper").replaceChildren();
      $("audio-controls").replaceChildren();

      if (ABCJS.eskinConfig && typeof ABCJS.eskinConfig.clearReverbCache === "function") {
        ABCJS.eskinConfig.clearReverbCache();
      }

      applyPortableSettings();

      const abc = withProgram($("abc-source").value);
      state.renderedAbc = abc;
      log(`Rendering ${abc.length.toLocaleString()} characters of ABC.`);

      const warnings = [];
      const exampleKey = $("example-select").value;
      const renderParams = getExampleRenderParameters(exampleKey);

      renderParams.clickListener = (abcelem, tuneNumber, classes, analysis, drag, mouseEvent) => {
        const type = abcelem && abcelem.el_type ? abcelem.el_type : "unknown";
        log(`Notation click: type=${type}, tune=${tuneNumber}.`, "EVENT");
      };
      renderParams.warningCallback = (warning) => warnings.push(String(warning));

      if (renderParams.tablature) {
        const tabLabel = renderParams.tablature[0].label || "stringed-instrument";
        log(
          `Rendering ${renderParams.tablatureOnly ? "tablature-only" : "notation plus tablature"} ` +
          `using JavaScript ${tabLabel} render parameters.`
        );
      }

      let visualObjs = [];

      if (isMultiTuneExample()) {
        const singleTunes = splitAbcIntoSingleTunes($("abc-source").value);
        if (!singleTunes.length) {
          throw new Error("No individual tunes were found in the multi-tune ABC.");
        }

        const paper = $("paper");
        paper.replaceChildren();

        // Render every extracted tune into its own independent target div.
        singleTunes.forEach((singleTune, index) => {
          const tuneContainer = document.createElement("div");
          tuneContainer.className = "rendered-tune";
          tuneContainer.id = `rendered-tune-${index + 1}`;
          paper.appendChild(tuneContainer);

          const rendered = ABCJS.renderAbc(
            tuneContainer,
            withProgram(singleTune),
            {
              ...renderParams,
              warningCallback: (warning) =>
                warnings.push(`Tune ${index + 1}: ${String(warning)}`)
            }
          );

          if (!Array.isArray(rendered) || rendered.length !== 1) {
            throw new Error(
              `Tune ${index + 1} did not produce exactly one rendered tune object.`
            );
          }

          visualObjs.push(rendered[0]);
        });

        // MAE FOOFOO
        paper.style.paddingBottom = 0;


        await fitMultiTuneSvgsToContent(paper, 18);
        state.visualObj = null;
        state.renderedAbc = $("abc-source").value;
        $("audio-controls").innerHTML =
          '<div class="playback-disabled-message">' +
          'Playback is disabled for the multi-tune render test' +
          '</div>';

        log(`${visualObjs.length} tunes rendered using separate single-tune render calls.`);
        warnings.forEach((warning) => log(warning, "WARN"));
        log(`Render completed in ${Math.round(performance.now() - started)} ms.`);
        return true;
      }

      visualObjs = ABCJS.renderAbc("paper", abc, renderParams);
      addRenderedSvgBottomAllowance($("paper"), 24);

      if (!Array.isArray(visualObjs) || !visualObjs.length) {
        throw new Error("renderAbc returned no visual tune object.");
      }
      state.visualObj = visualObjs[0];
      warnings.forEach((warning) => log(warning, "WARN"));

      if (!ABCJS.synth || !ABCJS.synth.supportsAudio()) {
        $("audio-controls").textContent = "Web Audio is not supported in this browser.";
        log("Rendering succeeded, but Web Audio is unavailable.", "WARN");
        return true;
      }

      state.synthControl = new ABCJS.synth.SynthController(abc);
      state.synthControl.load("#audio-controls", cursorControl(), {
        displayLoop: true,
        displayRestart: true,
        displayPlay: true,
        displayProgress: true,
        displayWarp: true
      });

      await state.synthControl.setTune(state.visualObj, false, {
        chordsOff: false,
        program: Number($("program-select").value)
      });

      const elapsed = Math.round(performance.now() - started);
      log(`Render and audio preparation completed in ${elapsed} ms.`);
      return true;
    } catch (error) {
      reportError("Render/preparation failed", error);
      $("audio-controls").textContent = "Audio preparation failed. See diagnostics.";
      return false;
    } finally {
      setBusy(false);
      if (!options.silent) log("Ready.");

      if (state.extensionRebuildPending) {
        state.extensionRebuildPending = false;
        scheduleExtensionRebuild("queued change");
      }
    }
  }

/**
   * Copies a selected example into the editor and enables example-specific
   * controls such as reverb or custom swing.
   *
   * @param {string} name Key in the examples object.
   */
/**
   * Opens the browser's file picker for an ABC or plain-text source file.
   * Resetting the hidden input first lets the same file be selected again.
   */
  function chooseAbcFile() {
    const input = $("abc-file-input");
    input.value = "";
    input.click();
  }

/**
   * Loads the selected local file into the ABC editor and then runs the normal
   * complete render/audio preparation path. The current instrument, reverb,
   * swing, soundfont, and other preset controls remain unchanged.
   *
   * @param {Event} event Change event from the hidden file input.
   * @returns {Promise<void>}
   */
  async function loadSelectedAbcFile(event) {
    const input = event.currentTarget;
    const file = input.files && input.files[0];
    if (!file) return;

    try {
      const abcText = await file.text();

      if (!abcText.trim()) {
        throw new Error("The selected file is empty.");
      }

      $("abc-source").value = abcText;
      log(`Loaded ABC file: ${file.name}.`);

      // This applies all settings currently visible in the demo before the
      // notation and audio are regenerated.
      await renderAndPrepare();
    } catch (error) {
      reportError(
        `Could not load ${file.name || "the selected ABC file"}`,
        error
      );
    } finally {
      input.value = "";
    }
  }

  function loadExample(name) {
    const abc = examples[name] || examples.basic;
    $("abc-source").value = abc;

    if (name === "reverb") $("reverb-enabled").checked = true;
    if (name === "swing") $("swing-enabled").checked = true;
    log(`Loaded example: ${name}.`);
  }

/**
   * Executes one synchronous smoke-test assertion and records a pass/fail result
   * without stopping the remaining tests.
   *
   * @param {string} name Human-readable test name.
   * @param {Function} fn Assertion function; returning false means failure.
   */
  function test(name, fn) {
    try {
      const result = fn();
      if (result === false) throw new Error("Assertion returned false.");
      state.tests.push({ name, pass: true });
      log(`PASS — ${name}`, "TEST");
    } catch (error) {
      state.tests.push({ name, pass: false, error: String(error.message || error) });
      log(`FAIL — ${name}: ${error.message || error}`, "TEST");
    }
  }

/**
   * Runs host-level API, rendering, tablature, cache, and multi-tune smoke tests,
   * then summarizes the results in the diagnostics panel.
   *
   * @returns {Promise<void>}
   */
  /**
   * Adds one smoke test for every method and property exposed by
   * ABCJS.eskinConfig. Setter tests restore the original value so running the
   * suite does not permanently change the current demo preset.
   */
  function runEskinConfigApiSmokeTests() {
    const api = ABCJS.eskinConfig;
    const same = (left, right) =>
      JSON.stringify(left) === JSON.stringify(right);

    const expectedMethods = [
      "setSoundFontUrl", "getSoundFontUrl",
      "clearNoteCache", "clearReverbCache",
      "setReverb", "getReverb",
      "setSwing", "getSwing",
      "setSwingOffset", "getSwingOffset",
      "setABCJSSwing", "getABCJSSwing",
      "setVoiceTuning", "getVoiceTuning",
      "setCustomGMSounds", "getCustomGMSounds",
      "setCustomGMSoundsOverride", "getCustomGMSoundsOverride",
      "setBodhranPitch", "getBodhranPitch",
      "setBanjoStyle", "getBanjoStyle",
      "setPlayerDefaults", "getPlayerDefaults",
      "setPlaybackCallbacks", "getPlaybackCallbacks",
      "setRenderProgressLogging", "getRenderProgressLogging",
      "setSampleAvailability", "getSampleAvailability",
      "setRhythmPatternOverrides", "getRhythmPatternOverrides",
      "clearRhythmPatternOverrides",
      "setGraceNoteOptions", "getGraceNoteOptions",
      "setIrishRolls", "getIrishRolls",
      "setIrishRollOverrides", "getIrishRollOverrides",
      "setIrishRollOptions", "getIrishRollOptions",
      "setOrnamentTiming", "getOrnamentTiming",
      "setTremoloDivider", "getTremoloDivider",
      "setLeftJustifyTitles", "getLeftJustifyTitles",
      "setSolfegeABC", "getSolfegeABC",
      "setTabStaffSelection", "getTabStaffSelection",
      "setTablatureOnly", "getTablatureOnly",
      "setBackupNoteFractions", "getBackupNoteFractions",
      "setStrummedChords", "getStrummedChords",
      "setAccompanimentOctaveShifts", "getAccompanimentOctaveShifts",
      "setUseGChord", "getUseGChord",
      "setRenderingParams", "getRenderingParams",
      "setDurationExtension", "getDurationExtension",
      "setAllowLowercaseChords", "getAllowLowercaseChords",
      "setInformationVisibility", "getInformationVisibility",
      "setWhistleTabTranspose", "getWhistleTabTranspose",
      "setRecorderTabTranspose", "getRecorderTabTranspose",
      "setSvgHyperlinks", "getSvgHyperlinks",
      "setPlayAlternateChords", "getPlayAlternateChords",
      "setHideCautionaryKeySignatures",
      "getHideCautionaryKeySignatures",
      "setTitleReverser", "getTitleReverser",
      "setForcePowerChords", "getForcePowerChords",
      "setLoopStateCaching", "getLoopStateCaching",
      "getFeatureState"
    ];

    expectedMethods.forEach((methodName) => {
      test(`API exists: ${methodName}()`, () =>
        typeof api[methodName] === "function");
    });
    test("API exists: version", () =>
      typeof api.version === "string" && api.version.length > 0);

    function roundTrip(name, getter, applyTest, restore) {
      test(`API round-trip: ${name}`, () => {
        const original = getter();
        try {
          applyTest();
          return true;
        } finally {
          restore(original);
        }
      });
    }

    roundTrip(
      "soundfont URL",
      () => api.getSoundFontUrl(),
      () => {
        api.setSoundFontUrl("https://example.invalid/api-test/");
        if (api.getSoundFontUrl() !== "https://example.invalid/api-test/") {
          throw new Error("Soundfont URL did not round-trip.");
        }
      },
      (value) => api.setSoundFontUrl(value)
    );

    test("API call: clearNoteCache()", () => {
      api.clearNoteCache();
      return true;
    });
    test("API call: clearReverbCache()", () => {
      api.clearReverbCache();
      return true;
    });

    roundTrip("reverb", api.getReverb.bind(api), () => {
      api.setReverb({ enabled: true, style: "hall2", dry: 0.6, wet: 0.4 });
      if (!same(api.getReverb(), {
        enabled: true, style: "hall2", dry: 0.6, wet: 0.4
      })) throw new Error("Reverb did not round-trip.");
    }, (value) => api.setReverb(value));

    roundTrip("custom swing", api.getSwing.bind(api), () => {
      api.setSwing(true, 0.31);
      if (!same(api.getSwing(), { enabled: true, factor: 0.31 })) {
        throw new Error("Custom swing did not round-trip.");
      }
    }, (value) => api.setSwing(value.enabled, value.factor));

    roundTrip("swing offset", api.getSwingOffset.bind(api), () => {
      api.setSwingOffset(0.125);
      if (api.getSwingOffset() !== 0.125) throw new Error("Offset mismatch.");
    }, (value) => api.setSwingOffset(value));

    roundTrip("abcjs swing", api.getABCJSSwing.bind(api), () => {
      api.setABCJSSwing(true, 57);
      if (!same(api.getABCJSSwing(), { enabled: true, factor: 57 })) {
        throw new Error("abcjs swing did not round-trip.");
      }
    }, (value) => api.setABCJSSwing(value.enabled, value.factor));

    roundTrip("voice tuning", api.getVoiceTuning.bind(api), () => {
      api.setVoiceTuning([0, -5, 7]);
      if (!same(api.getVoiceTuning(), [0, -5, 7])) {
        throw new Error("Voice tuning did not round-trip.");
      }
    }, (value) => api.setVoiceTuning(value));

    roundTrip("custom GM sounds", api.getCustomGMSounds.bind(api), () => {
      api.setCustomGMSounds(false);
      if (api.getCustomGMSounds() !== false) throw new Error("Boolean mismatch.");
    }, (value) => api.setCustomGMSounds(value));

    roundTrip(
      "custom GM override",
      api.getCustomGMSoundsOverride.bind(api),
      () => {
        api.setCustomGMSoundsOverride({ enabled: true, value: false });
        if (!same(api.getCustomGMSoundsOverride(), {
          enabled: true, value: false
        })) throw new Error("Override mismatch.");
      },
      (value) => api.setCustomGMSoundsOverride(value)
    );

    roundTrip("bodhrán pitch", api.getBodhranPitch.bind(api), () => {
      api.setBodhranPitch("d");
      if (api.getBodhranPitch() !== "d") throw new Error("Pitch mismatch.");
    }, (value) => api.setBodhranPitch(value));

    roundTrip("banjo style", api.getBanjoStyle.bind(api), () => {
      api.setBanjoStyle("3");
      if (api.getBanjoStyle() !== "3") throw new Error("Style mismatch.");
    }, (value) => api.setBanjoStyle(value));

    roundTrip("player defaults", api.getPlayerDefaults.bind(api), () => {
      api.setPlayerDefaults(125, true);
      if (!same(api.getPlayerDefaults(), { warp: 125, repeat: true })) {
        throw new Error("Player defaults mismatch.");
      }
    }, (value) => api.setPlayerDefaults(value.warp, value.repeat));

    test("API round-trip: playback callbacks", () => {
      const original = api.getPlaybackCallbacks();
      const callback = () => {};
      try {
        api.setPlaybackCallbacks({
          loop: callback,
          start: callback,
          preStart: callback,
          sequence: callback
        });
        const value = api.getPlaybackCallbacks();
        return value.loop === callback &&
          value.start === callback &&
          value.preStart === callback &&
          value.sequence === callback;
      } finally {
        api.setPlaybackCallbacks(original);
      }
    });

    roundTrip(
      "render progress logging",
      api.getRenderProgressLogging.bind(api),
      () => {
        api.setRenderProgressLogging(true);
        if (api.getRenderProgressLogging() !== true) {
          throw new Error("Logging mismatch.");
        }
      },
      (value) => api.setRenderProgressLogging(value)
    );

    const objectCases = [
      ["sample availability", "getSampleAvailability", "setSampleAvailability",
        { online: false, allowOffline: true }],
      ["rhythm overrides", "getRhythmPatternOverrides",
        "setRhythmPatternOverrides",
        { "10/8": { pattern: ["boom"], threshold: 1 } }],
      ["grace-note options", "getGraceNoteOptions", "setGraceNoteOptions",
        { duration: 0.052, tuneType: "reel", missingTempo: true }],
      ["Irish-roll overrides", "getIrishRollOverrides",
        "setIrishRollOverrides",
        { forceEnable: true, forceDisable: false }],
      ["ornament timing", "getOrnamentTiming", "setOrnamentTiming",
        { divider: 24, offset: 3 }],
      ["backup-note fractions", "getBackupNoteFractions",
        "setBackupNoteFractions",
        { boom: 0.45, chick: 0.55 }],
      ["accompaniment octave shifts", "getAccompanimentOctaveShifts",
        "setAccompanimentOctaveShifts",
        { bass: -1, chords: 1 }],
      ["rendering params", "getRenderingParams", "setRenderingParams",
        { scale: 0.9, staffwidth: 700 }],
      ["information visibility", "getInformationVisibility",
        "setInformationVisibility",
        {
          hideLabels: true,
          hideRhythm: true,
          hideComposer: true,
          hideParts: true,
          hideDynamics: true
        }],
      ["whistle tab transpose", "getWhistleTabTranspose",
        "setWhistleTabTranspose",
        { enabled: true, octave: 1, semitone: -2 }],
      ["recorder tab transpose", "getRecorderTabTranspose",
        "setRecorderTabTranspose",
        { enabled: true, octave: -1, semitone: 2 }],
      ["SVG hyperlinks", "getSvgHyperlinks", "setSvgHyperlinks",
        { enabled: true, forceDisable: false }]
    ];

    objectCases.forEach(([name, getterName, setterName, testValue]) => {
      roundTrip(name, api[getterName].bind(api), () => {
        api[setterName](testValue);
        if (!same(api[getterName](), testValue)) {
          throw new Error(`${name} did not round-trip.`);
        }
      }, (value) => api[setterName](value));
    });

    test("API call: clearRhythmPatternOverrides()", () => {
      const original = api.getRhythmPatternOverrides();
      try {
        api.setRhythmPatternOverrides({ test: { pattern: ["boom"] } });
        api.clearRhythmPatternOverrides();
        return same(api.getRhythmPatternOverrides(), {});
      } finally {
        api.setRhythmPatternOverrides(original);
      }
    });

    roundTrip("Irish rolls", api.getIrishRolls.bind(api), () => {
      api.setIrishRolls(true);
      if (api.getIrishRolls() !== true) throw new Error("Irish rolls mismatch.");
    }, (value) => api.setIrishRolls(value));

    roundTrip("Irish-roll options", api.getIrishRollOptions.bind(api), () => {
      api.setIrishRollOptions({
        useOriginalSolution: true,
        quarter: { duration1: 0.91, volume2: 0.71 },
        dottedQuarter: { duration2: 0.61, fraction3: 0.81 }
      });
      const value = api.getIrishRollOptions();
      if (
        value.useOriginalSolution !== true ||
        value.quarter.duration1 !== 0.91 ||
        value.quarter.volume2 !== 0.71 ||
        value.dottedQuarter.duration2 !== 0.61 ||
        value.dottedQuarter.fraction3 !== 0.81
      ) throw new Error("Irish-roll options mismatch.");
    }, (value) => api.setIrishRollOptions(value));

    const scalarCases = [
      ["tremolo divider", "getTremoloDivider", "setTremoloDivider", 12],
      ["left-justify titles", "getLeftJustifyTitles",
        "setLeftJustifyTitles", true],
      ["Solfege ABC", "getSolfegeABC", "setSolfegeABC", "X:1\nK:C\nC|"],
      ["tablature only", "getTablatureOnly", "setTablatureOnly", true],
      ["use gchord", "getUseGChord", "setUseGChord", true],
      ["duration extension", "getDurationExtension",
        "setDurationExtension", 0.2],
      ["allow lowercase chords", "getAllowLowercaseChords",
        "setAllowLowercaseChords", true],
      ["hide cautionary key signatures", "getHideCautionaryKeySignatures",
        "setHideCautionaryKeySignatures", true],
      ["title reverser", "getTitleReverser", "setTitleReverser", false],
      ["force power chords", "getForcePowerChords",
        "setForcePowerChords", true],
      ["loop-state caching", "getLoopStateCaching",
        "setLoopStateCaching", false]
    ];

    scalarCases.forEach(([name, getterName, setterName, testValue]) => {
      roundTrip(name, api[getterName].bind(api), () => {
        api[setterName](testValue);
        if (api[getterName]() !== testValue) {
          throw new Error(`${name} did not round-trip.`);
        }
      }, (value) => api[setterName](value));
    });

    roundTrip("tab staff selection", api.getTabStaffSelection.bind(api), () => {
      api.setTabStaffSelection("second");
      if (api.getTabStaffSelection() !== "second") {
        throw new Error("Tab staff selection mismatch.");
      }
    }, (value) => api.setTabStaffSelection(value));

    roundTrip("strummed chords", api.getStrummedChords.bind(api), () => {
      api.setStrummedChords(true, { divider: 10 });
      if (!same(api.getStrummedChords(), {
        enabled: true, divider: 10
      })) throw new Error("Strummed chords mismatch.");
    }, (value) => api.setStrummedChords(value.enabled, {
      divider: value.divider
    }));

    roundTrip(
      "alternate chords",
      api.getPlayAlternateChords.bind(api),
      () => {
        api.setPlayAlternateChords(true, true);
        if (!same(api.getPlayAlternateChords(), {
          enabled: true, override: true
        })) throw new Error("Alternate chord mismatch.");
      },
      (value) => api.setPlayAlternateChords(value.enabled, value.override)
    );

    test("API call: getFeatureState()", () => {
      const state = api.getFeatureState();
      return state && typeof state === "object" &&
        typeof state.irishRolls === "boolean";
    });
  }

  async function runSmokeTests() {
    if (state.busy) return;
    state.tests = [];
    log("Starting automated smoke tests.", "TEST");

    test("ABCJS global is present", () => !!window.ABCJS);
    test("Portable configuration facade is present", () => typeof ABCJS.eskinConfig === "object");
    runEskinConfigApiSmokeTests();
    test("renderAbc is callable", () => typeof ABCJS.renderAbc === "function");
    test("SynthController is callable", () => typeof ABCJS.synth.SynthController === "function");
    test("Soundfont URL round-trip", () => {
      const original = ABCJS.eskinConfig.getSoundFontUrl();
      ABCJS.eskinConfig.setSoundFontUrl("https://example.invalid/test/");
      const changed = ABCJS.eskinConfig.getSoundFontUrl() === "https://example.invalid/test/";
      ABCJS.eskinConfig.setSoundFontUrl(original);
      return changed;
    });
    test("Reverb settings round-trip", () => {
      ABCJS.eskinConfig.setReverb({ enabled: true, style: "hall2", dry: 0.6, wet: 0.4 });
      const value = ABCJS.eskinConfig.getReverb();
      return value.enabled === true && value.style === "hall2" && value.dry === 0.6 && value.wet === 0.4;
    });
    test("Cache clear methods are callable", () => {
      ABCJS.eskinConfig.clearNoteCache();
      ABCJS.eskinConfig.clearReverbCache();
      return true;
    });
    test("Per-tune %reverb directive is parsed", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);

      const result = ABCJS.renderAbc(
        temp,
        "X:1\nT:Per-tune reverb\nM:4/4\nL:1/4\nK:C\n%reverb chamber 0.95 0.05\nCDEF|]",
        {}
      );

      const value = result &&
        result[0] &&
        result[0].eskinPlayback &&
        result[0].eskinPlayback.reverb;

      const pass = !!value &&
        value.specified === true &&
        value.enabled === true &&
        value.style === "chamber" &&
        value.dry === 0.95 &&
        value.wet === 0.05;

      temp.remove();
      return pass;
    });

    test("Invalid per-tune %reverb uses the host fallback", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);

      const result = ABCJS.renderAbc(
        temp,
        "X:1\nT:Invalid reverb\nM:4/4\nL:1/4\nK:C\n%reverb chamber 1.5 -0.5\nCDEF|]",
        {}
      );

      const value = result &&
        result[0] &&
        result[0].eskinPlayback &&
        result[0].eskinPlayback.reverb;

      const pass = !!value && value.specified === false;
      temp.remove();
      return pass;
    });

    test("Per-tune %swing_offset directive is parsed", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);

      const result = ABCJS.renderAbc(
        temp,
        "X:1\nT:Swing offset\nM:4/4\nL:1/8\nK:C\n%swing 0.25\n%swing_offset 2.5\nC2D2E2F2|]",
        {}
      );

      const value = result &&
        result[0] &&
        result[0].eskinPlayback &&
        result[0].eskinPlayback.swingOffset;

      const pass = !!value &&
        value.specified === true &&
        value.value === 2.5;

      temp.remove();
      return pass;
    });

    test("Invalid per-tune %swing_offset uses the host fallback", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);

      const result = ABCJS.renderAbc(
        temp,
        "X:1\nT:Invalid offset\nM:4/4\nL:1/8\nK:C\n%swing_offset nope\nC2D2E2F2|]",
        {}
      );

      const value = result &&
        result[0] &&
        result[0].eskinPlayback &&
        result[0].eskinPlayback.swingOffset;

      const pass = !!value && value.specified === false;
      temp.remove();
      return pass;
    });

    test("Per-tune %soundfont fatboy is parsed", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);

      const result = ABCJS.renderAbc(
        temp,
        "X:1\nT:FatBoy soundfont\nM:4/4\nL:1/4\nK:C\n%soundfont fatboy\nCDEF|]",
        {}
      );

      const value = result &&
        result[0] &&
        result[0].eskinPlayback &&
        result[0].eskinPlayback.soundfont;

      const pass = !!value &&
        value.specified === true &&
        value.name === "fatboy" &&
        value.url ===
          "https://michaeleskin.com/abctools/soundfonts/fatboy_4/";

      temp.remove();
      return pass;
    });

    test("Per-tune %soundfont arachno is parsed", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);

      const result = ABCJS.renderAbc(
        temp,
        "X:1\nT:Arachno soundfont\nM:4/4\nL:1/4\nK:C\n%soundfont arachno\nCDEF|]",
        {}
      );

      const value = result &&
        result[0] &&
        result[0].eskinPlayback &&
        result[0].eskinPlayback.soundfont;

      const pass = !!value &&
        value.specified === true &&
        value.name === "arachno" &&
        value.url ===
          "https://michaeleskin.com/abctools/soundfonts/arachno_3/";

      temp.remove();
      return pass;
    });

    test("Invalid per-tune %soundfont uses the host fallback", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);

      const result = ABCJS.renderAbc(
        temp,
        "X:1\nT:Invalid soundfont\nM:4/4\nL:1/4\nK:C\n%soundfont unknown\nCDEF|]",
        {}
      );

      const value = result &&
        result[0] &&
        result[0].eskinPlayback &&
        result[0].eskinPlayback.soundfont;

      const pass = !!value && value.specified === false;

      temp.remove();
      return pass;
    });

    test("Minimal ABC renders", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);
      const result = ABCJS.renderAbc(temp, "X:1\nT:Smoke Test\nM:4/4\nL:1/4\nK:C\nCDEF|]", {});
      const pass = Array.isArray(result) && result.length === 1 && !!temp.querySelector("svg");
      temp.remove();
      return pass;
    });
    test("Mandolin notation plus tablature render parameters work", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);
      const result = ABCJS.renderAbc(
        temp,
        examples.mandolinStandard,
        getExampleRenderParameters("mandolinStandard")
      );
      const pass = Array.isArray(result) && result.length === 1 && !!temp.querySelector("svg");
      temp.remove();
      return pass;
    });

    test("Mandolin JavaScript render parameters work", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);
      const result = ABCJS.renderAbc(
        temp,
        examples.mandolinTablature,
        getExampleRenderParameters("mandolinTablature")
      );
      const pass = Array.isArray(result) && result.length === 1 && !!temp.querySelector("svg");
      temp.remove();
      return pass;
    });

    test("Tablature-only JavaScript render parameters work", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);
      const result = ABCJS.renderAbc(
        temp,
        examples.tablatureOnly,
        getExampleRenderParameters("tablatureOnly")
      );
      const pass = Array.isArray(result) && result.length === 1 && !!temp.querySelector("svg");
      temp.remove();
      return pass;
    });
    test("Multi-tune mandolin notation plus tablature renders three tunes", () => {
      const tunes = splitAbcIntoSingleTunes(examples.multiTuneMandolinStandard);
      if (tunes.length !== 3) return false;

      const host = document.createElement("div");
      document.body.appendChild(host);

      const results = tunes.map((singleTune) => {
        const target = document.createElement("div");
        host.appendChild(target);
        const rendered = ABCJS.renderAbc(
          target,
          singleTune,
          getExampleRenderParameters("multiTuneMandolinStandard")
        );
        return Array.isArray(rendered) &&
          rendered.length === 1 &&
          !!target.querySelector("svg");
      });

      host.remove();
      return results.every(Boolean);
    });

    test("Multi-tune mandolin tablature-only renders three tunes", () => {
      const tunes = splitAbcIntoSingleTunes(examples.multiTuneMandolinOnly);
      if (tunes.length !== 3) return false;

      const host = document.createElement("div");
      document.body.appendChild(host);

      const results = tunes.map((singleTune) => {
        const target = document.createElement("div");
        host.appendChild(target);
        const rendered = ABCJS.renderAbc(
          target,
          singleTune,
          getExampleRenderParameters("multiTuneMandolinOnly")
        );
        return Array.isArray(rendered) &&
          rendered.length === 1 &&
          !!target.querySelector("svg");
      });

      host.remove();
      return results.every(Boolean);
    });

    test("Multi-tune ABC renders three independent single-tune instances", () => {
      const tunes = splitAbcIntoSingleTunes(examples.multiTune);
      if (tunes.length !== 3) return false;

      const host = document.createElement("div");
      document.body.appendChild(host);

      const results = tunes.map((singleTune) => {
        const target = document.createElement("div");
        host.appendChild(target);
        const rendered = ABCJS.renderAbc(
          target,
          singleTune,
          getExampleRenderParameters("multiTune")
        );
        return Array.isArray(rendered) &&
          rendered.length === 1 &&
          !!target.querySelector("svg");
      });

      host.remove();
      return results.every(Boolean);
    });

    test("Cursor moves for the first note of a measure", () => {
      const paper = $("paper");
      const savedChildren = Array.from(paper.childNodes);

      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );

      paper.replaceChildren(svg);

      const callbacks = cursorControl();
      callbacks.onStart();
      callbacks.onEvent({
        measureStart: true,
        left: 120,
        top: 30,
        height: 48
      });

      const line = svg.querySelector(".abcjs-cursor");
      const pass = !!line &&
        line.getAttribute("x1") === "118" &&
        line.getAttribute("x2") === "118" &&
        line.getAttribute("y1") === "30" &&
        line.getAttribute("y2") === "78";

      paper.replaceChildren(...savedChildren);
      return pass;
    });

    test("Invalid ABC does not crash the host page", () => {
      const temp = document.createElement("div");
      document.body.appendChild(temp);
      ABCJS.renderAbc(temp, examples.invalid, {});
      temp.remove();
      return true;
    });

    const passed = state.tests.filter((item) => item.pass).length;
    const failed = state.tests.length - passed;
    $("test-summary").textContent = `${passed} passed, ${failed} failed`;
    log(`Smoke tests complete: ${passed} passed, ${failed} failed.`, failed ? "WARN" : "TEST");
  }

/**
   * Keeps a numeric output element synchronized with a range input.
   *
   * @param {string} rangeId Range input ID.
   * @param {string} outputId Output element ID.
   * @param {number} digits Number of decimal places to display.
   */
  function bindRange(rangeId, outputId, digits) {
    const range = $(rangeId);
    const output = $(outputId);
    // Formats the current slider value whenever the slider moves.
    const update = () => {
      output.value = Number(range.value).toFixed(digits);
    };
    range.addEventListener("input", update);
    update();
  }

/**
   * Verifies that the library loaded, connects all application controls and
   * global error handlers, loads the default example, and performs the initial
   * render/audio preparation.
   */
  function initialize() {
    const status = $("library-status");
    if (!window.ABCJS || !ABCJS.eskinConfig) {
      status.textContent = "Library failed to load";
      status.className = "status-badge error";
      log("ABCJS or ABCJS.eskinConfig was not found. Confirm that abcjs-eskin-portable.js is beside index.html.", "ERROR");
      return;
    }

    status.textContent = "Library loaded";
    status.className = "status-badge ok";
    $("version-text").textContent = `${ABCJS.signature || "unknown"}`;

    bindRange("reverb-dry", "dry-output", 2);
    bindRange("reverb-wet", "wet-output", 2);
    bindRange("swing-factor", "swing-output", 2);
    // Example changes replace the editor text and rebuild notation/audio.
    $("example-select").addEventListener("change", async () => {
      loadExample($("example-select").value);
      await renderAndPrepare();
    });
    $("program-select").addEventListener("change", () => renderAndPrepare());
    // Load a local ABC file, preserving the currently selected settings.
    $("load-abc-file").addEventListener("click", chooseAbcFile);
    $("abc-file-input").addEventListener("change", loadSelectedAbcFile);
    $("render-button").addEventListener("click", () => renderAndPrepare());
    $("run-tests").addEventListener("click", runSmokeTests);
    $("copy-log").addEventListener("click", copyDiagnostics);
    $("clear-log").addEventListener("click", () => { $("log").textContent = ""; });
    bindAutomaticExtensionRebuild();
    $("clear-note-cache").addEventListener("click", () => {
      ABCJS.eskinConfig.clearNoteCache();
      log("In-memory note cache cleared.");
    });
    $("clear-reverb-cache").addEventListener("click", () => {
      ABCJS.eskinConfig.clearReverbCache();
      log("In-memory reverb cache cleared.");
    });

    // Surface errors that escape local try/catch blocks in Diagnostics.
    window.addEventListener("error", (event) => reportError("Unhandled window error", event.error || event.message));
    window.addEventListener("unhandledrejection", (event) => reportError("Unhandled promise rejection", event.reason));

    loadExample("basic");
    log(`Loaded ${ABCJS.signature || "ABCJS"}; ${ABCJS.eskinConfig.version}.`);
    renderAndPrepare().finally(() => {
      state.initialized = true;
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
