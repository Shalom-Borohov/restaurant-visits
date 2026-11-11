import { useId } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { joinParts } from '../../copy/joinParts'
import { longDate, RETURN_LABELS } from '../../copy/labels'
import { lastVisitedOn } from '../../domain/lists'
import type { Restaurant, Visit } from '../../domain/types'
import { RESTAURANT_COPY } from './copy'

type RestaurantSummaryProps = {
  restaurant: Restaurant
  visits: Visit[]
  headingRef: (element: HTMLElement | null) => void
  onEdit: () => void
}

export function RestaurantSummary({ restaurant, visits, headingRef, onEdit }: RestaurantSummaryProps) {
  const headingId = useId()
  const place = joinParts([restaurant.city, restaurant.cuisine])
  const latestVisitDate = lastVisitedOn(visits, restaurant.id)

  return (
    <section className="tile restaurant-summary" aria-labelledby={headingId}>
      <div className="restaurant-summary-top">
        <h1 ref={headingRef} id={headingId} className="restaurant-summary-name" dir="auto">
          {restaurant.name}
        </h1>
        <button type="button" className="choice" onClick={onEdit}>
          {RESTAURANT_COPY.edit}
        </button>
      </div>
      {place && <p className="restaurant-summary-line">{place}</p>}
      {latestVisitDate && (
        <p className="restaurant-summary-line">
          {joinParts([RESTAURANT_COPY.lastVisit(longDate(latestVisitDate)), COMMON_COPY.visitCount(visits.length)])}
        </p>
      )}
      {restaurant.wouldReturn && (
        <p className={`return-word return-word-${restaurant.wouldReturn}`}>{RETURN_LABELS[restaurant.wouldReturn]}</p>
      )}
      {restaurant.note && (
        <p className="restaurant-summary-note" dir="auto">
          {restaurant.note}
        </p>
      )}
    </section>
  )
}
