import { Link } from 'react-router-dom'
import { DishPhoto } from '../../components/DishPhoto'
import { VerdictWord } from '../../components/VerdictWord'
import { photoDishId } from '../../domain/dishPhoto'
import { photoFadeForVerdict } from '../../domain/photoFade'
import { type DishMatch, searchAll } from '../../domain/search'
import type { Records } from '../../domain/types'
import { restaurantPath } from '../../navigation/paths'
import { RESTAURANTS_COPY } from './copy'
import type { RestaurantCard } from './restaurantCards'
import { RestaurantList } from './RestaurantList'

type SearchResultsProps = {
  query: string
  records: Records
  cards: RestaurantCard[]
}

function DishResult({ match }: { match: DishMatch }) {
  const { dish, restaurant } = match

  return (
    <li>
      <Link className="restaurants-row restaurants-dish-row" to={restaurantPath(restaurant.id)}>
        <DishPhoto
          photoDishId={photoDishId(dish)}
          name={dish.name}
          size="small"
          fade={photoFadeForVerdict(dish.verdict)}
        />
        <span className="restaurants-row-text">
          <span className="restaurants-row-name restaurants-dish-name">{dish.name}</span>
          <span className="restaurants-row-meta">{restaurant.name}</span>
        </span>
        <VerdictWord verdict={dish.verdict} />
      </Link>
    </li>
  )
}

export function SearchResults({ query, records, cards }: SearchResultsProps) {
  const found = searchAll(query, records)
  const foundIds = new Set(found.restaurants.map((restaurant) => restaurant.id))
  const foundCards = cards.filter((card) => foundIds.has(card.restaurant.id))

  if (!foundCards.length && !found.dishes.length) {
    return <p className="empty-note">{RESTAURANTS_COPY.notFound}</p>
  }

  return (
    <>
      {foundCards.length > 0 && (
        <section>
          <h2 className="section-heading search-heading">{RESTAURANTS_COPY.restaurantResults}</h2>
          <RestaurantList cards={foundCards} />
        </section>
      )}
      {found.dishes.length > 0 && (
        <section>
          <h2 className="section-heading search-heading">{RESTAURANTS_COPY.dishResults}</h2>
          <ul className="list-panel restaurants-dish-panel">
            {found.dishes.map((match) => (
              <DishResult key={match.dish.id} match={match} />
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
