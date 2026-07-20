const input =
  document.querySelector('.login__input');

const button =
  document.querySelector('.login__button');

const form =
  document.querySelector('.login-form');

const portalLoading =
  document.querySelector('.portal-loading');


/* =========================
   VALIDA INPUT
========================= */

const validateInput = ({ target }) => {

  if (target.value.length >= 3) {

    button.removeAttribute('disabled');

    return;
  }

  button.setAttribute('disabled', '');

};


/* =========================
   ENTRAR NO JOGO
========================= */

const handleSubmit = (event) => {

  event.preventDefault();

  localStorage.setItem(
    'player',
    input.value
  );

  /* mostra loading */
  portalLoading.classList.remove('hidden');

  /* espera animação */
  setTimeout(() => {

    window.location.href = './pages/fase1.html';

  }, 2200);

};


/* eventos */
input.addEventListener(
  'input',
  validateInput
);

form.addEventListener(
  'submit',
  handleSubmit
);