// ================================
// IMPORTS
// ================================

import { statusList } from "./data/data-status.js";

import { createStatusElement } from "./components/status.js";

import { startStatusRotation } from "./effects/status-effect.js";

// importa o sistema da frase/botão
import "./result.js";


// ================================
// STATUS ROTATION
// ================================

const statusEl = createStatusElement(".status-text");

startStatusRotation(statusList, statusEl);