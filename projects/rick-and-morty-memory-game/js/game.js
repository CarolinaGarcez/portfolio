/* =========================================================
   ELEMENTOS DA TELA
========================================================= */

const grid = document.querySelector('.grid');

const spanPlayer =
  document.querySelector('.player');

const timer =
  document.querySelector('.timer');

const resetButton =
  document.querySelector('.reset');

const winScreen =
  document.querySelector('.win-screen');

const winText =
  document.querySelector('.win-text');

const nextPhase =
  document.querySelector('.next-phase');


/* =========================================================
   FUNÇÃO PARA CRIAR ELEMENTOS HTML
========================================================= */

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};


/* =========================================================
   CONTROLE DO JOGO
========================================================= */

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let loop;


/* =========================================================
   PRÉ-CARREGAMENTO DE IMAGENS (PRELOAD)
========================================================= */

const preloadImages = () => {
  if (!gameConfig || !gameConfig.characters) return;
  gameConfig.characters.forEach((character) => {
    const img = new Image();
    img.src = `${gameConfig.cardPath}${character}.png`;
  });
};


/* =========================================================
   VERIFICA FIM DE JOGO
========================================================= */

const checkEndGame = () => {
  const disabledCards =
    document.querySelectorAll('.disabled-card');

  const totalCards =
    gameConfig.characters.length * 2;

  if (disabledCards.length === totalCards) {

    clearInterval(loop);

    const currentPhaseTime = parseInt(timer.innerHTML) || 0;
    const prevTotal = parseInt(localStorage.getItem('totalTime') || '0');
    const newTotal = prevTotal + currentPhaseTime;
    localStorage.setItem('totalTime', newTotal.toString());

    const winTitle =
      document.querySelector('.win-box h2');

    if (gameConfig.finalPhase) {

      localStorage.setItem('finalTime', newTotal.toString());

      winTitle.innerHTML =
        '⚠️ CITADEL COLLAPSE ⚠️';

      winText.innerHTML = `
        ${spanPlayer.innerHTML},
        você escapou do colapso da Citadel.

        O portal para o multiverso foi aberto.
      `;

      nextPhase.innerHTML =
        '🌀 Entrar no Portal';

    } else {

      winTitle.innerHTML =
        'WUBBA LUBBA DUB DUB! 🚀';

      winText.innerHTML =
        `${spanPlayer.innerHTML}, você venceu em ${timer.innerHTML}s 🚀`;

      nextPhase.innerHTML =
        'Próxima Fase';
    }

    winScreen.classList.remove('hidden');
  }
};


/* =========================================================
   COMPARA CARTAS
========================================================= */

const checkCards = () => {
  const firstCharacter =
    firstCard.getAttribute('data-character');

  const secondCharacter =
    secondCard.getAttribute('data-character');


  /* CARTAS IGUAIS */
  if (firstCharacter === secondCharacter) {
    firstCard.firstChild
      .classList.add('disabled-card');

    secondCard.firstChild
      .classList.add('disabled-card');

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    checkEndGame();

  } else {
    /* CARTAS DIFERENTES */
    setTimeout(() => {
      if (firstCard) {
        firstCard.classList.remove('reveal-card');
      }
      if (secondCard) {
        secondCard.classList.remove('reveal-card');
      }

      firstCard = null;
      secondCard = null;
      lockBoard = false;

    }, 500);
  }
};


/* =========================================================
   VIRAR CARTA
========================================================= */

const revealCard = (card) => {
  if (lockBoard) return;
  if (!card) return;

  if (
    card.classList.contains('reveal-card')
  ) return;

  card.classList.add('reveal-card');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;

  checkCards();
};


/* =========================================================
   CRIA CARTAS
========================================================= */

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage =
    `url('${gameConfig.cardPath}${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.setAttribute(
    'data-character',
    character
  );

  return card;
};


/* =========================================================
   CARREGA JOGO
========================================================= */

const loadGame = () => {
  preloadImages();

  const duplicateCharacters = [
    ...gameConfig.characters,
    ...gameConfig.characters
  ];

  /* Fisher-Yates Shuffle para O(n) e aleatoriedade uniforme */
  for (let i = duplicateCharacters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [duplicateCharacters[i], duplicateCharacters[j]] = [duplicateCharacters[j], duplicateCharacters[i]];
  }

  /* Uso de DocumentFragment para 1 único reflow/repaint ao montar a grade */
  const fragment = document.createDocumentFragment();

  duplicateCharacters.forEach((character) => {
    const card = createCard(character);
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
};


/* Delegação de eventos no container pai .grid */
if (grid) {
  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (card) {
      revealCard(card);
    }
  });
}


/* =========================================================
   TIMER
========================================================= */

const startTimer = () => {
  let time = 0;
  loop = setInterval(() => {
    time++;
    timer.innerHTML = time;
  }, 1000);
};


/* =========================================================
   RESET
========================================================= */

if (resetButton) {
  resetButton.addEventListener('click', () => {
    window.location.reload();
  });
}


/* =========================================================
   PRÓXIMA FASE
========================================================= */

if (nextPhase) {
  nextPhase.addEventListener('click', () => {
    if (gameConfig.finalPhase) {
      document.body.classList.add('final-transition');

      setTimeout(() => {
        window.location.href = gameConfig.nextPage;
      }, 3000);

      return;
    }

    window.location.href = gameConfig.nextPage;
  });
}


/* =========================================================
   INICIA JOGO
========================================================= */

window.onload = () => {
  spanPlayer.innerHTML =
    localStorage.getItem('player') || 'Jogador';

  startTimer();
  loadGame();
};