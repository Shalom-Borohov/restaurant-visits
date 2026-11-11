import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Plate } from '../../components/Plate'
import { COMMON_COPY } from '../../copy/common'
import { shortDate } from '../../copy/labels'
import { visitDetails } from '../../copy/visitDetails'
import { photoDishId } from '../../domain/dishPhoto'
import { visitTotal } from '../../domain/lists'
import { visitsStackVisitPath } from '../../navigation/paths'
import { VISITS_COPY } from './copy'
import type { VisitSummary } from './visitMonths'

const MAX_PLATES = 4

const FIRST_DETAIL = 0

function VisitPlates({ dishes }: { dishes: VisitSummary['dishes'] }) {
  const hiddenCount = dishes.length - MAX_PLATES

  return (
    <span className="visit-plates">
      {dishes.slice(0, MAX_PLATES).map((dish) => (
        <Plate key={dish.id} name={dish.name} photoDishId={photoDishId(dish)} verdict={undefined} size="small" isPlainRim />
      ))}
      {hiddenCount > 0 && <span className="visit-more">{VISITS_COPY.moreDishes(hiddenCount)}</span>}
    </span>
  )
}

export function VisitRow({ summary }: { summary: VisitSummary }) {
  const { visit, restaurantName, dishes } = summary
  const total = visitTotal(dishes)
  const details = [...visitDetails(visit, dishes), ...(total === undefined ? [] : [COMMON_COPY.shekels(total)])]

  return (
    <Link className="tile visit-row" to={visitsStackVisitPath(visit.id)}>
      <span className="visit-top">
        <span className="visit-restaurant">{restaurantName}</span>
        <span className="visit-date secondary-text">{shortDate(visit.visitedOn)}</span>
      </span>
      <span className="visit-details secondary-text">
        {details.map((detail, index) => (
          <Fragment key={detail}>
            {index > FIRST_DETAIL && <span aria-hidden="true">{COMMON_COPY.separator}</span>}
            <span>{detail}</span>
          </Fragment>
        ))}
      </span>
      {dishes.length > 0 && <VisitPlates dishes={dishes} />}
    </Link>
  )
}
