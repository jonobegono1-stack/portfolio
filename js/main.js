/* ============================================================
   main.js — boot sequence, typewriter, scroll reveal, nav,
   command input handler, and CRT toggle.
   Progressive enhancement: all real content already lives in the
   DOM (index.html); this script only animates and adds interactivity.
   ============================================================ */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- small helpers ---------- */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function highlightBoot(text) {
    return escapeHtml(text)
      .replace(/\[ OK \]/g, '<span class="ok">[ OK ]</span>')
      .replace(/\[ UP \]/g, '<span class="up">[ UP ]</span>')
      .replace(/\[ FAIL \]/g, '<span class="fail">[ FAIL ]</span>')
      .replace(/\[ 16 agents ready \]/g, '<span class="ok">[ 16 agents ready ]</span>');
  }

  function highlightCmd(text) {
    var i = text.indexOf("$");
    if (i >= 0) {
      return '<span class="dim">' + escapeHtml(text.slice(0, i + 1)) + "</span>" +
             '<span class="cmd">' + escapeHtml(text.slice(i + 1)) + "</span>";
    }
    return escapeHtml(text);
  }

  function highlightPrompt(text) {
    var i = text.indexOf(" ");
    if (i > 0) {
      return '<span class="prompt">' + escapeHtml(text.slice(0, i)) + "</span> " +
             '<span class="cmd">' + escapeHtml(text.slice(i + 1)) + "</span>";
    }
    return '<span class="prompt">' + escapeHtml(text) + "</span>";
  }

  function makeCursor() {
    var c = document.createElement("span");
    c.className = "cursor";
    c.setAttribute("aria-hidden", "true");
    c.textContent = "\u25ae";
    return c;
  }

  /* ---------- typewriter ---------- */
  function typeLine(el, highlight, speed, done) {
    var text = el.getAttribute("data-text") || "";
    var finalHtml = highlight(text);

    if (reducedMotion) {
      el.innerHTML = finalHtml;
      if (done) done();
      return;
    }

    var cursor = makeCursor();
    el.textContent = "";
    el.appendChild(cursor);

    var i = 0;
    function tick() {
      i++;
      if (i <= text.length) {
        el.innerHTML = escapeHtml(text.slice(0, i));
        el.appendChild(cursor);
        setTimeout(tick, speed);
      } else {
        el.innerHTML = finalHtml;
        if (done) done();
      }
    }
    tick();
  }

  /* ---------- boot sequence ---------- */
  function runBoot() {
    var lines = Array.prototype.slice.call(document.querySelectorAll(".boot-line"));
    if (!lines.length) return;

    if (reducedMotion) {
      lines.forEach(function (line) {
        var kind = line.getAttribute("data-kind");
        var hl = kind === "cmd" ? highlightCmd : highlightBoot;
        line.innerHTML = hl(line.getAttribute("data-text") || "");
      });
      return;
    }

    var idx = 0;
    function next() {
      if (idx >= lines.length) return;
      var line = lines[idx];
      var kind = line.getAttribute("data-kind");
      var hl = kind === "cmd" ? highlightCmd : highlightBoot;
      idx++;
      typeLine(line, hl, 18, next);
    }
    setTimeout(next, 250);
  }

  /* ---------- scroll reveal + section prompt typing ---------- */
  function revealOnScroll() {
    var sections = Array.prototype.slice.call(document.querySelectorAll(".section"));

    function revealSection(section) {
      section.classList.add("in-view");
      var prompt = section.querySelector(".cmd-prompt");
      if (prompt && !prompt.getAttribute("data-typed")) {
        prompt.setAttribute("data-typed", "1");
        typeLine(prompt, highlightPrompt, 22);
      }
    }

    if (reducedMotion || !("IntersectionObserver" in window)) {
      sections.forEach(revealSection);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealSection(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- command bar ---------- */
  function initCommandBar() {
    var form = document.getElementById("command-form");
    var input = document.getElementById("command-input");
    var output = document.getElementById("command-output");
    if (!form || !input || !output) return;

    function write(text) {
      output.textContent = text || "";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var cmd = input.value;
      input.value = "";
      if (!window.resolveCommand) return;

      var res = window.resolveCommand(cmd);
      if (!res) return;

      if (res.clear) { write(""); return; }

      if (res.text !== undefined) {
        write("$ " + cmd + "\n" + res.text);
      }
      if (res.open) {
        window.open(res.open, "_blank", "noopener");
      }
      if (res.scrollTo) {
        var target = document.getElementById(res.scrollTo);
        if (target) {
          target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          target.removeAttribute("tabindex");
        }
      }
    });
  }

  /* ---------- nav links: echo command to status line ---------- */
  function initNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
    var output = document.getElementById("command-output");
    if (!output) return;
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        var cmd = link.getAttribute("data-cmd");
        if (cmd) output.textContent = "$ " + cmd;
      });
    });
  }

  /* ---------- CRT toggle ---------- */
  function initCRT() {
    var btn = document.getElementById("crt-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var on = document.body.classList.toggle("crt");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    runBoot();
    revealOnScroll();
    initCommandBar();
    initNav();
    initCRT();
  });
})();
