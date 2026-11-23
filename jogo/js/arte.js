/* O Roubo Perfeito 2.0 — arte vetorial (mesma estética da cutscene: formas chapadas,
   luz noturna, dourado #e8b04a, rubi #e0284a, azul-noite #0a1628). */
window.ARTE = (function () {
  "use strict";

  const r1 = (n) => Math.round(n * 10) / 10;

  function escurecer(hex, k) {
    const n = parseInt(hex.slice(1), 16);
    const c = (sh) => Math.max(0, Math.min(255, Math.round(((n >> sh) & 255) * k)));
    return "#" + ((1 << 24) | (c(16) << 16) | (c(8) << 8) | c(0)).toString(16).slice(1);
  }

  function semente(s) {
    let x = s % 2147483647;
    if (x <= 0) x += 2147483646;
    return () => (x = (x * 16807) % 2147483647) / 2147483647;
  }

  function estrelas(n, x0, y0, x1, y1, seed, cor) {
    const rnd = semente(seed);
    let s = "";
    for (let i = 0; i < n; i++) {
      s += `<circle cx="${r1(x0 + rnd() * (x1 - x0))}" cy="${r1(y0 + rnd() * (y1 - y0))}" r="${r1(0.6 + rnd() * 1.6)}" fill="${cor || "#e8eef7"}" opacity="${r1(0.3 + rnd() * 0.6)}"/>`;
    }
    return s;
  }

  // ---------------------------------------------------------------------------
  // FIGURA HUMANA (vista de frente). Altura real: 3 px por centímetro.
  // ---------------------------------------------------------------------------
  const ROUPAS = {
    vigia: { camisa: "#2b3a5c", calca: "#1b2233", manga: "#2b3a5c" },
    curadora: { camisa: "#e9e1cf", calca: "#1d1d24", manga: "#7e1626" },
    pintor: { camisa: "#3d5a78", calca: "#2f4a6e", manga: "#3d5a78" },
    macacao: { camisa: "#5d7f9e", calca: "#506f8c", manga: "#5d7f9e" },
    terno: { camisa: "#e9ecf0", calca: "#263a29", manga: "#2d4430" },
    gari: { camisa: "#d9622b", calca: "#c4561f", manga: "#d9622b" },
    trench: { camisa: "#2b3a5c", calca: "#1b2233", manga: "#b8955e" },
    sobretudo: { camisa: "#e9ecf0", calca: "#1b2233", manga: "#4a4f5c" },
    cachecol: { camisa: "#2b3a5c", calca: "#1b2233", manga: "#2b3a5c" },
    jaqueta: { camisa: "#e9ecf0", calca: "#1b2233", manga: "#2f4a6e" },
  };
  const CORPOS = { magro: [10.6, 8.0, 3.9], medio: [12, 9.2, 4.3], robusto: [13.4, 11, 4.8] };

  function figuraCorpo(s, op) {
    op = op || {};
    const sil = !!op.silhueta;
    const v = s.visual;
    const H = s.cm * 3;
    const u = H / 100;
    const cx = 120;
    const C = (cor) => (sil ? "#0c0c10" : cor);
    const P = (n) => r1(n * u);
    const X = (n) => r1(cx + n * u);
    const pele = C(v.pele);
    const peleS = C(escurecer(v.pele, 0.78));
    const cab = C(v.cabeloCor);
    const cabS = C(escurecer(v.cabeloCor, 0.7));
    const R = ROUPAS[v.roupa];
    const [sw, ww, braco] = CORPOS[v.corpo];
    const yO = 18, yC = 49;
    const botas = s.calcado === "botas";
    const fimCalca = botas ? 86 : 96.4;
    const pc = (ww + 0.3) / 2;
    let g = "";

    if (v.cabeloEstilo === "longo") {
      g += `<path fill="${cab}" d="M${X(-6.3)} ${P(5.6)} C${X(-7.4)} ${P(12)} ${X(-7.8)} ${P(19)} ${X(-7)} ${P(24.5)} Q${X(-5.6)} ${P(23)} ${X(-4.6)} ${P(25)} Q${X(-3.8)} ${P(23.4)} ${X(-3)} ${P(24)} L${X(3)} ${P(24)} Q${X(3.8)} ${P(23.4)} ${X(4.6)} ${P(25)} Q${X(5.6)} ${P(23)} ${X(7)} ${P(24.5)} C${X(7.8)} ${P(19)} ${X(7.4)} ${P(12)} ${X(6.3)} ${P(5.6)} C${X(6.1)} ${P(-1.4)} ${X(-6.1)} ${P(-1.4)} ${X(-6.3)} ${P(5.6)} Z"/>`;
    }

    if (v.roupa === "curadora") {
      const perna = C("#3a2c2a");
      g += `<rect x="${X(-pc - 2.1)}" y="${P(66)}" width="${P(4.2)}" height="${P(22)}" fill="${perna}"/>`;
      g += `<rect x="${X(pc - 2.1)}" y="${P(66)}" width="${P(4.2)}" height="${P(22)}" fill="${perna}"/>`;
      g += `<path fill="${C(R.calca)}" d="M${X(-ww - 0.3)} ${P(yC - 2)} L${X(ww + 0.3)} ${P(yC - 2)} L${X(ww + 2.4)} ${P(70)} L${X(-ww - 2.4)} ${P(70)} Z"/>`;
    } else {
      g += `<path fill="${C(R.calca)}" d="M${X(-ww)} ${P(yC - 2)} L${X(ww)} ${P(yC - 2)} L${X(ww - 0.5)} ${P(fimCalca)} L${X(0.8)} ${P(fimCalca)} L${X(0)} ${P(yC + 7)} L${X(-0.8)} ${P(fimCalca)} L${X(-ww + 0.5)} ${P(fimCalca)} Z"/>`;
      if (v.roupa === "gari") {
        g += `<rect x="${X(-ww + 0.4)}" y="${P(78)}" width="${P(ww - 1.4)}" height="${P(1.6)}" fill="${C("#e9ecf0")}" opacity="0.85"/>`;
        g += `<rect x="${X(1)}" y="${P(78)}" width="${P(ww - 1.4)}" height="${P(1.6)}" fill="${C("#e9ecf0")}" opacity="0.85"/>`;
      }
    }

    [-pc, pc].forEach((xc) => {
      if (botas) {
        const b = C(v.sapatoCor);
        g += `<rect x="${X(xc - 3.6)}" y="${P(84.5)}" width="${P(7.2)}" height="${P(12.5)}" rx="${P(1)}" fill="${b}"/>`;
        g += `<rect x="${X(xc - 3.9)}" y="${P(84)}" width="${P(7.8)}" height="${P(1.9)}" rx="${P(0.6)}" fill="${C(escurecer(v.sapatoCor, 1.55))}"/>`;
        g += `<rect x="${X(xc - 4.8)}" y="${P(95.3)}" width="${P(9.6)}" height="${P(3.9)}" rx="${P(1.8)}" fill="${b}"/>`;
        g += `<rect x="${X(xc - 5)}" y="${P(98.6)}" width="${P(10)}" height="${P(1.4)}" rx="${P(0.5)}" fill="${C("#0a0a0c")}"/>`;
        if (!sil) g += `<rect x="${X(xc + 1.2)}" y="${P(86.5)}" width="${P(1)}" height="${P(8)}" rx="${P(0.5)}" fill="#ffffff" opacity="0.16"/>`;
      } else {
        g += `<rect x="${X(xc - 4.7)}" y="${P(94.8)}" width="${P(9.4)}" height="${P(4.6)}" rx="${P(2)}" fill="${C(v.sapatoCor)}"/>`;
        g += `<rect x="${X(xc - 5)}" y="${P(98.4)}" width="${P(10)}" height="${P(1.6)}" rx="${P(0.6)}" fill="${C("#c8ccd2")}"/>`;
        g += `<path d="M${X(xc - 3.6)} ${P(97.2)} L${X(xc + 3.4)} ${P(95.9)}" stroke="${C(v.tenisCor || "#e0284a")}" stroke-width="${P(1.1)}" stroke-linecap="round"/>`;
        if (!sil) g += `<path d="M${X(xc - 1.2)} ${P(95.6)} h${P(2.4)} M${X(xc - 1.2)} ${P(96.6)} h${P(2.4)}" stroke="#aab0b8" stroke-width="${P(0.35)}"/>`;
      }
    });

    g += `<rect x="${X(-2)}" y="${P(12)}" width="${P(4)}" height="${P(7.5)}" fill="${peleS}"/>`;
    const tronco = `M${X(-sw + 2.4)} ${P(yO)} Q${X(-sw)} ${P(yO)} ${X(-sw)} ${P(yO + 3)} L${X(-ww)} ${P(yC)} L${X(ww)} ${P(yC)} L${X(sw)} ${P(yO + 3)} Q${X(sw)} ${P(yO)} ${X(sw - 2.4)} ${P(yO)} Z`;
    g += `<path fill="${C(R.camisa)}" d="${tronco}"/>`;
    if (!sil) g += detalhesRoupa(v, X, P, sw, ww, yO, yC);

    const mE = { x: -sw - 0.4, y: yC + 2.2 };
    const mD = { x: sw + 0.4, y: yC + 2.2 };
    g += `<path d="M${X(-sw + 1.6)} ${P(yO + 2.2)} L${X(mE.x)} ${P(yC)}" stroke="${C(R.manga)}" stroke-width="${P(braco)}" stroke-linecap="round" fill="none"/>`;
    g += `<path d="M${X(sw - 1.6)} ${P(yO + 2.2)} L${X(mD.x)} ${P(yC)}" stroke="${C(R.manga)}" stroke-width="${P(braco)}" stroke-linecap="round" fill="none"/>`;
    if (v.roupa === "gari" && !sil) {
      g += `<path d="M${X(-sw - 0.2)} ${P(38)} l${P(-0.4)} ${P(2)} M${X(sw + 0.2)} ${P(38)} l${P(0.4)} ${P(2)}" stroke="#e9ecf0" stroke-width="${P(braco)}" opacity="0.8"/>`;
    }
    if (v.roupa === "cachecol" && !sil) {
      g += `<rect x="${X(1.2)}" y="${P(yO + 0.6)}" width="${P(2.8)}" height="${P(13)}" rx="${P(0.8)}" fill="#e8b04a"/>`;
      g += `<path d="M${X(1.2)} ${P(yO + 9)} h${P(2.8)} M${X(1.2)} ${P(yO + 11)} h${P(2.8)}" stroke="#b9862c" stroke-width="${P(0.6)}"/>`;
    }
    g += acessorio(v, X, P, mE, mD, H, C, sil);
    g += `<circle cx="${X(mE.x)}" cy="${P(mE.y)}" r="${P(2.2)}" fill="${pele}"/>`;
    g += `<circle cx="${X(mD.x)}" cy="${P(mD.y)}" r="${P(2.2)}" fill="${pele}"/>`;
    if (v.acessorio === "bengala") {
      g += `<path d="M${X(mD.x - 1.6)} ${P(mD.y - 1.4)} Q${X(mD.x)} ${P(mD.y - 4.6)} ${X(mD.x + 1.8)} ${P(mD.y - 1.6)}" stroke="${C("#e8b04a")}" stroke-width="${P(1.2)}" fill="none" stroke-linecap="round"/>`;
    }
    if (v.acessorio === "pincel") {
      g += `<path d="M${X(mD.x - 0.4)} ${P(mD.y + 0.8)} L${X(mD.x + 2.6)} ${P(mD.y - 9)}" stroke="${C("#8a6a44")}" stroke-width="${P(1)}" stroke-linecap="round"/>`;
      g += `<path d="M${X(mD.x + 2.3)} ${P(mD.y - 8)} L${X(mD.x + 3)} ${P(mD.y - 10.4)}" stroke="${C("#c9c2b0")}" stroke-width="${P(1.4)}"/>`;
      g += `<ellipse cx="${X(mD.x + 3.2)}" cy="${P(mD.y - 11.4)}" rx="${P(0.9)}" ry="${P(1.4)}" fill="${C("#e0284a")}"/>`;
    }

    if (v.cabeloEstilo === "puffs") {
      g += `<circle cx="${X(-4.9)}" cy="${P(0.6)}" r="${P(2.9)}" fill="${cab}"/><circle cx="${X(4.9)}" cy="${P(0.6)}" r="${P(2.9)}" fill="${cab}"/>`;
    }
    g += `<ellipse cx="${X(-5.3)}" cy="${P(8.2)}" rx="${P(1)}" ry="${P(1.6)}" fill="${pele}"/>`;
    g += `<ellipse cx="${X(5.3)}" cy="${P(8.2)}" rx="${P(1)}" ry="${P(1.6)}" fill="${pele}"/>`;
    g += `<ellipse cx="${cx}" cy="${P(7.4)}" rx="${P(5.4)}" ry="${P(6.8)}" fill="${pele}"/>`;
    if (!sil) {
      g += `<path d="M${X(-4.2)} ${P(11.2)} Q${X(0)} ${P(15.6)} ${X(4.2)} ${P(11.2)} Q${X(0)} ${P(14.6)} ${X(-4.2)} ${P(11.2)} Z" fill="${peleS}" opacity="0.35"/>`;
      g += `<g class="olhos"><ellipse cx="${X(-2.1)}" cy="${P(8)}" rx="${P(0.62)}" ry="${P(0.8)}" fill="#1a1414"/><ellipse cx="${X(2.1)}" cy="${P(8)}" rx="${P(0.62)}" ry="${P(0.8)}" fill="#1a1414"/></g>`;
      const sob = escurecer(v.cabeloCor, v.cabeloCor > "#a" ? 0.55 : 0.9);
      g += `<path d="M${X(-3.3)} ${P(6)} Q${X(-2.2)} ${P(5.3)} ${X(-1.1)} ${P(5.9)} M${X(3.3)} ${P(6)} Q${X(2.2)} ${P(5.3)} ${X(1.1)} ${P(5.9)}" stroke="${sob}" stroke-width="${P(0.6)}" stroke-linecap="round" fill="none"/>`;
      g += `<path d="M${X(-0.1)} ${P(8.6)} Q${X(0.9)} ${P(10.3)} ${X(-0.2)} ${P(10.6)}" stroke="${peleS}" stroke-width="${P(0.5)}" stroke-linecap="round" fill="none"/>`;
      g += `<path d="M${X(-1.5)} ${P(12.1)} Q${X(0)} ${P(12.9)} ${X(1.5)} ${P(12.1)}" stroke="#6b2f2f" stroke-width="${P(0.5)}" stroke-linecap="round" fill="none"/>`;
      if (v.sardas) {
        [[-2.6, 10], [-3.3, 9.6], [-2, 9.5], [2.6, 10], [3.3, 9.6], [2, 9.5]].forEach(([a, b]) => {
          g += `<circle cx="${X(a)}" cy="${P(b)}" r="${P(0.24)}" fill="#c47a52"/>`;
        });
      }
    }
    if (v.bigode) {
      g += `<path fill="${cab}" d="M${X(-2.5)} ${P(11.3)} Q${X(-1.2)} ${P(10.1)} ${X(0)} ${P(10.9)} Q${X(1.2)} ${P(10.1)} ${X(2.5)} ${P(11.3)} Q${X(1.2)} ${P(12)} ${X(0)} ${P(11.5)} Q${X(-1.2)} ${P(12)} ${X(-2.5)} ${P(11.3)} Z"/>`;
    }
    g += cabeloFrente(v, X, P, cab, cabS, C);
    if (!sil && s.oculos === "sim") g += oculos(v, X, P);
    return { svg: g, H };
  }

  // painéis de casaco abertos (blazer, terno, sobretudo, jaqueta...)
  function paineis(X, P, sw, ww, yO, yC, cor, lapela, abertura) {
    const ab = abertura || 1.4;
    const lado = (sgn) => `M${X(sgn * (sw - 2.4))} ${P(yO)} Q${X(sgn * sw)} ${P(yO)} ${X(sgn * sw)} ${P(yO + 3)} L${X(sgn * (ww + 0.5))} ${P(yC + 1.2)} L${X(sgn * ab)} ${P(yC + 1.2)} L${X(sgn * (ab + 0.2))} ${P(yO + 10)} L${X(sgn * 2.4)} ${P(yO)} Z`;
    let g = `<path d="${lado(-1)}" fill="${cor}"/><path d="${lado(1)}" fill="${cor}"/>`;
    if (lapela) g += `<path d="M${X(-2.4)} ${P(yO)} L${X(-ab - 0.2)} ${P(yO + 10)} L${X(-4.6)} ${P(yO + 5)} Z M${X(2.4)} ${P(yO)} L${X(ab + 0.2)} ${P(yO + 10)} L${X(4.6)} ${P(yO + 5)} Z" fill="${lapela}"/>`;
    return g;
  }

  function detalhesRoupa(v, X, P, sw, ww, yO, yC) {
    let g = "";
    if (v.roupa === "vigia") {
      g += `<path d="M${X(-2.6)} ${P(yO)} L${X(0)} ${P(yO + 4)} L${X(2.6)} ${P(yO)} Z" fill="#1d2840"/>`;
      g += `<rect x="${X(-sw + 0.8)}" y="${P(yO + 0.4)}" width="${P(4)}" height="${P(1.4)}" fill="#1d2840"/>`;
      g += `<rect x="${X(sw - 4.8)}" y="${P(yO + 0.4)}" width="${P(4)}" height="${P(1.4)}" fill="#1d2840"/>`;
      g += `<rect x="${X(-ww + 1.6)}" y="${P(25)}" width="${P(5)}" height="${P(3.4)}" rx="${P(0.4)}" fill="#24324d"/>`;
      g += `<rect x="${X(ww - 6.6)}" y="${P(25)}" width="${P(5)}" height="${P(3.4)}" rx="${P(0.4)}" fill="#24324d"/>`;
      g += estrela(X(-ww + 4.1), P(30.6), P(1.7), "#e8b04a");
      g += `<path d="M${X(0)} ${P(yO + 4)} V${P(yC - 3)}" stroke="#22304d" stroke-width="${P(0.5)}"/>`;
      g += `<rect x="${X(-ww)}" y="${P(yC - 3.2)}" width="${P(ww * 2)}" height="${P(2.1)}" fill="#111216"/>`;
      g += `<rect x="${X(-1.4)}" y="${P(yC - 3.4)}" width="${P(2.8)}" height="${P(2.5)}" rx="${P(0.3)}" fill="#e8b04a"/>`;
    } else if (v.roupa === "curadora") {
      g += paineis(X, P, sw, ww, yO, yC, "#7e1626", "#5e0f1c", 1.4);
      g += `<circle cx="${X(-2)}" cy="${P(36)}" r="${P(0.6)}" fill="#e8b04a"/><circle cx="${X(-2)}" cy="${P(41)}" r="${P(0.6)}" fill="#e8b04a"/>`;
      g += `<path d="M${X(-1.4)} ${P(yO)} Q${X(0)} ${P(yO + 2.4)} ${X(1.4)} ${P(yO)}" stroke="#e8b04a" stroke-width="${P(0.45)}" fill="none"/>`;
    } else if (v.roupa === "pintor") {
      g += `<path d="M${X(-2.4)} ${P(yO)} L${X(0)} ${P(yO + 3)} L${X(2.4)} ${P(yO)} Z" fill="#2e4660"/>`;
      g += `<path d="M${X(-4.4)} ${P(24)} L${X(-2.6)} ${P(yO + 0.6)} M${X(4.4)} ${P(24)} L${X(2.6)} ${P(yO + 0.6)}" stroke="#a8977a" stroke-width="${P(0.8)}"/>`;
      g += `<rect x="${X(-4.6)}" y="${P(23.5)}" width="${P(9.2)}" height="${P(6)}" rx="${P(0.6)}" fill="#cdbb9c"/>`;
      g += `<path d="M${X(-ww + 0.4)} ${P(29)} L${X(ww - 0.4)} ${P(29)} L${X(ww + 0.6)} ${P(70)} L${X(-ww - 0.6)} ${P(70)} Z" fill="#cdbb9c"/>`;
      g += `<rect x="${X(-3)}" y="${P(40)}" width="${P(6)}" height="${P(4.6)}" rx="${P(0.5)}" fill="#bba985"/>`;
      [[-3.6, 26, "#e0284a"], [2.4, 33, "#2a6bff"], [-4.6, 52, "#e8b04a"], [4.2, 58, "#e0284a"], [-1, 63, "#2a6bff"], [3, 47, "#e8b04a"]].forEach(([a, b, c]) => {
        g += `<circle cx="${X(a)}" cy="${P(b)}" r="${P(0.9)}" fill="${c}"/>`;
      });
    } else if (v.roupa === "macacao") {
      g += `<path d="M${X(0)} ${P(yO + 1)} V${P(yC + 6)}" stroke="#3f5a75" stroke-width="${P(0.5)}"/>`;
      g += `<rect x="${X(-ww + 1.4)}" y="${P(24.5)}" width="${P(4.6)}" height="${P(4)}" rx="${P(0.4)}" fill="#4f6f8c"/>`;
      g += `<path d="M${X(-sw + 2.6)} ${P(yO + 0.6)} L${X(-2.6)} ${P(yC - 2.4)} M${X(sw - 2.6)} ${P(yO + 0.6)} L${X(2.6)} ${P(yC - 2.4)}" stroke="#8e1b2b" stroke-width="${P(1.3)}"/>`;
      g += `<rect x="${X(-ww)}" y="${P(yC - 3.4)}" width="${P(ww * 2)}" height="${P(2.2)}" fill="#8e1b2b"/>`;
      g += `<ellipse cx="${X(-(ww + 0.3) / 2)}" cy="${P(yC + 5)}" rx="${P(4.3)}" ry="${P(1.1)}" fill="none" stroke="#8e1b2b" stroke-width="${P(1.2)}"/>`;
      g += `<ellipse cx="${X((ww + 0.3) / 2)}" cy="${P(yC + 5)}" rx="${P(4.3)}" ry="${P(1.1)}" fill="none" stroke="#8e1b2b" stroke-width="${P(1.2)}"/>`;
      g += `<circle cx="${X(0)}" cy="${P(yC - 0.6)}" r="${P(1.5)}" fill="none" stroke="#c9c2b0" stroke-width="${P(0.6)}"/>`;
    } else if (v.roupa === "terno") {
      g += paineis(X, P, sw, ww, yO, yC, "#2d4430", "#203222", 0.6);
      g += `<path d="M${X(-2.6)} ${P(yO - 0.2)} L${X(0)} ${P(yO + 1.2)} L${X(-2.6)} ${P(yO + 2.6)} Z M${X(2.6)} ${P(yO - 0.2)} L${X(0)} ${P(yO + 1.2)} L${X(2.6)} ${P(yO + 2.6)} Z" fill="#e0284a"/>`;
      g += `<circle cx="${X(0)}" cy="${P(yO + 1.2)}" r="${P(0.7)}" fill="#a3112e"/>`;
      g += `<path d="M${X(-ww + 1.2)} ${P(27)} l${P(2.2)} ${P(-1.6)} l${P(1.2)} ${P(1.6)} Z" fill="#e8b04a"/>`;
      g += `<circle cx="${X(-0.4)}" cy="${P(38)}" r="${P(0.55)}" fill="#e8b04a"/><circle cx="${X(-0.4)}" cy="${P(43)}" r="${P(0.55)}" fill="#e8b04a"/>`;
    } else if (v.roupa === "gari") {
      g += `<rect x="${X(-ww - 0.6)}" y="${P(31)}" width="${P(ww * 2 + 1.2)}" height="${P(1.7)}" fill="#e9ecf0" opacity="0.85"/>`;
      g += `<rect x="${X(-ww - 0.4)}" y="${P(35)}" width="${P(ww * 2 + 0.8)}" height="${P(1.7)}" fill="#e9ecf0" opacity="0.85"/>`;
      g += `<path d="M${X(-2.4)} ${P(yO)} L${X(0)} ${P(yO + 3)} L${X(2.4)} ${P(yO)} Z" fill="#a8461a"/>`;
    } else if (v.roupa === "trench") {
      g += paineis(X, P, sw, ww, yO, yC, "#b8955e", "#a07f4b", 1.8);
      g += `<path d="M${X(-2.4)} ${P(yO - 0.8)} L${X(-5.6)} ${P(yO + 2.6)} L${X(-2.2)} ${P(yO + 3.2)} Z M${X(2.4)} ${P(yO - 0.8)} L${X(5.6)} ${P(yO + 2.6)} L${X(2.2)} ${P(yO + 3.2)} Z" fill="#a07f4b"/>`;
      g += `<rect x="${X(-ww - 0.3)}" y="${P(yC - 5)}" width="${P(ww - 1.5)}" height="${P(1.9)}" fill="#8a6a44"/><rect x="${X(1.8)}" y="${P(yC - 5)}" width="${P(ww - 1.5)}" height="${P(1.9)}" fill="#8a6a44"/>`;
      g += `<circle cx="${X(-3.4)}" cy="${P(30)}" r="${P(0.6)}" fill="#5a4630"/><circle cx="${X(3.4)}" cy="${P(30)}" r="${P(0.6)}" fill="#5a4630"/>`;
    } else if (v.roupa === "sobretudo") {
      g += paineis(X, P, sw, ww, yO, yC, "#4a4f5c", "#3a3e48", 1.6);
      g += `<path d="M${X(-0.9)} ${P(yO + 0.6)} L${X(0.9)} ${P(yO + 0.6)} L${X(1.4)} ${P(yO + 13)} L${X(0)} ${P(yO + 15)} L${X(-1.4)} ${P(yO + 13)} Z" fill="#7e1626"/>`;
    } else if (v.roupa === "cachecol") {
      g += `<path d="M${X(-sw + 2)} ${P(yO + 6)} H${X(sw - 2)}" stroke="#24324d" stroke-width="${P(0.5)}" opacity="0.8"/>`;
      g += `<rect x="${X(-4.4)}" y="${P(yO - 1.8)}" width="${P(8.8)}" height="${P(3.6)}" rx="${P(1.5)}" fill="#e8b04a"/>`;
      g += `<path d="M${X(-3)} ${P(yO - 0.4)} h${P(6)}" stroke="#b9862c" stroke-width="${P(0.5)}"/>`;
    } else if (v.roupa === "jaqueta") {
      g += paineis(X, P, sw, ww, yO, yC, "#2f4a6e", null, 2);
      g += `<path d="M${X(-2.2)} ${P(yO + 1)} V${P(yC)} M${X(2.2)} ${P(yO + 1)} V${P(yC)}" stroke="#a8b4c8" stroke-width="${P(0.45)}"/>`;
      g += `<path d="M${X(-2.6)} ${P(yO - 0.6)} L${X(-5)} ${P(yO + 2.2)} L${X(-2.2)} ${P(yO + 2.6)} Z M${X(2.6)} ${P(yO - 0.6)} L${X(5)} ${P(yO + 2.2)} L${X(2.2)} ${P(yO + 2.6)} Z" fill="#24395a"/>`;
    }
    return g;
  }

  function estrela(cx, cy, r, cor) {
    let pts = "";
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rr = i % 2 ? r * 0.45 : r;
      pts += `${r1(cx + Math.cos(a) * rr)},${r1(cy + Math.sin(a) * rr)} `;
    }
    return `<polygon points="${pts}" fill="${cor}"/>`;
  }

  function acessorio(v, X, P, mE, mD, H, C, sil) {
    let g = "";
    if (v.acessorio === "lanterna") {
      g += `<rect x="${X(mD.x - 1.5)}" y="${P(mD.y - 0.6)}" width="${P(3)}" height="${P(9)}" rx="${P(0.8)}" fill="${C("#2a2e36")}"/>`;
      g += `<rect x="${X(mD.x - 1.9)}" y="${P(mD.y + 7.6)}" width="${P(3.8)}" height="${P(2.2)}" rx="${P(0.6)}" fill="${C("#3a3f49")}"/>`;
      if (!sil) {
        g += `<ellipse cx="${X(mD.x)}" cy="${P(mD.y + 10)}" rx="${P(1.6)}" ry="${P(0.7)}" fill="#ffd89a"/>`;
        g += `<circle cx="${X(mD.x)}" cy="${P(mD.y + 11)}" r="${P(3.6)}" fill="#ffd89a" opacity="0.18"/>`;
      }
    } else if (v.acessorio === "prancheta") {
      g += `<rect x="${X(mE.x - 0.8)}" y="${P(mE.y - 8.6)}" width="${P(7.4)}" height="${P(10)}" rx="${P(0.6)}" fill="${C("#b8892f")}" transform="rotate(-8 ${X(mE.x)} ${P(mE.y)})"/>`;
      if (!sil) {
        g += `<rect x="${X(mE.x - 0.1)}" y="${P(mE.y - 7.6)}" width="${P(6)}" height="${P(8.4)}" fill="#efe8d8" transform="rotate(-8 ${X(mE.x)} ${P(mE.y)})"/>`;
        g += `<path d="M${X(mE.x + 0.6)} ${P(mE.y - 5)} h${P(4)} M${X(mE.x + 0.6)} ${P(mE.y - 3.4)} h${P(4)} M${X(mE.x + 0.6)} ${P(mE.y - 1.8)} h${P(3)}" stroke="#9a907c" stroke-width="${P(0.35)}" transform="rotate(-8 ${X(mE.x)} ${P(mE.y)})"/>`;
      }
    } else if (v.acessorio === "rodo") {
      g += `<path d="M${X(mE.x)} ${P(mE.y + 1)} L${X(mE.x - 0.4)} ${P(mE.y - 15)}" stroke="${C("#c9c2b0")}" stroke-width="${P(0.9)}" stroke-linecap="round"/>`;
      g += `<rect x="${X(mE.x - 4.6)}" y="${P(mE.y - 16.6)}" width="${P(8.6)}" height="${P(1.6)}" rx="${P(0.4)}" fill="${C("#5d7f9e")}"/>`;
      g += `<rect x="${X(mE.x - 4.8)}" y="${P(mE.y - 17.4)}" width="${P(9)}" height="${P(0.9)}" fill="${C("#1a1a1d")}"/>`;
    } else if (v.acessorio === "bengala") {
      g += `<path d="M${X(mD.x + 0.6)} ${P(mD.y)} L${X(mD.x + 1.4)} ${r1(H - 0.6)}" stroke="${C("#3a2a1e")}" stroke-width="${P(1.1)}" stroke-linecap="round"/>`;
    } else if (v.acessorio === "vassoura") {
      g += `<path d="M${X(mD.x - 1.6)} ${P(mD.y - 24)} L${X(mD.x + 2.6)} ${P(91)}" stroke="${C("#8a6a44")}" stroke-width="${P(1.1)}" stroke-linecap="round"/>`;
      g += `<path d="M${X(mD.x + 0.4)} ${P(90)} L${X(mD.x + 5)} ${P(90)} L${X(mD.x + 7.2)} ${P(99.6)} L${X(mD.x - 1.6)} ${P(99.6)} Z" fill="${C("#c9a46a")}"/>`;
      if (!sil) g += `<path d="M${X(mD.x + 1.2)} ${P(92)} L${X(mD.x + 0.4)} ${P(99.4)} M${X(mD.x + 2.8)} ${P(92)} L${X(mD.x + 2.8)} ${P(99.4)} M${X(mD.x + 4.3)} ${P(92)} L${X(mD.x + 5.2)} ${P(99.4)}" stroke="#a5834b" stroke-width="${P(0.4)}"/>`;
    }
    return g;
  }

  function cabeloFrente(v, X, P, cab, cabS, C) {
    let g = "";
    const est = v.cabeloEstilo;
    const capa = `<path fill="${cab}" d="M${X(-5.65)} ${P(8.6)} C${X(-6.1)} ${P(1.2)} ${X(-2.4)} ${P(-0.5)} ${X(0)} ${P(-0.3)} C${X(2.4)} ${P(-0.5)} ${X(6.1)} ${P(1.2)} ${X(5.65)} ${P(8.6)} L${X(4.9)} ${P(8.4)} C${X(4.7)} ${P(4.4)} ${X(2.2)} ${P(3.1)} ${X(0.2)} ${P(3.3)} C${X(-2.4)} ${P(3)} ${X(-4.7)} ${P(4.4)} ${X(-4.9)} ${P(8.4)} Z"/>`;
    if (est === "curto" || est === "tranca" || est === "puffs") {
      g += capa;
      if (est === "tranca") {
        for (let i = 0; i < 11; i++) {
          const t = i / 10;
          const x = 5.1 + 2.1 * t + 0.5 * Math.sin(t * 3.2);
          const y = 12.4 + 32 * t;
          const rot = i % 2 ? 22 : -22;
          g += `<ellipse cx="${X(x)}" cy="${P(y)}" rx="${P(1.9)}" ry="${P(1.95)}" fill="${cab}" stroke="${cabS}" stroke-width="${P(0.3)}" transform="rotate(${rot} ${X(x)} ${P(y)})"/>`;
        }
        g += `<rect x="${X(5.6)}" y="${P(45)}" width="${P(3)}" height="${P(1.2)}" rx="${P(0.4)}" fill="${C("#e8b04a")}"/>`;
        g += `<path d="M${X(5.9)} ${P(46.2)} L${X(7.1)} ${P(50)} L${X(8.4)} ${P(46.2)} Z" fill="${cab}"/>`;
      }
      if (est === "puffs") {
        g += `<rect x="${X(-3.6)}" y="${P(1.6)}" width="${P(1.4)}" height="${P(1.3)}" rx="${P(0.3)}" fill="${C("#e0284a")}" transform="rotate(-35 ${X(-2.9)} ${P(2.2)})"/>`;
        g += `<rect x="${X(2.2)}" y="${P(1.6)}" width="${P(1.4)}" height="${P(1.3)}" rx="${P(0.3)}" fill="${C("#e0284a")}" transform="rotate(35 ${X(2.9)} ${P(2.2)})"/>`;
      }
    } else if (est === "cacheado") {
      g += `<path fill="${cab}" d="M${X(-6)} ${P(9)} C${X(-6.8)} ${P(0.4)} ${X(-2.6)} ${P(-1.6)} ${X(0)} ${P(-1.4)} C${X(2.6)} ${P(-1.6)} ${X(6.8)} ${P(0.4)} ${X(6)} ${P(9)} L${X(5)} ${P(8.2)} C${X(4.8)} ${P(4.6)} ${X(2.2)} ${P(3.6)} ${X(0)} ${P(3.8)} C${X(-2.2)} ${P(3.6)} ${X(-4.8)} ${P(4.6)} ${X(-5)} ${P(8.2)} Z"/>`;
      for (let a = -190; a <= 10; a += 20) {
        const rad = (a * Math.PI) / 180;
        g += `<circle cx="${X(6.1 * Math.cos(rad))}" cy="${P(5.2 + 6.1 * Math.sin(rad))}" r="${P(1.95)}" fill="${cab}"/>`;
      }
    } else if (est === "longo") {
      const mecha = (s) => `M${X(s * 5.6)} ${P(4.6)} C${X(s * 7.2)} ${P(9)} ${X(s * 7.4)} ${P(15)} ${X(s * 7.6)} ${P(22)} Q${X(s * 7.9)} ${P(26.5)} ${X(s * 6)} ${P(28.5)} Q${X(s * 6.2)} ${P(25.5)} ${X(s * 5)} ${P(24)} C${X(s * 5.2)} ${P(17)} ${X(s * 4.8)} ${P(10)} ${X(s * 4.6)} ${P(7)} Z`;
      g += `<path fill="${cab}" d="${mecha(-1)}"/><path fill="${cab}" d="${mecha(1)}"/>`;
      g += `<path fill="${cab}" d="M${X(-5.7)} ${P(8.8)} C${X(-6.3)} ${P(0.6)} ${X(-2.6)} ${P(-0.8)} ${X(0)} ${P(-0.6)} C${X(2.6)} ${P(-0.8)} ${X(6.3)} ${P(0.6)} ${X(5.7)} ${P(8.8)} L${X(4.7)} ${P(7.2)} C${X(4.4)} ${P(3.6)} ${X(1.6)} ${P(2.6)} ${X(0.3)} ${P(3.4)} L${X(0)} ${P(2.2)} L${X(-0.3)} ${P(3.4)} C${X(-1.6)} ${P(2.6)} ${X(-4.4)} ${P(3.6)} ${X(-4.7)} ${P(7.2)} Z"/>`;
      g += `<path d="M${X(-6.6)} ${P(16)} q${P(0.6)} ${P(3)} ${P(-0.2)} ${P(6)} M${X(6.6)} ${P(16)} q${P(-0.6)} ${P(3)} ${P(0.2)} ${P(6)}" stroke="${cabS}" stroke-width="${P(0.4)}" fill="none"/>`;
    }
    const ch = v.chapeu;
    if (ch === "bone" || ch === "bone-azul") {
      const azul = ch === "bone-azul";
      g += `<path fill="${C(azul ? "#1f3f9a" : "#d9622b")}" d="M${X(-5.9)} ${P(5.6)} C${X(-6.1)} ${P(-1.4)} ${X(6.1)} ${P(-1.4)} ${X(5.9)} ${P(5.6)} Z"/>`;
      g += `<path fill="${C(azul ? "#172f74" : "#a8461a")}" d="M${X(-6.2)} ${P(5.1)} Q${X(0)} ${P(3.4)} ${X(6.6)} ${P(5.1)} L${X(8)} ${P(6.4)} Q${X(0)} ${P(4.9)} ${X(-6.2)} ${P(6.4)} Z"/>`;
      if (azul) g += estrela(X(0), P(2.3), P(1.2), C("#e8b04a"));
      else g += `<rect x="${X(-1.6)}" y="${P(1.4)}" width="${P(3.2)}" height="${P(1.8)}" rx="${P(0.4)}" fill="#e9ecf0" opacity="0.85"/>`;
    } else if (ch === "cacador") {
      g += `<rect x="${X(-6.9)}" y="${P(4.2)}" width="${P(2)}" height="${P(6)}" rx="${P(1)}" fill="${C("#8a6a44")}"/>`;
      g += `<rect x="${X(4.9)}" y="${P(4.2)}" width="${P(2)}" height="${P(6)}" rx="${P(1)}" fill="${C("#8a6a44")}"/>`;
      g += `<path fill="${C("#9c7a4e")}" d="M${X(-6.1)} ${P(5.4)} C${X(-6.4)} ${P(-1.8)} ${X(6.4)} ${P(-1.8)} ${X(6.1)} ${P(5.4)} Z"/>`;
      g += `<path d="M${X(-2.4)} ${P(-0.4)} Q${X(-2.8)} ${P(2.4)} ${X(-3)} ${P(5.2)} M${X(2.4)} ${P(-0.4)} Q${X(2.8)} ${P(2.4)} ${X(3)} ${P(5.2)} M${X(-5.9)} ${P(2.6)} Q${X(0)} ${P(1)} ${X(5.9)} ${P(2.6)}" stroke="${C("#6b5233")}" stroke-width="${P(0.35)}" fill="none" opacity="0.75"/>`;
      g += `<path fill="${C("#7a5c38")}" d="M${X(-4.4)} ${P(4.9)} Q${X(0)} ${P(3.5)} ${X(4.4)} ${P(4.9)} L${X(3.8)} ${P(6.1)} Q${X(0)} ${P(5)} ${X(-3.8)} ${P(6.1)} Z"/>`;
      g += `<ellipse cx="${X(-0.8)}" cy="${P(-0.7)}" rx="${P(0.9)}" ry="${P(0.5)}" fill="${C("#6b5233")}"/><ellipse cx="${X(0.8)}" cy="${P(-0.7)}" rx="${P(0.9)}" ry="${P(0.5)}" fill="${C("#6b5233")}"/>`;
    } else if (ch === "fedora") {
      g += `<path fill="${C("#2b2a2c")}" d="M${X(-4.6)} ${P(3.6)} C${X(-4.9)} ${P(-1.4)} ${X(4.9)} ${P(-1.4)} ${X(4.6)} ${P(3.6)} Z"/>`;
      g += `<path d="M${X(-1.4)} ${P(-0.2)} Q${X(0)} ${P(1)} ${X(1.4)} ${P(-0.2)}" stroke="${C("#18181a")}" stroke-width="${P(0.45)}" fill="none"/>`;
      g += `<rect x="${X(-4.75)}" y="${P(2.3)}" width="${P(9.5)}" height="${P(1.3)}" fill="${C("#7e1626")}"/>`;
      g += `<ellipse cx="${X(0)}" cy="${P(3.9)}" rx="${P(7.8)}" ry="${P(1.25)}" fill="${C("#222124")}"/>`;
    }
    return g;
  }

  function oculos(v, X, P) {
    const c = v.oculosCor;
    let g = "";
    if (v.oculosForma === "retangular") {
      g += `<rect x="${X(-4.2)}" y="${P(6.7)}" width="${P(3.6)}" height="${P(2.6)}" rx="${P(0.5)}" fill="rgba(190,215,255,0.18)" stroke="${c}" stroke-width="${P(0.55)}"/>`;
      g += `<rect x="${X(0.6)}" y="${P(6.7)}" width="${P(3.6)}" height="${P(2.6)}" rx="${P(0.5)}" fill="rgba(190,215,255,0.18)" stroke="${c}" stroke-width="${P(0.55)}"/>`;
      g += `<path d="M${X(-0.6)} ${P(7.6)} H${X(0.6)} M${X(-4.2)} ${P(7.4)} L${X(-5.3)} ${P(7)} M${X(4.2)} ${P(7.4)} L${X(5.3)} ${P(7)}" stroke="${c}" stroke-width="${P(0.5)}"/>`;
    } else {
      g += `<circle cx="${X(-2.3)}" cy="${P(8)}" r="${P(1.8)}" fill="rgba(190,215,255,0.18)" stroke="${c}" stroke-width="${P(0.5)}"/>`;
      g += `<circle cx="${X(2.3)}" cy="${P(8)}" r="${P(1.8)}" fill="rgba(190,215,255,0.18)" stroke="${c}" stroke-width="${P(0.5)}"/>`;
      g += `<path d="M${X(-0.5)} ${P(7.8)} Q${X(0)} ${P(7.2)} ${X(0.5)} ${P(7.8)} M${X(-4.1)} ${P(7.8)} L${X(-5.3)} ${P(7.3)} M${X(4.1)} ${P(7.8)} L${X(5.3)} ${P(7.3)}" stroke="${c}" stroke-width="${P(0.45)}" fill="none"/>`;
    }
    g += `<path d="M${X(-3.4)} ${P(7.2)} l${P(0.8)} ${P(-0.6)}" stroke="#ffffff" stroke-width="${P(0.35)}" opacity="0.7"/>`;
    return g;
  }

  // svg completo de uma pessoa. op.escala muda o tamanho; op.busto corta do peito para cima.
  function figura(s, op) {
    op = op || {};
    const { svg, H } = figuraCorpo(s, op);
    const esc = op.escala || 1;
    const vbY = op.busto ? -16 : 0;
    const vbH = op.busto ? r1(H * 0.33) : H;
    const w = r1(240 * esc), h = r1((vbH - vbY) * esc);
    return `<svg class="${op.classe || "figura"}" viewBox="0 ${vbY} 240 ${vbH - vbY}" width="${w}" height="${h}" aria-hidden="true">${svg}</svg>`;
  }
  // retrato (busto) com altura fixa em px
  function retrato(s, alt, classe) {
    const esc = alt / (s.cm * 3 * 0.33 + 16);
    return figura(s, { busto: true, escala: esc, classe: classe || "figura" });
  }

  // A Sombra (roupa preta, balaclava), em unidades de figura.
  function sombraCorpo(cm, op) {
    op = op || {};
    const H = cm * 3, u = H / 100, cx = 120;
    const P = (n) => r1(n * u), X = (n) => r1(cx + n * u);
    const preto = "#0c0c10", preto2 = "#16171c", faixa = "#46506a";
    const sw = 11.4, ww = 8.8;
    let g = "";
    g += `<path fill="${preto}" d="M${X(-ww)} ${P(47)} L${X(ww)} ${P(47)} L${X(ww - 0.5)} ${P(95)} L${X(0.8)} ${P(95)} L${X(0)} ${P(56)} L${X(-0.8)} ${P(95)} L${X(-ww + 0.5)} ${P(95)} Z"/>`;
    g += `<rect x="${X(-ww - 0.2)}" y="${P(94)}" width="${P(ww - 0.6)}" height="${P(6)}" rx="${P(1.6)}" fill="${preto2}"/>`;
    g += `<rect x="${X(0.8)}" y="${P(94)}" width="${P(ww - 0.6)}" height="${P(6)}" rx="${P(1.6)}" fill="${preto2}"/>`;
    g += `<path fill="${preto}" d="M${X(-sw + 2.4)} ${P(18)} Q${X(-sw)} ${P(18)} ${X(-sw)} ${P(21)} L${X(-ww)} ${P(49)} L${X(ww)} ${P(49)} L${X(sw)} ${P(21)} Q${X(sw)} ${P(18)} ${X(sw - 2.4)} ${P(18)} Z"/>`;
    g += `<path d="M${X(-sw + 1.6)} ${P(20.2)} L${X(-sw - 0.6)} ${P(49)} M${X(sw - 1.6)} ${P(20.2)} L${X(sw + 0.6)} ${P(49)}" stroke="${preto}" stroke-width="${P(4.2)}" stroke-linecap="round"/>`;
    g += `<circle cx="${X(-sw - 0.6)}" cy="${P(51)}" r="${P(2.3)}" fill="${preto2}"/><circle cx="${X(sw + 0.6)}" cy="${P(51)}" r="${P(2.3)}" fill="${preto2}"/>`;
    g += `<path d="M${X(-sw + 2)} ${P(19)} L${X(ww - 1)} ${P(44)} M${X(-ww)} ${P(45.5)} H${X(ww)}" stroke="${faixa}" stroke-width="${P(1)}" fill="none"/>`;
    g += `<rect x="${X(-2)}" y="${P(12)}" width="${P(4)}" height="${P(7)}" fill="${preto}"/>`;
    g += `<ellipse cx="${cx}" cy="${P(7.4)}" rx="${P(5.6)}" ry="${P(7)}" fill="${preto}"/>`;
    g += `<rect x="${X(-3.8)}" y="${P(6.6)}" width="${P(7.6)}" height="${P(2.6)}" rx="${P(1.2)}" fill="#b98a6c"/>`;
    g += `<circle cx="${X(-1.8)}" cy="${P(7.9)}" r="${P(0.6)}" fill="#1a1010"/><circle cx="${X(1.8)}" cy="${P(7.9)}" r="${P(0.6)}" fill="#1a1010"/>`;
    if (op.oculos) {
      g += `<circle cx="${X(-1.9)}" cy="${P(7.9)}" r="${P(1.7)}" fill="rgba(200,225,255,0.35)" stroke="#e8b04a" stroke-width="${P(0.5)}"/>`;
      g += `<circle cx="${X(1.9)}" cy="${P(7.9)}" r="${P(1.7)}" fill="rgba(200,225,255,0.35)" stroke="#e8b04a" stroke-width="${P(0.5)}"/>`;
      g += `<path d="M${X(-0.2)} ${P(7.8)} H${X(0.2)}" stroke="#e8b04a" stroke-width="${P(0.5)}"/>`;
    }
    return g;
  }

  // ---------------------------------------------------------------------------
  // TIL — o cachorro farejador. A mancha na testa é um "~". Tem caretas.
  // ---------------------------------------------------------------------------
  function til(p) {
    p = p || "til";
    return `<svg class="til-svg" viewBox="0 0 220 220" width="220" height="220" aria-hidden="true">
      <rect x="62" y="150" width="96" height="80" rx="30" fill="#c98f55"/>
      <rect x="62" y="166" width="96" height="14" fill="#e0284a"/>
      <circle cx="110" cy="190" r="12" fill="#e8b04a"/>
      <path d="M102 190 q4 -5 8 0 t8 0" stroke="#7a5a1a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <g id="${p}-orelha-e"><path d="M60 62 C34 70 26 112 40 146 C50 150 62 140 70 126 C74 104 74 80 60 62 Z" fill="#6b4428"/></g>
      <g id="${p}-orelha-d"><path d="M160 62 C186 70 194 112 180 146 C170 150 158 140 150 126 C146 104 146 80 160 62 Z" fill="#6b4428"/></g>
      <ellipse cx="110" cy="100" rx="58" ry="56" fill="#c98f55"/>
      <path d="M86 66 q12 -11 24 0 t24 0" stroke="#f2e3c6" stroke-width="9" fill="none" stroke-linecap="round"/>
      <ellipse cx="110" cy="132" rx="36" ry="27" fill="#ecd2a8"/>
      <g id="${p}-olhos">
        <ellipse cx="86" cy="98" rx="8" ry="9" fill="#1a1010"/><ellipse cx="134" cy="98" rx="8" ry="9" fill="#1a1010"/>
        <circle cx="89" cy="94" r="2.6" fill="#ffffff"/><circle cx="137" cy="94" r="2.6" fill="#ffffff"/>
      </g>
      <g id="${p}-olhos-feliz" style="display:none">
        <path d="M77 100 q9 -12 18 0 M125 100 q9 -12 18 0" stroke="#1a1010" stroke-width="5.5" fill="none" stroke-linecap="round"/>
      </g>
      <g id="${p}-olhos-surpreso" style="display:none">
        <circle cx="86" cy="97" r="11" fill="#ffffff"/><circle cx="134" cy="97" r="11" fill="#ffffff"/>
        <circle cx="86" cy="98" r="6" fill="#1a1010"/><circle cx="134" cy="98" r="6" fill="#1a1010"/>
      </g>
      <g id="${p}-sobr"><path d="M74 84 q10 -7 20 -2 M146 84 q-10 -7 -20 -2" stroke="#6b4428" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <g id="${p}-sobr-pensa" style="display:none"><path d="M74 80 q10 -10 20 -6 M146 86 q-10 -2 -20 0" stroke="#6b4428" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <path d="M97 114 q13 -8 26 0 q-2 12 -13 15 q-11 -3 -13 -15 Z" fill="#1a1010"/>
      <ellipse cx="104" cy="115" rx="4" ry="2" fill="#ffffff" opacity="0.5"/>
      <g id="${p}-boca">
        <path d="M110 129 v7 M110 136 q-9 8 -18 1 M110 136 q9 8 18 1" stroke="#5a3018" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M104 141 q6 14 12 0 Z" fill="#e0607a"/>
      </g>
      <g id="${p}-boca-feliz" style="display:none">
        <path d="M110 129 v4" stroke="#5a3018" stroke-width="3" stroke-linecap="round"/>
        <path d="M90 134 q20 24 40 0 Z" fill="#5a1a1a"/>
        <path d="M101 145 q9 13 18 0 Z" fill="#e0607a"/>
      </g>
      <g id="${p}-boca-o" style="display:none">
        <path d="M110 129 v4" stroke="#5a3018" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="110" cy="142" rx="7" ry="8" fill="#5a1a1a"/>
      </g>
    </svg>`;
  }

  // ---------------------------------------------------------------------------
  // ÍCONES (24x24, traço na cor do texto)
  // ---------------------------------------------------------------------------
  const ICONES = {
    altura: '<path d="M8 2.5h8v19H8z"/><path d="M8 6.5h4M8 10.5h3M8 14.5h4M8 18.5h3"/>',
    cabelo: '<path d="M5 21c5-3 1-8 5-11.5S18 8 19 3"/><path d="M8.5 21c4-3 1-7 4.5-10"/>',
    calcado: '<path d="M2.5 16.5c0-3 1.2-5.5 3.2-5.5l3 1.4 3.2-3.4c1 0 2 .8 2.2 2 2 1.2 5 1.2 7.4 3.4v2.1z"/><path d="M2.5 19.5h19"/>',
    oculos: '<circle cx="6.8" cy="13.2" r="3.6"/><circle cx="17.2" cy="13.2" r="3.6"/><path d="M10.4 12.6c1-1 2.2-1 3.2 0M3.2 13 1.8 9M20.8 13l1.4-4"/>',
    lupa: '<circle cx="10" cy="10" r="6.2"/><path d="M14.6 14.6 21 21"/>',
    som: '<path d="M3.5 9v6h4l5 4.5v-15l-5 4.5z"/><path d="M16 8.8c1.6 1.8 1.6 4.6 0 6.4M18.8 6c3.2 3.4 3.2 8.6 0 12"/>',
    mudo: '<path d="M3.5 9v6h4l5 4.5v-15l-5 4.5z"/><path d="m16.5 9.5 5 5m0-5-5 5"/>',
    tela: '<path d="M3.5 9V3.5H9M20.5 9V3.5H15M3.5 15v5.5H9M20.5 15v5.5H15"/>',
    dica: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    ouvir: '<path d="M3.5 9v6h4l5 4.5v-15l-5 4.5z"/><path d="M16 8.8c1.6 1.8 1.6 4.6 0 6.4M18.8 6c3.2 3.4 3.2 8.6 0 12"/>',
    certo: '<path d="m4 12.5 5 5L20 6.5"/>',
    errado: '<path d="M6 6l12 12M18 6 6 18"/>',
    pessoas: '<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c0-3.6 2.6-6.2 6.2-6.2s6.2 2.6 6.2 6.2"/><circle cx="17.2" cy="9.2" r="2.6"/><path d="M15.6 14.4c3.2-.2 5.8 2 5.8 5.6"/>',
    seta: '<path d="M8 5l10 7-10 7z" fill="currentColor"/>',
    estrela: '<path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" fill="currentColor"/>',
    mapa: '<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',
    mural: '<rect x="3" y="3.5" width="18" height="13" rx="1"/><circle cx="8" cy="8" r="1.3" fill="currentColor"/><circle cx="16" cy="8" r="1.3" fill="currentColor"/><path d="M8 8l8 0M7 12.5h4M13 12.5h4M9 16.5 7.5 21M15 16.5l1.5 4.5"/>',
    trofeu: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20.5h6M10 17h4v3.5h-4z"/>',
    apagar: '<path d="M9 6h11v12H9l-6-6z"/><path d="m12.5 9.5 5 5m0-5-5 5"/>',
    lanterna: '<path d="M4 9.5h8.5L17 6v12l-4.5-3.5H4z"/><path d="M19 9l2.2-1.2M19 15l2.2 1.2M19.4 12H22"/>',
    jornal: '<rect x="3" y="4" width="14.5" height="16" rx="1"/><path d="M17.5 8H21v10a2 2 0 0 1-2 2H6"/><path d="M6 8h8.5M6 11.5h8.5M6 15h5"/>',
  };
  function icone(nome, cls) {
    return `<svg class="ico ${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nome]}</svg>`;
  }

  // o Rubi Nacional (mesmo desenho do vídeo)
  function rubi(w) {
    w = w || 80;
    return `<svg class="rubi-svg" viewBox="0 0 80 60" width="${w}" height="${r1(w * 0.75)}" aria-hidden="true">
      <path d="M10 22 L24 6 L56 6 L70 22 L40 56 Z" fill="#a3112e"/>
      <path d="M24 6 L56 6 L50 22 L30 22 Z" fill="#ff6b81"/>
      <path d="M10 22 L24 6 L30 22 Z" fill="#e0284a"/>
      <path d="M70 22 L56 6 L50 22 Z" fill="#c21a3b"/>
      <path d="M10 22 L30 22 L40 56 Z" fill="#e0284a"/>
      <path d="M30 22 L50 22 L40 56 Z" fill="#ff3d5e"/>
      <path d="M50 22 L70 22 L40 56 Z" fill="#8a0d26"/>
      <path d="M30 2 L33 11 L42 14 L33 17 L30 26 L27 17 L18 14 L27 11 Z" fill="#ffffff"/>
    </svg>`;
  }

  // ---------------------------------------------------------------------------
  // MUNDO — o museu à noite (mesma placa do vídeo + luzes, polícia e pontos).
  // ---------------------------------------------------------------------------
  function carro(id, espelhado) {
    const corpo = `<path d="M80 56 L112 24 L218 24 L252 56 Z" fill="#e9ecf0"/>
      <path d="M92 53 L116 29 L160 29 L160 53 Z M166 29 L214 29 L240 53 L166 53 Z" fill="#1b2430"/>
      <rect x="10" y="54" width="300" height="44" rx="14" fill="#e9ecf0"/>
      <rect x="10" y="72" width="300" height="10" fill="#1f3f9a"/>
      <rect x="300" y="60" width="10" height="9" rx="2" fill="#fff3c4"/>
      <circle cx="75" cy="100" r="21" fill="#111"/><circle cx="75" cy="100" r="9" fill="#8a8f99"/>
      <circle cx="245" cy="100" r="21" fill="#111"/><circle cx="245" cy="100" r="9" fill="#8a8f99"/>
      <rect x="132" y="14" width="66" height="10" rx="3" fill="#20242c"/>
      <rect class="luz-a" x="134" y="15" width="30" height="8" rx="2" fill="#ff2a3a"/>
      <rect class="luz-b" x="166" y="15" width="30" height="8" rx="2" fill="#2a6bff"/>`;
    const texto = `<text x="160" y="95" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="14" fill="#1f3f9a">POLÍCIA</text>`;
    return `<div id="${id}" class="m-carro"><svg width="320" height="124" viewBox="0 0 320 124">${espelhado ? `<g transform="translate(320 0) scale(-1 1)">${corpo}</g>` : corpo}${texto}</svg></div>`;
  }

  // estrelas do céu da placa que piscam (posições tiradas do museu.svg, só em céu aberto)
  const BRILHOS = [[381, 162], [1340, 28], [1745, 28], [198, 160], [1856, 151], [63, 90], [240, 27], [1669, 23], [511, 116], [956, 17], [1490, 96], [1808, 206], [327, 41], [1203, 8], [146, 1], [1442, 67]];

  function mundo() {
    let ups = "", pocas = "", brilhos = "";
    for (let i = 0; i < 8; i++) {
      ups += `<div class="m-up" style="left:${410 + i * 140}px"></div>`;
      pocas += `<div class="m-poca" style="left:${395 + i * 140}px"></div>`;
    }
    BRILHOS.forEach(([x, y], i) => {
      brilhos += `<i class="m-brilho" style="left:${x - 7}px;top:${y - 7}px;animation-delay:${(i * 0.73) % 4.1}s;animation-duration:${2.4 + ((i * 0.37) % 2)}s"></i>`;
    });
    const tonho = figura(window.DADOS.TONHO, { escala: 0.32, classe: "figura" });
    return `
      <img class="m-placa" src="assets/img/museu.svg" alt="">
      <div id="m-brilhos">${brilhos}</div>
      <i id="m-cadente"></i>
      <div id="m-domo"></div>
      <div id="m-frontao"></div>
      ${ups}${pocas}
      <div class="m-poste" style="left:100px"></div><div class="m-poste" style="left:1640px"></div>
      <div id="m-entalhe">MUSEU NACIONAL DE ARTE</div>
      <svg id="m-cctv" width="60" height="40" viewBox="0 0 60 40"><path d="M6 6 V22 H18" stroke="#1d1e22" stroke-width="5" fill="none"/><rect x="16" y="14" width="34" height="16" rx="3" fill="#24272e"/><rect x="48" y="17" width="8" height="10" rx="2" fill="#15171c"/><circle cx="22" cy="22" r="2.6" fill="#ff2a3a" class="cctv-led"/></svg>
      <div id="m-guarita">
        <svg width="130" height="152" viewBox="0 0 130 152">
          <defs><linearGradient id="gu-par" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5e584f"/><stop offset="1" stop-color="#3d3934"/></linearGradient></defs>
          <rect x="6" y="18" width="118" height="134" fill="url(#gu-par)"/>
          <rect x="0" y="8" width="130" height="14" fill="#6e675c"/><rect x="2" y="3" width="126" height="7" fill="#8a8274"/>
          <rect x="16" y="38" width="62" height="46" fill="#ffd89a"/>
          <rect x="16" y="38" width="62" height="46" fill="none" stroke="#2c2a2c" stroke-width="5"/>
          <path d="M47 38 V84 M16 61 H78" stroke="#2c2a2c" stroke-width="3"/>
          <rect x="86" y="50" width="32" height="102" fill="#2c2a2c"/><circle cx="111" cy="104" r="2.6" fill="#e8b04a"/>
          <rect x="18" y="98" width="58" height="18" rx="2" fill="#1f2a3a"/>
          <text x="47" y="111" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="10.5" fill="#e8eef7" letter-spacing="0.6">SEGURANÇA</text>
        </svg>
        <div class="m-guarita-luz"></div>
      </div>
      <div id="m-tonho">${tonho}</div>
      <div id="m-lav-v" class="m-lavagem"></div>
      <div id="m-lav-a" class="m-lavagem"></div>
      <div id="m-heli">
        <div id="m-feixe"></div>
        <svg width="300" height="140" viewBox="0 0 300 140">
          <rect x="176" y="70" width="112" height="12" rx="5" fill="#1d222b"/>
          <path d="M272 70 L292 40 L298 40 L290 82 Z" fill="#1d222b"/>
          <circle id="m-rotor-cauda" cx="288" cy="62" r="15" fill="none" stroke="#5b6270" stroke-width="3" stroke-dasharray="8 6"/>
          <ellipse cx="120" cy="82" rx="74" ry="36" fill="#1d222b"/>
          <path d="M60 70 Q66 48 104 48 L112 82 L58 86 Z" fill="#5d7f9e" opacity="0.85"/>
          <rect x="70" y="92" width="120" height="7" fill="#e9ecf0"/>
          <rect x="116" y="38" width="10" height="12" fill="#14171d"/>
          <path d="M70 124 H190 M90 116 V124 M170 116 V124" stroke="#14171d" stroke-width="5"/>
          <rect id="m-rotor" x="-20" y="32" width="282" height="6" rx="3" fill="#2a2e36"/>
          <circle class="luz-a" cx="140" cy="118" r="5" fill="#ff2a3a"/>
        </svg>
      </div>
      ${carro("m-carro-a", false)}${carro("m-carro-b", true)}${carro("m-carro-c", false)}
      <div id="m-pontos"></div>`;
  }

  // ---------------------------------------------------------------------------
  // CENÁRIOS DOS LOCAIS
  // ---------------------------------------------------------------------------
  // Sala de segurança: seis monitores com o nome de cada câmera (a criança lê e acha
  // o do TELHADO), depois o monitor grande com a imagem da câmera.
  function telinha(nome) {
    const w = 270, h = 166;
    let c = "";
    if (nome === "CORREDOR") {
      c = `<path d="M0 0 L95 58 L175 58 L270 0 M0 166 L95 108 L175 108 L270 166" stroke="#2c5a86" stroke-width="3" fill="none"/>
           <rect x="95" y="58" width="80" height="50" fill="#163450"/>
           <rect x="28" y="48" width="38" height="46" fill="none" stroke="#4f86bf" stroke-width="3"/><rect x="204" y="48" width="38" height="46" fill="none" stroke="#4f86bf" stroke-width="3"/>`;
    } else if (nome === "SALA DO RUBI") {
      c = `<path d="M110 14 L160 14 L196 140 L74 140 Z" fill="#4f86bf" opacity="0.22"/>
           <rect x="112" y="96" width="46" height="52" fill="#2c5a86"/><rect x="104" y="88" width="62" height="10" fill="#4f86bf"/>
           <rect x="118" y="78" width="34" height="11" rx="4" fill="#163450"/>`;
    } else if (nome === "ENTRADA") {
      c = `<path d="M90 166 V70 A45 34 0 0 1 180 70 V166" fill="#163450" stroke="#4f86bf" stroke-width="3"/>
           <path d="M104 58 V166 M120 50 V166 M135 48 V166 M150 50 V166 M166 58 V166" stroke="#2c5a86" stroke-width="3"/>`;
    } else if (nome === "JARDIM") {
      c = `<circle cx="216" cy="36" r="16" fill="#4f86bf" opacity="0.5"/>
           <rect x="58" y="92" width="10" height="60" fill="#2c5a86"/><circle cx="63" cy="80" r="30" fill="#2c5a86"/>
           <rect x="170" y="100" width="9" height="50" fill="#2c5a86"/><circle cx="174" cy="90" r="24" fill="#2c5a86"/>
           <rect x="96" y="128" width="54" height="8" fill="#4f86bf"/><path d="M100 136 v14 M146 136 v14" stroke="#4f86bf" stroke-width="4"/>`;
    } else if (nome === "ESCADA") {
      c = `<path d="M30 150 H80 V122 H120 V94 H160 V66 H200 V38 H250" stroke="#4f86bf" stroke-width="4" fill="none"/>
           <path d="M30 150 H80 V122 H120 V94 H160 V66 H200 V38 H250 V166 H30 Z" fill="#163450"/>
           <path d="M60 104 L230 18" stroke="#2c5a86" stroke-width="3"/>`;
    }
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><rect width="${w}" height="${h}" fill="#0d2238"/>${c}</svg>`;
  }

  function cenaSeguranca(cameras) {
    let teclas = "";
    for (let r = 0; r < 3; r++) for (let k = 0; k < 13; k++) teclas += `<rect x="${372 + k * 24}" y="${850 + r * 9}" width="19" height="6" rx="1.5" fill="#22252d"/>`;
    let paineis = "";
    for (let x = 158; x < 1080; x += 62) paineis += `<path d="M${x} 110 V790" stroke="#262a34" stroke-width="2"/>`;
    const pos = [[100, 176], [414, 176], [728, 176], [100, 452], [414, 452], [728, 452]];
    const mons = cameras.map((nome, i) => {
      const [x, y] = pos[i];
      const tela = nome === "TELHADO" ? '<canvas class="sg-mini-ruido" width="90" height="56"></canvas>' : telinha(nome);
      return `<button class="sg-mon" data-cam="${nome}" style="left:${x}px;top:${y}px" aria-label="Câmera ${nome}">
          <span class="sg-mon-tela">${tela}<span class="sg-mon-cam">CAM 0${i + 1}</span></span>
          <span class="sg-placa">${nome}</span>
        </button>`;
    }).join("");
    return `<svg class="cena-svg" viewBox="0 0 1920 1080" width="1920" height="1080" aria-hidden="true">
      <defs>
        <linearGradient id="sg-par" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1d25"/><stop offset="1" stop-color="#2b2f3a"/></linearGradient>
        <radialGradient id="sg-azul"><stop offset="0" stop-color="#4f86bf" stop-opacity="0.3"/><stop offset="1" stop-color="#4f86bf" stop-opacity="0"/></radialGradient>
        <linearGradient id="sg-mesa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3a2c"/><stop offset="1" stop-color="#241b15"/></linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#sg-par)"/>
      <rect width="1920" height="64" fill="#15171d"/><rect y="64" width="1920" height="8" fill="#2e313a"/>
      <rect x="1180" y="20" width="200" height="14" rx="4" fill="#2a2d36"/><rect x="1190" y="34" width="180" height="6" fill="#fff1d0" opacity="0.5"/>
      <rect x="76" y="104" width="1000" height="694" rx="8" fill="#20232c"/>${paineis}
      <ellipse cx="560" cy="420" rx="700" ry="470" fill="url(#sg-azul)"/>
      <rect x="0" y="806" width="1920" height="22" fill="#5a4636"/>
      <rect x="0" y="828" width="1920" height="252" fill="url(#sg-mesa)"/>
      <rect x="360" y="842" width="340" height="40" rx="6" fill="#121318"/>${teclas}
      <rect x="790" y="822" width="48" height="58" rx="7" fill="#e9e1cf"/>
      <path d="M838 836 q20 2 20 16 q0 14 -20 16" stroke="#e9e1cf" stroke-width="7" fill="none"/>
      <rect x="796" y="830" width="36" height="8" fill="#7e1626"/>
      <path d="M806 812 q-6 -12 2 -22 M820 812 q-6 -12 2 -24" stroke="#e9eef7" stroke-width="3" fill="none" opacity="0.25" stroke-linecap="round"/>
      <rect x="110" y="846" width="190" height="30" rx="2" fill="#e9e1cf" transform="rotate(-3 200 860)"/>
      <path d="M128 856 h120 M128 866 h90" stroke="#9a907c" stroke-width="2" transform="rotate(-3 200 860)"/>
    </svg>
    <div id="sg-grade">${mons}</div>
    <div id="sg-grande">
      <div id="sg-tela">
        <div id="sg-feed">${feedTelhado()}</div>
        <canvas id="sg-ruido" width="181" height="112"></canvas>
        <div class="sg-hud"><span>CAM · TELHADO</span><span class="sg-rec">● REC</span></div>
        <div class="sg-hora">02:13:48</div>
        <div id="sg-legenda"></div>
      </div>
    </div>`;
  }

  // Imagem da câmera do telhado: porta de 2,10 m e a Sombra ao lado. A câmera só
  // mostra a FAIXA de altura (alta ou baixa), nunca a altura exata da culpada.
  function feedTelhado() {
    const alta = !window.JOGO_CULPADO || window.JOGO_CULPADO.altura === "alta";
    const cm = alta ? 184 : 155;
    const faixa = alta ? "MAIS DE 1,80 m" : "MENOS DE 1,60 m";
    const k = 180 / 210 / 3; // porta de 2,10 m = 180 px
    const hpx = r1(cm * 3 * k);
    const topo = r1(330 - hpx);
    let ribs = "";
    [440, 520, 610, 700, 800].forEach((bx) => (ribs += `<path d="M700 86 Q${bx + (bx - 700) * 0.1} 200 ${bx} 330" stroke="#1d3340" stroke-width="5" fill="none"/>`));
    return `<svg viewBox="0 0 724 446" width="724" height="446" aria-hidden="true">
      <defs><linearGradient id="fd-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1e2c"/><stop offset="1" stop-color="#1b3b4c"/></linearGradient></defs>
      <rect width="724" height="446" fill="url(#fd-ceu)"/>
      ${estrelas(26, 0, 0, 724, 300, 77, "#cfe3f5")}
      <path d="M410 330 A290 244 0 0 1 990 330 Z" fill="#2d4a5a"/>${ribs}
      <rect x="0" y="330" width="724" height="116" fill="#1f2e35"/><rect x="0" y="326" width="724" height="6" fill="#2e4048"/>
      <rect x="96" y="150" width="100" height="180" fill="#2a3a42" stroke="#0f1a20" stroke-width="5"/>
      <rect x="106" y="160" width="80" height="74" fill="#22323a"/><circle cx="182" cy="250" r="4" fill="#9fb2c8"/>
      <rect x="92" y="118" width="108" height="24" rx="3" fill="#0f1a20"/>
      <text x="146" y="136" text-anchor="middle" font-family="Oswald" font-size="15" fill="#cfe3f5">PORTA: 2,10 m</text>
      <g transform="translate(232 ${topo}) scale(${r1(k * 1000) / 1000})">${sombraCorpo(cm)}</g>
      <g id="fd-medida">
        <path d="M330 330 V${topo}" stroke="#ffd166" stroke-width="3" stroke-dasharray="8 6"/>
        <path d="M318 330 H342 M318 ${topo} H342" stroke="#ffd166" stroke-width="3"/>
        <rect x="350" y="${r1(topo - 4)}" width="196" height="40" rx="4" fill="#ffd166"/>
        <text x="448" y="${r1(topo + 25)}" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="23" fill="#0b1e2c">${faixa}</text>
      </g>
    </svg>`;
  }

  function cenaRubi() {
    const rnd = semente(911);
    let cacos = "";
    for (let i = 0; i < 16; i++) {
      const x = 860 + rnd() * 300, y = 880 + rnd() * 50, s = 8 + rnd() * 14, a = rnd() * 180;
      cacos += `<polygon points="${r1(x)},${r1(y - s)} ${r1(x + s * 0.9)},${r1(y + s * 0.4)} ${r1(x - s * 0.6)},${r1(y + s * 0.5)}" fill="#c4d8ea" fill-opacity="0.7" stroke="#ffffff" stroke-opacity="0.7" stroke-width="1.5" transform="rotate(${r1(a)} ${r1(x)} ${r1(y)})"/>`;
    }
    return `<svg class="cena-svg" viewBox="0 0 1920 1080" width="1920" height="1080" aria-hidden="true">
      <defs>
        <linearGradient id="rb-ped" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8f897d"/><stop offset="0.4" stop-color="#d4cdbf"/><stop offset="1" stop-color="#7d776c"/></linearGradient>
        <radialGradient id="rb-poca"><stop offset="0" stop-color="#ffe2b0" stop-opacity="0.35"/><stop offset="1" stop-color="#ffe2b0" stop-opacity="0"/></radialGradient>
        <linearGradient id="rb-noite" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1628"/><stop offset="1" stop-color="#1f3a5c"/></linearGradient>
      </defs>
      <g transform="translate(-400 -50)">
        <rect x="880" y="20" width="160" height="120" fill="url(#rb-noite)"/>
        <circle cx="1000" cy="62" r="2" fill="#e8eef7"/><circle cx="930" cy="90" r="1.5" fill="#e8eef7"/>
        <rect x="380" y="120" width="1960" height="760" fill="#3b3f4a"/>
        <rect x="380" y="120" width="1960" height="40" fill="#30333d"/>
        <g fill="#353945"><rect x="120" y="700" width="420" height="160"/><rect x="600" y="700" width="200" height="160"/><rect x="1120" y="700" width="200" height="160"/><rect x="1380" y="700" width="420" height="160"/><rect x="1860" y="700" width="420" height="160"/></g>
        <rect x="380" y="690" width="1960" height="6" fill="#2c2f38"/>
        <rect x="182" y="292" width="316" height="256" fill="#b8892f"/><rect x="198" y="308" width="284" height="224" fill="#7f9fbe"/>
        <circle cx="420" cy="360" r="26" fill="#f0d79a"/>
        <path d="M198 470 Q280 400 360 450 T482 430 L482 532 L198 532 Z" fill="#3e5a3a"/><path d="M198 500 Q300 470 400 500 T482 495 L482 532 L198 532 Z" fill="#2d4430"/>
        <rect x="1422" y="292" width="316" height="256" fill="#b8892f"/><rect x="1438" y="308" width="284" height="224" fill="#2e2420"/>
        <ellipse cx="1580" cy="400" rx="44" ry="56" fill="#c49a74"/><path d="M1490 532 Q1500 460 1580 456 Q1660 460 1670 532 Z" fill="#5b2a2a"/>
        <rect x="300" y="270" width="80" height="10" rx="3" fill="#1e1f24"/><rect x="1540" y="270" width="80" height="10" rx="3" fill="#1e1f24"/>
        <rect x="380" y="874" width="1960" height="10" fill="#202127"/>
        <rect x="380" y="884" width="1960" height="260" fill="#26252b"/>
        <g stroke="#302f36" stroke-width="2"><path d="M380 940 H2340"/><path d="M380 1010 H2340"/><path d="M480 884 L300 1144"/><path d="M960 884 V1144"/><path d="M1440 884 L1620 1144"/></g>
        <ellipse cx="960" cy="900" rx="320" ry="40" fill="url(#rb-poca)"/>
        ${cacos}
        <rect x="840" y="866" width="240" height="18" fill="#8f897d"/>
        <rect x="860" y="716" width="200" height="152" fill="url(#rb-ped)"/>
        <rect x="840" y="700" width="240" height="18" fill="#ddd7cb"/>
        <rect x="900" y="666" width="120" height="36" rx="12" fill="#1f2a5a"/>
        <rect x="908" y="670" width="104" height="8" rx="4" fill="#33438a"/>
        <circle cx="902" cy="698" r="5" fill="#e8b04a"/><circle cx="1018" cy="698" r="5" fill="#e8b04a"/>
        <path d="M934 668 q8 -5 16 0 t16 0 t14 -2" stroke="#b7aa94" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <g fill="#c99a3e">
          <rect x="694" y="770" width="12" height="108"/><rect x="684" y="872" width="32" height="8" rx="3"/><circle cx="700" cy="768" r="9"/>
          <rect x="1214" y="770" width="12" height="108"/><rect x="1204" y="872" width="32" height="8" rx="3"/><circle cx="1220" cy="768" r="9"/>
        </g>
        <path d="M700 776 Q960 846 1220 776" stroke="#8e1b2b" stroke-width="9" fill="none"/>
        <path fill-rule="evenodd" fill="#23262e" d="M380 0 H2340 V128 H380 Z M900 40 H1020 V120 H900 Z"/>
        <g fill="#1b1d24"><rect x="600" y="24" width="220" height="80"/><rect x="1100" y="24" width="220" height="80"/><rect x="1360" y="24" width="220" height="80"/><rect x="1620" y="24" width="220" height="80"/><rect x="1880" y="24" width="220" height="80"/></g>
        <rect x="380" y="122" width="1960" height="8" fill="#2e313a"/>
        <rect x="890" y="32" width="140" height="8" fill="#1b1d24"/><rect x="890" y="120" width="140" height="8" fill="#1b1d24"/>
        <path d="M900 40 l14 10 l6 -10 M1020 40 l-10 14 l-8 -14 M900 120 l12 -12 l8 12 M1020 120 l-14 -8 l-4 8" fill="#c4d8ea" fill-opacity="0.8"/>
        <path d="M686 120 h30 l-4 18 h-22 Z" fill="#111216"/><rect x="692" y="134" width="18" height="4" fill="#fff1d0"/>
        <path d="M1204 120 h30 l-4 18 h-22 Z" fill="#111216"/><rect x="1210" y="134" width="18" height="4" fill="#fff1d0"/>
      </g>
    </svg>
    <div class="rb-luz rb-lua"></div>
    <div class="rb-luz rb-spot-e"></div>
    <div class="rb-luz rb-spot-d"></div>
    <div class="poeira" style="left:420px;top:180px;width:360px;height:540px"></div>
    <div id="rb-brilho"></div>
    <div id="rb-lupa"><div id="rb-lupa-vidro">${lupaFio()}</div></div>`;
  }

  function lupaFio() {
    const comprido = window.JOGO_CULPADO && window.JOGO_CULPADO.cabelo === "comprido";
    const fio = comprido
      ? `<path d="M30 150 C90 90 120 220 180 150 S280 90 330 170" stroke="#d9cdb6" stroke-width="5" fill="none" stroke-linecap="round"/>
         <path d="M30 150 C90 90 120 220 180 150 S280 90 330 170" stroke="#ffffff" stroke-width="1.6" fill="none" opacity="0.6"/>`
      : `<path d="M168 168 q10 -16 24 -6 q8 8 0 14" stroke="#d9cdb6" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    const medida = comprido ? "30 cm" : "2 cm";
    return `<svg viewBox="0 0 360 360" width="360" height="360" aria-hidden="true">
      <rect width="360" height="360" fill="#1f2a5a"/>
      <g stroke="#2a3870" stroke-width="2">${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 32 + 6} L360 ${i * 32 - 30}"/>`).join("")}</g>
      ${fio}
      <rect x="70" y="250" width="220" height="40" rx="5" fill="#e8b04a"/>
      <g stroke="#5a3f10" stroke-width="2">${Array.from({ length: 21 }, (_, i) => `<path d="M${80 + i * 10} 250 v${i % 5 ? 8 : 14}"/>`).join("")}</g>
      <text x="180" y="284" text-anchor="middle" font-family="Oswald" font-weight="700" font-size="20" fill="#3a2a08">FIO: ${medida}</text>
    </svg>`;
  }

  function pegada(tipo) {
    if (tipo === "tenis") {
      let zz = "M-10 -36";
      for (let y = -30; y <= 24; y += 6) zz += ` L${y % 12 === 0 ? -10 : 10} ${y}`;
      return `<path d="M-14 -40 C-18 -20 -16 0 -12 20 C-10 34 10 34 12 20 C16 0 18 -20 14 -40 C10 -50 -10 -50 -14 -40 Z" class="pg-sola"/><path d="${zz}" class="pg-risco"/>`;
    }
    return `<path d="M-15 -40 C-18 -22 -16 -6 -13 4 L13 4 C16 -6 18 -22 15 -40 C11 -50 -11 -50 -15 -40 Z" class="pg-sola"/><rect x="-12" y="14" width="24" height="22" rx="3" class="pg-sola"/>`;
  }

  function cenaTelhado() {
    const tipo = window.JOGO_CULPADO ? window.JOGO_CULPADO.calcado : "tenis";
    const passos = [
      [262, 858, 0.8, 1], [352, 840, 0.76, -1], [442, 820, 0.72, 1],
      [532, 802, 0.68, -1], [622, 782, 0.64, 1], [708, 764, 0.6, -1],
    ];
    let pg = "";
    passos.forEach(([x, y, s, lado], i) => {
      pg += `<g class="pegada" style="--i:${i}" transform="translate(${x} ${y + lado * 12}) rotate(78) scale(${s})">${pegada(tipo)}</g>`;
    });
    const rnd = semente(5150);
    let poeira = "";
    for (let i = 0; i < 140; i++) poeira += `<circle cx="${r1(rnd() * 1920)}" cy="${r1(730 + rnd() * 350)}" r="${r1(1 + rnd() * 2.4)}" fill="#8a8274" opacity="${r1(0.12 + rnd() * 0.2)}"/>`;
    let predios = "";
    const r2 = semente(42);
    for (let x = -20; x < 1940; ) {
      const w = 70 + r2() * 120, h = 90 + r2() * 190;
      predios += `<rect x="${r1(x)}" y="${r1(700 - h)}" width="${r1(w)}" height="${r1(h)}" fill="#14243a"/>`;
      for (let j = 0; j < 4; j++) if (r2() > 0.4) predios += `<rect x="${r1(x + 10 + r2() * (w - 24))}" y="${r1(700 - h + 14 + r2() * (h - 40))}" width="8" height="11" fill="#e8b04a" opacity="${r1(0.35 + r2() * 0.4)}"/>`;
      x += w + 4;
    }
    const hw = (y) => r1(410 * Math.sqrt(Math.max(0, 1 - Math.pow((712 - y) / 380, 2))));
    let ribs = "";
    [300, 420, 556, 690, 824, 960, 1080].forEach((bx) => (ribs += `<path d="M690 334 Q${r1(bx + (bx - 690) * 0.16)} 480 ${bx} 712" stroke="#2b2a2c" stroke-width="7" fill="none"/>`));
    [420, 520, 620].forEach((y) => (ribs += `<path d="M${690 - hw(y)} ${y} Q690 ${y - 26} ${690 + hw(y)} ${y}" stroke="#2b2a2c" stroke-width="6" fill="none"/>`));
    return `<svg class="cena-svg" viewBox="0 0 1920 1080" width="1920" height="1080" aria-hidden="true">
      <defs>
        <linearGradient id="tl-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1628"/><stop offset="0.85" stop-color="#1f3a5c"/><stop offset="1" stop-color="#2b4a6c"/></linearGradient>
        <radialGradient id="tl-halo"><stop offset="0" stop-color="#f3ead2" stop-opacity="0.22"/><stop offset="1" stop-color="#f3ead2" stop-opacity="0"/></radialGradient>
        <linearGradient id="tl-domo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d5a78"/><stop offset="1" stop-color="#7a6a4a"/></linearGradient>
        <linearGradient id="tl-laje" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5e584f"/><stop offset="1" stop-color="#3e3a35"/></linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#tl-ceu)"/>
      ${estrelas(110, 0, 0, 1920, 560, 303)}
      <circle cx="1010" cy="150" r="190" fill="url(#tl-halo)"/><circle cx="1010" cy="150" r="58" fill="#f3ead2"/><circle cx="995" cy="138" r="10" fill="#e2d7bb"/><circle cx="1028" cy="168" r="7" fill="#e2d7bb"/>
      <g fill="#2a4566" opacity="0.85"><ellipse cx="300" cy="230" rx="230" ry="26"/><ellipse cx="380" cy="212" rx="120" ry="24"/><ellipse cx="1500" cy="300" rx="200" ry="22"/></g>
      ${predios}
      <rect x="0" y="690" width="1920" height="30" fill="#4a453e"/><rect x="0" y="686" width="1920" height="6" fill="#6e675c"/>
      <rect x="0" y="720" width="1920" height="360" fill="url(#tl-laje)"/>
      <g stroke="#4a453e" stroke-width="3" opacity="0.7"><path d="M0 790 H1920"/><path d="M0 880 H1920"/><path d="M0 990 H1920"/><path d="M690 720 L-500 1080"/><path d="M690 720 L150 1080"/><path d="M690 720 L760 1080"/><path d="M690 720 L1400 1080"/><path d="M690 720 L2100 1080"/></g>
      ${poeira}
      <path d="M280 712 A410 380 0 0 1 1100 712 Z" fill="url(#tl-domo)"/>
      ${ribs}
      <path d="M772 392 L812 378 L842 404 L866 396 L872 440 L846 470 L812 462 L786 474 L768 436 Z" fill="#070d18"/>
      <path d="M772 392 L790 404 L812 378 M842 404 L852 420 L866 396 M872 440 L856 446 L846 470 M786 474 L784 452 L768 436" stroke="#c4d8ea" stroke-width="3" fill="none" opacity="0.85"/>
      <rect x="664" y="288" width="52" height="48" fill="#5e584f"/><path d="M656 292 L690 262 L724 292 Z" fill="#6e675c"/><rect x="676" y="298" width="28" height="28" fill="#ffd89a" opacity="0.55"/>
      <ellipse cx="690" cy="330" rx="34" ry="9" fill="none" stroke="#8a7a5c" stroke-width="7"/>
      <path d="M716 334 Q770 352 806 420" stroke="#8a7a5c" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M716 334 Q770 352 806 420" stroke="#6b5d44" stroke-width="7" stroke-dasharray="6 6" fill="none"/>
      <rect x="270" y="704" width="840" height="22" fill="#5e584f"/><rect x="270" y="700" width="840" height="6" fill="#8a8274"/>
      <path d="M120 760 l18 -6 l-4 14 Z M180 742 l12 6 l-14 6 Z M960 760 l16 -4 l-6 12 Z" fill="#c4d8ea" opacity="0.7"/>
    </svg>
    <svg id="tl-pegadas" viewBox="0 0 1920 1080" width="1920" height="1080" aria-hidden="true">${pg}</svg>
    <div id="tl-rotulo"></div>`;
  }

  function cenaRua() {
    let predios = "";
    const r2 = semente(808);
    for (let x = 380; x < 1940; ) {
      const w = 80 + r2() * 140, h = 220 + r2() * 300;
      predios += `<rect x="${r1(x)}" y="${r1(880 - h)}" width="${r1(w)}" height="${r1(h)}" fill="#14243a"/>`;
      for (let j = 0; j < 6; j++) if (r2() > 0.45) predios += `<rect x="${r1(x + 10 + r2() * (w - 24))}" y="${r1(880 - h + 16 + r2() * (h - 60))}" width="9" height="12" fill="#e8b04a" opacity="${r1(0.3 + r2() * 0.45)}"/>`;
      x += w + 6;
    }
    let presilhas = "";
    for (let y = 180; y < 880; y += 150) presilhas += `<rect x="346" y="${y}" width="28" height="8" rx="2" fill="#2a2a30"/>`;
    const tonho = figura(window.DADOS.TONHO, { classe: "figura" });
    return `<svg class="cena-svg" viewBox="0 0 1920 1080" width="1920" height="1080" aria-hidden="true">
      <defs>
        <linearGradient id="ru-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1628"/><stop offset="1" stop-color="#1f3a5c"/></linearGradient>
        <linearGradient id="ru-pedra" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a544b"/><stop offset="0.6" stop-color="#7a7366"/><stop offset="1" stop-color="#5e584f"/></linearGradient>
        <linearGradient id="ru-rua" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22252c"/><stop offset="1" stop-color="#15171c"/></linearGradient>
      </defs>
      <rect width="1920" height="1080" fill="url(#ru-ceu)"/>
      ${estrelas(80, 380, 0, 1920, 420, 1717)}
      <g fill="#2a4566" opacity="0.85"><ellipse cx="1300" cy="180" rx="220" ry="24"/><ellipse cx="1380" cy="164" rx="110" ry="20"/></g>
      ${predios}
      <rect x="0" y="60" width="380" height="820" fill="url(#ru-pedra)"/>
      <rect x="0" y="60" width="396" height="44" fill="#8a8274"/><rect x="0" y="104" width="388" height="10" fill="#4a453e"/>
      <path d="M110 640 V320 A80 70 0 0 1 270 320 V640 Z" fill="#1b2433"/>
      <path d="M190 254 V640 M110 450 H270" stroke="#4a453e" stroke-width="8"/>
      <rect x="96" y="640" width="188" height="16" fill="#8a8274"/>
      <rect x="0" y="820" width="380" height="60" fill="#4a453e"/>
      <rect x="352" y="114" width="16" height="770" fill="#3a3a40"/>${presilhas}
      <path d="M344 872 h32 v16 h-40 Z" fill="#3a3a40"/>
      <rect x="0" y="880" width="1920" height="58" fill="#3a3a40"/><rect x="0" y="936" width="1920" height="6" fill="#55555c"/>
      <rect x="0" y="942" width="1920" height="138" fill="url(#ru-rua)"/>
      <g fill="#cfc9b8" opacity="0.5"><rect x="140" y="1030" width="90" height="6"/><rect x="420" y="1030" width="90" height="6"/><rect x="700" y="1030" width="90" height="6"/><rect x="980" y="1030" width="90" height="6"/></g>
      <ellipse cx="880" cy="1000" rx="170" ry="16" fill="#2b4a6c" opacity="0.35"/>
      <rect x="972" y="806" width="64" height="80" rx="6" fill="#2d4430"/><rect x="966" y="798" width="76" height="12" rx="4" fill="#3e5a3a"/>
      <rect x="1002" y="790" width="16" height="8" rx="2" fill="#3e5a3a"/>
      <rect x="896" y="300" width="12" height="586" fill="#1d1e22"/><rect x="884" y="874" width="36" height="12" fill="#1d1e22"/>
      <path d="M876 300 L928 300 L918 262 L886 262 Z" fill="#1d1e22"/><rect x="890" y="272" width="24" height="22" fill="#ffd89a"/>
    </svg>
    <div class="ru-cone"></div>
    <div class="ru-pocaluz"></div>
    <div class="poeira" style="left:700px;top:320px;width:380px;height:520px"></div>
    <div id="ru-lav-v" class="ru-lavagem"></div>
    <div id="ru-lav-a" class="ru-lavagem"></div>
    <div id="ru-tonho">${tonho}</div>
    <div id="ru-lembranca"><div class="ru-lem-titulo">O QUE O SEU TONHO VIU</div>${lembranca()}<i class="ru-bolha b1"></i><i class="ru-bolha b2"></i></div>`;
  }

  function lembranca() {
    const comOculos = window.JOGO_CULPADO && window.JOGO_CULPADO.oculos === "sim";
    return `<svg viewBox="0 0 560 300" width="560" height="300" aria-hidden="true">
      <rect width="560" height="300" fill="#0d1a2c"/>
      ${estrelas(30, 0, 0, 560, 180, 99)}
      <circle cx="470" cy="70" r="30" fill="#f3ead2"/>
      <rect x="0" y="40" width="200" height="260" fill="#5e584f"/><rect x="186" y="40" width="12" height="260" fill="#3a3a40"/>
      <g transform="translate(150 66) scale(0.62)">${sombraCorpo(140, { oculos: comOculos })}</g>
      ${comOculos ? '<path d="M234 98 l6 -16 l6 16 l16 6 l-16 6 l-6 16 l-6 -16 l-16 -6 Z" fill="#fff6d8"/><path d="M262 92 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 Z" fill="#fff6d8"/>' : ""}
      <rect x="0" y="262" width="560" height="38" fill="#2a2a30"/>
    </svg>`;
  }

  function fundoLineup() {
    let linhas = "";
    for (let cm = 140; cm <= 200; cm += 5) {
      const y = 820 - cm * 3;
      const forte = cm % 10 === 0;
      linhas += `<path d="M64 ${y} H1856" stroke="#d7cfbd" stroke-width="${forte ? 3 : 1.5}" opacity="${forte ? 0.3 : 0.14}"/>`;
      if (forte) linhas += `<text x="58" y="${y + 8}" text-anchor="end" font-family="Oswald" font-size="22" fill="#d7cfbd" opacity="0.6">${(cm / 100).toFixed(2).replace(".", ",")}</text>`;
    }
    return `<svg class="cena-svg" viewBox="0 0 1920 1080" width="1920" height="1080" aria-hidden="true">
      <rect width="1920" height="1080" fill="#3b3f4a"/>
      <rect width="1920" height="96" fill="#30333d"/><rect y="96" width="1920" height="8" fill="#2c2f38"/>
      ${linhas}
      <rect x="0" y="810" width="1920" height="12" fill="#202127"/>
      <rect x="0" y="822" width="1920" height="258" fill="#26252b"/>
      <g stroke="#302f36" stroke-width="2"><path d="M0 900 H1920"/><path d="M0 990 H1920"/></g>
    </svg>`;
  }

  // ---------------------------------------------------------------------------
  // MURAL DO CASO (cortiça, fotos polaroide, linha vermelha)
  // ---------------------------------------------------------------------------
  function fotoSuspeito(s) {
    const k = 0.39;
    const { svg, H } = figuraCorpo(s, {});
    const tx = r1((204 - 240 * k) / 2), ty = r1(228 - H * k);
    let linhas = "";
    for (let cm = 140; cm <= 190; cm += 10) {
      const y = r1(228 - cm * 3 * k);
      linhas += `<path d="M0 ${y} H204" stroke="#d7cfbd" stroke-width="1.2" opacity="0.22"/>`;
    }
    return `<svg viewBox="0 0 204 236" width="204" height="236" aria-hidden="true">
      <rect width="204" height="236" fill="#343844"/>${linhas}
      <rect y="228" width="204" height="8" fill="#1f2026"/>
      <g transform="translate(${tx} ${ty}) scale(${k})">${svg}</g>
    </svg>`;
  }

  function cartazSombra() {
    return `<svg viewBox="0 0 280 300" width="280" height="300" aria-hidden="true">
      <rect width="280" height="300" rx="3" fill="#efe8d8"/>
      <rect x="10" y="10" width="260" height="280" fill="none" stroke="#7e1626" stroke-width="3"/>
      <text x="140" y="52" text-anchor="middle" font-family="League Gothic" font-size="42" letter-spacing="4" fill="#7e1626">PROCURA-SE</text>
      <rect x="46" y="64" width="188" height="170" fill="#2a2e38"/>
      <svg x="46" y="64" width="188" height="170" viewBox="40 -16 160 175">${sombraCorpo(170)}</svg>
      <text x="140" y="196" text-anchor="middle" font-family="League Gothic" font-size="120" fill="#e8b04a">?</text>
      <text x="140" y="276" text-anchor="middle" font-family="League Gothic" font-size="46" letter-spacing="2" fill="#1c1a17">A SOMBRA</text>
    </svg>`;
  }

  function mural() {
    const SUS = window.DADOS.SUSPEITOS;
    const rots = [-3, 2.2, -1.4, 2.8, -2.2];
    const fotos = SUS.map((s, i) => `
      <button class="mu-foto" data-id="${s.id}" style="left:${360 + i * 252}px;--rot:${rots[i]}deg" aria-label="${s.nome}">
        <span class="mu-foto-in">
          <span class="mu-foto-img">${fotoSuspeito(s)}
            <svg class="mu-x" viewBox="0 0 204 236" width="204" height="236" aria-hidden="true">
              <path class="mu-x1" d="M26 30 L178 206" pathLength="1"/><path class="mu-x2" d="M178 32 L28 204" pathLength="1"/>
            </svg>
            <span class="mu-carimbo">DESCARTADO</span>
          </span>
          <span class="mu-nome">${s.nome}</span>
          <span class="mu-etq">${s.profissao}</span>
          <span class="mu-pino"></span>
        </span>
      </button>`).join("");
    const pistas = window.DADOS.ATRIBUTOS.map((a) => `
      <div class="mu-pista vazia" data-attr="${a}"><span class="mu-pino"></span>${icone(a)}<span class="mu-pista-txt"><b>${window.DADOS.PISTA[a].rotulo}</b><em>?</em></span></div>`).join("");
    const rnd = semente(2024);
    let pontos = "";
    for (let i = 0; i < 900; i++) {
      pontos += `<circle cx="${r1(rnd() * 1640)}" cy="${r1(rnd() * 780)}" r="${r1(1 + rnd() * 2.6)}" fill="${rnd() > 0.5 ? "#7d5a38" : "#b38a5c"}" opacity="${r1(0.35 + rnd() * 0.4)}"/>`;
    }
    return `<div class="mu-quadro">
      <svg class="mu-cortica" viewBox="0 0 1640 780" width="1640" height="780" aria-hidden="true">
        <defs><radialGradient id="mu-luz" cx="0.5" cy="0.35" r="0.75"><stop offset="0" stop-color="#ffd89a" stop-opacity="0.16"/><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.45"/></radialGradient></defs>
        <rect width="1640" height="780" rx="10" fill="#3a2a1e"/>
        <rect x="18" y="18" width="1604" height="744" rx="4" fill="#9a7148"/>
        ${pontos}
        <rect x="18" y="18" width="1604" height="744" rx="4" fill="url(#mu-luz)"/>
        <rect x="18" y="18" width="1604" height="744" rx="4" fill="none" stroke="#2a1d14" stroke-width="5"/>
      </svg>
      <div class="mu-cartaz">${cartazSombra()}<span class="mu-pino"></span></div>
      <div class="mu-pistas">${pistas}</div>
      <div class="mu-fotos">${fotos}</div>
      <svg class="mu-fios" viewBox="0 0 1640 780" width="1640" height="780" aria-hidden="true"></svg>
      <div class="mu-faixa"><span class="mu-faixa-pista"></span><span class="mu-faixa-acao"></span></div>
      <div class="mu-acoes"><button class="btn-grande" id="mu-continuar">CONTINUAR</button></div>
    </div>`;
  }

  // Foto da capa do jornal: o detetive, o Til e o rubi recuperado.
  function fotoJornal(avatar) {
    const { svg, H } = figuraCorpo(avatar, {});
    const vbH = r1(H * 0.33 + 16);
    return `<svg viewBox="0 0 560 380" width="560" height="380" aria-hidden="true">
      <defs><linearGradient id="jn-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1628"/><stop offset="1" stop-color="#2b4a6c"/></linearGradient></defs>
      <rect width="560" height="380" fill="url(#jn-ceu)"/>
      ${estrelas(40, 0, 0, 560, 200, 4242)}
      <circle cx="470" cy="70" r="34" fill="#f3ead2"/>
      <path d="M150 300 A130 110 0 0 1 410 300 Z" fill="#3d5a78" opacity="0.7"/>
      <rect x="0" y="300" width="560" height="80" fill="#2c2a2c"/>
      <svg x="34" y="96" width="290" height="${r1(290 * vbH / 240)}" viewBox="0 -16 240 ${vbH}">${svg}</svg>
      <svg x="330" y="170" width="210" height="210" viewBox="0 0 220 220">${til("jt").replace(/<svg[^>]*>|<\/svg>$/g, "")}</svg>
      <g transform="translate(240 40)">${rubi(110).replace("<svg", '<svg x="0" y="0"')}</g>
      <path d="M296 30 l5 -14 l5 14 l14 5 l-14 5 l-5 14 l-5 -14 l-14 -5 Z" fill="#fff6d8"/>
    </svg>`;
  }

  return {
    figura, retrato, sombraCorpo, til, icone, rubi, mundo, cenaSeguranca, cenaRubi, cenaTelhado, cenaRua,
    fundoLineup, feedTelhado, lupaFio, lembranca, mural, fotoSuspeito, fotoJornal, escurecer,
  };
})();
