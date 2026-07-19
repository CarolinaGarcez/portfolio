const finalScreen = document.querySelector('.final-screen');
const finalTime = document.querySelector('.final-time');
const playAgain = document.querySelector('.play-again');


/* MOSTRA TELA FINAL */

const showFinalScreen = () => {

  finalTime.innerHTML = `${timer.innerHTML}s`;

  finalScreen.classList.remove('hidden');
};


/* BOTÃO RECOMEÇAR */

playAgain.addEventListener('click', () => {

  localStorage.removeItem('player');

  window.location.href = '../index.html';
});