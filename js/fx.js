/* O Roubo Perfeito 2.0 — efeitos visuais: faíscas douradas, flash de foto, confete,
   tremida de tela. Tudo em coordenadas do palco (1920x1080). */
window.FX = (function () {
  "use strict";

  const camada = () => document.getElementById("fx");
  const CORES = ["#e8b04a", "#ffd89a", "#f2ece1", "#e0284a"];

  // posição (no palco) do centro de um elemento
  function centro(el) {
    const palco = document.getElementById("palco");
    const r = el.getBoundingClientRect();
    const p = palco.getBoundingClientRect();
    const k = p.width / 1920 || 1;
    return { x: (r.left + r.width / 2 - p.left) / k, y: (r.top + r.height / 2 - p.top) / k };
  }

  function particulas(x, y, op) {
    op = op || {};
    const c = camada();
    if (!c) return;
    const n = op.n || 20;
    const cores = op.cores || CORES.slice(0, 3);
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.className = "fx-p" + (Math.random() < 0.45 ? " fx-estrela" : "");
      const tam = (op.tam || 14) * (0.55 + Math.random() * 0.8);
      p.style.cssText = `left:${x - tam / 2}px;top:${y - tam / 2}px;width:${tam}px;height:${tam}px;background:${cores[i % cores.length]}`;
      c.appendChild(p);
      const ang = Math.random() * Math.PI * 2;
      const vel = (op.vel || 300) * (0.45 + Math.random() * 0.8);
      const dx = Math.cos(ang) * vel;
      const dy = Math.sin(ang) * vel * 0.75 - (op.subida || 140);
      const dur = 0.8 + Math.random() * 0.5;
      gsap.to(p, { x: dx, duration: dur, ease: "power2.out" });
      gsap.to(p, { y: dy, duration: dur * 0.42, ease: "power2.out" });
      gsap.to(p, { y: dy + (op.queda || 320), duration: dur * 0.58, delay: dur * 0.42, ease: "power2.in" });
      gsap.to(p, { rotation: (Math.random() - 0.5) * 540, opacity: 0, duration: dur, ease: "power1.in", onComplete: () => p.remove() });
    }
  }
  function particulasEm(el, op) {
    if (!el) return;
    const c = centro(el);
    particulas(c.x, c.y, op);
  }

  function flash(cor) {
    const c = camada();
    if (!c) return;
    const f = document.createElement("div");
    f.className = "fx-flash";
    if (cor) f.style.background = cor;
    c.appendChild(f);
    gsap.fromTo(f, { opacity: 0.9 }, { opacity: 0, duration: 0.45, ease: "power2.out", onComplete: () => f.remove() });
  }

  function confete(n, dur) {
    const c = camada();
    if (!c) return;
    n = n || 90;
    dur = dur || 3.6;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.className = "fx-confete";
      const w = 10 + Math.random() * 12, h = 6 + Math.random() * 10;
      const x = Math.random() * 1920;
      p.style.cssText = `left:${x}px;top:-30px;width:${w}px;height:${h}px;background:${CORES[i % CORES.length]}`;
      c.appendChild(p);
      const d = dur * (0.6 + Math.random() * 0.6);
      const atraso = Math.random() * 1.2;
      gsap.to(p, { y: 1140, duration: d, delay: atraso, ease: "power1.in", onComplete: () => p.remove() });
      gsap.to(p, { x: (Math.random() - 0.5) * 260, rotation: (Math.random() - 0.5) * 900, duration: d, delay: atraso, ease: "sine.inOut" });
    }
  }

  function tremer(alvo, forca, vezes) {
    forca = forca || 10;
    vezes = vezes || 3;
    gsap.fromTo(alvo, { x: 0 }, { x: forca, duration: 0.05, yoyo: true, repeat: vezes * 2 - 1, ease: "sine.inOut", clearProps: "x" });
  }

  function limpar() {
    const c = camada();
    if (c) c.innerHTML = "";
  }

  return { particulas, particulasEm, flash, confete, tremer, centro, limpar };
})();
