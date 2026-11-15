import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { addRestaurant, allVisits } from '../../src/data/repo'
import { NEW_VISIT_IN_VISITS_PATH, NEW_VISIT_PATH, visitsStackVisitPath } from '../../src/navigation/paths'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { selectedTab } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const press = async (name: string | RegExp) => fireEvent.click(await screen.findByRole('button', { name }))

const newVisitLink = () => screen.findByRole('link', { name: 'ביקור חדש' })

describe('starting a new visit from any tab', () => {
  beforeEach(resetDb)
  freezeDate(NOW)

  it('starts a new visit from ביקורים and keeps ביקורים selected', async () => {
    renderAt('/tabs/visits')

    fireEvent.click(await newVisitLink())

    await waitFor(() => expect(currentPath()).toBe(NEW_VISIT_IN_VISITS_PATH))
    expect(selectedTab()).toBe('visits')
  })

  it('opens a visit begun from ביקורים inside ביקורים once its first dish is saved', async () => {
    await addRestaurant({ name: 'Abu Hassan' }, NOW)
    renderAt(NEW_VISIT_IN_VISITS_PATH)

    await press(/Abu Hassan/)
    await press('מנה בלי תמונה')
    fireEvent.change(await screen.findByLabelText('שם המנה'), { target: { value: 'חומוס' } })
    fireEvent.click(await screen.findByText('שמירה'))

    await waitFor(async () => expect(await allVisits()).toHaveLength(1))

    const [saved] = await allVisits()

    await waitFor(() => expect(currentPath()).toBe(visitsStackVisitPath(saved.id)))
    expect(selectedTab()).toBe('visits')
  })

  it('starts a new visit from הגדרות in מסעדות', async () => {
    renderAt('/tabs/settings')

    fireEvent.click(await newVisitLink())

    await waitFor(() => expect(currentPath()).toBe(NEW_VISIT_PATH))
    expect(selectedTab()).toBe('restaurants')
  })
})
