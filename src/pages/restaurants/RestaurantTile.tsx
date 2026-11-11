import { Link } from 'react-router-dom'
import { Plate } from '../../components/Plate'
import { VerdictPill } from '../../components/VerdictPill'
import { joinParts } from '../../copy/joinParts'
import { shortDate } from '../../copy/labels'
import type { DishSummary } from '../../domain/restaurantDishes'
import { restaurantPath } from '../../navigation/paths'
import { RESTAURANTS_COPY } from './copy'
import type { RestaurantCard } from './restaurantCards'

function LeadPlate({ best }: { best: DishSummary | undefined }) {
  if (!best) {
    return (
      <span className="lead-plate">
        <Plate name={RESTAURANTS_COPY.noDishes} photoDishId={undefined} verdict={undefined} size="large" />
      </span>
    )
  }

  return (
    <span className="lead-plate">
      <Plate name={best.name} photoDishId={best.photoDishId} verdict={best.verdict} size="large" />
      <VerdictPill verdict={best.verdict} />
    </span>
  )
}

export function RestaurantTile({ card }: { card: RestaurantCard }) {
  const { restaurant, lastVisitedOn, best, worst } = card
  const place = joinParts([restaurant.city, restaurant.cuisine])

  return (
    <Link className="tile restaurant-tile" to={restaurantPath(restaurant.id)}>
      <LeadPlate best={best} />
      <span className="restaurant-info">
        <span className="restaurant-top">
          <span className="restaurant-name">{restaurant.name}</span>
          {lastVisitedOn && <span className="secondary-text">{shortDate(lastVisitedOn)}</span>}
        </span>
        {place && <span className="restaurant-place secondary-text">{place}</span>}
        {best ? (
          <span className={`best-dish best-dish-${best.verdict ?? 'unrated'}`}>{best.name}</span>
        ) : (
          <span className="restaurant-place secondary-text">{RESTAURANTS_COPY.noDishes}</span>
        )}
        {worst && (
          <span className="worst-dish">
            <Plate name={worst.name} photoDishId={worst.photoDishId} verdict={worst.verdict} size="small" />
            <span className="worst-dish-name">{worst.name}</span>
            <VerdictPill verdict={worst.verdict} />
          </span>
        )}
      </span>
    </Link>
  )
}
