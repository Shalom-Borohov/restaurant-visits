import { useLiveQuery } from 'dexie-react-hooks'
import type { ReactNode } from 'react'
import { allRecords, RecordsContext } from './recordsContext'

export function RecordsProvider({ children }: { children: ReactNode }) {
  return <RecordsContext value={useLiveQuery(allRecords)}>{children}</RecordsContext>
}
