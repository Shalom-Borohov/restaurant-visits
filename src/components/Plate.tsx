import type { Verdict } from '../domain/types'
import { useThumbnailUrl } from '../photo/usePhotoUrl'
import './Plate.css'

type PlateSize = 'hero' | 'large' | 'medium' | 'small'

type PlateImageProps = {
  url: string | undefined
  name: string
  verdict: Verdict | undefined
  size: PlateSize
  isPlainRim?: boolean
}

type PlateProps = Omit<PlateImageProps, 'url'> & {
  photoDishId: string | undefined
}

const PLAIN_RIM = 'plain'

const UNRATED_RIM = 'unrated'

export function PlateImage({ url, name, verdict, size, isPlainRim }: PlateImageProps) {
  const rim = isPlainRim ? PLAIN_RIM : (verdict ?? UNRATED_RIM)

  return (
    <span className={`plate plate-${size} plate-rim-${rim}`}>
      {url ? <img src={url} alt={name} /> : <span className="plate-blank" aria-hidden="true" />}
    </span>
  )
}

export function Plate({ photoDishId, ...plateProps }: PlateProps) {
  return <PlateImage url={useThumbnailUrl(photoDishId)} {...plateProps} />
}
