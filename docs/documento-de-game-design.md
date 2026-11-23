# O Roubo Perfeito · Documento de Game Design

Documento do jogo na **v2.0.1** (versão final de lançamento). Atualizado em 23/11/2026.

## 1. Visão geral

O Roubo Perfeito é um jogo de investigação em 2D feito para a feira de Português. O Rubi Nacional sumiu do Museu Nacional de Arte, e o jogador é o detetive que descobre quem é a Sombra. Cada pista sai de um desafio de língua portuguesa bem fácil, e as pistas riscam os suspeitos até sobrar uma pessoa.

| Item | Descrição |
| --- | --- |
| Gênero | Investigação com desafios de português |
| Visão | 2D, com mapa do museu e cenas para cada lugar |
| Plataforma | Navegador (Chrome ou Edge), com mouse, toque ou teclado |
| Tecnologia | HTML5, JavaScript e SVG, com GSAP para as animações; vídeo, sons e o desenho do museu em `assets/` |
| Duração | De 2 a 3 minutos por partida, mais 19 s de vídeo de abertura |
| Público | Visitantes da feira de Português, de quem está começando a ler a quem já lê bem |
| Idioma | Português (Brasil) |

### Pilares

- **O português libera a pista:** cada prova encontrada só vira pista depois de um desafio de língua portuguesa.
- **Mistério justo:** as 4 pistas sempre deixam uma pessoa só no mural.
- **Ninguém fica para trás:** não há game over. A ajuda aumenta aos poucos, e erros e dicas só mudam as estrelas.
- **Feito para a fila da feira:** a pessoa culpada muda a cada partida, e o jogo volta sozinho ao começo quando fica parado.

## 2. Premissa e narrativa

À noite, uma figura mascarada, a Sombra, entra pelo telhado do Museu Nacional de Arte e leva o Rubi Nacional. O cachorro **Til** (o nome vem do sinal ~) chama o detetive e apresenta o mural do caso: a foto da Sombra, os 5 suspeitos e 4 pistas para descobrir. No fim, a Sombra é revelada, confessa e devolve o rubi.

## 3. Loop de jogo

1. Vídeo de abertura (pode ser pulado) e tela de título.
2. Escolha do detetive e do nível.
3. No mapa, escolher um dos 4 lugares.
4. Procurar a prova no lugar.
5. Resolver o desafio de português e ganhar a pista.
6. No mural, riscar os suspeitos que não combinam com a pista.
7. Repetir até ter as 4 pistas; acusar a pessoa que sobrou no confronto.
8. Assinar o relatório e ver a capa da *Gazeta do Museu*.

## 4. Controles

| Entrada | Ação |
| --- | --- |
| Clique ou toque | Toda a interação do jogo |
| `Enter` ou `Espaço` | Avançar a fala do Til · pular o vídeo |
| `1` `2` `3` | Escolher a resposta de um desafio |
| `Esc` | Pular o vídeo · fechar uma janela |
| Letras, `Backspace`, `Enter` | Escrever e assinar o nome (também há um teclado na tela) |

## 5. Lugares, provas e desafios

| Lugar | Procurar a prova | Desafio de português | Pista |
| --- | --- | --- | --- |
| Telhado | Passar a lanterna e achar as pegadas | Complete a palavra: plural (BOTA**S**) ou acento (T**Ê**NIS) | Calçado: tênis ou botas |
| Sala de Segurança | Achar o monitor da câmera do TELHADO | Monte a frase: maiúscula, ponto final e concordância | Altura: alta ou baixa |
| Sala do Rubi | Passar a lanterna e achar o fio de cabelo | Comprido ou curto? Sinônimos e antônimos | Cabelo: comprido ou curto |
| Rua do Museu | Conversar com o Seu Tonho, a testemunha | Caça ao erro de ortografia | Óculos: usa ou não usa |

Os lugares podem ser visitados em qualquer ordem.

## 6. Suspeitos

| Suspeito | Profissão | Altura | Cabelo | Calçado | Óculos |
| --- | --- | --- | --- | --- | --- |
| Bento | Vigia noturno | Alto (1,86 m) | Curto | Botas | Não |
| Helena | Curadora do museu | Baixa (1,56 m) | Comprido | Botas | Sim |
| Rafa | Restaurador de quadros | Alto (1,84 m) | Comprido | Tênis | Sim |
| Lia | Limpadora de vidros | Baixa (1,52 m) | Curto | Tênis | Não |
| Otávio | Colecionador de joias | Baixo (1,58 m) | Curto | Botas | Sim |

