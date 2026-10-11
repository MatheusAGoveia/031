"use client";

import { useEffect } from "react";

// The original pendant remains the immediate fallback. Three.js only adds
// a small perspective response after the texture and WebGL are ready.
export default function ThreeHeroPendant() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero");
    const holder = document.querySelector<HTMLElement>(".hero-object");
    const original = holder?.querySelector<HTMLImageElement>("img");
    if (!hero || !holder || !original || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    async function start() {
      const THREE = await import("three");
      if (cancelled || !holder || !original || !hero) return;

      const texture = await new THREE.TextureLoader().loadAsync("/images/cordao-original.png");
      if (cancelled) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace;

      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.className = "hero-three-canvas";
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-350 / 380, 350 / 380, 1, -1, 0.1, 10);
      camera.position.z = 3;
      const geometry = new THREE.PlaneGeometry(2 * 350 / 380, 2);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false });
      const pendant = new THREE.Mesh(geometry, material);
      scene.add(pendant);

      let x = 0;
      let y = 0;
      let targetX = 0;
      let targetY = 0;
      let frame = 0;
      function render() { renderer.render(scene, camera); }
      function drawSize() {
        const width = Math.max(1, Math.min(350, Math.round(holder!.clientWidth)));
        renderer.setSize(width, Math.round(width * 380 / 350), false);
        render();
      }
      function ease() {
        x += (targetX - x) * .18;
        y += (targetY - y) * .18;
        pendant.rotation.x = x;
        pendant.rotation.y = y;
        render();
        if (Math.abs(targetX - x) + Math.abs(targetY - y) > .001) frame = requestAnimationFrame(ease);
        else frame = 0;
      }
      function queue() { if (!frame) frame = requestAnimationFrame(ease); }
      function move(event: PointerEvent) {
        const rect = hero!.getBoundingClientRect();
        targetY = ((event.clientX - rect.left) / rect.width - .5) * .13;
        targetX = -((event.clientY - rect.top) / rect.height - .5) * .11;
        queue();
      }
      function leave() { targetX = 0; targetY = 0; queue(); }

      drawSize();
      holder.insertBefore(canvas, original);
      original.hidden = true;
      holder.style.transform = "translateX(-50%)";
      const resize = new ResizeObserver(drawSize);
      resize.observe(holder);
      if (window.matchMedia("(pointer: fine)").matches) {
        hero.addEventListener("pointermove", move, { passive: true });
        hero.addEventListener("pointerleave", leave);
      }

      cleanup = () => {
        resize.disconnect();
        hero.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", leave);
        if (frame) cancelAnimationFrame(frame);
        original.hidden = false;
        holder.style.removeProperty("transform");
        canvas.remove();
        geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
      };
    }

    void start().catch(() => { /* The original image remains visible. */ });
    return () => { cancelled = true; cleanup?.(); };
  }, []);
  return null;
}
