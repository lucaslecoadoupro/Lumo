export type NeedId = 'diabete' | 'asthme' | 'allergie' | 'epilepsie' | 'autre'

export interface NeedDetail {
  /** Traitement habituel (ex. pompe, inhalateur, stylo d'adrénaline) */
  treatment: string
  /** Où se trouve le traitement / la trousse d'urgence */
  location: string
  /** Conduite à tenir, recopiée du PAI */
  whatToDo: string
  /** Allergènes (pour l'allergie) ou précisions (pour « autre ») */
  extra: string
}

export type ContactRole = 'parent' | 'infirmiere' | 'cpe' | 'referent' | 'medecin' | 'autre'

export interface Contact {
  id: string
  role: ContactRole
  name: string
  phone: string
}

export type Day = 'lun' | 'mar' | 'mer' | 'jeu' | 'ven'

export interface Course {
  id: string
  start: string // "08:00"
  end: string // "08:55"
  subject: string
  room: string
  sport: boolean
}

export type Mood = 'tresbien' | 'cava' | 'moyen' | 'pastop'

export interface JournalEntry {
  id: string
  at: number
  kind: 'humeur' | 'besoin' | 'note'
  mood?: Mood
  label: string
  text?: string
}

export interface Profile {
  firstName: string
  className: string
  avatar: string
  needs: NeedId[]
  details: Partial<Record<NeedId, NeedDetail>>
  contacts: Contact[]
  schedule: Record<Day, Course[]>
}

export interface AppData {
  version: 1
  onboarded: boolean
  profile: Profile
  journal: JournalEntry[]
  learned: string[] // ids de fiches « Comprendre » lues
  updatedAt: number
}
