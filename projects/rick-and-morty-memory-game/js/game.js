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

  const element =
    document.createElement(tag);

  element.className = className;

  return element;
};


/* =========================================================
   CONTROLE DO JOGO
========================================================= */

/* primeira carta */
let firstCard = null;

/* segunda carta */
let secondCard = null;

/* trava cliques */
let lockBoard = false;

/* timer */
let loop;


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

    const winTitle =
      document.querySelector('.win-box h2');

    if (gameConfig.finalPhase) {

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


  /* =========================================
     CARTAS IGUAIS
  ========================================= */

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

    /* =========================================
       CARTAS DIFERENTES
    ========================================= */

    setTimeout(() => {

      firstCard.classList
        .remove('reveal-card');

      secondCard.classList
        .remove('reveal-card');

      firstCard = null;
      secondCard = null;

      lockBoard = false;

    }, 500);
  }
};


/* =========================================================
   VIRAR CARTA
========================================================= */

const revealCard = ({ target }) => {

  /* trava animação */
  if (lockBoard) return;

  const card =
    target.closest('.card');

  if (!card) return;

  /* impede clicar na mesma */
  if (
    card.classList.contains('reveal-card')
  ) return;


  /* =========================================
     VIRA CARTA
  ========================================= */

  card.classList.add('reveal-card');


  /* =========================================
     PRIMEIRA CARTA
  ========================================= */

  if (!firstCard) {

    firstCard = card;

    return;
  }


  /* =========================================
     SEGUNDA CARTA
  ========================================= */

  secondCard = card;

  lockBoard = true;

  checkCards();
};


/* =========================================================
   CRIA CARTAS
========================================================= */

const createCard = (character) => {

  const card =
    createElement('div', 'card');

  const front =
    createElement('div', 'face front');

  const back =
    createElement('div', 'face back');


  /* =========================================
     IMAGEM DA CARTA
  ========================================= */

  front.style.backgroundImage =
    `url('${gameConfig.cardPath}${character}.png')`;


  /* =========================================
     MONTA CARTA
  ========================================= */

  card.appendChild(front);
  card.appendChild(back);

  card.setAttribute(
    'data-character',
    character
  );

  card.addEventListener(
    'click',
    revealCard
  );

  return card;
};


/* =========================================================
   CARREGA JOGO
========================================================= */

const loadGame = () => {

  const duplicateCharacters = [

    ...gameConfig.characters,

    ...gameConfig.characters

  ];


  /* =========================================
     EMBARALHA
  ========================================= */

  const shuffledArray =
    duplicateCharacters.sort(
      () => Math.random() - 0.5
    );


  /* =========================================
     CRIA CARTAS
  ========================================= */

  shuffledArray.forEach((character) => {

    const card =
      createCard(character);

    grid.appendChild(card);
  });
};


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

resetButton.addEventListener('click', () => {

  window.location.reload();

});


/* =========================================================
   PRÓXIMA FASE
========================================================= */

nextPhase.addEventListener('click', () => {

  if (gameConfig.finalPhase) {

    document.body.classList
      .add('final-transition');

    setTimeout(() => {

      window.location.href =
        gameConfig.nextPage;

    }, 3000);

    return;
  }

  window.location.href =
    gameConfig.nextPage;

});


/* =========================================================
   INICIA JOGO
========================================================= */

window.onload = () => {

  /* nome jogador */
  spanPlayer.innerHTML =

    localStorage.getItem('player')

    || 'Jogador';


  /* inicia timer */
  startTimer();


  /* carrega cartas */
  loadGame();
};