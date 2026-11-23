/* O Roubo Perfeito 2.0 — dados do jogo: suspeitos, detetives, locais, desafios de
   português (dois níveis) e falas. Para trocar textos, edite este arquivo. */
window.DADOS = (function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // SUSPEITOS — quatro características que as pistas revelam:
  //   altura: "alta" | "baixa"     cabelo: "comprido" | "curto"
  //   calcado: "tenis" | "botas"   oculos: "sim" | "nao"
  // Cada combinação é única: com as 4 pistas só sobra uma pessoa no mural.
  // ---------------------------------------------------------------------------
  const SUSPEITOS = [
    {
      id: "bento", nome: "Bento", artigo: "o", genero: "m", profissao: "Vigia noturno", cm: 186,
      altura: "alta", cabelo: "curto", calcado: "botas", oculos: "nao",
      alibi: "Eu estava fazendo a ronda no jardim, juro!",
      confissao: "Vinte anos vigiando esse rubi... Um dia eu quis levá-lo para casa!",
      voz: "grave",
      visual: {
        pele: "#8d5a3b", corpo: "robusto", cabeloEstilo: "curto", cabeloCor: "#b9b4ab", bigode: true,
        roupa: "vigia", sapatoCor: "#2a1f18", acessorio: "lanterna",
      },
    },
    {
      id: "helena", nome: "Helena", artigo: "a", genero: "f", profissao: "Curadora do museu", cm: 156,
      altura: "baixa", cabelo: "comprido", calcado: "botas", oculos: "sim",
      alibi: "Eu estava em casa, organizando a lista dos quadros.",
      confissao: "Eu ia deixar uma cópia no lugar. Ninguém ia perceber!",
      voz: "media",
      visual: {
        pele: "#e3b58f", corpo: "magro", cabeloEstilo: "tranca", cabeloCor: "#17181d",
        roupa: "curadora", sapatoCor: "#2a1f18", acessorio: "prancheta",
        oculosForma: "redondo", oculosCor: "#e8b04a",
      },
    },
    {
      id: "rafa", nome: "Rafa", artigo: "o", genero: "m", profissao: "Restaurador de quadros", cm: 184,
      altura: "alta", cabelo: "comprido", calcado: "tenis", oculos: "sim",
      alibi: "Eu estava pintando no meu ateliê a noite toda!",
      confissao: "Eu só queria pintar o rubi bem de pertinho...",
      voz: "media",
      visual: {
        pele: "#f1c9a8", corpo: "magro", cabeloEstilo: "longo", cabeloCor: "#c4552b", sardas: true,
        roupa: "pintor", sapatoCor: "#eef0f2", tenisCor: "#2a6bff", acessorio: "pincel",
        oculosForma: "retangular", oculosCor: "#15171c",
      },
    },
    {
      id: "lia", nome: "Lia", artigo: "a", genero: "f", profissao: "Limpadora de vidros", cm: 152,
      altura: "baixa", cabelo: "curto", calcado: "tenis", oculos: "nao",
      alibi: "Eu estava dormindo! Eu limpo os vidros bem cedinho.",
      confissao: "Eu limpo aquela cúpula toda semana. Conheço cada vidro!",
      voz: "aguda",
      visual: {
        pele: "#6e452f", corpo: "magro", cabeloEstilo: "cacheado", cabeloCor: "#15161b",
        roupa: "macacao", sapatoCor: "#eef0f2", tenisCor: "#e0284a", acessorio: "rodo",
      },
    },
    {
      id: "otavio", nome: "Otávio", artigo: "o", genero: "m", profissao: "Colecionador de joias", cm: 158,
      altura: "baixa", cabelo: "curto", calcado: "botas", oculos: "sim",
      alibi: "Eu estava num jantar chiquíssimo, ora essa!",
      confissao: "Minha coleção estava incompleta sem esse rubi!",
      voz: "grave",
      visual: {
        pele: "#f0cfb2", corpo: "robusto", cabeloEstilo: "curto", cabeloCor: "#ebe7df", bigode: true,
        roupa: "terno", sapatoCor: "#16161a", acessorio: "bengala",
        oculosForma: "redondo", oculosCor: "#e8b04a",
      },
    },
  ];

  // A testemunha (não é suspeito).
  const TONHO = {
    id: "tonho", nome: "Seu Tonho", cm: 170, calcado: "botas", oculos: "nao",
    visual: {
      pele: "#7a4b2e", corpo: "robusto", cabeloEstilo: "curto", cabeloCor: "#d9d4ca", bigode: true,
      chapeu: "bone", roupa: "gari", sapatoCor: "#1d1e22", acessorio: "vassoura",
    },
  };

  // Os detetives que a criança pode escolher (só aparecem em retrato).
  const AVATARES = [
    { id: "cacador", cm: 150, calcado: "tenis", oculos: "nao",
      visual: { pele: "#8d5a3b", corpo: "magro", cabeloEstilo: "cacheado", cabeloCor: "#1b1a1f", chapeu: "cacador", roupa: "trench", sapatoCor: "#eef0f2" } },
    { id: "chapeu", cm: 150, calcado: "tenis", oculos: "nao",
      visual: { pele: "#f1c9a8", corpo: "magro", cabeloEstilo: "curto", cabeloCor: "#c4552b", sardas: true, chapeu: "fedora", roupa: "sobretudo", sapatoCor: "#eef0f2" } },
    { id: "oculos", cm: 150, calcado: "tenis", oculos: "sim",
      visual: { pele: "#6e452f", corpo: "magro", cabeloEstilo: "puffs", cabeloCor: "#15161b", roupa: "cachecol", sapatoCor: "#eef0f2", oculosForma: "redondo", oculosCor: "#e8b04a" } },
    { id: "bone", cm: 150, calcado: "tenis", oculos: "nao",
      visual: { pele: "#c68b5e", corpo: "magro", cabeloEstilo: "curto", cabeloCor: "#2a1d14", chapeu: "bone-azul", roupa: "jaqueta", sapatoCor: "#eef0f2" } },
  ];

  const MODOS = {
    aprendiz: { id: "aprendiz", nome: "APRENDIZ", estrelas: 1, sub: "Para quem está começando a ler", leituraAuto: true },
    investigador: { id: "investigador", nome: "INVESTIGADOR", estrelas: 2, sub: "Para quem já lê bem", leituraAuto: false },
  };

  const ATRIBUTOS = ["altura", "cabelo", "calcado", "oculos"];

  // Palavras da ficha de cada suspeito (o adjetivo concorda com a pessoa).
  function ficha(s, attr) {
    const v = s[attr];
    if (attr === "altura") {
      const alto = v === "alta";
      if (s.genero === "f") return alto ? "ALTA" : "BAIXA";
      return alto ? "ALTO" : "BAIXO";
    }
    if (attr === "cabelo") return v === "comprido" ? "CABELO COMPRIDO" : "CABELO CURTO";
    if (attr === "calcado") return v === "tenis" ? "TÊNIS" : "BOTAS";
    return v === "sim" ? "COM ÓCULOS" : "SEM ÓCULOS";
  }
  // Etiqueta embaixo da foto no mural.
  function etiqueta(s, attr) {
    let t = ficha(s, attr);
    if (attr === "altura") t += ` · ${(s.cm / 100).toFixed(2).replace(".", ",")} m`;
    return t;
  }
  const combina = (s, attr, valor) => s[attr] === valor;

  // Como a pista aparece no jogo.
  const PISTA = {
    altura: {
      rotulo: "ALTURA",
      alta: { curta: "ALTA", frase: "A Sombra é <em>ALTA</em>", titulo: "A SOMBRA É <em>ALTA</em>", detalhe: "Mais de 1,80 m: quase da altura da porta do telhado.", riscar: "Risque quem é <em>BAIXO</em>!" },
      baixa: { curta: "BAIXA", frase: "A Sombra é <em>BAIXA</em>", titulo: "A SOMBRA É <em>BAIXA</em>", detalhe: "Menos de 1,60 m: bem mais baixa que a porta do telhado.", riscar: "Risque quem é <em>ALTO</em>!" },
    },
    cabelo: {
      rotulo: "CABELO",
      comprido: { curta: "COMPRIDO", frase: "Cabelo <em>COMPRIDO</em>", titulo: "O CABELO É <em>COMPRIDO</em>", detalhe: "O fio que caiu na almofada mede 30 centímetros!", riscar: "Risque quem tem cabelo <em>CURTO</em>!" },
      curto: { curta: "CURTO", frase: "Cabelo <em>CURTO</em>", titulo: "O CABELO É <em>CURTO</em>", detalhe: "O fio que caiu na almofada mede só 2 centímetros.", riscar: "Risque quem tem cabelo <em>COMPRIDO</em>!" },
    },
    calcado: {
      rotulo: "CALÇADO",
      tenis: { curta: "TÊNIS", frase: "Usa <em>TÊNIS</em>", titulo: "A SOMBRA USA <em>TÊNIS</em>", detalhe: "Sola de borracha com desenho em zigue-zague.", riscar: "Risque quem usa <em>BOTAS</em>!" },
      botas: { curta: "BOTAS", frase: "Usa <em>BOTAS</em>", titulo: "A SOMBRA USA <em>BOTAS</em>", detalhe: "Sola lisa com um salto quadrado.", riscar: "Risque quem usa <em>TÊNIS</em>!" },
    },
    oculos: {
      rotulo: "ÓCULOS",
      sim: { curta: "COM ÓCULOS", frase: "Usa <em>ÓCULOS</em>", titulo: "A SOMBRA USA <em>ÓCULOS</em>", detalhe: "A luz da lua brilhou nas lentes.", riscar: "Risque quem <em>NÃO</em> usa óculos!" },
      nao: { curta: "SEM ÓCULOS", frase: "<em>NÃO</em> usa óculos", titulo: "A SOMBRA <em>NÃO</em> USA ÓCULOS", detalhe: "O Seu Tonho viu os olhos dela pelo buraco da máscara.", riscar: "Risque quem <em>USA</em> óculos!" },
    },
  };

  // Quando a criança tenta riscar alguém que COMBINA com a pista.
  function porqueCombina(s, attr) {
    const art = s.artigo === "a" ? "A" : "O";
    const ele = s.genero === "f" ? "ela" : "ele";
    let desc;
    if (attr === "altura") desc = "é " + ficha(s, "altura").toLowerCase();
    else if (attr === "cabelo") desc = "tem cabelo " + s.cabelo;
    else if (attr === "calcado") desc = "usa " + (s.calcado === "tenis" ? "tênis" : "botas");
    else desc = s.oculos === "sim" ? "usa óculos" : "não usa óculos";
    return `${art} ${s.nome} ${desc}: ${ele} <em>combina</em> com a pista. Não risque!`;
  }

  // ---------------------------------------------------------------------------
  // LOCAIS da investigação (pontos no mapa do museu, em coordenadas 1920x1080).
  // ---------------------------------------------------------------------------
  const LOCAIS = {
    seguranca: {
      id: "seguranca", nome: "SALA DE SEGURANÇA", rotulo: "CÂMERAS", atributo: "altura",
      ponto: { x: 250, y: 768 }, rotuloLado: "cima", busca: "monitor",
      buscaFala: "Quantas câmeras! Toque no monitor da câmera do <em>TELHADO</em>.",
      buscaDica: "Leia as placas embaixo das telas. Procure a palavra <em>TELHADO</em>!",
      achou: "Achou! A câmera filmou a Sombra, mas a legenda ficou toda <em>embaralhada</em>.",
    },
    rubi: {
      id: "rubi", nome: "SALA DO RUBI", rotulo: "SALA DO RUBI", atributo: "cabelo",
      ponto: { x: 960, y: 694 }, rotuloLado: "baixo", busca: "lanterna",
      buscaFala: "Está escuro! Arraste a <em>lanterna</em> pela sala e procure uma prova.",
      buscaDica: "Au! Sinto um cheiro perto do <em>pedestal</em> do rubi!",
      achou: "Um <em>fio de cabelo</em> na almofada! A Sombra ficou de cabeça para baixo aqui.",
      alvo: { x: 556, y: 616, w: 190, h: 150 }, luz: { x: 300, y: 420 },
    },
    telhado: {
      id: "telhado", nome: "TELHADO", rotulo: "TELHADO", atributo: "calcado",
      ponto: { x: 960, y: 238 }, rotuloLado: "esquerda", busca: "lanterna",
      buscaFala: "Que escuridão! Passe a <em>lanterna</em> pelo telhado. Fareje!",
      buscaDica: "Olhe o <em>chão</em>, perto da cúpula de vidro!",
      achou: "<em>Pegadas</em> na poeira! A perícia começou a escrever o nome do calçado...",
      alvo: { x: 486, y: 812, w: 560, h: 150 }, luz: { x: 820, y: 400 },
    },
    rua: {
      id: "rua", nome: "RUA DO MUSEU", rotulo: "TESTEMUNHA", atributo: "oculos",
      ponto: { x: 1588, y: 782 }, rotuloLado: "cima", busca: null,
      achou: "O Seu Tonho viu a Sombra fugir! O policial anotou tudo... mas com <em>um errinho</em>.",
    },
  };
  const ORDEM_LOCAIS = ["seguranca", "rubi", "telhado", "rua"];
  const CAMERAS = ["ENTRADA", "CORREDOR", "SALA DO RUBI", "TELHADO", "JARDIM", "ESCADA"];

  // ---------------------------------------------------------------------------
  // DESAFIOS DE PORTUGUÊS (bem fáceis).
  //   modo "aprendiz": menos palavras e menos opções.  modo "investigador": um pouco mais.
  //   nivel 0 = normal; nivel 1 = com ajuda (menos opções e a regra já aparece no começo).
  // ---------------------------------------------------------------------------
  function embaralhar(lista, rnd) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const limpar = (html) => html.replace(/<[^>]+>/g, "");

  function desafio(localId, valor, nivel, modo, rnd) {
    rnd = rnd || Math.random;
    const ap = modo === "aprendiz";

    if (localId === "seguranca") {
      const fem = valor; // alta | baixa
      const masc = valor === "alta" ? "alto" : "baixo";
      const palavras = ap ? ["A", "sombra", "é", fem + "."] : ["A", "sombra", "era", "muito", fem + "."];
      const extras = !ap && nivel === 0 ? [masc + "."] : [];
      return {
        tipo: "frase",
        categoria: extras.length ? "ORDEM E CONCORDÂNCIA" : "ORDEM DAS PALAVRAS",
        titulo: "MONTE A FRASE",
        instrucao: extras.length
          ? "Monte a legenda da câmera na <em>ordem certa</em>. Atenção: <em>uma palavra sobra</em>!"
          : "Toque nas palavras na <em>ordem certa</em> para consertar a legenda da câmera.",
        leitura: extras.length
          ? "Monte a legenda da câmera na ordem certa. Atenção: uma palavra sobra."
          : "Toque nas palavras na ordem certa para montar a legenda da câmera.",
        palavras,
        extras,
        extraMsg: `A palavra <em>sombra</em> é feminina: a sombra é <em>${fem}</em>, não ${masc}!`,
        dicas: [
          "Toda frase começa com letra <em>MAIÚSCULA</em> e termina com <em>ponto final</em>." + (extras.length ? ` E a sombra é <em>${fem}</em>!` : ""),
          "Vou colocar a próxima palavra para você!",
          "Pronto, montei a frase. Veja como ficou!",
        ],
        licao: extras.length
          ? `Frase começa com maiúscula e termina com ponto. E concordância: a sombra é ${fem}.`
          : "Frases começam com letra maiúscula e terminam com ponto final.",
      };
    }

    if (localId === "rubi") {
      const comprido = valor === "comprido";
      if (ap) {
        return {
          tipo: "escolha",
          categoria: "VOCABULÁRIO",
          titulo: "COMO É O FIO?",
          instrucao: "Olhe o fio de cabelo na lupa. Ele é <em>comprido</em> ou <em>curto</em>?",
          leitura: "Olhe o fio de cabelo na lupa. Ele é comprido ou curto?",
          imagem: "fio",
          opcoes: embaralhar([{ texto: "comprido", certo: comprido }, { texto: "curto", certo: !comprido }], rnd),
          dicas: [
            "<em>Comprido</em> é longo, que nem uma cobra. <em>Curto</em> é pequenininho.",
            "Sobrou só a resposta certa!",
            "A resposta certa está brilhando. Toque nela!",
          ],
          licao: "COMPRIDO e CURTO têm sentidos contrários: são antônimos.",
          resposta: comprido ? "comprido" : "curto",
        };
      }
      const certa = comprido ? "comprido" : "curto";
      let erradas = comprido ? ["curto", "redondo"] : ["longo", "alto"];
      if (nivel >= 1) erradas = erradas.slice(0, 1);
      return {
        tipo: "escolha",
        categoria: comprido ? "SINÔNIMOS" : "ANTÔNIMOS",
        titulo: comprido ? "MESMO SENTIDO" : "SENTIDO CONTRÁRIO",
        instrucao: comprido
          ? "O fio de cabelo é bem <em>LONGO</em>. Qual palavra quer dizer o <em>mesmo</em> que “longo”?"
          : "O fio de cabelo é pequenininho, nada comprido. Qual é o <em>contrário</em> de “comprido”?",
        leitura: comprido
          ? "O fio de cabelo é bem longo. Qual palavra quer dizer o mesmo que longo?"
          : "O fio de cabelo é pequenininho. Qual é o contrário de comprido?",
        opcoes: embaralhar([{ texto: certa, certo: true }].concat(erradas.map((t) => ({ texto: t, certo: false }))), rnd),
        dicas: [
          comprido
            ? "Palavras com o <em>mesmo sentido</em> são SINÔNIMOS. Uma estrada longa é uma estrada..."
            : "Palavras de <em>sentido contrário</em> são ANTÔNIMOS. O contrário de grande é pequeno; o de comprido é...",
          "Tirei uma opção errada. Agora ficou mais fácil!",
          "A resposta certa está brilhando. Toque nela!",
        ],
        licao: comprido ? "Sinônimos têm o mesmo sentido: longo = comprido." : "Antônimos têm sentidos contrários: comprido × curto.",
        resposta: certa,
      };
    }

    if (localId === "telhado") {
      const tenis = valor === "tenis";
      const molde = tenis ? ["T", null, "N", "I", "S"] : ["B", "O", "T", "A", null];
      const certa = tenis ? "Ê" : "S";
      let erradas = tenis ? ["E", "I"] : ["Z", "X"];
      if (ap || nivel >= 1) erradas = erradas.slice(0, 1);
      return {
        tipo: "letra",
        categoria: tenis ? "ACENTUAÇÃO" : "PLURAL",
        titulo: "COMPLETE A PALAVRA",
        instrucao: tenis
          ? "A pegada é de um calçado de borracha. Que letra completa o nome dele?"
          : "São pegadas dos <em>dois pés</em>: mais de uma bota! Que letra forma o <em>plural</em>?",
        leitura: tenis
          ? "A pegada é de um tênis. Que letra completa a palavra tênis?"
          : "São pegadas dos dois pés, mais de uma bota. Que letra forma o plural, botas?",
        molde,
        opcoes: embaralhar([certa].concat(erradas), rnd),
        certa,
        palavra: tenis ? "TÊNIS" : "BOTAS",
        dicas: [
          tenis
            ? "Tênis tem um <em>chapeuzinho</em> em cima do E: é o acento circunflexo (^)."
            : "Para formar o plural, quase sempre colocamos <em>S</em> no final: casa → casas.",
          "Tirei uma letra errada. Agora ficou mais fácil!",
          "A letra certa está brilhando. Toque nela!",
        ],
        licao: tenis ? "TÊNIS tem acento circunflexo: ê." : "O plural de BOTA é BOTAS: com S no final.",
      };
    }

    // rua — caça ao erro
    const comOculos = valor === "sim";
    const frases = {
      aprendiz: { sim: ["A", "Sombra", "usava", "óculos."], nao: ["A", "Sombra", "não", "usava", "óculos."] },
      investigador: { sim: ["A", "Sombra", "usava", "óculos", "redondos."], nao: ["A", "Sombra", "não", "usava", "óculos,", "só", "uma", "máscara."] },
    };
    const base = frases[ap ? "aprendiz" : "investigador"][comOculos ? "sim" : "nao"];
    const regras = [];
    base.forEach((p, i) => {
      if (p === "Sombra") regras.push({ i, errada: "Sonbra", certa: "Sombra", regra: "Antes de <em>B</em> e <em>P</em>, usamos <em>M</em>, não N: Sombra, campo, bombom.", licao: "Antes de B e P, usamos M: Sombra." });
      if (p === "usava") regras.push({ i, errada: "uzava", certa: "usava", regra: "O verbo é <em>USAR</em>, com S. Então: usava, usou, usamos.", licao: "USAR se escreve com S: usava." });
      if (p.indexOf("óculos") === 0) regras.push({ i, errada: p.replace("ó", "o"), certa: "óculos", regra: "Uma palavra perdeu o <em>acento agudo</em> (´). Óculos tem acento no O!", licao: "ÓCULOS tem acento agudo: ó." });
      if (p === "não") regras.push({ i, errada: "nao", certa: "não", regra: "Uma palavra perdeu o <em>til</em> (~)... Ei, sou eu! O til faz o som de ÃO.", licao: "NÃO tem til: ã." });
    });
    const e = regras[Math.floor(rnd() * regras.length)];
    const palavras = base.map((p, i) => (i === e.i ? { texto: e.errada, certa: e.certa, erro: true } : { texto: p, erro: false }));
    return {
      tipo: "erro",
      categoria: "ORTOGRAFIA",
      titulo: "CAÇA AO ERRO",
      instrucao: nivel >= 1
        ? "Uma palavra do depoimento está escrita errado. " + limpar(e.regra) + " Toque nela!"
        : "O policial escreveu <em>uma palavra errada</em> no depoimento do Seu Tonho. Toque nela!",
      leitura: "O policial escreveu uma palavra errada no depoimento. Leia com atenção e toque na palavra errada.",
      palavras,
      dicas: [e.regra, "Sobraram só duas palavras. Uma delas está errada!", "É esta palavra brilhando! Toque nela."],
      licao: e.licao,
      errada: e.errada,
      ehTil: e.errada === "nao",
    };
  }

  // ---------------------------------------------------------------------------
  // FALAS
  // ---------------------------------------------------------------------------
  const FALAS = {
    escolha: "Oi! Eu sou o <em>Til</em>, seu parceiro farejador. Escolha o seu detetive e o seu nível!",
    briefing: [
      "A misteriosa <em>SOMBRA</em> roubou o Rubi Nacional! Estes são os <em>5 suspeitos</em>.",
      "Cada desafio de português dá uma <em>pista</em>. A cada pista, a gente <em>risca</em> quem não combina!",
    ],
    mapa: [
      "Toque num lugar brilhante para investigar!",
      "Ótimo! Faltam <em>3 pistas</em>. Escolha outro lugar.",
      "Metade do caso resolvido! Faltam <em>2 pistas</em>.",
      "Só falta <em>1 pista</em>. Estamos quase lá!",
    ],
    acertos: ["Isso! Mandou bem!", "Au au! Acertou!", "Perfeito, detetive!", "Muito bem! Que faro!"],
    ocioso: "Quer uma ajudinha? Toque em <em>DICA</em>!",
    monitorErrado: (nome) => `Esse é o monitor da câmera <em>${nome}</em>. Procure a do <em>TELHADO</em>!`,
    muralOk: ["Isso! Riscado!", "Boa! Menos um!", "Isso mesmo!", "Muito bem!"],
    muralFim: "Pronto! Toque em <em>CONTINUAR</em>.",
    muralNada: "Essa pista combina com quem sobrou. <em>Confirmado!</em> Toque em CONTINUAR.",
    muralAjuda: "Olhe as <em>etiquetas</em> embaixo das fotos e compare com a pista!",
    muralSobrouUm: "Só sobrou <em>uma pessoa</em> no mural! Mas a polícia precisa das <em>4 provas</em>. Vamos continuar!",
    muralVer: "Toque numa foto para ouvir o que cada suspeito disse.",
    todasPistas: "Temos as <em>4 provas</em>, e só sobrou uma pessoa no mural. Hora de pegar a Sombra!",
    confronto: "Aponte a Sombra! Toque em <em>quem sobrou</em> no mural.",
    descartado: (s) => `${s.artigo === "a" ? "A" : "O"} ${s.nome} já foi ${s.genero === "f" ? "descartada" : "descartado"} pelas pistas. Procure quem sobrou!`,
    til: "Faltou eu: o <em>til</em>! O certo é NÃO.",
    assinatura: "Caso resolvido! Assine o relatório com o <em>seu nome</em>, detetive.",
  };

  function ranking(pontos) {
    if (pontos <= 1) return { titulo: "DETETIVE LENDÁRIO", estrelas: 3, frase: "Nem a Sombra escapou do seu faro!" };
    if (pontos <= 4) return { titulo: "DETETIVE EXPERIENTE", estrelas: 2, frase: "Investigação caprichada do começo ao fim." };
    return { titulo: "DETETIVE PERSISTENTE", estrelas: 1, frase: "Você não desistiu e resolveu o caso!" };
  }

  const CREDITOS = [
    ["Jogo", "O Roubo Perfeito — jogo de investigação para a feira de Português."],
    ["Música", "“Prologue” de Hyperreal — licença CC BY (Jamendo, jamendo.com/track/1076983)."],
    ["Efeitos (CC BY)", "Vidro quebrando: TheSoundcatcher (CC BY 3.0) · Helicóptero: smnotasmr (CC BY 3.0) · Corda: Benboncan (CC BY 4.0) — freesound.org."],
    ["Efeitos (CC0)", "Alarme: syntheffects · Sirenes: MultiMax2121 e guitarguy1985 · Noite: seth-m — freesound.org."],
    ["Outros sons", "Whooshes, brilho e impacto: biblioteca do HyperFrames. Vozes, vento, botões e efeitos: sintetizados no jogo."],
    ["Fontes", "League Gothic, Oswald e EB Garamond — SIL Open Font License."],
    ["Animação", "GSAP (GreenSock) · vídeo feito com HyperFrames."],
  ];

  return {
    SUSPEITOS, TONHO, AVATARES, MODOS, ATRIBUTOS, PISTA, LOCAIS, ORDEM_LOCAIS, CAMERAS,
    ficha, etiqueta, combina, porqueCombina, desafio, embaralhar, FALAS, ranking, CREDITOS,
  };
})();
