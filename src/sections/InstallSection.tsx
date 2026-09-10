import { CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { ActionButton } from "@/components/ActionButton";
import { OutputPanel } from "@/components/OutputPanel";
import {
  PresentationSection,
  type SectionProps,
} from "@/components/PresentationSection";
import { Reveal } from "@/components/Reveal";
import { RunButton } from "@/components/RunButton";
import { INSTALL } from "@/data/lesson";
import { cn } from "@/lib/cn";

const STEPS = INSTALL.steps;

/**
 * Slide 08 — the hinge of the deck: theory stops, hands start.
 *
 * One step at a time on purpose. A room installing three things at once
 * splits into people who are done and people who are lost, and the presenter
 * cannot see which is which.
 *
 * The commands are plain bordered rows rather than full CodeBlock windows:
 * three stacked window frames do not fit above the fold at 1280×720, and a
 * presenter should never have to scroll a slide while the room is typing.
 */
export function InstallSection({ index, registerRef }: SectionProps) {
  const [done, setDone] = useState(0);

  // OutputPanel draws its own ">" prompt on every line, so the command needs
  // no "$" of its own — what it needs is for its response to be indented
  // under it, or the two read as one long list of commands.
  const output = STEPS.slice(0, done).flatMap((step) => [
    step.command,
    ...step.output.map((line) => `  ${line}`),
  ]);

  return (
    <PresentationSection
      index={index}
      registerRef={registerRef}
      eyebrow={INSTALL.eyebrow}
      title={INSTALL.title}
      lead={INSTALL.lead}
      width="wide"
    >
      <div className="grid items-start gap-5 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <ol className="grid min-w-0 gap-2.5">
          {STEPS.map((step, stepIndex) => {
            const isDone = stepIndex < done;
            const isCurrent = stepIndex === done;

            return (
              <Reveal key={step.id} delay={0.18 + stepIndex * 0.07}>
                <li
                  className={cn(
                    "rounded-xl border px-4 py-3 transition-colors duration-300",
                    isCurrent
                      ? "border-accent-warm/55 bg-accent-warm/6"
                      : isDone
                        ? "border-ok/35 bg-ok/6"
                        : "border-line bg-navy-900/45",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p
                      className={cn(
                        "flex items-center gap-2 text-[clamp(0.82rem,1vw,1.05rem)] font-medium",
                        isDone ? "text-ok-bright" : isCurrent ? "text-chalk" : "text-dim",
                      )}
                    >
                      {isDone ? (
                        <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0" />
                      ) : null}
                      {step.label}
                    </p>

                    {isCurrent ? (
                      <RunButton
                        onRun={() => setDone(stepIndex + 1)}
                        label="Run This Line"
                        runningLabel="Running"
                      />
                    ) : null}
                  </div>

                  <code className="mt-2 block overflow-x-auto rounded-lg border border-line bg-navy-950/80 px-3 py-2 font-mono text-[clamp(0.78rem,0.95vw,1rem)] whitespace-nowrap text-chalk">
                    {step.command}
                  </code>
                </li>
              </Reveal>
            );
          })}

          <Reveal delay={0.42}>
            <li className="mt-1 text-[clamp(0.8rem,0.95vw,1rem)] leading-relaxed text-dim">
              {INSTALL.requirement}
            </li>
          </Reveal>
        </ol>

        <div className="grid min-w-0 gap-3">
          <Reveal delay={0.26}>
            <OutputPanel
              lines={output}
              title="terminal"
              minLines={7}
              size="sm"
              placeholder="Run the first line to see what comes back."
            />
          </Reveal>

          <Reveal delay={0.34}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-[38ch] text-[clamp(0.8rem,0.95vw,1rem)] leading-relaxed text-mist">
                {INSTALL.exitHint}
              </p>

              {done > 0 ? (
                <ActionButton
                  icon={RotateCcw}
                  variant="ghost"
                  onClick={() => setDone(0)}
                >
                  Start Over
                </ActionButton>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </PresentationSection>
  );
}
