/* O Roubo Perfeito 2.0 — som: música, ambiente, efeitos (arquivos do vídeo), vozes
   "falantes" e efeitos sintetizados. Usa só <audio> e WebAudio com osciladores e ruído,
   então funciona abrindo o index.html direto do computador (file://), sem servidor. */
window.SOM = (function () {
  "use strict";

  const BASE = "assets/audio/";
  const EFEITOS = {
    whoosh: { f: "whoosh-cinematic.mp3", v: 0.5 },
    whooshCurto: { f: "whoosh-short.mp3", v: 0.55 },
    brilho: { f: "sparkle.mp3", v: 0.5 },
    impacto: { f: "impact-bass.mp3", v: 0.65 },
    vidro: { f: "glass-shatter.mp3", v: 0.45 },
    sireneA: { f: "siren-a.mp3", v: 0.42 },
    sireneB: { f: "siren-b.mp3", v: 0.22 },
    alarme: { f: "alarm.mp3", v: 0.22 },
    corda: { f: "rope.mp3", v: 0.6 },
    helicoptero: { f: "helicopter.mp3", v: 0.3 },
  };

  let mudo = false;
  let ctx = null, mestre = null;
  const pools = {};
  const todos = [];
  let musica = null;
  const amb = [];
  let ambLigado = false, ambI = 0, ambTimer = null, ambVol = 0.4;
  let volMusicaBase = 0.3;
  let lendo = false;

  function criar(src) {
    const a = new Audio(src);
    a.preload = "auto";
    a.muted = mudo;
    todos.push(a);
    return a;
  }

  function carregar() {
    for (const n in EFEITOS) pools[n] = [criar(BASE + EFEITOS[n].f)];
    musica = criar(BASE + "music-prologue.mp3");
    musica.loop = true;
    amb.push(criar(BASE + "night-ambience.mp3"), criar(BASE + "night-ambience.mp3"));
  }

  const lim = (v) => Math.max(0, Math.min(1, v));

  function rampa(a, alvo, dur, depois) {
    if (!a) return;
    a._vol = a._vol || { v: a.volume };
    a._vol.v = a.volume;
    if (window.gsap) {
      gsap.killTweensOf(a._vol);
      gsap.to(a._vol, {
        v: lim(alvo), duration: Math.max(0.01, dur), ease: "none",
        onUpdate: () => { a.volume = lim(a._vol.v); },
        onComplete: () => { if (depois) depois(); },
      });
    } else {
      a.volume = lim(alvo);
      if (depois) depois();
    }
  }

  function tocar(nome, op) {
    op = op || {};
    const def = EFEITOS[nome];
    if (!def) return null;
    const pool = pools[nome];
    let a = pool.find((x) => x.paused || x.ended);
    if (!a) { a = criar(BASE + def.f); pool.push(a); }
    if (a._vol && window.gsap) gsap.killTweensOf(a._vol);
    a.loop = !!op.loop;
    a.volume = lim(op.vol != null ? op.vol : def.v);
    try { a.currentTime = op.inicio || 0; } catch (e) { /* ainda carregando */ }
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
    if (op.dur) {
      const alvo = a;
      setTimeout(() => rampa(alvo, 0, op.fade || 0.5, () => alvo.pause()), op.dur * 1000);
    }
    return a;
  }

  function parar(nome, fade) {
    (pools[nome] || []).forEach((a) => {
      if (!a.paused) rampa(a, 0, fade || 0.4, () => a.pause());
    });
  }

  // ---- música -------------------------------------------------------------
  function musicaTocar(de, vol, fadeIn) {
    if (!musica) return;
    volMusicaBase = vol;
    try { musica.currentTime = de || 0; } catch (e) {}
    musica.volume = 0;
    const p = musica.play();
    if (p && p.catch) p.catch(() => {});
    rampa(musica, vol, fadeIn == null ? 1.2 : fadeIn);
  }
  function musicaVolume(vol, dur) {
    if (!musica) return;
    volMusicaBase = vol;
    rampa(musica, lendo ? Math.min(vol, 0.08) : vol, dur == null ? 0.6 : dur);
  }
  function musicaAbaixar(sim) {
    if (!musica) return;
    rampa(musica, sim ? Math.min(volMusicaBase, 0.08) : volMusicaBase, 0.35);
  }
  function musicaPular(de, vol) {
    if (!musica) return;
    volMusicaBase = vol;
    try { musica.currentTime = de; } catch (e) {}
    if (musica._vol && window.gsap) gsap.killTweensOf(musica._vol);
    musica.volume = lim(vol);
    if (musica.paused) { const p = musica.play(); if (p && p.catch) p.catch(() => {}); }
  }
  function musicaParar(dur) {
    if (!musica) return;
    rampa(musica, 0, dur == null ? 1 : dur, () => musica.pause());
  }

  // ---- ambiente noturno (dois players trocando com fade, sem buraco) -------
  function cicloAmbiente() {
    if (!ambLigado) return;
    const a = amb[ambI];
    try { a.currentTime = 0; } catch (e) {}
    a.volume = 0;
    const p = a.play();
    if (p && p.catch) p.catch(() => {});
    rampa(a, ambVol, 0.8);
    const dur = isFinite(a.duration) && a.duration > 1.6 ? a.duration : 3.6;
    ambTimer = setTimeout(() => {
      const velho = a;
      rampa(velho, 0, 0.8, () => velho.pause());
      ambI = 1 - ambI;
      cicloAmbiente();
    }, Math.max(0.8, dur - 0.85) * 1000);
  }
  function ambiente(ligar, vol) {
    if (vol != null) ambVol = vol;
    if (ligar && !ambLigado) {
      ambLigado = true;
      cicloAmbiente();
    } else if (!ligar && ambLigado) {
      ambLigado = false;
      clearTimeout(ambTimer);
      amb.forEach((a) => rampa(a, 0, 0.6, () => a.pause()));
    } else if (ligar) {
      amb.forEach((a) => { if (!a.paused) rampa(a, ambVol, 0.5); });
    }
  }

  // ---- WebAudio: sons sintetizados ----------------------------------------
  function desbloquear() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        mestre = ctx.createGain();
        mestre.gain.value = mudo ? 0 : 0.55;
        mestre.connect(ctx.destination);
      }
      if (ctx.state === "suspended") ctx.resume();
    } catch (e) { ctx = null; }
  }

  function tom(freq, t0, dur, tipo, vol, freqFim, destino) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = tipo || "sine";
    o.frequency.setValueAtTime(freq, t0);
    if (freqFim) o.frequency.exponentialRampToValueAtTime(freqFim, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g);
    g.connect(destino || mestre);
    o.start(t0);
    o.stop(t0 + dur + 0.03);
  }

  let bufRuido = null;
  function ruidoBuffer() {
    if (!bufRuido) {
      const n = ctx.sampleRate * 2;
      bufRuido = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = bufRuido.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    }
    return bufRuido;
  }
  // rajada de ruído filtrado
  function ruido(t0, dur, vol, tipoFiltro, freq, q, freqFim) {
    const src = ctx.createBufferSource();
    src.buffer = ruidoBuffer();
    const f = ctx.createBiquadFilter();
    f.type = tipoFiltro || "bandpass";
    f.frequency.setValueAtTime(freq || 2000, t0);
    if (freqFim) f.frequency.exponentialRampToValueAtTime(freqFim, t0 + dur);
    f.Q.value = q || 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + Math.min(0.02, dur / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(f); f.connect(g); g.connect(mestre);
    src.start(t0, Math.random() * 1.5);
    src.stop(t0 + dur + 0.05);
  }

  function ui(tipo) {
    if (!ctx || mudo) return;
    const t = ctx.currentTime + 0.005;
    switch (tipo) {
      case "tique": tom(1500, t, 0.05, "sine", 0.1); break;
      case "peca": tom(700, t, 0.09, "triangle", 0.2); tom(1050, t + 0.03, 0.08, "sine", 0.08); break;
      case "certo": tom(784, t, 0.2, "triangle", 0.24); tom(1175, t + 0.1, 0.34, "triangle", 0.24); tom(1568, t + 0.2, 0.4, "sine", 0.1); break;
      case "errado": tom(260, t, 0.24, "sine", 0.3, 160); break;
      case "abrir": tom(520, t, 0.12, "sine", 0.14, 820); break;
      case "oops": tom(560, t, 0.13, "triangle", 0.2); tom(420, t + 0.14, 0.22, "triangle", 0.2); break;
      case "estrela": [880, 1109, 1319, 1760].forEach((f, i) => tom(f, t + i * 0.09, 0.32, "triangle", 0.16)); break;
      case "carimbo": tom(120, t, 0.25, "sine", 0.45, 60); ruido(t, 0.08, 0.18, "lowpass", 900); break;
      case "rabisco":
        ruido(t, 0.16, 0.22, "bandpass", 2600, 1.4, 3800);
        ruido(t + 0.2, 0.16, 0.22, "bandpass", 3000, 1.4, 2200);
        break;
      case "flash": ruido(t, 0.05, 0.35, "highpass", 3000); tom(2400, t + 0.01, 0.05, "square", 0.05); ruido(t + 0.09, 0.07, 0.2, "highpass", 4000); break;
      case "papel": ruido(t, 0.32, 0.16, "bandpass", 1400, 0.6, 600); break;
      case "alfinete": tom(1900, t, 0.06, "square", 0.05); ruido(t, 0.03, 0.15, "highpass", 5000); break;
      case "tecla": ruido(t, 0.03, 0.18, "bandpass", 3500, 2); tom(220, t, 0.03, "sine", 0.06); break;
      case "pop": tom(500, t, 0.08, "sine", 0.18, 1200); break;
      case "farejar": [0, 0.13, 0.26].forEach((d) => ruido(t + d, 0.08, 0.2, "highpass", 2500)); break;
      case "achou": [659, 880, 1319].forEach((f, i) => tom(f, t + i * 0.07, 0.25, "triangle", 0.17)); break;
      case "imprensa":
        for (let i = 0; i < 6; i++) ruido(t + i * 0.09, 0.06, 0.16, "bandpass", 900, 1.2);
        tom(160, t + 0.56, 0.3, "sine", 0.3, 90);
        break;
      case "luz": tom(330, t, 0.5, "sine", 0.1, 990); break;
      default: break;
    }
  }

  // vozes "falantes": um bipe curto a cada sílaba enquanto o texto aparece
  const VOZES = {
    til: { base: 640, var: 150, tipo: "triangle", dur: 0.05, vol: 0.075 },
    grave: { base: 210, var: 50, tipo: "square", dur: 0.06, vol: 0.035 },
    media: { base: 330, var: 70, tipo: "square", dur: 0.055, vol: 0.033 },
    aguda: { base: 470, var: 90, tipo: "triangle", dur: 0.05, vol: 0.07 },
  };
  function blip(voz) {
    if (!ctx || mudo || lendo) return;
    const v = VOZES[voz] || VOZES.til;
    const t = ctx.currentTime + 0.002;
    const f = v.base + (Math.random() * 2 - 1) * v.var;
    tom(f, t, v.dur, v.tipo, v.vol, f * 0.9);
  }

  function estatica(dur, vol) {
    if (!ctx || mudo) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = ruidoBuffer();
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2600;
    bp.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.03);
    g.gain.setValueAtTime(vol || 0.12, t + Math.max(0.05, dur - 0.12));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp); bp.connect(g); g.connect(mestre);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  // ambientes sintetizados de cada local (vento no telhado, zumbido dos monitores)
  let sint = null;
  function ambienteSint(tipo) {
    if (sint) {
      const s = sint;
      sint = null;
      try {
        const t = ctx.currentTime;
        s.g.gain.cancelScheduledValues(t);
        s.g.gain.setValueAtTime(s.g.gain.value, t);
        s.g.gain.linearRampToValueAtTime(0, t + 0.6);
        setTimeout(() => s.nos.forEach((n) => { try { n.stop(); } catch (e) {} }), 800);
      } catch (e) {}
    }
    if (!tipo || !ctx) return;
    const t = ctx.currentTime;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.connect(mestre);
    const nos = [];
    if (tipo === "vento") {
      const src = ctx.createBufferSource();
      src.buffer = ruidoBuffer();
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 520;
      f.Q.value = 1.4;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.13;
      const lg = ctx.createGain();
      lg.gain.value = 260;
      lfo.connect(lg); lg.connect(f.frequency);
      src.connect(f); f.connect(g);
      src.start(t); lfo.start(t);
      nos.push(src, lfo);
      g.gain.linearRampToValueAtTime(0.16, t + 1.2);
    } else if (tipo === "zumbido") {
      [55, 110, 165].forEach((fr, i) => {
        const o = ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = fr;
        const og = ctx.createGain();
        og.gain.value = [0.5, 0.25, 0.1][i];
        o.connect(og); og.connect(g);
        o.start(t);
        nos.push(o);
      });
      const src = ctx.createBufferSource();
      src.buffer = ruidoBuffer();
      src.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = "highpass";
      f.frequency.value = 6000;
      const ng = ctx.createGain();
      ng.gain.value = 0.25;
      src.connect(f); f.connect(ng); ng.connect(g);
      src.start(t);
      nos.push(src);
      g.gain.linearRampToValueAtTime(0.05, t + 1);
    }
    sint = { g, nos };
  }

  // ---- leitura em voz alta (se o computador tiver voz em português) -------
  let voz = null;
  function carregarVozes() {
    if (!("speechSynthesis" in window)) { document.body.classList.add("sem-voz"); return; }
    const vs = window.speechSynthesis.getVoices() || [];
    voz = vs.find((v) => /pt[-_]BR/i.test(v.lang)) || vs.find((v) => /^pt/i.test(v.lang)) || null;
    document.body.classList.toggle("sem-voz", !voz);
  }
  function ler(texto) {
    if (!voz || mudo || !("speechSynthesis" in window)) return false;
    const limpo = String(texto).replace(/<[^>]+>/g, "").replace(/[“”]/g, "").replace(/~/g, " til ");
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(limpo);
    u.voice = voz;
    u.lang = voz.lang;
    u.rate = 0.98;
    lendo = true;
    musicaAbaixar(true);
    u.onend = u.onerror = () => { lendo = false; musicaAbaixar(false); };
    window.speechSynthesis.speak(u);
    return true;
  }
  function calar() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    lendo = false;
  }

  // ---- geral ----------------------------------------------------------------
  function setMudo(m) {
    mudo = !!m;
    todos.forEach((a) => { a.muted = mudo; });
    const v = document.getElementById("video");
    if (v) v.muted = mudo;
    if (mestre) mestre.gain.value = mudo ? 0 : 0.55;
    if (mudo) calar();
  }

  function pararTudo() {
    ambLigado = false;
    clearTimeout(ambTimer);
    todos.forEach((a) => {
      if (a._vol && window.gsap) gsap.killTweensOf(a._vol);
      a.pause();
    });
    ambienteSint(null);
    calar();
  }

  carregar();
  if ("speechSynthesis" in window) {
    carregarVozes();
    window.speechSynthesis.onvoiceschanged = carregarVozes;
  } else {
    document.addEventListener("DOMContentLoaded", carregarVozes);
  }

  return {
    tocar, parar, ui, blip, estatica, desbloquear, ambienteSint,
    musicaTocar, musicaVolume, musicaPular, musicaParar, musicaAbaixar,
    ambiente, ler, calar, setMudo, pararTudo,
    get mudo() { return mudo; },
    get temVoz() { return !!voz; },
    get lendo() { return lendo; },
  };
})();
