export const frases = {

  impulso: [
    "Você não precisa estar pronta, só precisa continuar.",
    "Hoje já conta, mesmo que pareça pouco.",
    "Um passo ainda é movimento.",
    "Você não tá parada, só tá indo devagar demais pra perceber.",
    "Começa do jeito que dá, não do jeito ideal.",
    "Você consegue continuar mesmo sem vontade.",
    "Não espera energia perfeita pra agir.",
    "O mínimo ainda te mantém no caminho.",
    "Você não precisa resolver tudo hoje.",
    "Só não para agora."
  ],

  realidade: [
    "Se nada deu certo hoje, pelo menos você tentou.",
    "Descansar também é estratégia, não fuga.",
    "Nem todo dia vai ser produtivo — e tá tudo bem.",
    "Você não tá atrasada, só tá vivendo no seu ritmo estranho.",
    "Nem tudo precisa ser intenso pra ser válido.",
    "Você não tá perdida, só acumulando versões de si mesma.",
    "Hoje não precisa ser grandioso pra ser suficiente.",
    "Nem todo esforço aparece de imediato.",
    "Você não precisa performar bem o tempo todo.",
    "Sobreviver também é um tipo de vitória silenciosa."
  ],

  concentracao: [
    "Uma coisa por vez já muda tudo.",
    "Simplifica, depois continua.",
    "Foca no próximo passo, não no caminho inteiro.",
    "Você não precisa fazer tudo, só o que importa agora.",
    "Menos distração, mais direção.",
    "Começa pequeno, mantém constante.",
    "Faz o básico bem feito e segue.",
    "Se estiver confuso, reduz o escopo.",
    "Não complica o que pode ser simples.",
    "Foco é voltar, não acertar sempre."
  ],

  recomeço: [
    "Recomeçar não apaga o que você já fez.",
    "Você não perdeu tempo, acumulou tentativa.",
    "Todo recomeço parece estranho no começo.",
    "Não precisa voltar perfeito, só voltar.",
    "Você ainda pode mudar o rumo hoje.",
    "Recomeçar é só continuar por outro caminho.",
    "Não precisa estar pronta pra tentar de novo.",
    "Você não falhou, só ajustou a rota.",
    "Cada novo começo carrega o anterior.",
    "Recomeçar também é progresso."
  ]
};

// função
export function getFraseAleatoria() {

  // pega todas categorias
  const categorias = Object.keys(frases);

  // escolhe categoria aleatória
  const categoriaRandom =
    categorias[Math.floor(Math.random() * categorias.length)];

  // pega lista da categoria
  const lista = frases[categoriaRandom];

  // escolhe frase aleatória
  const frase =
    lista[Math.floor(Math.random() * lista.length)];

  return frase;
}