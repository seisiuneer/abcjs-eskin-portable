"use strict";

/*
 * The ABC source for each tune is stored in mandolin.html inside an inert
 * <script type="text/plain"> block. This file keeps only the source element
 * IDs and reads the ABC when each tune is prepared.
 *
 * Each ABC tune includes %%MIDI program 141 so the mandolin program is used
 * for playback. The same program is also supplied as the setTune() fallback.
 */
const tunes = [
  {
    key: "cooleys",
    abcElementId: "cooleys-abc"
  },
  {
    key: "kesh",
    abcElementId: "kesh-abc"
  },
  {
    key: "alexanders",
    abcElementId: "alexanders-abc"
  }
];

const controllers = new Map();

/* Pause every prepared player before table-of-contents navigation. */
function stopAllPlayback() {
  controllers.forEach((controller) => {
    if (controller && typeof controller.pause === "function") {
      controller.pause();
    }
  });
}

/*
 * Table-of-contents links jump immediately. Tune-header buttons stop playback
 * and return all the way to the top of the page.
 */
function installTableOfContentsButtons() {
  document.querySelectorAll(".toc-links a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      stopAllPlayback();

      const href = link.getAttribute("href");
      const target = href ? document.querySelector(href) : null;
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        history.replaceState(null, "", href);
      }
    });
  });

  document.querySelectorAll(".back-to-toc").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      stopAllPlayback();
      window.scrollTo(0, 0);
      history.replaceState(null, "", "#table-of-contents");
    });
  });
}

/*
 * Toggle one tune's playback.
 *
 * SynthController.play() starts playback when stopped and pauses it when
 * already running. The current cursor is intentionally left visible while
 * paused so the resume position remains clear.
 */
function togglePlayback(controller) {
  if (!controller) return Promise.resolve();

  return Promise.resolve(controller.play()).catch((error) => {
    console.error("Could not toggle playback:", error);
  });
}

/*
 * Keep the red playback cursor visible.
 *
 * Vertically, the page scrolls only when the cursor approaches the top or
 * bottom edge of the viewport. Horizontally, the tune's own paper container
 * scrolls when the cursor moves outside a comfortable inner margin.
 */
function keepCursorVisible(cursor, paperElement) {
  if (!cursor || !paperElement) return;

  const cursorRect = cursor.getBoundingClientRect();
  const viewportTopMargin = 110;
  const viewportBottomMargin = 130;

  if (cursorRect.top < viewportTopMargin) {
    window.scrollBy({
      top: cursorRect.top - viewportTopMargin,
      behavior: "smooth"
    });
  } else if (
    cursorRect.bottom >
    window.innerHeight - viewportBottomMargin
  ) {
    window.scrollBy({
      top:
        cursorRect.bottom -
        (window.innerHeight - viewportBottomMargin),
      behavior: "smooth"
    });
  }

  const paperRect = paperElement.getBoundingClientRect();
  const horizontalMargin = 70;

  if (cursorRect.left < paperRect.left + horizontalMargin) {
    paperElement.scrollBy({
      left:
        cursorRect.left -
        (paperRect.left + horizontalMargin),
      behavior: "smooth"
    });
  } else if (
    cursorRect.right >
    paperRect.right - horizontalMargin
  ) {
    paperElement.scrollBy({
      left:
        cursorRect.right -
        (paperRect.right - horizontalMargin),
      behavior: "smooth"
    });
  }
}

/*
 * Read one tune's ABC source from its inert HTML text block.
 */
function getAbcFromHtml(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`ABC source element not found: ${elementId}`);
  }

  return element.textContent.trim();
}

/*
 * Standalone mandolin tablature uses the four-string violin tablature plugin
 * with standard GDAE tuning and tablatureOnly=true.
 */
const mandolinRenderParams = {
  responsive: "resize",
  expandToWidest: "true",
  selectTypes: false,
  tablatureOnly: true,
  tablature: [{
    instrument: "violin",
    label: "Mandolin",
    tuning: ["G,", "D", "A", "e"],
    highestNote: "f'",
    capo: 0
  }]
};

const playerOptions = {
  displayLoop: true,
  displayRestart: true,
  displayPlay: true,
  displayProgress: true,
  displayWarp: true
};

