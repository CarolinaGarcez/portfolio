/**
 * Main Game Controller - Rick and Morty Memory Game
 * Gerencia a lógica do jogo da memória, estado das cartas, temporizador e transição de fases.
 */

/* =========================================================
   STORAGE & UTILITIES
========================================================= */

// Helper seguro para localStorage com tratamento defensivo de erros
const Storage = {
  get(key, defaultValue = '') {
    try {
      return localStorage.getItem(key) ?? defaultValue;
    } catch (error) {
      console.warn(`[Storage] Falha ao ler ${key}:`, error);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value.toString());
    } catch (error) {
      console.warn(`[Storage] Falha ao salvar ${key}:`, error);
    }
  }
};

/**
 * Algoritmo Fisher-Yates (Durstenfeld Shuffle) para aleatoriedade uniforme O(n)
 */
const shuffleArray = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/* =========================================================
   ELEMENTOS DO DOM & ESTADO DO JOGO
========================================================= */

const elements = {
  grid: document.querySelector('.grid'),
  spanPlayer: document.querySelector('.player'),
  timer: document.querySelector('.timer'),
  resetButton: document.querySelector('.reset'),
  winScreen: document.querySelector('.win-screen'),
  winBoxTitle: document.querySelector('.win-box h2'),
  winText: document.querySelector('.win-text'),
  nextPhaseBtn: document.querySelector('.next-phase')
};

// Objeto de estado encapsulado
const gameState = {
  firstCard: null,
  secondCard: null,
  lockBoard: false,
  timerInterval: null,
  secondsElapsed: 0
};

/* =========================================================
   GERENCIAMENTO DO TEMPORIZADOR
========================================================= */

const startTimer = () => {
  gameState.secondsElapsed = 0;
  gameState.timerInterval = setInterval(() => {
    gameState.secondsElapsed++;
    if (elements.timer) {
      elements.timer.textContent = gameState.secondsElapsed;
    }
  }, 1000);
};

const stopTimer = () => {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
};

/* =========================================================
   PRÉ-CARREGAMENTO DE IMAGENS
========================================================= */

const preloadCardImages = () => {
  if (!window.gameConfig?.characters || !window.gameConfig?.cardPath) return;
  window.gameConfig.characters.forEach((character) => {
    const img = new Image();
    img.src = `${window.gameConfig.cardPath}${character}.png`;
  });
};

/* =========================================================
   LÓGICA DE CARTAS & JOGABILIDADE
========================================================= */

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('${window.gameConfig.cardPath}${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);
  card.setAttribute('data-character', character);

  return card;
};

const resetCardTurn = () => {
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.lockBoard = false;
};

const handleMatchedPair = () => {
  if (gameState.firstCard?.firstChild) {
    gameState.firstCard.firstChild.classList.add('disabled-card');
  }
  if (gameState.secondCard?.firstChild) {
    gameState.secondCard.firstChild.classList.add('disabled-card');
  }

  resetCardTurn();
  checkGameCompletion();
};

const handleMismatchedPair = () => {
  setTimeout(() => {
    if (gameState.firstCard) {
      gameState.firstCard.classList.remove('reveal-card');
    }
    if (gameState.secondCard) {
      gameState.secondCard.classList.remove('reveal-card');
    }

    resetCardTurn();
  }, 500);
};

const checkMatch = () => {
  const firstChar = gameState.firstCard.getAttribute('data-character');
  const secondChar = gameState.secondCard.getAttribute('data-character');

  if (firstChar === secondChar) {
    handleMatchedPair();
  } else {
    handleMismatchedPair();
  }
};

const revealCard = (card) => {
  if (gameState.lockBoard || !card) return;
  if (card.classList.contains('reveal-card')) return;

  card.classList.add('reveal-card');

  if (!gameState.firstCard) {
    gameState.firstCard = card;
    return;
  }

  gameState.secondCard = card;
  gameState.lockBoard = true;
  checkMatch();
};

/* =========================================================
   CONCLUSÃO DA FASE & VITÓRIA
========================================================= */

const checkGameCompletion = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');
  const totalCards = (window.gameConfig?.characters?.length || 0) * 2;

  if (disabledCards.length === totalCards) {
    stopTimer();

    // Persiste tempo acumulado das fases
    const currentPhaseTime = gameState.secondsElapsed;
    const prevTotal = parseInt(Storage.get('totalTime', '0'), 10);
    const newTotal = prevTotal + currentPhaseTime;
    Storage.set('totalTime', newTotal);

    const playerName = elements.spanPlayer?.textContent || 'Jogador';

    if (window.gameConfig?.finalPhase) {
      Storage.set('finalTime', newTotal);

      if (elements.winBoxTitle) {
        elements.winBoxTitle.textContent = '⚠️ CITADEL COLLAPSE ⚠️';
      }
      if (elements.winText) {
        elements.winText.textContent = `${playerName}, você escapou do colapso da Citadel. O portal para o multiverso foi aberto.`;
      }
      if (elements.nextPhaseBtn) {
        elements.nextPhaseBtn.textContent = '🌀 Entrar no Portal';
      }
    } else {
      if (elements.winBoxTitle) {
        elements.winBoxTitle.textContent = 'WUBBA LUBBA DUB DUB! 🚀';
      }
      if (elements.winText) {
        elements.winText.textContent = `${playerName}, você venceu em ${currentPhaseTime}s 🚀`;
      }
      if (elements.nextPhaseBtn) {
        elements.nextPhaseBtn.textContent = 'Próxima Fase';
      }
    }

    if (elements.winScreen) {
      elements.winScreen.classList.remove('hidden');
    }
  }
};

/* =========================================================
   INICIALIZAÇÃO DO TABULEIRO
========================================================= */

const loadGame = () => {
  if (!window.gameConfig?.characters || !elements.grid) return;

  preloadCardImages();

  const deck = shuffleArray([
    ...window.gameConfig.characters,
    ...window.gameConfig.characters
  ]);

  // Montagem otimizada com DocumentFragment (1 único reflow)
  const fragment = document.createDocumentFragment();
  deck.forEach((character) => {
    fragment.appendChild(createCard(character));
  });

  elements.grid.appendChild(fragment);
};

/* =========================================================
   OUVINTES DE EVENTOS (EVENT DELEGATION & BUTTONS)
========================================================= */

if (elements.grid) {
  elements.grid.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (card) {
      revealCard(card);
    }
  });
}

if (elements.resetButton) {
  elements.resetButton.addEventListener('click', () => {
    window.location.reload();
  });
}

if (elements.nextPhaseBtn) {
  elements.nextPhaseBtn.addEventListener('click', () => {
    if (window.gameConfig?.finalPhase) {
      document.body.classList.add('final-transition');
      setTimeout(() => {
        window.location.href = window.gameConfig.nextPage;
      }, 3000);
      return;
    }
    window.location.href = window.gameConfig.nextPage;
  });
}

window.onload = () => {
  if (elements.spanPlayer) {
    elements.spanPlayer.textContent = Storage.get('player', 'Jogador');
  }
  startTimer();
  loadGame();
};