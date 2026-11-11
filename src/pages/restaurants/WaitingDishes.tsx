import { Link } from 'react-router-dom'
import { Plate } from '../../components/Plate'
import { VerdictPill } from '../../components/VerdictPill'
import { COMMON_COPY } from '../../copy/common'
import { joinParts } from '../../copy/joinParts'
import { shortDate } from '../../copy/labels'
import { photoDishId } from '../../domain/dishPhoto'
import { restaurantsStackVisitPath } from '../../navigation/paths'
import { RESTAURANTS_COPY } from './copy'
import type { Waiting } from './waitingDishes'

const HEADING_ID = 'waiting-dishes-heading'

export function WaitingDishes({ waiting }: { waiting: Waiting }) {
  return (
    <section className="tile waiting-dishes" aria-labelledby={HEADING_ID}>
      <h2 id={HEADING_ID} className="waiting-heading">
        {RESTAURANTS_COPY.waitingTitle}{' '}
        {waiting.sharedVisit && (
          <span className="secondary-text">
            {joinParts([waiting.sharedVisit.restaurantName, shortDate(waiting.sharedVisit.visitedOn)])}
          </span>
        )}
      </h2>
      <div className="waiting-row">
        {waiting.shown.map(({ dish, restaurantName }) => (
          <Link key={dish.id} className="waiting-dish" to={restaurantsStackVisitPath(dish.visitId)}>
            <Plate name={dish.name} photoDishId={photoDishId(dish)} verdict={undefined} size="medium" />
            <span className="waiting-dish-text">
              <span className="waiting-dish-name">{dish.name}</span>
              {!waiting.sharedVisit && <span className="secondary-text">{restaurantName}</span>}
              <span className="waiting-dish-meta secondary-text">
                {dish.price !== undefined && COMMON_COPY.shekels(dish.price)}
                <VerdictPill verdict={undefined} />
              </span>
            </span>
          </Link>
        ))}
        {waiting.hiddenCount > 0 && (
          <span className="waiting-more secondary-text">{RESTAURANTS_COPY.moreWaiting(waiting.hiddenCount)}</span>
        )}
      </div>
    </section>
  )
}
