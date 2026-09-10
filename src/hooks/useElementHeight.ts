import { useEffect, useState, type RefObject } from "react";

/**
 * Live height of an element, kept current through resizes and font loads.
 * Used to map window scroll onto the hero's own length.
 */
export function useElementHeight(
  ref: RefObject<HTMLElement | null>,
  fallback = 1,
): number {
  const [height, setHeight] = useState(fallback);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const measure = () => setHeight(node.offsetHeight || fallback);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, fallback]);

  return height;
}
