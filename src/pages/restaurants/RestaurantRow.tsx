import { Link } from 'react-router-dom'
import { DishPhoto } from '../../components/DishPhoto'
import { joinParts } from '../../copy/joinParts'
import { RETURN_LABELS, shortDate } from '../../copy/labels'
import { type PhotoFade, photoFadeForVerdict } from '../../domain/photoFade'
import type { Restaurant } from '../../domain/types'
import { restaurantPath } from '../../navigation/paths'
import type { RestaurantCard } from './restaurantCards'

const NOT_RETURNING_FADE: PhotoFade = 'dark'

const isNotReturning = (restaurant: Restaurant) => restaurant.wouldReturn === 'no'

export function RestaurantRow({ card }: { card: RestaurantCard }) {
  const { restaurant, lastVisitedOn, bestPhoto } = card
  const notReturning = isNotReturning(restaurant)

  const place = joinParts([
    restaurant.city,
    restaurant.cuisine,
    notReturning ? RETURN_LABELS.no : undefined,
  ])

  return (
    <li>
      <Link
        className="restaurants-row restaurants-restaurant-row"
        data-would-return={restaurant.wouldReturn}
        to={restaurantPath(restaurant.id)}
      >
        <DishPhoto
          photoDishId={bestPhoto?.photoDishId}
          name={bestPhoto?.name ?? restaurant.name}
          size="row"
          fade={notReturning ? NOT_RETURNING_FADE : photoFadeForVerdict(bestPhoto?.verdict)}
        />
        <span className="restaurants-row-text">
          <span className="restaurants-row-top">
            <span className="restaurants-row-name">{restaurant.name}</span>
            {lastVisitedOn && <span className="restaurants-row-date">{shortDate(lastVisitedOn)}</span>}
          </span>
          {place && <span className="restaurants-row-meta">{place}</span>}
        </span>
      </Link>
    </li>
  )
}
