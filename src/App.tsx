import { useEffect, useState } from 'react'
import { Home, Heart, CalendarDays, User } from 'lucide-react'
import { IS_DEMO, resetDemo, useData } from './lib/store'
import { BESOINS, type Besoin } from './lib/content'
import { cx } from './lib/utils'
import Onboarding from './screens/Onboarding'
import { NeedsScreen, TodayScreen, type Actions, type Tab } from './screens/Today'
import { ReperesScreen, type Seg } from './screens/Reperes'
import { MeScreen } from './screens/Me'
import { EmergencyScreen, HelpScreen, ShowScreen } from './components/Overlays'
import { ToastHost } from './components/ui'

const dataRef = { onboarded: true }

const TABS: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: 'today', label: 'Aujourd’hui', Icon: Home },
  { id: 'needs', label: 'Mes besoins', Icon: Heart },
  { id: 'reperes', label: 'Mes repères', Icon: CalendarDays },
  { id: 'me', label: 'Moi', Icon: User }
]

export default function App() {
  const data = useData()
  dataRef.onboarded = data.onboarded
  const [tab, setTab] = useState<Tab>('today')
  const [emergency, setEmergency] = useState(false)
  const [help, setHelp] = useState(false)
  const [show, setShow] = useState<Besoin | null>(null)
  const [seg, setSeg] = useState<{ id: Seg; n: number }>({ id: 'journee', n: 0 })

  // Mode démo : la page de présentation pilote l'appli affichée dans le téléphone
  useEffect(() => {
    if (!IS_DEMO) return
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.data?.lumo !== 'go') return
      const to: string = e.data.to
      setEmergency(false)
      setHelp(false)
      setShow(null)
      if (to === 'onboarding') return resetDemo(true)
      if (!dataRef.onboarded) resetDemo(false)
      if (to === 'emergency') return setEmergency(true)
      if (to === 'help') return setHelp(true)
      if (to === 'show') {
        setTab('needs')
        return setShow(BESOINS[0])
      }
      if (to === 'journee' || to === 'comprendre' || to === 'journal') {
        setTab('reperes')
        return setSeg((s) => ({ id: to, n: s.n + 1 }))
      }
      if (to === 'today' || to === 'needs' || to === 'me') setTab(to)
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tab])

  // Raccourci depuis l'icône installée : /?urgence ouvre directement la fiche
  useEffect(() => {
    if (new URLSearchParams(location.search).has('urgence')) setEmergency(true)
  }, [])

  if (!data.onboarded)
    return (
      <>
        <Onboarding />
        <ToastHost />
      </>
    )

  const actions: Actions = {
    openEmergency: () => {
      setHelp(false)
      setEmergency(true)
    },
    openHelp: () => setHelp(true),
    openShow: (b) => setShow(b),
    goTab: setTab
  }

  return (
    <div className="mx-auto min-h-[100dvh] max-w-lg">
      <main className="px-5 pb-[calc(120px+env(safe-area-inset-bottom))] pt-[calc(20px+env(safe-area-inset-top))]">
        {tab === 'today' && <TodayScreen data={data} actions={actions} />}
        {tab === 'needs' && <NeedsScreen actions={actions} />}
        {tab === 'reperes' && <ReperesScreen key={seg.n} initial={seg.id} data={data} actions={actions} />}
        {tab === 'me' && <MeScreen data={data} />}
      </main>

      <button
        onClick={actions.openEmergency}
        aria-label="Fiche d’urgence (SOS)"
        className="fixed bottom-[calc(88px+env(safe-area-inset-bottom))] right-[max(16px,calc(50%-256px+16px))] z-30 flex h-14 w-14 items-center justify-center rounded-full bg-important text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(228,119,119,0.5)] active:scale-95"
      >
        SOS
      </button>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-bord bg-carte/95 pb-[env(safe-area-inset-bottom)] backdrop-blur" aria-label="Navigation principale">
        <div className="mx-auto flex max-w-lg px-2 pt-1.5">
          {TABS.map(({ id, label, Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-current={active ? 'page' : undefined}
                className={cx('flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-bold transition', active ? 'text-indigo' : 'text-ink-muted')}
              >
                <span className={cx('flex h-8 w-14 items-center justify-center rounded-full transition', active && 'bg-indigo-soft')}>
                  <Icon size={21} strokeWidth={active ? 2.4 : 2} />
                </span>
                {label}
              </button>
            )
          })}
        </div>
      </nav>

      {emergency && <EmergencyScreen data={data} onClose={() => setEmergency(false)} />}
      {help && <HelpScreen data={data} onClose={() => setHelp(false)} onOpenEmergency={actions.openEmergency} />}
      {show && <ShowScreen besoin={show} firstName={data.profile.firstName} className={data.profile.className} onClose={() => setShow(null)} />}
      <ToastHost />
    </div>
  )
}
