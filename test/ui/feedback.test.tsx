import { act, fireEvent, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetDb } from '../helpers/db'
import { modalDismissed } from '../helpers/overlays'
import { renderAt } from '../helpers/renderAt'

const ISSUES_URL = 'https://github.com/Shalom-Borohov/restaurant-visits/issues/new'

const OPENED_NOTE = 'אם GitHub לא נפתח, אפשר ללחוץ שוב או להעתיק את הטקסט.'

const OPEN_IN_GITHUB = { name: 'פתיחה ב-GitHub' }

const openInGitHub = () => screen.getByRole('button', OPEN_IN_GITHUB)

async function openReport() {
  renderAt('/tabs/settings')
  fireEvent.click(await screen.findByRole('button', { name: 'דיווח על באג / הצעה' }))
  await screen.findByRole('button', OPEN_IN_GITHUB)
}

function describeReport(text: string) {
  fireEvent.change(screen.getByLabelText('תיאור'), { target: { value: text } })
}

const stubOpenWindow = () => vi.spyOn(window, 'open').mockReturnValue(null)

const openedLink = (openWindow: ReturnType<typeof stubOpenWindow>) => new URL(String(openWindow.mock.calls[0][0]))

describe('feedback', () => {
  beforeEach(resetDb)

  afterEach(() => {
    vi.restoreAllMocks()
    Object.assign(navigator, { storage: undefined })
  })

  it('opens a bug report as a prefilled GitHub issue outside the app, only once there is text', async () => {
    const openWindow = stubOpenWindow()

    await openReport()

    expect(openInGitHub()).toBeDisabled()

    describeReport('התמונה לא נשמרה\nצילמתי מנה בביקור')
    fireEvent.click(openInGitHub())

    const link = openedLink(openWindow)

    expect(openWindow).toHaveBeenCalledWith(expect.any(String), '_blank', 'noopener')
    expect(`${link.origin}${link.pathname}`).toBe(ISSUES_URL)
    expect(link.searchParams.get('title')).toBe('התמונה לא נשמרה')
    expect(link.searchParams.get('labels')).toBe('bug')
    expect(link.searchParams.get('body')).toBe(
      `התמונה לא נשמרה\nצילמתי מנה בביקור\n\n### מכשיר\n${navigator.userAgent}\nגרסה: ${__APP_VERSION__} (${__APP_BUILT_AT__})\nאחסון קבוע: לא ידוע\nנפח בשימוש: לא ידוע\nאפליקציה מותקנת: לא`,
    )
  })

  it('opens a suggestion with the feature label', async () => {
    const openWindow = stubOpenWindow()

    await openReport()
    fireEvent.click(screen.getByRole('button', { name: 'הצעה' }))

    expect(screen.getByLabelText('תיאור')).toHaveAttribute('placeholder', 'מה היה עוזר לך?')

    describeReport('סינון לפי מחיר')
    fireEvent.click(openInGitHub())

    expect(openedLink(openWindow).searchParams.get('labels')).toBe('feature')
  })

  it('reports the storage the phone gives', async () => {
    const openWindow = stubOpenWindow()

    Object.assign(navigator, {
      storage: { persisted: async () => true, estimate: async () => ({ usage: 52_400_000 }) },
    })

    await openReport()
    await act(async () => {})
    describeReport('נעלמו תמונות')
    fireEvent.click(openInGitHub())

    expect(openedLink(openWindow).searchParams.get('body')).toMatch(/\nאחסון קבוע: כן\nנפח בשימוש: 52.4 MB\n/)
  })

  it('offers to close once GitHub opened, and says to tap again if it did not', async () => {
    stubOpenWindow()

    await openReport()

    expect(screen.getByText('ביטול')).toBeVisible()
    expect(screen.queryByText(OPENED_NOTE)).not.toBeInTheDocument()

    describeReport('הגיבוי לא נפתח')
    fireEvent.click(openInGitHub())

    expect(await screen.findByText(OPENED_NOTE)).toBeVisible()

    const dismissed = modalDismissed()

    fireEvent.click(screen.getByText('סגירה'))
    await dismissed

    expect(screen.queryByRole('button', OPEN_IN_GITHUB)).not.toBeInTheDocument()
  })

  it('warns that a report too long for the link will be cut', async () => {
    await openReport()

    expect(screen.queryByText(/הדיווח ארוך מדי לקישור/)).not.toBeInTheDocument()

    describeReport('כתבתי דיווח ארוך מאוד '.repeat(200))

    expect(await screen.findByText(/הדיווח ארוך מדי לקישור/)).toBeVisible()
  })
})
