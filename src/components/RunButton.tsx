import { Loader2, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActionButton } from "@/components/ActionButton";

interface RunButtonProps {
  onRun: () => void;
  label?: string;
  runningLabel?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * "Run Code" with a short, fixed pause before the output lands.
 *
 * Nothing is actually executed — the delay only makes the cause-and-effect
 * readable from the back of a room. It is a constant, so a live demo behaves
 * identically every time.
 */
export function RunButton({
  onRun,
  label = "Run Code",
  runningLabel = "Running",
  className,
  disabled,
}: RunButtonProps) {
  const [isRunning, setIsRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleClick = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    timer.current = setTimeout(() => {
      setIsRunning(false);
      onRun();
    }, 340);
  }, [isRunning, onRun]);

  return (
    <ActionButton
      variant="primary"
      icon={isRunning ? Loader2 : Play}
      onClick={handleClick}
      disabled={disabled}
      iconClassName={isRunning ? "animate-spin" : undefined}
      aria-live="off"
      className={className}
    >
      <span className={isRunning ? "animate-pulse" : undefined}>
        {isRunning ? runningLabel : label}
      </span>
    </ActionButton>
  );
}
