const VISIT_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

const MONTH_OFFSET = 1

const VISIT_MONTH_LENGTH = 'YYYY-MM'.length

const DATE_PART_SEPARATOR = '-'

const pad = (part: number) => String(part).padStart(2, '0')

export const todayVisitDate = (now: Date) =>
  `${now.getFullYear()}-${pad(now.getMonth() + MONTH_OFFSET)}-${pad(now.getDate())}`

export const isAfterToday = (visitDate: string, today: string) => visitDate > today

export const visitMonth = (visitDate: string) => visitDate.slice(0, VISIT_MONTH_LENGTH)

export function visitDateToLocal(visitDate: string) {
  const [year, month, day] = visitDate.split(DATE_PART_SEPARATOR).map(Number)

  return new Date(year, month - MONTH_OFFSET, day)
}

export function isVisitDate(text: string) {
  const match = VISIT_DATE_PATTERN.exec(text)

  if (!match) {
    return false
  }

  const [, year, month, day] = match.map(Number)
  const date = new Date(year, month - MONTH_OFFSET, day)

  return date.getFullYear() === year && date.getMonth() === month - MONTH_OFFSET && date.getDate() === day
}
