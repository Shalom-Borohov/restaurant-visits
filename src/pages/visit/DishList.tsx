import { useId } from 'react'
import { DishPhoto } from '../../components/DishPhoto'
import { Shekels } from '../../components/Shekels'
import { VerdictWord } from '../../components/VerdictWord'
import { photoDishId } from '../../domain/dishPhoto'
import { visitTotal } from '../../domain/lists'
import { photoFadeForVerdict } from '../../domain/photoFade'
import type { Dish } from '../../domain/types'
import { VISIT_COPY } from './copy'

type DishListProps = {
  dishes: Dish[]
  onOpen: (dish: Dish) => void
}

const UNRATED = 'unrated'

function DishRow({ dish, onOpen }: { dish: Dish; onOpen: (dish: Dish) => void }) {
  return (
    <li>
      <button
        type="button"
        className={`visit-dish-row visit-dish-${dish.verdict ?? UNRATED}`}
        onClick={() => onOpen(dish)}
      >
        <DishPhoto
          name={dish.name}
          photoDishId={photoDishId(dish)}
          size="small"
          fade={photoFadeForVerdict(dish.verdict)}
        />
        <span className="visit-dish-name" dir="auto">
          {dish.name}
        </span>
        <VerdictWord verdict={dish.verdict} />
        {dish.price !== undefined && (
          <Shekels className="visit-dish-price" amount={dish.price} />
        )}
      </button>
    </li>
  )
}

export function DishList({ dishes, onOpen }: DishListProps) {
  const total = visitTotal(dishes)
  const headingId = useId()

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="section-heading">
        {VISIT_COPY.dishes}
      </h2>
      <ul className="tile list-panel visit-dishes">
        {dishes.length === 0 && <li className="visit-dishes-empty secondary-text">{VISIT_COPY.noDishesYet}</li>}
        {dishes.map((dish) => (
          <DishRow key={dish.id} dish={dish} onOpen={onOpen} />
        ))}
        {total !== undefined && (
          <li className="visit-total">
            <span className="visit-total-label">{VISIT_COPY.total}</span>
            <Shekels className="visit-total-amount" amount={total} />
          </li>
        )}
      </ul>
    </section>
  )
}
