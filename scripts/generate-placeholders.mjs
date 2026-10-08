// Génère les images d'attente « photo-a-remplacer-*.jpg » dans src/assets/photos.
// Ce sont des illustrations vectorielles originales, dessinées par ce script.
// Pour un vrai client : remplacez chaque fichier par une photo du même nom,
// le site (AVIF/WebP, srcset) s'adapte tout seul.
//
// Usage : npm run placeholders

import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src/assets/photos');
mkdirSync(outDir, { recursive: true });

// Mettre à false pour retirer l'étiquette « PHOTO À REMPLACER » des images.
const LABEL = true;

const W = 1800;
const H = 1200;

const C = {
  foret: '#0F3D2E', foret2: '#1B5A44', foret3: '#2F7A5C', feuille: '#5E9C7C', menthe: '#9CC4B4',
  laterite: '#C2562B', laterite2: '#D9794B', terre: '#B9623A', peche: '#F0BE98', creme: '#FBF3E6',
  sable: '#F3EDE4', sable2: '#E6DAC6', sable3: '#C9B99F', or: '#C9A227', encre: '#14171A',
  beton: '#BDB6A9', beton2: '#8F897E', nuit: '#0A2A20', verre: '#2C5A4C', bois: '#7A5238', route: '#3B4144',
};

const SKIES = {
  jour: [[0, '#9FBFE6'], [0.6, '#D5E3F1'], [1, '#F4EFE9']],
  matin: [[0, '#F1C297'], [0.55, '#F8E0C2'], [1, '#FCF4E7']],
  soir: [[0, '#24375C'], [0.42, '#775468'], [0.74, '#E08A5A'], [1, '#F6CB98']],
  crepuscule: [[0, '#141E33'], [0.5, '#2E4168'], [0.82, '#C5653A'], [1, '#F0BE98']],
};
const isDark = (name) => name === 'soir' || name === 'crepuscule';

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

let uid = 0;
function sky(name, w = W, h = H) {
  const id = `g${++uid}`;
  const stops = SKIES[name].map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('');
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>`;
}

const rect = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;

const sun = (cx, cy, r, color = '#FFF1CF') =>
  `<circle cx="${cx}" cy="${cy}" r="${r * 2.8}" fill="${color}" opacity=".10"/><circle cx="${cx}" cy="${cy}" r="${r * 1.8}" fill="${color}" opacity=".18"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;

function clouds(r, n, yMin, yMax, opacity = 0.6, color = '#FFFFFF') {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = r() * W - 100, y = yMin + r() * (yMax - yMin), w = 180 + r() * 260, h = 24 + r() * 14;
    s += `<g fill="${color}" opacity="${opacity}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/><rect x="${x + w * 0.22}" y="${y - h * 0.75}" width="${w * 0.5}" height="${h}" rx="${h / 2}"/></g>`;
  }
  return s;
}

function skyline(r, base, minH, maxH, color, opacity = 1, x0 = -20, x1 = W + 20) {
  let s = `<g fill="${color}" opacity="${opacity}">`;
  for (let x = x0; x < x1; ) {
    const w = 50 + r() * 110, h = minH + r() * (maxH - minH);
    s += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}"/>`;
    if (r() > 0.72) s += `<rect x="${x + w * 0.4}" y="${base - h - 28}" width="${w * 0.2}" height="28"/>`;
    x += w + r() * 16 - 4;
  }
  return s + '</g>';
}

function hills(base, amp, color, seed = 1, opacity = 1) {
  const r = rng(seed);
  let d = `M0 ${base}`;
  for (let x = 0; x < W; ) {
    const w = 240 + r() * 320, h = amp * (0.4 + r() * 0.6);
    d += ` q ${w / 2} ${-h * 2} ${w} 0`;
    x += w;
  }
  return `<path d="${d} L ${W + 600} ${H} L 0 ${H} Z" fill="${color}" opacity="${opacity}"/>`;
}

function palm(x, y, s = 1, leaf = C.foret, trunk = C.bois) {
  const tx = x + 16 * s, ty = y - 200 * s;
  let g = `<path d="M${x} ${y} Q ${x - 8 * s} ${y - 105 * s} ${tx} ${ty}" stroke="${trunk}" stroke-width="${12 * s}" fill="none" stroke-linecap="round"/>`;
  for (const a of [-178, -152, -122, -92, -62, -30, -4, 30, 150]) {
    const rad = (a * Math.PI) / 180, L = (a === -92 ? 92 : 132) * s;
    const ex = tx + L * Math.cos(rad), ey = ty + L * Math.sin(rad) + L * 0.4;
    const cx = tx + L * 0.5 * Math.cos(rad), cy = ty + L * 0.5 * Math.sin(rad) - L * 0.3;
    g += `<path d="M${tx} ${ty} Q ${cx} ${cy} ${ex} ${ey} Q ${cx} ${cy + L * 0.32} ${tx} ${ty} Z" fill="${leaf}"/>`;
  }
  return g + `<circle cx="${tx}" cy="${ty}" r="${10 * s}" fill="${leaf}"/>`;
}

const tree = (x, y, s = 1, color = C.foret2) =>
  `<rect x="${x - 6 * s}" y="${y - 80 * s}" width="${12 * s}" height="${80 * s}" fill="${C.bois}"/><circle cx="${x}" cy="${y - 112 * s}" r="${56 * s}" fill="${color}"/><circle cx="${x + 34 * s}" cy="${y - 86 * s}" r="${38 * s}" fill="${color}"/><circle cx="${x - 36 * s}" cy="${y - 84 * s}" r="${36 * s}" fill="${color}"/>`;

const bush = (x, y, s = 1, color = C.foret3) =>
  `<circle cx="${x}" cy="${y - 22 * s}" r="${30 * s}" fill="${color}"/><circle cx="${x + 34 * s}" cy="${y - 16 * s}" r="${22 * s}" fill="${color}"/><circle cx="${x - 32 * s}" cy="${y - 14 * s}" r="${20 * s}" fill="${color}"/>`;

function hedge(r, y, x0 = 0, x1 = W, color = C.foret3, s = 1) {
  let g = '';
  for (let x = x0; x < x1; x += 70 * s + r() * 30) g += bush(x, y, s * (0.8 + r() * 0.5), color);
  return g;
}

