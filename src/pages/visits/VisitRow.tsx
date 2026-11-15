import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { DishPhoto } from '../../components/DishPhoto'
import { Shekels } from '../../components/Shekels'
import { COMMON_COPY } from '../../copy/common'
import { shortDate } from '../../copy/labels'
import { visitDetails } from '../../copy/visitDetails'
import { photoDishId } from '../../domain/dishPhoto'
import { visitTotal } from '../../domain/lists'
import { visitsStackVisitPath } from '../../navigation/paths'
import { VISITS_COPY } from './copy'
import type { VisitSummary } from './visitMonths'

const MAX_PHOTOS = 4

const FIRST_FACT = 0

function VisitPhotos({ dishes }: { dishes: VisitSummary['dishes'] }) {
  const hiddenCount = dishes.length - MAX_PHOTOS

  return (
    <span className="visits-photos">
      {dishes.slice(0, MAX_PHOTOS).map((dish) => (
        <DishPhoto key={dish.id} name={dish.name} photoDishId={photoDishId(dish)} size="mini" />
      ))}
      {hiddenCount > 0 && (
        <bdi className="visits-more" dir="ltr">
          {VISITS_COPY.moreDishes(hiddenCount)}
        </bdi>
      )}
    </span>
  )
}

export function VisitRow({ summary }: { summary: VisitSummary }) {
  const { visit, restaurantName, dishes } = summary
  const total = visitTotal(dishes)
  const facts = [shortDate(visit.visitedOn), ...visitDetails(visit, dishes)]

  return (
    <Link className="visits-row" to={visitsStackVisitPath(visit.id)}>
      <span className="visits-row-line">
        <span className="visits-restaurant">{restaurantName}</span>
        {total !== undefined && (
          <Shekels className="visits-total" amount={total} />
        )}
      </span>
      <span className="visits-row-line">
        <VisitPhotos dishes={dishes} />
        <span className="visits-facts">
          {facts.map((fact, position) => (
            <Fragment key={fact}>
              {position > FIRST_FACT && <span aria-hidden="true">{COMMON_COPY.separator}</span>}
              <span>{fact}</span>
            </Fragment>
          ))}
        </span>
      </span>
    </Link>
  )
}
