import { useDishPhoto, useDishThumbnail } from '../data/hooks'
import { objectUrlOf } from './objectUrl'

export function usePhotoUrl(dishId: string | undefined) {
  const bytes = useDishPhoto(dishId)

  return bytes ? objectUrlOf(bytes) : undefined
}

export function useThumbnailUrl(dishId: string | undefined) {
  const bytes = useDishThumbnail(dishId)

  return bytes ? objectUrlOf(bytes) : undefined
}
