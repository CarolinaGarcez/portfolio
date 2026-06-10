/**
 * Arquivo: js/main.js
 * Finalidade: Ponto de entrada (Entrypoint) principal do JavaScript.
 * Responsabilidade:
 *   - Importar os inicializadores de cada componente/módulo (countdown, vinyl, animations).
 *   - Registrar o ouvinte de carregamento do DOM (DOMContentLoaded).
 *   - Inicializar as rotinas de cada módulo na ordem adequada.
 * Relação com outros módulos:
 *   - É o único arquivo Javascript incluído diretamente no HTML (via script type="module").
 *   - Importa countdown.js, vinyl.js e animations.js.
 */

// Importa as rotinas de inicialização dos submódulos
import { initCountdown } from './countdown.js';
import { initVinyl } from './vinyl.js';

// Executa a inicialização quando o DOM estiver completamente montado
document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializa o relógio de contagem regressiva flip 3D
  initCountdown();

  // 2. Inicializa os controles interativos do disco de vinil
  initVinyl();
});
