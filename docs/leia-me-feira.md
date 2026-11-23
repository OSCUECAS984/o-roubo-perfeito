# O Roubo Perfeito 2.0 — jogo para a feira de Português

Jogo de investigação em 2D. O jogador é um detetive e precisa descobrir quem roubou o Rubi Nacional do Museu Nacional de Arte. Cada pista sai de um desafio de português bem fácil. Uma partida leva cerca de 2 a 3 minutos. O vídeo de abertura tem 19 segundos e pode ser pulado.

## Como abrir na feira

1. Copie a pasta `jogo` inteira para o computador da feira. Um pendrive serve.
2. Dê dois cliques em `index.html` e abra no Google Chrome ou no Microsoft Edge.
3. Deixe em tela cheia pelo botão do canto superior direito, ou aperte F11.
4. Ligue o som. O jogo não precisa de internet.

O primeiro toque ("TOQUE PARA COMEÇAR") é necessário: o navegador só deixa o vídeo tocar com som depois de um clique.

## Como se joga

1. O vídeo de abertura passa. Depois aparece o botão **INICIAR**.
2. O jogador escolhe um dos 4 detetives e o nível:
   - **APRENDIZ**, para quem está começando a ler: menos opções, desafio com imagem e falas lidas em voz alta (se o computador tiver voz em português).
   - **INVESTIGADOR**, para quem já lê bem: 3 opções, sinônimos e antônimos, e uma palavra a mais para pegar no erro de concordância.
3. O cachorro **Til** (o nome vem do sinal ~) apresenta o caso e o **mural do caso**: a foto da Sombra, os 5 suspeitos e 4 pistas para descobrir.
4. No mapa do museu há 4 lugares. Em cada um o jogador primeiro **procura uma prova** e depois resolve um desafio que libera uma pista:

| Lugar | Procurar a prova | Desafio de português | Pista |
| --- | --- | --- | --- |
| Telhado | Passar a lanterna e achar as pegadas | Complete a palavra: plural (BOTA**S**) ou acento (T**Ê**NIS) | Calçado |
| Sala de Segurança | Achar o monitor da câmera do TELHADO | Monte a frase: maiúscula, ponto final e concordância | Altura |
| Sala do Rubi | Passar a lanterna e achar o fio de cabelo | Comprido ou curto? Sinônimos e antônimos | Cabelo |
| Rua do Museu | Conversar com o Seu Tonho, a testemunha | Caça ao erro de ortografia | Óculos |

5. Cada pista vai para o mural, e o jogador **risca os suspeitos que não combinam** com ela ("A Sombra usa BOTAS: risque quem usa TÊNIS!").
6. Com as 4 pistas, sobra uma pessoa só. No confronto, o jogador aponta **uma** pessoa e confirma a acusação.
7. A Sombra é revelada, confessa e devolve o rubi.
8. O jogador assina o relatório com o próprio nome. Ele sai na capa do jornal **Gazeta do Museu**, que mostra a ficha da Sombra, o que o jogador praticou e o selo de detetive (de 1 a 3 estrelas).

**A pessoa culpada muda a cada partida e nunca repete a anterior.** Assim, quem está na fila assistindo não fica sabendo a resposta.

## Sem game over: a ajuda se adapta

- **Errou um desafio?** O Til explica a regra. Errou de novo? Uma opção errada some (ou uma palavra da frase se encaixa sozinha). Na terceira vez, a resposta certa brilha.
- **DICA** está sempre disponível. **OUVIR** lê a pergunta em voz alta, se o computador tiver voz em português.
- Parado no desafio? O Til oferece ajuda aos 15 segundos e dá uma dica sozinho aos 28.
- Quem teve dificuldade, ou está demorando, recebe o próximo desafio mais fácil.
- **Na busca**, se a prova não aparece, o Til dá uma dica e depois mostra onde ela está. Aos 20 segundos, ele acha sozinho.
- **No mural**, quem toca num suspeito que combina com a pista ouve o porquê ("A Helena usa botas: ela combina com a pista. Não risque!"). Parado? Aos 8 segundos as fotos certas piscam; aos 18, o Til risca uma sozinho.
- **No confronto**, tocar em alguém já descartado não conta: o Til lembra de procurar quem sobrou.
- Erros e dicas só mudam as estrelas do selo final. Todo mundo resolve o caso.

## Para quem cuida do estande

- **MURAL DOS DETETIVES** (na tela de título e no jornal): o ranking da feira, com nome, detetive escolhido, nível, estrelas e tempo. Fica guardado só naquele computador. Para começar um dia novo, toque em **ZERAR MURAL** duas vezes.
- O nome pode ser digitado no teclado da tela ou no teclado do computador. Quem não quiser assinar toca em **PULAR**.
- A tela de título mostra quantos casos já foram resolvidos naquele computador.
- Se ninguém mexer por 100 segundos durante o jogo, aparece "Ainda está aí?". Aos 2 minutos, o jogo volta ao começo.
- O jornal volta sozinho ao começo depois de 90 segundos. A tela de título volta para "TOQUE PARA COMEÇAR" depois de 2 minutos.
- O botão de som (canto superior direito) liga e desliga todo o áudio.
- Os créditos da música e dos efeitos (licença CC BY) estão no botão **CRÉDITOS**. Eles precisam continuar no jogo.

## Arquivos

- `index.html`: abre o jogo.
- `css/`: visual. As fontes já estão embutidas.
- `js/`:
  - `dados.js`: textos, suspeitos, pistas e desafios.
  - `arte.js`: desenhos (cenários, personagens, mural e jornal).
  - `som.js`: áudio. Os efeitos curtos são sintetizados pelo próprio navegador.
  - `fx.js`: faíscas, confete e flashes.
  - `jogo.js`: regras e telas.
- `assets/`: vídeo de abertura, sons e o desenho do museu.
- `CREDITOS.md`: lista completa de créditos.

Para mudar uma fala, um desafio ou um suspeito, edite `js/dados.js`.
