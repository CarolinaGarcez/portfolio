/**
 * End Screen Controller - Rick and Morty Memory Game
 * Exibe o tempo final acumulado e gerencia o reinício do jogo.
 */

// Helper seguro para localStorage com tratamento defensivo
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

// Mapeamento dos elementos do DOM
const elements = {
  finalScreen: document.querySelector('.final-screen'),
  finalTime: document.querySelector('.final-time'),
  playAgainBtn: document.querySelector('.play-again')
};

/**
 * Atualiza o elemento de tempo final e exibe a tela de vitória
 */
const renderFinalScreen = () => {
  const finalScore = Storage.get('finalTime') || Storage.get('totalTime') || '0';

  if (elements.finalTime) {
    elements.finalTime.textContent = `${finalScore}s`;
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

  window.location.href = '../index.html';
};

// Registra ouvintes quando o DOM estiver pronto
window.addEventListener('DOMContentLoaded', renderFinalScreen);

if (elements.playAgainBtn) {
  elements.playAgainBtn.addEventListener('click', handlePlayAgain);
}