// Immeuble d'appartements vu de face, avec un pan latéral pour le volume.
function block({ x, base, w, h, cols, rows, wall = C.creme, side = C.sable3, win = C.verre, lit = null, r = null, accent = C.laterite, tank = true }) {
  const d = w * 0.15, top = base - h;
  let g = `<polygon points="${x + w},${top} ${x + w + d},${top + d * 0.5} ${x + w + d},${base} ${x + w},${base}" fill="${side}"/>`;
  g += rect(x, top, w, h, wall);
  if (tank) g += rect(x + w * 0.6, top - 62, w * 0.22, 50, side) + rect(x + w * 0.58, top - 70, w * 0.26, 10, C.foret);
  g += rect(x - 10, top - 14, w + 20, 14, C.foret);
  const fh = (h - 20) / rows, cw = w / cols;
  for (let i = 0; i < rows; i++) {
    const fy = top + 20 + i * fh;
    for (let j = 0; j < cols; j++) {
      const wx = x + j * cw + cw * 0.17, ww = cw * 0.66, wy = fy + fh * 0.12, wh = fh * 0.56;
      const on = lit && r && r() > 0.5;
      g += rect(wx, wy, ww, wh, on ? lit : win);
      g += rect(wx + ww / 2 - 2, wy, 4, wh, wall, 'opacity=".75"');
      g += rect(wx - cw * 0.07, wy + wh, ww + cw * 0.14, fh * 0.13, accent);
    }
  }
  const dw = Math.min(cw * 0.5, 90);
  g += rect(x + w / 2 - dw / 2, base - fh * 0.78, dw, fh * 0.78, C.foret);
  return g;
}

// Villa contemporaine à toit plat : un volume haut, un volume bas.
function villa({ x, base, s = 1, wall = C.creme, wall2 = C.sable2, accent = C.laterite, glass = C.verre, lit = null, flip = false }) {
  const t = flip ? `transform="translate(${2 * x + 480 * s} 0) scale(-1 1)"` : '';
  const ax = x, aw = 200 * s, ah = 270 * s, ay = base - ah;
  const bx = x + 160 * s, bw = 320 * s, bh = 160 * s, by = base - bh;
  let g = `<g ${t}>`;
  g += rect(bx, by, bw, bh, wall2);
  g += rect(bx - 6 * s, by - 16 * s, bw + 30 * s, 16 * s, C.foret);
  g += rect(bx + 70 * s, by + 34 * s, 170 * s, bh - 34 * s, lit ?? glass);
  for (const k of [1, 2]) g += rect(bx + 70 * s + (170 * s * k) / 3 - 2 * s, by + 34 * s, 4 * s, bh - 34 * s, wall2);
  g += rect(bx + 256 * s, by + 46 * s, 50 * s, bh - 46 * s, accent);
  g += rect(ax, ay, aw, ah, wall);
  g += rect(ax - 14 * s, ay - 16 * s, aw + 28 * s, 16 * s, C.foret);
  g += rect(ax + 36 * s, ay + 40 * s, 128 * s, 78 * s, lit ?? glass);
  g += rect(ax + 98 * s, ay + 40 * s, 4 * s, 78 * s, wall);
  g += rect(ax + 24 * s, ay + 118 * s, 152 * s, 10 * s, accent);
  g += rect(ax + 36 * s, ay + 166 * s, 60 * s, ah - 166 * s, glass);
  g += rect(ax + 118 * s, ay + 150 * s, 14 * s, ah - 150 * s, accent) + rect(ax + 140 * s, ay + 150 * s, 14 * s, ah - 150 * s, accent) + rect(ax + 162 * s, ay + 150 * s, 14 * s, ah - 150 * s, accent);
  return g + '</g>';
}

function house(x, base, s = 1, wall = C.creme, roof = C.laterite) {
  return rect(x, base - 70 * s, 130 * s, 70 * s, wall) + `<polygon points="${x - 12 * s},${base - 70 * s} ${x + 65 * s},${base - 124 * s} ${x + 142 * s},${base - 70 * s}" fill="${roof}"/>` + rect(x + 22 * s, base - 50 * s, 28 * s, 28 * s, C.verre) + rect(x + 80 * s, base - 46 * s, 26 * s, 46 * s, C.foret);
}

function crane(x, base, h, flip = 1, color = C.laterite) {
  const top = base - h, jl = h * 0.78 * flip, cl = -h * 0.24 * flip;
  let g = `<g stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round">`;
  g += `<line x1="${x - 12}" y1="${base}" x2="${x - 12}" y2="${top}"/><line x1="${x + 12}" y1="${base}" x2="${x + 12}" y2="${top}"/>`;
  for (let y = base; y > top + 30; y -= 48) g += `<path d="M${x - 12} ${y} L ${x + 12} ${y - 24} L ${x - 12} ${y - 48}" stroke-width="3.5"/>`;
  g += `<line x1="${x + cl}" y1="${top}" x2="${x + jl}" y2="${top}" stroke-width="9"/>`;
  g += `<line x1="${x}" y1="${top - 70}" x2="${x}" y2="${top}"/><line x1="${x}" y1="${top - 70}" x2="${x + jl * 0.9}" y2="${top}" stroke-width="3"/><line x1="${x}" y1="${top - 70}" x2="${x + cl}" y2="${top}" stroke-width="3"/>`;
  g += `<line x1="${x + jl * 0.62}" y1="${top}" x2="${x + jl * 0.62}" y2="${top + h * 0.34}" stroke-width="3" stroke="${C.encre}"/></g>`;
  g += rect(x + jl * 0.62 - 16, top + h * 0.34, 32, 22, C.encre);
  g += rect(Math.min(x + cl, x + cl - 44 * flip), top + 4, 44, 34, C.beton2);
  g += rect(x - 20, top - 4, 40, 34, C.creme) + rect(x - 14, top + 2, 28, 14, C.verre);
  return g;
}

function scaffold(x, base, w, h) {
  let g = `<g stroke="${C.encre}" stroke-width="3.5" opacity=".5" fill="none">`;
  for (let xx = x; xx <= x + w + 1; xx += w / Math.round(w / 64)) g += `<line x1="${xx}" y1="${base}" x2="${xx}" y2="${base - h}"/>`;
  for (let yy = base - 56; yy >= base - h - 1; yy -= 56) g += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}"/>`;
  g += `<line x1="${x}" y1="${base}" x2="${x + w / 3}" y2="${base - 112}"/><line x1="${x + w}" y1="${base}" x2="${x + (2 * w) / 3}" y2="${base - 112}"/>`;
  return g + '</g>';
}

// Ossature en béton d'un bâtiment en chantier.
function frame({ x, base, w, cols, built, walled = 0, rendered = 0, fh = 112 }) {
  let g = rect(x - 16, base - 12, w + 32, 16, C.beton2);
  const cw = w / cols;
  // Fondations seules : une dalle et des amorces de poteaux.
  if (built === 0) {
    g += rect(x - 16, base - 34, w + 32, 26, C.beton);
    for (let j = 0; j <= cols; j++) g += rect(x + j * cw - 9, base - 84, 18, 52, C.beton2);
  }
  for (let i = 0; i < built; i++) {
    const y = base - (i + 1) * fh;
    g += rect(x, y + 12, w, fh - 12, '#5F6660', 'opacity=".55"');
    for (let j = 0; j < cols; j++) {
      if (i < walled) {
        const done = i < rendered;
        g += rect(x + j * cw, y + 12, cw, fh - 12, done ? C.creme : '#A9A396');
        g += rect(x + j * cw + cw * 0.24, y + 12 + (fh - 12) * 0.2, cw * 0.52, (fh - 12) * 0.52, done ? C.verre : C.nuit, done ? '' : 'opacity=".8"');
      }
    }
    for (let j = 0; j <= cols; j++) g += rect(x + j * cw - 8, y + 12, 16, fh - 12, i < rendered ? C.creme : C.beton);
    g += rect(x - 8, y, w + 16, 13, i < rendered ? C.sable3 : C.beton2);
  }
  const top = base - built * fh;
  g += `<g stroke="${C.terre}" stroke-width="3">`;
  for (let j = 0; j <= cols; j++) for (const dx of [-5, 0, 5]) g += `<line x1="${x + j * cw + dx}" y1="${top}" x2="${x + j * cw + dx}" y2="${top - 44}"/>`;
  return g + '</g>';
}

