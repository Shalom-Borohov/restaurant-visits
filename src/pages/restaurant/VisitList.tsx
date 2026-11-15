import { useIonRouter } from '@ionic/react'
import { useId } from 'react'
import { Shekels } from '../../components/Shekels'
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
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-heading">
        {RESTAURANT_COPY.visits}
      </h2>
      {visits.length === 0 && <p className="empty-note">{RESTAURANT_COPY.noVisits}</p>}
      {visits.length > 0 && (
        <ul className="list-panel">
          {visitsNewestFirst(visits).map((visit) => {
            const visitDishes = dishesOfVisits.get(visit.id) ?? NO_DISHES
            const total = visitTotal(visitDishes)

            return (
              <li key={visit.id}>
                <button
                  type="button"
                  className="restaurant-visit"
                  onClick={() => router.push(restaurantsStackVisitPath(visit.id))}
                >
                  <span className="restaurant-visit-date">{longDate(visit.visitedOn)}</span>
                  <span className="restaurant-visit-details">{joinParts(visitDetails(visit, visitDishes))}</span>
                  {total !== undefined && (
                    <Shekels className="restaurant-visit-total" amount={total} />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
