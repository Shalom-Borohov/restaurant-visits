import type { RestaurantCard } from './restaurantCards'
import { RestaurantRow } from './RestaurantRow'

export function RestaurantList({ cards }: { cards: RestaurantCard[] }) {
  return (
    <ul className="list-panel restaurants-panel">
      {cards.map((card) => (
        <RestaurantRow key={card.restaurant.id} card={card} />
      ))}
    </ul>
  )
}