function street(y, h = H) {
  let g = rect(0, y, W, 34, C.sable2) + rect(0, y + 34, W, h - y - 34, C.route);
  for (let x = 40; x < W; x += 180) g += rect(x, y + 34 + (h - y - 34) / 2 - 5, 90, 10, C.creme, 'opacity=".8"');
  return g;
}

function label(w = W, h = H) {
  if (!LABEL) return '';
  const k = w / W;
  return `<g><rect x="${w - 364 * k}" y="${h - 76 * k}" width="${332 * k}" height="${44 * k}" rx="${22 * k}" fill="#14171A" opacity=".62"/><text x="${w - 198 * k}" y="${h - 47 * k}" font-family="Arial, Helvetica, sans-serif" font-size="${19 * k}" font-weight="700" letter-spacing="${2 * k}" text-anchor="middle" fill="#FBF3E6">PHOTO À REMPLACER</text></g>`;
}

// ---------- Scènes ----------

function backdrop(sk, r, ground, { sunAt = [1380, 250], far = true } = {}) {
  const dark = isDark(sk);
  let s = sky(sk) + sun(sunAt[0], sunAt[1], dark ? 86 : 64, dark ? '#FBD9A0' : '#FFF6DC');
  s += clouds(r, 4, 90, 380, dark ? 0.1 : 0.62);
  if (far) s += skyline(r, ground, 70, 250, dark ? '#16223A' : '#B4C8DE', dark ? 0.55 : 0.75);
  return s;
}

function residence({ sk = 'jour', seed = 1, blocks = 2, rows = 4, cols = 3, wall, accent = C.laterite, trees = 'palm' }) {
  const r = rng(seed), ground = 940, dark = isDark(sk);
  let s = backdrop(sk, r, ground, { sunAt: blocks === 1 ? [1420, 300] : [900, 230] });
  s += hedge(r, ground + 6, -40, W + 40, dark ? C.nuit : C.feuille, 1.5);
  const opts = { base: ground, wall: wall ?? (dark ? '#EADBC4' : C.creme), side: dark ? '#A8957B' : C.sable3, win: dark ? '#17382F' : C.verre, lit: dark ? '#F8CC7E' : null, r, accent };
  if (blocks === 1) s += block({ ...opts, x: 610, w: 540, h: rows * 100 + 20, cols, rows });
  else s += block({ ...opts, x: 230, w: 500, h: rows * 112 + 20, cols, rows }) + block({ ...opts, x: 990, w: 500, h: rows * 112 + 20, cols, rows });
  s += rect(0, ground, W, 70, dark ? '#174A3A' : C.feuille);
  s += street(ground + 70);
  const leaf = dark ? C.nuit : C.foret;
  if (trees === 'palm') s += palm(130, ground + 30, 2.1, leaf) + palm(1640, ground + 34, 1.8, leaf) + (blocks === 2 ? palm(860, ground + 20, 1.5, leaf) : palm(420, ground + 26, 1.6, leaf));
  else s += tree(150, ground + 30, 2.2, leaf) + tree(1650, ground + 30, 1.9, leaf) + (blocks === 2 ? tree(862, ground + 20, 1.5, C.foret2) : '');
  s += hedge(r, ground + 64, 200, W - 200, C.foret2, 0.8);
  return s;
}

function villas({ sk = 'jour', seed = 2, mode = 'solo' }) {
  const r = rng(seed), ground = 900, dark = isDark(sk);
  let s = backdrop(sk, r, ground, { sunAt: [1300, 280], far: false });
  s += hills(ground - 10, 46, dark ? C.nuit : C.feuille, seed);
  s += tree(180, ground, 2.6, dark ? '#0D3327' : C.foret2) + tree(1560, ground, 2.9, dark ? '#0D3327' : C.foret2);
  const lit = dark ? '#F8CC7E' : null;
  if (mode === 'solo') s += villa({ x: 480, base: ground, s: 1.75, lit, wall: dark ? '#EADBC4' : C.creme, wall2: dark ? '#CDBBA0' : C.sable2 });
  else s += villa({ x: 110, base: ground, s: 1.25, lit }) + villa({ x: 1060, base: ground, s: 1.25, lit, flip: true });
  // pelouse, terrasse, haie basse
  s += rect(0, ground, W, H - ground, dark ? '#174A3A' : C.feuille);
  s += `<polygon points="520,${ground} 1420,${ground} 1640,${H} 300,${H}" fill="${dark ? '#C8B595' : C.sable2}"/>`;
  s += palm(360, ground + 60, 2.2, dark ? C.nuit : C.foret) + palm(1500, ground + 90, 1.7, dark ? C.nuit : C.foret);
  s += hedge(r, H - 20, -40, 420, C.foret2, 1.6) + hedge(r, H - 10, 1500, W + 40, C.foret2, 1.5);
  return s;
}

