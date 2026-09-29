import { useState } from 'react'
import { ChevronRight, HandHelping, MapPin } from 'lucide-react'
import type { AppData, Mood } from '../lib/types'
import { BESOINS, MOODS, needMeta, type Besoin } from '../lib/content'
import { addJournal } from '../lib/store'
import { courseStates, cx, greetingMoment, longDate, sameDay, sortCourses, todayId } from '../lib/utils'
import { Card, SectionLabel, ScreenTitle, toast } from '../components/ui'

export interface Actions {
  openEmergency: () => void
  openHelp: () => void
  openShow: (b: Besoin) => void
  goTab: (t: Tab) => void
}
export type Tab = 'today' | 'needs' | 'reperes' | 'me'

export function HelpBanner({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="mt-6 flex w-full items-center gap-3 rounded-xl2 bg-indigo p-4 text-left text-white shadow-lift active:scale-[0.99]">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
        <HandHelping size={22} />
      </span>
      <span className="flex-1">
        <span className="block font-bold">Besoin d’aide ?</span>
        <span className="block text-xs text-white/80">Un adulte peut t’accompagner.</span>
      </span>
      <ChevronRight size={20} />
    </button>
  )
}

/* ============================ Aujourd'hui ============================ */

export function TodayScreen({ data, actions }: { data: AppData; actions: Actions }) {
  const p = data.profile
  const lastMood = [...data.journal].reverse().find((e) => e.kind === 'humeur' && sameDay(e.at))?.mood
  const [mood, setMood] = useState<Mood | undefined>(lastMood)

  const day = todayId()
  const courses = day ? sortCourses(p.schedule[day]) : []
  const states = courseStates(courses, true)
  const upcoming = courses.filter((_, i) => states[i] === 'now' || states[i] === 'next' || states[i] === 'later').slice(0, 2)
  const hasSportToday = courses.some((c, i) => c.sport && states[i] !== 'past')
  const sportTips = p.needs.map((n) => needMeta(n).sportTip).filter(Boolean) as string[]

  const pickMood = (m: Mood) => {
    setMood(m)
    const meta = MOODS.find((x) => x.id === m)!
    addJournal({ kind: 'humeur', mood: m, label: meta.label })
    toast('Merci, c’est noté ' + meta.face)
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lavande to-menthe text-2xl">{p.avatar}</div>
        <button onClick={actions.openHelp} aria-label="Besoin d’aide" className="flex h-11 w-11 items-center justify-center rounded-full border border-bord bg-carte text-indigo">
          <HandHelping size={22} />
        </button>
      </div>

      <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">
        Bonjour {p.firstName} !<br />
        <span className="text-ink/90">Comment se passe {greetingMoment()} ?</span>
      </h1>
      <p className="mt-1 text-sm capitalize text-ink-muted">{longDate()}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {MOODS.map((m) => (
          <button
            key={m.id}
            onClick={() => pickMood(m.id)}
            aria-pressed={mood === m.id}
            className={cx(
              'flex flex-col items-center gap-2 rounded-xl2 py-5 transition active:scale-[0.97]',
              m.bg,
              mood === m.id ? 'ring-2 ' + m.ring : 'ring-0'
            )}
          >
            <span className="text-[42px] leading-none">{m.face}</span>
            <span className="text-sm font-bold">{m.label}</span>
          </button>
        ))}
      </div>

      {(mood === 'moyen' || mood === 'pastop') && (
        <Card className="mt-4 border-lavande bg-lavande-soft">
          <p className="font-bold">Ça arrive, et c’est ok.</p>
          <p className="mt-1 text-sm text-ink-muted">Tu veux faire une pause ou parler à quelqu’un ?</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => actions.goTab('needs')} className="flex-1 rounded-xl bg-carte py-2.5 text-sm font-bold text-indigo">
              Mes besoins
            </button>
            <button onClick={actions.openHelp} className="flex-1 rounded-xl bg-indigo py-2.5 text-sm font-bold text-white">
              Demander de l’aide
            </button>
          </div>
        </Card>
      )}

      {hasSportToday && sportTips.length > 0 && (
        <div className="mt-4 flex gap-3 rounded-xl2 border border-attention bg-attention-soft p-4">
          <span className="text-2xl">🏃</span>
          <div>
            <p className="font-bold">Aujourd’hui tu as sport !</p>
            <ul className="mt-1 space-y-0.5 text-sm text-ink/80">
              {sportTips.map((t) => (
                <li key={t}>{t}.</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {p.needs.length > 0 && (
        <button
          onClick={actions.openEmergency}
          className="mt-4 flex w-full items-center gap-3 rounded-xl2 border border-peche bg-gradient-to-br from-peche-soft to-carte p-4 text-left active:scale-[0.99]"
        >
          <span className="text-2xl">📋</span>
          <span className="flex-1">
            <span className="block font-bold">Ma fiche d’urgence</span>
            <span className="block text-xs text-ink-muted">Accès instantané, même hors-ligne</span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-peche text-white">
            <ChevronRight size={20} />
          </span>
        </button>
      )}

      <SectionLabel>{upcoming.length ? 'À venir aujourd’hui' : 'Aujourd’hui'}</SectionLabel>
      {!day ? (
        <Card>
          <p className="text-sm text-ink-muted">Pas de cours aujourd’hui. Profite de ta journée ✨</p>
        </Card>
      ) : courses.length === 0 ? (
        <Card onClick={() => actions.goTab('reperes')}>
          <p className="font-bold">Ajoute ton emploi du temps</p>
          <p className="mt-1 text-sm text-ink-muted">Lumo te rappellera tes cours et tes moments importants.</p>
        </Card>
      ) : upcoming.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-muted">Les cours sont terminés pour aujourd’hui. Bonne fin de journée !</p>
        </Card>
      ) : (
        <Card className="p-0" onClick={() => actions.goTab('reperes')}>
          {upcoming.map((c, idx) => (
            <div key={c.id} className={cx('flex gap-3 p-4', idx > 0 && 'border-t border-bord')}>
              <div className="w-12 text-sm font-bold text-indigo">{c.start}</div>
              <div className={cx('w-1 rounded-full', c.sport ? 'bg-attention' : 'bg-lavande')} />
              <div className="flex-1">
                <p className="font-bold">
                  {c.subject} {idx === 0 && states[courses.indexOf(c)] === 'now' && <span className="ml-1 rounded-full bg-succes-soft px-2 py-0.5 text-[11px] font-bold text-succes">en cours</span>}
                </p>
                {c.room && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-muted">
                    <MapPin size={12} /> {c.room}
                  </p>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}

      <HelpBanner onClick={actions.openHelp} />
    </div>
  )
}

/* ============================ Mes besoins ============================ */

export function NeedsScreen({ actions }: { actions: Actions }) {
  const choose = (b: Besoin) => {
    addJournal({ kind: 'besoin', label: b.label })
    actions.openShow(b)
  }
  return (
    <div>
      <ScreenTitle title="De quoi as-tu besoin aujourd’hui ?" sub="Choisis, puis montre l’écran à l’adulte. Pas besoin de parler devant la classe." />
      <ul className="space-y-2.5">
        {BESOINS.map((b) => (
          <li key={b.id}>
            <button
              onClick={() => choose(b)}
              className="flex w-full items-center gap-3 rounded-xl2 border border-bord bg-carte p-3.5 text-left shadow-card transition active:scale-[0.99]"
            >
              <span className={cx('flex h-11 w-11 items-center justify-center rounded-full text-xl', b.tint)}>{b.emoji}</span>
              <span className="flex-1 font-bold">{b.label}</span>
              <ChevronRight className="text-ink-muted" size={20} />
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={actions.openHelp}
            className="flex w-full items-center gap-3 rounded-xl2 border border-bord bg-carte p-3.5 text-left shadow-card transition active:scale-[0.99]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-fond text-xl font-bold text-indigo">···</span>
            <span className="flex-1 font-bold">Autre besoin</span>
            <ChevronRight className="text-ink-muted" size={20} />
          </button>
        </li>
      </ul>
      <p className="mt-5 text-center text-xs leading-relaxed text-ink-muted">
        Si tu as un aménagement prévu (PAI, PAP…), tes professeurs sont au courant : Lumo t’aide juste à le demander discrètement.
      </p>
    </div>
  )
}
