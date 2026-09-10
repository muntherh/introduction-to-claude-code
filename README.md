# Introduction to Claude Code

A presenter-driven, **16-slide interactive website** for a beginner workshop on
Claude Code — the AI that works inside your project instead of beside it.

It replaces a slide deck. Every slide teaches one idea, shows one example,
shows what comes back, and gives the room something to click. The whole thing
runs offline: nothing here calls a model or touches the network.

The deck is in two halves. Slides 02–07 are the theory — what Claude Code is
and how it behaves. Slides 08–14 are hands-on, with the room following along
in a real terminal. Slide 08 is the hinge.

## Run it

Requires **Node 20.19+ or 22.12+** (Vite 7).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run preview    # serve the build (port 4173)
```

`dist/` is a static bundle with a relative base, so it works from a sub-path,
a `file://` URL, or a USB stick handed to someone at the end of the session.

## Verify it

A deck that has not been driven has not been built.

```bash
npm run build && npm run preview &
npm run verify                # console errors, overflow, headings, labels
npm run verify:fit            # every control reachable at 1280x720
npm run verify:interactions   # drives all 30 interactions end to end
```

## Presenting

Arrows and Page keys move, space advances, `Home`/`End` jump, `o` opens the
overview, `f` toggles fullscreen, `Escape` closes the overview.

## Credits

Built with the `workshop` skill, on the presentation shell developed for
[python-basics-interactive-workshop](https://github.com/muntherh/python-basics-interactive-workshop)
and [vibe-coding-workshop](https://github.com/muntherh/vibe-coding-workshop).
The palette is Anthropic's brand warm end — a warm near-black canvas with the
Claude orange as the single dominant accent.