// Rue ou voie vue en perspective, bordée d'éléments de chaque côté.
function lane({ sk = 'jour', seed = 3, sides = 'villas', earth = false }) {
  const r = rng(seed), horizon = 620, dark = isDark(sk);
  let s = backdrop(sk, r, horizon, { sunAt: [900, 300] });
  if (earth) s += hills(horizon + 4, 22, C.foret3, seed + 5);
  s += rect(0, horizon, W, H - horizon, earth ? C.terre : C.feuille);
  if (earth) s += `<ellipse cx="320" cy="${horizon + 200}" rx="420" ry="40" fill="#A7532F" opacity=".6"/><ellipse cx="1500" cy="${horizon + 380}" rx="460" ry="50" fill="#CC7A4E" opacity=".6"/>`;
  const vx = 900;
  for (const [z, sc] of [[0.26, 0.55], [0.5, 0.95], [1, 1.7]]) {
    const y = horizon + (H - horizon) * z * 0.62, off = 240 * sc + 250 * z;
    if (sides === 'villas') {
      s += villa({ x: vx - off - 480 * sc, base: y, s: sc, flip: true }) + villa({ x: vx + off, base: y, s: sc });
    } else {
      // lots bornés : piquets blancs à tête rouge, quelques maisons
      for (const dir of [-1, 1]) {
        const px = vx + dir * off;
        s += rect(px - 5 * sc, y - 46 * sc, 10 * sc, 46 * sc, C.creme) + rect(px - 5 * sc, y - 46 * sc, 10 * sc, 12 * sc, C.laterite);
        s += rect(px + dir * 150 * sc - 5 * sc, y - 46 * sc, 10 * sc, 46 * sc, C.creme) + rect(px + dir * 150 * sc - 5 * sc, y - 46 * sc, 10 * sc, 12 * sc, C.laterite);
      }
      if (z < 1) s += house(vx - off - 420 * sc, y, sc * 1.5) + (z < 0.4 ? house(vx + off + 260 * sc, y, sc * 1.5, C.sable2, C.foret2) : '');
      s += palm(vx + off + 330 * sc, y + 4, sc * 1.4, dark ? C.nuit : C.foret);
    }
  }
  s += `<polygon points="${vx - 46},${horizon} ${vx + 46},${horizon} ${vx + 560},${H} ${vx - 560},${H}" fill="${C.route}"/>`;
  s += `<polygon points="${vx - 60},${horizon} ${vx - 46},${horizon} ${vx - 560},${H} ${vx - 680},${H}" fill="${C.sable2}"/><polygon points="${vx + 46},${horizon} ${vx + 60},${horizon} ${vx + 680},${H} ${vx + 560},${H}" fill="${C.sable2}"/>`;
  for (const [a, b] of [[0.05, 0.11], [0.2, 0.3], [0.44, 0.6], [0.78, 1]]) {
    const y1 = horizon + (H - horizon) * a, y2 = horizon + (H - horizon) * b, w1 = 3 + 16 * a, w2 = 3 + 16 * b;
    s += `<polygon points="${vx - w1},${y1} ${vx + w1},${y1} ${vx + w2},${y2} ${vx - w2},${y2}" fill="${C.creme}" opacity=".85"/>`;
  }
  if (sides === 'villas') s += palm(250, H - 10, 2.6, dark ? C.nuit : C.foret) + palm(1570, H - 30, 2.3, dark ? C.nuit : C.foret);
  return s;
}

// Lotissement vu d'en haut, en vue oblique.
function estate({ sk = 'jour', seed = 4, built = 0.2, flamboyants = false }) {
  const r = rng(seed), horizon = 470;
  let s = backdrop(sk, r, horizon, { sunAt: [420, 210] });
  s += hills(horizon + 6, 40, C.foret3, seed) + rect(0, horizon + 4, W, H, C.feuille);
  s += hills(horizon + 60, 18, C.foret3, seed + 9, 0.5);
  const L = 122, gap = 70, cols = 5;
  let g = rect(-400, -gap, 2600, 2 * (2 * L) + 3 * gap, C.route);
  for (let by = 0; by < 2; by++)
    for (let bx = 0; bx < 2; bx++) {
      const ox = bx * (cols * L + gap), oy = by * (2 * L + gap);
      for (let j = 0; j < 2; j++)
        for (let i = 0; i < cols; i++) {
          const x = ox + i * L, y = oy + j * L, v = r();
          g += rect(x, y, L, L, v > 0.55 ? '#C9825A' : v > 0.25 ? '#D29067' : '#7FAE8F', `stroke="${C.creme}" stroke-width="4"`);
          if (r() < built) g += rect(x + 28, y + 30, 70, 58, r() > 0.5 ? C.laterite : C.creme) + rect(x + 28, y + 30, 70, 10, C.foret);
          else if (r() < 0.25) g += `<circle cx="${x + 34}" cy="${y + 40}" r="20" fill="${flamboyants ? C.laterite : C.foret2}"/>`;
        }
    }
  for (let x = -360; x < 2100; x += 150) g += rect(x, 2 * L + gap / 2 - 4, 76, 8, C.creme, 'opacity=".8"');
  s += `<g transform="translate(470 560) scale(1 0.62) skewX(-30)">${g}</g>`;
  s += palm(150, H - 20, 2.5, C.foret) + (flamboyants ? tree(1640, H - 10, 2.6, C.laterite) : palm(1660, H - 40, 2.1, C.foret));
  return s;
}

// Entrée d'un ensemble : mur d'enceinte, portail, bâtiments en arrière-plan.
function gate({ sk = 'matin', seed = 5, behind = 'blocks' }) {
  const r = rng(seed), ground = 900;
  let s = backdrop(sk, r, ground, { sunAt: [360, 260] });
  if (behind === 'blocks') s += block({ x: 180, base: ground, w: 420, h: 440, cols: 3, rows: 4, r }) + block({ x: 1180, base: ground, w: 420, h: 440, cols: 3, rows: 4, r });
  else s += hills(ground - 40, 60, C.foret3, seed) + house(260, ground, 1.8) + house(1280, ground, 1.6, C.sable2, C.foret2);
  s += palm(700, ground, 2.2) + palm(1110, ground, 2.0) + tree(60, ground, 2.2) + tree(1750, ground, 2.0);
  s += rect(0, ground - 150, 640, 150, C.creme) + rect(1160, ground - 150, 640, 150, C.creme);
  s += rect(0, ground - 162, 640, 14, C.laterite) + rect(1160, ground - 162, 640, 14, C.laterite);
  s += rect(620, ground - 210, 56, 210, C.sable2) + rect(1124, ground - 210, 56, 210, C.sable2) + rect(610, ground - 224, 76, 16, C.foret) + rect(1114, ground - 224, 76, 16, C.foret);
  s += `<g fill="${C.foret}">`;
  for (let x = 690; x < 1116; x += 30) s += `<rect x="${x}" y="${ground - 176}" width="10" height="176"/>`;
  s += `<rect x="676" y="${ground - 180}" width="448" height="12"/><rect x="676" y="${ground - 60}" width="448" height="10"/></g>`;
  s += rect(1300, ground - 250, 190, 250, C.sable2) + rect(1290, ground - 264, 210, 16, C.foret) + rect(1330, ground - 200, 70, 70, C.verre) + rect(1420, ground - 150, 50, 150, C.foret);
  s += rect(0, ground, W, H - ground, C.sable2);
  s += `<polygon points="680,${ground} 1120,${ground} 1400,${H} 400,${H}" fill="${C.route}"/>`;
  s += hedge(r, ground + 30, 0, 600, C.foret3, 1.1) + hedge(r, ground + 30, 1500, W, C.foret3, 1.1);
  return s;
}

