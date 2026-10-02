'use client'; // needed if you use Next.js (App Router); ignored elsewhere

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildShapeLibrary, textShape } from './shapes.jsx';
import './ParticleMorph.css';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/footer.jsx';

const FONT = '"JetBrains Mono", monospace';

export const DEFAULT_SECTIONS = [
  { shape: 'intro', hero: true, /* label: '00 / SOLO ONYX', */ title: "Solomon Agbeko",
    text: 'A little bit of coding, a little bit of engineering, a lot of creativity. Why choose one thing when I can struggle with six?' },
  { shape: 'sphere',/* label: '01 / SPHERE', */ title: '3D Modeller',
    text: 'I turn ideas, concepts, and imagination into detailed 3D models that can be visualized and brought to life.' },
  { shape: 'gear',/* label: '02 / GEAR', */ title: 'Structural Design and Assembling',
    text: 'I enjoy designing physical structures, figuring out how components fit together, and turning digital designs into working builds.' },
  { shape: 'torus',/* label: '03 / TORUS', */title: 'Arduino Programmer',
    text: "Writing code that connects hardware, sensors, and electronics to create interactive systems and practical projects." },
  { shape: 'screw',/* label: '04 / SCREW', */ title: 'Robotics Personelle',
    text: 'Designing, programming, and experimenting with robots to understand how technology can solve real-world problems.' },
  { shape: 'knot',/* label: '05 / TORUS KNOT', */ title: 'STEM personelle',
    text: 'Passionate about exploring science, technology, engineering, and mathematics while constantly learning and creating new things.' },
  { shape: 'cube', /*label: '06 / CUBE', */ title: 'Just your normal STEM boy and.......',
    text: 'Always curious, always experimenting, and usually trying to build something that probably started as a random idea.' },
  { shape: 'ico', /* label: '07 / ICOSAHEDRON', */ title: '...a regular anime lover',
    text: 'When I’m not coding, designing, or building something, you’ll probably find me watching anime and getting way too invested in the story. 😭' },
];

export const DEFAULT_CARDS = [
  { title: 'Capabilities', href: '/capabilities', text: 'My strengths, capabilities and my other skills' },
  { title: 'Selected Work', href: '/work', text: 'Check out my projects and works' },
  { title: 'Get in Touch', href: '/contact', text: 'I am just a text, call or perhaps a hug away' },
];

const pad = (n) => String(n).padStart(2, '0');

