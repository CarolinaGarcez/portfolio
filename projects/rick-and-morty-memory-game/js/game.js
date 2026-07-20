/**
 * Main Game Controller - Rick and Morty Memory Game
 * Gerencia a lógica do jogo da memória, estatísticas da conquista, portais e áudio.
 */

/* =========================================================
   AUDIO CONTROLLER (WEB AUDIO API & STUBS SINTETIZADOS)
========================================================= */

const AudioController = {
  createContext() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      return AudioContextClass ? new AudioContextClass() : null;
    } catch (e) {
      return null;
    }
  },

  playPortalSound() {
    try {
      const ctx = this.createContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.4);
    } catch (error) {
      console.warn('[AudioController] Áudio indisponível:', error);
    }
  },

  playMatchSound() {
    try {
      const ctx = this.createContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  },

  playErrorSound() {
    try {
      const ctx = this.createContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }
};

/* =========================================================
   STORAGE & UTILITIES
========================================================= */

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
 * Algoritmo Fisher-Yates (Durstenfeld Shuffle) O(n)
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

const getElements = () => ({
  grid: document.querySelector('.grid'),
  spanPlayer: document.querySelector('.player'),
  timer: document.querySelector('.timer'),
  moves: document.querySelector('.moves'),
  matchedPairs: document.querySelector('.matched-pairs'),
  totalPairs: document.querySelector('.total-pairs'),
  resetButton: document.querySelector('.reset'),
  winScreen: document.querySelector('.win-screen'),
  winBoxTitle: document.querySelector('.win-box h2'),
  winText: document.querySelector('.win-text'),
  nextPhaseBtn: document.querySelector('.next-phase')
});

let elements = getElements();

const gameState = {
  firstCard: null,
  secondCard: null,
  lockBoard: false,
  timerInterval: null,
  secondsElapsed: 0,
  movesCount: 0,
  matchedPairsCount: 0,
  currentStreak: 0,
  maxStreak: parseInt(Storage.get('maxStreak', '0'), 10),
  countdownValue: 3,
  countdownInterval: null
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
  AudioController.playMatchSound();

  gameState.matchedPairsCount++;
  gameState.currentStreak++;

  if (gameState.currentStreak > gameState.maxStreak) {
    gameState.maxStreak = gameState.currentStreak;
    Storage.set('maxStreak', gameState.maxStreak);
  }

  if (elements.matchedPairs) {
    elements.matchedPairs.textContent = gameState.matchedPairsCount;
  }

  if (gameState.firstCard) {
    gameState.firstCard.classList.add('match-success');
    if (gameState.firstCard.firstChild) {
      gameState.firstCard.firstChild.classList.add('disabled-card');
    }
  }

  if (gameState.secondCard) {
    gameState.secondCard.classList.add('match-success');
    if (gameState.secondCard.firstChild) {
      gameState.secondCard.firstChild.classList.add('disabled-card');
    }
  }

  resetCardTurn();
  checkGameCompletion();
};

const handleMismatchedPair = () => {
  AudioController.playErrorSound();
  gameState.currentStreak = 0;

  if (gameState.firstCard) {
    gameState.firstCard.classList.add('shake-error');
  }
  if (gameState.secondCard) {
    gameState.secondCard.classList.add('shake-error');
  }

  setTimeout(() => {
    if (gameState.firstCard) {
      gameState.firstCard.classList.remove('reveal-card', 'shake-error');
    }
    if (gameState.secondCard) {
      gameState.secondCard.classList.remove('reveal-card', 'shake-error');
    }

    resetCardTurn();
  }, 550);
};

const checkMatch = () => {
  gameState.movesCount++;
  if (elements.moves) {
    elements.moves.textContent = gameState.movesCount;
  }

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
   TRANSIÇÃO DE PORTAL INTERDIMENSIONAL (3, 2, 1 -> SALTO)
========================================================= */

const triggerPortalWarp = () => {
  document.body.classList.add('final-transition');
  setTimeout(() => {
    window.location.href = window.gameConfig.nextPage;
  }, 1200);
};

const renderPortalModalContent = () => {
  if (!elements.winScreen) return;

  const playerName = elements.spanPlayer?.textContent || 'Jogador';
  const isFinal = window.gameConfig?.finalPhase;

  const phaseTitle = isFinal ? 'DIMENSÃO FINAL' : 'DIMENSÃO CONCLUÍDA';
  const dimensionName = isFinal ? 'CITADEL COLLAPSE' : 'SALTO INTERDIMENSIONAL';
  const subtitle = isFinal 
    ? `${playerName}, você salvou o multiverso em ${gameState.movesCount} jogadas!`
    : `${playerName}, você venceu em ${gameState.secondsElapsed}s (${gameState.movesCount} jogadas)! Sincronizando coordenadas...`;

  elements.winScreen.className = 'win-screen portal-transition-overlay';
  elements.winScreen.innerHTML = `
    <div class="portal-transition-box">
      <span class="dimension-badge">${phaseTitle}</span>
      <h2 class="dimension-title">${dimensionName}</h2>
      <p class="dimension-subtitle">${subtitle}</p>

      <div class="portal-wrapper">
        <div class="portal-ring-outer"></div>
        <div class="portal-ring-inner"></div>
        <div class="portal-core"></div>
      </div>

      <div class="portal-countdown" id="portalCountdown">3</div>

      <button class="next-phase">
        ${isFinal ? '🌀 Entrar no Portal' : '🚀 Salto Imediato'}
      </button>
    </div>
  `;

  const newBtn = elements.winScreen.querySelector('.next-phase');
  if (newBtn) {
    newBtn.addEventListener('click', triggerPortalWarp);
  }
};

const startPortalCountdown = () => {
  gameState.countdownValue = 3;
  const countdownEl = document.getElementById('portalCountdown');

  AudioController.playPortalSound();

  gameState.countdownInterval = setInterval(() => {
    gameState.countdownValue--;
    if (countdownEl) {
      countdownEl.textContent = gameState.countdownValue > 0 ? gameState.countdownValue : '🌀';
    }

    if (gameState.countdownValue <= 0) {
      clearInterval(gameState.countdownInterval);
      triggerPortalWarp();
    }
  }, 1000);
};

/* =========================================================
   CONCLUSÃO DA FASE & VITÓRIA
========================================================= */

const checkGameCompletion = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');
  const totalCards = (window.gameConfig?.characters?.length || 0) * 2;

  if (disabledCards.length === totalCards) {
    stopTimer();

    const currentPhaseTime = gameState.secondsElapsed;
    const prevTotalTime = parseInt(Storage.get('totalTime', '0'), 10);
    const newTotalTime = prevTotalTime + currentPhaseTime;
    Storage.set('totalTime', newTotalTime);

    const prevTotalMoves = parseInt(Storage.get('totalMoves', '0'), 10);
    const newTotalMoves = prevTotalMoves + gameState.movesCount;
    Storage.set('totalMoves', newTotalMoves);
    Storage.set('maxStreak', gameState.maxStreak);

    if (window.gameConfig?.finalPhase) {
      Storage.set('finalTime', newTotalTime);
    }

    renderPortalModalContent();
    startPortalCountdown();
  }
};

/* =========================================================
   INICIALIZAÇÃO DO TABULEIRO
========================================================= */

const loadGame = () => {
  elements = getElements();
  if (!window.gameConfig?.characters || !elements.grid) return;

  preloadCardImages();

  const totalPairsCount = window.gameConfig.characters.length;
  if (elements.totalPairs) {
    elements.totalPairs.textContent = totalPairsCount;
  }
  if (elements.matchedPairs) {
    elements.matchedPairs.textContent = '0';
  }
  if (elements.moves) {
    elements.moves.textContent = '0';
  }

  const deck = shuffleArray([
    ...window.gameConfig.characters,
    ...window.gameConfig.characters
  ]);

  const fragment = document.createDocumentFragment();
  deck.forEach((character) => {
    fragment.appendChild(createCard(character));
  });

  elements.grid.appendChild(fragment);
};

/* =========================================================
   OUVINTES DE EVENTOS (EVENT DELEGATION & BUTTONS)
========================================================= */

window.onload = () => {
  elements = getElements();

  if (elements.spanPlayer) {
    elements.spanPlayer.textContent = Storage.get('player', 'Jogador');
  }

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
    elements.nextPhaseBtn.addEventListener('click', triggerPortalWarp);
  }

  startTimer();
  loadGame();
};