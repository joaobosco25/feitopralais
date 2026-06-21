const dadosDoSite = {
  nome: "Lais",
  textoDeAbertura:
    "Para uma garota que, de algum jeito estranho, deixa meus dias muito mais interessantes.",
  elogios: [
    "Você fica bonita até quando diz que não está.",
    "Seu sorriso deveria ser considerado patrimônio.",
    "Você tem um talento estranho para ocupar meus pensamentos.",
    "Você deixa qualquer lugar mais bonito só por chegar.",
    "Seu jeito é perigosamente fácil de gostar.",
    "Você combina muito com os meus melhores pensamentos.",
    "Sinceramente? Você é uma das partes mais bonitas dos meus dias.",
    "Até suas manias conseguem ser interessantes.",
    "Você tem um brilho que foto nenhuma consegue explicar direito.",
    "Eu provavelmente estou sorrindo enquanto você lê isso."
  ]
};

const $ = (seletor, contexto = document) => contexto.querySelector(seletor);
const $$ = (seletor, contexto = document) => [
  ...contexto.querySelectorAll(seletor)
];

const aleatorioEntre = (minimo, maximo) =>
  Math.random() * (maximo - minimo) + minimo;

function mostrarAviso(mensagem) {
  const aviso = $("#toast");

  aviso.textContent = mensagem;
  aviso.classList.add("show");

  clearTimeout(mostrarAviso.tempo);
  mostrarAviso.tempo = setTimeout(() => {
    aviso.classList.remove("show");
  }, 2600);
}

function soltarConfetes(quantidade = 90) {
  const camada = $("#confetti-layer");
  const cores = [
    "#ff76b8",
    "#ffd884",
    "#a873ff",
    "#6fa8ff",
    "#86f2bd",
    "#fff"
  ];

  for (let i = 0; i < quantidade; i += 1) {
    const pedaco = document.createElement("span");

    pedaco.className = "confetti-piece";
    pedaco.style.left = `${Math.random() * 100}%`;
    pedaco.style.background = cores[Math.floor(Math.random() * cores.length)];
    pedaco.style.setProperty("--time", `${aleatorioEntre(2.2, 4.4)}s`);
    pedaco.style.setProperty("--drift", `${aleatorioEntre(-180, 180)}px`);

    camada.appendChild(pedaco);
    setTimeout(() => pedaco.remove(), 4800);
  }
}

function criarCoracaoFlutuante() {
  const paginaBloqueada = document.body.classList.contains("locked");

  if (document.hidden || paginaBloqueada) {
    return;
  }

  const coracao = document.createElement("span");

  coracao.className = "floating-heart";
  coracao.textContent = Math.random() > 0.35 ? "♥" : "♡";
  coracao.style.left = `${Math.random() * 100}%`;
  coracao.style.fontSize = `${aleatorioEntre(12, 30)}px`;
  coracao.style.animationDuration = `${aleatorioEntre(5.5, 10)}s`;
  coracao.style.opacity = aleatorioEntre(0.25, 0.75);

  $("#floating-hearts").appendChild(coracao);
  setTimeout(() => coracao.remove(), 10500);
}


// Entrada

const telaDeEntrada = $("#gate");
const conteudo = $("#main");
const botaoEntrar = $("#enter-btn");
const botaoFugitivo = $("#runaway-btn");

function moverBotaoFugitivo() {
  const cartao = $(".gate-card");
  const areaCartao = cartao.getBoundingClientRect();
  const areaBotao = botaoFugitivo.getBoundingClientRect();

  const limiteHorizontal = areaCartao.width - areaBotao.width - 40;
  const posicaoX = aleatorioEntre(
    -limiteHorizontal / 2,
    limiteHorizontal / 2
  );
  const posicaoY = aleatorioEntre(-70, 70);
  const inclinacao = aleatorioEntre(-5, 5);

  botaoFugitivo.style.transform =
    `translate(${posicaoX}px, ${posicaoY}px) rotate(${inclinacao}deg)`;
}

["mouseenter", "pointerdown", "focus"].forEach((evento) => {
  botaoFugitivo.addEventListener(evento, (event) => {
    if (evento === "pointerdown") {
      event.preventDefault();
    }

    moverBotaoFugitivo();
  });
});