function garden({ sk = 'jour', seed = 6 }) {
  const r = rng(seed), ground = 820;
  let s = backdrop(sk, r, ground, { sunAt: [900, 220] });
  s += block({ x: -120, base: ground, w: 520, h: 560, cols: 3, rows: 4, r }) + block({ x: 1330, base: ground, w: 520, h: 560, cols: 3, rows: 4, r });
  s += tree(700, ground, 1.8) + tree(1130, ground, 1.6, C.foret3);
  s += rect(0, ground, W, H - ground, C.feuille);
  s += `<path d="M 760 ${ground} C 700 960, 1250 980, 1050 ${H} L 1330 ${H} C 1480 980, 900 950, 880 ${ground} Z" fill="${C.sable2}"/>`;
  s += palm(520, ground + 150, 2.4) + palm(1280, ground + 90, 1.9);
  s += rect(560, ground + 210, 190, 14, C.bois) + rect(572, ground + 224, 12, 40, C.bois) + rect(726, ground + 224, 12, 40, C.bois) + rect(560, ground + 160, 190, 12, C.bois);
  s += hedge(r, ground + 40, 0, 460, C.foret3, 1.2) + hedge(r, ground + 40, 1300, W, C.foret3, 1.2) + hedge(r, H - 10, -20, 420, C.foret2, 1.7);
  return s;
}

// Vue lointaine sur la ville, avec ou sans fleuve.
function panorama({ sk = 'soir', seed = 7, river = true, bridge = true, railing = false, pins = false, foreground = true }) {
  const r = rng(seed), dark = isDark(sk), horizon = 700;
  let s = sky(sk) + sun(1180, 560, 92, dark ? '#FCE0AE' : '#FFF6DC');
  s += clouds(r, 5, 110, 430, dark ? 0.14 : 0.6, dark ? '#F6CB98' : '#fff');
  s += skyline(r, horizon, 40, 150, dark ? '#3C4A3F' : C.menthe, 0.75);
  s += skyline(r, horizon, 60, 250, dark ? C.nuit : '#6FA593', dark ? 0.85 : 0.8);
  if (river) {
    const id = `w${++uid}`;
    s += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dark ? '#E99564' : '#BFE0D6'}"/><stop offset="1" stop-color="${dark ? '#143F33' : '#5E9C8C'}"/></linearGradient></defs>`;
    s += rect(0, horizon, W, H - horizon, `url(#${id})`);
    for (let i = 0; i < 16; i++) {
      const y = horizon + 14 + i * 26 + r() * 10, w = 80 + r() * 260 + i * 14;
      s += rect(1180 - w / 2 + (r() - 0.5) * 90, y, w, 5, '#FCE0AE', `opacity="${dark ? 0.5 : 0.35}" rx="2.5"`);
    }
    if (bridge) {
      s += rect(-20, horizon - 46, 760, 14, dark ? C.nuit : C.foret2);
      for (let x = 40; x < 740; x += 120) s += rect(x, horizon - 34, 22, 60, dark ? C.nuit : C.foret2);
    }
  } else s += rect(0, horizon, W, H - horizon, dark ? '#143F33' : C.feuille);
  if (pins) {
    for (const [x, y, c] of [[380, 330, C.laterite], [820, 250, C.foret], [1240, 360, C.laterite], [1560, 290, C.or]]) {
      s += `<line x1="${x}" y1="${y + 70}" x2="${x}" y2="${horizon - 60}" stroke="${c}" stroke-width="4" stroke-dasharray="4 12" stroke-linecap="round"/>`;
      s += `<circle cx="${x}" cy="${y}" r="46" fill="${c}"/><polygon points="${x - 34},${y + 30} ${x + 34},${y + 30} ${x},${y + 92}" fill="${c}"/><circle cx="${x}" cy="${y}" r="17" fill="${C.creme}"/>`;
    }
  }
  if (foreground) {
    const o = { base: H + 40, wall: dark ? '#E4D3BA' : C.creme, side: dark ? '#96846C' : C.sable3, win: dark ? '#17382F' : C.verre, lit: dark ? '#F8CC7E' : null, r };
    s += block({ ...o, x: 1090, w: 330, h: 640, cols: 3, rows: 6 }) + block({ ...o, x: 1500, w: 300, h: 470, cols: 3, rows: 4 });
    s += palm(1010, H + 30, 2.7, dark ? '#082119' : C.foret) + palm(1470, H + 60, 2.0, dark ? '#082119' : C.foret);
    s += hedge(r, H + 10, 860, W, dark ? '#082119' : C.foret2, 1.8);
  }
  if (railing) {
    s += rect(0, H - 240, W, 16, C.encre);
    for (let x = 30; x < W; x += 56) s += rect(x, H - 226, 6, 226, C.encre);
    s += rect(0, H - 60, W, 60, dark ? '#C8B595' : C.sable2);
  }
  return s;
}

function site({ sk = 'jour', seed = 8, kind = 'tower', built = 3, walled = 0, rendered = 0, withCrane = true, withScaffold = true }) {
  const r = rng(seed), ground = 930;
  let s = backdrop(sk, r, ground, { sunAt: [300, 240] });
  s += hedge(r, ground + 4, -40, W + 40, C.feuille, 1.4);
  if (kind === 'tower') {
    if (withCrane) s += crane(1290, ground, 760, -1);
    s += frame({ x: 360, base: ground, w: 720, cols: 4, built, walled, rendered, fh: 150 });
    if (withScaffold) s += scaffold(340, ground, 760, built * 150 - 40);
  } else {
    s += frame({ x: 180, base: ground, w: 520, cols: 3, built, walled, rendered, fh: 170 });
    s += frame({ x: 980, base: ground, w: 520, cols: 3, built: Math.max(built - 1, 0), walled: Math.max(walled - 1, 0), fh: 170 });
    if (withScaffold && built > 0) s += scaffold(170, ground, 540, built * 170 - 30);
  }
  // sol en latérite, clôture de chantier, matériaux
  s += rect(0, ground, W, H - ground, C.terre);
  s += `<ellipse cx="500" cy="${ground + 150}" rx="520" ry="46" fill="#A7532F" opacity=".7"/><ellipse cx="1400" cy="${ground + 70}" rx="380" ry="30" fill="#CC7A4E" opacity=".7"/>`;
  s += `<polygon points="1340,${ground + 40} 1470,${ground - 70} 1600,${ground + 40}" fill="${C.peche}"/><polygon points="1500,${ground + 60} 1600,${ground - 20} 1700,${ground + 60}" fill="${C.sable3}"/>`;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 5 - i; j++) s += rect(150 + j * 46 + i * 23, ground + 60 - i * 26, 42, 24, C.beton2, `stroke="${C.terre}" stroke-width="2"`);
  for (let x = -10; x < W; x += 150) s += rect(x, H - 150, 142, 110, C.foret, 'opacity=".95"') + rect(x, H - 150, 142, 14, C.or);
  s += rect(0, H - 40, W, 40, C.route);
  return s;
}

