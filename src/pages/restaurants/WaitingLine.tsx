import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DishPhoto } from '../../components/DishPhoto'
import { OpenIcon } from '../../components/icons'
import { photoDishId } from '../../domain/dishPhoto'
import { restaurantsStackVisitPath } from '../../navigation/paths'
import { RESTAURANTS_COPY } from './copy'
import type { Waiting } from './waitingDishes'
import { WaitingSheet } from './WaitingSheet'

const LINE_PHOTO_LIMIT = 2

function LineContent({ waiting }: { waiting: Waiting }) {
  const photographed = waiting.dishes.filter(({ dish }) => dish.hasPhoto).slice(0, LINE_PHOTO_LIMIT)

  return (
    <>
      <span className="waiting-dot" aria-hidden="true" />
      {photographed.length > 0 && (
        <span className="waiting-photos" aria-hidden="true">
          {photographed.map(({ dish }) => (
            <DishPhoto key={dish.id} photoDishId={photoDishId(dish)} name={dish.name} size="mini" />
          ))}
        </span>
      )}
      <span className="waiting-text">{RESTAURANTS_COPY.waitingLine(waiting.dishes.length)}</span>
      <OpenIcon />
    </>
  )
}

export function WaitingLine({ waiting }: { waiting: Waiting }) {
  const [sheetOpen, setSheetOpen] = useState(false)

  if (waiting.sharedVisitId) {
    return (
      <Link className="waiting-line" to={restaurantsStackVisitPath(waiting.sharedVisitId)}>
        <LineContent waiting={waiting} />
      </Link>
    )
  }

  return (
    <>
      <button type="button" className="waiting-line" onClick={() => setSheetOpen(true)}>
        <LineContent waiting={waiting} />
      </button>
      <WaitingSheet isOpen={sheetOpen} dishes={waiting.dishes} onClose={() => setSheetOpen(false)} />
    </>
  )
}
