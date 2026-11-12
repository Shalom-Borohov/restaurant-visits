import { SETTINGS_COPY } from './copy'
import { type PhoneState, phoneStateLines } from './phoneState'

export const FEEDBACK_KINDS = ['bug', 'idea'] as const

export type FeedbackKind = (typeof FEEDBACK_KINDS)[number]

type FeedbackLink = {
  url: string
  isCut: boolean
}

const ISSUES_URL = 'https://github.com/Shalom-Borohov/restaurant-visits/issues/new'

const ISSUE_LABELS: Record<FeedbackKind, string> = { bug: 'bug', idea: 'feature' }

const MAX_TITLE = 80

const MAX_LINK_LENGTH = 4300

const GRAPHEMES = new Intl.Segmenter()

const graphemes = (text: string) => Array.from(GRAPHEMES.segment(text), ({ segment }) => segment)

function issueTitle(report: string) {
  const [firstLine] = report.split('\n')
  const characters = graphemes(firstLine)

  return characters.length > MAX_TITLE ? `${characters.slice(0, MAX_TITLE - 1).join('')}…` : firstLine
}

export function feedbackLink(kind: FeedbackKind, text: string, phone: PhoneState): FeedbackLink {
  const report = text.trim()
  const title = issueTitle(report)

  const deviceLines = [
    navigator.userAgent,
    SETTINGS_COPY.issueVersion(__APP_VERSION__, __APP_BUILT_AT__),
    ...phoneStateLines(phone),
  ]

  const issueUrl = (body: string) => {
    const params = new URLSearchParams({
      title,
      body: SETTINGS_COPY.issueBody(body, deviceLines),
      labels: ISSUE_LABELS[kind],
    })

    return `${ISSUES_URL}?${params}`
  }

  const whole = issueUrl(report)

  if (whole.length <= MAX_LINK_LENGTH) {
    return { url: whole, isCut: false }
  }

  const characters = graphemes(report.slice(0, MAX_LINK_LENGTH))
  const cutAfter = (count: number) => issueUrl(`${characters.slice(0, count).join('')}${SETTINGS_COPY.issueCutMarker}`)
  let fits = 0
  let tooLong = characters.length

  while (tooLong - fits > 1) {
    const middle = Math.floor((fits + tooLong) / 2)

    if (cutAfter(middle).length <= MAX_LINK_LENGTH) {
      fits = middle
    } else {
      tooLong = middle
    }
  }

  return { url: cutAfter(fits), isCut: true }
}
