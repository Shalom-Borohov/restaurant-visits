import { DishPhoto, DishPhotoImage } from '../../components/DishPhoto'
import { usePhotoUrl } from '../../photo/usePhotoUrl'
import { Shekels } from '../../components/Shekels'
import { VerdictWord } from '../../components/VerdictWord'
import { photoFadeForVerdict } from '../../domain/photoFade'
import type { DishSummary } from '../../domain/restaurantDishes'
import { RESTAURANT_COPY } from './copy'

type DishItemProps = {
  summary: DishSummary
  onOpen: () => void
}

const SINGLE_ORDER = 1

function DishName({ summary }: { summary: DishSummary }) {
  return (
    <span className="restaurant-dish-name-line">
      <span className="restaurant-dish-name" dir="auto">
        {summary.name}
      </span>
      {summary.orderCount > SINGLE_ORDER && (
        <bdi className="restaurant-dish-count" dir="ltr">
          {RESTAURANT_COPY.orderCount(summary.orderCount)}
        </bdi>
      )}
    </span>
  )
}

function DishPrice({ price }: { price: number | undefined }) {
  if (price === undefined) {
    return null
  }

  return <Shekels className="restaurant-dish-price" amount={price} />
}

export function MustOrderTile({ summary, onOpen }: DishItemProps) {
  return (
    <button type="button" className="must-order-tile" onClick={onOpen}>
      <DishPhotoImage url={usePhotoUrl(summary.photoDishId)} name={summary.name} size="tile" />
      <DishName summary={summary} />
      <span className="must-order-line">
        <VerdictWord verdict={summary.verdict} />
        <DishPrice price={summary.price} />
      </span>
    </button>
  )
}

export function DishRow({ summary, onOpen }: DishItemProps) {
  return (
    <button
      type="button"
      className={summary.verdict ? `restaurant-dish restaurant-dish-${summary.verdict}` : 'restaurant-dish'}
      onClick={onOpen}
    >
      <DishPhoto
        photoDishId={summary.photoDishId}
        name={summary.name}
        size="small"
        fade={photoFadeForVerdict(summary.verdict)}
      />
      <DishName summary={summary} />
      <VerdictWord verdict={summary.verdict} />
      <DishPrice price={summary.price} />
    </button>
  )
}
