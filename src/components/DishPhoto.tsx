import type { PhotoFade } from '../domain/photoFade'
import { useThumbnailUrl } from '../photo/usePhotoUrl'
import { PlateIcon } from './icons'
import './DishPhoto.css'

type DishPhotoSize = 'hero' | 'tile' | 'row' | 'small' | 'mini'

type DishPhotoImageProps = {
  url: string | undefined
  name: string
  size: DishPhotoSize
  fade?: PhotoFade
}

type DishPhotoProps = Omit<DishPhotoImageProps, 'url'> & {
  photoDishId: string | undefined
}

export function DishPhotoImage({ url, name, size, fade }: DishPhotoImageProps) {
  const fadeClass = fade ? ` dish-photo-fade-${fade}` : ''

  return (
    <span className={`dish-photo dish-photo-${size}${fadeClass}`}>
      {url ? (
        <img src={url} alt={name} />
      ) : (
        <span className="dish-photo-missing" aria-hidden="true">
          <PlateIcon />
        </span>
      )}
    </span>
  )
}

export function DishPhoto({ photoDishId, ...photoProps }: DishPhotoProps) {
  return <DishPhotoImage url={useThumbnailUrl(photoDishId)} {...photoProps} />
}
