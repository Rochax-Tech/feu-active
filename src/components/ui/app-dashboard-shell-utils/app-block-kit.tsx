"use client";

/**
 * Utilitários do AppDashboardShell.
 * O pacote original não incluía este arquivo, então ele foi escrito aqui com a API que o dashboard consome.
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";

export type AppBlockTheme = "light" | "dark" | "auto";

/** Classe raiz do bloco: vira container para as variantes @container do Tailwind. */
export const blockRoot =
  "@container/root relative flex w-full overflow-hidden bg-[var(--bjork-bg)] text-[color:var(--bjork-text)] font-sans antialiased";

export const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--bjork-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bjork-ring-offset)]";

/** `auto` herda o tema do documento; os outros fixam o esquema de cores do bloco. */
export function useAppBlockTheme(theme: AppBlockTheme = "auto") {
  const style: CSSProperties = theme === "auto" ? {} : { colorScheme: theme };
  return { style, theme };
}

export function useBlockReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

export function useElementWidth(ref: RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (typeof w === "number") setWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

export function useAnnouncer() {
  const [message, setMessage] = useState("");
  const announce = useCallback((text: string) => {
    setMessage("");
    window.setTimeout(() => setMessage(text), 30);
  }, []);
  const region = (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
  return { announce, region };
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: "sm" | "md";
  pressed?: boolean;
}

export function IconButton({
  label,
  size = "md",
  pressed,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn(
        "inline-grid shrink-0 cursor-pointer place-items-center rounded-[9px] text-[color:var(--bjork-text-muted)] transition-colors duration-150 hover:bg-[var(--bjork-surface-hover)] hover:text-[color:var(--bjork-text)] disabled:pointer-events-none disabled:opacity-40 [&>svg]:size-[17px]",
        size === "sm" ? "size-7 [&>svg]:size-[15px]" : "size-8",
        focusRing,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface BlockButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
}

export function BlockButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: BlockButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[9px] font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-[14px]",
        size === "sm" ? "h-8 px-3 text-[12.5px]" : "h-9 px-4 text-[13.5px]",
        variant === "primary"
          ? "bg-[var(--bjork-accent)] text-[color:var(--bjork-accent-foreground)] hover:bg-[var(--bjork-accent-hover)]"
          : "border border-[color:var(--bjork-border)] bg-[var(--bjork-surface)] text-[color:var(--bjork-text)] shadow-[var(--bjork-shadow-soft)] hover:bg-[var(--bjork-surface-hover)]",
        focusRing,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Kbd({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-grid h-5 min-w-5 place-items-center rounded-[5px] border border-[color:var(--bjork-border)] bg-[var(--bjork-surface)] px-1 font-mono text-[10.5px] text-[color:var(--bjork-text-muted)]",
        className,
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

const AVATAR_HUES = [24, 96, 150, 190, 262, 330];

export function InitialsAvatar({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  const hue = AVATAR_HUES[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_HUES.length];
  return (
    <span
      aria-hidden="true"
      className="inline-grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(135deg, hsl(${hue} 55% 42%), hsl(${hue} 55% 30%))`,
      }}
    >
      {initials}
    </span>
  );
}

interface BlockDrawerProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}

/** Gaveta lateral acessível: Esc fecha, foco entra no painel e volta ao fechar. */
export function BlockDrawer({ open, onClose, label, children }: BlockDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);
  return (
    <div className={cn("absolute inset-0 z-40", !open && "pointer-events-none")} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={cn(
          "absolute inset-y-0 left-0 flex w-[280px] max-w-[85%] flex-col bg-[var(--bjork-panel)] shadow-[var(--bjork-shadow-menu)] outline-none transition-transform duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {children}
      </div>
    </div>
  );
}
