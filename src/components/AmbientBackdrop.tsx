import { motion, useReducedMotion } from "framer-motion";

/**
 * The fixed canvas everything sits on: two very slow light pools, a faint
 * technical grid, and a vignette. Deliberately low-contrast so projected text
 * stays the brightest thing on screen.
 */
export function AmbientBackdrop() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_-10%,#241f19_0%,#161513_45%,#0f0e0d_100%)]" />

      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(212,162,127,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,162,127,0.05) 1px, transparent 1px)",
          backgroundSize: "clamp(52px, 6vw, 96px) clamp(52px, 6vw, 96px)",
          maskImage:
            "radial-gradient(115% 90% at 50% 25%, #000 20%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(115% 90% at 50% 25%, #000 20%, transparent 78%)",
        }}
      />

      <motion.div
        className="absolute -top-[22%] -start-[12%] h-[62vw] w-[62vw] rounded-full bg-[radial-gradient(circle,rgba(217,119,87,0.20)_0%,transparent_62%)] blur-[40px]"
        animate={reduceMotion ? undefined : { x: [0, 60, 0], y: [0, 42, 0] }}
        transition={{ duration: 46, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -end-[16%] bottom-[-26%] h-[58vw] w-[58vw] rounded-full bg-[radial-gradient(circle,rgba(212,162,127,0.13)_0%,transparent_64%)] blur-[50px]"
        animate={reduceMotion ? undefined : { x: [0, -52, 0], y: [0, -36, 0] }}
        transition={{ duration: 54, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_38%,rgba(15,14,13,0.74)_100%)]" />
    </div>
  );
}
