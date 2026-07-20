/**
 * Login Controller - Rick and Morty Memory Game
 * Gerencia validação do nome do jogador e transição de entrada.
 */

// Helper seguro para localStorage com tratamento de erros
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`[Storage] Falha ao salvar ${key}:`, error);
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

// Mapeamento defensivo dos elementos do DOM
const elements = {
  input: document.querySelector('.login__input'),
  button: document.querySelector('.login__button'),
  form: document.querySelector('.login-form'),
  portalLoading: document.querySelector('.portal-loading')
};

/**
 * Valida o nome digitado pelo jogador (mínimo de 3 caracteres)
 */
const validateInput = (event) => {
  const value = event.target.value.trim();
  if (!elements.button) return;

  if (value.length >= 3) {
    elements.button.removeAttribute('disabled');
  } else {
    elements.button.setAttribute('disabled', '');
  }
};

/**
 * Processa a submissão do formulário de entrada
 */
const handleSubmit = (event) => {
  event.preventDefault();

  if (!elements.input) return;

  const playerName = elements.input.value.trim();
  if (playerName.length < 3) return;

  // Armazena jogador e reseta sessões de tempo anteriores
  Storage.set('player', playerName);
  Storage.remove('totalTime');
  Storage.remove('finalTime');

  // Exibe a tela de carregamento do portal
  if (elements.portalLoading) {
    elements.portalLoading.classList.remove('hidden');
  }

  // Redireciona para a Fase 1 após aguardar a animação
  setTimeout(() => {
    window.location.href = './pages/fase1.html';
  }, 2200);
};

// Inicialização dos ouvintes de eventos
if (elements.input && elements.form) {
  elements.input.addEventListener('input', validateInput);
  elements.form.addEventListener('submit', handleSubmit);
}