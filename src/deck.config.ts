/**
 * Deck-wide locale and writing direction.
 *
 * Direction is fixed for a given deck rather than toggled at runtime: a
 * workshop is presented in one language, and a constant lets the bundler
 * strip the branch that is never taken. Set both values once, here.
 *
 * Everything that can be expressed as CSS is already direction-agnostic —
 * the shell uses logical utilities (ms/me, ps/pe, start/end, text-start)
 * that flip on their own when `dir="rtl"` is on <html>. Only two things
 * genuinely need to know the direction in JavaScript, and both read IS_RTL:
 *
 *   1. The prev/next chevrons, which point at a physical direction.
 *   2. The arrow keys, where "forward" is ArrowRight in LTR and
 *      ArrowLeft in RTL.
 */
export type DeckDirection = "ltr" | "rtl";

/**
 * The deck's name, as shown in the presenter chrome.
 *
 * It lives here rather than inside DeckChrome for one reason: a title
 * hard-coded in a component is a title nobody remembers to change, and the
 * failure mode is a scaffolded deck presenting under the template's name in
 * front of a room. `scaffold.sh` fills this in from the title you pass it.
 */
export const DECK_TITLE = "Introduction to Claude Code";

export const DECK_LOCALE = "en";

// The `as DeckDirection` is load-bearing, not decoration. Written as a plain
// annotated const, TypeScript narrows the value to the single literal it was
// assigned and then rejects the IS_RTL comparison below as impossible. The
// assertion keeps the declared type the full union, so both branches stay
// legal and only one line has to change to flip the deck.
export const DECK_DIRECTION = "ltr" as DeckDirection;

export const IS_RTL = DECK_DIRECTION === "rtl";
