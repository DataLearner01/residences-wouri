// Génère une brochure PDF de démonstration par programme dans public/brochures,
// à partir des fichiers de src/content/programmes (page 1 en français, page 2 en anglais).
// Aucune dépendance : le PDF est écrit à la main, avec les polices standard Helvetica.
//
// Usage : npm run brochures

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// À adapter pour un vrai client (mêmes valeurs que src/config/site.ts).
const BRAND = 'Résidences Wouri';
const WHATSAPP = '+237 6XX XX XX XX';
const EMAIL = 'contact@residences-wouri.example';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'src/content/programmes');
const outDir = join(root, 'public/brochures');
mkdirSync(outDir, { recursive: true });

const LABELS = {
  fr: {
    from: 'À partir de',
    properties: 'Biens proposés',
    delivery: 'Livraison',
    available: 'Unités disponibles',
    of: 'sur',
    features: 'Atouts',
    payment: 'Modalités de paiement',
    contact: 'Nous écrire',
    demo: 'Document de démonstration. Toutes les données sont fictives.',
  },
  en: {
    from: 'From',
    properties: 'Properties',
    delivery: 'Handover',
    available: 'Units available',
    of: 'out of',
    features: 'Key features',
    payment: 'Payment terms',
    contact: 'Contact us',
    demo: 'Demonstration document. All data is fictional.',
  },
};

// --- Écriture PDF minimale ---

// Caractères hors Latin-1 présents dans l'encodage WinAnsi.
const WIN_ANSI = { '’': 0x92, '‘': 0x91, '“': 0x93, '”': 0x94, '–': 0x96, '—': 0x97, 'œ': 0x9c, 'Œ': 0x8c, '€': 0x80, '…': 0x85 };
// Les espaces insécables deviennent des espaces simples.
WIN_ANSI[String.fromCharCode(0xa0)] = 0x20;
WIN_ANSI[String.fromCharCode(0x202f)] = 0x20;
function encode(text) {
  let out = '';
  for (const ch of text) {
    const code = WIN_ANSI[ch] ?? ch.codePointAt(0);
    out += String.fromCharCode(code <= 0xff ? code : 0x3f);
  }
  return out.replace(/([\\()])/g, '\\$1');
}

const FORET = '0.082 0.094 0.102';
const OR = '0.506 0.525 0.545';
const ENCRE = '0.078 0.090 0.102';
const BLANC = '1 1 1';

const box = (color, x, y, w, h) => `${color} rg ${x} ${y} ${w} ${h} re f`;
const text = (font, size, color, x, y, str) => `BT /${font} ${size} Tf ${color} rg ${x} ${y} Td (${encode(str)}) Tj ET`;

function wrap(str, max) {
  const lines = [];
  let line = '';
  for (const word of str.split(' ')) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}

function buildPdf(pages) {
  const objects = [];
  const add = (body) => objects.push(body);
  const catalog = add('');
  const tree = add('');
  const regular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const bold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const kids = pages.map((content) => {
    const stream = add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    return add(
      `<< /Type /Page /Parent ${tree} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${regular} 0 R /F2 ${bold} 0 R >> >> /Contents ${stream} 0 R >>`,
    );
  });
  objects[catalog - 1] = `<< /Type /Catalog /Pages ${tree} 0 R >>`;
  objects[tree - 1] = `<< /Type /Pages /Kids [${kids.map((id) => `${id} 0 R`).join(' ')}] /Count ${kids.length} >>`;

  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = objects.map((body, i) => {
    const offset = pdf.length;
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
    return offset;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, 'latin1');
}

// --- Mise en page d'une brochure ---

const price = (n, lang) => `${new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB').format(n)} FCFA`;

function brochurePage(p, lang) {
  const L = LABELS[lang];
  // Le français met une espace avant les deux-points, pas l'anglais.
  const sep = lang === 'fr' ? ' : ' : ': ';
  const out = [box(FORET, 0, 712, 595, 130), box(OR, 0, 708, 595, 4)];
  out.push(text('F2', 11, BLANC, 50, 806, BRAND));
  out.push(text('F2', 26, BLANC, 50, 766, p.nom));
  out.push(text('F1', 12, BLANC, 50, 740, `${p.quartier}, Douala`));

  let y = 672;
  const para = (str, { font = 'F1', size = 11, color = ENCRE, gap = 8, indent = 0 } = {}) => {
    for (const line of wrap(str, Math.floor((495 - indent) / (size * 0.52)))) {
      out.push(text(font, size, color, 50 + indent, y, line));
      y -= size + 5;
    }
    y -= gap;
  };
  const heading = (str) => {
    y -= 6;
    out.push(box(OR, 50, y - 4, 28, 2));
    y -= 20;
    para(str, { font: 'F2', size: 13, gap: 4 });
  };

  para(p.accroche[lang], { font: 'F2', size: 14, gap: 12 });
  p.description[lang].forEach((d) => para(d));

  const libres = p.unites.filter((u) => u.statut === 'disponible');
  const base = libres.length ? libres : p.unites;
  heading(`${L.from} ${price(Math.min(...base.map((u) => u.prix)), lang)}`);
  para(`${L.properties}${sep}${p.typologie[lang]}`, { gap: 2 });
  para(`${L.delivery}${sep}${p.livraison[lang]}`, { gap: 2 });
  para(`${L.available}${sep}${libres.length} ${L.of} ${p.unites.length}`);

  heading(L.features);
  p.atouts.forEach((a) => para(`-  ${a[lang]}`, { gap: 1 }));

  heading(L.payment);
  p.paiement[lang].forEach((line) => para(`-  ${line}`, { gap: 1 }));

  out.push(box(FORET, 0, 0, 595, 74));
  out.push(text('F2', 10, BLANC, 50, 46, `${L.contact}${sep}WhatsApp ${WHATSAPP}   |   ${EMAIL}`));
  out.push(text('F1', 9, BLANC, 50, 26, L.demo));
  return out.join('\n');
}

for (const file of readdirSync(dataDir).filter((f) => f.endsWith('.json'))) {
  const programme = JSON.parse(readFileSync(join(dataDir, file), 'utf8'));
  const pdf = buildPdf([brochurePage(programme, 'fr'), brochurePage(programme, 'en')]);
  writeFileSync(join(outDir, programme.brochure), pdf);
  console.log(`${programme.brochure} (${Math.round(pdf.length / 1024)} Ko)`);
}
