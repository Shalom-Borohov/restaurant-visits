import { PhotoInputs } from '../../components/PhotoInputs'
import { PlateImage } from '../../components/Plate'
import { photoDishId } from '../../domain/dishPhoto'
import type { Dish, Verdict } from '../../domain/types'
import { objectUrlOf } from '../../photo/objectUrl'
import { usePhotoUrl } from '../../photo/usePhotoUrl'
import { DISH_COPY } from './copy'
import type { PhotoChange } from './dishForm'

type DishPhotoAreaProps = {
  dish: Dish | undefined
  name: string
  verdict: Verdict | undefined
  photo: PhotoChange
  isShrinking: boolean
  onPick: (file: File) => void
  onRemove: () => void
}

const keptPhotoDishId = (dish: Dish | undefined, photo: PhotoChange) =>
  dish && photo.kind === 'kept' ? photoDishId(dish) : undefined

export function DishPhotoArea({ dish, name, verdict, photo, isShrinking, onPick, onRemove }: DishPhotoAreaProps) {
  const keptUrl = usePhotoUrl(keptPhotoDishId(dish, photo))
  const shownUrl = photo.kind === 'picked' ? objectUrlOf(photo.taken.photo) : keptUrl

  return (
    <div className="dish-sheet-photo" aria-busy={isShrinking}>
      <PlateImage url={shownUrl} name={name} verdict={verdict} size="hero" />
      <PhotoInputs cameraLabel={DISH_COPY.camera} libraryLabel={DISH_COPY.library} onPick={onPick} />
      {shownUrl && (
        <button type="button" className="dish-sheet-remove-photo" onClick={onRemove}>
          {DISH_COPY.removePhoto}
        </button>
      )}
    </div>
  )
}
