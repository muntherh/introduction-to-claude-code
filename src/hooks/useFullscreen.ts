import { useCallback, useEffect, useState } from "react";

/** Fullscreen toggle for the whole document, with browser state kept in sync. */
export function useFullscreen(): {
  isFullscreen: boolean;
  toggle: () => void;
  supported: boolean;
} {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(
      typeof document !== "undefined" &&
        Boolean(document.documentElement.requestFullscreen),
    );

    function onChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", onChange);
    onChange();
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = useCallback(() => {
    if (typeof document === "undefined") return;
    // Some browsers reject the promise (iOS Safari, embedded frames); the
    // deck stays perfectly usable windowed, so we just ignore the failure.
    if (document.fullscreenElement) {
      void document.exitFullscreen?.().catch(() => undefined);
    } else {
      void document.documentElement.requestFullscreen?.().catch(
        () => undefined,
      );
    }
  }, []);

  return { isFullscreen, toggle, supported };
}
