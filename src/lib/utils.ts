import type { Course, Day } from './types'

export const telHref = (phone: string) => 'tel:' + phone.replace(/[^\d+]/g, '')
export const smsHref = (phone: string) => 'sms:' + phone.replace(/[^\d+]/g, '')

export function formatPhone(p: string) {
  const d = p.replace(/\D/g, '')
  if (d.length === 10) return d.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
  return p
}

const JS_TO_DAY: (Day | null)[] = [null, 'lun', 'mar', 'mer', 'jeu', 'ven', null]

export function todayId(date = new Date()): Day | null {
  return JS_TO_DAY[date.getDay()]
}

export const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export const nowMinutes = (d = new Date()) => d.getHours() * 60 + d.getMinutes()

export function sortCourses(list: Course[]) {
  return [...list].sort((a, b) => minutes(a.start) - minutes(b.start))
}

export type CourseState = 'past' | 'now' | 'next' | 'later'

export function courseStates(list: Course[], isToday: boolean, now = nowMinutes()): CourseState[] {
  if (!isToday) return list.map(() => 'later')
  let nextFound = false
  return list.map((c) => {
    if (minutes(c.end) <= now) return 'past'
    if (minutes(c.start) <= now) return 'now'
    if (!nextFound) {
      nextFound = true
      return 'next'
    }
    return 'later'
  })
}

export function greetingMoment(d = new Date()) {
  const h = d.getHours()
  if (h < 12) return 'ta matinée'
  if (h < 18) return 'ta journée'
  return 'ta soirée'
}

export function longDate(d = new Date()) {
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function shortDateTime(ts: number) {
  return new Date(ts).toLocaleString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function sameDay(a: number, b = Date.now()) {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)
export const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
