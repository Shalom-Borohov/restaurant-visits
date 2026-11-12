const SINGLE = 1

export const COMMON_COPY = {
  restaurants: 'מסעדות',
  visits: 'ביקורים',
  settings: 'הגדרות',
  city: 'עיר',
  cuisine: 'מטבח',
  back: 'חזרה',
  cancel: 'ביטול',
  close: 'סגירה',
  save: 'שמירה',
  delete: 'מחיקה',
  newVisit: 'ביקור חדש',
  actionFailed: 'הפעולה לא הצליחה',
  separator: ' · ',
  shekels: (amount: number) => `₪${amount.toLocaleString('he-IL')}`,
  dishCount: (count: number) => (count === SINGLE ? 'מנה אחת' : `${count} מנות`),
  visitCount: (count: number) => (count === SINGLE ? 'ביקור אחד' : `${count} ביקורים`),
  restaurantCount: (count: number) => (count === SINGLE ? 'מסעדה אחת' : `${count} מסעדות`),
  photoCount: (count: number) => (count === SINGLE ? 'תמונה אחת' : `${count} תמונות`),
} as const