let textoJaFoiDigitado = false;

function digitarTextoDeAbertura() {
  if (textoJaFoiDigitado) {
    return;
  }

  textoJaFoiDigitado = true;

  const destino = $("#typed");
  const texto = dadosDoSite.textoDeAbertura;
  let posicao = 0;

  const digitacao = setInterval(() => {
    destino.textContent += texto[posicao] || "";
    posicao += 1;

    if (posicao >= texto.length) {
      clearInterval(digitacao);
    }
  }, 42);
}

botaoEntrar.addEventListener("click", () => {
  telaDeEntrada.classList.add("hidden");
  conteudo.setAttribute("aria-hidden", "false");
  document.body.classList.remove("locked");

  soltarConfetes(65);
  mostrarAviso(`Bem-vinda, ${dadosDoSite.nome} ✨`);

  setTimeout(() => {
    telaDeEntrada.remove();
    digitarTextoDeAbertura();
  }, 850);
});


// Animações durante a rolagem

const observador = new IntersectionObserver(
  (elementos) => {
    elementos.forEach((elemento) => {
      if (!elemento.isIntersecting) {
        return;
      }

      elemento.target.classList.add("visible");
      observador.unobserve(elemento.target);
    });
  },
  { threshold: 0.14 }
);

$$(".reveal").forEach((elemento, indice) => {
  elemento.style.transitionDelay = `${Math.min(indice % 6, 5) * 70}ms`;
  observador.observe(elemento);
});

const brilhoDoCursor = $(".cursor-glow");

window.addEventListener("pointermove", (event) => {
  if (event.pointerType === "touch") {
    return;
  }

  brilhoDoCursor.style.left = `${event.clientX}px`;
  brilhoDoCursor.style.top = `${event.clientY}px`;
  brilhoDoCursor.style.opacity = 1;
});

window.addEventListener("pointerleave", () => {
  brilhoDoCursor.style.opacity = 0;
});


// Cartas

$$(".reason").forEach((carta) => {
  carta.addEventListener("click", () => {
    carta.classList.toggle("flipped");
  });
});


// Elogios

let ultimoElogio = -1;
let totalDeElogios = 0;

$("#compliment-btn").addEventListener("click", () => {
  let proximoElogio;

  do {
    proximoElogio = Math.floor(Math.random() * dadosDoSite.elogios.length);
  } while (
    proximoElogio === ultimoElogio &&
    dadosDoSite.elogios.length > 1
  );

  ultimoElogio = proximoElogio;
  totalDeElogios += 1;

  const textoDoElogio = $("#compliment-output");
  const botao = $("#compliment-btn");

  textoDoElogio.classList.remove("pop");
  void textoDoElogio.offsetWidth;
  textoDoElogio.textContent = dadosDoSite.elogios[proximoElogio];
  textoDoElogio.classList.add("pop");

  $("#compliment-count").textContent = totalDeElogios;

  if (totalDeElogios === 4) {
    botao.textContent = "Você ainda quer mais?";
  }

  if (totalDeElogios === 7) {
    botao.textContent = "Gananciosa 😌";
  }

  if (totalDeElogios >= 10) {
    botao.textContent = "Tá bom, mais um";
  }
});


// Jogo dos corações

const tabuleiro = $("#game-board");
const botaoDoJogo = $("#start-game");
const placar = $("#score");
const relogio = $("#time-left");
const mensagemInicialDoJogo = $("#game-placeholder");
const resultadoDoJogo = $("#game-result");

let cronometroDoJogo;
let criadorDeCoracoes;
let pontos = 0;
let tempoRestante = 15;
let jogoEmAndamento = false;

function limparCoracoesDoJogo() {
  $$(".game-heart", tabuleiro).forEach((coracao) => {
    coracao.remove();
  });
}