A Sombra é sorteada entre os 5 a cada partida e nunca repete a pessoa da partida anterior. As 4 pistas mostram as características da Sombra sorteada.

## 7. Níveis e ajuda

| Nível | Para quem | Diferenças |
| --- | --- | --- |
| Aprendiz | Quem está começando a ler | Menos opções, desafio com imagem, falas lidas em voz alta (se o computador tiver voz em português) |
| Investigador | Quem já lê bem | 3 opções, sinônimos e antônimos, uma palavra a mais na frase para pegar o erro de concordância |

- **Desafios:** no primeiro erro, o Til explica a regra; no segundo, some uma opção errada (ou uma palavra da frase se encaixa sozinha); no terceiro, a resposta certa brilha. **DICA** e **OUVIR** estão sempre disponíveis. O Til oferece ajuda aos 15 s e dá uma dica sozinho aos 28 s. Quem teve dificuldade recebe o próximo desafio mais fácil.
- **Busca:** se a prova não aparece, o Til dá uma dica e depois mostra onde ela está; aos 20 s, ele acha sozinho.
- **Mural:** tocar num suspeito que combina com a pista explica o porquê. Aos 8 s as fotos certas piscam; aos 18 s o Til risca uma sozinho.
- **Confronto:** tocar em alguém já descartado não conta; o Til lembra de procurar quem sobrou.

## 8. Pontuação e final

O relatório final mostra a ficha da Sombra, o que o jogador praticou e um selo de detetive de 1 a 3 estrelas, que depende dos erros e das dicas usadas. O nome assinado vai para o **mural dos detetives**, o ranking da feira, com detetive escolhido, nível, estrelas e tempo.

## 9. Direção de arte

- Cenários, personagens, mural e jornal desenhados em código (`js/arte.js`); o museu da tela de título é o desenho `assets/img/museu.svg`.
- Vídeo de abertura de 19 s (`assets/video/cutscene.mp4`), feito com HyperFrames.
- Fontes League Gothic, Oswald e EB Garamond, embutidas no CSS.

## 10. Áudio

- Música "Prologue", de Hyperreal (CC BY).
- Efeitos gravados (vidro, helicóptero, corda, alarme, sirenes, noite) do Freesound, em CC BY e CC0.
- Sons de botão, acerto, erro e estática sintetizados com a Web Audio API.
- Um botão no canto superior direito liga e desliga todo o áudio.

## 11. Interface e feira

- Tela cheia pelo botão no canto superior direito ou `F11`.
- Ociosidade: depois de 100 s parado no jogo aparece "Ainda está aí?"; aos 2 min o jogo volta ao começo. O jornal volta sozinho depois de 90 s, e o título volta para "TOQUE PARA COMEÇAR" depois de 2 min.
- **ZERAR MURAL** (tocado duas vezes) limpa o ranking para um dia novo de feira.
- O botão **CRÉDITOS** lista música, efeitos e fontes, e precisa continuar no jogo.

## 12. Persistência

Ficam salvos no navegador (`localStorage`): o mural dos detetives, o número de casos resolvidos naquele computador e a última pessoa culpada (para não repetir).

## 13. Estrutura técnica

```
index.html        o jogo, v2.0.1
css/ js/          visual e código (dados.js, arte.js, som.js, fx.js, jogo.js)
assets/           vídeo, sons e desenho do museu (usados por todas as versões)
versoes/          cada versão publicada, jogável: versoes/vX.Y.Z/index.html
docs/             este documento, o guia da feira e os créditos
CHANGELOG.md      histórico de versões
```

Publicado no GitHub Pages em https://oscuecas984.github.io/o-roubo-perfeito/. O repositório tem um arquivo `.nojekyll`, que faz o Pages publicar os arquivos sem processá-los.

## 14. Histórico resumido

| Versão | Data | Destaque |
| --- | --- | --- |
| v2.0.0 | 23/11/2026 | Primeira versão publicada: 4 lugares, 4 desafios, 5 suspeitos, Gazeta do Museu |
| v2.0.1 | 23/11/2026 | Abertura que não trava e repositório padronizado (versão final) |

## 15. Pontos em aberto

- **Licença:** hoje são "todos os direitos reservados"; a equipe ainda precisa escolher a licença da versão pública. Os créditos de terceiros (CC BY) precisam continuar no jogo.
- **Versões anteriores:** o nome do jogo indica uma versão 1, mas só a 2.0 foi enviada para o repositório.
- **Autoria:** o repositório não registra quem fez a ideia, o roteiro e o código. Vale acrescentar nos Créditos do README.