function interior({ sk = 'jour', seed = 9, sofa = C.foret, cushion = C.laterite }) {
  let s = rect(0, 0, W, H, '#EFE6D8');
  s += `<svg x="560" y="120" width="1000" height="700" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${panorama({ sk, seed: seed + 20, bridge: false, foreground: false })}</svg>`;
  s += `<g fill="${C.creme}"><rect x="548" y="108" width="1024" height="20"/><rect x="548" y="812" width="1024" height="20"/><rect x="548" y="108" width="20" height="724"/><rect x="1552" y="108" width="20" height="724"/><rect x="884" y="120" width="12" height="700"/><rect x="1222" y="120" width="12" height="700"/></g>`;
  s += rect(1500, 90, 190, 760, C.sable2);
  for (let x = 1530; x < 1690; x += 34) s += rect(x, 90, 6, 760, C.sable3, 'opacity=".7"');
  s += `<polygon points="0,880 ${W},880 ${W},${H} 0,${H}" fill="#C99B6D"/>`;
  for (let x = -200; x < W + 200; x += 170) s += `<line x1="${x + 260}" y1="880" x2="${x}" y2="${H}" stroke="#B5855A" stroke-width="4"/>`;
  s += rect(0, 868, W, 14, C.creme);
  s += `<ellipse cx="760" cy="1085" rx="640" ry="92" fill="${C.sable}" opacity=".9"/>`;
  s += rect(150, 690, 740, 230, sofa, 'rx="34"') + rect(120, 800, 800, 180, sofa, 'rx="30"') + rect(120, 760, 100, 220, sofa, 'rx="30"') + rect(820, 760, 100, 220, sofa, 'rx="30"');
  s += rect(250, 730, 170, 130, cushion, 'rx="22"') + rect(620, 740, 160, 120, C.sable2, 'rx="22"');
  s += rect(180, 976, 26, 36, C.bois) + rect(834, 976, 26, 36, C.bois);
  s += `<ellipse cx="1120" cy="1010" rx="210" ry="40" fill="${C.bois}"/>` + rect(1000, 1030, 16, 80, C.bois) + rect(1224, 1030, 16, 80, C.bois);
  s += rect(1060, 962, 90, 16, C.creme) + `<circle cx="1200" cy="968" r="26" fill="${C.or}"/>`;
  s += rect(1610, 910, 120, 150, cushion) + rect(1596, 896, 148, 26, C.laterite2) + palm(1668, 900, 1.6, C.foret, C.foret2);
  s += rect(250, 250, 200, 260, C.creme, `stroke="${C.bois}" stroke-width="10"`) + `<circle cx="330" cy="350" r="46" fill="${C.laterite}"/>` + rect(300, 400, 120, 70, C.foret);
  s += rect(60, 380, 8, 520, C.encre) + `<polygon points="14,380 114,380 92,280 36,280" fill="${C.or}"/>`;
  return s;
}

