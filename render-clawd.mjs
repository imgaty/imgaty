#!/usr/bin/env node
// Renders clawd-animations.svg: every Clawd animation the banner plays, looping side by side.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
const repo = dirname(fileURLToPath(import.meta.url));
const { PALETTE, SCENES } = await import(repo + '/clawd-scenes.mjs');
// Pull CLAWD poses + sequences straight out of generate.mjs so the gallery can't drift from the banner.
const src = readFileSync(repo + '/generate.mjs', 'utf8');
const block = src.slice(src.indexOf('const CLAWD = {'), src.indexOf('\nconst TEXT ='));
const CLAWD = new Function('SCENES', block.replace('CLAWD.loop =', 'CLAWD.seq = { idle, spin, look, jump, celebrate, study: scene("study"), bath: scene("bath") }; CLAWD.loop =') + '\nreturn CLAWD;')(SCENES);

const QUADS = { '▘': 8, '▝': 4, '▖': 2, '▗': 1, '▀': 12, '▄': 3, '▌': 10, '▐': 5, '▛': 14, '▜': 13, '▙': 11, '▟': 7, '█': 15 };
const [cell, row] = [16.8, 36], [px, py] = [cell / 2, row / 2], sb = (13 * px) / 8;
const r2 = (n) => Math.round(n * 100) / 100;
const runs = (grid, x0, y0, w, h, on) => grid.map((line, y) => { let d = ''; for (let x = 0, e; x < line.length; x = e + 1) { for (e = x; on(line[x]) && on(line[e + 1]); e++); if (on(line[x])) d += `M${r2(x0 + x * w)} ${r2(y0 + y * h)}h${r2((e - x + 1) * w)}v${r2(h)}h${r2(-(e - x + 1) * w)}Z`; } return d; }).join('');

function drawFrame([pose, crouch, puff, shift], ox, oy) {
    if (pose.startsWith('scene:')) {
        const [, name, f] = pose.split(':'), { body: [bx, by], frames } = SCENES[name];
        const [x0, y0] = [ox + 9.5 * px - (bx + 6) * sb, oy - by * sb];
        return Object.entries(PALETTE).map(([l, c]) => { const d = runs(frames[f], x0, y0, sb, sb, (ch) => ch === l); return d && `<path fill="${c}" d="${d}"/>`; }).join('');
    }
    const body = [], eyes = [];
    CLAWD.poses[pose].forEach((line, l) => [...line].forEach((ch, c) => { for (let b = 0; b < 4; b++) {
        const [y, x, on] = [2 * l + (b >> 1), 2 * c + (b & 1), ((QUADS[ch] ?? 0) >> (3 - b)) & 1];
        (body[y] ??= [])[x] = !!on; (eyes[y] ??= [])[x] = !on && l === 0 && c >= 2 && c < 8; } }));
    const [dx, dy] = [shift * cell, crouch * row];
    const puffs = puff ? [0, 8].map((c) => `<text x="${r2(ox + c * cell)}" y="${r2(oy + 2.5 * row + 5)}" fill="#999" font-size="28">${CLAWD.puffs[puff]}</text>`).join('') : '';
    return `<g clip-path="url(#cl-${ox}-${oy})"><path fill="#D77757" d="${runs(body, ox + dx, oy + dy, px, py, Boolean)}"/><path fill="#000" d="${runs(eyes, ox + dx, oy + dy, px, py, Boolean)}"/></g>${puffs}`;
}

const tiles = [
    ['Entrance', 'CLI · first launch', CLAWD.entrance],
    ['Idle', 'CLI · look around', CLAWD.seq.idle],
    ['Look', 'CLI', CLAWD.seq.look],
    ['Spin', 'CLI', CLAWD.seq.spin],
    ['Jump', 'CLI', CLAWD.seq.jump],
    ['Celebrate', 'CLI', CLAWD.seq.celebrate],
    ['Study', 'Claude app', CLAWD.seq.study],
    ['Bath', 'Claude app', CLAWD.seq.bath],
];
const [TW, TH, COLS] = [380, 290, 4];
let css = '', body = '', defs = '';
tiles.forEach(([title, source, seq], t) => {
    const [tx, ty] = [(t % COLS) * TW, Math.floor(t / COLS) * TH];
    const [ox, oy] = [r2(tx + TW / 2 - 9.5 * px), ty + 125];
    defs += `<clipPath id="cl-${ox}-${oy}"><rect x="${ox}" y="${oy}" width="${9 * cell}" height="${3 * row}"/></clipPath><clipPath id="t${t}"><rect x="${tx + 8}" y="${ty + 8}" width="${TW - 16}" height="${TH - 16}" rx="10"/></clipPath>`;
    // collapse identical consecutive frames, then emit one visibility timeline per unique frame
    const keys = seq.map((f) => f.join('/')), uniq = [...new Set(keys)], dur = (seq.length * CLAWD.frameMs) / 1000;
    body += `<rect x="${tx + 8}" y="${ty + 8}" width="${TW - 16}" height="${TH - 16}" rx="10" fill="#0b0b0b" stroke="#2a2a2a"/><g clip-path="url(#t${t})">`;
    uniq.forEach((k, u) => {
        const name = `a${t}_${u}`;
        const stops = keys.map((kk, i) => (i === 0 || (kk === k) !== (keys[i - 1] === k) ? `${r2((i / keys.length) * 100)}%{visibility:${kk === k ? 'visible' : 'hidden'}}` : '')).join('');
        css += `.${name}{visibility:hidden;animation:${name} ${dur}s step-end infinite}@keyframes ${name}{${stops}100%{visibility:hidden}}\n`;
        const [pose, crouch, puff, shift] = k.split('/');
        body += `<g class="${name}">${drawFrame([pose, +crouch, puff, +shift], ox, oy)}</g>`;
    });
    body += `</g><text x="${tx + 26}" y="${ty + TH - 40}" fill="#E5E5E5" font-size="18" font-weight="700">${title}</text><text x="${tx + 26}" y="${ty + TH - 20}" fill="#888" font-size="14">${source} · ${dur.toFixed(2)}s loop</text>`;
});
const W = TW * COLS, H = TH * Math.ceil(tiles.length / COLS);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace"><title>Clawd animations</title><style>${css}</style><defs>${defs}</defs><rect width="${W}" height="${H}" fill="#000"/>${body}</svg>`;
writeFileSync(repo + '/clawd-animations.svg', svg);
console.log('wrote', (svg.length / 1024).toFixed(1), 'KB');
