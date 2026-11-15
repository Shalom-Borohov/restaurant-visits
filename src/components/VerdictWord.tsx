import { UNRATED_LABEL, VERDICT_LABELS } from '../copy/labels'
import type { Verdict } from '../domain/types'
import './VerdictWord.css'

const UNRATED = 'unrated'

export function VerdictWord({ verdict }: { verdict: Verdict | undefined }) {
  return (
    <span className={`verdict-word verdict-word-${verdict ?? UNRATED}`}>
      {verdict ? VERDICT_LABELS[verdict] : UNRATED_LABEL}
    </span>
  )
}
