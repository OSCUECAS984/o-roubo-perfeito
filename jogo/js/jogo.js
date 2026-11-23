/* O Roubo Perfeito 2.0 — lógica do jogo.
   Fluxo: vídeo → INICIAR → escolha do detetive e do nível → mural dos suspeitos →
   mapa do museu (4 locais: busca + desafio de português = 1 pista; a cada pista, riscar no
   mural quem não combina) → confronto (aponte a Sombra) → revelação → assinatura → jornal.
   Sem game over: erros viram dicas cada vez mais fortes e o jogo se adapta à criança. */
(function () {
  "use strict";

  const D = window.DADOS, A = window.ARTE, S = window.SOM, F = window.FX;
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  const palco = $("#palco");
  const cenas = { video: $("#cena-video"), mundo: $("#cena-mundo"), local: $("#cena-local"), lineup: $("#cena-lineup") };
  const video = $("#video");
  const mundoCam = $("#mundo-cam");

  const FOCO = { seguranca: "530px 370px", rubi: "560px 620px", telhado: "690px 520px", rua: "720px 600px" };
  const FASES_JOGANDO = ["escolha", "briefing", "mapa", "local", "mural", "mural-ver", "pre-confronto", "confronto", "assinatura"];

  const G = {
    sessao: 0, fase: "abertura", culpado: null, pistas: {}, feitos: [], eliminados: new Set(),
    erros: 0, dicas: 0, ajudaProx: 0, inicio: performance.now(), licoes: {},
    localAtual: null, modo: "investigador", avatar: 0, nome: "", avisouSobrouUm: false, cameras: [],
  };
  let escala = 1;
  let DS = null;
  let ocioTimer = null;
  let ruidoRAF = null;
  let tweensLocal = [];
  let buscaLimpar = null;

  // ---------------------------------------------------------------------------
  // utilidades
  // ---------------------------------------------------------------------------
  function ajustar() {
    const w = window.innerWidth, h = window.innerHeight;
    escala = Math.min(w / 1920, h / 1080);
    palco.style.transform = `translate(${(w - 1920 * escala) / 2}px, ${(h - 1080 * escala) / 2}px) scale(${escala})`;
  }
  function esperar(seg) {
    const s = G.sessao;
    return new Promise((r) => setTimeout(() => { if (s === G.sessao) r(); }, seg * 1000));
  }
  function animar(alvo, vars) {
    const s = G.sessao;
    return new Promise((r) => gsap.to(alvo, Object.assign({}, vars, { onComplete: () => { if (s === G.sessao) r(); } })));
  }
  function animarDe(alvo, de, para) {
    const s = G.sessao;
    return new Promise((r) => gsap.fromTo(alvo, de, Object.assign({}, para, { onComplete: () => { if (s === G.sessao) r(); } })));
  }
  function bloquear(b) { $("#bloqueio").classList.toggle("ativo", !!b); }
  function mostrarCena(nome) { Object.keys(cenas).forEach((k) => cenas[k].classList.toggle("ativa", k === nome)); }
  function cortina(para, dur) { return animar("#cortina", { opacity: para, duration: dur == null ? 0.35 : dur, ease: "power1.inOut" }); }
  const tempo = () => (performance.now() - G.inicio) / 1000;
  const sorteio = (lista) => lista[Math.floor(Math.random() * lista.length)];
  const suspeito = (id) => D.SUSPEITOS.find((s) => s.id === id);
  const leituraAuto = () => G.modo === "aprendiz" && S.temVoz;
  function posPalco(e) {
    const p = palco.getBoundingClientRect();
    return { x: (e.clientX - p.left) / escala, y: (e.clientY - p.top) / escala };
  }
  function lerNumero(chave) {
    try { return parseInt(localStorage.getItem(chave) || "0", 10) || 0; } catch (e) { return 0; }
  }
  function textoContador() {
    const n = lerNumero("rp-casos");
    return n > 0 ? `CASOS RESOLVIDOS NESTE COMPUTADOR: ${n}` : "FEIRA DE PORTUGUÊS · JOGO DE INVESTIGAÇÃO";
  }
  const mmss = (seg) => `${Math.floor(seg / 60)}:${String(Math.round(seg) % 60).padStart(2, "0")}`;

  // ---------------------------------------------------------------------------
  // DIÁLOGO (Til e quem mais falar), com voz "falante" e caretas do Til
  // ---------------------------------------------------------------------------
  const Dialogo = (function () {
    const el = $("#dialogo"), txt = $("#dialogo-texto"), balao = $("#balao"), nomeEl = $("#balao-nome");
    let resolver = null, digit = null, spans = [], voz = "til";

    function montar(html) {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      const walk = (node) => {
        Array.from(node.childNodes).forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            for (const ch of n.textContent) {
              const sp = document.createElement("span");
              sp.className = "ch";
              sp.textContent = ch;
              frag.appendChild(sp);
            }
            n.replaceWith(frag);
          } else walk(n);
        });
      };
      walk(tmp);
      txt.innerHTML = "";
      while (tmp.firstChild) txt.appendChild(tmp.firstChild);
      spans = Array.from(txt.querySelectorAll(".ch"));
    }
    function digitar() {
      if (digit) digit.kill();
      const o = { n: 0 };
      let feito = 0, letras = 0;
      return new Promise((r) => {
        digit = gsap.to(o, {
          n: spans.length, duration: Math.min(2.4, spans.length / 60), ease: "none",
          onUpdate: () => {
            const k = Math.floor(o.n);
            for (; feito < k; feito++) {
              const sp = spans[feito];
              sp.classList.add("on");
              if (/[A-Za-zÀ-ú]/.test(sp.textContent) && ++letras % 3 === 0) S.blip(voz);
            }
          },
          onComplete: () => { spans.forEach((sp) => sp.classList.add("on")); digit = null; r(); },
        });
      });
    }
    function expressao(tipo) {
      tipo = tipo || "normal";
      const set = (id, on) => { const e = document.getElementById("til-" + id); if (e) e.style.display = on ? "" : "none"; };
      set("olhos", tipo === "normal" || tipo === "pensa");
      set("olhos-feliz", tipo === "feliz");
      set("olhos-surpreso", tipo === "surpreso");
      set("boca", tipo === "normal" || tipo === "pensa");
      set("boca-feliz", tipo === "feliz");
      set("boca-o", tipo === "surpreso");
      set("sobr", tipo !== "pensa");
      set("sobr-pensa", tipo === "pensa");
      if (tipo === "feliz") gsap.fromTo("#til-retrato", { y: 0 }, { y: -16, duration: 0.14, yoyo: true, repeat: 3, ease: "power1.out", clearProps: "transform" });
      if (tipo === "surpreso") gsap.fromTo("#til-retrato", { y: 0 }, { y: -10, duration: 0.08, yoyo: true, repeat: 1, clearProps: "transform" });
      if (tipo === "pensa") gsap.fromTo("#til-retrato", { rotation: 0 }, { rotation: -7, duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut", clearProps: "transform" });
    }
    function mexerTil() {
      gsap.fromTo("#til-orelha-e", { rotation: 0 }, { rotation: -9, transformOrigin: "50% 0%", duration: 0.12, yoyo: true, repeat: 3 });
      gsap.fromTo("#til-orelha-d", { rotation: 0 }, { rotation: 9, transformOrigin: "50% 0%", duration: 0.12, yoyo: true, repeat: 3, delay: 0.05 });
    }
    function preparar(html, op) {
      op = op || {};
      el.classList.add("visivel");
      el.classList.toggle("direita", op.lado === "direita");
      el.classList.toggle("topo", op.lado === "topo");
      el.classList.remove("esperando");
      resolver = null;
      const f = op.falante;
      nomeEl.textContent = f ? f.nome : "TIL";
      nomeEl.classList.toggle("outro", !!f);
      voz = f ? f.voz : "til";
      montar(html);
      if (!f) { expressao(op.expressao); mexerTil(); }
      if (op.ler || (op.ler !== false && leituraAuto())) S.ler(html);
    }
    function falar(html, op) {
      preparar(html, op);
      const s = G.sessao;
      return new Promise((r) => {
        digitar().then(() => {
          if (s !== G.sessao) return;
          el.classList.add("esperando");
          resolver = r;
        });
      });
    }
    function dizer(html, op) {
      preparar(html, op);
      digitar();
    }
    function avancar() {
      if (digit) { digit.progress(1); return; }
      if (resolver) {
        const r = resolver;
        resolver = null;
        el.classList.remove("esperando");
        S.ui("tique");
        r();
      }
    }
    function esconder() {
      el.classList.remove("visivel", "esperando");
      resolver = null;
      if (digit) { digit.kill(); digit = null; }
    }
    balao.addEventListener("click", avancar);
    return { falar, dizer, avancar, esconder, expressao, esperando: () => !!resolver };
  })();

  // ---------------------------------------------------------------------------
  // JANELAS
  // ---------------------------------------------------------------------------
  let avisoOcioso = false;
  function abrirModal(html, classe) {
    const caixa = $("#modal-caixa");
    caixa.className = "modal-caixa " + (classe || "");
    caixa.innerHTML = html;
    $("#modal").classList.add("aberto");
    gsap.fromTo(caixa, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", clearProps: "transform" });
  }
  function fecharModal() {
    $("#modal").classList.remove("aberto");
    avisoOcioso = false;
  }
  function modalAberto() { return $("#modal").classList.contains("aberto"); }

  function abrirCreditos() {
    S.ui("abrir");
    abrirModal(
      `<p class="mc-cab">O ROUBO PERFEITO</p><h2 class="mc-titulo">CRÉDITOS</h2>
       <dl>${D.CREDITOS.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl>
       <div class="mc-botoes"><button class="btn-grande" id="btn-fechar">FECHAR</button></div>`,
      "creditos"
    );
    $("#btn-fechar").addEventListener("click", () => { S.ui("tique"); fecharModal(); }, { once: true });
    $("#btn-fechar").focus({ preventScroll: true });
  }

  function abrirAvisoOcioso() {
    avisoOcioso = true;
    abrirModal(
      `<p class="mc-cab">CASO EM ANDAMENTO</p><h2 class="mc-titulo">AINDA ESTÁ AÍ, <em>DETETIVE</em>?</h2>
       <p class="mc-texto">Toque na tela para continuar. Se ninguém tocar, o jogo volta para o começo.</p>
       <div class="mc-botoes" style="justify-content:center"><button class="btn-grande">CONTINUAR</button></div>`,
      "ocioso"
    );
  }

  // ---- mural dos detetives (ranking da feira, guardado neste computador) ----
  function lerFama() {
    try { const l = JSON.parse(localStorage.getItem("rp-fama") || "[]"); return Array.isArray(l) ? l : []; } catch (e) { return []; }
  }
  function salvarFama(l) { try { localStorage.setItem("rp-fama", JSON.stringify(l.slice(0, 60))); } catch (e) {} }
  function registrarFama(entrada) {
    const l = lerFama();
    l.push(entrada);
    l.sort((a, b) => b.estrelas - a.estrelas || a.tempo - b.tempo);
    salvarFama(l);
  }
  function abrirFama(destaque) {
    S.ui("abrir");
    const l = lerFama().slice(0, 8);
    const estrelas = (n) => [1, 2, 3].map((i) => A.icone("estrela", i <= n ? "" : "apagada")).join("");
    const lista = l.length
      ? `<ol class="fama-lista">${l.map((e, i) => `<li class="${e.id === destaque ? "eu" : ""}">
          <span class="fama-pos">${i + 1}º</span>
          <span class="fama-av">${A.retrato(D.AVATARES[e.avatar] || D.AVATARES[0], 60)}</span>
          <span class="fama-nome">${e.nome}</span>
          <span class="fama-modo">${e.modo === "aprendiz" ? "APRENDIZ" : "INVESTIGADOR"}</span>
          <span class="fama-est">${estrelas(e.estrelas)}</span>
          <span class="fama-tempo">${mmss(e.tempo)}</span></li>`).join("")}</ol>`
      : `<p class="fama-vazio">Ninguém assinou ainda. Resolva o caso e seja o primeiro detetive do mural!</p>`;
    abrirModal(
      `<p class="mc-cab">FEIRA DE PORTUGUÊS</p><h2 class="mc-titulo">MURAL DOS <em>DETETIVES</em></h2>${lista}
       <div class="fama-rodape"><button class="btn-grande" id="btn-fechar">FECHAR</button>${l.length ? '<button class="btn btn-zerar" id="btn-zerar">ZERAR MURAL</button>' : ""}</div>`,
      "fama"
    );
    $("#btn-fechar").addEventListener("click", () => { S.ui("tique"); fecharModal(); }, { once: true });
    const z = $("#btn-zerar");
    if (z) z.addEventListener("click", () => {
      if (z.dataset.certeza) { salvarFama([]); S.ui("carimbo"); fecharModal(); return; }
      z.dataset.certeza = "1";
      z.textContent = "TOQUE DE NOVO PARA APAGAR TUDO";
    });
  }

  // ---------------------------------------------------------------------------
  // MUNDO (museu): pontos, painel do caso, animações em loop
  // ---------------------------------------------------------------------------
  function criarMundo() {
    mundoCam.innerHTML = A.mundo();
    const pontos = $("#m-pontos");
    D.ORDEM_LOCAIS.forEach((id) => {
      const L = D.LOCAIS[id];
      const p = document.createElement("div");
      p.className = "ponto";
      p.dataset.local = id;
      p.dataset.lado = L.rotuloLado;
      p.style.left = L.ponto.x + "px";
      p.style.top = L.ponto.y + "px";
      p.innerHTML = `<button class="ponto-alvo" aria-label="Investigar: ${L.rotulo}"><span class="ponto-anel"></span><span class="ponto-icone">${A.icone("lupa")}</span></button><button class="ponto-rotulo" tabindex="-1">${L.rotulo}</button>`;
      $$("button", p).forEach((b) => b.addEventListener("click", () => entrarLocal(id)));
      pontos.appendChild(p);
    });
  }

  function iniciarLoops() {
    gsap.fromTo("#m-lav-v", { opacity: 0 }, { opacity: 0.85, duration: 0.55, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.fromTo("#m-lav-a", { opacity: 0 }, { opacity: 0.85, duration: 0.55, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.55 });
    gsap.fromTo(".m-carro .luz-a, #m-heli .luz-a", { opacity: 1 }, { opacity: 0.2, duration: 0.3, ease: "steps(1)", yoyo: true, repeat: -1 });
    gsap.fromTo(".m-carro .luz-b", { opacity: 0.2 }, { opacity: 1, duration: 0.3, ease: "steps(1)", yoyo: true, repeat: -1 });
    gsap.fromTo("#m-rotor", { scaleX: 1 }, { scaleX: 0.12, transformOrigin: "50% 50%", duration: 0.05, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.fromTo("#m-rotor-cauda", { rotation: 0 }, { rotation: 360, transformOrigin: "50% 50%", duration: 0.45, ease: "none", repeat: -1 });
    gsap.fromTo("#m-heli", { y: 0 }, { y: 8, duration: 1.3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.fromTo("#m-feixe", { rotation: -14 }, { rotation: 6, transformOrigin: "50% 0%", duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.timeline({ repeat: -1, repeatDelay: 2.8 }).to("#til-olhos", { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.07, yoyo: true, repeat: 1 });
    gsap.timeline({ repeat: -1, repeatDelay: 11, delay: 4 })
      .set("#m-cadente", { x: 90, y: 40, rotation: 17, opacity: 0 })
      .to("#m-cadente", { opacity: 1, duration: 0.1 })
      .to("#m-cadente", { x: 470, y: 160, duration: 0.85, ease: "power1.in" }, 0)
      .to("#m-cadente", { opacity: 0, duration: 0.3 }, 0.55);
  }

  function mundoModoTitulo() {
    gsap.set(mundoCam, { x: 0, y: 0, scale: 1, transformOrigin: "0 0", filter: "none" });
    $("#titulo").classList.remove("com-quase");
    gsap.set(["#titulo", "#titulo-a", "#titulo-b", "#titulo-escuro", "#titulo-rodape", ".q-palavra", ".q-circ"], { clearProps: "all" });
    const acoes = $("#titulo-acoes");
    acoes.style.display = "flex";
    gsap.set(acoes, { opacity: 0 });
    gsap.set(["#m-guarita", "#m-tonho"], { opacity: 0 });
    $("#m-pontos").style.display = "none";
    ["#hud-caso", "#escolha", "#assinatura", "#jornal"].forEach((s) => { $(s).style.display = "none"; });
    $("#titulo-rodape").textContent = textoContador();
  }

  function atualizarPontos() {
    $$(".ponto").forEach((p) => {
      const feito = G.feitos.includes(p.dataset.local);
      p.classList.toggle("feito", feito);
      $(".ponto-icone", p).innerHTML = A.icone(feito ? "certo" : "lupa");
    });
  }

  function atualizarHud(novo) {
    const h = $("#hud-caso");
    const av = D.AVATARES[G.avatar];
    h.innerHTML = `<div class="hc-avatar">${A.retrato(av, 96)}</div>
      <div class="hc-info"><small>DETETIVE ${D.MODOS[G.modo].nome}</small><b>PISTAS ${Object.keys(G.pistas).length}/4</b>
        <div class="hc-pistas">${D.ATRIBUTOS.map((a) => `<i class="${G.pistas[a] ? "ok" : ""}" data-attr="${a}">${A.icone(a)}</i>`).join("")}</div></div>
      <button class="btn" id="btn-mural">${A.icone("mural")} MURAL</button>`;
    $("#btn-mural").addEventListener("click", abrirMuralVer);
    if (novo) gsap.fromTo(`.hc-pistas i[data-attr="${novo}"]`, { scale: 2 }, { scale: 1, duration: 0.6, ease: "back.out(3)", delay: 0.5, clearProps: "transform" });
  }

  // ---------------------------------------------------------------------------
  // MURAL DO CASO
  // ---------------------------------------------------------------------------
  const Mural = (function () {
    const el = $("#mural");
    let modo = "fechado", attr = null, valor = null, resolver = null, faltam = [], ocio = null, ultimoToque = 0, avisou = false;

    const fotoEl = (id) => $(`.mu-foto[data-id="${id}"]`, el);

    function montar() {
      el.innerHTML = A.mural();
      $$(".mu-foto", el).forEach((b) => b.addEventListener("click", () => tocarFoto(b.dataset.id)));
      $("#mu-continuar").addEventListener("click", () => { S.ui("tique"); fechar(); });
      desenharFios();
    }
    // Centro do alfinete de uma foto. A foto (232x334, no topo 60 do mural) é girada em
    // volta do próprio centro, então o alfinete (162 px acima do centro) gira junto.
    function pinoDaFoto(f) {
      const rot = (parseFloat(f.style.getPropertyValue("--rot")) || 0) * Math.PI / 180;
      const cx = parseFloat(f.style.left) + 116, cy = 60 + 167;
      return { x: cx + 162 * Math.sin(rot), y: cy - 162 * Math.cos(rot) };
    }
    // Fios vermelhos do cartaz PROCURA-SE até cada suspeito: arcos em leque na margem de
    // cima do quadro (sem cruzar as fotos), com os alfinetes desenhados por cima dos fios.
    function desenharFios() {
      const svg = $(".mu-fios", el);
      if (!svg) return;
      const o = { x: 171, y: 39 }; // alfinete do cartaz (girado -2°)
      const pinos = [o];
      const fios = D.SUSPEITOS.map((s, i) => {
        const p = pinoDaFoto(fotoEl(s.id));
        pinos.push(p);
        const mx = (o.x + p.x) / 2, cy = 18 - i * 7;
        return `<path data-id="${s.id}" class="${G.eliminados.has(s.id) ? "morto" : ""}" d="M${o.x} ${o.y} Q${mx.toFixed(1)} ${cy} ${p.x.toFixed(1)} ${p.y.toFixed(1)}"/>`;
      }).join("");
      svg.innerHTML = `<defs>
          <radialGradient id="mu-pg" cx="0.35" cy="0.32" r="0.94"><stop offset="0" stop-color="#ff8a9c"/><stop offset="0.45" stop-color="#e0284a"/><stop offset="1" stop-color="#7e1626"/></radialGradient>
          <filter id="mu-ps" x="-60%" y="-60%" width="220%" height="220%"><feDropShadow dx="0" dy="4" stdDeviation="2.5" flood-color="#000" flood-opacity="0.5"/></filter>
        </defs>${fios}${pinos.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="13" fill="url(#mu-pg)" filter="url(#mu-ps)"/>`).join("")}`;
    }
    function atualizar(contexto) {
      D.SUSPEITOS.forEach((s) => {
        const f = fotoEl(s.id);
        if (!f) return;
        f.classList.toggle("riscada", G.eliminados.has(s.id));
        f.classList.remove("pulsa", "suspeita", "confirmada");
        const etq = $(".mu-etq", f);
        if (contexto) { etq.textContent = D.etiqueta(s, contexto); etq.classList.add("pista"); }
        else { etq.textContent = s.profissao; etq.classList.remove("pista"); }
      });
      D.ATRIBUTOS.forEach((a) => {
        const c = $(`.mu-pista[data-attr="${a}"]`, el);
        const v = G.pistas[a];
        c.classList.toggle("vazia", !v);
        $("em", c).textContent = v ? D.PISTA[a][v].curta : "?";
      });
      desenharFios();
    }
    function abrir(op) {
      modo = op.modo;
      attr = op.attr || null;
      valor = op.valor || null;
      avisou = false;
      atualizar(modo === "eliminar" ? attr : null);
      const faixa = $(".mu-faixa", el);
      const cont = $("#mu-continuar");
      cont.classList.remove("visivel");
      cont.textContent = modo === "ver" ? "FECHAR" : "CONTINUAR";
      faixa.classList.toggle("visivel", modo === "eliminar");
      el.classList.add("aberto");
      gsap.fromTo($(".mu-quadro", el), { y: -900, rotation: -1.5 }, { y: 0, rotation: 0, duration: 0.6, ease: "back.out(1.05)", clearProps: "transform" });
      S.ui("papel");
      if (modo === "eliminar") {
        const P = D.PISTA[attr][valor];
        $(".mu-faixa-pista", el).innerHTML = P.frase;
        $(".mu-faixa-acao", el).innerHTML = P.riscar;
        const card = $(`.mu-pista[data-attr="${attr}"]`, el);
        gsap.fromTo(card, { scale: 1.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, delay: 0.55, ease: "back.out(2)", clearProps: "transform", onStart: () => S.ui("alfinete") });
        faltam = D.SUSPEITOS.filter((s) => !G.eliminados.has(s.id) && !D.combina(s, attr, valor)).map((s) => s.id);
        ultimoToque = performance.now();
        if (!faltam.length) {
          setTimeout(confirmar, 700);
        } else {
          Dialogo.dizer(`${P.frase}. ${P.riscar}`, { expressao: "pensa" });
          vigiar();
        }
      } else if (modo === "ver") {
        cont.classList.add("visivel");
        Dialogo.dizer(D.FALAS.muralVer, { ler: false });
      }
      return new Promise((r) => { resolver = r; });
    }
    function tocarFoto(id) {
      const s = suspeito(id);
      const f = fotoEl(id);
      if (modo === "ver") {
        S.ui("tique");
        gsap.fromTo($(".mu-foto-in", f), { rotation: 0 }, { rotation: 4, duration: 0.08, yoyo: true, repeat: 3, clearProps: "transform" });
        Dialogo.dizer(`“${s.alibi}”`, { falante: { nome: s.nome.toUpperCase(), voz: s.voz }, ler: false });
        return;
      }
      if (modo !== "eliminar" || G.eliminados.has(id)) return;
      ultimoToque = performance.now();
      if (!D.combina(s, attr, valor)) {
        riscar(id, false);
      } else {
        G.erros++;
        S.ui("errado");
        F.tremer($(".mu-foto-in", f), 9, 3);
        Dialogo.dizer(D.porqueCombina(s, attr), { expressao: "surpreso" });
      }
    }
    function riscar(id, automatico) {
      G.eliminados.add(id);
      faltam = faltam.filter((x) => x !== id);
      const f = fotoEl(id);
      f.classList.remove("pulsa");
      f.classList.add("riscada");
      gsap.fromTo($$(".mu-x path", f), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.2, stagger: 0.22, ease: "power1.in" });
      gsap.fromTo($(".mu-carimbo", f), { opacity: 0, scale: 2.2, rotation: -16, xPercent: -50, yPercent: -50 }, { opacity: 1, scale: 1, rotation: -16, xPercent: -50, yPercent: -50, duration: 0.28, delay: 0.45, ease: "power3.in" });
      S.ui("rabisco");
      setTimeout(() => { S.ui("carimbo"); F.particulasEm(f, { n: 12, cores: ["#e0284a", "#efe8d8", "#e8b04a"], vel: 220 }); }, 700);
      const fio = $(`.mu-fios path[data-id="${id}"]`, el);
      if (fio) fio.classList.add("morto");
      if (!automatico) Dialogo.dizer(sorteio(D.FALAS.muralOk), { expressao: "feliz", ler: false });
      if (!faltam.length) setTimeout(concluir, 900);
    }
    function confirmar() {
      const restam = D.SUSPEITOS.filter((s) => !G.eliminados.has(s.id));
      restam.forEach((s) => fotoEl(s.id).classList.add("confirmada"));
      gsap.fromTo(restam.map((s) => $(".mu-foto-in", fotoEl(s.id))), { y: 0 }, { y: -14, duration: 0.18, yoyo: true, repeat: 1, stagger: 0.08, clearProps: "transform" });
      S.ui("achou");
      Dialogo.dizer(D.FALAS.muralNada, { expressao: "feliz" });
      concluir(true);
    }
    function concluir(semFala) {
      clearInterval(ocio);
      const restam = D.SUSPEITOS.filter((s) => !G.eliminados.has(s.id));
      if (restam.length === 1) fotoEl(restam[0].id).classList.add("suspeita");
      if (!semFala) {
        if (restam.length === 1 && Object.keys(G.pistas).length < 4 && !G.avisouSobrouUm) {
          G.avisouSobrouUm = true;
          Dialogo.dizer(D.FALAS.muralSobrouUm, { expressao: "feliz" });
        } else {
          Dialogo.dizer(D.FALAS.muralFim, { expressao: "feliz" });
        }
      }
      $("#mu-continuar").classList.add("visivel");
      $("#mu-continuar").focus({ preventScroll: true });
    }
    function vigiar() {
      clearInterval(ocio);
      const s = G.sessao;
      ocio = setInterval(() => {
        if (s !== G.sessao || modo !== "eliminar" || !faltam.length) { clearInterval(ocio); return; }
        if (modalAberto()) return;
        const t = (performance.now() - ultimoToque) / 1000;
        if (t > 8 && !avisou) {
          avisou = true;
          faltam.forEach((id) => fotoEl(id).classList.add("pulsa"));
          Dialogo.dizer(D.FALAS.muralAjuda, { expressao: "pensa" });
        }
        if (t > 18) {
          ultimoToque = performance.now();
          G.dicas++;
          riscar(faltam[0], true);
        }
      }, 1000);
    }
    async function fechar() {
      if (modo === "fechado") return;
      clearInterval(ocio);
      $("#mu-continuar").classList.remove("visivel");
      modo = "fechando";
      S.ui("papel");
      await animar($(".mu-quadro", el), { y: -900, duration: 0.42, ease: "power2.in" });
      el.classList.remove("aberto");
      gsap.set($(".mu-quadro", el), { clearProps: "transform" });
      modo = "fechado";
      const r = resolver;
      resolver = null;
      if (r) r();
    }
    function reset() { clearInterval(ocio); modo = "fechado"; resolver = null; el.classList.remove("aberto"); }
    return { montar, abrir, fechar, atualizar, reset, get aberto() { return modo !== "fechado"; } };
  })();

  async function abrirMuralVer() {
    if (G.fase !== "mapa" || modalAberto()) return;
    G.fase = "mural-ver";
    S.ui("abrir");
    await Mural.abrir({ modo: "ver" });
    if (G.fase === "mural-ver") {
      G.fase = "mapa";
      Dialogo.dizer(D.FALAS.mapa[Math.min(3, G.feitos.length)], { ler: false });
    }
  }

  // ---------------------------------------------------------------------------
  // ABERTURA: toque → vídeo → título
  // ---------------------------------------------------------------------------
  function prepararAbertura() {
    G.fase = "abertura";
    mostrarCena("video");
    video.pause();
    try { video.currentTime = 0; } catch (e) { /* ainda carregando */ }
    $("#toque").style.display = "";
    $("#btn-pular").classList.remove("visivel");
    Dialogo.esconder();
  }

  function tocarVideo() {
    G.fase = "video";
    mostrarCena("video");
    $("#toque").style.display = "none";
    try { video.currentTime = 0; } catch (e) {}
    video.muted = S.mudo;
    const p = video.play();
    if (p && p.catch) {
      p.catch(() => {
        video.muted = true;
        video.play().catch(() => irParaTitulo(false));
      });
    }
    const s = G.sessao;
    setTimeout(() => { if (s === G.sessao && G.fase === "video") $("#btn-pular").classList.add("visivel"); }, 900);
  }

  async function irParaTitulo(terminou) {
    if (G.fase !== "video") return;
    G.fase = "titulo";
    $("#btn-pular").classList.remove("visivel");
    mundoModoTitulo();
    gsap.set(cenas.mundo, { opacity: 0 });
    cenas.mundo.classList.add("ativa");
    if (!terminou) {
      video.pause();
      gsap.fromTo(["#titulo-a", "#titulo-b"], { opacity: 0, filter: "blur(8px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.3, stagger: 0.15, delay: 0.35, ease: "power4.out", clearProps: "filter" });
    }
    S.ambiente(true, 0.35);
    S.musicaTocar(0, 0.32, 2.5);
    await animar(cenas.mundo, { opacity: 1, duration: terminou ? 0.35 : 0.6 });
    video.pause();
    mostrarCena("mundo");
    gsap.set(cenas.mundo, { clearProps: "opacity" });
    gsap.to("#titulo-acoes", { opacity: 1, duration: 0.6, delay: 0.2 });
    $("#btn-iniciar").focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------------------
  // ESCOLHA DO DETETIVE E DO NÍVEL
  // ---------------------------------------------------------------------------
  function mostrarEscolha() {
    if (G.fase !== "titulo") return;
    G.fase = "escolha";
    S.desbloquear();
    S.ui("tique");
    gsap.to("#titulo-acoes", { opacity: 0, duration: 0.25, onComplete: () => { $("#titulo-acoes").style.display = "none"; } });
    gsap.to(["#titulo-a", "#titulo-b"], { opacity: 0, y: -60, filter: "blur(10px)", duration: 0.5, stagger: 0.08, ease: "power2.in" });
    gsap.to(["#titulo-escuro", "#titulo-rodape"], { opacity: 0, duration: 0.5 });
    S.tocar("whooshCurto", { vol: 0.4 });
    const esc = $("#escolha");
    esc.innerHTML = `<h2>QUEM VAI INVESTIGAR?</h2>
      <div class="esc-avatares">${D.AVATARES.map((av, i) => `
        <button class="esc-av ${i === G.avatar ? "sel" : ""}" data-i="${i}" aria-label="Detetive ${i + 1}">
          <span class="esc-retrato">${A.retrato(av, 224)}</span><span class="esc-check">${A.icone("certo")}</span>
        </button>`).join("")}</div>
      <p class="esc-nivel">AGORA, ESCOLHA O SEU NÍVEL</p>
      <div class="esc-modos">${Object.values(D.MODOS).map((m) => `
        <button class="esc-modo" data-modo="${m.id}">
          <span class="em-estrelas">${A.icone("estrela").repeat(m.estrelas)}</span>
          <span><b>${m.nome}</b><span class="em-sub">${m.sub}</span></span>
        </button>`).join("")}</div>`;
    esc.style.display = "block";
    gsap.fromTo(esc, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.2 });
    gsap.fromTo($$(".esc-av", esc), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 0.35, ease: "back.out(1.7)", clearProps: "transform,opacity" });
    gsap.fromTo($$(".esc-modo", esc), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.1, delay: 0.7, clearProps: "transform,opacity" });
    $$(".esc-av", esc).forEach((b) => b.addEventListener("click", () => {
      if (G.fase !== "escolha") return;
      G.avatar = +b.dataset.i;
      $$(".esc-av", esc).forEach((x) => x.classList.toggle("sel", x === b));
      S.ui("pop");
      F.particulasEm($(".esc-retrato", b), { n: 10, vel: 200 });
    }));
    $$(".esc-modo", esc).forEach((b) => b.addEventListener("click", () => iniciarCaso(b.dataset.modo)));
    Dialogo.dizer(D.FALAS.escolha, { expressao: "feliz", ler: S.temVoz });
  }

  // ---------------------------------------------------------------------------
  // INÍCIO DO CASO
  // ---------------------------------------------------------------------------
  function novoCaso() {
    let ultimo = null;
    try { ultimo = localStorage.getItem("rp-ultimo"); } catch (e) {}
    const opcoes = D.SUSPEITOS.filter((s) => s.id !== ultimo);
    G.culpado = sorteio(opcoes);
    try { localStorage.setItem("rp-ultimo", G.culpado.id); } catch (e) {}
    window.JOGO_CULPADO = G.culpado;
    G.pistas = {};
    G.feitos = [];
    G.eliminados = new Set();
    G.erros = 0;
    G.dicas = 0;
    G.ajudaProx = G.modo === "aprendiz" ? 1 : 0;
    G.licoes = {};
    G.nome = "";
    G.avisouSobrouUm = false;
    G.cameras = D.embaralhar(D.CAMERAS, Math.random);
    G.inicio = performance.now();
    Mural.montar();
    atualizarPontos();
  }

  async function iniciarCaso(modo) {
    if (G.fase !== "escolha") return;
    G.fase = "briefing";
    G.modo = modo;
    S.ui("certo");
    novoCaso();
    bloquear(true);
    F.particulasEm($(`.esc-modo[data-modo="${modo}"]`), { n: 24 });
    await animar("#escolha", { opacity: 0, duration: 0.4, delay: 0.2 });
    $("#escolha").style.display = "none";
    gsap.to(["#m-guarita", "#m-tonho"], { opacity: 1, duration: 0.8 });
    bloquear(false);
    await Dialogo.falar(D.FALAS.briefing[0], { expressao: "surpreso" });
    Mural.abrir({ modo: "intro" });
    await esperar(0.5);
    await Dialogo.falar(D.FALAS.briefing[1], { expressao: "feliz" });
    await Mural.fechar();
    mostrarMapa();
    G.fase = "mapa";
    Dialogo.dizer(D.FALAS.mapa[0]);
  }

  function mostrarMapa() {
    const pts = $("#m-pontos");
    pts.style.display = "";
    gsap.set(pts, { opacity: 1 });
    atualizarPontos();
    gsap.fromTo(".ponto", { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.1 });
    gsap.fromTo(".ponto-alvo", { scale: 0.3 }, { scale: 1, duration: 0.55, stagger: 0.1, ease: "back.out(2.2)" });
    const h = $("#hud-caso");
    atualizarHud();
    h.style.display = "flex";
    gsap.fromTo(h, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, clearProps: "transform" });
  }

  // ---------------------------------------------------------------------------
  // LOCAIS
  // ---------------------------------------------------------------------------
  async function entrarLocal(id) {
    if (G.fase !== "mapa" || G.feitos.includes(id) || modalAberto()) return;
    G.fase = "transicao";
    bloquear(true);
    S.ui("tique");
    const L = D.LOCAIS[id];
    Dialogo.esconder();
    gsap.to(["#m-pontos", "#hud-caso"], { opacity: 0, duration: 0.25 });
    S.tocar("whoosh", { inicio: 1.75, vol: 0.45, dur: 1.4, fade: 0.5 });
    const s = 6;
    gsap.set(mundoCam, { filter: "blur(0px)" });
    gsap.to(mundoCam, { x: L.ponto.x * (1 - s), y: L.ponto.y * (1 - s), scale: s, duration: 0.75, ease: "power3.in" });
    gsap.to(mundoCam, { filter: "blur(16px)", duration: 0.35, delay: 0.4, ease: "power2.in" });
    await esperar(0.75);

    montarLocal(id);
    mostrarCena("local");
    gsap.set(mundoCam, { x: 0, y: 0, scale: 1, filter: "none" });
    S.ambiente(true, id === "rua" ? 0.42 : id === "telhado" ? 0.2 : 0.1);
    S.ambienteSint(id === "telhado" ? "vento" : id === "seguranca" ? "zumbido" : null);
    if (id === "rubi") S.tocar("alarme", { vol: 0.14, dur: 1.6, fade: 1.2 });
    if (id === "rua") S.tocar("sireneB", { vol: 0.06, loop: true });
    S.musicaVolume(0.2, 0.6);
    const cam = $("#local-cam");
    gsap.set(cam, { transformOrigin: FOCO[id], opacity: 1 });
    await animarDe(cam, { scale: 1.25, filter: "blur(14px)" }, { scale: 1, filter: "blur(0px)", duration: 0.65, ease: "power3.out" });
    gsap.set(cam, { filter: "none" });
    bloquear(false);
    G.fase = "local";
    iniciarCenaLocal(id);
    if (L.busca) {
      await iniciarBusca(id);
      if (G.localAtual !== id || G.fase !== "local") return;
      Dialogo.dizer(L.achou, { expressao: "feliz" });
      await esperar(0.8);
    } else {
      Dialogo.dizer(L.achou, { expressao: "normal" });
      await esperar(1.0);
    }
    if (G.fase === "local" && G.localAtual === id) iniciarDesafio(id);
  }

  function montarLocal(id) {
    const L = D.LOCAIS[id];
    const arte = id === "seguranca" ? A.cenaSeguranca(G.cameras) : { rubi: A.cenaRubi, telhado: A.cenaTelhado, rua: A.cenaRua }[id]();
    $("#local-arte").innerHTML = arte;
    $("#local-titulo").innerHTML = `<small>INVESTIGANDO</small><b>${L.nome}</b>`;
    $("#busca-alvos").innerHTML = "";
    $("#lanterna").classList.remove("ativa");
    const painel = $("#painel");
    painel.innerHTML = "";
    painel.style.display = "none";
    gsap.set(painel, { clearProps: "all" });
    painel.style.display = "none";
    G.localAtual = id;
    DS = null;
  }

  function iniciarCenaLocal(id) {
    tweensLocal.forEach((t) => t.kill());
    tweensLocal = [];
    if (id === "seguranca") {
      ligarRuido();
      S.estatica(0.6, 0.06);
    } else if (id === "rua") {
      tweensLocal.push(gsap.fromTo("#ru-lav-v", { opacity: 0 }, { opacity: 0.75, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: -1 }));
      tweensLocal.push(gsap.fromTo("#ru-lav-a", { opacity: 0 }, { opacity: 0.75, duration: 0.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.6 }));
      tweensLocal.push(gsap.fromTo("#ru-tonho", { y: 0 }, { y: -3, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    }
  }

  function ligarRuido() {
    const telas = $$("#sg-ruido, .sg-mini-ruido");
    if (!telas.length) return;
    const ctxs = telas.map((cv) => ({ cv, c2: cv.getContext("2d"), img: null }));
    ctxs.forEach((o) => { o.img = o.c2.createImageData(o.cv.width, o.cv.height); });
    cancelAnimationFrame(ruidoRAF);
    const passo = () => {
      let vivo = false;
      ctxs.forEach((o) => {
        if (!o.cv.isConnected) return;
        const op = parseFloat(getComputedStyle(o.cv).opacity);
        if (op <= 0.01 || o.cv.offsetParent === null) return;
        vivo = true;
        const d = o.img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = (Math.random() * 210) | 0;
          d[i] = v * 0.8; d[i + 1] = v * 0.94; d[i + 2] = v; d[i + 3] = 255;
        }
        o.c2.putImageData(o.img, 0, 0);
      });
      ruidoRAF = vivo ? requestAnimationFrame(passo) : null;
    };
    passo();
  }

  // ---------------------------------------------------------------------------
  // BUSCA: lanterna no escuro ou o monitor certo
  // ---------------------------------------------------------------------------
  function iniciarBusca(id) {
    const L = D.LOCAIS[id];
    if (L.busca === "monitor") return buscaMonitor(L);
    if (L.busca === "lanterna") return buscaLanterna(L);
    return Promise.resolve();
  }

  function buscaLanterna(L) {
    const s = G.sessao;
    return new Promise((resolve) => {
      const lan = $("#lanterna");
      lan.style.setProperty("--x", L.luz.x + "px");
      lan.style.setProperty("--y", L.luz.y + "px");
      lan.style.setProperty("--r", "230px");
      lan.style.opacity = "";
      lan.classList.add("ativa");
      const a = L.alvo;
      $("#busca-alvos").innerHTML = `<button class="alvo-busca" style="left:${a.x - a.w / 2}px;top:${a.y - a.h / 2}px;width:${a.w}px;height:${a.h}px" aria-label="Prova escondida"><i></i></button>`;
      const alvo = $(".alvo-busca");
      const cenaEl = cenas.local;
      let inicio = performance.now(), dica1 = false, dica2 = false, pertoAvisado = false, achado = false;
      Dialogo.dizer(L.buscaFala, { expressao: "pensa" });
      S.ui("farejar");
      const mover = (e) => {
        const p = posPalco(e);
        lan.style.setProperty("--x", p.x + "px");
        lan.style.setProperty("--y", p.y + "px");
        const perto = Math.hypot(p.x - a.x, p.y - a.y) < Math.max(a.w, a.h) * 0.6 + 60;
        if (perto && !pertoAvisado) {
          pertoAvisado = true;
          alvo.classList.add("dica");
          S.ui("farejar");
          Dialogo.dizer("Au! Tem alguma coisa <em>aí</em>! Toque no brilho.", { expressao: "surpreso", ler: false });
        }
      };
      const fim = () => {
        if (achado) return;
        achado = true;
        clearInterval(timer);
        cenaEl.removeEventListener("pointermove", mover);
        cenaEl.removeEventListener("pointerdown", mover);
        buscaLimpar = null;
        S.ui("achou");
        S.ui("luz");
        F.particulas(a.x, a.y, { n: 26 });
        gsap.to(lan, { "--r": "1500px", duration: 0.8, ease: "power2.in" });
        gsap.to(lan, { opacity: 0, duration: 0.5, delay: 0.5, onComplete: () => { lan.classList.remove("ativa"); lan.style.opacity = ""; } });
        alvo.remove();
        setTimeout(() => { if (s === G.sessao) resolve(); }, 650);
      };
      cenaEl.addEventListener("pointermove", mover);
      cenaEl.addEventListener("pointerdown", mover);
      alvo.addEventListener("click", fim);
      const timer = setInterval(() => {
        if (s !== G.sessao) { clearInterval(timer); return; }
        const t = (performance.now() - inicio) / 1000;
        if (t > 7 && !dica1) {
          dica1 = true;
          alvo.classList.add("dica");
          Dialogo.dizer(L.buscaDica, { expressao: "pensa" });
        }
        if (t > 13 && !dica2) {
          dica2 = true;
          gsap.to(lan, { "--x": a.x + "px", "--y": a.y + "px", duration: 1.2, ease: "power2.inOut" });
          Dialogo.dizer("Vem cá, detetive! É <em>aqui</em>!", { expressao: "feliz" });
        }
        if (t > 20) fim();
      }, 500);
      buscaLimpar = () => {
        clearInterval(timer);
        cenaEl.removeEventListener("pointermove", mover);
        cenaEl.removeEventListener("pointerdown", mover);
      };
    });
  }

  function buscaMonitor(L) {
    const s = G.sessao;
    return new Promise((resolve) => {
      Dialogo.dizer(L.buscaFala, { expressao: "pensa" });
      const mons = $$(".sg-mon");
      gsap.fromTo(mons, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, clearProps: "transform,opacity" });
      let inicio = performance.now(), dica = false, achado = false;
      const certo = mons.find((m) => m.dataset.cam === "TELHADO");
      const fim = () => {
        if (achado) return;
        achado = true;
        clearInterval(timer);
        buscaLimpar = null;
        S.ui("achou");
        F.particulasEm(certo, { n: 18 });
        const grande = $("#sg-grande");
        grande.style.display = "block";
        const x0 = parseFloat(certo.style.left), y0 = parseFloat(certo.style.top);
        gsap.fromTo(grande, { x: x0 - 150, y: y0 - 176, scale: 290 / 760, transformOrigin: "0 0", opacity: 0.4 },
          { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.6, ease: "power3.inOut", clearProps: "transform" });
        gsap.to("#sg-grade", { opacity: 0, duration: 0.35, onComplete: () => { $("#sg-grade").style.visibility = "hidden"; } });
        S.estatica(0.5, 0.07);
        ligarRuido();
        setTimeout(() => { if (s === G.sessao) resolve(); }, 650);
      };
      mons.forEach((m) => m.addEventListener("click", () => {
        if (achado) return;
        if (m === certo) { fim(); return; }
        S.ui("errado");
        F.tremer(m, 8, 3);
        m.classList.add("apagado");
        Dialogo.dizer(D.FALAS.monitorErrado(m.dataset.cam), { expressao: "pensa" });
      }));
      const timer = setInterval(() => {
        if (s !== G.sessao) { clearInterval(timer); return; }
        const t = (performance.now() - inicio) / 1000;
        if (t > 8 && !dica) {
          dica = true;
          certo.classList.add("brilho");
          Dialogo.dizer(L.buscaDica, { expressao: "pensa" });
        }
        if (t > 20) fim();
      }, 500);
      buscaLimpar = () => clearInterval(timer);
    });
  }

  // ---------------------------------------------------------------------------
  // DESAFIOS DE PORTUGUÊS
  // ---------------------------------------------------------------------------
  function iniciarDesafio(id) {
    const L = D.LOCAIS[id];
    const valor = G.culpado[L.atributo];
    const nivel = G.ajudaProx;
    const def = D.desafio(id, valor, nivel, G.modo);
    DS = { id, L, def, nivel, ajuda: 0, errosAqui: 0, dicasAqui: 0, fim: false, toque: performance.now(), avisou: false, ui: null };
    const painel = $("#painel");
    painel.innerHTML = `
      <p class="p-cat">DESAFIO DE PORTUGUÊS · ${def.categoria}</p>
      <h2 class="p-titulo">${def.titulo}</h2>
      <p class="p-instr">${def.instrucao}</p>
      ${def.imagem === "fio" ? `<div class="p-imagem">${A.lupaFio()}</div>` : ""}
      <div class="p-area" id="p-area"></div>
      <div class="p-rodape">
        <button class="btn btn-dica" id="btn-dica">${A.icone("dica")} DICA</button>
        <button class="btn btn-ouvir" id="btn-ouvir">${A.icone("ouvir")} OUVIR</button>
      </div>`;
    const area = $("#p-area");
    DS.ui = { frase: uiFrase, escolha: uiEscolha, letra: uiLetra, erro: uiErro }[def.tipo](area, def);
    $("#btn-dica").addEventListener("click", () => { marcarToque(); pedirDica(); });
    $("#btn-ouvir").addEventListener("click", () => { marcarToque(); S.ler(def.leitura); });
    if (id === "seguranca") $("#sg-legenda").textContent = D.embaralhar(def.palavras.concat(def.extras || []), Math.random).join(" · ").toUpperCase();
    painel.style.display = "block";
    gsap.fromTo(painel, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out", clearProps: "transform" });
    const s = G.sessao;
    if (leituraAuto()) setTimeout(() => { if (s === G.sessao && DS && !DS.fim && DS.id === id) S.ler(def.leitura); }, 900);
    if (nivel >= 1 && G.modo !== "aprendiz") {
      setTimeout(() => { if (s === G.sessao && DS && !DS.fim && DS.id === id) Dialogo.dizer(def.dicas[0], { expressao: "pensa" }); }, 1400);
    }
    vigiarOcio();
  }

  function marcarToque() {
    if (!DS) return;
    DS.toque = performance.now();
    DS.avisou = false;
    const b = $("#btn-dica");
    if (b) b.classList.remove("pulsa");
  }

  function vigiarOcio() {
    clearInterval(ocioTimer);
    ocioTimer = setInterval(() => {
      if (!DS || DS.fim || G.fase !== "local") { clearInterval(ocioTimer); return; }
      if (modalAberto()) return;
      const t = (performance.now() - DS.toque) / 1000;
      if (t > 15 && !DS.avisou && DS.ajuda < 3) {
        DS.avisou = true;
        Dialogo.dizer(D.FALAS.ocioso, { expressao: "pensa" });
        const b = $("#btn-dica");
        if (b) b.classList.add("pulsa");
      }
      if (t > 28 && DS.ajuda < 3) {
        DS.toque = performance.now();
        DS.avisou = false;
        G.dicas++;
        DS.dicasAqui++;
        subirAjuda();
      }
    }, 1000);
  }

  function errou(el, msg) {
    if (!DS || DS.fim) return;
    G.erros++;
    DS.errosAqui++;
    S.ui("errado");
    if (el) F.tremer(el, 12, 3);
    subirAjuda(msg);
  }

  function pedirDica() {
    if (!DS || DS.fim || DS.ajuda >= 3) return;
    G.dicas++;
    DS.dicasAqui++;
    S.ui("abrir");
    subirAjuda();
  }

  function subirAjuda(msg) {
    DS.ajuda = Math.min(3, DS.ajuda + 1);
    const n = DS.ajuda;
    Dialogo.dizer(msg || DS.def.dicas[n - 1], { expressao: "pensa" });
    DS.ui.ajudar(n);
    const b = $("#btn-dica");
    if (b) { b.classList.remove("pulsa"); if (n >= 3) b.disabled = true; }
  }

  // ---- monte a frase ----
  function uiFrase(area, def) {
    const n = def.palavras.length;
    const extras = def.extras || [];
    const itens = def.palavras.map((p, i) => ({ t: p, i })).concat(extras.map((p) => ({ t: p, i: -1 })));
    let ordem;
    do { ordem = D.embaralhar(itens, Math.random); } while (ordem.slice(0, n).every((v, k) => v.i === k));
    area.innerHTML = `<div class="fr-linha">${def.palavras.map(() => '<span class="fr-slot"></span>').join("")}</div>
      <div class="fr-pecas">${ordem.map((o) => `<button class="peca" data-i="${o.i}">${o.t}</button>`).join("")}</div>`;
    const slots = $$(".fr-slot", area);
    const pecas = $$(".peca", area);
    let prox = 0;
    const proxPeca = () => pecas.find((p) => +p.dataset.i === prox);
    function colocar(b) {
      if (!b || b.disabled || prox >= n) return;
      const antes = b.getBoundingClientRect();
      const slot = slots[prox];
      slot.appendChild(b);
      slot.classList.add("cheio");
      b.classList.add("posta");
      b.classList.remove("brilho");
      b.disabled = true;
      const depois = b.getBoundingClientRect();
      gsap.fromTo(b, { x: (antes.left - depois.left) / escala, y: (antes.top - depois.top) / escala }, { x: 0, y: 0, duration: 0.3, ease: "power2.out", clearProps: "transform" });
      S.ui("peca");
      prox++;
      if (prox >= n) {
        pecas.filter((p) => +p.dataset.i === -1).forEach((p) => p.classList.add("apagada"));
        acertou();
      }
    }
    pecas.forEach((b) => b.addEventListener("click", () => {
      if (!DS || DS.fim || b.disabled) return;
      marcarToque();
      const i = +b.dataset.i;
      if (i === prox) colocar(b);
      else if (i === -1) { b.classList.add("apagada"); errou(b, def.extraMsg); }
      else errou(b);
    }));
    gsap.fromTo(pecas, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, delay: 0.25, clearProps: "opacity,transform" });
    return {
      ajudar(nv) {
        if (nv === 1) {
          pecas.forEach((p) => {
            const i = +p.dataset.i;
            const t = p.textContent;
            if (!p.disabled && i >= 0 && (/^[A-ZÀ-Ú]/.test(t) || /\.$/.test(t))) p.classList.add("brilho");
          });
        } else if (nv === 2) {
          pecas.forEach((p) => p.classList.remove("brilho"));
          pecas.filter((p) => +p.dataset.i === -1).forEach((p) => p.classList.add("apagada"));
          setTimeout(() => { if (DS && !DS.fim) colocar(proxPeca()); }, 450);
        } else if (nv === 3) {
          pecas.forEach((p) => p.classList.remove("brilho"));
          const s = G.sessao;
          const passo = () => {
            if (s !== G.sessao || !DS || DS.fim || prox >= n) return;
            colocar(proxPeca());
            setTimeout(passo, 380);
          };
          setTimeout(passo, 450);
        }
      },
    };
  }

  // ---- escolha (vocabulário / sinônimo / antônimo) ----
  function uiEscolha(area, def) {
    const lado = def.opcoes.length === 2;
    area.innerHTML = `<div class="op-lista ${lado ? "lado" : ""}">${def.opcoes.map((o, i) => `<button class="opcao" data-i="${i}"><span class="num">${i + 1}</span>${o.texto}</button>`).join("")}</div>`;
    const bts = $$(".opcao", area);
    bts.forEach((b, i) => b.addEventListener("click", () => {
      if (!DS || DS.fim) return;
      marcarToque();
      if (def.opcoes[i].certo) {
        b.classList.remove("brilho");
        b.classList.add("certa");
        bts.forEach((x) => { if (x !== b) x.classList.add("apagada"); });
        F.particulasEm(b, { n: 22 });
        acertou();
      } else {
        b.classList.add("apagada");
        errou(b);
      }
    }));
    gsap.fromTo(bts, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, delay: 0.25, clearProps: "opacity,transform" });
    return {
      teclas(k) { const b = bts[k - 1]; if (b && !b.classList.contains("apagada")) b.click(); },
      ajudar(nv) {
        if (nv === 2) {
          const w = bts.find((b, i) => !def.opcoes[i].certo && !b.classList.contains("apagada"));
          if (w) w.classList.add("apagada");
        }
        if (nv >= 2) {
          const sobrou = bts.filter((b) => !b.classList.contains("apagada"));
          if (sobrou.length === 1) sobrou[0].classList.add("brilho");
        }
        if (nv === 3) bts.forEach((b, i) => { if (def.opcoes[i].certo) b.classList.add("brilho"); });
      },
    };
  }

  // ---- complete a palavra ----
  function uiLetra(area, def) {
    area.innerHTML = `<div class="lt-palavra">${def.molde.map((c) => (c ? `<span class="lt-caixa">${c}</span>` : '<span class="lt-caixa vazia" id="lt-vazia">?</span>')).join("")}</div>
      <div class="lt-opcoes">${def.opcoes.map((l, i) => `<button class="letra" data-i="${i}">${l}</button>`).join("")}</div>`;
    const bts = $$(".letra", area);
    bts.forEach((b, i) => b.addEventListener("click", () => {
      if (!DS || DS.fim) return;
      marcarToque();
      const l = def.opcoes[i];
      if (l === def.certa) {
        b.classList.remove("brilho");
        b.classList.add("certa");
        const v = $("#lt-vazia");
        v.textContent = l;
        v.classList.remove("vazia");
        v.classList.add("cheia");
        gsap.fromTo(v, { scale: 1.45 }, { scale: 1, duration: 0.45, ease: "back.out(2)", clearProps: "transform" });
        bts.forEach((x) => { if (x !== b) x.classList.add("apagada"); });
        F.particulasEm(v, { n: 22 });
        acertou();
      } else {
        b.classList.add("apagada");
        errou(b);
      }
    }));
    gsap.fromTo(bts, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.07, delay: 0.25, clearProps: "opacity,transform" });
    return {
      teclas(k) { const b = bts[k - 1]; if (b && !b.classList.contains("apagada")) b.click(); },
      ajudar(nv) {
        if (nv === 2) {
          const w = bts.find((b, i) => def.opcoes[i] !== def.certa && !b.classList.contains("apagada"));
          if (w) w.classList.add("apagada");
        }
        if (nv >= 2) {
          const sobrou = bts.filter((b) => !b.classList.contains("apagada"));
          if (sobrou.length === 1) sobrou[0].classList.add("brilho");
        }
        if (nv === 3) bts.forEach((b, i) => { if (def.opcoes[i] === def.certa) b.classList.add("brilho"); });
      },
    };
  }

  // ---- caça ao erro ----
  function uiErro(area, def) {
    area.innerHTML = `<div class="er-nota"><div class="er-cab">DEPOIMENTO DO SEU TONHO · ANOTADO PELO POLICIAL</div>
      <div class="er-frase">${def.palavras.map((p, i) => `<button class="er-palavra" data-i="${i}">${p.texto}</button>`).join("")}</div></div>`;
    const bts = $$(".er-palavra", area);
    const iErro = def.palavras.findIndex((p) => p.erro);
    bts.forEach((b, i) => b.addEventListener("click", () => {
      if (!DS || DS.fim) return;
      marcarToque();
      const p = def.palavras[i];
      if (p.erro) {
        b.classList.remove("brilho");
        b.classList.add("corrigida");
        b.insertAdjacentHTML("beforeend", `<span class="er-correcao">${p.certa.replace(/[.,]$/, "")}</span>`);
        gsap.fromTo(b.querySelector(".er-correcao"), { opacity: 0 }, { opacity: 1, duration: 0.45 });
        bts.forEach((x) => { if (x !== b) x.classList.remove("apagada", "brilho"); });
        S.ui("rabisco");
        F.particulasEm(b, { n: 18, cores: ["#e0284a", "#e8b04a", "#ffd89a"] });
        acertou();
      } else {
        b.classList.add("apagada");
        errou(b);
      }
    }));
    return {
      ajudar(nv) {
        if (nv === 2) {
          const outros = bts.filter((b, i) => i !== iErro && !b.classList.contains("apagada"));
          const manter = sorteio(outros);
          outros.forEach((b) => { if (b !== manter) b.classList.add("apagada"); });
        }
        if (nv === 3) bts[iErro].classList.add("brilho");
      },
    };
  }

  async function acertou() {
    if (!DS || DS.fim) return;
    DS.fim = true;
    clearInterval(ocioTimer);
    S.ui("certo");
    S.calar();
    const b = $("#btn-dica");
    if (b) { b.disabled = true; b.classList.remove("pulsa"); }
    const ajuda = DS.errosAqui + DS.dicasAqui;
    G.ajudaProx = ajuda >= 2 || tempo() > 130 || (G.modo === "aprendiz" && ajuda >= 1) ? 1 : 0;
    G.licoes[DS.id] = DS.def.licao;
    Dialogo.dizer(DS.def.ehTil ? D.FALAS.til : sorteio(D.FALAS.acertos), { expressao: "feliz" });
    await esperar(0.9);
    await revelarPista(DS.id);
  }

  async function revelarPista(id) {
    const L = D.LOCAIS[id];
    const attr = L.atributo;
    const valor = G.culpado[attr];
    const info = D.PISTA[attr][valor];
    G.pistas[attr] = valor;
    if (!G.feitos.includes(id)) G.feitos.push(id);

    F.flash();
    S.ui("flash");
    if (id === "seguranca") {
      S.estatica(0.45, 0.09);
      gsap.to("#sg-ruido", { opacity: 0, duration: 0.6 });
      $("#sg-legenda").textContent = DS.def.palavras.join(" ");
      gsap.set("#fd-medida", { opacity: 1 });
      gsap.fromTo("#fd-medida", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.8, ease: "power2.out", delay: 0.4 });
    } else if (id === "rubi") {
      const brilho = $("#rb-brilho");
      if (brilho) { brilho.style.animation = "none"; gsap.fromTo(brilho, { opacity: 1 }, { opacity: 0, duration: 0.3 }); }
      gsap.fromTo("#rb-lupa", { opacity: 0, scale: 0.6, transformOrigin: "15% 85%" }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" });
    } else if (id === "telhado") {
      $("#tl-pegadas").classList.add("reveladas");
      gsap.fromTo("#tl-pegadas .pegada", { opacity: 0.3 }, { opacity: 1, duration: 0.3, stagger: 0.12 });
      const r = $("#tl-rotulo");
      r.textContent = valor === "tenis" ? "PEGADAS DE TÊNIS" : "PEGADAS DE BOTAS";
      gsap.fromTo(r, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.7 });
    } else if (id === "rua") {
      gsap.fromTo("#ru-lembranca", { opacity: 0, scale: 0.85, transformOrigin: "95% 100%" }, { opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.6)" });
    }
    S.tocar("brilho", { vol: 0.5 });
    await esperar(0.7);

    const painel = $("#painel");
    await animar(painel, { opacity: 0, x: 30, duration: 0.25 });
    painel.innerHTML = `<div class="pista">
        <span class="pista-selo">PISTA ENCONTRADA</span>
        <div class="pista-icone">${A.icone(attr)}</div>
        <h3 class="pista-titulo">${info.titulo}</h3>
        <p class="pista-detalhe">${info.detalhe}</p>
        <p class="pista-licao"><b>VOCÊ PRATICOU</b>${DS.def.licao}</p>
        <button class="btn-grande" id="btn-para-mural">${A.icone("mural")} PRENDER NO MURAL</button>
      </div>`;
    gsap.fromTo(painel, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.4, clearProps: "transform" });
    gsap.fromTo(".pista-icone", { scale: 0.4, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)", delay: 0.1 });
    F.particulasEm($(".pista-icone"), { n: 26, vel: 340 });
    S.ui("estrela");
    const btn = $("#btn-para-mural");
    btn.addEventListener("click", () => muralDoLocal(id), { once: true });
    btn.focus({ preventScroll: true });
    if (leituraAuto()) S.ler(info.titulo + ". " + DS.def.licao);
  }

  async function muralDoLocal(id) {
    if (G.fase !== "local" || G.localAtual !== id) return;
    G.fase = "mural";
    S.ui("tique");
    S.calar();
    gsap.to("#painel", { opacity: 0, x: 40, duration: 0.3 });
    const L = D.LOCAIS[id];
    await Mural.abrir({ modo: "eliminar", attr: L.atributo, valor: G.culpado[L.atributo] });
    if (G.fase !== "mural") return;
    G.fase = "local";
    await voltarAoMapa();
  }

  async function voltarAoMapa() {
    if (G.fase !== "local") return;
    G.fase = "transicao";
    bloquear(true);
    S.calar();
    Dialogo.esconder();
    clearInterval(ocioTimer);
    if (buscaLimpar) { buscaLimpar(); buscaLimpar = null; }
    const L = D.LOCAIS[G.localAtual];
    await animar(cenas.local, { opacity: 0, duration: 0.3 });
    cancelAnimationFrame(ruidoRAF);
    tweensLocal.forEach((t) => t.kill());
    tweensLocal = [];
    S.ambienteSint(null);
    S.parar("sireneB", 0.5);
    mostrarCena("mundo");
    gsap.set(cenas.local, { clearProps: "opacity" });
    gsap.set("#local-cam", { clearProps: "all" });
    atualizarPontos();
    atualizarHud(L.atributo);
    gsap.set(["#m-pontos", "#hud-caso"], { opacity: 1 });
    const s = 5;
    gsap.set(mundoCam, { x: L.ponto.x * (1 - s), y: L.ponto.y * (1 - s), scale: s, filter: "blur(14px)" });
    S.tocar("whooshCurto", { vol: 0.5 });
    S.ambiente(true, 0.35);
    S.musicaVolume(0.3, 1);
    gsap.to(mundoCam, { filter: "blur(0px)", duration: 0.4, ease: "power2.out" });
    await animar(mundoCam, { x: 0, y: 0, scale: 1, duration: 0.85, ease: "power3.out" });
    gsap.set(mundoCam, { filter: "none" });
    bloquear(false);
    const n = G.feitos.length;
    if (n >= 4) { await irParaConfronto(); return; }
    G.fase = "mapa";
    Dialogo.dizer(D.FALAS.mapa[n], { expressao: "feliz" });
  }

  // ---------------------------------------------------------------------------
  // CONFRONTO: aponte a Sombra
  // ---------------------------------------------------------------------------
  async function irParaConfronto() {
    G.fase = "pre-confronto";
    await Dialogo.falar(D.FALAS.todasPistas, { expressao: "feliz" });
    G.fase = "transicao";
    bloquear(true);
    Dialogo.esconder();
    S.tocar("impacto", { vol: 0.45 });
    await cortina(1, 0.45);
    montarConfronto();
    mostrarCena("lineup");
    S.ambiente(true, 0.1);
    S.musicaVolume(0.24, 1);
    await cortina(0, 0.5);
    bloquear(false);
    G.fase = "confronto";
    gsap.fromTo(".lu-sus", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, clearProps: "opacity,transform" });
    Dialogo.dizer(D.FALAS.confronto, { lado: "topo", expressao: "pensa" });
  }

  function montarConfronto() {
    $("#lu-fundo").innerHTML = A.fundoLineup();
    $("#lu-suspeitos").innerHTML = D.SUSPEITOS.map((s, i) => {
      const cx = 250 + i * 355;
      const fora = G.eliminados.has(s.id);
      return `<div class="lu-sus ${fora ? "descartado" : "sobrou"}" data-id="${s.id}" style="left:${cx - 125}px">
        <div class="lu-num">${i + 1}</div>
        <div class="lu-cone"></div>
        <div class="lu-anel"></div>
        <div class="lu-fig">${A.figura(s)}</div>
        <div class="lu-sombra">${A.figura(s, { silhueta: true })}</div>
        <div class="lu-placa"><div class="lu-nome">${s.nome.toUpperCase()}</div><div class="lu-prof">${s.profissao}</div></div>
        <div class="lu-carimbo">DESCARTAD${s.genero === "f" ? "A" : "O"}</div>
        <button class="lu-alvo" aria-label="Acusar ${s.nome}"></button>
      </div>`;
    }).join("");
    $$(".lu-alvo").forEach((b) => b.addEventListener("click", () => abrirAcusacao(b.closest(".lu-sus").dataset.id)));
    $("#lu-revela").innerHTML = "";
    gsap.set(["#lu-escuro", "#lu-lav-v", "#lu-lav-a"], { opacity: 0 });
    gsap.set(["#lu-cab", "#cena-lineup"], { clearProps: "all" });
    gsap.timeline({ repeat: -1, repeatDelay: 2.4 }).to(".lu-sus .olhos", { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.07, yoyo: true, repeat: 1, stagger: 0.3 });
  }

  function abrirAcusacao(id) {
    if (G.fase !== "confronto" || modalAberto()) return;
    const s = suspeito(id);
    if (G.eliminados.has(id)) {
      S.ui("oops");
      F.tremer($(`.lu-sus[data-id="${id}"] .lu-fig`), 8, 2);
      Dialogo.dizer(D.FALAS.descartado(s), { lado: "topo", expressao: "pensa" });
      return;
    }
    S.ui("abrir");
    $$(".lu-sus").forEach((el) => el.classList.toggle("foco", el.dataset.id === id));
    abrirModal(
      `<div class="ac-retrato">${A.retrato(s, 300)}</div>
       <div>
         <p class="mc-cab">ACUSAÇÃO</p>
         <h2 class="mc-titulo">ACUSAR <em>${s.nome.toUpperCase()}</em>?</h2>
         <p class="mc-texto">${s.artigo === "a" ? "Ela" : "Ele"} combina com as <b>4 pistas</b> do mural. Você só pode acusar <b>UMA</b> pessoa!</p>
         <div class="mc-botoes"><button class="btn-grande rubi" id="ac-sim">SIM, ACUSAR!</button><button class="btn" id="ac-nao">VOLTAR</button></div>
       </div>`,
      "acusar"
    );
    $("#ac-sim").addEventListener("click", () => { fecharModal(); revelacao(s); }, { once: true });
    $("#ac-nao").addEventListener("click", () => { S.ui("tique"); fecharModal(); $$(".lu-sus").forEach((el) => el.classList.remove("foco")); }, { once: true });
  }

  async function revelacao(s) {
    if (G.fase !== "confronto") return;
    G.fase = "revelacao";
    bloquear(true);
    Dialogo.esconder();
    S.calar();
    const el = $(`.lu-sus[data-id="${s.id}"]`);
    el.classList.remove("foco");
    el.classList.add("revelado");
    const outros = $$(".lu-sus").filter((x) => x !== el);
    S.tocar("impacto", { vol: 0.7 });
    S.ambiente(false);
    S.musicaVolume(0.12, 0.6);
    gsap.to("#lu-escuro", { opacity: 1, duration: 0.6 });
    gsap.to("#lu-cab", { opacity: 0, duration: 0.4 });
    gsap.to(outros, { opacity: 0, duration: 0.5 });
    gsap.to($$(".lu-num, .lu-placa, .lu-anel", el), { opacity: 0, duration: 0.3 });
    const centro = parseFloat(el.style.left) + 125;
    gsap.to(el, { x: 560 - centro, duration: 0.9, ease: "power2.inOut" });
    const rv = $("#lu-revela");
    rv.innerHTML = `<div class="rv-topo">A SOMBRA ERA...</div>
      <div class="rv-nome"><b>${s.nome.toUpperCase()}!</b><span>${s.profissao}</span></div>
      <div class="rv-fala">“${s.confissao}”</div>
      <div class="rv-rubi">${A.rubi(110)}</div>
      <div class="rv-rubi-txt">RUBI RECUPERADO!</div>
      <div class="rv-carimbo">CASO ENCERRADO</div>`;
    gsap.fromTo(".rv-topo", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.5, delay: 0.5 });
    const sombra = $(".lu-sombra", el);
    gsap.set(sombra, { opacity: 0, clipPath: "inset(0% 0% 0% 0%)" });
    gsap.to(sombra, { opacity: 1, duration: 0.45, delay: 0.7 });
    await esperar(1.9);
    S.tocar("brilho", { vol: 0.5 });
    await animar(sombra, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "power2.inOut" });
    S.tocar("impacto", { vol: 0.75 });
    S.musicaPular(30.36, 0.6);
    S.tocar("sireneA", { vol: 0.3, dur: 8, fade: 1.5 });
    setTimeout(() => S.tocar("sireneB", { vol: 0.15, dur: 6.5, fade: 1.5 }), 900);
    gsap.fromTo(".rv-nome", { opacity: 0, x: -20, filter: "blur(8px)" }, { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.35, ease: "power4.out" });
    gsap.fromTo("#lu-lav-v", { opacity: 0 }, { opacity: 0.9, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.fromTo("#lu-lav-a", { opacity: 0 }, { opacity: 0.9, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.5 });
    F.particulas(560, 480, { n: 30, vel: 380 });
    await esperar(0.7);
    gsap.fromTo(".rv-fala", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
    await esperar(1.8);
    // o rubi cai da mochila da Sombra
    S.tocar("brilho", { vol: 0.55 });
    gsap.fromTo(".rv-rubi", { opacity: 0, y: -60, scale: 0.4, rotation: -30 }, { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.7, ease: "bounce.out" });
    gsap.fromTo(".rv-rubi-txt", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.5 });
    setTimeout(() => F.particulas(570, 510, { n: 24, cores: ["#e0284a", "#ff6b81", "#ffd89a"] }), 500);
    await esperar(1.6);
    gsap.fromTo(".rv-carimbo", { opacity: 0, scale: 2.2, rotation: -8 }, { opacity: 1, scale: 1, rotation: -8, duration: 0.3, ease: "power3.in" });
    await esperar(0.3);
    S.tocar("impacto", { vol: 0.6 });
    F.tremer("#cena-lineup", 9, 2);
    await esperar(2.4);
    await telaFinal(s);
  }

  // ---------------------------------------------------------------------------
  // FINAL: título, assinatura e jornal
  // ---------------------------------------------------------------------------
  async function telaFinal(s) {
    G.fase = "final-anim";
    bloquear(true);
    G.tempoFinal = tempo();
    try { localStorage.setItem("rp-casos", String(lerNumero("rp-casos") + 1)); } catch (e) {}
    await cortina(1, 0.5);
    gsap.killTweensOf(["#lu-lav-v", "#lu-lav-a"]);
    mostrarCena("mundo");
    mundoModoTitulo();
    gsap.set(["#m-guarita", "#m-tonho"], { opacity: 1 });
    $("#titulo-acoes").style.display = "none";
    $("#titulo-rodape").textContent = "";
    S.ambiente(true, 0.3);
    await cortina(0, 0.6);

    const t = $("#titulo");
    t.classList.add("com-quase");
    gsap.set(".q-palavra", { clipPath: "inset(0% 100% 0% 0%)" });
    gsap.set(".q-circ", { opacity: 0, scale: 0.3 });
    await esperar(0.5);
    S.ui("peca");
    gsap.to(".q-circ", { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)" });
    await esperar(0.25);
    S.ui("rabisco");
    await animar(".q-palavra", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power1.inOut" });
    await esperar(1.3);
    gsap.to("#titulo", { y: -400, scale: 0.55, transformOrigin: "50% 585px", duration: 0.8, ease: "power3.inOut" });
    gsap.to("#titulo-escuro", { opacity: 0, duration: 0.6 });
    await esperar(0.6);
    bloquear(false);
    await pedirAssinatura();
    await mostrarJornal(s);
  }

  function pedirAssinatura() {
    G.fase = "assinatura";
    const s = G.sessao;
    return new Promise((resolve) => {
      const box = $("#assinatura");
      const linhas = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç"],
        ["Z", "X", "C", "V", "B", "N", "M", "⌫"],
        ["Á", "É", "Í", "Ó", "Ú", "Â", "Ê", "Ô", "Ã", "Õ"],
        ["ESPAÇO"],
      ];
      box.innerHTML = `<p class="as-cab">RELATÓRIO DO CASO</p>
        <h2>ASSINE COM O SEU NOME, DETETIVE!</h2>
        <div class="as-nome" id="as-nome"></div>
        <div class="as-teclado">${linhas.map((l) => `<div class="as-linha">${l.map((k) => {
          if (k === "⌫") return `<button class="tecla apagar" data-k="apagar" aria-label="Apagar">${A.icone("apagar")}</button>`;
          if (k === "ESPAÇO") return `<button class="tecla larga" data-k=" ">ESPAÇO</button>`;
          return `<button class="tecla" data-k="${k}">${k}</button>`;
        }).join("")}</div>`).join("")}</div>
        <div class="as-botoes"><button class="btn-grande" id="as-ok">ASSINAR ✍</button><button class="btn" id="as-pular">PULAR</button></div>`;
      box.style.display = "block";
      gsap.fromTo(box, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", clearProps: "transform" });
      // o Til sai de cena para não cobrir o teclado; no modo aprendiz a frase é lida em voz alta
      Dialogo.esconder();
      if (leituraAuto()) S.ler(D.FALAS.assinatura);
      let nome = "";
      const nomeEl = $("#as-nome");
      const desenhar = () => {
        nomeEl.innerHTML = nome ? `<span>${nome.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span><i class="as-cursor"></i>` : '<span class="as-vazio">seu nome</span><i class="as-cursor"></i>';
      };
      const formatar = (t) => t.toLowerCase().replace(/(^|\s)(\S)/g, (m, a, b) => a + b.toUpperCase());
      const tecla = (k) => {
        if (G.fase !== "assinatura") return;
        if (k === "apagar") nome = nome.slice(0, -1);
        else if (k === " ") { if (nome && !nome.endsWith(" ") && nome.length < 16) nome += " "; }
        else if (nome.length < 16) nome = formatar(nome + k);
        S.ui("tecla");
        desenhar();
      };
      G.teclaNome = tecla;
      desenhar();
      $$(".tecla", box).forEach((b) => b.addEventListener("click", () => tecla(b.dataset.k)));
      const terminar = (assinou) => {
        if (G.fase !== "assinatura" || s !== G.sessao) return;
        G.fase = "final-anim";
        G.teclaNome = null;
        G.nome = assinou ? nome.trim() : "";
        S.ui(assinou && G.nome ? "certo" : "tique");
        gsap.to(box, { opacity: 0, y: 30, duration: 0.35, onComplete: () => { box.style.display = "none"; gsap.set(box, { clearProps: "all" }); box.style.display = "none"; } });
        Dialogo.esconder();
        setTimeout(() => { if (s === G.sessao) resolve(); }, 380);
      };
      $("#as-ok").addEventListener("click", () => terminar(true));
      $("#as-pular").addEventListener("click", () => terminar(false));
      G.assinar = () => terminar(true);
    });
  }

  async function mostrarJornal(s) {
    G.fase = "final-anim";
    const pontos = G.erros + G.dicas;
    const r = D.ranking(pontos);
    const seg = G.tempoFinal || tempo();
    const licoes = D.ORDEM_LOCAIS.map((id) => G.licoes[id]).filter(Boolean);
    const nome = G.nome ? G.nome.toUpperCase() : "";
    const hoje = new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
    const idFama = Date.now();
    if (G.nome) registrarFama({ id: idFama, nome: G.nome, avatar: G.avatar, estrelas: r.estrelas, tempo: Math.round(seg), modo: G.modo });
    const av = D.AVATARES[G.avatar];
    const jn = $("#jornal");
    jn.innerHTML = `<div class="jn-giro"><div class="jn-papel">
        <div class="jn-topo"><span class="jn-extra">EDIÇÃO EXTRA</span><b>GAZETA DO MUSEU</b><span>${hoje.toUpperCase()}</span></div>
        <h2 class="jn-manchete">${nome ? `DETETIVE <em>${nome}</em>` : "DETETIVE DA FEIRA"} DESMASCARA A SOMBRA!</h2>
        <div class="jn-corpo">
          <figure class="jn-foto">${A.fotoJornal(av)}<figcaption>${nome ? `Detetive ${G.nome}` : "O detetive"} e o farejador Til com o Rubi Nacional, de volta ao museu.</figcaption></figure>
          <div class="jn-texto">
            <p class="jn-lead">A misteriosa Sombra era ${s.nome}, ${s.artigo} ${s.profissao.toLowerCase()}. Pega pelas pistas, confessou: “${s.confissao}”</p>
            <div class="jn-box"><b>O QUE O DETETIVE PRATICOU</b><ul>${licoes.map((l) => `<li>${l}</li>`).join("")}</ul></div>
          </div>
        </div>
        <div class="jn-ficha">
          <div class="jn-ficha-foto">${A.fotoSuspeito(s)}<span>${s.genero === "f" ? "PRESA" : "PRESO"}</span></div>
          <div class="jn-ficha-txt">
            <b>FICHA DA SOMBRA · AS 4 PISTAS</b>
            <p>${s.nome}, ${s.artigo} ${s.profissao.toLowerCase()}</p>
            <div class="jn-chips">${D.ATRIBUTOS.map((a) => `<span class="jn-chip">${A.icone(a)}${a === "cabelo" ? "CABELO " : ""}${D.PISTA[a][s[a]].curta}</span>`).join("")}</div>
          </div>
        </div>
        <div class="jn-selo"><div class="jn-estrelas">${[1, 2, 3].map((i) => A.icone("estrela", i <= r.estrelas ? "" : "apagada")).join("")}</div>${r.titulo}<small>CASO RESOLVIDO EM ${mmss(seg)}</small></div>
      </div></div>
      <div class="jn-botoes">
        <button class="btn-grande" id="btn-denovo">JOGAR DE NOVO</button>
        <button class="btn" id="btn-fama2">${A.icone("trofeu")} MURAL DOS DETETIVES</button>
        <button class="btn" id="btn-creditos2">CRÉDITOS</button>
      </div>`;
    jn.style.display = "block";
    S.ui("imprensa");
    S.tocar("whoosh", { inicio: 1.5, vol: 0.4, dur: 1.6 });
    await animarDe(".jn-giro", { scale: 0.05, rotation: -720, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1.15, ease: "power3.out" });
    S.tocar("impacto", { vol: 0.55 });
    F.tremer(".jn-giro", 6, 2);
    F.confete(120, 3.8);
    S.ui("estrela");
    gsap.fromTo(".jn-selo", { scale: 2.4, opacity: 0, rotation: -7 }, { scale: 1, opacity: 1, rotation: -7, duration: 0.35, delay: 0.3, ease: "power3.in", onComplete: () => S.ui("carimbo") });
    gsap.fromTo(".jn-ficha-foto span", { scale: 2.2, opacity: 0, rotation: -14 }, { scale: 1, opacity: 1, rotation: -14, duration: 0.3, delay: 0.75, ease: "power3.in" });
    gsap.fromTo(".jn-chip", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.5, stagger: 0.08, ease: "power2.out" });
    gsap.fromTo(".jn-botoes", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.6 });
    $("#btn-denovo").addEventListener("click", () => { S.ui("tique"); reiniciar(true); }, { once: true });
    $("#btn-fama2").addEventListener("click", () => abrirFama(G.nome ? idFama : null));
    $("#btn-creditos2").addEventListener("click", abrirCreditos);
    G.fase = "final";
    $("#btn-denovo").focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------------------
  // REINÍCIO
  // ---------------------------------------------------------------------------
  function reiniciar(tocar) {
    G.sessao++;
    gsap.globalTimeline.clear();
    clearInterval(ocioTimer);
    cancelAnimationFrame(ruidoRAF);
    if (buscaLimpar) { buscaLimpar(); buscaLimpar = null; }
    tweensLocal = [];
    DS = null;
    G.teclaNome = null;
    G.assinar = null;
    S.pararTudo();
    Dialogo.esconder();
    Mural.reset();
    fecharModal();
    bloquear(false);
    F.limpar();
    gsap.set("#cortina", { opacity: 0 });
    gsap.set([mundoCam, cenas.mundo, cenas.local, cenas.lineup, "#local-cam", "#painel", "#m-pontos", "#titulo-acoes", "#escolha", "#hud-caso", "#assinatura", "#jornal", "#lanterna"], { clearProps: "all" });
    $("#lanterna").classList.remove("ativa");
    ["#escolha", "#hud-caso", "#assinatura", "#jornal"].forEach((sel) => { $(sel).innerHTML = ""; $(sel).style.display = "none"; });
    $("#lu-suspeitos").innerHTML = "";
    $("#lu-revela").innerHTML = "";
    iniciarLoops();
    if (tocar) {
      G.fase = "video";
      tocarVideo();
    } else {
      prepararAbertura();
    }
  }

  // ---------------------------------------------------------------------------
  // ENTRADAS
  // ---------------------------------------------------------------------------
  function ligarEntradas() {
    $$("[data-icone]").forEach((el) => { el.innerHTML = A.icone(el.dataset.icone); });
    $("#btn-toque").addEventListener("click", () => { S.desbloquear(); tocarVideo(); });
    $("#btn-pular").addEventListener("click", () => { S.ui("tique"); irParaTitulo(false); });
    video.addEventListener("ended", () => irParaTitulo(true));
    video.addEventListener("error", () => { if (G.fase === "video") irParaTitulo(false); });
    $("#btn-iniciar").addEventListener("click", mostrarEscolha);
    $("#btn-creditos").addEventListener("click", abrirCreditos);
    $("#btn-fama").addEventListener("click", () => abrirFama(null));

    const btnSom = $("#btn-som");
    btnSom.innerHTML = A.icone("som");
    btnSom.addEventListener("click", () => {
      S.desbloquear();
      S.setMudo(!S.mudo);
      btnSom.innerHTML = A.icone(S.mudo ? "mudo" : "som");
    });
    const btnTela = $("#btn-tela");
    btnTela.innerHTML = A.icone("tela");
    btnTela.addEventListener("click", () => {
      const doc = document, raiz = doc.documentElement;
      try {
        if (!doc.fullscreenElement && !doc.webkitFullscreenElement) (raiz.requestFullscreen || raiz.webkitRequestFullscreen).call(raiz);
        else (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
      } catch (e) { /* sem tela cheia neste navegador */ }
    });

    $("#modal").addEventListener("click", (e) => {
      if (avisoOcioso) { fecharModal(); return; }
      if (e.target === $("#modal") && !$("#ac-sim")) fecharModal();
    });

    window.addEventListener("keydown", (e) => {
      const k = e.key;
      if (G.fase === "video" && (k === "Escape" || k === "Enter" || k === " ")) { e.preventDefault(); irParaTitulo(false); return; }
      if (modalAberto()) {
        if (k === "Escape") { const b = $("#ac-nao") || $("#btn-fechar"); if (b) b.click(); else fecharModal(); }
        return;
      }
      if (G.fase === "assinatura" && G.teclaNome) {
        if (k === "Backspace") { e.preventDefault(); G.teclaNome("apagar"); return; }
        if (k === "Enter") { e.preventDefault(); if (G.assinar) G.assinar(); return; }
        if (k === " ") { e.preventDefault(); G.teclaNome(" "); return; }
        if (k.length === 1 && /[a-zA-ZÀ-ÿ]/.test(k)) { e.preventDefault(); G.teclaNome(k.toUpperCase()); return; }
      }
      const emBotao = document.activeElement && document.activeElement.tagName === "BUTTON";
      if ((k === "Enter" || k === " ") && Dialogo.esperando() && !emBotao) { e.preventDefault(); Dialogo.avancar(); return; }
      if (G.fase === "local" && DS && !DS.fim && DS.ui && DS.ui.teclas && /^[1-3]$/.test(k)) DS.ui.teclas(+k);
    });
    window.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("scroll", (e) => {
      const el = e.target;
      if (el && el.nodeType === 1 && (el.scrollTop || el.scrollLeft)) { el.scrollTop = 0; el.scrollLeft = 0; }
    }, true);
    window.addEventListener("resize", ajustar);
    document.addEventListener("fullscreenchange", ajustar);

    // ninguém mexendo: pergunta, depois volta ao começo (bom para a feira)
    let ultimoInput = performance.now();
    ["pointerdown", "keydown"].forEach((ev) => window.addEventListener(ev, () => { ultimoInput = performance.now(); }, true));
    setInterval(() => {
      const t = (performance.now() - ultimoInput) / 1000;
      const jogando = FASES_JOGANDO.includes(G.fase);
      if (jogando && t > 100 && !avisoOcioso) abrirAvisoOcioso();
      if ((jogando && t > 120) || (G.fase === "final" && t > 90) || (G.fase === "titulo" && t > 120)) reiniciar(false);
    }, 1000);
  }

  // ---------------------------------------------------------------------------
  ajustar();
  criarMundo();
  $("#til-retrato").innerHTML = A.til();
  ligarEntradas();
  iniciarLoops();
  prepararAbertura();

  // acesso para testes no console
  window.JOGO = { G, reiniciar, Dialogo, Mural, get DS() { return DS; } };
})();
