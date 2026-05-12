// Importa a função responsável por pegar
// uma frase aleatória do banco de frases
import { getFraseAleatoria } from "./data/data-frases.js";


// Seleciona o botão pelo ID
// Esse botão será clicado pelo usuário
const btn = document.getElementById("startBtn");


// Seleciona o elemento onde
// a frase será exibida na tela
const phrase = document.getElementById("phrase");


// Seleciona o container de resultado
// que ficará visível após o clique
const result = document.getElementById("result");


// Adiciona um evento de clique no botão
btn.addEventListener("click", () => {

  // Chama a função que retorna
  // uma frase aleatória
  const frase = getFraseAleatoria();

  // Insere a frase dentro do elemento HTML
  phrase.textContent = frase;

  // Adiciona a classe "show"
  // para ativar animação/visibilidade no CSS
  result.classList.add("show");

});