import { useState } from 'react'
import { Check, Pencil, CalendarDays } from 'lucide-react'
import type { AppData, Day } from '../lib/types'
import { DAYS, LEARN, MOODS, needMeta, type LearnCard, type LearnModule } from '../lib/content'
import { addJournal, markLearned, updateProfile } from '../lib/store'
import { courseStates, cx, longDate, shortDateTime, sortCourses, todayId } from '../lib/utils'
import { ScheduleEditor } from '../components/editors'
import { Button, Card, SectionLabel, Sheet, TextArea, toast } from '../components/ui'
import { HelpBanner, type Actions } from './Today'

export type Seg = 'journee' | 'comprendre' | 'journal'

export function ReperesScreen({ data, actions, initial = 'journee' }: { data: AppData; actions: Actions; initial?: Seg }) {
  const [seg, setSeg] = useState<Seg>(initial)
  const segs: { id: Seg; label: string }[] = [
    { id: 'journee', label: 'Ma journée' },
    { id: 'comprendre', label: 'Comprendre' },
    { id: 'journal', label: 'Journal' }
  ]
  return (
    <div>
      <div className="mb-5 flex rounded-2xl bg-bord/60 p-1" role="tablist">
        {segs.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={seg === s.id}
            onClick={() => setSeg(s.id)}
            className={cx('flex-1 rounded-xl py-2.5 text-sm font-bold transition', seg === s.id ? 'bg-carte text-indigo shadow-card' : 'text-ink-muted')}
          >
            {s.label}
          </button>
        ))}
      </div>
      {seg === 'journee' && <Journee data={data} actions={actions} />}
      {seg === 'comprendre' && <Comprendre data={data} />}
      {seg === 'journal' && <Journal data={data} />}
    </div>
  )
}

/* ============================ Ma journée ============================ */

