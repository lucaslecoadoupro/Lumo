import type { ContactRole, Day, Mood, NeedId } from './types'

export interface NeedMeta {
  id: NeedId
  label: string
  emoji: string
  short: string
  treatmentHint: string
  locationHint: string
  extraLabel?: string
  extraHint?: string
  /** Rappel affiché sur les cours d'EPS */
  sportTip?: string
}

export const NEEDS: NeedMeta[] = [
  {
    id: 'diabete',
    label: 'Diabète',
    emoji: '🩸',
    short: 'Glycémie, insuline, resucrage',
    treatmentHint: 'Ex. pompe à insuline, stylo, capteur…',
    locationHint: 'Ex. resucrage dans mon sac, stylo à l’infirmerie',
    sportTip: 'Pense à contrôler ta glycémie et à avoir ton resucrage'
  },
  {
    id: 'asthme',
    label: 'Asthme',
    emoji: '🫁',
    short: 'Respiration, inhalateur',
    treatmentHint: 'Ex. inhalateur de secours (bleu), chambre d’inhalation…',
    locationHint: 'Ex. dans la poche avant de mon sac',
    sportTip: 'Garde ton inhalateur à portée de main et échauffe-toi bien'
  },
  {
    id: 'allergie',
    label: 'Allergie',
    emoji: '🥜',
    short: 'Alimentaire ou autre, trousse d’urgence',
    treatmentHint: 'Ex. stylo d’adrénaline, antihistaminique…',
    locationHint: 'Ex. trousse à l’infirmerie + une dans mon sac',
    extraLabel: 'Je suis allergique à',
    extraHint: 'Ex. arachides, fruits à coque, piqûres de guêpe…'
  },
  {
    id: 'epilepsie',
    label: 'Épilepsie',
    emoji: '⚡',
    short: 'Crises, que doivent faire les adultes',
    treatmentHint: 'Ex. traitement du matin et du soir, traitement de crise…',
    locationHint: 'Ex. traitement de crise à l’infirmerie',
    sportTip: 'Préviens ton prof si tu te sens fatigué·e'
  },
  {
    id: 'autre',
    label: 'Autre besoin',
    emoji: '💬',
    short: 'Autre maladie, handicap, douleur…',
    treatmentHint: 'Ex. traitement, matériel, aménagement…',
    locationHint: 'Ex. à l’infirmerie',
    extraLabel: 'De quoi s’agit-il ?',
    extraHint: 'Explique avec tes mots'
  }
]

export const needMeta = (id: NeedId) => NEEDS.find((n) => n.id === id)!

/* ------------------------------------------------------------------ */

export const CONTACT_ROLES: { role: ContactRole; label: string; emoji: string; hint: string }[] = [
  { role: 'parent', label: 'Parent / responsable', emoji: '👪', hint: 'Maman, papa, tuteur…' },
  { role: 'infirmiere', label: 'Infirmière scolaire', emoji: '🏥', hint: 'Demande son numéro à l’infirmerie' },
  { role: 'cpe', label: 'Vie scolaire / CPE', emoji: '🏫', hint: 'Le bureau de la vie scolaire' },
  { role: 'referent', label: 'Professeur référent', emoji: '👩‍🏫', hint: 'Ton professeur principal, par exemple' },
  { role: 'medecin', label: 'Médecin', emoji: '🩺', hint: 'Médecin traitant ou spécialiste' },
  { role: 'autre', label: 'Autre adulte', emoji: '🙋', hint: 'Toute personne de confiance' }
]

export const roleMeta = (role: ContactRole) => CONTACT_ROLES.find((r) => r.role === role)!

/* ------------------------------------------------------------------ */

export const DAYS: { id: Day; short: string; long: string }[] = [
  { id: 'lun', short: 'Lun', long: 'Lundi' },
  { id: 'mar', short: 'Mar', long: 'Mardi' },
  { id: 'mer', short: 'Mer', long: 'Mercredi' },
  { id: 'jeu', short: 'Jeu', long: 'Jeudi' },
  { id: 'ven', short: 'Ven', long: 'Vendredi' }
]

export const SUBJECTS = [
  'Français', 'Mathématiques', 'Histoire-Géo', 'Anglais', 'Espagnol', 'Allemand', 'SVT',
  'Physique-Chimie', 'Technologie', 'EPS', 'Arts plastiques', 'Musique', 'EMC', 'Latin', 'Vie de classe'
]

