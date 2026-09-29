import { useEffect, useState, type ReactNode, type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { cx } from '../lib/utils'

/* ---------- Logo ---------- */

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true">
      <circle cx="246" cy="276" r="178" fill="#6266D9" />
      <circle cx="246" cy="276" r="136" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="24" />
      <path d="M200 186 v122 a26 26 0 0 0 26 26 h78" fill="none" stroke="#fff" strokeWidth="54" strokeLinecap="round" strokeLinejoin="round" />
      <g stroke="#70C9AE" strokeWidth="24" strokeLinecap="round">
        <line x1="372" y1="84" x2="388" y2="50" />
        <line x1="410" y1="124" x2="444" y2="106" />
        <line x1="424" y1="176" x2="460" y2="174" />
      </g>
    </svg>
  )
}

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2" aria-label="Lumo">
      <LogoMark size={size} />
      <span className="font-extrabold tracking-tight text-indigo" style={{ fontSize: size * 0.8 }}>
        lumo
      </span>
    </div>
  )
}

/* ---------- Buttons ---------- */

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'soft'; full?: boolean }

export function Button({ variant = 'primary', full = true, className, ...rest }: BtnProps) {
  const styles = {
    primary: 'bg-indigo text-white shadow-lift active:bg-indigo-dark',
    danger: 'bg-important text-white shadow-[0_12px_30px_rgba(228,119,119,0.35)] active:bg-important-dark',
    soft: 'bg-indigo-soft text-indigo',
    ghost: 'bg-transparent text-indigo'
  }[variant]
  return (
    <button
      className={cx(
        'inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl px-5 text-[15px] font-bold transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none',
        full && 'w-full',
        styles,
        className
      )}
      {...rest}
    />
  )
}

/* ---------- Card ---------- */

export function Card({ className, children, onClick }: { className?: string; children: ReactNode; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={cx('block w-full rounded-xl2 border border-bord bg-carte p-4 text-left shadow-card', onClick && 'transition active:scale-[0.99]', className)}
    >
      {children}
    </Tag>
  )
}

export function IconBubble({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl', className)}>{children}</div>
}

/* ---------- Form fields ---------- */

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  )
}

const inputCls =
  'w-full rounded-2xl border border-bord bg-carte px-4 py-3.5 text-[16px] text-ink placeholder:text-ink-muted/60 outline-none transition focus:border-indigo focus:ring-4 focus:ring-indigo/15'

export const Input = (p: InputHTMLAttributes<HTMLInputElement>) => <input {...p} className={cx(inputCls, p.className)} />
export const TextArea = (p: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea rows={3} {...p} className={cx(inputCls, 'resize-none leading-relaxed', p.className)} />
)

/* ---------- Chip ---------- */

export function Chip({ on, children, onClick }: { on: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cx(
        'rounded-full border px-4 py-2 text-sm font-semibold transition',
        on ? 'border-indigo bg-indigo text-white' : 'border-bord bg-carte text-ink'
      )}
    >
      {children}
    </button>
  )
}

/* ---------- Screen header ---------- */

export function ScreenTitle({ title, sub, right }: { title: string; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">{title}</h1>
        {sub && <div className="mt-1 text-sm text-ink-muted">{sub}</div>}
      </div>
      {right}
    </div>
  )
}

export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-2.5 mt-6 text-[13px] font-bold uppercase tracking-wide text-ink-muted">{children}</h2>
)

/* ---------- Bottom sheet ---------- */

export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <div className={cx('fixed inset-0 z-50', !open && 'pointer-events-none')} aria-hidden={!open}>
      <div className={cx('absolute inset-0 bg-ink/40 transition-opacity', open ? 'opacity-100' : 'opacity-0')} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          'absolute inset-x-0 bottom-0 mx-auto max-h-[88dvh] max-w-lg overflow-y-auto rounded-t-[28px] bg-carte px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-2 transition-transform duration-300',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="sticky top-0 z-10 -mx-5 flex items-center justify-between bg-carte px-5 pb-2 pt-2">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-bord" />
          <button onClick={onClose} aria-label="Fermer" className="absolute right-4 top-2 rounded-full p-2 text-ink-muted">
            <X size={20} />
          </button>
        </div>
        {title && <h2 className="mb-3 mt-1 pr-8 text-xl font-extrabold">{title}</h2>}
        {open && children}
      </div>
    </div>
  )
}

/* ---------- Toast ---------- */

let pushToast: (m: string) => void = () => {}
export const toast = (m: string) => pushToast(m)

export function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null)
  useEffect(() => {
    let t: number
    pushToast = (m) => {
      setMsg(m)
      window.clearTimeout(t)
      t = window.setTimeout(() => setMsg(null), 2200)
    }
  }, [])
  return (
    <div
      role="status"
      aria-live="polite"
      className={cx(
        'pointer-events-none fixed left-1/2 top-[calc(16px+env(safe-area-inset-top))] z-[70] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition',
        msg ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
      )}
    >
      {msg}
    </div>
  )
}
