import { useIonRouter } from '@ionic/react'
import { Plate } from '../../components/Plate'
import { VerdictPill } from '../../components/VerdictPill'
import { COMMON_COPY } from '../../copy/common'
import type { DishSummary } from '../../domain/restaurantDishes'
import { restaurantsStackVisitPath } from '../../navigation/paths'
import { RESTAURANT_COPY } from './copy'

const SINGLE_ORDER = 1

export function DishStack({ summaries }: { summaries: DishSummary[] }) {
  const router = useIonRouter()

  return (
    <section className="tile">
      <h2>{RESTAURANT_COPY.whatToOrder}</h2>
      {summaries.length === 0 && <p className="empty-note">{RESTAURANT_COPY.noDishes}</p>}
      <ul className="dish-stack">
        {summaries.map((summary) => (
          <li key={summary.latestDishId}>
            <button type="button" className="dish-row" onClick={() => router.push(restaurantsStackVisitPath(summary.latestVisitId))}>
              <Plate name={summary.name} photoDishId={summary.photoDishId} verdict={summary.verdict} size="large" />
              <span className="dish-row-text">
                <span className="dish-row-name" dir="auto">
                  {summary.name}
                </span>
                <span className="dish-row-meta">
                  <VerdictPill verdict={summary.verdict} />
                  {summary.price !== undefined && <span>{COMMON_COPY.shekels(summary.price)}</span>}
                </span>
                {summary.orderCount > SINGLE_ORDER && (
                  <span className="secondary-text">{RESTAURANT_COPY.orderedTimes(summary.orderCount)}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