function criarCoracaoDoJogo() {
  if (!jogoEmAndamento) {
    return;
  }

  const coracao = document.createElement("button");
  const area = tabuleiro.getBoundingClientRect();
  const tamanho = area.width < 500 ? 48 : 54;

  coracao.className = "game-heart";
  coracao.type = "button";
  coracao.textContent = "♥";
  coracao.setAttribute("aria-label", "Capturar coração");
  coracao.style.left =
    `${aleatorioEntre(4, Math.max(4, area.width - tamanho - 8))}px`;
  coracao.style.top =
    `${aleatorioEntre(4, Math.max(4, area.height - tamanho - 8))}px`;

  const tempoParaSumir = setTimeout(() => {
    coracao.remove();
  }, aleatorioEntre(1050, 1600));

  coracao.addEventListener("click", () => {
    if (!jogoEmAndamento) {
      return;
    }

    clearTimeout(tempoParaSumir);

    pontos += 1;
    placar.textContent = pontos;

    coracao.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(1.8)", opacity: 0 }
      ],
      {
        duration: 220,
        easing: "ease-out"
      }
    );

    setTimeout(() => coracao.remove(), 190);
  });

  tabuleiro.appendChild(coracao);
}

function encerrarJogo() {
  jogoEmAndamento = false;

  clearInterval(cronometroDoJogo);
  clearInterval(criadorDeCoracoes);
  limparCoracoesDoJogo();

  botaoDoJogo.disabled = false;
  botaoDoJogo.textContent = "Jogar novamente";

  let mensagem;

  if (pontos <= 5) {
    mensagem = `Você fez ${pontos} pontos. Quase não gosta de mim, né? 😅`;
  } else if (pontos <= 12) {
    mensagem = `Você fez ${pontos} pontos. Nada mal… gostei do esforço.`;
  } else {
    mensagem =
      `Você fez ${pontos} pontos. Prêmio desbloqueado: vale um beijo.`;
    soltarConfetes(100);
  }

  resultadoDoJogo.textContent = mensagem;
}

function iniciarJogo() {
  if (jogoEmAndamento) {
    return;
  }

  jogoEmAndamento = true;
  pontos = 0;
  tempoRestante = 15;

  placar.textContent = 0;
  relogio.textContent = 15;
  resultadoDoJogo.textContent = "";
  mensagemInicialDoJogo.style.display = "none";

  limparCoracoesDoJogo();

  botaoDoJogo.disabled = true;
  botaoDoJogo.textContent = "Valendo!";

  criarCoracaoDoJogo();

  criadorDeCoracoes = setInterval(criarCoracaoDoJogo, 580);
  cronometroDoJogo = setInterval(() => {
    tempoRestante -= 1;
    relogio.textContent = tempoRestante;

    if (tempoRestante <= 0) {
      encerrarJogo();
    }
  }, 1000);
}

botaoDoJogo.addEventListener("click", iniciarJogo);


// Raspadinha

const telaDaRaspadinha = $("#scratch-canvas");
const cartaoDaRaspadinha = $(".scratch-card");
const pincel = telaDaRaspadinha.getContext("2d", {
  willReadFrequently: true
});

let estaRaspando = false;
let premioRevelado = false;

function desenharCobertura(largura, altura) {
  premioRevelado = false;
  pincel.globalCompositeOperation = "source-over";

  const fundo = pincel.createLinearGradient(0, 0, largura, altura);

  fundo.addColorStop(0, "#b4a8bb");
  fundo.addColorStop(0.45, "#6f6377");
  fundo.addColorStop(1, "#b7a9bc");

  pincel.fillStyle = fundo;
  pincel.fillRect(0, 0, largura, altura);

  pincel.fillStyle = "rgba(255, 255, 255, .22)";

  for (let x = -altura; x < largura + altura; x += 34) {
    pincel.fillRect(x, 0, 12, altura * 2);
  }

  pincel.fillStyle = "#211627";
  pincel.textAlign = "center";
  pincel.textBaseline = "middle";
  pincel.font = "900 26px system-ui";
  pincel.fillText("RASPE AQUI ✨", largura / 2, altura / 2 - 8);

  pincel.font = "600 14px system-ui";
  pincel.fillText(
    "use o mouse ou o dedo",
    largura / 2,
    altura / 2 + 28
  );
}

function ajustarTamanhoDaRaspadinha() {
  const area = cartaoDaRaspadinha.getBoundingClientRect();
  const escala = Math.max(1, window.devicePixelRatio || 1);

  telaDaRaspadinha.width = Math.floor(area.width * escala);
  telaDaRaspadinha.height = Math.floor(area.height * escala);

  pincel.setTransform(escala, 0, 0, escala, 0, 0);
  desenharCobertura(area.width, area.height);
}

