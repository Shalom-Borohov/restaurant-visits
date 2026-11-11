import { useLiveQuery } from 'dexie-react-hooks'
import { useContext } from 'react'
import { RecordsContext } from './recordsContext'
import { dishPhoto, dishThumbnail } from './repo'

export function useRecords() {
  return useContext(RecordsContext)
}

export function useDishPhoto(dishId: string | undefined) {
  return useLiveQuery(() => (dishId ? dishPhoto(dishId) : undefined), [dishId])
}

export function useDishThumbnail(dishId: string | undefined) {
  return useLiveQuery(() => (dishId ? dishThumbnail(dishId) : undefined), [dishId])
}