/* ------------------------------------------------------------------ */

export const MOODS: { id: Mood; label: string; face: string; bg: string; ring: string }[] = [
  { id: 'tresbien', label: 'Très bien', face: '😄', bg: 'bg-succes-soft', ring: 'ring-succes' },
  { id: 'cava', label: 'Ça va', face: '🙂', bg: 'bg-info-soft', ring: 'ring-info' },
  { id: 'moyen', label: 'Moyen', face: '😐', bg: 'bg-attention-soft', ring: 'ring-attention' },
  { id: 'pastop', label: 'Pas top', face: '😣', bg: 'bg-important-soft', ring: 'ring-important' }
]

/* ------------------------------------------------------------------ */

export interface Besoin {
  id: string
  label: string
  emoji: string
  showText: string
  tint: string
}

/** Ce que l'élève peut montrer discrètement à un adulte. */
export const BESOINS: Besoin[] = [
  { id: 'pause', label: 'Une pause', emoji: '☕', showText: 'a besoin d’une courte pause', tint: 'bg-menthe-soft' },
  { id: 'infirmerie', label: 'Aller à l’infirmerie', emoji: '🏥', showText: 'doit aller à l’infirmerie', tint: 'bg-important-soft' },
  { id: 'amenagement', label: 'Un aménagement de cours', emoji: '📖', showText: 'a besoin d’un aménagement pendant ce cours', tint: 'bg-lavande-soft' },
  { id: 'parler', label: 'Parler à un adulte', emoji: '💬', showText: 'aimerait parler à un adulte', tint: 'bg-info-soft' },
  { id: 'calme', label: 'Un endroit calme', emoji: '🎧', showText: 'a besoin d’un endroit calme quelques minutes', tint: 'bg-peche-soft' },
  { id: 'traitement', label: 'Prendre mon traitement', emoji: '💊', showText: 'doit prendre son traitement', tint: 'bg-attention-soft' }
]

/* ------------------------------------------------------------------ */

export interface LearnCard {
  id: string
  title: string
  emoji: string
  text: string
}

export interface LearnModule {
  need: NeedId
  title: string
  cards: LearnCard[]
  quiz: { q: string; choices: string[]; answer: number; why: string }
}

/**
 * Contenus volontairement simples et généraux. Ils ne remplacent ni le PAI
 * ni l'avis du médecin — à faire relire par l'infirmière scolaire.
 */
