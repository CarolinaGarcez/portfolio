const finalScreen = document.querySelector('.final-screen');
const finalTime = document.querySelector('.final-time');
const playAgain = document.querySelector('.play-again');


/* MOSTRA TELA FINAL */

const showFinalScreen = () => {

  const time = localStorage.getItem('finalTime') || localStorage.getItem('totalTime') || '0';

  if (finalTime) {
    finalTime.innerHTML = `${time}s`;
  }

  if (finalScreen) {
    finalScreen.classList.remove('hidden');
  }
};

window.addEventListener('DOMContentLoaded', showFinalScreen);


/* BOTÃO RECOMEÇAR */

if (playAgain) {
  playAgain.addEventListener('click', () => {

    localStorage.removeItem('player');
    localStorage.removeItem('totalTime');
    localStorage.removeItem('finalTime');

    window.location.href = '../index.html';
  });
}