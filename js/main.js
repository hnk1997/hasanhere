/* ------------------------------------------------------------
   Hasan Nawaz — homepage behaviour
   ------------------------------------------------------------ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile menu ----------
     Full-screen overlay, Apple-style — lock page scroll behind it
     while it's open, same as the sheet apple.com's menu opens into. */
  var burger = document.getElementById('burger');
  var links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- hero headline rotator ----------
     Sequential, non-overlapping ticker: the outgoing line fully drifts
     up and fades out first; only once that finishes does the incoming
     line start drifting up from below and fading in. The two phases
     never run at the same time, so there's no moment with both lines
     partially visible — same spring easing throughout (--spring-fade /
     .hero__line in style.css) for a smooth, single-direction feel. */
  var lines = Array.prototype.slice.call(document.querySelectorAll('.hero__line'));
  var heroEl = document.querySelector('.hero');
  var PHASE_MS = 450;   // matches the .hero__line transition duration
  var DWELL_MS = 3840;  // full cycle: exit, then enter, then hold (~40% longer hold than before)

  /* ---------- custom hero cursor ----------
     Each rotator line can carry data-cursor="name", trailing a custom
     illustration alongside the real pointer while that line is
     showing (e.g. a Burj Khalifa silhouette for the UAE line, Cannes
     Lions for the award line) — the system cursor itself is left
     alone, this just rides next to it. A tracked, absolutely-
     positioned element rather than CSS cursor:url() for two reasons:
     browsers cap native cursor bitmaps around ~128px and silently
     fall back to the arrow above that, and CSS cursor swaps are
     always an instant cut, never a transition. Two stacked <img>
     layers swap between illustrations the same way the headline swaps
     lines: the outgoing image shrinks to nothing first, then the
     incoming one grows in from nothing — sequential, not overlapping
     — each phase lasting PHASE_MS so both animations stay in step.
     Position is re-checked against .hero's live bounding box on every
     move, so it never lingers past the section's actual edge
     (including once the page has scrolled). */
  if (heroEl && lines.length) {
    var cursorEl = document.createElement('div');
    cursorEl.className = 'hero-cursor';
    var layerA = document.createElement('img');
    var layerB = document.createElement('img');
    layerA.className = 'hero-cursor__img is-active';
    layerB.className = 'hero-cursor__img';
    cursorEl.appendChild(layerA);
    cursorEl.appendChild(layerB);
    document.body.appendChild(cursorEl);

    var frontLayer = layerA;
    var backLayer = layerB;
    var currentName = null;
    var swapTimer = null;

    var setCursorImage = function (name) {
      if (!name || name === currentName) return;
      currentName = name;
      clearTimeout(swapTimer);
      // phase 1: shrink the currently-shown image away to nothing
      frontLayer.classList.remove('is-active');
      swapTimer = setTimeout(function () {
        // phase 2: only now load the next image in and grow it up —
        // never both layers animating at once
        backLayer.src = 'assets/img/cursor-' + name + '.png';
        backLayer.classList.add('is-active');
        var tmp = frontLayer; frontLayer = backLayer; backLayer = tmp;
      }, PHASE_MS);
    };

    var applyCursor = function (line) {
      if (line) setCursorImage(line.getAttribute('data-cursor'));
    };

    var pointerInsideHero = false;
    var positionCursor = function (x, y) {
      cursorEl.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    };
    document.addEventListener('mousemove', function (e) {
      var rect = heroEl.getBoundingClientRect();
      var inside = e.clientY >= rect.top && e.clientY <= rect.bottom &&
        e.clientX >= rect.left && e.clientX <= rect.right;
      if (inside !== pointerInsideHero) {
        pointerInsideHero = inside;
        cursorEl.classList.toggle('is-visible', inside);
      }
      if (inside) positionCursor(e.clientX, e.clientY);
    }, { passive: true });
    // scrolling can move .hero out from under a pointer that never
    // itself moved — re-check on scroll so the cursor doesn't linger.
    window.addEventListener('scroll', function () {
      if (!pointerInsideHero) return;
      var rect = heroEl.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        pointerInsideHero = false;
        cursorEl.classList.remove('is-visible');
      }
    }, { passive: true });

    applyCursor(lines[0]);
  }

  if (lines.length > 1 && !reduced) {
    var i = 0;
    setInterval(function () {
      var outgoing = lines[i];
      var incomingIdx = (i + 1) % lines.length;
      outgoing.classList.remove('is-active');
      outgoing.classList.add('is-leaving');
      // fire the cursor's own shrink-out in the same tick as the text's,
      // not after — its internal PHASE_MS delay before growing the new
      // image in then lines up with the text's PHASE_MS-delayed enter.
      if (heroEl) applyCursor(lines[incomingIdx]);

      setTimeout(function () {
        outgoing.classList.remove('is-leaving');
        i = incomingIdx;
        lines[i].classList.add('is-active');
      }, PHASE_MS);
    }, DWELL_MS);
  }

  /* ---------- Apple-style appear on page load ---------- */
  var hero = document.querySelector('.hero');
  if (hero) {
    if (reduced) {
      hero.classList.add('is-loaded');
    } else {
      // A short setTimeout (rather than requestAnimationFrame) so the
      // trigger still fires promptly even if the tab isn't foregrounded
      // yet when this script runs — rAF callbacks are paused in that case.
      setTimeout(function () {
        hero.classList.add('is-loaded');
      }, 30);
    }
  }

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduced) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  }

  /* ---------- animated stat counters ---------- */
  var nums = document.querySelectorAll('.stat__num[data-count], .cs-statcard__num[data-count]');
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1000;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = prefix + (0).toFixed(decimals) + suffix;
    requestAnimationFrame(frame);
  }

  if (nums.length) {
    if (!('IntersectionObserver' in window) || reduced) {
      // leave the static markup value in place
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      Array.prototype.forEach.call(nums, function (el) { cio.observe(el); });
    }
  }

  /* ---------- click email to copy, instead of opening a mail client ---------- */
  var emailLinks = document.querySelectorAll('.js-copy-email');
  Array.prototype.forEach.call(emailLinks, function (el) {
    var label = el.querySelector('.js-copy-email-label');
    var originalLabel = label ? label.textContent : null;
    var originalAriaLabel = el.getAttribute('aria-label');
    var resetTimer = null;
    // icon-only links (e.g. the footer mail icon) have no text label to
    // swap, so a small "Copied" tooltip is created on demand instead —
    // otherwise the click looks like it did nothing.
    var tip = null;

    el.addEventListener('click', function (e) {
      var email = el.getAttribute('data-email');
      if (!email || !navigator.clipboard) return; // fall back to mailto:
      e.preventDefault();
      navigator.clipboard.writeText(email).then(function () {
        clearTimeout(resetTimer);
        if (label) {
          label.textContent = 'Copied';
        } else {
          if (!tip) {
            tip = document.createElement('span');
            tip.className = 'js-copy-email__tip';
            tip.textContent = 'Copied';
            el.appendChild(tip);
          }
        }
        el.setAttribute('aria-label', 'Email copied');
        el.classList.add('is-copied');
        resetTimer = setTimeout(function () {
          if (label) label.textContent = originalLabel;
          if (originalAriaLabel) el.setAttribute('aria-label', originalAriaLabel);
          else el.removeAttribute('aria-label');
          el.classList.remove('is-copied');
        }, 1800);
      });
    });
  });

  /* ---------- rotate the nav avatar + favicon through a few expressions,
     swapping to a dedicated hover frame (avatar only, not the tab
     favicon — there's no such thing as a "hovered" browser tab) ---------- */
  var avatarFrames = [
    'assets/img/headshot.webp',
    'assets/img/headshot-2.webp',
    'assets/img/headshot-3.webp'
  ];
  var avatarHoverFrame = 'assets/img/headshot-hover.webp';
  var avatarEls = document.querySelectorAll('.logo__avatar');
  var faviconEl = document.querySelector('link[rel="icon"]');
  if (avatarFrames.length > 1 && (avatarEls.length || faviconEl)) {
    var frameIndex = 0;
    var isHovering = false;
    var applyFrame = function () {
      if (isHovering) return;
      var next = avatarFrames[frameIndex];
      Array.prototype.forEach.call(avatarEls, function (el) { el.src = next; });
      if (faviconEl) faviconEl.href = next;
    };
    setInterval(function () {
      frameIndex = (frameIndex + 1) % avatarFrames.length;
      applyFrame();
    }, 10000);

    Array.prototype.forEach.call(avatarEls, function (el) {
      // hover target is the whole logo link (avatar + wordmark), not
      // just the small 36px image, so the swap triggers anywhere over
      // the name too.
      var hoverTarget = el.closest('.logo') || el;
      hoverTarget.addEventListener('mouseenter', function () {
        isHovering = true;
        el.src = avatarHoverFrame;
      });
      hoverTarget.addEventListener('mouseleave', function () {
        isHovering = false;
        applyFrame();
      });
    });
  }

  /* ---------- idle "u there?" peek ----------
     After 20s with no mouse/keyboard/scroll/touch activity, a small
     character peeks up from the bottom-center edge of the screen;
     any activity sends it back down and restarts the countdown. Built
     entirely here (not in the HTML) so it applies site-wide off one
     shared script rather than needing markup on every page. */
  var idlePeek = document.createElement('div');
  idlePeek.className = 'idle-peek';
  var idlePeekImg = document.createElement('img');
  idlePeekImg.src = 'assets/img/idle-peek.png';
  idlePeekImg.alt = '';
  idlePeekImg.setAttribute('aria-hidden', 'true');
  idlePeek.appendChild(idlePeekImg);
  document.body.appendChild(idlePeek);

  // don't pop up over someone actually watching a case-study video —
  // "idle" (no mouse/keyboard) is the normal state while watching,
  // so suppress based on whether any video embed is on screen rather
  // than on activity alone.
  var videosInView = 0;
  var videoEls = document.querySelectorAll('.cs-video-embed, .cs-video');
  if (videoEls.length && 'IntersectionObserver' in window) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        videosInView += entry.isIntersecting ? 1 : -1;
      });
      videosInView = Math.max(0, videosInView);
      if (videosInView) idlePeek.classList.remove('is-visible');
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(videoEls, function (el) { videoObserver.observe(el); });
  }

  var IDLE_MS = 20000;
  var idleTimer = null;
  var resetIdleTimer = function () {
    idlePeek.classList.remove('is-visible');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      if (!videosInView) idlePeek.classList.add('is-visible');
    }, IDLE_MS);
  };
  ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(function (evt) {
    document.addEventListener(evt, resetIdleTimer, { passive: true });
  });
  resetIdleTimer();
})();
