/**
 * Arquivo: js/countdown.js
 * Finalidade: Módulo da contagem regressiva e controle do relógio flip.
 * Responsabilidade:
 *   - Calcular a diferença de tempo em relação a 08/08/2026.
 *   - Gerenciar as atualizações de dígitos individuais por meio de transições 3D (flip).
 *   - Evitar acúmulo de animações na DOM caso a aba do navegador seja minimizada.
 * Métodos exportados:
 *   - initCountdown(): Inicializa o relógio no carregamento e configura o loop de 1 segundo.
 * Relação com outros módulos:
 *   - Inicializado pelo módulo principal js/main.js.
 */

// Data de destino do show (08 de Agosto de 2026 às 12:00:00 em São Paulo)
const showDate = new Date("2026-08-08T12:00:00").getTime();

// Flag de controle para evitar animação flip imediata no carregamento da página
let isInitialLoad = true;

/**
 * Executa a animação física de flip 3D em um dígito individual
 * @param {HTMLElement} cardElement - O elemento do cartão (.flip-card)
 * @param {string} newValue - O novo número (caractere) a ser exibido
 */
function flipDigit(cardElement, newValue) {
  const topElement = cardElement.querySelector('.top .digit-num');
  const bottomElement = cardElement.querySelector('.bottom .digit-num');
  
  if (!topElement || !bottomElement) return;
  
  const currentValue = topElement.textContent;
  
  // Se o valor não mudou, não faz nada
  if (currentValue === newValue) return;
  
  // Remove animações anteriores pendentes (previne acúmulo se o navegador pausar na aba inativa)
  const pendingTopFlips = cardElement.querySelectorAll('.top-flip');
  const pendingBottomFlips = cardElement.querySelectorAll('.bottom-flip');
  pendingTopFlips.forEach(el => el.remove());
  pendingBottomFlips.forEach(el => el.remove());
  
  // Criar os flaps de animação temporários
  const topFlip = document.createElement('div');
  topFlip.classList.add('top-flip');
  topFlip.innerHTML = `<span class="digit-num">${currentValue}</span>`;
  
  const bottomFlip = document.createElement('div');
  bottomFlip.classList.add('bottom-flip');
  bottomFlip.innerHTML = `<span class="digit-num">${newValue}</span>`;
  
  // 1. Atualizar o topo estático imediatamente para o novo valor
  topElement.textContent = newValue;
  
  // 2. Quando a metade superior terminar de descer, removemos ela do DOM
  topFlip.addEventListener('animationend', () => {
    topFlip.remove();
  });
  
  // 3. Quando a metade inferior terminar de descer para a posição final,
  // atualizamos o fundo estático inferior com o novo valor e limpamos o flap
  bottomFlip.addEventListener('animationend', () => {
    bottomElement.textContent = newValue;
    bottomFlip.remove();
  });
  
  // Anexar os flaps animados para iniciar a transição CSS
  cardElement.appendChild(topFlip);
  cardElement.appendChild(bottomFlip);
}

/**
 * Seleciona o elemento HTML e atualiza seu valor de dígito
 * @param {string} cardId - O ID do elemento .flip-card
 * @param {string} newValue - O novo valor de um dígito ("0" a "9")
 */
function updateCard(cardId, newValue) {
  const card = document.getElementById(cardId);
  if (!card) return;
  
  const topSpan = card.querySelector('.top .digit-num');
  const bottomSpan = card.querySelector('.bottom .digit-num');
  
  if (isInitialLoad) {
    // No carregamento inicial, apenas inserimos o texto sem animar o flip
    if (topSpan) topSpan.textContent = newValue;
    if (bottomSpan) bottomSpan.textContent = newValue;
  } else {
    // Nas atualizações subsequentes, executamos a transição flip
    flipDigit(card, newValue);
  }
}

/**
 * Calcula a diferença de tempo e atualiza os cartões correspondentes
 */
function updateCountdown() {
  const now = new Date().getTime();
  const distance = showDate - now;
  
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  
  if (distance > 0) {
    days = Math.floor(distance / (1000 * 60 * 60 * 24));
    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    seconds = Math.floor((distance % (1000 * 60)) / 1000);
  }
  
  // Converte os valores para string com dois caracteres (ex: 9 -> "09")
  const daysStr = String(days).padStart(2, '0');
  const hoursStr = String(hours).padStart(2, '0');
  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');
  
  // Atualiza cada dígito individualmente (dezenas e unidades)
  updateCard("days-tens", daysStr[0]);
  updateCard("days-ones", daysStr[1]);
  
  updateCard("hours-tens", hoursStr[0]);
  updateCard("hours-ones", hoursStr[1]);
  
  updateCard("minutes-tens", minutesStr[0]);
  updateCard("minutes-ones", minutesStr[1]);
  
  updateCard("seconds-tens", secondsStr[0]);
  updateCard("seconds-ones", secondsStr[1]);
  
  // Após a primeira execução da página, as próximas usarão o flip
  if (isInitialLoad) {
    isInitialLoad = false;
  }
}

/**
 * Inicializa a contagem regressiva
 */
export function initCountdown() {
  updateCountdown();
  // Configura a execução contínua a cada 1 segundo
  setInterval(updateCountdown, 1000);
}