function pegarPosicaoNaRaspadinha(event) {
  const area = telaDaRaspadinha.getBoundingClientRect();

  return {
    x: event.clientX - area.left,
    y: event.clientY - area.top
  };
}

function raspar(event) {
  if (!estaRaspando || premioRevelado) {
    return;
  }

  event.preventDefault();

  const posicao = pegarPosicaoNaRaspadinha(event);
  const largura = telaDaRaspadinha.getBoundingClientRect().width;

  pincel.globalCompositeOperation = "destination-out";
  pincel.beginPath();
  pincel.arc(
    posicao.x,
    posicao.y,
    largura < 500 ? 26 : 34,
    0,
    Math.PI * 2
  );
  pincel.fill();

  if (Math.random() > 0.86) {
    verificarAreaRaspada();
  }
}

function verificarAreaRaspada() {
  if (premioRevelado) {
    return;
  }

  const pixels = pincel.getImageData(
    0,
    0,
    telaDaRaspadinha.width,
    telaDaRaspadinha.height
  ).data;

  let pixelsTransparentes = 0;
  let amostras = 0;

  for (let i = 3; i < pixels.length; i += 96) {
    amostras += 1;

    if (pixels[i] < 40) {
      pixelsTransparentes += 1;
    }
  }

  if (pixelsTransparentes / amostras <= 0.42) {
    return;
  }

  premioRevelado = true;
  telaDaRaspadinha.style.transition = "opacity .65s ease";
  telaDaRaspadinha.style.opacity = 0;

  soltarConfetes(80);
  mostrarAviso("Surpresa desbloqueada 💗");
}

telaDaRaspadinha.addEventListener("pointerdown", (event) => {
  estaRaspando = true;
  telaDaRaspadinha.setPointerCapture?.(event.pointerId);
  raspar(event);
});

telaDaRaspadinha.addEventListener("pointermove", raspar);

["pointerup", "pointercancel", "pointerleave"].forEach((evento) => {
  telaDaRaspadinha.addEventListener(evento, () => {
    estaRaspando = false;
    verificarAreaRaspada();
  });
});

$("#reset-scratch").addEventListener("click", () => {
  telaDaRaspadinha.style.transition = "none";
  telaDaRaspadinha.style.opacity = 1;
  ajustarTamanhoDaRaspadinha();
});

window.addEventListener("resize", () => {
  clearTimeout(ajustarTamanhoDaRaspadinha.tempo);
  ajustarTamanhoDaRaspadinha.tempo = setTimeout(
    ajustarTamanhoDaRaspadinha,
    180
  );
});


// Botão proibido

const botaoProibido = $("#forbidden-btn");
const mensagemDoBotaoProibido = $("#forbidden-message");

const etapasDoBotaoProibido = [
  ["TÕ!", "Você ta certa disso mesmo?."],
  ["TENHO KRAI!", "Acho que você ja sabe onde vai dar. Tem certeza?"],
  ["JÁ FALEI QUE SIM, VOU TE PEGAR SEU GAY!", "Olha só, você nao vai poder se distanciar de mim depois. Eu to avisando."],
  ["DESCOBRIR", "Bom, está avisada. Essa é a ultima chance de passar direto Lais, serio msm."]
];

let etapaAtual = 0;

botaoProibido.addEventListener("click", () => {
  if (etapaAtual < etapasDoBotaoProibido.length) {
    botaoProibido.textContent = etapasDoBotaoProibido[etapaAtual][0];
    mensagemDoBotaoProibido.textContent =
      etapasDoBotaoProibido[etapaAtual][1];

    etapaAtual += 1;
    return;
  }

  botaoProibido.textContent = "VOCÊ É FODA!!!";
  botaoProibido.classList.add("safe");
  mensagemDoBotaoProibido.textContent =
    "Você é oficialmente a pessoa mais bonita que já entrou neste site.";

  soltarConfetes(140);
  mostrarAviso("Eu avisei que tinham informações demais.");
});


// Jardim

