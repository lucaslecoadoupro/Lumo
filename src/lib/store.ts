import { useSyncExternalStore } from 'react'
import type { AppData, Course, Day, JournalEntry, NeedDetail, Profile } from './types'

/**
 * Stockage 100 % local : les données de santé ne quittent jamais le téléphone.
 * Pas de compte, pas de serveur. localStorage est suffisant pour ce volume
 * (quelques Ko) et fonctionne hors-ligne une fois la PWA installée.
 */
const KEY = 'lumo:v1'

/** Mode démo (?demo) : utilisé par la page de présentation, stockage séparé des vraies données. */
export const IS_DEMO = typeof location !== 'undefined' && new URLSearchParams(location.search).has('demo')
const STORAGE_KEY = IS_DEMO ? 'lumo:demo' : KEY

export const emptySchedule = (): Record<Day, []> => ({ lun: [], mar: [], mer: [], jeu: [], ven: [] })

export const emptyDetail = (): NeedDetail => ({ treatment: '', location: '', whatToDo: '', extra: '' })

export const emptyProfile = (): Profile => ({
  firstName: '',
  className: '',
  avatar: '🙂',
  needs: [],
  details: {},
  contacts: [],
  schedule: emptySchedule()
})

const fresh = (): AppData => ({
  version: 1,
  onboarded: false,
  profile: emptyProfile(),
  journal: [],
  learned: [],
  updatedAt: Date.now()
})

function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fresh()
    const parsed = JSON.parse(raw) as AppData
    // Fusion défensive pour les futures évolutions du format
    return {
      ...fresh(),
      ...parsed,
      profile: { ...emptyProfile(), ...parsed.profile, schedule: { ...emptySchedule(), ...parsed.profile?.schedule } }
    }
  } catch {
    return fresh()
  }
}

let state: AppData = IS_DEMO ? demoData() : load()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* stockage plein ou bloqué : l'appli continue en mémoire */
  }
}

export function setData(updater: (d: AppData) => AppData) {
  state = { ...updater(state), updatedAt: Date.now() }
  persist()
  listeners.forEach((l) => l())
}

export function updateProfile(patch: Partial<Profile>) {
  setData((d) => ({ ...d, profile: { ...d.profile, ...patch } }))
}

export function addJournal(entry: Omit<JournalEntry, 'id' | 'at'>) {
  setData((d) => ({ ...d, journal: [...d.journal, { ...entry, id: uid(), at: Date.now() }].slice(-300) }))
}

export function markLearned(id: string) {
  setData((d) => (d.learned.includes(id) ? d : { ...d, learned: [...d.learned, id] }))
}

export function resetAll() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* rien */
  }
  state = fresh()
  listeners.forEach((l) => l())
}

export function exportJson(): string {
  return JSON.stringify(state, null, 2)
}

export function importJson(text: string): boolean {
  try {
    const parsed = JSON.parse(text) as AppData
    if (parsed?.version !== 1 || !parsed.profile) return false
    state = { ...fresh(), ...parsed }
    persist()
    listeners.forEach((l) => l())
    return true
  } catch {
    return false
  }
}

export function useData(): AppData {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => state
  )
}

/** Demande au navigateur de ne pas effacer les données (important sur iOS). */
export async function requestPersistence() {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      await navigator.storage.persist()
    }
  } catch {
    /* non supporté */
  }
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)
}

/* ---------------- Données de démonstration ---------------- */

function c(subject: string, start: string, end: string, room: string): Course {
  return { id: uid(), subject, start, end, room, sport: subject === 'EPS' }
}

export function demoData(): AppData {
  const common = [c('Français', '08:00', '08:55', 'Salle A12'), c('Histoire-Géo', '09:00', '09:55', 'Salle B3')]
  return {
    version: 1,
    onboarded: true,
    learned: ['a1'],
    updatedAt: Date.now(),
    journal: [
      { id: uid(), at: Date.now() - 86400000, kind: 'humeur', mood: 'cava', label: 'Ça va' },
      { id: uid(), at: Date.now() - 80000000, kind: 'besoin', label: 'Une pause' }
    ],
    profile: {
      firstName: 'Inès',
      className: '4e B',
      avatar: '🦊',
      needs: ['asthme', 'allergie'],
      details: {
        asthme: {
          treatment: 'Inhalateur de secours (bleu)',
          location: 'Poche avant de mon sac',
          whatToDo: '1. Me faire asseoir au calme\n2. 2 bouffées d’inhalateur\n3. Si pas mieux après 10 min : appeler le 15',
          extra: ''
        },
        allergie: {
          treatment: 'Stylo d’adrénaline',
          location: 'Trousse à l’infirmerie + une dans mon sac',
          whatToDo: 'Lèvres qui gonflent ou gêne pour respirer : stylo dans la cuisse, puis appeler le 15.',
          extra: 'Arachides et fruits à coque'
        }
      },
      contacts: [
        { id: uid(), role: 'infirmiere', name: 'Infirmerie du collège', phone: '0400000000' },
        { id: uid(), role: 'parent', name: 'Maman', phone: '0600000000' },
        { id: uid(), role: 'cpe', name: 'Vie scolaire', phone: '0400000001' }
      ],
      schedule: {
        lun: [...common, c('Mathématiques', '10:10', '11:05', 'Salle C1'), c('SVT', '14:00', '14:55', 'Labo 2')],
        mar: [...common, c('EPS', '10:10', '12:00', 'Gymnase'), c('Espagnol', '14:00', '14:55', 'Salle B7')],
        mer: [c('Anglais', '08:00', '08:55', 'Salle A4'), c('Mathématiques', '09:00', '09:55', 'Salle C1'), c('Technologie', '10:10', '11:55', 'Salle T1')],
        jeu: [...common, c('EPS', '10:10', '12:00', 'Gymnase'), c('Physique-Chimie', '14:00', '14:55', 'Labo 1')],
        ven: [c('Espagnol', '08:00', '08:55', 'Salle B7'), c('Mathématiques', '09:00', '09:55', 'Salle C1'), c('Arts plastiques', '10:10', '11:05', 'Salle D2')]
      }
    }
  }
}

/** Remet la démo à zéro (profil complet, ou vierge pour montrer l'onboarding). */
export function resetDemo(blank = false) {
  state = blank ? fresh() : demoData()
  persist()
  listeners.forEach((l) => l())
}
