import { useIonRouter } from '@ionic/react'
import { useId } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { joinParts } from '../../copy/joinParts'
import { longDate } from '../../copy/labels'
import { visitDetails } from '../../copy/visitDetails'
import { dishesByVisit, visitsNewestFirst, visitTotal } from '../../domain/lists'
import type { Dish, Visit } from '../../domain/types'
import { restaurantsStackVisitPath } from '../../navigation/paths'
import { RESTAURANT_COPY } from './copy'

type VisitListProps = {
  visits: Visit[]
  dishes: Dish[]
}

const NO_DISHES: Dish[] = []

export function VisitList({ visits, dishes }: VisitListProps) {
  const router = useIonRouter()
  const headingId = useId()
  const dishesOfVisits = dishesByVisit(dishes)

  return (
    <section className="tile" aria-labelledby={headingId}>
      <h2 id={headingId}>{RESTAURANT_COPY.visits}</h2>
      {visits.length === 0 && <p className="empty-note">{RESTAURANT_COPY.noVisits}</p>}
      <ul className="visit-list">
        {visitsNewestFirst(visits).map((visit) => {
          const visitDishes = dishesOfVisits.get(visit.id) ?? NO_DISHES
          const total = visitTotal(visitDishes)

          return (
            <li key={visit.id}>
              <button type="button" className="restaurant-visit" onClick={() => router.push(restaurantsStackVisitPath(visit.id))}>
                <span className="restaurant-visit-date">{longDate(visit.visitedOn)}</span>
                <span className="secondary-text">{joinParts(visitDetails(visit, visitDishes))}</span>
                {total !== undefined && <span className="restaurant-visit-total">{COMMON_COPY.shekels(total)}</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