const jardim = $("#garden");
const tiposDeFlor = ["🌷", "🌸", "🌼", "🌺", "💐", "🪻", "🌻"];

let floresPlantadas = 0;

jardim.addEventListener("pointerdown", (event) => {
  const area = jardim.getBoundingClientRect();
  const x = event.clientX - area.left;
  const y = event.clientY - area.top;

  if (y < area.height * 0.35) {
    mostrarAviso("As flores gostam mais de ficar pertinho do chão 🌱");
    return;
  }

  const flor = document.createElement("div");
  const tipo = tiposDeFlor[Math.floor(Math.random() * tiposDeFlor.length)];

  flor.className = "flower";
  flor.style.left = `${x}px`;
  flor.style.top = `${y}px`;
  flor.style.setProperty("--stem", `${aleatorioEntre(50, 120)}px`);
  flor.style.setProperty("--size", `${aleatorioEntre(26, 48)}px`);
  flor.innerHTML = `
    <div class="stem"></div>
    <div class="head">${tipo}</div>
  `;

  jardim.appendChild(flor);
  floresPlantadas += 1;

  if (floresPlantadas === 1) {
    $(".garden-tip").textContent = "Ficou mais bonito 🌷";
  }

  if (floresPlantadas === 8) {
    mostrarAviso("Você está criando um jardim inteiro.");
  }

  if (floresPlantadas === 16) {
    mostrarAviso("Igual você: deixando tudo mais bonito.");
  }
});


// Final

$$(".final-answer").forEach((botao) => {
  botao.addEventListener("click", () => {
    $("#final-response").textContent =
      "Então valeu cada linha de código. Agora vem me contar pessoalmente. ♡";

    soltarConfetes(160);
    mostrarAviso("Missão cumprida ✨");
  });
});


// Musiquinha

const botaoDaMusica = $("#music-btn");
const textoDoBotaoDaMusica = $("#music-label");
const iconeDaMusica = $("#music-icon");

const melodia = [
  261.63,
  329.63,
  392,
  523.25,
  392,
  329.63,
  293.66,
  349.23,
  440,
  587.33,
  440,
  349.23
];

let contextoDeAudio;
let repeticaoDaMusica;
let musicaTocando = false;
let notaAtual = 0;

function tocarNota(frequencia) {
  if (!contextoDeAudio) {
    return;
  }

  const oscilador = contextoDeAudio.createOscillator();
  const volume = contextoDeAudio.createGain();

  oscilador.type = "sine";
  oscilador.frequency.value = frequencia;

  volume.gain.setValueAtTime(0.0001, contextoDeAudio.currentTime);
  volume.gain.exponentialRampToValueAtTime(
    0.07,
    contextoDeAudio.currentTime + 0.02
  );
  volume.gain.exponentialRampToValueAtTime(
    0.0001,
    contextoDeAudio.currentTime + 0.55
  );

  oscilador.connect(volume);
  volume.connect(contextoDeAudio.destination);

  oscilador.start();
  oscilador.stop(contextoDeAudio.currentTime + 0.58);
}

botaoDaMusica.addEventListener("click", async () => {
  if (!contextoDeAudio) {
    const AudioDoNavegador =
      window.AudioContext || window.webkitAudioContext;

    contextoDeAudio = new AudioDoNavegador();
  }

  if (contextoDeAudio.state === "suspended") {
    await contextoDeAudio.resume();
  }

  musicaTocando = !musicaTocando;

  if (musicaTocando) {
    textoDoBotaoDaMusica.textContent = "Pausar musiquinha";
    iconeDaMusica.textContent = "❚❚";

    tocarNota(melodia[notaAtual % melodia.length]);
    notaAtual += 1;

    repeticaoDaMusica = setInterval(() => {
      tocarNota(melodia[notaAtual % melodia.length]);
      notaAtual += 1;
    }, 430);

    return;
  }

  textoDoBotaoDaMusica.textContent = "Tocar musiquinha";
  iconeDaMusica.textContent = "♫";
  clearInterval(repeticaoDaMusica);
});


window.addEventListener("load", () => {
  ajustarTamanhoDaRaspadinha();
  setInterval(criarCoracaoFlutuante, 1350);
});
