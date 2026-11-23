# O Roubo Perfeito

Jogo de investigação em 2D para a **feira de Português**. O Rubi Nacional sumiu do Museu Nacional de Arte, e o jogador é o detetive que vai descobrir quem é a Sombra. Cada pista sai de um desafio de língua portuguesa: plural e acento, frase com maiúscula e ponto, sinônimos e antônimos, ortografia. Uma partida leva de 2 a 3 minutos.

Feito em HTML5, JavaScript e SVG, sem servidor: os cenários e personagens são desenhados em código, e o vídeo de abertura, os sons e o desenho do museu ficam em `assets/`.

> **Versão final de lançamento: v2.0.1.** O `index.html` da raiz é o jogo lançado. As versões anteriores continuam disponíveis em [`versoes/`](versoes/).

**▶ Jogue no navegador:** https://oscuecas984.github.io/o-roubo-perfeito/ (GitHub Pages)  
Versões anteriores online: `https://oscuecas984.github.io/o-roubo-perfeito/versoes/vX.Y.Z/`

Versão final: **v2.0.1** (lançamento) · veja o [CHANGELOG](CHANGELOG.md) e as [versões anteriores](versoes/).

---

## Como jogar

Abra `index.html` no Google Chrome ou no Microsoft Edge, os navegadores usados na feira. O jogo funciona offline.

O primeiro toque ("TOQUE PARA COMEÇAR") é necessário, porque os navegadores só deixam o vídeo tocar com som depois de um clique. Se o vídeo não começar em 8 segundos, o jogo vai direto para o título.

### Controles

| Tecla | Ação |
|---|---|
| Clique ou toque | Jogar (tudo funciona com o mouse ou o dedo) |
| `Enter` ou `Espaço` | Avançar a fala do Til · pular o vídeo de abertura |
| `1` `2` `3` | Escolher a resposta de um desafio |
| `Esc` | Pular o vídeo · fechar uma janela |
| Letras, `Backspace`, `Enter` | Escrever e assinar o nome no relatório |
| `F11` ou botão no canto | Tela cheia |

### A jornada

1. Vídeo de abertura (19 s), depois o botão **INICIAR**.
2. Escolha de um dos 4 detetives e do nível: **APRENDIZ** (menos opções, desafio com imagem, falas lidas em voz alta) ou **INVESTIGADOR** (3 opções, sinônimos e antônimos, uma palavra a mais na frase).
3. O cachorro **Til** apresenta o caso e o mural com os 5 suspeitos.
4. No mapa do museu, cada lugar tem uma prova para achar e um desafio que libera uma pista:

| Lugar | Procurar a prova | Desafio de português | Pista |
|---|---|---|---|
| Telhado | Lanterna: achar as pegadas | Complete a palavra: plural (BOTA**S**) ou acento (T**Ê**NIS) | Calçado |
| Sala de Segurança | Achar o monitor da câmera do TELHADO | Monte a frase: maiúscula, ponto final e concordância | Altura |
| Sala do Rubi | Lanterna: achar o fio de cabelo | Comprido ou curto? Sinônimos e antônimos | Cabelo |
| Rua do Museu | Conversar com o Seu Tonho, a testemunha | Caça ao erro de ortografia | Óculos |

5. Cada pista risca os suspeitos que não combinam com ela. Com as 4 pistas, sobra uma pessoa, e o jogador a acusa no confronto.
6. A Sombra confessa, e o jogador assina o relatório, que sai na capa da *Gazeta do Museu* com o selo de 1 a 3 estrelas.

A pessoa culpada muda a cada partida e nunca repete a anterior. Não há game over: errar mostra a regra, e a ajuda aparece aos poucos. Erros e dicas só mudam as estrelas.

---

## Estrutura do repositório

```
index.html        o jogo lançado, v2.0.1
css/ js/          visual e código do jogo (dados.js, arte.js, som.js, fx.js, jogo.js)
assets/           vídeo de abertura, sons e desenho do museu (usados por todas as versões)
versoes/          cada versão publicada, jogável: versoes/vX.Y.Z/index.html
docs/             documento de game design, guia da feira e créditos
CHANGELOG.md      histórico de versões
```

Para mudar uma fala, um desafio ou um suspeito, edite `js/dados.js`. O guia para quem cuida do estande na feira está em [docs/leia-me-feira.md](docs/leia-me-feira.md).

### Detalhes técnicos

- Animações com GSAP (`js/vendor/gsap.min.js`); efeitos curtos de som sintetizados com a Web Audio API.
- Fontes embutidas em `css/fonts.css`, para funcionar sem internet.
- O ranking da feira (mural dos detetives), o número de casos resolvidos e a última pessoa culpada ficam salvos no navegador (`localStorage`).
- O repositório tem um arquivo `.nojekyll`, que faz o GitHub Pages publicar os arquivos sem processá-los.

---

## Créditos

- Música "Prologue", de Hyperreal (CC BY); efeitos sonoros do Freesound (CC BY 3.0, CC BY 4.0 e CC0); fontes League Gothic, Oswald e EB Garamond (SIL OFL 1.1); GSAP (licença "Standard No Charge").
- Lista completa em [docs/creditos.md](docs/creditos.md). Os créditos também aparecem dentro do jogo (botão **CRÉDITOS**) e precisam continuar lá.

## Licença

Todos os direitos reservados até a equipe decidir a licença da versão pública. Músicas, efeitos sonoros e fontes de terceiros seguem as licenças listadas em [docs/creditos.md](docs/creditos.md).
