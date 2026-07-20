/**
 * End Screen Controller - Rick and Morty Memory Game
 * Exibe as estatísticas da conquista final do jogador e gerencia botões.
 */

const Storage = {
  get(key, defaultValue = '') {
    try {
      return localStorage.getItem(key) ?? defaultValue;
    } catch (error) {
      console.warn(`[Storage] Falha ao ler ${key}:`, error);
      return defaultValue;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[Storage] Falha ao remover ${key}:`, error);
    }
  }
};

const elements = {
  finalScreen: document.querySelector('.final-screen'),
  totalTime: document.querySelector('.final-total-time'),
  totalMoves: document.querySelector('.final-total-moves'),
  maxStreak: document.querySelector('.final-max-streak'),
  playAgainBtn: document.querySelector('.play-again')
};

/**
 * Atualiza os marcadores da Tela de Conquista com dados reais salvos
 */
const renderAchievementScreen = () => {
  const finalScoreTime = Storage.get('finalTime') || Storage.get('totalTime') || '0';
  const totalMoves = Storage.get('totalMoves') || '0';
  const maxStreak = Storage.get('maxStreak') || '0';

  if (elements.totalTime) {
    elements.totalTime.textContent = `${finalScoreTime}s`;
  }
  if (elements.totalMoves) {
    elements.totalMoves.textContent = `${totalMoves} jogadas`;
  }
  if (elements.maxStreak) {
    elements.maxStreak.textContent = `${maxStreak} acertos`;
  }

  if (elements.finalScreen) {
    elements.finalScreen.classList.remove('hidden');
  }
};

/**
 * Limpa a sessão atual e retorna à tela de entrada
 */
const handlePlayAgain = () => {
  Storage.remove('player');
  Storage.remove('totalTime');
  Storage.remove('finalTime');
  Storage.remove('totalMoves');
  Storage.remove('maxStreak');

  window.location.href = '../index.html';
};

window.addEventListener('DOMContentLoaded', renderAchievementScreen);

if (elements.playAgainBtn) {
  elements.playAgainBtn.addEventListener('click', handlePlayAgain);
}