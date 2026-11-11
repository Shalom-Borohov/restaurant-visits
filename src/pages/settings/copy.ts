import { COMMON_COPY } from '../../copy/common'
import { joinParts } from '../../copy/joinParts'

export const SETTINGS_COPY = {
  title: COMMON_COPY.settings,
  backup: 'גיבוי',
  storageNote:
    'הגיבוי הוא קובץ zip אחד עם כל המסעדות, הביקורים, המנות והתמונות. הנתונים שמורים רק בטלפון הזה, אז כדאי לייצא גיבוי מדי פעם.',
  counts: (restaurants: number, visits: number, photos: number) =>
    joinParts([COMMON_COPY.restaurantCount(restaurants), COMMON_COPY.visitCount(visits), COMMON_COPY.photoCount(photos)]),
  exportBackup: 'ייצוא גיבוי',
  backupReady: 'הגיבוי מוכן לשיתוף.',
  share: 'שיתוף',
  restoreBackup: 'שחזור מגיבוי',
  backupFile: 'קובץ גיבוי',
  restoreWarning: 'השחזור יחליף את כל המסעדות, הביקורים והתמונות שבטלפון בתוכן הגיבוי. אי אפשר לבטל את זה.',
  confirmRestore: 'החלפת הכול',
  backupRestored: 'הגיבוי שוחזר',
  invalidBackup: 'הקובץ אינו גיבוי תקין',
  version: (version: string) => `גרסה ${version}`,
} as const
