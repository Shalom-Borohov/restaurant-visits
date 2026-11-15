import { useIonRouter } from '@ionic/react'
import { type ReactNode, useId } from 'react'
import { type DishSummary, groupForRevisit } from '../../domain/restaurantDishes'
import { restaurantsStackVisitPath } from '../../navigation/paths'
import { RESTAURANT_COPY } from './copy'
import { DishRow, MustOrderTile } from './DishItems'

type OpenDish = (summary: DishSummary) => void

type DishSectionProps = {
  heading: string
  isSkip?: boolean
  children: ReactNode
}

function DishSection({ heading, isSkip, children }: DishSectionProps) {
  const headingId = useId()

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className={isSkip ? 'section-heading restaurant-heading-skip' : 'section-heading'}>
        {heading}
      </h2>
      {children}
    </section>
  )
}

function DishPanel({ summaries, onOpen }: { summaries: DishSummary[]; onOpen: OpenDish }) {
  if (summaries.length === 0) {
    return null
  }

  return (
    <ul className="list-panel restaurant-dish-panel">
      {summaries.map((summary) => (
        <li key={summary.latestDishId}>
          <DishRow summary={summary} onOpen={() => onOpen(summary)} />
        </li>
      ))}
    </ul>
  )
}

function MustOrderGrid({ summaries, onOpen }: { summaries: DishSummary[]; onOpen: OpenDish }) {
  if (summaries.length === 0) {
    return null
  }

  return (
    <ul className="must-order-grid">
      {summaries.map((summary) => (
        <li key={summary.latestDishId}>
          <MustOrderTile summary={summary} onOpen={() => onOpen(summary)} />
        </li>
      ))}
    </ul>
  )
}

export function DishGroups({ summaries }: { summaries: DishSummary[] }) {
  const router = useIonRouter()
  const { mustOrder, toOrder, toSkip, toRate } = groupForRevisit(summaries)
  const openLatestVisit = (summary: DishSummary) => router.push(restaurantsStackVisitPath(summary.latestVisitId))

  if (summaries.length === 0) {
    return <p className="empty-note">{RESTAURANT_COPY.noDishes}</p>
  }

  return (
    <>
      {(mustOrder.length > 0 || toOrder.length > 0) && (
        <DishSection heading={RESTAURANT_COPY.toOrder}>
          <MustOrderGrid summaries={mustOrder} onOpen={openLatestVisit} />
          <DishPanel summaries={toOrder} onOpen={openLatestVisit} />
        </DishSection>
      )}
      {toSkip.length > 0 && (
        <DishSection heading={RESTAURANT_COPY.toSkip} isSkip>
          <DishPanel summaries={toSkip} onOpen={openLatestVisit} />
        </DishSection>
      )}
      {toRate.length > 0 && (
        <DishSection heading={RESTAURANT_COPY.toRate}>
          <DishPanel summaries={toRate} onOpen={openLatestVisit} />
        </DishSection>
      )}
    </>
  )
}
