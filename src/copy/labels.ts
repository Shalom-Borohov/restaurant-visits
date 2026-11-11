import type { ReturnVerdict, Verdict, VisitKind } from '../domain/types'
import { visitDateToLocal } from '../domain/visitDate'

export const VERDICT_LABELS: Record<Verdict, string> = {
  must: 'חובה להזמין',
  good: 'טעים',
  fine: 'בסדר',
  weak: 'לא משהו',
  avoid: 'לא להזמין',
}

export const UNRATED_LABEL = 'לדרג'

export const VISIT_KIND_LABELS: Record<VisitKind, string> = {
  dineIn: 'במקום',
  delivery: 'משלוח',
  takeaway: 'איסוף',
}

export const RETURN_LABELS: Record<ReturnVerdict, string> = {
  yes: 'אחזור',
  no: 'לא אחזור',
}

const SHORT_DATE = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'short' })

const LONG_DATE = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })

const MONTH_HEADING = new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' })

const FIRST_OF_MONTH = '-01'

export const shortDate = (visitDate: string) => SHORT_DATE.format(visitDateToLocal(visitDate))

export const longDate = (visitDate: string) => LONG_DATE.format(visitDateToLocal(visitDate))

export const monthHeading = (visitMonth: string) =>
  MONTH_HEADING.format(visitDateToLocal(`${visitMonth}${FIRST_OF_MONTH}`))
