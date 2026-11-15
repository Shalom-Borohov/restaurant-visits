import { COMMON_COPY } from '../../copy/common'

export const VISITS_COPY = {
  title: COMMON_COPY.visits,
  empty: 'עדיין אין ביקורים. ביקור חדש נרשם מכפתור המצלמה למטה.',
  toRestaurants: 'למסעדות',
  moreDishes: (count: number) => `+${count}`,
} as const
