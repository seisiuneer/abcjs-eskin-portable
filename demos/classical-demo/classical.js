"use strict";

/*
 * All three ABC scores are stored in hidden text/plain script elements in
 * index.html. This file reads each score with textContent, renders it into its
 * own notation div, and prepares a separate SynthController and playback bar.
 * No external ABC files or fetch() calls are required.
 */
const works = [
  {
    key: "invention",
    abcElementId: "invention-abc"
  },
  {
    key: "fantasia",
    abcElementId: "fantasia-abc"
  },
  {
    key: "sonatina",
    abcElementId: "sonatina-abc"
  }
];

const controllers = new Map();

function stopAllPlayback() {
  controllers.forEach((controller) => {
    if (controller && typeof controller.pause === "function") {
      controller.pause();
    }
  });
}

function installTableOfContentsButtons() {
  document.querySelectorAll(".toc-links a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      stopAllPlayback();

      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        history.replaceState(null, "", link.getAttribute("href"));
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
 * Toggle one score's playback.
 *
 * SynthController.play() starts playback when stopped and pauses it when
 * already running. The current cursor is intentionally left visible while
 * paused so the score resumes from the same visual position.
 */
function togglePlayback(controller) {
  if (!controller) return Promise.resolve();

  return Promise.resolve(controller.play()).catch((error) => {
    console.error("Could not toggle playback:", error);
  });
}

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

/*
 * This fallback program is used only when a voice has no %%MIDI program
 * directive. Each supplied score defines its own voice programs.
 */
const synthOptions = {
  program: 0,
  chordsOff: false
};

function applyPortableDefaults() {
  ABCJS.eskinConfig.setIrishRolls(true);
  ABCJS.eskinConfig.setCustomGMSounds(true);
  ABCJS.eskinConfig.setPlayerDefaults(100, false);
}

/*
 * Read one ABC score from a text/plain script element in index.html.
 * textContent preserves the ABC exactly without displaying it on the page.
 */
function getEmbeddedAbc(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Embedded ABC element not found: ${elementId}`);
  }

  const abc = element.textContent.trim();

  if (!abc) {
    throw new Error(`Embedded ABC element is empty: ${elementId}`);
  }

  return abc;
}

/*
 * Keep the active playback cursor inside a comfortable viewport margin.
 * Vertical movement scrolls the page; horizontal movement scrolls only the
 * score's paper container when that score is wider than the available space.
 */
function keepCursorVisible(cursor, paper) {
  const cursorRect = cursor.getBoundingClientRect();
  const viewportTop = 80;
  const viewportBottom = window.innerHeight - 90;

  if (cursorRect.top < viewportTop) {
    window.scrollBy({
      top: cursorRect.top - viewportTop - 20,
      behavior: "smooth"
    });
  } else if (cursorRect.bottom > viewportBottom) {
    window.scrollBy({
      top: cursorRect.bottom - viewportBottom + 20,
      behavior: "smooth"
    });
  }

  const paperRect = paper.getBoundingClientRect();
  const horizontalMargin = 48;
  const visibleLeft = Math.max(paperRect.left, 0) + horizontalMargin;
  const visibleRight = Math.min(paperRect.right, window.innerWidth) - horizontalMargin;

  if (cursorRect.left < visibleLeft) {
    paper.scrollBy({
      left: cursorRect.left - visibleLeft - 24,
      behavior: "smooth"
    });
  } else if (cursorRect.right > visibleRight) {
    paper.scrollBy({
      left: cursorRect.right - visibleRight + 24,
      behavior: "smooth"
    });
  }
}

/*
 * Create one red playback cursor for each rendered score.
 */
function createCursorControl(paperId) {
  let cursor = null;
  const paper = document.getElementById(paperId);

  return {
    onStart() {
      const svg = document.querySelector(`#${paperId} svg`);
      if (!svg) return;

      // Remove any stale cursor from an earlier playback run.
      svg.querySelectorAll(".abcjs-cursor").forEach((oldCursor) => {
        oldCursor.remove();
      });

      cursor = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );

      cursor.setAttribute("class", "abcjs-cursor");
      cursor.setAttribute("stroke", "#9b1f31");
      cursor.setAttribute("stroke-width", "2");
      cursor.setAttribute("pointer-events", "none");
      svg.appendChild(cursor);
    },

    onEvent(event) {
      // measureStart=true is valid for the first note of a measure.
      if (!cursor || !event || event.left == null) return;

      cursor.setAttribute("x1", String(event.left - 2));
      cursor.setAttribute("x2", String(event.left - 2));
      cursor.setAttribute("y1", String(event.top));
      cursor.setAttribute("y2", String(event.top + event.height));

      if (paper) {
        keepCursorVisible(cursor, paper);
      }
    },

    onFinished() {
      if (!cursor) return;

      cursor.remove();
      cursor = null;
    }
  };
}

/*
 * Render and prepare one embedded work. Per-tune %soundfont and %reverb
 * directives in the ABC are applied automatically by the portable library.
 */
async function prepareWork(work) {
  const paperId = `${work.key}-paper`;
  const audioId = `${work.key}-audio`;
  const status = document.getElementById(`${work.key}-status`);

  try {
    status.classList.remove("error");
    status.textContent = "Rendering notation and preparing audio…";

    const abc = getEmbeddedAbc(work.abcElementId);

    const rendered = ABCJS.renderAbc(
      paperId,
      abc,
      renderParams
    );

    if (!Array.isArray(rendered) || rendered.length !== 1) {
      throw new Error("The ABC did not produce exactly one rendered score.");
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

    controllers.set(work.key, controller);

    /*
     * Clicking a rendered score toggles that score between playback and
     * pause. The cursor remains visible while paused so the resume position is
     * obvious.
     */
    const paper = document.getElementById(paperId);
    if (paper && !paper.dataset.clickStopsPlayback) {
      paper.dataset.clickStopsPlayback = "true";
      paper.tabIndex = 0;
      paper.setAttribute(
        "title",
        "Click the notation to pause or resume this score"
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
    console.error(`Could not prepare ${work.key}:`, error);
    status.classList.add("error");
    status.textContent =
      error && error.message ? error.message : String(error);
  }
}

/*
 * Prepare the scores sequentially to reduce simultaneous sample and reverb
 * downloads while keeping all three players available afterward.
 */
async function initialize() {
  if (!window.ABCJS || !ABCJS.eskinConfig) {
    throw new Error("abcjs-eskin-portable did not load.");
  }

  applyPortableDefaults();
  installTableOfContentsButtons();

  for (const work of works) {
    await prepareWork(work);
  }
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
