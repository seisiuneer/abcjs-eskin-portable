"use strict";

/**
 * Builds and manages the Instructions dialog.
 *
 * Keeping this large documentation block in its own module makes index.html
 * easier to read and lets developers reuse or replace the instructions UI
 * without touching the rendering and playback example code in demo.js.
 */
(function () {
  const INSTRUCTIONS_MARKUP = `    <section class="instructions-section">
      <button id="instructions-button" class="instructions-button" type="button">
        Instructions
      </button>
    </section>

    <dialog id="instructions-dialog" aria-labelledby="instructions-title">
      <div class="modal-header">
        <h2 id="instructions-title">Instructions</h2>
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
