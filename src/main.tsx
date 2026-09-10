import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-hosted variable fonts (SIL Open Font License) so the deck renders
// identically with no network connection.
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";

import App from "@/App";
import { DECK_DIRECTION, DECK_LOCALE } from "@/deck.config";
import "@/styles/index.css";

// Set on <html> rather than hard-coded in index.html so the deck's language
// lives in exactly one place. `dir` is what makes every logical utility in
// the shell (ms/me, ps/pe, start/end) resolve to the correct side, and
// `lang` is what lets screen readers pick the right voice.
document.documentElement.lang = DECK_LOCALE;
document.documentElement.dir = DECK_DIRECTION;

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container #root was not found in index.html");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
