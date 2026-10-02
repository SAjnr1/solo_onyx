import * as THREE from 'three';

/**
 * Point-cloud generators. Every function returns a Float32Array of n*3 floats
 * (x,y,z per particle). n is identical across shapes, so particle i morphs
 * from its position in one shape to its position in the next.
 */

// Fibonacci / golden-angle sphere: even coverage, no clumping at the poles.
export function sphereShape(n, r) {
  const p = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    p[i * 3] = Math.cos(theta) * rad * r;
    p[i * 3 + 1] = y * r;
    p[i * 3 + 2] = Math.sin(theta) * rad * r;
  }
  return p;
}

export function torusShape(n, R, r) {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    p[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    p[i * 3 + 1] = r * Math.sin(v);
    p[i * 3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
  }
  return p;
}

export function knotShape(n, radius, pTurns, qTurns, thickness) {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = (i / n) * Math.PI * 2 * pTurns;
    const quOverP = (qTurns / pTurns) * u;
    const cs = Math.cos(quOverP);
    const cx = radius * (2 + cs) * 0.5 * Math.cos(u);
    const cy = radius * (2 + cs) * 0.5 * Math.sin(u);
    const cz = radius * Math.sin(quOverP) * 0.5;
    const j = () => (Math.random() - 0.5) * thickness;
    p[i * 3] = cx + j();
    p[i * 3 + 1] = cz + j();
    p[i * 3 + 2] = cy + j();
  }
  return p;
}

// Random points on a BufferGeometry's triangles (barycentric sampling).
export function sampleGeometry(geo, n) {
  const pos = geo.attributes.position;
  const idx = geo.index ? geo.index.array : null;
  const triCount = idx ? idx.length / 3 : pos.count / 3;
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const tri = Math.floor(Math.random() * triCount);
    const ia = idx ? idx[tri * 3] : tri * 3;
    const ib = idx ? idx[tri * 3 + 1] : tri * 3 + 1;
    const ic = idx ? idx[tri * 3 + 2] : tri * 3 + 2;
    let r1 = Math.random();
    let r2 = Math.random();
    if (r1 + r2 > 1) {
      r1 = 1 - r1;
      r2 = 1 - r2;
    }
    const ax = pos.getX(ia), ay = pos.getY(ia), az = pos.getZ(ia);
    const bx = pos.getX(ib), by = pos.getY(ib), bz = pos.getZ(ib);
    const cx = pos.getX(ic), cy = pos.getY(ic), cz = pos.getZ(ic);
    p[i * 3] = ax + r1 * (bx - ax) + r2 * (cx - ax);
    p[i * 3 + 1] = ay + r1 * (by - ay) + r2 * (cy - ay);
    p[i * 3 + 2] = az + r1 * (bz - az) + r2 * (cz - az);
  }
  return p;
}

export function icoShape(n, radius, detail) {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const p = sampleGeometry(geo, n);
  geo.dispose();
  return p;
}

export function cubeShape(n, r) {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const face = i % 6;
    const u = (Math.random() * 2 - 1) * r;
    const v = (Math.random() * 2 - 1) * r;
    let x, y, z;
    if (face === 0) { x = r; y = u; z = v; }
    else if (face === 1) { x = -r; y = u; z = v; }
    else if (face === 2) { y = r; x = u; z = v; }
    else if (face === 3) { y = -r; x = u; z = v; }
    else if (face === 4) { z = r; x = u; y = v; }
    else { z = -r; x = u; y = v; }
    p[i * 3] = x;
    p[i * 3 + 1] = y;
    p[i * 3 + 2] = z;
  }
  return p;
}

// Extruded gear profile (teeth + bore), sampled on its surface.
export function gearShape(n, radius, teeth, depth) {
  const shape = new THREE.Shape();
  const inner = radius - radius * 0.18;
  const steps = teeth * 2;
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const r = i % 2 === 0 ? radius : inner;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const hole = new THREE.Path();
  hole.absarc(0, 0, radius * 0.28, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 1,
  });
  const p = sampleGeometry(geo, n);
  geo.dispose();
  for (let i = 0; i < n; i++) p[i * 3 + 2] -= depth / 2; // center the extrusion
  return p;
}

// Shaft + helical thread + head, sharing one particle budget.
export function screwShape(n, shaftR, shaftH, headR, headH, turns) {
  const p = new Float32Array(n * 3);
  const total = shaftH + headH;
  const shaftYmin = -total / 2;
  const headYmin = shaftYmin + shaftH;
  const headYmax = total / 2;
  const bodyCount = Math.floor(n * 0.32);
  const ridgeCount = Math.floor(n * 0.4);
  const headCount = n - bodyCount - ridgeCount;
  let k = 0;
  for (let i = 0; i < bodyCount; i++, k++) {
    const a = Math.random() * Math.PI * 2;
    p[k * 3] = Math.cos(a) * shaftR;
    p[k * 3 + 1] = shaftYmin + Math.random() * shaftH;
    p[k * 3 + 2] = Math.sin(a) * shaftR;
  }
  for (let i = 0; i < ridgeCount; i++, k++) {
    const t = i / ridgeCount;
    const a = t * Math.PI * 2 * turns;
    const rad = shaftR * 1.18;
    p[k * 3] = Math.cos(a) * rad;
    p[k * 3 + 1] = shaftYmin + t * shaftH;
    p[k * 3 + 2] = Math.sin(a) * rad;
  }
  for (let i = 0; i < headCount; i++, k++) {
    const a = Math.random() * Math.PI * 2;
    let rad, y;
    if (Math.random() < 0.3) {
      rad = Math.sqrt(Math.random()) * headR;
      y = headYmax;
    } else {
      rad = headR;
      y = headYmin + Math.random() * headH;
    }
    p[k * 3] = Math.cos(a) * rad;
    p[k * 3 + 1] = y;
    p[k * 3 + 2] = Math.sin(a) * rad;
  }
  return p;
}

// Renders text to an offscreen canvas and samples its pixels into points.
export function textShape(n, text, fontSize = 220, family = '"JetBrains Mono", monospace') {
  const p = new Float32Array(n * 3);
  if (typeof document === 'undefined') return p; // SSR guard
  const font = `bold ${fontSize}px ${family}`;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + 60;
  const h = Math.ceil(fontSize * 1.3);
  canvas.width = w;
  canvas.height = h;
  ctx.font = font;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, w / 2, h / 2);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pts = [];
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > 128) pts.push(x, y);
    }
  }
  const scale = 4.4 / w;
  for (let i = 0; i < n; i++) {
    let sx = w / 2, sy = h / 2;
    if (pts.length) {
      const k = Math.floor(Math.random() * (pts.length / 2)) * 2;
      sx = pts[k];
      sy = pts[k + 1];
    }
    p[i * 3] = (sx - w / 2) * scale;
    p[i * 3 + 1] = -(sy - h / 2) * scale;
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return p;
}

export function buildShapeLibrary(n, introText) {
  return {
    intro: textShape(n, introText),
    sphere: sphereShape(n, 2.0),
    gear: gearShape(n, 1.7, 12, 0.55),
    torus: torusShape(n, 1.7, 0.6),
    screw: screwShape(n, 0.5, 3.0, 0.85, 0.55, 10),
    knot: knotShape(n, 0.9, 2, 3, 0.12),
    cube: cubeShape(n, 1.7),
    ico: icoShape(n, 2.0, 2),
  };
}