function documents() {
  let s = rect(0, 0, W, H, '#C99B6D');
  for (let y = 0; y < H; y += 150) s += rect(0, y, W, 4, '#B5855A');
  s += `<g transform="rotate(7 600 700)">${rect(180, 250, 760, 900, C.foret, 'rx="16"')}${rect(180, 250, 760, 60, C.foret2, 'rx="16"')}</g>`;
  let p = rect(0, 0, 780, 980, C.creme, 'rx="6"') + rect(0, 0, 780, 120, C.foret) + rect(60, 44, 330, 22, C.creme, 'opacity=".9"') + rect(60, 78, 190, 12, C.or);
  for (let i = 0; i < 7; i++) p += rect(60, 180 + i * 38, i === 6 ? 300 : 660 - (i % 3) * 60, 12, C.sable3);
  p += `<g transform="translate(60 480)" stroke="${C.foret}" stroke-width="5" fill="none"><polygon points="0,0 340,20 380,250 30,290" fill="${C.sable}"/><line x1="170" y1="10" x2="200" y2="270"/><line x1="15" y1="140" x2="362" y2="135"/><polygon points="170,10 340,20 362,135 186,138" fill="${C.peche}"/></g>`;
  for (let i = 0; i < 5; i++) p += rect(470, 500 + i * 38, 250 - (i % 2) * 50, 12, C.sable3);
  p += `<g transform="translate(590 800)"><circle r="92" fill="none" stroke="${C.laterite}" stroke-width="10"/><circle r="70" fill="none" stroke="${C.laterite}" stroke-width="4" stroke-dasharray="6 9"/><rect x="-48" y="-12" width="96" height="24" fill="${C.laterite}"/></g>`;
  p += `<path d="M70 870 q 40 -60 80 -10 t 80 -10 t 90 20" stroke="${C.encre}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  s += `<g transform="translate(700 130) rotate(-5)">${p}</g>`;
  s += `<g transform="translate(330 300) rotate(38)">${rect(0, 0, 520, 30, C.encre, 'rx="15"')}${rect(520, 6, 60, 18, C.or)}<polygon points="580,6 624,15 580,24" fill="${C.encre}"/></g>`;
  s += `<g transform="translate(1500 860)"><circle r="150" fill="#BFE0D6" opacity=".35"/><circle r="150" fill="none" stroke="${C.foret}" stroke-width="26"/><rect x="100" y="110" width="250" height="44" rx="22" fill="${C.foret}" transform="rotate(42 100 110)"/></g>`;
  return s;
}

function flight() {
  const r = rng(31);
  let s = sky('matin') + sun(400, 330, 90, '#FFF1CF') + clouds(r, 7, 120, 700, 0.7);
  s += `<path d="M 120 760 Q 800 80 1500 330" fill="none" stroke="${C.laterite}" stroke-width="7" stroke-dasharray="4 24" stroke-linecap="round"/>`;
  s += `<g transform="translate(1180 250) rotate(-14) scale(1.5)"><polygon points="160,14 118,-56 150,-56 208,14" fill="${C.sable3}"/><rect x="0" y="0" width="310" height="46" rx="23" fill="${C.creme}"/><polygon points="18,8 -6,-70 40,-70 96,8" fill="${C.laterite}"/><polygon points="150,28 76,130 122,130 214,28" fill="${C.sable2}"/><polygon points="26,20 2,50 30,50 62,20" fill="${C.sable2}"/><g fill="${C.verre}">${[90, 116, 142, 168, 194, 220, 246].map((x) => `<circle cx="${x}" cy="17" r="5.5"/>`).join('')}</g><path d="M272 12 h 20 q 10 4 12 12 h -32 z" fill="${C.verre}"/></g>`;
  s += skyline(r, 1010, 60, 240, C.menthe, 0.8) + skyline(r, 1010, 60, 170, '#6FA593', 0.85);
  s += rect(0, 1010, W, 190, C.feuille) + hedge(r, 1030, -40, W + 40, C.foret3, 1.6);
  s += palm(180, H + 20, 2.8) + palm(520, H + 40, 2.0) + palm(1600, H + 30, 2.5);
  return s;
}

function portrait({ bg, top, hair }) {
  const w = 800, h = 1000;
  let s = rect(0, 0, w, h, bg) + `<circle cx="640" cy="200" r="260" fill="#FFFFFF" opacity=".10"/>`;
  if (hair === 'volume') s += `<ellipse cx="400" cy="410" rx="205" ry="200" fill="${C.encre}"/>`;
  if (hair === 'chignon') s += `<circle cx="400" cy="230" r="78" fill="${C.encre}"/>`;
  s += `<ellipse cx="400" cy="430" rx="158" ry="172" fill="${C.encre}"/>`;
  s += `<path d="M 90 ${h} C 90 760, 250 700, 400 700 C 550 700, 710 760, 710 ${h} Z" fill="${top}"/>`;
  s += rect(340, 600, 120, 140, '#8A5A3C', 'rx="40"') + `<ellipse cx="400" cy="478" rx="138" ry="162" fill="#9A6644"/>`;
  return { svg: s, w, h };
}

// ---------- Visuel d'accueil : trois plans détourés (fond transparent) ----------

// Les derniers étages d'une résidence : toit-terrasse planté, grandes baies éclairées.
function heroBuilding() {
  const w = 1800, h = 1000;
  const wall = '#F3E9DB', wall2 = '#DCCDB8', slab = '#2A2F34', frame = '#23282C';
  let s = `<defs>
    <linearGradient id="vitre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86A9D2"/><stop offset="1" stop-color="#D3E2F0"/></linearGradient>
    <linearGradient id="chaud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCE7BC"/><stop offset="1" stop-color="#F2B462"/></linearGradient>
    <linearGradient id="aube" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F2A566" stop-opacity=".42"/><stop offset=".6" stop-color="#F2A566" stop-opacity="0"/></linearGradient>
  </defs>`;

  // Une baie vitrée : cadre sombre, vitrage (éclairé ou reflet du ciel), montants.
  const bay = (x, y, bw, bh, lit, panes = 3) => {
    let g = rect(x, y, bw, bh, frame) + rect(x + 7, y + 7, bw - 14, bh - 14, lit ? 'url(#chaud)' : 'url(#vitre)');
    if (lit) g += rect(x + 7, y + 7, (bw - 14) * 0.3, bh - 14, '#FFF3D6', 'opacity=".55"') + `<circle cx="${x + bw * 0.68}" cy="${y + bh * 0.3}" r="${bw * 0.05}" fill="#FFF7E2"/>`;
    else g += `<polygon points="${x + bw * 0.5},${y + 7} ${x + bw * 0.74},${y + 7} ${x + bw * 0.34},${y + bh - 7} ${x + bw * 0.1},${y + bh - 7}" fill="#FFFFFF" opacity=".2"/>`;
    for (let i = 1; i < panes; i++) g += rect(x + (bw / panes) * i - 3, y, 6, bh, frame);
    return g;
  };
  // Garde-corps vitré.
  const rail = (x, y, rw, rh = 62) => {
    let g = rect(x, y, rw, rh, '#DDEAF6', 'opacity=".5"') + rect(x, y - 5, rw, 7, frame);
    for (let px = x; px <= x + rw; px += rw / Math.max(2, Math.round(rw / 150))) g += rect(px - 2, y, 4, rh, frame, 'opacity=".7"');
    return g;
  };

  // Volume principal et son pan latéral.
  s += `<polygon points="1500,446 1566,476 1566,${h} 1500,${h}" fill="${wall2}"/>`;
  s += rect(300, 446, 1200, h - 446, wall) + rect(300, 446, 1200, h - 446, 'url(#aube)');
  for (let y = 470; y < h; y += 24) s += rect(300, y, 1200, 2, '#8C7B66', 'opacity=".07"');

  // Attique en retrait, avec sa grande baie.
  s += `<polygon points="1240,196 1288,218 1288,420 1240,420" fill="${wall2}"/>`;
  s += rect(600, 196, 640, 224, wall) + rect(600, 196, 640, 224, 'url(#aube)');
  s += rect(566, 170, 716, 26, slab) + `<polygon points="1282,170 1318,186 1318,212 1282,196" fill="#1D2125"/>`;
  s += bay(650, 240, 540, 180, true, 5);

  // Toit-terrasse : pergola à droite, palmiers et massifs à gauche.
  s += rect(1300, 262, 190, 12, C.bois) + rect(1312, 274, 10, 146, C.bois) + rect(1468, 274, 10, 146, C.bois);
  for (let x = 1300; x < 1490; x += 24) s += rect(x, 250, 8, 14, C.bois);
  s += tree(1400, 420, 0.62, C.foret2) + bush(1330, 424, 0.9, C.foret3) + bush(1462, 424, 0.8, C.feuille);
  s += palm(396, 420, 1.02, C.foret) + palm(520, 420, 0.74, C.foret2);
  s += bush(330, 426, 1.1, C.foret3) + bush(452, 426, 0.9, C.feuille) + bush(566, 426, 1, C.foret3);
  s += rail(300, 362, 300, 58) + rail(1288, 362, 212, 58);

  // Dalles et étages.
  s += rect(278, 420, 1244, 28, slab) + `<polygon points="1522,420 1586,448 1586,476 1522,448" fill="#1D2125"/>`;
  const bays = [328, 564, 800, 1036, 1272];
  [true, false, true, true, false].forEach((lit, i) => (s += bay(bays[i], 486, 200, 196, lit)));
  s += rail(286, 640, 1228, 66) + rect(278, 706, 1244, 22, slab);
  [false, true, false, true, true].forEach((lit, i) => (s += bay(bays[i], 766, 200, h - 766 + 20, lit)));
  return { svg: s, w, h };
}

// Nuages cotonneux : des ellipses blanches fortement floutées.
function heroClouds(kind) {
  const w = 1800, h = 900, front = kind === 'avant';
  const r = rng(front ? 77 : 33);
  let s = `<defs><filter id="flou" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="${front ? 30 : 24}"/></filter></defs><g filter="url(#flou)" fill="#FFFFFF">`;
  const puff = (cx, cy, rx, ry, o = 1) => (s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" opacity="${o}"/>`);
  if (front) {
    // Une mer de nuages au pied de l'immeuble, plus haute sur les côtés.
    for (let x = -120; x < w + 160; x += 120 + r() * 60) puff(x, 838 + r() * 40, 190 + r() * 110, 74 + r() * 36, 0.97);
    puff(140, 610, 330, 110, 0.9); puff(380, 700, 230, 70, 0.72); puff(1670, 580, 340, 120, 0.9); puff(1430, 690, 240, 70, 0.7);
  } else {
    puff(210, 470, 360, 100, 0.8); puff(430, 400, 220, 74, 0.7); puff(40, 380, 200, 60, 0.5);
    puff(1560, 520, 400, 110, 0.82); puff(1340, 450, 240, 78, 0.66); puff(1760, 400, 200, 64, 0.5);
    puff(900, 760, 620, 90, 0.5); puff(1180, 150, 420, 46, 0.28); puff(520, 120, 300, 36, 0.22);
  }
  return { svg: s + '</g>', w, h };
}

