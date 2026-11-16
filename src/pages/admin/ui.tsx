import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export const card =
  "rounded-[16px] border border-[color:var(--bjork-border)] bg-[var(--bjork-surface)] shadow-[var(--bjork-shadow-surface)]";

export const field =
  "h-9 w-full rounded-[9px] border border-[color:var(--bjork-border)] bg-[var(--bjork-field)] px-3 text-[13px] text-[color:var(--bjork-text)] outline-none transition-[border-color,box-shadow] placeholder:text-[color:var(--bjork-text-soft)] focus-visible:border-[color:var(--bjork-accent)] focus-visible:ring-[3px] focus-visible:ring-[color:var(--bjork-accent-soft)] disabled:opacity-50";

export const btn = {
  primary:
    "inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[9px] bg-[var(--bjork-accent)] px-4 text-[13px] font-semibold text-[color:var(--bjork-accent-foreground)] transition-colors hover:bg-[var(--bjork-accent-hover)] disabled:pointer-events-none disabled:opacity-50",
  ghost:
    "inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[9px] border border-[color:var(--bjork-border)] bg-[var(--bjork-surface)] px-3.5 text-[13px] font-medium text-[color:var(--bjork-text)] transition-colors hover:bg-[var(--bjork-surface-hover)] disabled:pointer-events-none disabled:opacity-50",
  icon:
    "inline-grid size-8 cursor-pointer place-items-center rounded-[8px] border border-[color:var(--bjork-border)] text-[color:var(--bjork-text-muted)] transition-colors hover:bg-[var(--bjork-surface-hover)] hover:text-[color:var(--bjork-text)] disabled:pointer-events-none disabled:opacity-30 [&>svg]:size-[15px]",
};

export function Panel({ title, hint, action, children, className }: { title?: string; hint?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn(card, "p-4 @3xl:p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="text-[13.5px] font-semibold">{title}</h2>}
            {hint && <p className="mt-1 text-[12.5px] text-[color:var(--bjork-text-muted)]">{hint}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Label({ children, text, className }: { children: ReactNode; text: string; className?: string }) {
  return (
    <label className={cn("grid gap-1.5 text-[12px] font-medium text-[color:var(--bjork-text-muted)]", className)}>
      {text}
      {children}
    </label>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[22px] w-10 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[color:var(--bjork-accent)] focus-visible:outline-none",
        checked ? "bg-[var(--bjork-accent)]" : "bg-[var(--bjork-surface-active)] ring-1 ring-inset ring-[color:var(--bjork-border-strong)]",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-[3px] size-4 rounded-full transition-transform duration-200",
          checked ? "translate-x-[21px] bg-[color:var(--bjork-accent-foreground)]" : "translate-x-[3px] bg-[color:var(--bjork-text-muted)]",
        )}
      />
    </button>
  );
}

export function Chip({ tone = "muted", children }: { tone?: "ok" | "warn" | "bad" | "muted" | "accent"; children: ReactNode }) {
  const tones = {
    ok: "bg-[var(--blk-success-soft)] text-[color:var(--blk-success)]",
    warn: "bg-[var(--blk-warning-soft)] text-[color:var(--blk-warning)]",
    bad: "bg-[var(--blk-error-soft)] text-[color:var(--blk-error)]",
    muted: "bg-[var(--bjork-surface-active)] text-[color:var(--bjork-text-muted)]",
    accent: "bg-[var(--bjork-accent-soft)] text-[color:var(--blk-accent-ink)]",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2 py-[3px] text-[11px] font-medium", tones[tone])}>{children}</span>;
}

/** Aviso rápido no canto da tela. */
export function useToast() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(""), 2200);
    return () => window.clearTimeout(t);
  }, [msg]);
  const node = (
    <div
      role="status"
      className={cn(
        "pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-[var(--bjork-accent)] px-5 py-2.5 text-[13px] font-semibold text-[color:var(--bjork-accent-foreground)] shadow-[0_0_30px_rgba(166,255,61,0.35)] transition-all duration-300",
        msg ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
      )}
    >
      {msg}
    </div>
  );
  return { toast: setMsg, node };
}
