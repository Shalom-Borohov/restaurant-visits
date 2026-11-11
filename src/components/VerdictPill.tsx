import { UNRATED_LABEL, VERDICT_LABELS } from '../copy/labels'
import type { Verdict } from '../domain/types'
import './Plate.css'

export function VerdictPill({ verdict }: { verdict: Verdict | undefined }) {
  return (
    <span className={`verdict-pill verdict-pill-${verdict ?? 'unrated'}`}>
      {verdict ? VERDICT_LABELS[verdict] : UNRATED_LABEL}
    </span>
  )
}
