import { COMMON_COPY } from '../../copy/common'

export const RESTAURANT_COPY = {
  whatToOrder: 'מה להזמין',
  noDishes: 'עוד אין מנות',
  orderedTimes: (count: number) => `הוזמן ${count} פעמים`,
  lastVisit: (date: string) => `ביקור אחרון ${date}`,
  edit: 'עריכה',
  editTitle: 'עריכת מסעדה',
  nameField: 'שם',
  wouldReturnField: 'לחזור לשם?',
  noteField: 'הערה',
  notePlaceholder: 'להזמין מקום, שירות איטי…',
  visits: COMMON_COPY.visits,
  noVisits: 'עוד אין ביקורים',
  newVisitHere: 'ביקור חדש כאן',
  deleteRestaurant: 'מחיקת המסעדה',
  deleteQuestion: (name: string) => `למחוק את ${name}?`,
  deleteWarning: 'גם הביקורים והמנות שלה יימחקו.',
  notFound: 'המסעדה לא נמצאה',
} as const
