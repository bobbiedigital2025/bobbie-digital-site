/* Bobbie Digital — night skyline background + motion toggle (accessibility-first) */
(function () {
  var KEY = 'bd-motion';
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  var on = stored === null ? !reduce : stored === '1';

  /* Deterministic pseudo-random so every visitor sees the same city */
  var seed = 987654321;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

  function build() {
    var NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 1440 320');
    svg.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    svg.setAttribute('aria-hidden', 'true');
    var parts = '';
    var x = -30;
    while (x < 1470) {
      var w = 42 + rnd() * 92;
      var h = 55 + rnd() * 205;
      parts += '<rect x="' + x.toFixed(1) + '" y="' + (320 - h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="#0a1020"/>';
      var cols = Math.max(1, Math.floor(w / 24));
      var rows = Math.max(1, Math.floor(h / 30));
      for (var c = 0; c < cols; c++) {
        for (var r = 0; r < rows; r++) {
          if (rnd() < 0.3) {
            var green = rnd() < 0.5;
            parts += '<rect class="win ' + (green ? 'g' : 'o') + '" x="' + (x + 7 + c * (w - 12) / cols).toFixed(1) + '" y="' + (320 - h + 9 + r * (h - 18) / rows).toFixed(1) + '" width="5" height="7" rx="1" style="animation-delay:' + (rnd() * 6).toFixed(2) + 's;animation-duration:' + (3 + rnd() * 5).toFixed(2) + 's"/>';
          }
        }
      }
      if (rnd() < 0.3) {
        var ax = x + w / 2;
        parts += '<line x1="' + ax.toFixed(1) + '" y1="' + (320 - h).toFixed(1) + '" x2="' + ax.toFixed(1) + '" y2="' + (320 - h - 14 - rnd() * 14).toFixed(1) + '" stroke="#1a2340" stroke-width="2"/>';
      }
      x += w + 5 + rnd() * 24;
    }
    for (var i = 0; i < 12; i++) {
      var sx = 30 + i * 125 + rnd() * 40;
      parts += '<circle class="street ' + (i % 2 ? 'o' : 'g') + '" cx="' + sx.toFixed(1) + '" cy="313" r="3" style="animation-delay:' + (rnd() * 4).toFixed(2) + 's"/>';
    }
    /* flying traffic — futuristic air lanes (Bobbie, Oct 20) */
    var vcols = { gold: '#e3b94e', cyan: '#4fd8e8' };
    parts += '<defs>'
      + '<linearGradient id="trail-gold" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#e3b94e" stop-opacity=".85"/><stop offset="1" stop-color="#e3b94e" stop-opacity="0"/></linearGradient>'
      + '<linearGradient id="trail-cyan" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#4fd8e8" stop-opacity=".85"/><stop offset="1" stop-color="#4fd8e8" stop-opacity="0"/></linearGradient>'
      + '</defs>';
    var vehicles = [
      /* [altitude, scale, color, duration, delay, dir]  dir: 1 = left-to-right */
      [46, .5, 'cyan', 38, -4, 1],
      [68, .45, 'gold', 46, -21, -1],
      [84, .5, 'cyan', 42, -13, 1],
      [104, .85, 'cyan', 17, -6, 1],
      [120, .8, 'gold', 19, -2, -1],
      [138, .75, 'cyan', 16, -9, 1],
      [154, .7, 'gold', 21, -15, -1]
    ];
    for (var v = 0; v < vehicles.length; v++) {
      var V = vehicles[v];
      var col = vcols[V[2]];
      var sx = V[5] < 0 ? -V[1] : V[1];
      parts += '<g class="veh' + (V[5] < 0 ? ' rtl' : '') + '" style="animation-duration:' + V[3] + 's;animation-delay:' + V[4] + 's">'
        + '<g transform="translate(0 ' + V[0] + ') scale(' + sx + ' ' + V[1] + ')">'
        + '<rect x="-46" y="-1.2" width="42" height="2.4" fill="url(#trail-' + V[2] + ')"/>'
        + '<rect x="-6" y="-2.6" width="14" height="5.2" rx="2.6" fill="#0d1526" stroke="' + col + '" stroke-width="1"/>'
        + '<circle cx="2" cy="0" r="1.6" fill="' + col + '"/>'
        + '</g></g>';
    }
    svg.innerHTML = parts;
    var layer = document.createElement('div');
    layer.id = 'skyline';
    layer.appendChild(svg);
    document.body.appendChild(layer);
  }

  function apply() {
    document.body.classList.toggle('no-motion', !on);
    var b = document.getElementById('motion-toggle');
    if (b) {
      b.textContent = on ? '\u2726 Motion: ON' : '\u2726 Motion: OFF';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    build();
    apply();
    var b = document.getElementById('motion-toggle');
    if (b) b.addEventListener('click', function () {
      on = !on;
      try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (e) {}
      apply();
    });
  });
})();

// ---------- mobile menu ----------
const navBurger = document.getElementById('nav-burger');
if (navBurger) {
  const nav = document.querySelector('nav');
  navBurger.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    navBurger.setAttribute('aria-expanded', open ? 'true' : 'false');
    navBurger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  document.querySelectorAll('.nav-links a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      navBurger.setAttribute('aria-expanded', 'false');
    })
  );
}

