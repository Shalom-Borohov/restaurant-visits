import { Plate } from '../../components/Plate'
import { VerdictPill } from '../../components/VerdictPill'
import { COMMON_COPY } from '../../copy/common'
import { photoDishId } from '../../domain/dishPhoto'
import { visitTotal } from '../../domain/lists'
import type { Dish } from '../../domain/types'
import { VISIT_COPY } from './copy'

type DishListProps = {
  dishes: Dish[]
  onOpen: (dish: Dish) => void
}

export function DishList({ dishes, onOpen }: DishListProps) {
  const total = visitTotal(dishes)

  return (
    <section className="tile visit-dishes">
      <h2>{VISIT_COPY.dishes}</h2>
      {dishes.length === 0 && <p className="secondary-text">{VISIT_COPY.noDishesYet}</p>}
      <ul className="visit-dish-rows">
        {dishes.map((dish) => (
          <li key={dish.id}>
            <button type="button" className="visit-dish-row" onClick={() => onOpen(dish)}>
              <Plate name={dish.name} photoDishId={photoDishId(dish)} verdict={dish.verdict} size="large" />
              <span className="visit-dish-text">
                <span className="visit-dish-name" dir="auto">
                  {dish.name}
                </span>
                {dish.price !== undefined && <span className="secondary-text">{COMMON_COPY.shekels(dish.price)}</span>}
              </span>
              <VerdictPill verdict={dish.verdict} />
            </button>
          </li>
        ))}
      </ul>
      {total !== undefined && <p className="visit-total">{VISIT_COPY.total(total)}</p>}
    </section>
  )
}
