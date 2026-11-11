import { Link } from 'react-router-dom'
import { Plate } from '../../components/Plate'
import { VerdictPill } from '../../components/VerdictPill'
import { photoDishId } from '../../domain/dishPhoto'
import { type DishMatch, searchAll } from '../../domain/search'
import type { Records } from '../../domain/types'
import { restaurantPath } from '../../navigation/paths'
import { RESTAURANTS_COPY } from './copy'
import type { RestaurantCard } from './restaurantCards'
import { RestaurantTile } from './RestaurantTile'

type SearchResultsProps = {
  query: string
  records: Records
  cards: RestaurantCard[]
}

function DishResult({ match }: { match: DishMatch }) {
  const { dish, restaurant } = match

  return (
    <Link className="tile dish-result" to={restaurantPath(restaurant.id)}>
      <Plate name={dish.name} photoDishId={photoDishId(dish)} verdict={dish.verdict} size="medium" />
      <span className="dish-result-text">
        <span className="dish-result-name">{dish.name}</span>
        <span className="secondary-text">{restaurant.name}</span>
      </span>
      <VerdictPill verdict={dish.verdict} />
    </Link>
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
        <section className="page-stack search-group">
          <h2 className="search-group-heading">{RESTAURANTS_COPY.restaurantResults}</h2>
          {foundCards.map((card) => (
            <RestaurantTile key={card.restaurant.id} card={card} />
          ))}
        </section>
      )}
      {found.dishes.length > 0 && (
        <section className="page-stack search-group">
          <h2 className="search-group-heading">{RESTAURANTS_COPY.dishResults}</h2>
          {found.dishes.map((match) => (
            <DishResult key={match.dish.id} match={match} />
          ))}
        </section>
      )}
    </>
  )
}
