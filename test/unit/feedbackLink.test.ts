import { describe, expect, it } from 'vitest'
import { feedbackLink } from '../../src/pages/settings/feedbackUrl'

const LINK_LIMIT = 4300

const HEBREW_LETTER_IN_LINK = 6

const CUT_MARKER = '… (הדיווח נחתך כאן)'

const PHONE = { persisted: true, usedBytes: 1_234_567, installed: false }

const PHONE_LINES = 'אחסון קבוע: כן\nנפח בשימוש: 1.2 MB\nאפליקציה מותקנת: לא'

const deviceDetails = () =>
  `\n\n### מכשיר\n${navigator.userAgent}\nגרסה: ${__APP_VERSION__} (${__APP_BUILT_AT__})\n${PHONE_LINES}`

const params = (url: string) => new URL(url).searchParams

function bodyOf(url: string) {
  const body = params(url).get('body')

  if (body === null) {
    throw new Error('no body in the link')
  }

  return body
}

function longestReportThatFits() {
  let report = 'א'

  while (!feedbackLink('bug', `${report}א`, PHONE).isCut) {
    report += 'א'
  }

  return report
}

describe('feedbackLink', () => {
  it('sends a short report whole, as a new bug on restaurant-visits with the phone details', () => {
    const { url, isCut } = feedbackLink('bug', '  התמונה לא נשמרה\nצילמתי מנה בביקור  ', PHONE)
    const { origin, pathname } = new URL(url)

    expect(isCut).toBe(false)
    expect(`${origin}${pathname}`).toBe('https://github.com/Shalom-Borohov/restaurant-visits/issues/new')
    expect(bodyOf(url)).toBe(`התמונה לא נשמרה\nצילמתי מנה בביקור${deviceDetails()}`)
    expect(params(url).get('title')).toBe('התמונה לא נשמרה')
    expect(params(url).get('labels')).toBe('bug')
  })

  it('says "לא ידוע" for storage the phone does not report', () => {
    const { url } = feedbackLink('bug', 'נעלמו תמונות', { persisted: null, usedBytes: null, installed: true })

    expect(bodyOf(url)).toMatch(/\nאחסון קבוע: לא ידוע\nנפח בשימוש: לא ידוע\nאפליקציה מותקנת: כן$/)
  })

  it('shortens a first line over 80 characters to a 79-character title with an ellipsis', () => {
    const { url } = feedbackLink('bug', `${'א'.repeat(100)}\nפרטים`, PHONE)

    expect(params(url).get('title')).toBe(`${'א'.repeat(79)}…`)
  })

  it('does not break an emoji at the title cut', () => {
    const family = '👨‍👩‍👧'
    const { url } = feedbackLink('bug', `${'א'.repeat(78)}${family}${'ב'.repeat(10)}`, PHONE)

    expect(params(url).get('title')).toBe(`${'א'.repeat(78)}${family}…`)
  })

  it('cuts a long report to fit the link, marks the cut and keeps the device details', () => {
    const report = 'רעיון לסינון\n' + 'כתבתי הצעה ארוכה מאוד '.repeat(150)
    const { url, isCut } = feedbackLink('idea', report, PHONE)
    const [kept, afterMarker] = bodyOf(url).split(CUT_MARKER)

    expect(isCut).toBe(true)
    expect(url.length).toBeLessThanOrEqual(LINK_LIMIT)
    expect(report.startsWith(kept)).toBe(true)
    expect(kept.length).toBeGreaterThan(500)
    expect(afterMarker).toBe(deviceDetails())
    expect(params(url).get('title')).toBe('רעיון לסינון')
    expect(params(url).get('labels')).toBe('feature')
  })

  it('cuts only once a report no longer fits, and then uses all the room', () => {
    const report = longestReportThatFits()
    const whole = feedbackLink('bug', report, PHONE)
    const cut = feedbackLink('bug', `${report}א`, PHONE)

    expect(whole.url.length).toBeLessThanOrEqual(LINK_LIMIT)
    expect(bodyOf(whole.url)).toBe(`${report}${deviceDetails()}`)
    expect(cut.isCut).toBe(true)
    expect(cut.url.length).toBeLessThanOrEqual(LINK_LIMIT)
    expect(cut.url.length).toBeGreaterThan(LINK_LIMIT - HEBREW_LETTER_IN_LINK)
  })

  it.each([
    { name: 'an emoji', character: '😀' },
    { name: 'a flag', character: '🇮🇱' },
    { name: 'a family emoji', character: '👨‍👩‍👧' },
    { name: 'a letter with its vowel points', character: 'בְּ' },
  ])('does not break $name at the cut', ({ character }) => {
    const { url, isCut } = feedbackLink('bug', character.repeat(1000), PHONE)
    const [kept] = bodyOf(url).split(CUT_MARKER)

    expect(isCut).toBe(true)
    expect(kept.replaceAll(character, '')).toBe('')
  })

  it('uses all the room when a pasted report is far over the limit', () => {
    const { url, isCut } = feedbackLink('bug', 'a'.repeat(50_000), PHONE)

    expect(isCut).toBe(true)
    expect(url.length).toBe(LINK_LIMIT)
  })
})
