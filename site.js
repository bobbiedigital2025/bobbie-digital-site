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

// ---------- cursor chasers + picker (Bobbie, Oct 20: car / gear / robot / star / off) ----------
(function () {
  var finePointer = false;
  try { finePointer = window.matchMedia('(pointer: fine)').matches; } catch (e) {}
  if (!finePointer) return;

  var CHASERS = {
    car: {
      label: 'Flying Car',
      rotate: true,
      svg: '<svg viewBox="0 0 62 24" width="56" height="22">'
        + '<defs><linearGradient id="ctrail" x1="1" y1="0" x2="0" y2="0">'
        + '<stop offset="0" stop-color="#e3b94e" stop-opacity=".9"/>'
        + '<stop offset="1" stop-color="#e3b94e" stop-opacity="0"/></linearGradient></defs>'
        + '<rect x="0" y="9.5" width="30" height="4" rx="2" fill="url(#ctrail)"/>'
        + '<rect x="26" y="5.5" width="28" height="12" rx="6" fill="#0d1526" stroke="#e3b94e" stroke-width="1.4"/>'
        + '<circle cx="45" cy="11" r="3.2" fill="#4fd8e8"/>'
        + '<ellipse cx="39" cy="19.5" rx="10" ry="1.6" fill="#e3b94e" opacity=".25"/>'
        + '</svg>'
    },
    gear: {
      label: 'BoDiGi Gear',
      rotate: false, spin: true,
      svg: '<svg viewBox="0 0 40 40" width="34" height="34">'
        + '<g class="chaser-spin" style="transform-origin:20px 20px">'
        + '<path d="M20 6l2.2 3.6 4.1-1 1.2 4 4.2.8-.3 4.2 3.2 2.7-2.2 3.6 1.6 3.9-3.8 1.8-.1 4.3-4.2.7-1.8 3.9-3.9-1.9-3.4 2.6-2.9-3.2-4.2-.1.2-4.2-3.7-2.2 2.7-3.3-2.1-3.7 3.7-2.1-.4-4.2 4.2-.9 1.3-4 4.1 1.1z" fill="#0d1526" stroke="#e3b94e" stroke-width="1.6"/>'
        + '<circle cx="20" cy="20" r="7.5" fill="#0d1526" stroke="#e3b94e" stroke-width="1.4"/>'
        + '</g>'
        + '<path d="M21.5 12.5l-5 8h3.4l-1.4 7 5-8h-3.4z" fill="#ffd76a"/>'
        + '</svg>'
    },
    robot: {
      label: 'Robot',
      rotate: false, bob: true,
      svg: '<svg viewBox="0 0 36 36" width="32" height="32">'
        + '<rect x="7" y="11" width="22" height="17" rx="5" fill="#0d1526" stroke="#e3b94e" stroke-width="1.5"/>'
        + '<rect x="14" y="4" width="8" height="5" rx="2" fill="#0d1526" stroke="#e3b94e" stroke-width="1.3"/>'
        + '<circle cx="18" cy="3" r="1.8" fill="#4fd8e8"/>'
        + '<circle cx="14" cy="18.5" r="2.6" fill="#4fd8e8"/>'
        + '<circle cx="22" cy="18.5" r="2.6" fill="#4fd8e8"/>'
        + '<rect x="13" y="23.5" width="10" height="2" rx="1" fill="#e3b94e"/>'
        + '<rect x="3" y="16" width="3" height="7" rx="1.5" fill="#e3b94e" opacity=".7"/>'
        + '<rect x="30" y="16" width="3" height="7" rx="1.5" fill="#e3b94e" opacity=".7"/>'
        + '</svg>'
    },
    star: {
      label: 'Shooting Star',
      rotate: true,
      svg: '<svg viewBox="0 0 62 24" width="54" height="21">'
        + '<defs><linearGradient id="strail" x1="1" y1="0" x2="0" y2="0">'
        + '<stop offset="0" stop-color="#4fd8e8" stop-opacity=".85"/>'
        + '<stop offset=".5" stop-color="#e3b94e" stop-opacity=".45"/>'
        + '<stop offset="1" stop-color="#e3b94e" stop-opacity="0"/></linearGradient></defs>'
        + '<rect x="0" y="9" width="40" height="5" rx="2.5" fill="url(#strail)"/>'
        + '<path d="M49 2l2.4 5.4 5.9.6-4.4 4 1.2 5.8-5.1-3-5.1 3 1.2-5.8-4.4-4 5.9-.6z" fill="#ffd76a" stroke="#e3b94e" stroke-width="1"/>'
        + '</svg>'
    }
  };

  var stored = null;
  try { stored = window.localStorage.getItem('bd-cursor'); } catch (e) {}
  var current = CHASERS[stored] ? stored : 'car';

  var el = document.createElement('div');
  el.id = 'cursor-car';
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);

  var mx = -100, my = -100, cx = -100, cy = -100, angle = 0, t0 = null;
  function loop(ts) {
    if (t0 === null) t0 = ts;
    var secs = (ts - t0) / 1000;
    var conf = CHASERS[current];
    var px = cx, py = cy;
    cx += (mx - cx) * 0.35;
    cy += (my - cy) * 0.35;
    var bobY = 0;
    if (conf && conf.bob) bobY = Math.sin(secs * 3.2) * 3;
    if (conf && conf.rotate) {
      var dx = cx - px, dy = cy - py;
      if (Math.abs(dx) + Math.abs(dy) > 0.4) {
        var target = Math.atan2(dy, dx) * 180 / Math.PI;
        var diff = ((target - angle + 540) % 360) - 180;
        angle += diff * 0.12;
      } else {
        angle += ((0 - angle + 540) % 360 - 180) * 0.04;
      }
    } else {
      angle = 0;
    }
    el.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + (cy + bobY).toFixed(1) + 'px) translate(-50%,-50%) rotate(' + angle.toFixed(1) + 'deg)';
    requestAnimationFrame(loop);
  }

  function apply() {
    var conf = CHASERS[current];
    if (!conf) { el.classList.remove('vis'); el.innerHTML = ''; return; }
    el.innerHTML = conf.svg;
  }

  document.addEventListener('mousemove', function (e) {
    if (!CHASERS[current]) return;
    mx = e.clientX; my = e.clientY;
    if (cx < -50) { cx = mx; cy = my; }
    el.classList.add('vis');
  }, { passive: true });
  requestAnimationFrame(loop);

  var HOVER_SEL = 'a, button, input, textarea, select, label, [role="button"], summary';
  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest(HOVER_SEL)) el.classList.add('on');
  }, { passive: true });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest && e.target.closest(HOVER_SEL)) {
      var to = e.relatedTarget;
      if (!to || !to.closest || !to.closest(HOVER_SEL)) el.classList.remove('on');
    }
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () { el.classList.remove('vis'); });

  apply();

  /* ---------- picker UI (injected next to the motion toggle on every page) ---------- */
  var toggle = document.getElementById('motion-toggle');
  if (!toggle || !toggle.parentNode) return;

  var wrap = document.createElement('div');
  wrap.className = 'cursor-picker';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'motion-toggle cursor-picker-btn';
  btn.setAttribute('aria-haspopup', 'true');
  btn.setAttribute('aria-expanded', 'false');
  btn.title = 'Pick your cursor chaser, or turn it off';
  var menu = document.createElement('div');
  menu.className = 'cursor-picker-menu';
  menu.setAttribute('role', 'menu');
  menu.hidden = true;

  function paintBtn() {
    btn.innerHTML = '✦ Cursor: ' + (CHASERS[current] ? CHASERS[current].label : 'Off');
  }
  function choose(id) {
    current = id;
    try { window.localStorage.setItem('bd-cursor', id); } catch (e) {}
    apply(); paintBtn(); paintMenu();
  }
  function paintMenu() {
    menu.innerHTML = '';
    Object.keys(CHASERS).concat(['off']).forEach(function (id) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'cursor-picker-item' + (id === current ? ' sel' : '');
      item.setAttribute('role', 'menuitemradio');
      item.setAttribute('aria-checked', id === current ? 'true' : 'false');
      item.innerHTML = id === 'off'
        ? '<span class="cpi-name">Off</span>'
        : '<span class="cpi-art">' + CHASERS[id].svg + '</span><span class="cpi-name">' + CHASERS[id].label + '</span>';
      item.addEventListener('click', function () { choose(id); closeMenu(); });
      menu.appendChild(item);
    });
  }
  function openMenu() { paintMenu(); menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function (e) { e.stopPropagation(); menu.hidden ? openMenu() : closeMenu(); });
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  wrap.appendChild(btn);
  wrap.appendChild(menu);
  toggle.parentNode.insertBefore(wrap, toggle.nextSibling);
  paintBtn();
})();
