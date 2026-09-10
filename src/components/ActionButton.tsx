import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

type NativeAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onDrag" | "onDragStart" | "onDragEnd"
>;

interface ActionButtonBaseProps {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: Variant;
  size?: Size;
  /** Renders the button in its "on" state (used by toggles). */
  active?: boolean;
  /** Extra classes for the icon, e.g. a spin while running. */
  iconClassName?: string;
}

type ActionButtonProps = ActionButtonBaseProps &
  (
    | ({ href?: undefined } & NativeButtonProps)
    // Passing `href` renders a real <a> instead of a <button> firing
    // window.open(): a genuine link works under sandboxes (like the
    // published-artifact preview) that block script-triggered popups, still
    // supports ctrl/cmd-click and "open in new tab", and is what a link to
    // another page should be semantically anyway.
    | ({ href: string } & NativeAnchorProps)
  );

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-accent text-[#1a0e07] hover:bg-accent-bright border border-accent/60",
  accent:
    "bg-accent-warm text-[#1a0e07] hover:bg-accent-warm-bright border border-accent-warm/60",
  outline:
    "border border-line bg-navy-900/60 text-chalk hover:border-accent/55 hover:bg-navy-850",
  ghost: "border border-transparent text-mist hover:text-chalk hover:bg-white/6",
};

const SIZE: Record<Size, string> = {
  sm: "gap-2 rounded-lg px-3.5 py-2 text-[0.85rem]",
  md: "gap-2.5 rounded-xl px-5 py-3 text-[clamp(0.9rem,1.05vw,1.05rem)]",
  lg: "gap-3 rounded-xl px-7 py-4 text-[clamp(1rem,1.2vw,1.2rem)]",
};

const ICON_SIZE: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-[1.15em] w-[1.15em]",
  lg: "h-[1.2em] w-[1.2em]",
};

/**
 * The single button primitive used across the deck.
 * Targets stay large enough for touch and for a presenter clicking quickly.
 */
export function ActionButton({
  children,
  icon: Icon,
  variant = "outline",
  size = "md",
  active = false,
  iconClassName,
  className,
  ...rest
}: ActionButtonProps) {
  const reduceMotion = useReducedMotion();

  const sharedClassName = cn(
    "inline-flex cursor-pointer items-center justify-center font-medium transition-colors duration-200 select-none",
    "disabled:cursor-not-allowed disabled:opacity-45",
    VARIANT[variant],
    SIZE[size],
    active && "border-accent-warm/60 bg-accent-warm/12 text-accent-warm",
    className,
  );
  const iconEl = Icon ? (
    <Icon aria-hidden="true" className={cn(ICON_SIZE[size], iconClassName)} />
  ) : null;
  const motionProps = {
    whileHover: reduceMotion ? undefined : { y: -2 },
    whileTap: reduceMotion ? undefined : { scale: 0.97 },
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  };

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest as { href: string } & NativeAnchorProps;
    return (
      <motion.a href={href} className={sharedClassName} {...motionProps} {...anchorRest}>
        {iconEl}
        {children}
      </motion.a>
    );
  }

  const { type = "button", disabled, ...buttonRest } = rest as NativeButtonProps;
  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={reduceMotion || disabled ? undefined : { y: -2 }}
      whileTap={reduceMotion || disabled ? undefined : { scale: 0.97 }}
      transition={motionProps.transition}
      className={sharedClassName}
      {...buttonRest}
    >
      {iconEl}
      {children}
    </motion.button>
  );
}