// ---------- scroll guide car (flies with you; click = next section) ----------
(function () {
  var sections = [].slice.call(document.querySelectorAll('section'));
  var mobile = false;
  try { mobile = window.matchMedia('(max-width: 640px)').matches; } catch (e) {}
  if (sections.length < 2 || mobile) return;

  var guide = document.createElement('button');
  guide.id = 'guide-car';
  guide.type = 'button';
  guide.title = 'Fly to the next section';
  guide.setAttribute('aria-label', 'Scroll to the next section');
  guide.innerHTML =
    '<svg viewBox="0 0 120 40" width="96" height="32" aria-hidden="true">'
    + '<defs><linearGradient id="gtrail" x1="1" y1="0" x2="0" y2="0">'
    + '<stop offset="0" stop-color="#e3b94e" stop-opacity=".95"/>'
    + '<stop offset="1" stop-color="#e3b94e" stop-opacity="0"/></linearGradient></defs>'
    + '<rect x="6" y="17" width="72" height="5" rx="2.5" fill="url(#gtrail)"/>'
    + '<rect x="66" y="12" width="34" height="15" rx="7" fill="#0d1526" stroke="#e3b94e" stroke-width="1.6"/>'
    + '<circle cx="88" cy="19" r="4" fill="#e3b94e"/>'
    + '<circle cx="98" cy="25" r="2" fill="#4fd8e8"/>'
    + '</svg>';
  document.body.appendChild(guide);

  var ticking = false;
  function place() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    guide.style.transform = 'translateY(' + (p * 58).toFixed(2) + 'vh)';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(place); ticking = true; }
  }, { passive: true });
  place();

  guide.addEventListener('click', function () {
    var y = window.scrollY + 96; /* below the nav */
    var next = null;
    for (var i = 0; i < sections.length; i++) {
      var top = sections[i].getBoundingClientRect().top + window.scrollY;
      if (top > y) { next = sections[i]; break; }
    }
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ---------- flying-car cursor (desktop only, obeys the motion switch) ----------
(function () {
  var finePointer = false;
  try { finePointer = window.matchMedia('(pointer: fine)').matches; } catch (e) {}
  if (!finePointer) return;

  var car = document.createElement('div');
  car.id = 'cursor-car';
  car.setAttribute('aria-hidden', 'true');
  car.innerHTML =
    '<svg viewBox="0 0 62 24" width="56" height="22">'
    + '<defs><linearGradient id="ctrail" x1="1" y1="0" x2="0" y2="0">'
    + '<stop offset="0" stop-color="#e3b94e" stop-opacity=".9"/>'
    + '<stop offset="1" stop-color="#e3b94e" stop-opacity="0"/></linearGradient></defs>'
    + '<rect x="0" y="9.5" width="30" height="4" rx="2" fill="url(#ctrail)"/>'
    + '<rect x="26" y="5.5" width="28" height="12" rx="6" fill="#0d1526" stroke="#e3b94e" stroke-width="1.4"/>'
    + '<circle cx="45" cy="11" r="3.2" fill="#4fd8e8"/>'
    + '<ellipse cx="39" cy="19.5" rx="10" ry="1.6" fill="#e3b94e" opacity=".25"/>'
    + '</svg>';
  document.body.appendChild(car);

  var mx = -100, my = -100, cx = -100, cy = -100, angle = 0;
  function loop() {
    var px = cx, py = cy;
    cx += (mx - cx) * 0.35;
    cy += (my - cy) * 0.35;
    var dx = cx - px, dy = cy - py;
    if (Math.abs(dx) + Math.abs(dy) > 0.4) {
      var target = Math.atan2(dy, dx) * 180 / Math.PI;
      /* ease toward target along the shortest arc */
      var diff = ((target - angle + 540) % 360) - 180;
      angle += diff * 0.12;
    } else {
      angle += ((0 - angle + 540) % 360 - 180) * 0.04; /* settle level when parked */
    }
    car.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px) translate(-50%,-50%) rotate(' + angle.toFixed(1) + 'deg)';
    requestAnimationFrame(loop);
  }
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (cx < -50) { cx = mx; cy = my; }
    car.classList.add('vis');
  }, { passive: true });
  requestAnimationFrame(loop);

  var HOVER_SEL = 'a, button, input, textarea, select, label, [role="button"], summary';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest(HOVER_SEL)) car.classList.add('on');
  }, { passive: true });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest && e.target.closest(HOVER_SEL)) {
      var to = e.relatedTarget;
      if (!to || !to.closest || !to.closest(HOVER_SEL)) car.classList.remove('on');
    }
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', function () {
    car.classList.remove('vis');
  });
})();
