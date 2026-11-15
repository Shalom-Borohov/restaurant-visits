import { useId } from 'react'
import { CheckIcon } from '../../components/icons'
import { COMMON_COPY } from '../../copy/common'
import { joinParts } from '../../copy/joinParts'
import { RETURN_LABELS } from '../../copy/labels'
import type { Restaurant, Visit } from '../../domain/types'

type RestaurantSummaryProps = {
  restaurant: Restaurant
  visits: Visit[]
  headingRef: (element: HTMLElement | null) => void
}

export function RestaurantSummary({ restaurant, visits, headingRef }: RestaurantSummaryProps) {
  const headingId = useId()

  const facts = joinParts([
    restaurant.city,
    restaurant.cuisine,
    visits.length > 0 ? COMMON_COPY.visitCount(visits.length) : undefined,
  ])

  return (
    <section className="restaurant-summary" aria-labelledby={headingId}>
      <h1 ref={headingRef} id={headingId} className="restaurant-name" dir="auto">
        {restaurant.name}
      </h1>
      {facts && <p className="restaurant-facts">{facts}</p>}
      {restaurant.wouldReturn && (
        <p className="return-chip">
          {restaurant.wouldReturn === 'yes' && <CheckIcon />}
          {RETURN_LABELS[restaurant.wouldReturn]}
        </p>
      )}
      {restaurant.note && (
        <p className="restaurant-note" dir="auto">
          {restaurant.note}
        </p>
      )}
    </section>
  )
}
