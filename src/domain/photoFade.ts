import type { Verdict } from './types'

export type PhotoFade = 'dim' | 'dark'

const FADE_BY_VERDICT: Partial<Record<Verdict, PhotoFade>> = {
  weak: 'dim',
  avoid: 'dark',
}

export const photoFadeForVerdict = (verdict: Verdict | undefined): PhotoFade | undefined =>
  verdict === undefined ? undefined : FADE_BY_VERDICT[verdict]
