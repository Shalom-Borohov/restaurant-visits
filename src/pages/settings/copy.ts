import { COMMON_COPY } from '../../copy/common'
import { joinParts } from '../../copy/joinParts'

const BUILD_TIME = new Intl.DateTimeFormat('he-IL', { dateStyle: 'short', timeStyle: 'short' })

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
  version: (version: string, builtAt: string) =>
    joinParts([`גרסה ${version}`, `עודכנה ${BUILD_TIME.format(new Date(builtAt))}`]),
  feedback: 'משוב',
  reportBugOrIdea: 'דיווח על באג / הצעה',
  report: 'דיווח',
  kind: 'סוג',
  bug: 'באג',
  idea: 'הצעה',
  description: 'תיאור',
  bugPlaceholder: 'מה קרה, ומה ציפית שיקרה?',
  ideaPlaceholder: 'מה היה עוזר לך?',
  feedbackFooter: 'הדיווח נפתח ב-GitHub, עם פרטי המכשיר והגרסה. המסעדות, הביקורים והתמונות לא נשלחים.',
  openInGitHub: 'פתיחה ב-GitHub',
  feedbackOpened: 'אם GitHub לא נפתח, אפשר ללחוץ שוב או להעתיק את הטקסט.',
  feedbackTooLong: 'הדיווח ארוך מדי לקישור. ב-GitHub תופיע רק ההתחלה, ואת השאר אפשר להעתיק מכאן ולהדביק שם.',
  issueCutMarker: '… (הדיווח נחתך כאן)',
  issueBody: (text: string, deviceLines: string[]) => [`${text}\n\n### מכשיר`, ...deviceLines].join('\n'),
  issueVersion: (version: string, builtAt: string) => `גרסה: ${version} (${builtAt})`,
  persisted: (value: string) => `אחסון קבוע: ${value}`,
  storageUsed: (value: string) => `נפח בשימוש: ${value}`,
  installed: (value: string) => `אפליקציה מותקנת: ${value}`,
  megabytes: (amount: string) => `${amount} MB`,
  yes: 'כן',
  no: 'לא',
  unknown: 'לא ידוע',
} as const
