import { useMemo, useState } from 'react'
import { ChevronLeft, ShieldCheck, Smartphone } from 'lucide-react'
import type { Profile } from '../lib/types'
import { emptyProfile, requestPersistence, setData } from '../lib/store'
import { needMeta } from '../lib/content'
import { AvatarPicker, ContactsEditor, NeedDetailForm, NeedsPicker, ScheduleEditor } from '../components/editors'
import { Button, Field, Input, LogoMark, Logo } from '../components/ui'

type Step = { id: string; title?: string; sub?: string }

export function WelcomeArt() {
  return (
    <svg viewBox="0 0 320 240" className="mx-auto w-full max-w-[320px]" aria-hidden="true">
      <ellipse cx="160" cy="214" rx="120" ry="14" fill="#E5E6F0" />
      <path d="M58 150c-22-50 18-104 70-96 22-38 92-40 112 6 44 4 60 60 30 92-10 40-66 54-100 34-40 26-102 8-112-36z" fill="#F1F0FD" />
      <circle cx="78" cy="70" r="26" fill="#E6F6F0" />
      <circle cx="262" cy="178" r="22" fill="#FDF1E7" />
      <circle cx="262" cy="56" r="10" fill="#A9A7F4" />
      <g transform="translate(92 54) scale(0.27)">
        <circle cx="246" cy="276" r="178" fill="#6266D9" />
        <circle cx="246" cy="276" r="136" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="24" />
        <path d="M200 186 v122 a26 26 0 0 0 26 26 h78" fill="none" stroke="#fff" strokeWidth="54" strokeLinecap="round" strokeLinejoin="round" />
        <g stroke="#70C9AE" strokeWidth="24" strokeLinecap="round">
          <line x1="372" y1="84" x2="388" y2="50" />
          <line x1="410" y1="124" x2="444" y2="106" />
          <line x1="424" y1="176" x2="460" y2="174" />
        </g>
      </g>
      <g fontSize="26">
        <text x="40" y="128">📅</text>
        <text x="230" y="120">💬</text>
        <text x="206" y="206">🏥</text>
        <text x="52" y="196">☕</text>
      </g>
    </svg>
  )
}