// ---------- Liste des images ----------

const scenes = {
  'palmiers-facade': () => residence({ sk: 'jour', seed: 21 }),
  'palmiers-sejour': () => interior({ sk: 'jour', seed: 22 }),
  'palmiers-jardin': () => garden({ sk: 'jour', seed: 23 }),
  'palmiers-entree': () => gate({ sk: 'matin', seed: 24 }),
  'bonapriso-villa': () => villas({ sk: 'jour', seed: 31 }),
  'bonapriso-jardin': () => villas({ sk: 'soir', seed: 32 }),
  'bonapriso-sejour': () => interior({ sk: 'soir', seed: 33, sofa: C.sable3, cushion: C.foret }),
  'bonapriso-impasse': () => lane({ sk: 'matin', seed: 34 }),
  'littoral-vue-aerienne': () => estate({ sk: 'jour', seed: 41 }),
  'littoral-voie': () => lane({ sk: 'jour', seed: 42, sides: 'lots', earth: true }),
  'littoral-entree': () => gate({ sk: 'jour', seed: 43, behind: 'houses' }),
  'akwa-facade': () => residence({ sk: 'soir', seed: 51, blocks: 1, rows: 7, cols: 4 }),
  'akwa-sejour': () => interior({ sk: 'matin', seed: 52, sofa: C.laterite, cushion: C.or }),
  'akwa-rue': () => residence({ sk: 'matin', seed: 53, blocks: 1, rows: 7, cols: 4, trees: 'round' }),
  'akwa-terrasse': () => panorama({ sk: 'crepuscule', seed: 54, bridge: false, railing: true, foreground: false }),
  'chantier-palmiers-2026-03': () => site({ seed: 61, kind: 'tower', built: 3 }),
  'chantier-palmiers-2026-05': () => site({ sk: 'matin', seed: 62, kind: 'tower', built: 4, walled: 1 }),
  'chantier-palmiers-2026-07': () => site({ seed: 63, kind: 'tower', built: 4, walled: 3 }),
  'chantier-palmiers-2026-08': () => site({ sk: 'matin', seed: 64, kind: 'tower', built: 4, walled: 4, rendered: 1, withCrane: false }),
  'chantier-palmiers-2026-09': () => site({ seed: 65, kind: 'tower', built: 4, walled: 4, rendered: 2, withCrane: false }),
  'chantier-bonapriso-2026-06': () => site({ sk: 'matin', seed: 71, kind: 'villas', built: 0, withCrane: false }),
  'chantier-bonapriso-2026-08': () => site({ seed: 72, kind: 'villas', built: 1 }),
  'chantier-bonapriso-2026-09': () => site({ sk: 'matin', seed: 73, kind: 'villas', built: 2, walled: 1 }),
  'article-titre-foncier': documents,
  'article-quartiers': () => panorama({ sk: 'jour', seed: 81, pins: true, bridge: true, foreground: false }),
  'article-diaspora': flight,
  'apropos-histoire': () => garden({ sk: 'matin', seed: 91 }),
  'realisation-makepe': () => residence({ sk: 'matin', seed: 101, accent: C.foret3 }),
  'realisation-flamboyants': () => estate({ sk: 'matin', seed: 102, built: 0.75, flamboyants: true }),
  'realisation-manguiers': () => residence({ sk: 'jour', seed: 103, trees: 'round', accent: C.or }),
  'realisation-logbessou': () => villas({ sk: 'matin', seed: 104, mode: 'duo' }),
  'realisation-deido': () => panorama({ sk: 'jour', seed: 105 }),
};

const portraits = [
  { bg: C.foret2, top: C.sable, hair: 'volume' },
  { bg: C.sable3, top: C.foret, hair: 'court' },
  { bg: C.laterite2, top: C.creme, hair: 'chignon' },
  { bg: C.menthe, top: C.laterite, hair: 'court' },
];

const wrap = (inner, w = W, h = H) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}${label(w, h)}</svg>`;

async function save(name, svg) {
  const file = join(outDir, `photo-a-remplacer-${name}.jpg`);
  await sharp(Buffer.from(svg)).jpeg({ quality: 86, mozjpeg: true }).toFile(file);
  return file;
}

const only = process.argv.slice(2);
let count = 0;
for (const [name, draw] of Object.entries(scenes)) {
  if (only.length && !only.some((o) => name.includes(o))) continue;
  await save(name, wrap(draw()));
  count++;
}
for (const [i, p] of portraits.entries()) {
  if (only.length && !only.some((o) => 'equipe'.includes(o))) continue;
  const { svg, w, h } = portrait(p);
  await save(`equipe-${i + 1}`, wrap(svg, w, h));
  count++;
}

// Plans détourés du visuel d'accueil (WebP avec transparence).
const bare = ({ svg, w, h }) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${svg}</svg>`;
const cutouts = {
  'photo-a-remplacer-accueil-immeuble': heroBuilding(),
  'accueil-nuages-fond': heroClouds('fond'),
  'accueil-nuages-avant': heroClouds('avant'),
};
if (!only.length || only.some((o) => 'accueil'.includes(o))) {
  for (const [name, layer] of Object.entries(cutouts)) {
    await sharp(Buffer.from(bare(layer))).webp({ quality: 92, alphaQuality: 100 }).toFile(join(outDir, `${name}.webp`));
    count++;
  }

  // Image de partage (Open Graph) : le ciel, puis les trois plans superposés.
  mkdirSync(join(root, 'public'), { recursive: true });
  const ogSky = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs>
    <linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FBFE6"/><stop offset=".55" stop-color="#C9DAEE"/><stop offset="1" stop-color="#F3EFE9"/></linearGradient>
    <radialGradient id="a" cx="0" cy="1" r="1"><stop offset="0" stop-color="#F5C9A1"/><stop offset=".7" stop-color="#F5C9A1" stop-opacity="0"/></radialGradient>
  </defs><rect width="1200" height="630" fill="url(#c)"/><rect width="1200" height="630" fill="url(#a)"/></svg>`;
  const layer = async (item, width, top, left = Math.round((1200 - width) / 2)) => ({
    input: await sharp(Buffer.from(bare(item))).resize({ width }).png().toBuffer(),
    top,
    left,
  });
  const building = await layer(cutouts['photo-a-remplacer-accueil-immeuble'], 1100, 150);
  building.input = await sharp(building.input).extract({ left: 0, top: 0, width: 1100, height: 480 }).toBuffer();
  const front = await layer(cutouts['accueil-nuages-avant'], 1320, 0, 0);
  front.input = await sharp(front.input).extract({ left: 60, top: 0, width: 1200, height: 560 }).toBuffer();
  await sharp(Buffer.from(ogSky))
    .composite([await layer(cutouts['accueil-nuages-fond'], 1200, 0), building, { ...front, top: 70, left: 0 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(join(root, 'public/og-default.jpg'));
}

console.log(`${count} images écrites dans src/assets/photos`);
