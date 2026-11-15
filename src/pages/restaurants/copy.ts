import { COMMON_COPY } from '../../copy/common'

const SINGLE = 1

export const RESTAURANTS_COPY = {
  title: COMMON_COPY.restaurants,
  searchPlaceholder: 'חיפוש מסעדה או מנה',
  noRestaurants: 'עוד אין כאן מסעדות. הראשונה נרשמת מכפתור המצלמה למטה.',
  notFound: 'לא נמצא',
  restaurantResults: COMMON_COPY.restaurants,
  dishResults: 'מנות',
  waitingTitle: 'מחכות לדירוג',
  waitingLine: (count: number) =>
    `${COMMON_COPY.dishCount(count)} ${count === SINGLE ? 'מחכה לדירוג' : 'מחכות לדירוג'}`,
} as const