function Journee({ data, actions }: { data: AppData; actions: Actions }) {
  const today = todayId()
  const [day, setDay] = useState<Day>(today ?? 'lun')
  const [editing, setEditing] = useState(false)
  const p = data.profile
  const list = sortCourses(p.schedule[day])
  const states = courseStates(list, day === today)
  const sportTips = p.needs.map((n) => needMeta(n).sportTip).filter(Boolean) as string[]

  return (
    <div>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-tight">Ma journée</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm capitalize text-ink-muted">
            <CalendarDays size={15} className="text-indigo" />
            {day === today ? longDate() : DAYS.find((d) => d.id === day)!.long}
          </p>
        </div>
        <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 rounded-full bg-indigo-soft px-3.5 py-2 text-sm font-bold text-indigo">
          <Pencil size={15} /> Modifier
        </button>
      </div>

      <div className="mb-4 flex gap-1.5">
        {DAYS.map((d) => (
          <button
            key={d.id}
            onClick={() => setDay(d.id)}
            className={cx(
              'flex-1 rounded-xl py-2 text-sm font-bold',
              day === d.id ? 'bg-indigo text-white' : 'border border-bord bg-carte text-ink-muted',
              d.id === today && day !== d.id && 'border-indigo text-indigo'
            )}
          >
            {d.short}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Card onClick={() => setEditing(true)} className="text-center">
          <p className="text-3xl">📅</p>
          <p className="mt-2 font-bold">Aucun cours ce jour-là</p>
          <p className="mt-1 text-sm text-ink-muted">Appuie ici pour ajouter ton emploi du temps.</p>
        </Card>
      ) : (
        <ol className="relative">
          {list.map((c, i) => {
            const s = states[i]
            return (
              <li key={c.id} className="relative flex gap-3 pb-2">
                <div className="w-12 pt-3.5 text-xs font-semibold text-ink-muted">{c.start}</div>
                <div className="relative flex w-5 justify-center">
                  {i < list.length - 1 && <span className="absolute top-7 h-full w-0.5 bg-lavande" />}
                  <span
                    className={cx(
                      'relative z-10 mt-3.5 h-4 w-4 rounded-full border-2',
                      s === 'past' ? 'border-succes bg-succes' : s === 'now' ? 'border-indigo bg-indigo ring-4 ring-indigo/20' : 'border-lavande bg-carte'
                    )}
                  />
                </div>
                <div
                  className={cx(
                    'flex flex-1 items-center gap-2 rounded-2xl p-3',
                    s === 'now' ? 'bg-indigo-soft' : c.sport ? 'bg-attention-soft/70' : 'bg-carte border border-bord'
                  )}
                >
                  <div className="flex-1">
                    <p className="font-bold">
                      {c.subject} {c.sport && '🏃'}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {c.room ? c.room + ' · ' : ''}
                      {c.start}–{c.end}
                    </p>
                    {c.sport && sportTips.length > 0 && s !== 'past' && <p className="mt-1.5 text-xs font-semibold text-ink/80">⚡ {sportTips[0]}</p>}
                  </div>
                  {s === 'past' && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-succes text-white">
                      <Check size={14} strokeWidth={3} />
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <HelpBanner onClick={actions.openHelp} />

      <Sheet open={editing} onClose={() => setEditing(false)} title="Mon emploi du temps">
        <ScheduleEditor value={p.schedule} onChange={(schedule) => updateProfile({ schedule })} />
        <div className="mt-4">
          <Button onClick={() => setEditing(false)}>Terminé</Button>
        </div>
      </Sheet>
    </div>
  )
}

/* ============================ Comprendre ============================ */

function Comprendre({ data }: { data: AppData }) {
  const mine = LEARN.filter((m) => data.profile.needs.includes(m.need))
  const others = LEARN.filter((m) => !data.profile.needs.includes(m.need))
  const [open, setOpen] = useState<{ card: LearnCard; mod: LearnModule } | null>(null)
  const [quiz, setQuiz] = useState<LearnModule | null>(null)

  const Module = ({ mod }: { mod: LearnModule }) => {
    const read = mod.cards.filter((c) => data.learned.includes(c.id)).length
    return (
      <section className="mb-5">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-lg font-extrabold">{mod.title}</h2>
          <span className="text-xs font-semibold text-ink-muted">
            {read}/{mod.cards.length} lues
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {mod.cards.map((c) => {
            const done = data.learned.includes(c.id)
            return (
              <button
                key={c.id}
                onClick={() => {
                  setOpen({ card: c, mod })
                  markLearned(c.id)
                }}
                className={cx('relative rounded-xl2 p-3.5 text-left transition active:scale-[0.98]', done ? 'bg-menthe-soft' : 'bg-lavande-soft')}
              >
                <span className="text-2xl">{c.emoji}</span>
                <span className="mt-1.5 block text-sm font-bold leading-snug">{c.title}</span>
                {done && (
                  <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-succes text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <button onClick={() => setQuiz(mod)} className="mt-2.5 w-full rounded-2xl border border-bord bg-carte py-3 text-sm font-bold text-indigo">
          🧩 Petit quiz
        </button>
      </section>
    )
  }

  return (
    <div>
      <h1 className="text-[26px] font-extrabold tracking-tight">Comprendre</h1>
      <p className="mb-5 mt-1 text-sm text-ink-muted">Des fiches courtes pour mieux comprendre ce qui se passe dans ton corps.</p>
      {mine.map((m) => (
        <Module key={m.need} mod={m} />
      ))}
      {others.length > 0 && (
        <>
          {mine.length > 0 && <SectionLabel>Pour comprendre les autres aussi</SectionLabel>}
          {others.map((m) => (
            <Module key={m.need} mod={m} />
          ))}
        </>
      )}
      <p className="mt-2 rounded-2xl bg-fond p-3 text-center text-xs text-ink-muted">
        Ces fiches ne remplacent pas ton PAI ni l’avis de ton médecin.
      </p>

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open ? `${open.card.emoji} ${open.card.title}` : ''}>
        {open && <p className="text-[15px] leading-relaxed text-ink/85">{open.card.text}</p>}
      </Sheet>

      <Sheet open={!!quiz} onClose={() => setQuiz(null)} title="Petit quiz">
        {quiz && <Quiz mod={quiz} />}
      </Sheet>
    </div>
  )
}

function Quiz({ mod }: { mod: LearnModule }) {
  const [picked, setPicked] = useState<number | null>(null)
  const q = mod.quiz
  return (
    <div>
      <p className="mb-3 font-bold">{q.q}</p>
      {q.choices.map((c, i) => {
        const state = picked === null ? '' : i === q.answer ? 'bg-succes-soft border-succes' : i === picked ? 'bg-important-soft border-important' : 'opacity-60'
        return (
          <button
            key={c}
            disabled={picked !== null}
            onClick={() => {
              setPicked(i)
              if (i === q.answer) toast('Bonne réponse ! 🎉')
            }}
            className={cx('mb-2 block w-full rounded-2xl border border-bord bg-carte p-3.5 text-left text-sm font-semibold', state)}
          >
            {c}
          </button>
        )
      })}
      {picked !== null && <p className="mt-2 rounded-2xl bg-fond p-3 text-sm leading-relaxed">{q.why}</p>}
    </div>
  )
}

/* ============================ Journal ============================ */

function Journal({ data }: { data: AppData }) {
  const [text, setText] = useState('')
  const entries = [...data.journal].reverse().slice(0, 40)
  const save = () => {
    if (!text.trim()) return
    addJournal({ kind: 'note', label: 'Note', text: text.trim() })
    setText('')
    toast('Note enregistrée')
  }
  return (
    <div>
      <h1 className="text-[26px] font-extrabold tracking-tight">Mon journal</h1>
      <p className="mb-4 mt-1 text-sm text-ink-muted">Tes humeurs, tes demandes et tes notes. Utile pour en parler avec l’infirmière.</p>
      <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Comment tu te sens ? Qu’est-ce qui s’est passé ?" />
      <div className="mt-2">
        <Button onClick={save} disabled={!text.trim()}>
          Enregistrer
        </Button>
      </div>

      <SectionLabel>Dernières entrées</SectionLabel>
      {entries.length === 0 ? (
        <p className="rounded-2xl bg-fond p-4 text-center text-sm text-ink-muted">Rien pour l’instant.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((e) => {
            const mood = e.mood && MOODS.find((m) => m.id === e.mood)
            const icon = mood ? mood.face : e.kind === 'besoin' ? '🙋' : '📝'
            const color = e.kind === 'humeur' ? 'border-l-info' : e.kind === 'besoin' ? 'border-l-peche' : 'border-l-menthe'
            return (
              <li key={e.id} className={cx('rounded-2xl border border-l-4 border-bord bg-carte p-3', color)}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{icon}</span>
                  <span className="flex-1 text-sm font-bold">
                    {e.kind === 'humeur' ? `Humeur : ${e.label}` : e.kind === 'besoin' ? `Demande : ${e.label}` : e.label}
                  </span>
                  <span className="text-[11px] text-ink-muted">{shortDateTime(e.at)}</span>
                </div>
                {e.text && <p className="mt-1.5 whitespace-pre-line text-sm text-ink/80">{e.text}</p>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
