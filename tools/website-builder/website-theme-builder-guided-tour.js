/**
 * website-theme-builder-guided-tour.js
 * Guided tour for the abcjs-eskin Website Theme Builder.
 *
 * MIT License
 * Copyright (c) 2026 Michael Eskin
 */
(function () {
  "use strict";

  var api = null;
  var tourRunning = false;
  var overlay = null;
  var card = null;
  var arrowLayer = null;
  var highlightedElement = null;
  var activeLayoutHandler = null;
  var activeLayoutFrame = 0;

  function isDesktopBrowser() {
    if (!window.matchMedia) return true;
    return window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(max-width: 760px)").matches;
  }

  function updateLauncherVisibility() {
    var button = document.getElementById("theme-builder-guided-tour-launch-button");
    if (!button) return;
    button.style.display = isDesktopBrowser() ? "block" : "none";
  }

  function waitMs(milliseconds) {
    return new Promise(function (resolve) {
      setTimeout(resolve, milliseconds);
    });
  }

  async function waitForReady(timeoutMs) {
    var started = Date.now();
    while (Date.now() - started < timeoutMs) {
      if (api && typeof api.isReady === "function" && api.isReady()) return true;
      await waitMs(40);
    }
    return false;
  }

  function injectStyles() {
    if (document.getElementById("theme-builder-guided-tour-styles")) return;

    var style = document.createElement("style");
    style.id = "theme-builder-guided-tour-styles";
    style.textContent = `
      .theme-builder-tour-overlay {
        position: fixed;
        inset: 0;
        z-index: 2500;
        background: rgba(0,0,0,.34);
        pointer-events: none;
      }

      .theme-builder-tour-card {
        position: fixed;
        z-index: 2147483646;
        max-width: calc(100vw - 24px);
        max-height: calc(100vh - 24px);
        overflow: auto;
        padding: 24px;
        color: #17241c;
        background: #fff;
        border: 1px solid #b9cabf;
        border-radius: 5px;
        box-shadow: 0 12px 36px rgba(0,0,0,.30);
        font: 16px/1.48 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      }

      .theme-builder-tour-card h2 {
        margin: 0 0 14px;
        color: #0d4c2f;
        font-size: 24px;
        line-height: 1.2;
      }

      .theme-builder-tour-card p {
        margin: 0 0 12px;
      }

      .theme-builder-tour-card p:last-of-type {
        margin-bottom: 0;
      }

      .theme-builder-tour-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid #d7e1da;
      }

      .theme-builder-tour-count {
        color: #5d6c63;
        white-space: nowrap;
      }

      .theme-builder-tour-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        flex-wrap: wrap;
      }

      .theme-builder-tour-buttons button {
        min-width: 104px;
        padding: 9px 15px;
        color: #fff;
        background: #176b43;
        border: 1px solid #0d4c2f;
        border-radius: 6px;
        font-weight: 700;
        cursor: pointer;
      }

      .theme-builder-tour-buttons button:hover {
        background: #0d4c2f;
      }

      .theme-builder-tour-highlight {
        position: relative !important;
        z-index: 2147483644 !important;
        outline: 4px solid #ffd54f !important;
        outline-offset: 4px !important;
        box-shadow: 0 0 0 9999px rgba(0,0,0,.05) !important;
      }

      .theme-builder-tour-arrow-layer {
        position: fixed;
        inset: 0;
        z-index: 2147483645;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        overflow: visible;
      }

      .theme-builder-tour-arrow-path {
        fill: none;
        stroke: #d32f2f;
        stroke-width: 4;
        stroke-linecap: round;
      }

      @media (max-height: 650px) {
        .theme-builder-tour-card {
          padding: 18px 20px;
          font-size: 15px;
        }

        .theme-builder-tour-card h2 {
          margin-bottom: 10px;
          font-size: 21px;
        }

        .theme-builder-tour-footer {
          margin-top: 14px;
          padding-top: 12px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function clearUI() {
    if (activeLayoutHandler) {
      window.removeEventListener("resize", activeLayoutHandler);
      window.removeEventListener("scroll", activeLayoutHandler, true);
      activeLayoutHandler = null;
    }

    if (activeLayoutFrame) {
      cancelAnimationFrame(activeLayoutFrame);
      activeLayoutFrame = 0;
    }

    if (highlightedElement) {
      highlightedElement.classList.remove("theme-builder-tour-highlight");
      highlightedElement = null;
    }

    if (arrowLayer) {
      arrowLayer.remove();
      arrowLayer = null;
    }

    if (card) {
      card.remove();
      card = null;
    }

    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  function resolveTarget(step) {
    if (typeof step.target === "function") return step.target();
    if (step.selector) return document.querySelector(step.selector);
    return null;
  }

  async function prepareTarget(step) {
    if (typeof step.beforeTarget === "function") {
      await step.beforeTarget();
      await waitMs(80);
    }

    if (!step.selector && typeof step.target !== "function") return null;

    var target = resolveTarget(step);
    if (!target) return null;

    try {
      target.scrollIntoView({
        behavior: "auto",
        block: step.scrollBlock || "center",
        inline: "nearest"
      });
    } catch (error) {
      target.scrollIntoView();
    }

    await new Promise(function (resolve) {
      requestAnimationFrame(function () {
        requestAnimationFrame(resolve);
      });
    });

    return resolveTarget(step) || target;
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(value, maximum));
  }

  function visibleRect(element) {
    if (!element) return null;

    var rect = element.getBoundingClientRect();
    var left = clamp(rect.left, 0, window.innerWidth);
    var right = clamp(rect.right, 0, window.innerWidth);
    var top = clamp(rect.top, 0, window.innerHeight);
    var bottom = clamp(rect.bottom, 0, window.innerHeight);

    if (right <= left || bottom <= top) return null;

    return {
      left: left,
      right: right,
      top: top,
      bottom: bottom,
      width: right - left,
      height: bottom - top,
      centerX: left + (right - left) / 2,
      centerY: top + (bottom - top) / 2
    };
  }

  function choosePlacement(targetRect, width, height) {
    var margin = 12;
    var gap = 18;
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;

    if (!targetRect) {
      return {
        left: clamp(
          (viewportWidth - width) / 2,
          margin,
          Math.max(margin, viewportWidth - width - margin)
        ),
        top: clamp(
          20,
          margin,
          Math.max(margin, viewportHeight - height - margin)
        )
      };
    }

    var candidates = [
      { left: targetRect.right + gap, top: targetRect.centerY - height / 2 },
      { left: targetRect.left - width - gap, top: targetRect.centerY - height / 2 },
      { left: targetRect.centerX - width / 2, top: targetRect.bottom + gap },
      { left: targetRect.centerX - width / 2, top: targetRect.top - height - gap }
    ];

    function overflow(candidate) {
      return Math.max(0, margin - candidate.left) +
        Math.max(0, candidate.left + width + margin - viewportWidth) +
        Math.max(0, margin - candidate.top) +
        Math.max(0, candidate.top + height + margin - viewportHeight);
    }

    candidates.sort(function (a, b) {
      return overflow(a) - overflow(b);
    });

    var selected = candidates[0];

    return {
      left: clamp(
        selected.left,
        margin,
        Math.max(margin, viewportWidth - width - margin)
      ),
      top: clamp(
        selected.top,
        margin,
        Math.max(margin, viewportHeight - height - margin)
      )
    };
  }

  function drawArrow(target) {
    if (arrowLayer) {
      arrowLayer.remove();
      arrowLayer = null;
    }

    if (!card || !target) return;

    var targetRect = visibleRect(target);
    if (!targetRect) return;

    var cardRect = card.getBoundingClientRect();
    var cardCenterX = cardRect.left + cardRect.width / 2;
    var cardCenterY = cardRect.top + cardRect.height / 2;
    var endX = clamp(cardCenterX, targetRect.left + 6, targetRect.right - 6);
    var endY = clamp(cardCenterY, targetRect.top + 6, targetRect.bottom - 6);
    var differenceX = endX - cardCenterX;
    var differenceY = endY - cardCenterY;
    var startX;
    var startY;

    if (Math.abs(differenceX) > Math.abs(differenceY)) {
      startX = differenceX >= 0 ? cardRect.right : cardRect.left;
      startY = clamp(endY, cardRect.top + 18, cardRect.bottom - 18);
    } else {
      startX = clamp(endX, cardRect.left + 18, cardRect.right - 18);
      startY = differenceY >= 0 ? cardRect.bottom : cardRect.top;
    }

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "theme-builder-tour-arrow-layer");
    svg.setAttribute(
      "viewBox",
      "0 0 " + window.innerWidth + " " + window.innerHeight
    );

    var definitions = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    var marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute("id", "themeBuilderTourArrowHead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "10");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");

    var head = document.createElementNS("http://www.w3.org/2000/svg", "path");
    head.setAttribute("d", "M0,0 L0,6 L9,3 z");
    head.setAttribute("fill", "#d32f2f");
    marker.appendChild(head);
    definitions.appendChild(marker);
    svg.appendChild(definitions);

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("class", "theme-builder-tour-arrow-path");

    var controlX = Math.abs(differenceX) > Math.abs(differenceY)
      ? (startX + endX) / 2
      : startX;
    var controlY = Math.abs(differenceX) > Math.abs(differenceY)
      ? startY
      : (startY + endY) / 2;

    path.setAttribute(
      "d",
      "M " + startX + " " + startY +
      " Q " + controlX + " " + controlY +
      ", " + endX + " " + endY
    );
    path.setAttribute("marker-end", "url(#themeBuilderTourArrowHead)");
    svg.appendChild(path);

    document.body.appendChild(svg);
    arrowLayer = svg;
  }

  function positionUI(step, target) {
    if (!card) return;

    var width = Math.min(step.width || 520, window.innerWidth - 24);
    card.style.width = width + "px";

    var height = Math.min(
      card.offsetHeight,
      Math.max(120, window.innerHeight - 24)
    );

    var placement = choosePlacement(visibleRect(target), width, height);
    card.style.left = placement.left + "px";
    card.style.top = placement.top + "px";
    drawArrow(target);
  }

  function installLiveLayout(step, target) {
    activeLayoutHandler = function () {
      if (activeLayoutFrame) cancelAnimationFrame(activeLayoutFrame);

      activeLayoutFrame = requestAnimationFrame(function () {
        activeLayoutFrame = 0;
        positionUI(step, target);
      });
    };

    window.addEventListener("resize", activeLayoutHandler);
    window.addEventListener("scroll", activeLayoutHandler, true);
  }

  function showStep(step, index, total) {
    return new Promise(async function (resolve) {
      clearUI();
      var target = await prepareTarget(step);

      overlay = document.createElement("div");
      overlay.className = "theme-builder-tour-overlay";
      document.body.appendChild(overlay);

      if (target) {
        target.classList.add("theme-builder-tour-highlight");
        highlightedElement = target;
      }

      card = document.createElement("div");
      card.className = "theme-builder-tour-card";
      card.innerHTML =
        "<h2>" + step.title + "</h2>" +
        step.body +
        '<div class="theme-builder-tour-footer">' +
          '<div class="theme-builder-tour-count">' +
            (index + 1) + " of " + total +
          "</div>" +
          '<div class="theme-builder-tour-buttons">' +
            '<button type="button" data-action="close">Close Tour</button>' +
            '<button type="button" data-action="next">' +
              (step.finalActionLabel || (index === total - 1 ? "Finish" : "Next")) +
            "</button>" +
          "</div>" +
        "</div>";

      document.body.appendChild(card);
      positionUI(step, target);
      installLiveLayout(step, target);

      card.querySelector('[data-action="close"]').addEventListener("click", function () {
        resolve("close");
      });

      card.querySelector('[data-action="next"]').addEventListener("click", function () {
        if (typeof step.onNextClick === "function") {
          step.onNextClick();
        }

        resolve(index === total - 1 ? "done" : "next");
      });
    });
  }

  function confirmTourStart() {
    return new Promise(function (resolve) {
      clearUI();

      overlay = document.createElement("div");
      overlay.className = "theme-builder-tour-overlay";
      document.body.appendChild(overlay);

      card = document.createElement("div");
      card.className = "theme-builder-tour-card";
      card.style.width = Math.min(620, window.innerWidth - 24) + "px";
      card.innerHTML =
        "<h2>Start the Guided Tour?</h2>" +
        "<p>Starting the Guided Tour will replace the current theme settings with an example theme.</p>" +
        "<p><strong>Save your current theme before continuing.</strong></p>" +
        '<div class="theme-builder-tour-footer">' +
          '<div class="theme-builder-tour-count"></div>' +
          '<div class="theme-builder-tour-buttons">' +
            '<button type="button" data-action="cancel">Cancel</button>' +
            '<button type="button" data-action="start">Start Tour</button>' +
          "</div>" +
        "</div>";

      document.body.appendChild(card);

      var width = Math.min(620, window.innerWidth - 24);
      var height = Math.min(card.offsetHeight, window.innerHeight - 24);
      var placement = choosePlacement(null, width, height);
      card.style.left = placement.left + "px";
      card.style.top = placement.top + "px";

      card.querySelector('[data-action="cancel"]').addEventListener("click", function () {
        resolve(false);
      });

      card.querySelector('[data-action="start"]').addEventListener("click", function () {
        resolve(true);
      });
    });
  }

  function steps() {
    return [
      {
        title: "1. Welcome to the Guided Tour",
        width: 610,
        body:
          "<p>This tour shows how to create, preview, and save a custom theme for the abcjs-eskin Website Builder.</p>" +
          "<p>You will start with a built-in theme and make a few simple changes that appear immediately in the preview.</p>",
        afterNext: async function () {
          api.resetToDefaultTheme();
          await waitMs(500);
        }
      },
      {
        title: "2. Start with a Built-In Theme",
        selector: ".theme-builder-built-in-actions",
        width: 610,
        body:
          "<p>We’ll use <strong>Traditional Irish Music</strong> as a starting point.</p>" +
          "<p>Click <strong>Next</strong> and the tour will load it for you.</p>",
        afterNext: async function () {
          api.loadTraditionalIrishTheme();
          await waitMs(1000);
        }
      },
      {
        title: "3. Name Your Custom Theme",
        selector: "#theme_builder_field_name",
        width: 570,
        beforeTarget: function () {
          api.showTab("theme_builder_basic_panel");
        },
        body:
          "<p>Give the theme a name that will be easy to recognize later.</p>" +
          "<p>Click <strong>Next</strong> to name it <strong>My Custom Theme</strong>.</p>",
        afterNext: async function () {
          api.setThemeName("My Custom Theme");
          await waitMs(1000);
        }
      },
      {
        title: "4. Change the Header Colors",
        selector: ".theme-builder-gradient-swap-row",
        width: 610,
        beforeTarget: function () {
          api.showTab("theme_builder_layout_panel");
        },
        body:
          "<p>The two header color controls create the colored background at the top of the website.</p>" +
          "<p>Click <strong>Next</strong> to change it to a clear dark-to-light purple blend.</p>",
        afterNext: async function () {
          api.setHeaderColors("#2b0a4a", "#c99cff");
          await waitMs(1000);
        }
      },
      {
        title: "5. Change the Website Font",
        selector: "#theme_builder_field_font",
        width: 570,
        beforeTarget: function () {
          api.showTab("theme_builder_basic_panel");
        },
        body:
          "<p>The font choice changes the look of the website text.</p>" +
          "<p>Click <strong>Next</strong> to change it from Georgia to Palatino.</p>",
        afterNext: async function () {
          api.setHeaderFont('"Palatino Linotype", Palatino, "Book Antiqua", serif');
          await waitMs(1000);
        }
      },
      {
        title: "6. Change the Accent Color",
        selector: "#theme_builder_field_accent",
        width: 570,
        beforeTarget: function () {
          api.showTab("theme_builder_colors_panel");
        },
        body:
          "<p>The accent color is used for outlines and other small details.</p>" +
          "<p>Click <strong>Next</strong> to change it to gold.</p>",
        afterNext: async function () {
          api.setAccentColor("#e2ad3b");
          await waitMs(1000);
        }
      },
      {
        title: "7. Change the Header Ornament",
        selector: "#theme_builder_field_ornament",
        width: 580,
        beforeTarget: function () {
          api.showTab("theme_builder_basic_panel");
        },
        body:
          "<p>The ornament is the small symbol used in the header and between tunes.</p>" +
          "<p>Click <strong>Next</strong> to change the shamrock to a music note.</p>",
        afterNext: async function () {
          api.setOrnament("♪");
          await waitMs(1000);
        }
      },
      {
        title: "8. Turn Off the Header Graphics",
        selector: "#theme_builder_field_includeHeaderGraphics",
        width: 590,
        beforeTarget: function () {
          api.showTab("theme_builder_basic_panel");
        },
        body:
          "<p>The simple shapes in the header can be shown or hidden.</p>" +
          "<p>Click <strong>Next</strong> to turn them off.</p>",
        afterNext: async function () {
          api.setHeaderGraphics(false);
          await waitMs(1000);
        }
      },
      {
        title: "9. Open the Full Screen Preview",
        selector: "#theme-builder-full-preview-action",
        width: 610,
        body:
          "<p><strong>Full Screen Preview</strong> shows the theme in a larger sample website.</p>" +
          "<p>Click <strong>Next</strong> to open it. When you’re finished, click <strong>Return to the Theme Builder</strong>, then continue the tour here.</p>",
        onNextClick: function () {
          api.openFullScreenPreview();
        },
        afterNext: async function () {
          await waitMs(150);
        }
      },
      {
        title: "10. Save the Theme File",
        selector: "#theme-builder-save-action",
        width: 590,
        body:
          "<p><strong>Save Theme File</strong> saves your custom theme so you can use it again or share it.</p>" +
          "<p>Click <strong>Next</strong> to open the normal save dialog. After saving the file or cancelling the dialog, the tour will continue.</p>",
        afterNext: async function () {
          await api.saveThemeFile();
          await waitMs(120);
        }
      },
      {
        title: "11. How to Use the Theme in the Website Builder",
        width: 680,
        body:
          "<p>In the abcjs-eskin Website Builder, open the saved custom theme file using <strong>Import Custom Theme</strong> on the <strong>Manage Settings</strong> tab.</p>" +
          "<p>You can also drag and drop the theme file onto the <strong>Loaded Tunes</strong> box in the Website Builder.</p>" +
          "<p>This completes the Website Theme Builder tour.</p>"
      }
    ];
  }

  async function runTour() {
    if (tourRunning) return;
    if (!isDesktopBrowser()) return;

    api = window.WebsiteThemeBuilderGuidedTourAPI;
    if (!api) return;

    injectStyles();

    var ready = await waitForReady(5000);
    if (!ready) return;

    tourRunning = true;

    try {
      if (
        typeof api.hasCurrentThemeChanges === "function" &&
        api.hasCurrentThemeChanges()
      ) {
        var confirmed = await confirmTourStart();
        clearUI();

        if (!confirmed) return;
      }

      api.closeImageSampler();

      var tourSteps = steps();

      for (var index = 0; index < tourSteps.length; index++) {
        var step = tourSteps[index];
        var action = await showStep(step, index, tourSteps.length);
        clearUI();

        if (action === "next") {
          if (typeof step.afterNext === "function") {
            await step.afterNext();
          }
          continue;
        }

        if (action === "done") return;
        return;
      }
    } catch (error) {
      console.error(error);
      clearUI();
    } finally {
      tourRunning = false;
    }
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("#theme-builder-guided-tour-launch-button");
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();
    void runTour();
  });

  window.StartWebsiteThemeBuilderGuidedTour = runTour;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(updateLauncherVisibility, 0);
    }, { once: true });
  } else {
    setTimeout(updateLauncherVisibility, 0);
  }
})();
