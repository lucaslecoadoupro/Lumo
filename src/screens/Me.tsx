import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronRight, Download, Upload, Trash2, ShieldCheck, Smartphone, Share, PlusSquare, MoreVertical } from 'lucide-react'
import type { AppData, NeedId } from '../lib/types'
import { needMeta } from '../lib/content'
import { exportJson, importJson, resetAll, updateProfile } from '../lib/store'
import { cx, isIOS, isStandalone } from '../lib/utils'
import { AvatarPicker, ContactsEditor, NeedDetailForm, NeedsPicker, ScheduleEditor } from '../components/editors'
import { Button, Field, Input, LogoMark, SectionLabel, Sheet, toast } from '../components/ui'

type Panel = null | 'profil' | 'sante' | 'contacts' | 'edt' | 'installer' | 'confidentialite' | 'effacer'

interface BIPEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: string }>
}

function Row({ icon, label, sub, onClick, danger }: { icon: ReactNode; label: string; sub?: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-fond">
      <span className={cx('flex h-10 w-10 items-center justify-center rounded-2xl text-lg', danger ? 'bg-important-soft text-important' : 'bg-indigo-soft text-indigo')}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className={cx('block font-bold', danger && 'text-important-dark')}>{label}</span>
        {sub && <span className="block truncate text-xs text-ink-muted">{sub}</span>}
      </span>
      <ChevronRight className="text-ink-muted" size={18} />
    </button>
  )
}