export default function ParticleMorph({
  introText = 'Solo Onyx',
  particleCount = 8000,
  color = '#00ffea',
  sections = DEFAULT_SECTIONS,
  cards = DEFAULT_CARDS,
  onNavigate, // optional: (href) => void, e.g. react-router's navigate. Defaults to a full page load.
}) {
  const mountRef = useRef(null);
  const sectionRefs = useRef([]);
  const orbitRef = useRef(null);

  // Values the animation loop reads without needing React re-renders.
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  const cardTitlesRef = useRef([]);
  cardTitlesRef.current = cards.map((c) => c.title);
  const cardsRef = useRef(cards);
  cardsRef.current = cards;
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;
  const targetKeyRef = useRef('intro');
  const startTransitionRef = useRef(() => {}); // bridges into the effect's startTransition

  // Called once the explode/vortex transition finishes.
  const navigateNow = (href) => {
    if (!href) return;
    if (onNavigateRef.current) onNavigateRef.current(href);
    else window.location.assign(href);
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);

  const cardKey = cards.map((c) => c.title).join('|');

  useEffect(() => {
    const mount = mountRef.current;
    const root = document.documentElement;
    const N = particleCount;
    const sectionCount = sectionsRef.current.length;
    const orbitEl = orbitRef.current; // null when cards is empty
    const cardTitles = cardTitlesRef.current;
    let disposed = false;
    let raf = 0;

    // ---- Snap scrolling lives on <html>; restored on unmount ----
    const prevSnap = root.style.scrollSnapType;
    root.style.scrollSnapType = 'y mandatory';

    // ---- Renderer / scene / camera / lights ----
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    const BASE_CAMERA_Z = 6.5;
    const BASE_PARTICLE_SIZE = 0.028;
    const REFERENCE_ASPECT = 1.4; // landscape reference the whole scene was composed for
    // On narrower/taller viewports (phones, portrait tablets), pull the camera
    // back so the orbiting cards and every morph shape stay fully in frame
    // instead of clipping at the sides.
    function viewportZoom() {
      const aspect = window.innerWidth / window.innerHeight;
      return aspect < REFERENCE_ASPECT ? Math.min(2.3, REFERENCE_ASPECT / aspect) : 1;
    }
    let zoom = viewportZoom();
    camera.position.set(0, 0.4, BASE_CAMERA_Z * zoom);
    // Intensities are tuned for three r155+ (physically-based lights).
    scene.add(new THREE.AmbientLight(0x223322, 3));
    const keyLight = new THREE.DirectionalLight(0xbfffd9, 2.4);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // ---- Particles ----
    const lib = buildShapeLibrary(N, introText);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(lib.intro), 3));
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: BASE_PARTICLE_SIZE * zoom, // slightly larger points so they stay visible when zoomed out
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    const posAttr = geometry.attributes.position;

    // ---- Explode → vortex click transition ----
    const velocities = new Float32Array(N * 3); // reused scratch buffer for the explode phase
    let transitionPhase = null; // null | 'explode' | 'vortex'
    let transitionT = 0;
    let pendingHref = null;
    function startTransition(href) {
      if (!href || transitionPhase) return; // ignore clicks mid-transition
      pendingHref = href;
      transitionPhase = 'explode';
      transitionT = 0;
      const arr = posAttr.array;
      for (let i = 0; i < N; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        const x = arr[ix], y = arr[iy], z = arr[iz];
        const len = Math.hypot(x, y, z) || 1;
        const speed = 3 + Math.random() * 4;
        velocities[ix] = (x / len) * speed + (Math.random() - 0.5) * 2;
        velocities[iy] = (y / len) * speed + (Math.random() - 0.5) * 2;
        velocities[iz] = (z / len) * speed + (Math.random() - 0.5) * 2;
      }
    }
    startTransitionRef.current = startTransition;

    // ---- 3D orbiting cards ----
    const labelDrawers = [];
    function makeLabel(title) {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 180;
      const ctx = canvas.getContext('2d');
      const texture = new THREE.CanvasTexture(canvas);
      if ('colorSpace' in texture) texture.colorSpace = THREE.SRGBColorSpace;
      const draw = () => {
        ctx.fillStyle = '#0a120e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = color;
        ctx.font = `bold 30px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, canvas.width / 2, canvas.height / 2);
        texture.needsUpdate = true;
      };
      draw();
      labelDrawers.push(draw);
      return texture;
    }

    function makeCard(title) {
      const group = new THREE.Group();
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x0f1a14,
        metalness: 0.3,
        roughness: 0.55,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.05,
      });
      group.add(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 0.1), boxMat));
      const faceMat = new THREE.MeshBasicMaterial({ map: makeLabel(title), transparent: true, opacity: 0.4 });
      const front = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.8), faceMat);
      front.position.z = 0.06;
      const back = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.8), faceMat);
      back.position.z = -0.06;
      back.rotation.y = Math.PI;
      group.add(front, back);
      group.userData = { boxMat, faceMat };
      return group;
    }

    const cardCount = cardTitles.length;
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = -0.28; // slight tilt, like a solar system seen at an angle
    orbitGroup.position.y = -0.8; // ring sits a little lower than the sphere's center
    orbitGroup.visible = false;
    orbitGroup.scale.setScalar(0); // grows in as you approach the orbit zone
    const orbitRadius = 3.4;
    const orbitCards = cardTitles.map((title, i) => {
      const card = makeCard(title);
      const angle = (i / cardCount) * Math.PI * 2;
      const px = Math.cos(angle) * orbitRadius;
      const pz = Math.sin(angle) * orbitRadius;
      card.position.set(px, 0, pz);
      card.lookAt(px * 2, 0, pz * 2); // label side faces outward, away from the sphere
      card.userData.baseAngle = angle;
      card.userData.index = i;
      orbitGroup.add(card);
      return card;
    });
    scene.add(orbitGroup);

    // Redraw text that used the fallback font once JetBrains Mono has loaded.
    if (document.fonts && document.fonts.load) {
      document.fonts.load(`bold 220px ${FONT}`, introText).then(() => {
        if (disposed) return;
        lib.intro = textShape(N, introText);
        labelDrawers.forEach((draw) => draw());
      });
    }

    // ---- Snap-driven target selection ----
    function activate(i) {
      setActiveIndex(i);
      targetKeyRef.current = i < sectionCount ? sectionsRef.current[i].shape : 'sphere';
    }
    const observed = sectionRefs.current.slice(0, sectionCount).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            activate(observed.indexOf(entry.target));
          }
        });
      },
      { threshold: [0.6] }
    );
    observed.forEach((el) => io.observe(el));

    // ---- Orbit zone measurement ----
    let zoneTop = 0;
    const measureZone = () => {
      if (orbitEl) zoneTop = orbitEl.getBoundingClientRect().top + window.scrollY;
    };
    measureZone();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      zoom = viewportZoom();
      camera.position.z = BASE_CAMERA_Z * zoom;
      camera.updateProjectionMatrix();
      material.size = BASE_PARTICLE_SIZE * zoom;
      renderer.setSize(window.innerWidth, window.innerHeight);
      measureZone();
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    window.addEventListener('load', measureZone);

    // ---- Clicking / hovering the 3D cards (raycast from the pointer) ----
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const rootEl = mount.parentElement;
    let hovered = -1;
    function cardAt(e) {
      if (!orbitEl || !orbitGroup.visible || orbitGroup.scale.x < 0.6) return -1;
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(orbitCards, true)[0]; // nearest card wins
      if (!hit) return -1;
      let obj = hit.object;
      while (obj && obj.userData.index === undefined) obj = obj.parent;
      return obj ? obj.userData.index : -1;
    }
    const onPointerMove = (e) => {
      hovered = cardAt(e);
      rootEl.style.cursor = hovered >= 0 ? 'pointer' : '';
    };
    const onClick = (e) => {
      if (e.target.closest && e.target.closest('a,button')) return; // let real links handle themselves
      const i = cardAt(e);
      if (i >= 0) startTransition(cardsRef.current[i] && cardsRef.current[i].href);
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('click', onClick);

    // ---- Animation loop ----
    const clock = new THREE.Clock();
    let elapsed = 0;
    let nearZone = false;
    let snapOn = true;
    let orbitAngle = -Math.PI / 2;
    let shownCard = 0;
    const spanAngle = Math.PI * 2 * ((cardCount - 1) / cardCount);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      elapsed += delta;

      if (transitionPhase === 'explode') {
        const arr = posAttr.array;
        for (let i = 0; i < arr.length; i++) {
          arr[i] += velocities[i] * delta;
          velocities[i] *= 0.96; // slight drag so it doesn't fly out forever
        }
        posAttr.needsUpdate = true;
        points.rotation.y += delta * 0.6;
        if (orbitEl) orbitGroup.scale.setScalar(THREE.MathUtils.lerp(orbitGroup.scale.x, 0, Math.min(1, delta * 6)));
        transitionT += delta;
        if (transitionT > 0.45) {
          transitionPhase = 'vortex';
          transitionT = 0;
        }
        renderer.render(scene, camera);
        return; // skip the normal morph/orbit logic below while transitioning
      } else if (transitionPhase === 'vortex') {
        const arr = posAttr.array;
        const decay = Math.pow(0.015, delta); // pulls every particle toward the center fast
        const spin = 9;
        for (let i = 0; i < arr.length; i += 3) {
          const x = arr[i], y = arr[i + 1], z = arr[i + 2];
          let radius = Math.hypot(x, z);
          const angle = Math.atan2(z, x) + spin * delta;
          radius *= decay;
          arr[i] = Math.cos(angle) * radius;
          arr[i + 1] = y * decay;
          arr[i + 2] = Math.sin(angle) * radius;
        }
        posAttr.needsUpdate = true;
        material.opacity = Math.max(0, material.opacity - delta * 1.3);
        transitionT += delta;
        if (transitionT > 0.7 || material.opacity <= 0.02) {
          transitionPhase = null;
          const href = pendingHref;
          pendingHref = null;
          navigateNow(href);
        }
        renderer.render(scene, camera);
        return; // skip the normal morph/orbit logic below while transitioning
      }

      // Spring every particle toward the active shape.
      const target = lib[targetKeyRef.current] || lib.sphere;
      const arr = posAttr.array;
      for (let i = 0; i < arr.length; i++) arr[i] += (target[i] - arr[i]) * 0.045;
      posAttr.needsUpdate = true;
      points.rotation.y = elapsed * 0.12;
      points.rotation.x = Math.sin(elapsed * 0.08) * 0.08;

      if (orbitEl) {
        // Free scroll: scroll distance through the zone drives the ring directly.
        const sy = window.scrollY;
        const vh = window.innerHeight;
        const near = sy >= zoneTop - vh * 0.5;
        if (near && !nearZone) {
          nearZone = true;
          activate(sectionCount);
        } else if (!near && nearZone) {
          nearZone = false;
        }

        // Turn CSS snapping off inside the zone so scrolling isn't pulled back.
        const wantSnapOff = sy >= zoneTop - 4;
        if (wantSnapOff === snapOn) {
          snapOn = !wantSnapOff;
          root.style.scrollSnapType = snapOn ? 'y mandatory' : 'none';
        }

        const zoneP = THREE.MathUtils.clamp((sy - zoneTop) / Math.max(1, orbitEl.offsetHeight - vh), 0, 1);
        const orbitTarget = -Math.PI / 2 + zoneP * spanAngle; // card 0 in front at start, last card at end
        orbitAngle += (orbitTarget - orbitAngle) * Math.min(1, delta * 6);
        orbitGroup.rotation.y = orbitAngle;

        const gs = THREE.MathUtils.lerp(orbitGroup.scale.x, near ? 1 : 0, Math.min(1, delta * 4));
        orbitGroup.scale.setScalar(gs);
        orbitGroup.visible = gs > 0.02;

        if (orbitGroup.visible) {
          let best = 0;
          let bestC = -1;
          orbitCards.forEach((card, ci) => {
            // How close is this card to the camera-facing point of its orbit?
            let d = (card.userData.baseAngle - orbitAngle - Math.PI / 2) % (Math.PI * 2);
            if (d > Math.PI) d -= Math.PI * 2;
            if (d < -Math.PI) d += Math.PI * 2;
            const c = Math.max(0, Math.cos(d));
            const k = c * c;
            card.scale.setScalar(0.8 + 0.55 * k + (ci === hovered ? 0.12 : 0));
            card.userData.boxMat.emissiveIntensity = 0.05 + 0.85 * k;
            card.userData.faceMat.opacity = 0.35 + 0.65 * k;
            if (c > bestC) {
              bestC = c;
              best = ci;
            }
          });
          if (best !== shownCard) {
            shownCard = best;
            setCardIndex(best);
          }
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // ---- Cleanup (also runs between StrictMode's double-invoked effects) ----
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      startTransitionRef.current = () => {};
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      window.removeEventListener('load', measureZone);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onClick);
      rootEl.style.cursor = '';
      io.disconnect();
      root.style.scrollSnapType = prevSnap;
      geometry.dispose();
      material.dispose();
      orbitGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
      });
      orbitCards.forEach((card) => {
        card.userData.boxMat.dispose();
        card.userData.faceMat.map.dispose();
        card.userData.faceMat.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // Re-create the scene only when these change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [particleCount, introText, color, cardKey, sections.length]);

  const hasOrbit = cards.length > 0;
  const dotCount = sections.length + (hasOrbit ? 1 : 0);
  const safeCard = Math.min(cardIndex, Math.max(cards.length - 1, 0));

  return (
    <div className="pm-root" style={{ '--pm-accent': color }}>
      <Navbar/>
      <div ref={mountRef} className="pm-scene" aria-hidden="true" />
     {/* <div className="pm-tag pm-tl">FIELD RIG / SNAP MODE</div> 
      <div className="pm-tag pm-br">
        {introText.toUpperCase()} → SPHERE
        <br />
        {sections.length - 1} SHAPES{hasOrbit ? ' + ORBIT' : ''} · MORPH ON LANDING
      </div> */}
      <div className="pm-dots" aria-hidden="true">
        {Array.from({ length: dotCount }, (_, i) => (
          <span key={i} className={i === activeIndex ? 'active' : ''} />
        ))}
      </div>

      <main className="pm-main">
        {sections.map((s, i) => {
          const Heading = s.hero ? 'h1' : 'h2';
          return (
            <section
              key={s.label}
              ref={(el) => { sectionRefs.current[i] = el; }}
              className={`pm-section${i === activeIndex ? ' active' : ''}`}
            >
              <div className="pm-idx">{s.label}</div>
              <Heading className={s.hero ? 'pm-h1' : 'pm-h2'}>{s.title}</Heading>
              <p className="pm-lead">{s.text}</p>
            </section>
          );
        })}

        {hasOrbit && (
          <section
            ref={orbitRef}
            className="pm-section pm-orbit"
            style={{ height: `${(cards.length + 1) * 100}vh`, minHeight: `${(cards.length + 1) * 100}vh` }}
          >
            <div className="pm-pin">
             {/* <div className="pm-idx">
                {pad(sections.length)} / ORBIT · {pad(safeCard + 1)}
              </div> */}
              <h2 className="pm-h2">{cards[safeCard].title}</h2>
              <p className="pm-lead">{cards[safeCard].text}</p>
              {cards[safeCard].href && (
                <a
                  className="pm-link"
                  href={cards[safeCard].href}
                  onClick={(e) => {
                    e.preventDefault();
                    startTransitionRef.current(cards[safeCard].href);
                  }}
                >
                  Open {cards[safeCard].title} →
                </a>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer/>
    </div>
  );
}