import { useState } from 'react'
import { Plus, Trash2, Phone } from 'lucide-react'
import type { Contact, ContactRole, Course, Day, NeedDetail, NeedId } from '../lib/types'
import { CONTACT_ROLES, DAYS, NEEDS, SUBJECTS, needMeta, roleMeta } from '../lib/content'
import { cx, formatPhone, sortCourses, todayId } from '../lib/utils'
import { emptyDetail, uid } from '../lib/store'
import { Button, Chip, Field, Input, TextArea } from './ui'

/* ================= Besoins de santé ================= */

export function NeedsPicker({ value, onChange }: { value: NeedId[]; onChange: (v: NeedId[]) => void }) {
  const toggle = (id: NeedId) => onChange(value.includes(id) ? value.filter((n) => n !== id) : [...value, id])
  return (
    <div className="space-y-2.5">
      {NEEDS.map((n) => {
        const on = value.includes(n.id)
        return (
          <button
            key={n.id}
            type="button"
            onClick={() => toggle(n.id)}
            aria-pressed={on}
            className={cx(
              'flex w-full items-center gap-3 rounded-xl2 border-2 bg-carte p-3.5 text-left transition',
              on ? 'border-indigo bg-indigo-soft' : 'border-bord'
            )}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fond text-2xl">{n.emoji}</span>
            <span className="flex-1">
              <span className="block font-bold">{n.label}</span>
              <span className="block text-xs text-ink-muted">{n.short}</span>
            </span>
            <span
              className={cx(
                'flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold',
                on ? 'border-indigo bg-indigo text-white' : 'border-bord'
              )}
            >
              {on && '✓'}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function NeedDetailForm({ need, value, onChange }: { need: NeedId; value?: NeedDetail; onChange: (d: NeedDetail) => void }) {
  const meta = needMeta(need)
  const v = value ?? emptyDetail()
  const set = (k: keyof NeedDetail) => (e: { target: { value: string } }) => onChange({ ...v, [k]: e.target.value })
  return (
    <div>
      {meta.extraLabel && (
        <Field label={meta.extraLabel}>
          <Input value={v.extra} onChange={set('extra')} placeholder={meta.extraHint} />
        </Field>
      )}
      <Field label="Mon traitement">
        <Input value={v.treatment} onChange={set('treatment')} placeholder={meta.treatmentHint} />
      </Field>
      <Field label="Où il se trouve">
        <Input value={v.location} onChange={set('location')} placeholder={meta.locationHint} />
      </Field>
      <Field label="Que faire en cas de problème ?" hint="Recopie la conduite à tenir de ton PAI. Tu peux la remplir avec l’infirmière.">
        <TextArea rows={4} value={v.whatToDo} onChange={set('whatToDo')} placeholder="Ce que les adultes doivent faire, étape par étape" />
      </Field>
    </div>
  )
}

/* ================= Contacts ================= */

export function ContactsEditor({ value, onChange }: { value: Contact[]; onChange: (v: Contact[]) => void }) {
  const [role, setRole] = useState<ContactRole>(value.some((c) => c.role === 'parent') ? 'infirmiere' : 'parent')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const valid = phone.replace(/\D/g, '').length >= 3

  const add = () => {
    if (!valid) return
    onChange([...value, { id: uid(), role, name: name.trim() || roleMeta(role).label, phone: phone.trim() }])
    setName('')
    setPhone('')
    const nextMissing = CONTACT_ROLES.find((r) => r.role !== role && !value.some((c) => c.role === r.role) && r.role !== 'autre')
    if (nextMissing) setRole(nextMissing.role)
  }

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-5 space-y-2">
          {value.map((c) => {
            const r = roleMeta(c.role)
            return (
              <li key={c.id} className="flex items-center gap-3 rounded-2xl border border-bord bg-carte p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-soft text-lg">{r.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{c.name}</span>
                  <span className="block text-xs text-ink-muted">
                    {r.label} · {formatPhone(c.phone)}
                  </span>
                </span>
                <button
                  type="button"
                  aria-label={`Supprimer ${c.name}`}
                  onClick={() => onChange(value.filter((x) => x.id !== c.id))}
                  className="rounded-full p-2 text-ink-muted"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <div className="rounded-xl2 border border-dashed border-lavande bg-lavande-soft/60 p-4">
        <p className="mb-2 text-sm font-bold">Ajouter un contact</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {CONTACT_ROLES.map((r) => (
            <Chip key={r.role} on={role === r.role} onClick={() => setRole(r.role)}>
              {r.emoji} {r.label}
            </Chip>
          ))}
        </div>
        <Field label="Nom" hint={roleMeta(role).hint}>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={roleMeta(role).label} autoComplete="off" />
        </Field>
        <Field label="Téléphone">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="06 12 34 56 78" inputMode="tel" type="tel" />
        </Field>
        <Button variant="soft" onClick={add} disabled={!valid} type="button">
          <Phone size={18} /> Ajouter
        </Button>
      </div>
    </div>
  )
}

/* ================= Emploi du temps ================= */

export function ScheduleEditor({ value, onChange }: { value: Record<Day, Course[]>; onChange: (v: Record<Day, Course[]>) => void }) {
  const [day, setDay] = useState<Day>(todayId() ?? 'lun')
  const [subject, setSubject] = useState('')
  const [start, setStart] = useState('08:00')
  const [end, setEnd] = useState('08:55')
  const [room, setRoom] = useState('')
  const list = sortCourses(value[day])

  const add = () => {
    if (!subject.trim()) return
    const course: Course = {
      id: uid(),
      subject: subject.trim(),
      start,
      end: end > start ? end : start,
      room: room.trim(),
      sport: /eps|sport/i.test(subject)
    }
    onChange({ ...value, [day]: [...value[day], course] })
    setSubject('')
    setRoom('')
    setStart(end)
    const [h, m] = end.split(':').map(Number)
    const e = h * 60 + m + 55
    setEnd(`${String(Math.floor(e / 60) % 24).padStart(2, '0')}:${String(e % 60).padStart(2, '0')}`)
  }

  return (
    <div>
      <div className="mb-4 flex gap-1.5" role="tablist">
        {DAYS.map((d) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={day === d.id}
            onClick={() => setDay(d.id)}
            className={cx(
              'flex-1 rounded-xl py-2.5 text-sm font-bold transition',
              day === d.id ? 'bg-indigo text-white' : 'bg-carte text-ink-muted border border-bord'
            )}
          >
            {d.short}
            {value[d.id].length > 0 && <span className="ml-1 text-[10px] opacity-70">{value[d.id].length}</span>}
          </button>
        ))}
      </div>

      {list.length > 0 ? (
        <ul className="mb-4 space-y-2">
          {list.map((c) => (
            <li key={c.id} className="flex items-center gap-3 rounded-2xl border border-bord bg-carte px-3 py-2.5">
              <span className="w-[74px] text-xs font-semibold text-ink-muted">
                {c.start}–{c.end}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">
                  {c.subject} {c.sport && '🏃'}
                </span>
                {c.room && <span className="block text-xs text-ink-muted">{c.room}</span>}
              </span>
              <button
                aria-label={`Supprimer ${c.subject}`}
                onClick={() => onChange({ ...value, [day]: value[day].filter((x) => x.id !== c.id) })}
                className="rounded-full p-2 text-ink-muted"
              >
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 rounded-2xl bg-fond p-4 text-center text-sm text-ink-muted">Aucun cours ce jour-là pour l’instant.</p>
      )}

      <div className="rounded-xl2 border border-dashed border-lavande bg-lavande-soft/60 p-4">
        <Field label="Matière">
          <Input list="lumo-subjects" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex. Mathématiques" />
          <datalist id="lumo-subjects">
            {SUBJECTS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Début">
            <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="Fin">
            <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
        </div>
        <Field label="Salle (facultatif)">
          <Input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Ex. Salle B3, Gymnase" />
        </Field>
        <Button variant="soft" onClick={add} disabled={!subject.trim()} type="button">
          <Plus size={18} /> Ajouter le cours
        </Button>
      </div>
    </div>
  )
}

/* ================= Avatar ================= */

export const AVATARS = ['🙂', '😎', '🦊', '🐼', '🐱', '🦁', '🐸', '🦄', '⚽', '🎧', '🎨', '🚀']

export function AvatarPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {AVATARS.map((a) => (
        <button
          key={a}
          type="button"
          aria-pressed={value === a}
          aria-label={`Avatar ${a}`}
          onClick={() => onChange(a)}
          className={cx(
            'flex aspect-square items-center justify-center rounded-2xl text-2xl transition',
            value === a ? 'bg-indigo-soft ring-2 ring-indigo' : 'bg-carte border border-bord'
          )}
        >
          {a}
        </button>
      ))}
    </div>
  )
}
