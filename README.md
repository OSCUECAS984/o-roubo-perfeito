# O Roubo Perfeito 2.0

Jogo de investigação em 2D para a feira de Português. O jogador é um detetive e precisa descobrir quem roubou o Rubi Nacional do Museu Nacional de Arte. Cada pista sai de um desafio de língua portuguesa. Uma partida leva cerca de 2 a 3 minutos.

Feito em HTML5, Canvas e JavaScript puro, sem frameworks. A arte é desenhada em código; o vídeo de abertura, os sons e as fontes ficam na pasta `assets/` e `css/`.

> **Versão final de lançamento: v2.0.0.** Veja o [CHANGELOG](CHANGELOG.md).

**▶ Jogue no navegador:** https://oscuecas984.github.io/o-roubo-perfeito/ (GitHub Pages)

---

## Como jogar

Abra `index.html` em um navegador moderno (Chrome, Edge, Firefox ou Safari). Funciona offline.

O primeiro toque ("TOQUE PARA COMEÇAR") é necessário, porque o navegador só libera o som depois de um clique. Para tela cheia, use o botão do canto superior direito ou F11. O botão de som liga e desliga todo o áudio.

### Fluxo

1. Vídeo de abertura (pode ser pulado), depois o botão **INICIAR**.
2. Escolha do detetive e do nível: **APRENDIZ** (menos opções, desafios com imagem e falas lidas em voz alta, se houver voz em português) ou **INVESTIGADOR** (3 opções, sinônimos, antônimos e erros de concordância).
3. O cachorro Til apresenta o caso e o mural com os suspeitos e as 4 pistas.
4. No mapa, cada lugar tem uma prova a procurar e um desafio de português:

| Lugar | Desafio | Pista |
| --- | --- | --- |
| Telhado | Completar a palavra (plural ou acento) | Calçado |
| Sala de Segurança | Montar a frase (maiúscula, ponto final, concordância) | Altura |
| Sala do Rubi | Comprido ou curto? Sinônimos e antônimos | Cabelo |
| Rua do Museu | Caça ao erro de ortografia | Óculos |

5. Cada pista risca os suspeitos que não combinam com ela. Com as 4 pistas, sobra uma pessoa, e o jogador a acusa.

A culpada muda a cada partida. Sem game over: errar mostra a regra, e a ajuda aparece aos poucos.

### Para quem cuida do estande

- O **mural dos detetives** guarda o ranking da feira só naquele computador. Para zerar, toque em **ZERAR MURAL** duas vezes.
- Ao ficar parado por 100 s durante o jogo, aparece "Ainda está aí?". Aos 2 min, o jogo volta ao começo.
- Detalhes de uso na feira estão em [docs/leia-me-feira.md](docs/leia-me-feira.md).

## Estrutura

- `index.html`: abre o jogo.
- `css/`: visual e fontes embutidas.
- `js/`: `dados.js` (textos, suspeitos, pistas e desafios), `arte.js` (desenhos), `som.js` (áudio), `fx.js` (efeitos visuais) e `jogo.js` (regras e telas).
- `assets/`: vídeo de abertura, sons e o desenho do museu.
- `docs/`: guia de uso na feira e créditos completos.

Para mudar uma fala, um desafio ou um suspeito, edite `js/dados.js`.

## Créditos

Música, efeitos sonoros e fontes têm licenças CC BY, CC0 e OFL. A lista completa está em [docs/creditos.md](docs/creditos.md) e também aparece dentro do jogo (botão CRÉDITOS).
