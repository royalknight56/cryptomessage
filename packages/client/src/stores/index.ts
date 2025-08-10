// Pinia stores index file
// Note: You need to install pinia first: npm install pinia

import { createPinia } from "pinia";

export const pinia = createPinia();

export { useGameStore } from "./gameStore";