const synthOptions = {
  program: 141,
  chordsOff: false
};

/*
 * No custom soundfont URL is set, so the portable library's default soundfont
 * is used. Irish-roll handling is enabled for all three tunes.
 */
function applyPortableSettings() {
  ABCJS.eskinConfig.setIrishRolls(true);
  ABCJS.eskinConfig.setCustomGMSounds(true);
  ABCJS.eskinConfig.setPlayerDefaults(100, false);
}

/*
 * Create an independent red playback cursor for one tune.
 */
function createCursorControl(paperId) {
  let cursor = null;
  let paperElement = null;

  return {
    onStart() {
      paperElement = document.getElementById(paperId);

      const svg = paperElement
        ? paperElement.querySelector("svg")
        : null;

      if (!svg) return;

      // Remove any stale cursor left from an earlier playback run.
      svg.querySelectorAll(".abcjs-cursor").forEach((oldCursor) => {
        oldCursor.remove();
      });

      cursor = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      cursor.setAttribute("class", "abcjs-cursor");
      cursor.setAttribute("stroke", "#00f000");
      svg.appendChild(cursor);
    },

    onEvent(event) {
      // measureStart=true is valid for the first note of a measure.
      if (!cursor || !event || event.left == null) return;

      cursor.setAttribute("x1", String(event.left - 2));
      cursor.setAttribute("x2", String(event.left - 2));
      cursor.setAttribute("y1", String(event.top));
      cursor.setAttribute("y2", String(event.top + event.height));

      keepCursorVisible(cursor, paperElement);
    },

    onFinished() {
      if (!cursor) return;

      cursor.remove();
      cursor = null;
    }
  };
}

/*
 * Read, render, and prepare one tune from its HTML source block.
 */
async function renderTune(tune) {
  const paperId = `${tune.key}-paper`;
  const audioId = `${tune.key}-audio`;
  const status = document.getElementById(`${tune.key}-status`);

  try {
    status.classList.remove("error");
    status.textContent = "Rendering tablature and preparing audio…";

    const abc = getAbcFromHtml(tune.abcElementId);

    const rendered = ABCJS.renderAbc(
      paperId,
      abc,
      mandolinRenderParams
    );

    if (!Array.isArray(rendered) || rendered.length !== 1) {
      throw new Error("The tune did not produce exactly one rendered object.");
    }

    const controller = new ABCJS.synth.SynthController();

    controller.load(
      `#${audioId}`,
      createCursorControl(paperId),
      playerOptions
    );

    await controller.setTune(
      rendered[0],
      false,
      synthOptions
    );

    controllers.set(tune.key, controller);

    /*
     * Clicking the notation toggles this tune between playback and pause.
     * Enter and Space provide the same behavior for keyboard users. The cursor
     * remains visible while paused.
     */
    const paper = document.getElementById(paperId);

    if (paper && !paper.dataset.clickStopsPlayback) {
      paper.dataset.clickStopsPlayback = "true";
      paper.tabIndex = 0;
      paper.setAttribute(
        "title",
        "Click the notation to pause or resume this tune"
      );

      paper.addEventListener("click", () => {
        void togglePlayback(controller);
      });

      paper.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void togglePlayback(controller);
        }
      });
    }

    status.textContent =
      "Ready. Use the controls above; click the notation to pause or resume.";
  } catch (error) {
    console.error(`Could not prepare ${tune.key}:`, error);
    status.classList.add("error");
    status.textContent =
      error && error.message ? error.message : String(error);
  }
}

/*
 * Initialize all three tune displays and players.
 */
async function initialize() {
  if (!window.ABCJS || !ABCJS.eskinConfig) {
    throw new Error("abcjs-eskin-portable did not load.");
  }

  applyPortableSettings();
  installTableOfContentsButtons();
  await Promise.all(tunes.map(renderTune));
}

window.addEventListener("DOMContentLoaded", () => {
  initialize().catch((error) => {
    console.error(error);

    document.querySelectorAll(".status").forEach((element) => {
      element.classList.add("error");
      element.textContent =
        error && error.message ? error.message : String(error);
    });
  });
});