export default function Onboarding() {
  const [p, setP] = useState<Profile>(emptyProfile())
  const [i, setI] = useState(0)
  const patch = (x: Partial<Profile>) => setP((prev) => ({ ...prev, ...x }))

  const steps: Step[] = useMemo(
    () => [
      { id: 'welcome' },
      { id: 'identity', title: 'Faisons connaissance', sub: 'Ces infos restent sur ton téléphone.' },
      { id: 'needs', title: 'Ta santé au collège', sub: 'Coche ce qui te concerne. Tu pourras changer plus tard.' },
      ...p.needs.map((n) => ({
        id: 'need:' + n,
        title: `${needMeta(n).emoji} ${needMeta(n).label}`,
        sub: 'Si tu as un PAI, prends-le pour t’aider. Tout est modifiable.'
      })),
      { id: 'contacts', title: 'Tes contacts utiles', sub: 'Les personnes à appeler en un seul appui.' },
      { id: 'schedule', title: 'Ton emploi du temps', sub: 'Pour que Lumo te rappelle les bons moments. Tu peux le faire plus tard.' },
      { id: 'done' }
    ],
    [p.needs]
  )

  const step = steps[Math.min(i, steps.length - 1)]
  const progress = i / (steps.length - 1)
  const next = () => setI((x) => Math.min(x + 1, steps.length - 1))
  const back = () => setI((x) => Math.max(x - 1, 0))

  const finish = () => {
    setData((d) => ({ ...d, onboarded: true, profile: p }))
    requestPersistence()
  }

  /* ---------- Welcome ---------- */
  if (step.id === 'welcome') {
    return (
      <div className="flex min-h-[100dvh] flex-col px-6 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(28px+env(safe-area-inset-top))]">
        <div className="flex justify-center">
          <Logo size={40} />
        </div>
        <div className="flex flex-1 flex-col justify-center py-6">
          <WelcomeArt />
          <h1 className="mt-6 text-[28px] font-extrabold leading-tight tracking-tight">
            Un point de repère pour mieux vivre ta journée au collège.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
            Ta fiche d’urgence, tes contacts, ton emploi du temps et un moyen discret de demander de l’aide. Tout au même endroit.
          </p>
        </div>
        <Button onClick={next}>C’est parti !</Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
          <ShieldCheck size={14} /> Pas de compte, tes données restent sur ce téléphone
        </p>
      </div>
    )
  }

  /* ---------- Done ---------- */
  if (step.id === 'done') {
    return (
      <div className="flex min-h-[100dvh] flex-col px-6 pb-[calc(24px+env(safe-area-inset-bottom))] pt-[calc(40px+env(safe-area-inset-top))]">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] bg-succes-soft text-5xl">🎉</div>
          <h1 className="text-[28px] font-extrabold tracking-tight">C’est prêt, {p.firstName} !</h1>
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-muted">Lumo est configuré. Deux conseils avant de commencer :</p>
          <div className="mt-6 w-full max-w-sm space-y-3 text-left">
            {p.needs.length > 0 && (
              <div className="flex gap-3 rounded-xl2 bg-indigo-soft p-4">
                <ShieldCheck className="shrink-0 text-indigo" />
                <p className="text-sm leading-relaxed">
                  <b>Montre ta fiche d’urgence à l’infirmière</b> pour qu’elle vérifie qu’elle correspond bien à ton PAI.
                </p>
              </div>
            )}
            <div className="flex gap-3 rounded-xl2 bg-menthe-soft p-4">
              <Smartphone className="shrink-0 text-succes" />
              <p className="text-sm leading-relaxed">
                <b>Ajoute Lumo à ton écran d’accueil</b> pour l’ouvrir comme une appli, même sans internet. On t’explique comment dans l’onglet « Moi ».
              </p>
            </div>
          </div>
        </div>
        <Button onClick={finish}>Découvrir Lumo</Button>
      </div>
    )
  }

  /* ---------- Form steps ---------- */
  const needId = step.id.startsWith('need:') ? (step.id.slice(5) as Profile['needs'][number]) : null
  const canNext = step.id === 'identity' ? p.firstName.trim().length > 0 : step.id === 'needs' ? true : true
  const skippable = step.id === 'contacts' || step.id === 'schedule' || !!needId

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-10 bg-fond/95 px-5 pb-3 pt-[calc(12px+env(safe-area-inset-top))] backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={back} aria-label="Retour" className="-ml-2 rounded-full p-2 text-ink">
            <ChevronLeft />
          </button>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-bord" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-indigo transition-all duration-300" style={{ width: `${progress * 100}%` }} />
          </div>
          <LogoMark size={28} />
        </div>
      </header>

      <main className="flex-1 px-5 pb-6 pt-3">
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">{step.title}</h1>
        {step.sub && <p className="mb-6 mt-1.5 text-sm leading-relaxed text-ink-muted">{step.sub}</p>}

        {step.id === 'identity' && (
          <>
            <Field label="Ton prénom">
              <Input value={p.firstName} onChange={(e) => patch({ firstName: e.target.value })} placeholder="Ex. Inès" autoComplete="given-name" autoFocus />
            </Field>
            <Field label="Ta classe">
              <Input value={p.className} onChange={(e) => patch({ className: e.target.value })} placeholder="Ex. 4e B" />
            </Field>
            <p className="mb-2 text-sm font-semibold">Choisis ton avatar</p>
            <AvatarPicker value={p.avatar} onChange={(avatar) => patch({ avatar })} />
          </>
        )}

        {step.id === 'needs' && (
          <>
            <NeedsPicker value={p.needs} onChange={(needs) => patch({ needs })} />
            <p className="mt-4 text-center text-xs text-ink-muted">Rien ne te concerne ? Continue simplement, Lumo reste utile pour ta journée.</p>
          </>
        )}

        {needId && (
          <NeedDetailForm need={needId} value={p.details[needId]} onChange={(d) => patch({ details: { ...p.details, [needId]: d } })} />
        )}

        {step.id === 'contacts' && <ContactsEditor value={p.contacts} onChange={(contacts) => patch({ contacts })} />}

        {step.id === 'schedule' && <ScheduleEditor value={p.schedule} onChange={(schedule) => patch({ schedule })} />}
      </main>

      <footer className="sticky bottom-0 space-y-1 bg-gradient-to-t from-fond via-fond to-fond/0 px-5 pb-[calc(16px+env(safe-area-inset-bottom))] pt-4">
        <Button onClick={next} disabled={!canNext}>
          Continuer
        </Button>
        {skippable && (
          <Button variant="ghost" onClick={next}>
            Je le ferai plus tard
          </Button>
        )}
      </footer>
    </div>
  )
}
