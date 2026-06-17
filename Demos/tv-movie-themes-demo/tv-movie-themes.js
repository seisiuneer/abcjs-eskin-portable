"use strict";

const works = Array.from(document.querySelectorAll("article.score-panel[data-key]"), (panel) => ({
  key: panel.dataset.key,
  abcElementId: `${panel.dataset.key}-abc`
}));

const controllers = new Map();

function togglePlayback(controller) {
  if (!controller) return Promise.resolve();
  return Promise.resolve(controller.play()).catch((error) => {
    console.error("Could not toggle playback:", error);
  });
}

function stopAllPlayback() {
  controllers.forEach((controller) => {
    if (controller && typeof controller.pause === "function") {
      controller.pause();
    }
  });
}

function installTableOfContentsButtons() {
  document.querySelectorAll(".back-to-toc").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      stopAllPlayback();

      window.scrollTo(0, 0);
      history.replaceState(null, "", "#table-of-contents");
    });
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

const synthOptions = { program: 0, chordsOff: false };

function applyPortableDefaults() {
  ABCJS.eskinConfig.setIrishRolls(true);
  ABCJS.eskinConfig.setCustomGMSounds(true);
  ABCJS.eskinConfig.setPlayerDefaults(100, false);
}

function getEmbeddedAbc(elementId) {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Embedded ABC element not found: ${elementId}`);
  const abc = element.textContent.trim();
  if (!abc) throw new Error(`Embedded ABC element is empty: ${elementId}`);
  return abc;
}

function keepCursorVisible(cursor, paper) {
  const cursorRect = cursor.getBoundingClientRect();
  const viewportTop = 76;
  const viewportBottom = window.innerHeight - 88;

  if (cursorRect.top < viewportTop) {
    window.scrollBy({ top: cursorRect.top - viewportTop - 18, behavior: "smooth" });
  } else if (cursorRect.bottom > viewportBottom) {
    window.scrollBy({ top: cursorRect.bottom - viewportBottom + 18, behavior: "smooth" });
  }

  const paperRect = paper.getBoundingClientRect();
  const horizontalMargin = 46;
  const visibleLeft = Math.max(paperRect.left, 0) + horizontalMargin;
  const visibleRight = Math.min(paperRect.right, window.innerWidth) - horizontalMargin;

  if (cursorRect.left < visibleLeft) {
    paper.scrollBy({ left: cursorRect.left - visibleLeft - 24, behavior: "smooth" });
  } else if (cursorRect.right > visibleRight) {
    paper.scrollBy({ left: cursorRect.right - visibleRight + 24, behavior: "smooth" });
  }
}

function createCursorControl(paperId) {
  let cursor = null;
  const paper = document.getElementById(paperId);

  return {
    onStart() {
      const svg = document.querySelector(`#${paperId} svg`);
      if (!svg) return;
      svg.querySelectorAll(".abcjs-cursor").forEach((oldCursor) => oldCursor.remove());
      cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
      cursor.setAttribute("class", "abcjs-cursor");
      cursor.setAttribute("stroke", "#ef3e36");
      cursor.setAttribute("stroke-width", "3");
      cursor.setAttribute("pointer-events", "none");
      svg.appendChild(cursor);
    },
    onEvent(event) {
      if (!cursor || !event || event.left == null) return;
      cursor.setAttribute("x1", String(event.left - 2));
      cursor.setAttribute("x2", String(event.left - 2));
      cursor.setAttribute("y1", String(event.top));
      cursor.setAttribute("y2", String(event.top + event.height));
      if (paper) keepCursorVisible(cursor, paper);
    },
    onFinished() {
      if (!cursor) return;
      cursor.remove();
      cursor = null;
    }
  };
}

async function prepareWork(work) {
  const paperId = `${work.key}-paper`;
  const audioId = `${work.key}-audio`;
  const status = document.getElementById(`${work.key}-status`);

  try {
    status.classList.remove("error");
    status.textContent = "Rendering notation and preparing audio…";
    const rendered = ABCJS.renderAbc(paperId, getEmbeddedAbc(work.abcElementId), renderParams);
    if (!Array.isArray(rendered) || rendered.length !== 1) {
      throw new Error("The ABC did not produce exactly one rendered score.");
    }

    const controller = new ABCJS.synth.SynthController();
    controller.load(`#${audioId}`, createCursorControl(paperId), playerOptions);
    await controller.setTune(rendered[0], false, synthOptions);
    controllers.set(work.key, controller);

    const paper = document.getElementById(paperId);
    if (paper && !paper.dataset.playbackToggleReady) {
      paper.dataset.playbackToggleReady = "true";
      paper.tabIndex = 0;
      paper.title = "Click the notation to pause or resume this theme";
      paper.addEventListener("click", () => void togglePlayback(controller));
      paper.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void togglePlayback(controller);
        }
      });
    }

    status.textContent = "Ready. Use the controls above; click the notation to pause or resume.";
  } catch (error) {
    console.error(`Could not prepare ${work.key}:`, error);
    status.classList.add("error");
    status.textContent = error && error.message ? error.message : String(error);
  }
}

async function initialize() {
  if (!window.ABCJS || !ABCJS.eskinConfig) throw new Error("abcjs-eskin-portable did not load.");
  applyPortableDefaults();
  for (const work of works) await prepareWork(work);
}

window.addEventListener("DOMContentLoaded", () => {
  installTableOfContentsButtons();
  initialize().catch((error) => {
    console.error(error);
    document.querySelectorAll(".status").forEach((element) => {
      element.classList.add("error");
      element.textContent = error && error.message ? error.message : String(error);
    });
  });
});