export const LEARN: LearnModule[] = [
  {
    need: 'diabete',
    title: 'Comprendre mon diabète',
    cards: [
      { id: 'd1', emoji: '🫘', title: 'Le pancréas', text: 'Le pancréas fabrique normalement l’insuline. Dans le diabète de type 1, les cellules qui la produisent ne fonctionnent plus : ton traitement (stylo ou pompe) fait ce travail à leur place.' },
      { id: 'd2', emoji: '🔑', title: 'L’insuline, une clé', text: 'L’insuline agit comme une clé : elle ouvre la porte des cellules pour laisser entrer le sucre (glucose), leur carburant. Sans elle, le sucre reste dans le sang.' },
      { id: 'd3', emoji: '📉', title: 'L’hypoglycémie', text: 'Quand il y a trop peu de sucre dans le sang : tremblements, sueurs, faim, vertiges… Il faut se resucrer tout de suite, comme indiqué dans ton PAI, et prévenir un adulte.' },
      { id: 'd4', emoji: '📈', title: 'L’hyperglycémie', text: 'Quand il y a trop de sucre : soif, envie d’uriner souvent, fatigue. Vérifie ton matériel et suis ce que prévoit ton PAI.' }
    ],
    quiz: { q: 'Quel organe fabrique l’insuline ?', choices: ['Le foie', 'Le pancréas', 'L’estomac'], answer: 1, why: 'C’est le pancréas. Dans le diabète de type 1, il n’en produit plus assez.' }
  },
  {
    need: 'asthme',
    title: 'Comprendre mon asthme',
    cards: [
      { id: 'a1', emoji: '🫁', title: 'Les bronches', text: 'Les bronches sont les tuyaux qui amènent l’air dans les poumons. Avec l’asthme, elles sont plus sensibles et peuvent se resserrer.' },
      { id: 'a2', emoji: '🌬️', title: 'La crise', text: 'Toux, sifflement, sensation d’étouffer ou poitrine serrée : ce sont des signes de crise. Arrête l’effort, assieds-toi et prends ton traitement de secours comme prévu dans ton PAI.' },
      { id: 'a3', emoji: '💨', title: 'Deux traitements', text: 'Le traitement de fond se prend tous les jours pour calmer les bronches. Le traitement de secours agit vite pendant une crise : garde-le toujours avec toi.' },
      { id: 'a4', emoji: '🏃', title: 'Le sport', text: 'Avoir de l’asthme n’empêche pas de faire du sport ! Un bon échauffement et ton inhalateur à portée de main aident beaucoup.' }
    ],
    quiz: { q: 'Pendant une crise, tu dois d’abord…', choices: ['Continuer l’effort', 'T’arrêter et prendre ton traitement de secours', 'Boire un verre d’eau'], answer: 1, why: 'On arrête l’effort et on prend le traitement de secours, puis on prévient un adulte.' }
  },
  {
    need: 'allergie',
    title: 'Comprendre mon allergie',
    cards: [
      { id: 'l1', emoji: '🛡️', title: 'Une défense qui s’emballe', text: 'Le système immunitaire protège le corps. Dans une allergie, il réagit trop fort à quelque chose d’habituellement sans danger : c’est l’allergène.' },
      { id: 'l2', emoji: '👀', title: 'Les signes', text: 'Démangeaisons, boutons, lèvres qui gonflent, mal au ventre… Si la respiration devient difficile ou si tu te sens mal, c’est une urgence : préviens un adulte immédiatement.' },
      { id: 'l3', emoji: '💉', title: 'Le stylo d’adrénaline', text: 'Si ton médecin t’en a prescrit un, il se trouve dans ta trousse d’urgence. Ton PAI explique quand l’utiliser. Après une injection, on appelle toujours le 15.' },
      { id: 'l4', emoji: '🏷️', title: 'Au quotidien', text: 'À la cantine ou pendant une sortie, lis les étiquettes et n’hésite pas à demander ce qu’il y a dans un plat.' }
    ],
    quiz: { q: 'Après avoir utilisé un stylo d’adrénaline, il faut…', choices: ['Retourner en cours', 'Appeler le 15', 'Attendre la fin de la journée'], answer: 1, why: 'On appelle toujours le 15 après une injection d’adrénaline, même si ça va mieux.' }
  },
  {
    need: 'epilepsie',
    title: 'Comprendre mon épilepsie',
    cards: [
      { id: 'e1', emoji: '🧠', title: 'Le cerveau', text: 'Le cerveau fonctionne grâce à de petits signaux électriques. Pendant une crise, certains signaux s’emballent pendant un court moment.' },
      { id: 'e2', emoji: '🌙', title: 'Ce qui peut déclencher', text: 'Le manque de sommeil, un oubli de traitement ou parfois certaines lumières peuvent favoriser une crise. Bien dormir et prendre son traitement aident beaucoup.' },
      { id: 'e3', emoji: '🤝', title: 'Ce que font les adultes', text: 'Pendant une crise, on ne retient pas la personne et on ne met rien dans sa bouche. On protège sa tête, on note l’heure, puis on la met sur le côté quand c’est fini.' },
      { id: 'e4', emoji: '⏱️', title: 'Quand appeler', text: 'Ton PAI indique quand donner un traitement de crise et quand appeler le 15. Montre ta fiche d’urgence aux adultes qui t’entourent.' }
    ],
    quiz: { q: 'Pendant une crise, les adultes doivent…', choices: ['Tenir fermement la personne', 'Protéger sa tête et noter l’heure', 'Lui donner à boire'], answer: 1, why: 'On protège la tête, on note l’heure et on ne retient pas la personne.' }
  }
]

export const EMERGENCY_NUMBERS = [
  { number: '15', label: 'SAMU', sub: 'Urgence médicale' },
  { number: '112', label: 'Urgences', sub: 'Numéro européen' },
  { number: '114', label: 'Par SMS', sub: 'Si tu ne peux pas parler', sms: true }
]
