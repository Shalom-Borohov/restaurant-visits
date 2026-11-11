import { normalizeText } from './text'
import { type Dish, VERDICTS, type Verdict, type Visit } from './types'

export type DishSummary = {
  name: string
  orderCount: number
  lastOrderedOn: string
  latestDishId: string
  latestVisitId: string
  verdict?: Verdict
  price?: number
  photoDishId?: string
}

type DatedDish = Dish & { visitedOn: string }

const UNRATED_RANK = VERDICTS.length

export const dishKey = normalizeText

const verdictRank = (verdict: Verdict | undefined) => (verdict ? VERDICTS.indexOf(verdict) : UNRATED_RANK)

const newestFirst = (first: DatedDish, second: DatedDish) =>
  second.visitedOn.localeCompare(first.visitedOn) || second.createdAt - first.createdAt

function summarize(orders: DatedDish[]): DishSummary {
  const [latest] = orders

  return {
    name: latest.name,
    orderCount: orders.length,
    lastOrderedOn: latest.visitedOn,
    latestDishId: latest.id,
    latestVisitId: latest.visitId,
    verdict: orders.find((order) => order.verdict)?.verdict,
    price: orders.find((order) => order.price !== undefined)?.price,
    photoDishId: orders.find((order) => order.hasPhoto)?.id,
  }
}

const bestFirst = (first: DishSummary, second: DishSummary) =>
  verdictRank(first.verdict) - verdictRank(second.verdict) || second.lastOrderedOn.localeCompare(first.lastOrderedOn)

export function summarizeDishes(visits: Visit[], dishes: Dish[]) {
  const visitDates = new Map(visits.map((visit) => [visit.id, visit.visitedOn]))

  const dated = dishes
    .flatMap((dish) => {
      const visitedOn = visitDates.get(dish.visitId)

      return visitedOn ? [{ ...dish, visitedOn }] : []
    })
    .sort(newestFirst)

  return [...Map.groupBy(dated, (dish) => dishKey(dish.name)).values()].map(summarize).sort(bestFirst)
}
