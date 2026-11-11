import { COMMON_COPY } from '../../copy/common'

export const RESTAURANTS_COPY = {
  title: COMMON_COPY.restaurants,
  searchPlaceholder: 'חיפוש מסעדה או מנה',
  noRestaurants: 'עוד אין כאן מסעדות. הראשונה נרשמת מ״ביקור חדש״ למטה.',
  noDishes: 'אין מנות עדיין',
  notFound: 'לא נמצא',
  restaurantResults: COMMON_COPY.restaurants,
  dishResults: 'מנות',
  waitingTitle: 'מחכות לדירוג',
  moreWaiting: (count: number) => `ועוד ${count}`,
} as const