export function MeScreen({ data }: { data: AppData }) {
  const p = data.profile
  const [panel, setPanel] = useState<Panel>(null)
  const [openNeed, setOpenNeed] = useState<NeedId | null>(null)
  const [bip, setBip] = useState<BIPEvent | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const close = () => setPanel(null)

  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault()
      setBip(e as BIPEvent)
    }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])

  const nbCourses = Object.values(p.schedule).reduce((n, l) => n + l.length, 0)

  const download = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `lumo-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    toast('Sauvegarde téléchargée')
  }

  const onImport = async (f?: File) => {
    if (!f) return
    const ok = importJson(await f.text())
    toast(ok ? 'Sauvegarde restaurée' : 'Fichier non reconnu')
  }

  return (
    <div>
      <button onClick={() => setPanel('profil')} className="mb-6 flex w-full items-center gap-4 rounded-xl2 bg-gradient-to-br from-indigo to-lavande p-5 text-left text-white shadow-lift">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/25 text-4xl">{p.avatar}</span>
        <span className="flex-1">
          <span className="block text-2xl font-extrabold">{p.firstName}</span>
          <span className="block text-sm text-white/85">{p.className ? `Classe de ${p.className}` : 'Ajoute ta classe'}</span>
        </span>
        <ChevronRight />
      </button>

      <SectionLabel>Mes informations</SectionLabel>
      <div className="divide-y divide-bord overflow-hidden rounded-xl2 border border-bord bg-carte">
        <Row icon="❤️" label="Ma santé" sub={p.needs.length ? p.needs.map((n) => needMeta(n).label).join(', ') : 'Rien de particulier'} onClick={() => setPanel('sante')} />
        <Row icon="📞" label="Mes contacts" sub={`${p.contacts.length} contact${p.contacts.length > 1 ? 's' : ''}`} onClick={() => setPanel('contacts')} />
        <Row icon="📅" label="Mon emploi du temps" sub={`${nbCourses} cours`} onClick={() => setPanel('edt')} />
      </div>

      <SectionLabel>L’appli</SectionLabel>
      <div className="divide-y divide-bord overflow-hidden rounded-xl2 border border-bord bg-carte">
        {!isStandalone() && <Row icon={<Smartphone size={20} />} label="Installer Lumo" sub="Sur ton écran d’accueil, même hors-ligne" onClick={() => setPanel('installer')} />}
        <Row icon={<ShieldCheck size={20} />} label="Mes données" sub="Où sont stockées tes infos" onClick={() => setPanel('confidentialite')} />
        <Row icon={<Download size={20} />} label="Sauvegarder mes infos" sub="Utile si tu changes de téléphone" onClick={download} />
        <Row icon={<Upload size={20} />} label="Restaurer une sauvegarde" onClick={() => fileRef.current?.click()} />
        <Row icon={<Trash2 size={20} />} label="Tout effacer" danger onClick={() => setPanel('effacer')} />
      </div>
      <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => onImport(e.target.files?.[0])} />

      <div className="mt-8 flex flex-col items-center gap-1 text-xs text-ink-muted">
        <LogoMark size={28} />
        <span>Lumo · version 0.1</span>
      </div>

      {/* ---------- Panels ---------- */}

      <Sheet open={panel === 'profil'} onClose={close} title="Mon profil">
        <Field label="Prénom">
          <Input value={p.firstName} onChange={(e) => updateProfile({ firstName: e.target.value })} />
        </Field>
        <Field label="Classe">
          <Input value={p.className} onChange={(e) => updateProfile({ className: e.target.value })} placeholder="Ex. 4e B" />
        </Field>
        <p className="mb-2 text-sm font-semibold">Avatar</p>
        <AvatarPicker value={p.avatar} onChange={(avatar) => updateProfile({ avatar })} />
        <div className="mt-5">
          <Button onClick={close}>Terminé</Button>
        </div>
      </Sheet>

      <Sheet open={panel === 'sante'} onClose={close} title="Ma santé">
        <NeedsPicker value={p.needs} onChange={(needs) => updateProfile({ needs })} />
        {p.needs.length > 0 && <SectionLabel>Détails pour la fiche d’urgence</SectionLabel>}
        <div className="space-y-2">
          {p.needs.map((n) => (
            <div key={n} className="rounded-xl2 border border-bord">
              <button onClick={() => setOpenNeed(openNeed === n ? null : n)} className="flex w-full items-center gap-2 p-4 text-left font-bold">
                <span className="text-xl">{needMeta(n).emoji}</span>
                <span className="flex-1">{needMeta(n).label}</span>
                <ChevronRight size={18} className={cx('text-ink-muted transition', openNeed === n && 'rotate-90')} />
              </button>
              {openNeed === n && (
                <div className="px-4 pb-1">
                  <NeedDetailForm need={n} value={p.details[n]} onChange={(d) => updateProfile({ details: { ...p.details, [n]: d } })} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-5">
          <Button onClick={close}>Terminé</Button>
        </div>
      </Sheet>

      <Sheet open={panel === 'contacts'} onClose={close} title="Mes contacts">
        <ContactsEditor value={p.contacts} onChange={(contacts) => updateProfile({ contacts })} />
        <div className="mt-5">
          <Button onClick={close}>Terminé</Button>
        </div>
      </Sheet>

      <Sheet open={panel === 'edt'} onClose={close} title="Mon emploi du temps">
        <ScheduleEditor value={p.schedule} onChange={(schedule) => updateProfile({ schedule })} />
        <div className="mt-5">
          <Button onClick={close}>Terminé</Button>
        </div>
      </Sheet>

      <Sheet open={panel === 'installer'} onClose={close} title="Installer Lumo">
        {bip ? (
          <>
            <p className="mb-4 text-sm leading-relaxed text-ink-muted">Ton téléphone permet d’installer Lumo en un appui.</p>
            <Button
              onClick={async () => {
                await bip.prompt()
                setBip(null)
                close()
              }}
            >
              <Smartphone size={18} /> Installer maintenant
            </Button>
          </>
        ) : isIOS() ? (
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3 rounded-2xl bg-fond p-3.5">
              <Share className="shrink-0 text-info" /> <span>Ouvre Lumo dans <b>Safari</b>, puis appuie sur le bouton <b>Partager</b>.</span>
            </li>
            <li className="flex gap-3 rounded-2xl bg-fond p-3.5">
              <PlusSquare className="shrink-0 text-info" /> <span>Choisis <b>« Sur l’écran d’accueil »</b>, puis <b>Ajouter</b>.</span>
            </li>
            <li className="flex gap-3 rounded-2xl bg-fond p-3.5">
              <span className="shrink-0 text-lg">✨</span> <span>Ouvre Lumo depuis son icône : l’appli marche aussi sans internet.</span>
            </li>
          </ol>
        ) : (
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3 rounded-2xl bg-fond p-3.5">
              <MoreVertical className="shrink-0 text-info" /> <span>Dans Chrome, appuie sur le menu <b>⋮</b> en haut à droite.</span>
            </li>
            <li className="flex gap-3 rounded-2xl bg-fond p-3.5">
              <Smartphone className="shrink-0 text-info" /> <span>Choisis <b>« Installer l’application »</b> ou <b>« Ajouter à l’écran d’accueil »</b>.</span>
            </li>
          </ol>
        )}
      </Sheet>

      <Sheet open={panel === 'confidentialite'} onClose={close} title="Mes données">
        <div className="space-y-3 text-[15px] leading-relaxed text-ink/85">
          <p>
            <b>Tout reste sur ce téléphone.</b> Lumo n’a pas de compte, pas de serveur et n’envoie rien sur internet. Ni l’établissement, ni personne d’autre ne peut lire tes informations à distance.
          </p>
          <p>Si tu désinstalles l’appli ou effaces les données de ton navigateur, tes infos disparaissent. Pense à faire une sauvegarde.</p>
          <p>Ta fiche d’urgence ne remplace pas ton PAI signé : c’est un aide-mémoire que tu choisis de montrer.</p>
        </div>
      </Sheet>

      <Sheet open={panel === 'effacer'} onClose={close} title="Tout effacer ?">
        <p className="mb-5 text-[15px] leading-relaxed text-ink-muted">
          Ton profil, ta fiche d’urgence, tes contacts, ton emploi du temps et ton journal seront supprimés de ce téléphone. C’est définitif.
        </p>
        <Button
          variant="danger"
          onClick={() => {
            resetAll()
            close()
          }}
        >
          <Trash2 size={18} /> Oui, tout effacer
        </Button>
        <div className="mt-2">
          <Button variant="ghost" onClick={close}>
            Annuler
          </Button>
        </div>
      </Sheet>
    </div>
  )
}
