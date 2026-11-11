import { useIonRouter } from '@ionic/react'
import { CameraPlate } from '../../components/CameraPlate'
import { useConfirmDelete } from '../../components/useConfirmDelete'
import { deleteRestaurant } from '../../data/repo'
import type { Restaurant } from '../../domain/types'
import { newVisitAtPath, RESTAURANTS_PATH } from '../../navigation/paths'
import { RESTAURANT_COPY } from './copy'

export function NewVisitHereButton({ restaurantId }: { restaurantId: string }) {
  const router = useIonRouter()

  return (
    <button
      type="button"
      className="new-visit-here"
      aria-label={RESTAURANT_COPY.newVisitHere}
      onClick={() => router.push(newVisitAtPath(restaurantId))}
    >
      <CameraPlate />
    </button>
  )
}

export function DeleteRestaurantButton({ restaurant }: { restaurant: Restaurant }) {
  const router = useIonRouter()
  const confirmDeletion = useConfirmDelete()

  function confirmDelete() {
    confirmDeletion({
      header: RESTAURANT_COPY.deleteQuestion(restaurant.name),
      message: RESTAURANT_COPY.deleteWarning,
      remove: () => deleteRestaurant(restaurant.id),
      onDeleted: () => router.push(RESTAURANTS_PATH, 'back', 'replace'),
    })
  }

  return (
    <button type="button" className="danger-button delete-restaurant" onClick={confirmDelete}>
      {RESTAURANT_COPY.deleteRestaurant}
    </button>
  )
}
