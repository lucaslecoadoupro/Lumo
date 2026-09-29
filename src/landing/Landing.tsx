import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import QRCode from 'qrcode'
import {
  Sparkles, Sun, Siren, EyeOff, HandHelping, CalendarDays, BookOpen, ShieldCheck, WifiOff, UserX,
  Share, PlusSquare, MoreVertical, Smartphone, Stethoscope, GraduationCap, Users, ArrowUpRight
} from 'lucide-react'
import { LogoMark } from '../components/ui'
import { cx } from '../lib/utils'

const BASE = import.meta.env.BASE_URL
const APP_URL = BASE + 'app/'

/* ================================================================ */
/*  Téléphone : l'appli réelle, en mode démo, dans une iframe       */
/* ================================================================ */

type Target = 'onboarding' | 'today' | 'emergency' | 'show' | 'help' | 'journee' | 'comprendre'

function usePhoneWidth(max: number) {
  const [w, setW] = useState(300)
  useEffect(() => {
    const calc = () => {
      const byHeight = ((window.innerHeight - 110) * 390) / 844
      const byWidth = window.innerWidth - 48
      setW(Math.round(Math.max(240, Math.min(max, byHeight, byWidth))))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [max])
  return w
}

function Phone({ frameRef, onLoad }: { frameRef: React.RefObject<HTMLIFrameElement | null>; onLoad: () => void }) {
  const w = usePhoneWidth(330)
  const scale = w / 390
  return (
    <div className="phone-in relative mx-auto" style={{ width: w + 20 }}>
      <div className="absolute -inset-10 -z-10 rounded-full bg-lavande/35 blur-3xl" aria-hidden="true" />
      <div className="rounded-[52px] bg-ink p-[10px] shadow-[0_40px_80px_-20px_rgba(36,38,59,0.45)]">
        <div className="relative overflow-hidden rounded-[42px] bg-fond" style={{ width: w, height: (w * 844) / 390 }}>
          {/* Barre d'état : l'encoche ne masque jamais l'appli */}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-fond px-[9%] text-ink" style={{ height: 46 * scale, fontSize: 14 * scale }} aria-hidden="true">
            <span className="font-bold">9:41</span>
            <span className="flex items-center gap-[0.35em]">
              <span className="block h-[0.6em] w-[1em] rounded-[0.15em] bg-ink/80" />
              <span className="block h-[0.7em] w-[1.6em] rounded-[0.25em] border-[0.12em] border-ink/80" />
            </span>
          </div>
          <iframe
            ref={frameRef}
            onLoad={onLoad}
            title="Démo interactive de l’appli Lumo"
            src={APP_URL + '?demo'}
            className="absolute left-0 origin-top-left border-0"
            style={{ top: 46 * scale, width: 390, height: 798, transform: `scale(${scale})` }}
          />
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-ink" style={{ top: 10 * scale, height: 26 * scale, width: 96 * scale }} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-ink-muted">Démo interactive : touche l’écran, c’est la vraie appli.</p>
    </div>
  )
}

/* ================================================================ */
/*  Contenu                                                         */
/* ================================================================ */

interface Feature {
  to: Target
  icon: ReactNode
  tint: string
  title: string
  text: string
}

const FEATURES: Feature[] = [
  {
    to: 'onboarding',
    icon: <Sparkles size={22} />,
    tint: 'bg-lavande-soft text-indigo',
    title: 'Tout configurer en quelques minutes',
    text: 'Au premier lancement, l’élève indique sa classe, ses besoins de santé, son traitement et ce qu’il faut faire en cas de problème, en s’aidant de son PAI. Puis ses contacts et son emploi du temps.'
  },
  {
    to: 'today',
    icon: <Sun size={22} />,
    tint: 'bg-peche-soft text-[#C9824F]',
    title: 'Sa journée d’un coup d’œil',
    text: 'Chaque matin : comment je me sens, mes prochains cours, et un rappel les jours d’EPS (inhalateur, glycémie…) adapté à ses besoins.'
  },
  {
    to: 'emergency',
    icon: <Siren size={22} />,
    tint: 'bg-important-soft text-important-dark',
    title: 'La fiche d’urgence, toujours sur soi',
    text: 'Un bouton SOS sur chaque écran ouvre une fiche lisible par n’importe quel adulte : allergies, conduite à tenir, où trouver le traitement, qui appeler. Même sans réseau.'
  },
  {
    to: 'show',
    icon: <EyeOff size={22} />,
    tint: 'bg-menthe-soft text-succes',
    title: 'Demander sans avoir à le dire',
    text: 'Une pause, l’infirmerie, un endroit calme : l’élève choisit, puis tourne son écran vers le professeur. Pas besoin d’expliquer devant toute la classe.'
  },
  {
    to: 'help',
    icon: <HandHelping size={22} />,
    tint: 'bg-info-soft text-info',
    title: 'Le bon adulte en un appui',
    text: 'Vie scolaire, infirmière, professeur référent, parents : chacun est joignable directement, avec le 15, le 112 et le 114 par SMS.'
  },
  {
    to: 'journee',
    icon: <CalendarDays size={22} />,
    tint: 'bg-lavande-soft text-indigo',
    title: 'Des repères dans la semaine',
    text: 'L’emploi du temps sous forme de frise : ce qui est fait, ce qui est en cours, ce qui arrive. Rassurant pour ceux qui ont besoin d’anticiper.'
  },
  {
    to: 'comprendre',
    icon: <BookOpen size={22} />,
    tint: 'bg-attention-soft text-[#B9801F]',
    title: 'Comprendre ce qui se passe dans son corps',
    text: 'Des fiches courtes et un petit quiz pour l’asthme, le diabète, les allergies et l’épilepsie. De quoi mieux s’expliquer, et mieux expliquer aux autres.'
  }
]

/* ================================================================ */
/*  Page                                                            */
/* ================================================================ */

export default function Landing() {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const loaded = useRef(false)
  const pending = useRef<Target | null>(null)
  const [active, setActive] = useState<Target | null>(null)
  const phoneBox = useRef<HTMLDivElement>(null)

  const send = useCallback((to: Target) => {
    setActive(to)
    if (!loaded.current) {
      pending.current = to
      return
    }
    frameRef.current?.contentWindow?.postMessage({ lumo: 'go', to }, location.origin)
  }, [])

  const onLoad = () => {
    loaded.current = true
    if (pending.current) send(pending.current)
  }

  // Sur grand écran, le téléphone suit la lecture des fonctionnalités
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    if (!mq.matches) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) send((e.target as HTMLElement).dataset.to as Target)
        })
      },
      { rootMargin: '-48% 0px -48% 0px' }
    )
    document.querySelectorAll('[data-to]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [send])

  const showOnPhone = (to: Target) => {
    send(to)
    if (!window.matchMedia('(min-width: 1024px)').matches) phoneBox.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="overflow-x-clip">
      <Nav />

      {/* ---------- Hero + fonctionnalités (téléphone collant à droite) ---------- */}
      <div className="mx-auto grid max-w-6xl gap-x-16 px-6 lg:grid-cols-[1fr_auto]">
        <div>
          <header className="hero-in flex min-h-[calc(100svh-72px)] flex-col justify-center pb-10 pt-6 lg:pb-24">
            <h1 className="max-w-[13ch] text-[44px] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink sm:text-[60px] lg:text-[70px]">
              Un point de repère pour mieux vivre sa journée au collège.
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-muted">
              Lumo accompagne les élèves qui ont un besoin de santé : leur fiche d’urgence toujours sur eux, les bons contacts en un appui, et une façon discrète de demander de l’aide en classe.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#installer" className="rounded-2xl bg-indigo px-6 py-4 font-bold text-white shadow-lift transition hover:bg-indigo-dark">
                Installer Lumo
              </a>
              <a href={APP_URL} className="flex items-center gap-1.5 rounded-2xl border border-bord bg-carte px-6 py-4 font-bold text-ink transition hover:border-indigo">
                Ouvrir l’appli <ArrowUpRight size={18} />
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-semibold text-ink/80">
              <li className="flex items-center gap-2"><UserX size={18} className="text-indigo" /> Sans compte</li>
              <li className="flex items-center gap-2"><ShieldCheck size={18} className="text-indigo" /> Données sur le téléphone</li>
              <li className="flex items-center gap-2"><WifiOff size={18} className="text-indigo" /> Marche hors-ligne</li>
              <li className="flex items-center gap-2"><Smartphone size={18} className="text-indigo" /> iPhone et Android</li>
            </ul>
          </header>

          {/* Téléphone sur mobile : juste après l'introduction */}
          <div ref={phoneBox} className="mb-16 lg:hidden">
            <MobilePhoneSlot frameRef={frameRef} onLoad={onLoad} />
          </div>

          <section id="fonctionnalites" aria-labelledby="f-title" className="scroll-mt-24 pb-16 lg:pb-[30vh]">
            <h2 id="f-title" className="max-w-[18ch] text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[42px]">
              Ce que Lumo fait pour l’élève
            </h2>
            <p className="mt-3 max-w-[50ch] text-ink-muted">
              <span className="lg:hidden">Touche une fonctionnalité pour la voir en action sur le téléphone.</span>
              <span className="hidden lg:inline">Le téléphone à droite suit ta lecture. Tu peux aussi cliquer sur chaque fonctionnalité.</span>
            </p>

            <ol className="mt-10 space-y-3 lg:space-y-[22vh]">
              {FEATURES.map((f) => {
                const on = active === f.to
                return (
                  <li key={f.to} data-to={f.to}>
                    <button
                      onClick={() => showOnPhone(f.to)}
                      aria-pressed={on}
                      className={cx(
                        'group flex w-full gap-5 rounded-[28px] p-5 text-left transition sm:p-6',
                        on ? 'bg-carte shadow-[0_18px_40px_-18px_rgba(98,102,217,0.35)]' : 'hover:bg-carte/70'
                      )}
                    >
                      <span className={cx('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', f.tint)}>{f.icon}</span>
                      <span>
                        <span className="block text-xl font-extrabold tracking-tight">{f.title}</span>
                        <span className="mt-1.5 block max-w-[54ch] leading-relaxed text-ink-muted">{f.text}</span>
                        <span className="mt-3 inline-block text-sm font-bold text-indigo lg:hidden">Voir sur le téléphone</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        </div>

        {/* Téléphone sur grand écran : collant */}
        <aside className="hidden lg:block">
          <div className="sticky top-[88px] pb-10 pt-6">
            <DesktopPhoneSlot frameRef={frameRef} onLoad={onLoad} />
          </div>
        </aside>
      </div>

      <Privacy />
      <Install />
      <ForAdults />
      <Team />
      <Footer />
    </div>
  )
}

/* Une seule iframe à la fois selon la taille d'écran */
function useIsDesktop() {
  const [d, setD] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const h = () => setD(mq.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])
  return d
}
type SlotProps = { frameRef: React.RefObject<HTMLIFrameElement | null>; onLoad: () => void }
const DesktopPhoneSlot = (p: SlotProps) => (useIsDesktop() ? <Phone {...p} /> : null)
const MobilePhoneSlot = (p: SlotProps) => (useIsDesktop() ? null : <Phone {...p} />)

/* ================================================================ */

function Nav() {
  return (
    <nav className="sticky top-0 z-30 border-b border-transparent bg-fond/85 backdrop-blur-md" aria-label="Navigation">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-6 px-6">
        <a href={BASE} className="flex items-center gap-2" aria-label="Lumo, accueil">
          <LogoMark size={34} />
          <span className="text-[26px] font-extrabold tracking-tight text-indigo">lumo</span>
        </a>
        <div className="ml-auto hidden items-center gap-7 text-[15px] font-semibold text-ink/80 md:flex">
          <a href="#fonctionnalites" className="hover:text-indigo">Fonctionnalités</a>
          <a href="#donnees" className="hover:text-indigo">Données</a>
          <a href="#installer" className="hover:text-indigo">Installer</a>
          <a href="#equipe" className="hover:text-indigo">L’équipe</a>
        </div>
        <a href={APP_URL} className="ml-auto rounded-xl bg-indigo px-4 py-2.5 text-sm font-bold text-white md:ml-0">
          Ouvrir l’appli
        </a>
      </div>
    </nav>
  )
}

/* ================================================================ */

function Privacy() {
  return (
    <section id="donnees" aria-labelledby="d-title" className="scroll-mt-20 bg-indigo text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_1fr] lg:py-32">
        <div>
          <h2 id="d-title" className="max-w-[16ch] text-[38px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[52px]">
            Les informations de santé ne quittent pas le téléphone.
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-white/80">
            Lumo n’a ni compte, ni serveur, ni publicité. Personne, pas même le collège, ne peut consulter à distance ce que l’élève a saisi.
          </p>
        </div>
        <dl className="grid content-center gap-8">
          {[
            { icon: <UserX size={24} />, t: 'Aucun compte à créer', d: 'Ni adresse e-mail, ni mot de passe. L’élève ouvre l’appli et commence.' },
            { icon: <ShieldCheck size={24} />, t: 'Rien n’est envoyé sur internet', d: 'Tout est enregistré sur l’appareil. Une sauvegarde est possible, sous forme de fichier que l’élève garde.' },
            { icon: <WifiOff size={24} />, t: 'Utilisable sans connexion', d: 'Une fois installée, l’appli et la fiche d’urgence fonctionnent même sans réseau.' }
          ].map((x) => (
            <div key={x.t} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">{x.icon}</span>
              <div>
                <dt className="text-lg font-bold">{x.t}</dt>
                <dd className="mt-1 leading-relaxed text-white/75">{x.d}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
      <p className="mx-auto max-w-6xl border-t border-white/15 px-6 py-6 text-sm text-white/70">
        Lumo ne remplace pas le PAI signé : c’est un aide-mémoire que l’élève choisit de montrer.
      </p>
    </section>
  )
}

/* ================================================================ */

function Install() {
  const [os, setOs] = useState<'ios' | 'android'>(() => (/android/i.test(navigator.userAgent) ? 'android' : 'ios'))
  const [qr, setQr] = useState('')
  const url = location.origin + APP_URL

  useEffect(() => {
    QRCode.toString(url, { type: 'svg', margin: 0, color: { dark: '#24263B', light: '#FFFFFF' }, errorCorrectionLevel: 'M' })
      .then(setQr)
      .catch(() => setQr(''))
  }, [url])

  const steps =
    os === 'ios'
      ? [
          { icon: <Smartphone size={20} />, t: 'Ouvre le lien dans Safari', d: 'Scanne le QR code ou touche « Ouvrir l’appli » depuis l’iPhone.' },
          { icon: <Share size={20} />, t: 'Touche le bouton Partager', d: 'Le carré avec une flèche, en bas de l’écran.' },
          { icon: <PlusSquare size={20} />, t: 'Choisis « Sur l’écran d’accueil »', d: 'Puis Ajouter. L’icône Lumo apparaît avec tes autres applis.' },
          { icon: <Sparkles size={20} />, t: 'Ouvre Lumo depuis son icône', d: 'Et remplis ton profil à ce moment-là, pas avant : sur iPhone, Safari et l’appli installée ne partagent pas leurs données.' }
        ]
      : [
          { icon: <Smartphone size={20} />, t: 'Ouvre le lien dans Chrome', d: 'Scanne le QR code ou touche « Ouvrir l’appli » depuis le téléphone.' },
          { icon: <MoreVertical size={20} />, t: 'Touche « Installer l’application »', d: 'Proposé automatiquement, ou dans le menu ⋮ en haut à droite.' },
          { icon: <Sparkles size={20} />, t: 'Ouvre Lumo depuis son icône', d: 'Elle fonctionne comme une appli classique, même hors-ligne.' }
        ]

  return (
    <section id="installer" aria-labelledby="i-title" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 lg:grid-cols-[1fr_360px] lg:py-32">
        <div>
          <h2 id="i-title" className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[42px]">
            Installer Lumo en une minute
          </h2>
          <p className="mt-3 max-w-[52ch] text-ink-muted">Pas besoin de passer par l’App Store ni le Play Store : Lumo s’installe directement depuis le navigateur.</p>

          <div className="mt-8 inline-flex rounded-2xl bg-bord/60 p-1" role="tablist" aria-label="Type de téléphone">
            {(['ios', 'android'] as const).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={os === k}
                onClick={() => setOs(k)}
                className={cx('rounded-xl px-6 py-2.5 text-sm font-bold transition', os === k ? 'bg-carte text-indigo shadow-card' : 'text-ink-muted')}
              >
                {k === 'ios' ? 'iPhone' : 'Android'}
              </button>
            ))}
          </div>

          <ol className="mt-8 space-y-6">
            {steps.map((s, i) => (
              <li key={s.t} className="flex gap-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo text-lg font-extrabold text-white">{i + 1}</span>
                <div className="pt-1">
                  <p className="flex items-center gap-2 text-lg font-bold">
                    {s.t} <span className="text-ink-muted">{s.icon}</span>
                  </p>
                  <p className="mt-1 max-w-[54ch] leading-relaxed text-ink-muted">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <a href={APP_URL} className="flex items-center justify-center gap-2 rounded-2xl bg-indigo px-6 py-4 font-bold text-white shadow-lift md:hidden">
          Ouvrir Lumo sur ce téléphone <ArrowUpRight size={18} />
        </a>
        <div className="hidden self-start rounded-[32px] bg-carte p-8 text-center shadow-[0_24px_60px_-24px_rgba(36,38,59,0.25)] md:block lg:sticky lg:top-28">
          {qr ? (
            <div className="mx-auto w-full max-w-[220px]" dangerouslySetInnerHTML={{ __html: qr }} role="img" aria-label="QR code vers l’appli Lumo" />
          ) : (
            <div className="mx-auto aspect-square max-w-[220px] rounded-2xl bg-fond" />
          )}
          <p className="mt-6 text-lg font-bold">Scanne avec ton téléphone</p>
          <p className="mt-1 break-all text-sm text-ink-muted">{url}</p>
          <p className="mt-5 rounded-2xl bg-lavande-soft p-3 text-sm leading-relaxed text-ink/80">
            Astuce pour l’infirmerie : imprime cette page et affiche le QR code.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ================================================================ */

function ForAdults() {
  const cols = [
    {
      icon: <Stethoscope size={22} />,
      bar: 'bg-important',
      t: 'Infirmières scolaires',
      d: 'Au moment du PAI, remplissez la fiche d’urgence avec l’élève et vérifiez qu’elle correspond au protocole signé. Il repart avec un résumé qu’il sait montrer.'
    },
    {
      icon: <GraduationCap size={22} />,
      bar: 'bg-indigo',
      t: 'Professeurs',
      d: 'Si un élève vous tend son téléphone avec un écran Lumo, c’est une demande prévue : une pause, l’infirmerie, un aménagement. Il n’a pas à se justifier devant la classe.'
    },
    {
      icon: <Users size={22} />,
      bar: 'bg-menthe',
      t: 'Familles',
      d: 'Aidez votre enfant à configurer l’appli et à ajouter vos numéros. Pensez à faire une sauvegarde en cas de changement de téléphone.'
    }
  ]
  return (
    <section id="adultes" aria-labelledby="a-title" className="bg-carte">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-28">
        <h2 id="a-title" className="max-w-[20ch] text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[42px]">
          Pour les adultes autour de l’élève
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {cols.map((c) => (
            <div key={c.t}>
              <span className={cx('block h-1.5 w-12 rounded-full', c.bar)} />
              <p className="mt-5 flex items-center gap-2.5 text-xl font-extrabold">
                <span className="text-ink-muted">{c.icon}</span> {c.t}
              </p>
              <p className="mt-2.5 leading-relaxed text-ink-muted">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================================================================ */

function Team() {
  const people = [
    {
      initials: 'MO',
      name: 'Marjorie Otalora',
      role: 'Infirmière scolaire',
      part: 'À l’initiative du projet',
      bg: 'bg-menthe',
      ring: 'ring-menthe-soft'
    },
    {
      initials: 'LL',
      name: 'Lucas Le Coadou',
      role: 'Professeur d’espagnol',
      part: 'Responsable de la partie technique',
      bg: 'bg-indigo',
      ring: 'ring-indigo-soft'
    }
  ]
  return (
    <section id="equipe" aria-labelledby="t-title" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <h2 id="t-title" className="text-[34px] font-extrabold leading-[1.08] tracking-[-0.025em] sm:text-[42px]">
              Qui fait Lumo
            </h2>
            <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-ink-muted">
              Lumo est né à l’infirmerie d’un collège, d’un constat simple : les élèves qui ont un besoin de santé doivent pouvoir être aidés vite, sans avoir à s’expliquer devant tout le monde.
            </p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-2">
            {people.map((p) => (
              <li key={p.name} className="rounded-[32px] bg-carte p-7 shadow-[0_24px_60px_-28px_rgba(36,38,59,0.25)]">
                <span className={cx('flex h-20 w-20 items-center justify-center rounded-[26px] text-2xl font-extrabold tracking-tight text-white ring-8', p.bg, p.ring)}>
                  {p.initials}
                </span>
                <p className="mt-7 text-2xl font-extrabold tracking-tight">{p.name}</p>
                <p className="mt-1 font-semibold text-ink/80">{p.role}</p>
                <p className="mt-4 text-ink-muted">{p.part}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ================================================================ */

function Footer() {
  return (
    <footer className="border-t border-bord">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <LogoMark size={28} />
          <span className="text-xl font-extrabold text-indigo">lumo</span>
        </div>
        <p className="text-sm text-ink-muted sm:ml-6">
          Un projet de Marjorie Otalora et Lucas Le Coadou, {new Date().getFullYear()}.
        </p>
        <a href={APP_URL} className="text-sm font-bold text-indigo sm:ml-auto">
          Ouvrir l’appli
        </a>
      </div>
    </footer>
  )
}
