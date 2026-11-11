import { createContext } from 'react'
import type { Records } from '../domain/types'
import { allDishes, allRestaurants, allVisits } from './repo'

export const RecordsContext = createContext<Records | undefined>(undefined)

export async function allRecords(): Promise<Records> {
  const [restaurants, visits, dishes] = await Promise.all([allRestaurants(), allVisits(), allDishes()])

  return { restaurants, visits, dishes }
}
