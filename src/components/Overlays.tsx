import type { ReactNode } from 'react'
import { ChevronRight, MessageSquare, Phone, X } from 'lucide-react'
import type { AppData, ContactRole } from '../lib/types'
import { EMERGENCY_NUMBERS, needMeta, roleMeta, type Besoin } from '../lib/content'
import { cx, formatPhone, smsHref, telHref } from '../lib/utils'
import { Button } from './ui'

function FullScreen({ children, tone = 'danger', onClose, top }: { children: ReactNode; tone?: 'danger' | 'indigo'; onClose: () => void; top: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-carte" role="dialog" aria-modal="true">
      <div
        className={cx(
          'flex items-center gap-3 px-4 pb-3 pt-[calc(12px+env(safe-area-inset-top))] text-white',
          tone === 'danger' ? 'bg-important' : 'bg-indigo'
        )}
      >
        {top}
        <button onClick={onClose} aria-label="Fermer" className="ml-auto rounded-full bg-white/15 p-2">
          <X size={22} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-5 pb-[calc(28px+env(safe-area-inset-bottom))] pt-5">{children}</div>
      </div>
    </div>
  )
}

/* ====================== Fiche d'urgence ====================== */

export function EmergencyScreen({ data, onClose }: { data: AppData; onClose: () => void }) {
  const p = data.profile
  const order: ContactRole[] = ['infirmiere', 'parent', 'cpe', 'referent', 'medecin', 'autre']
  const contacts = [...p.contacts].sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role))
  const allergy = p.details.allergie?.extra

  return (
    <FullScreen
      onClose={onClose}
      top={
        <a href="tel:15" className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2.5 text-sm font-bold">
          <Phone size={17} /> Appeler le 15
        </a>
      }
    >
      <p className="text-xs font-bold uppercase tracking-wide text-important">Fiche d’urgence · à montrer à un adulte</p>
      <h1 className="mt-1 text-[28px] font-extrabold leading-tight tracking-tight">
        {p.avatar} {p.firstName || 'Élève'}
      </h1>
      {p.className && <p className="text-sm text-ink-muted">Classe de {p.className}</p>}

      {allergy && (
        <div className="mt-4 rounded-2xl border-2 border-important bg-important-soft p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-important-dark">Allergie</p>
          <p className="mt-1 text-lg font-extrabold">{allergy}</p>
        </div>
      )}

      {p.needs.length === 0 && (
        <p className="mt-5 rounded-2xl bg-fond p-4 text-sm text-ink-muted">Aucun besoin de santé particulier n’a été renseigné.</p>
      )}

      {p.needs.map((n) => {
        const m = needMeta(n)
        const d = p.details[n]
        return (
          <section key={n} className="mt-5 rounded-xl2 border border-bord p-4">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <span className="text-2xl">{m.emoji}</span> {n === 'autre' && d?.extra ? d.extra : m.label}
            </h2>
            {d?.whatToDo ? (
              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Que faire</p>
                <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed">{d.whatToDo}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">Conduite à tenir : voir le PAI à l’infirmerie.</p>
            )}
            {(d?.treatment || d?.location) && (
              <dl className="mt-3 grid gap-2 text-sm">
                {d?.treatment && (
                  <div className="rounded-xl bg-fond p-3">
                    <dt className="text-xs font-bold text-ink-muted">Traitement</dt>
                    <dd className="font-semibold">{d.treatment}</dd>
                  </div>
                )}
                {d?.location && (
                  <div className="rounded-xl bg-fond p-3">
                    <dt className="text-xs font-bold text-ink-muted">Où le trouver</dt>
                    <dd className="font-semibold">{d.location}</dd>
                  </div>
                )}
              </dl>
            )}
          </section>
        )
      })}

      <h2 className="mb-2 mt-7 text-[13px] font-bold uppercase tracking-wide text-ink-muted">Personnes à prévenir</h2>
      {contacts.length === 0 ? (
        <p className="rounded-2xl bg-fond p-4 text-sm text-ink-muted">Aucun contact enregistré. Ajoute-les dans l’onglet « Moi ».</p>
      ) : (
        <ul className="space-y-2">
          {contacts.map((c) => (
            <li key={c.id}>
              <a href={telHref(c.phone)} className="flex items-center gap-3 rounded-2xl border border-bord p-3 active:bg-fond">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-soft text-lg">{roleMeta(c.role).emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold">{c.name}</span>
                  <span className="block text-xs text-ink-muted">
                    {roleMeta(c.role).label} · {formatPhone(c.phone)}
                  </span>
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-succes text-white">
                  <Phone size={18} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 grid grid-cols-3 gap-2">
        {EMERGENCY_NUMBERS.map((e) => (
          <a
            key={e.number}
            href={e.sms ? smsHref(e.number) : telHref(e.number)}
            className="rounded-2xl bg-important-soft p-3 text-center active:scale-[0.98]"
          >
            <span className="block text-2xl font-extrabold text-important-dark">{e.number}</span>
            <span className="block text-xs font-bold">{e.label}</span>
            <span className="block text-[10px] leading-tight text-ink-muted">{e.sub}</span>
          </a>
        ))}
      </div>

      <p className="mt-6 border-t border-dashed border-bord pt-3 text-xs text-ink-muted">
        Disponible hors-ligne · mise à jour le {new Date(data.updatedAt).toLocaleDateString('fr-FR')} · le PAI signé fait référence.
      </p>
    </FullScreen>
  )
}

/* ====================== Besoin d'aide ====================== */

export function HelpScreen({ data, onClose, onOpenEmergency }: { data: AppData; onClose: () => void; onOpenEmergency: () => void }) {
  const rows: { role: ContactRole; sub: string }[] = [
    { role: 'cpe', sub: 'Un CPE peut t’aider.' },
    { role: 'infirmiere', sub: 'Pour un souci de santé.' },
    { role: 'referent', sub: 'Pour un aménagement.' },
    { role: 'parent', sub: 'Tes parents ou responsables.' },
    { role: 'autre', sub: 'Une personne de confiance.' }
  ]
  const tints: Record<string, string> = {
    cpe: 'bg-info-soft',
    infirmiere: 'bg-important-soft',
    referent: 'bg-lavande-soft',
    parent: 'bg-peche-soft',
    autre: 'bg-menthe-soft'
  }

  return (
    <FullScreen tone="indigo" onClose={onClose} top={<span className="text-base font-bold">Besoin d’aide ?</span>}>
      <p className="mb-5 text-[15px] leading-relaxed text-ink-muted">
        Tu peux toujours demander de l’aide à un adulte de ton établissement. Appuie sur une personne pour l’appeler.
      </p>
      <ul className="space-y-2.5">
        {rows.map(({ role, sub }) => {
          const list = data.profile.contacts.filter((c) => c.role === role)
          const meta = roleMeta(role)
          if (list.length === 0)
            return (
              <li key={role} className="flex items-center gap-3 rounded-xl2 border border-dashed border-bord p-3.5 opacity-70">
                <span className={cx('flex h-11 w-11 items-center justify-center rounded-full text-xl', tints[role])}>{meta.emoji}</span>
                <span className="flex-1">
                  <span className="block font-bold">{meta.label}</span>
                  <span className="block text-xs text-ink-muted">Pas encore de numéro · à ajouter dans « Moi »</span>
                </span>
              </li>
            )
          return list.map((c) => (
            <li key={c.id}>
              <a href={telHref(c.phone)} className="flex items-center gap-3 rounded-xl2 border border-bord bg-carte p-3.5 shadow-card active:scale-[0.99]">
                <span className={cx('flex h-11 w-11 items-center justify-center rounded-full text-xl', tints[role])}>{meta.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold">{c.name}</span>
                  <span className="block text-xs text-ink-muted">{sub}</span>
                </span>
                <ChevronRight className="text-ink-muted" size={20} />
              </a>
            </li>
          ))
        })}
      </ul>

      <button onClick={onOpenEmergency} className="mt-5 flex w-full items-center gap-3 rounded-xl2 bg-fond p-4 text-left">
        <span className="text-2xl">📋</span>
        <span className="flex-1">
          <span className="block font-bold">Ma fiche d’urgence</span>
          <span className="block text-xs text-ink-muted">À montrer à un adulte si tu ne te sens pas bien</span>
        </span>
        <ChevronRight className="text-ink-muted" size={20} />
      </button>

      <a href="tel:15" className="mt-6 block">
        <Button variant="danger" tabIndex={-1}>
          <Phone size={20} /> Appeler en cas d’urgence (15)
        </Button>
      </a>
      <a href="sms:114" className="mt-2 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-ink-muted">
        <MessageSquare size={16} /> Tu ne peux pas parler ? SMS au 114
      </a>
    </FullScreen>
  )
}

/* ====================== Écran à montrer ====================== */

export function ShowScreen({ besoin, firstName, className, onClose }: { besoin: Besoin; firstName: string; className: string; onClose: () => void }) {
  const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return (
    <FullScreen tone="indigo" onClose={onClose} top={<span className="text-base font-bold">À montrer à l’adulte</span>}>
      <div className={cx('mt-4 rounded-[28px] p-7 text-center', besoin.tint)}>
        <div className="text-6xl">{besoin.emoji}</div>
        <p className="mt-5 text-[26px] font-extrabold leading-snug tracking-tight">
          {firstName || 'Cet élève'}
          {className && <span className="font-semibold text-ink-muted"> ({className})</span>} {besoin.showText}.
        </p>
        <p className="mt-4 text-sm font-semibold text-ink-muted">Demande faite à {time} via Lumo</p>
      </div>
      <p className="mt-6 text-center text-sm leading-relaxed text-ink-muted">
        Tourne ton téléphone vers ton professeur ou l’adulte présent. Pas besoin d’expliquer à voix haute.
      </p>
      <div className="mt-6">
        <Button onClick={onClose}>C’est bon, merci</Button>
      </div>
    </FullScreen>
  )
}
