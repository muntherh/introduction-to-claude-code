import { RotateCcw, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { TerminalSession } from "@/components/TerminalSession";
import { FIRST_SESSION } from "@/data/lesson";
import { cn } from "@/lib/cn";
import { cleanInput, simulateSession } from "@/lib/simulate";

/**
 * Slide 09 — the room types a request and watches a whole turn land.
 *
 * The three presets have hand-written turns; anything typed falls through to
 * an honest generic one. Nothing here calls a model — see lib/simulate.ts.
 */
export function FirstSessionSection({ index, registerRef }: SectionProps) {
  const [request, setRequest] = useState<string>(FIRST_SESSION.presets[0] ?? "");
  // `null` means nothing has been sent yet. An empty string is a real send
  // of an empty box, which has its own answer — the two must not collapse.
  const [sent, setSent] = useState<string | null>(null);
  const [playToken, setPlayToken] = useState(0);

  const lines = useMemo(
    () => (sent === null ? [] : simulateSession(sent)),
    [sent],
  );

  const send = () => {
    setSent(request);
    setPlayToken((token) => token + 1);
  };

  const reset = () => {
    setRequest(FIRST_SESSION.presets[0] ?? "");
    setSent(null);
    setPlayToken(0);
  };

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={FIRST_SESSION.eyebrow}
      title={FIRST_SESSION.title}
      lead={FIRST_SESSION.lead}
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
        <div className="min-w-0">
          <p className="mb-3 font-mono text-[0.72rem] tracking-[0.24em] text-dim uppercase">
            {FIRST_SESSION.hint}
          </p>

          <ul className="grid gap-2.5">
            {FIRST_SESSION.presets.map((preset, presetIndex) => (
              <Reveal key={preset} delay={0.18 + presetIndex * 0.06}>
                <li>
                  <button
                    type="button"
                    onClick={() => setRequest(preset)}
                    className={cn(
                      "w-full cursor-pointer rounded-xl border px-4 py-3 text-start text-[clamp(0.88rem,1.1vw,1.15rem)] transition-colors duration-200",
                      request === preset
                        ? "border-accent-warm/60 bg-accent-warm/10 text-chalk"
                        : "border-line bg-navy-900/60 text-mist hover:border-accent/45 hover:text-chalk",
                    )}
                  >
                    {preset}
                  </button>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.36}>
            <div className="mt-5 flex flex-col gap-2">
              <label
                htmlFor="session-request"
                className="font-mono text-[0.72rem] tracking-[0.2em] text-dim uppercase"
              >
                Or write your own
              </label>
              <input
                id="session-request"
                type="text"
                value={request}
                placeholder={FIRST_SESSION.placeholder}
                onChange={(event) =>
                  setRequest(cleanInput(event.target.value, 60))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") send();
                }}
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-xl border border-line bg-navy-950/70 px-4 py-3 font-mono text-[clamp(0.85rem,1.05vw,1.1rem)] text-chalk transition-colors duration-200 placeholder:text-dim hover:border-accent/40 focus:border-accent-warm/70 focus:outline-none"
              />
            </div>
          </Reveal>

          <Reveal delay={0.42}>
            <div className="mt-4 flex flex-wrap gap-3">
              <ActionButton variant="accent" icon={Send} onClick={send}>
                Send
              </ActionButton>
              <ActionButton icon={RotateCcw} variant="ghost" onClick={reset}>
                Reset
              </ActionButton>
            </div>
          </Reveal>
        </div>

        <div className="grid min-w-0 gap-4">
          <Reveal delay={0.26}>
            <TerminalSession
              lines={lines}
              playToken={playToken}
              minLines={7}
              placeholder="Press Send and watch the whole turn."
            />
          </Reveal>

          <Reveal delay={0.4}>
            <p className="rounded-2xl border border-accent-warm/25 bg-accent-warm/6 p-3.5 text-[clamp(0.82rem,0.98vw,1.02rem)] leading-relaxed text-mist">
              {FIRST_SESSION.aside}
            </p>
          </Reveal>
        </div>
      </div>
    </PresentationSection>
  );
}
