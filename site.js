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
