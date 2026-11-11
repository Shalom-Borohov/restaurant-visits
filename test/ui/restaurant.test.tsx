import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  addDish,
  addRestaurant,
  addVisit,
  allDishes,
  allRestaurants,
  allVisits,
} from '../../src/data/repo'
import { RESTAURANTS_PATH,restaurantPath, restaurantsStackVisitPath } from '../../src/navigation/paths'
import { resetDb } from '../helpers/db'
import { expectInOrder, ionElement, selectedTab } from '../helpers/ionic'
import { scrollObservedOutOfView } from '../helpers/intersectionObserver'
import { alertDismissed, alertHeader, alertMessage, alertShown, clickAlertButton } from '../helpers/overlays'
import { currentPath, currentSearch, renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const saveButton = async () => {
  const button = (await screen.findByText('שמירה')).closest('ion-button')

  if (!button) {
    throw new Error('no save button')
  }

  return button
}

describe('restaurant page', () => {
  beforeEach(resetDb)

  it('stacks the dishes best first, with their verdict words and repeat counts', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)
    const earlier = await addVisit({ restaurantId, visitedOn: '2026-10-01', kind: 'dineIn' }, NOW)
    const later = await addVisit({ restaurantId, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)

    await addDish({ visitId: earlier, name: 'סביח', verdict: 'good' }, undefined, NOW)
    await addDish({ visitId: later, name: 'סביח', verdict: 'good' }, undefined, NOW)
    await addDish({ visitId: later, name: 'חומוס', verdict: 'avoid' }, undefined, NOW)
    await addDish({ visitId: later, name: 'לימונענע' }, undefined, NOW)
    await addDish({ visitId: later, name: 'שקשוקה', verdict: 'must' }, undefined, NOW)
    renderAt(restaurantPath(restaurantId))

    await expectInOrder(['שקשוקה', 'סביח', 'חומוס', 'לימונענע'])
    await expectInOrder(['חובה להזמין', 'טעים', 'לא להזמין', 'לדרג'])
    expect(screen.getByText('הוזמן 2 פעמים')).toBeVisible()
    expect(screen.getAllByText(/הוזמן/)).toHaveLength(1)
  })

  it('shows each dish with its latest price and verdict, and opens its latest visit', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)
    const earlier = await addVisit({ restaurantId, visitedOn: '2026-10-01', kind: 'dineIn' }, NOW)
    const later = await addVisit({ restaurantId, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)

    await addDish({ visitId: earlier, name: 'סביח', verdict: 'good', price: 40 }, undefined, NOW)
    await addDish({ visitId: later, name: ' סביח ', price: 45 }, undefined, NOW)
    await addDish({ visitId: earlier, name: 'חומוס', verdict: 'must' }, undefined, NOW)
    await addDish({ visitId: later, name: 'חומוס', verdict: 'avoid' }, undefined, NOW)
    renderAt(restaurantPath(restaurantId))

    const sabich = await screen.findByRole('button', { name: /סביח/ })

    expect(sabich).toHaveTextContent('טעים')
    expect(sabich).toHaveTextContent('₪45')
    expect(sabich).not.toHaveTextContent('₪40')
    expect(screen.getByRole('button', { name: /חומוס/ })).toHaveTextContent('לא להזמין')

    fireEvent.click(sabich)

    await waitFor(() => expect(currentPath()).toBe(restaurantsStackVisitPath(later)))
    expect(selectedTab()).toBe('restaurants')
  })

  it('sums up the restaurant: city, cuisine, last visit, visit count, would-return and note', async () => {
    const restaurantId = await addRestaurant(
      { name: 'מזנון הנמל', city: 'חיפה', cuisine: 'ים תיכוני', wouldReturn: 'no', note: 'שירות איטי' },
      NOW,
    )

    await addVisit({ restaurantId, visitedOn: '2026-10-01', kind: 'dineIn' }, NOW)
    await addVisit({ restaurantId, visitedOn: '2026-11-03', kind: 'delivery' }, NOW)
    renderAt(restaurantPath(restaurantId))

    const summary = await screen.findByRole('region', { name: 'מזנון הנמל' })

    expect(within(summary).getByRole('heading', { name: 'מזנון הנמל' })).toBeVisible()
    expect(summary).toHaveTextContent('חיפה · ים תיכוני')
    expect(summary).toHaveTextContent('ביקור אחרון 3 בנובמבר 2026 · 2 ביקורים')
    expect(summary).toHaveTextContent('לא אחזור')
    expect(summary).toHaveTextContent('שירות איטי')
  })

  it('edits the restaurant, suggesting cities and cuisines from the other restaurants', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון', city: 'חיפה', wouldReturn: 'yes' }, NOW)

    await addRestaurant({ name: 'נונה רוזה', city: 'תל אביב', cuisine: 'איטלקי' }, NOW)
    renderAt(restaurantPath(restaurantId))

    fireEvent.click(await screen.findByRole('button', { name: 'עריכה' }))

    const nameField = await screen.findByLabelText('שם')

    fireEvent.change(nameField, { target: { value: '' } })
    expect(await saveButton()).toHaveProperty('disabled', true)

    expect(screen.getByRole('option', { name: 'תל אביב', hidden: true })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'איטלקי', hidden: true })).toBeInTheDocument()

    fireEvent.change(nameField, { target: { value: 'מזנון הנמל' } })
    fireEvent.change(screen.getByLabelText('עיר'), { target: { value: 'תל אביב' } })
    fireEvent.change(screen.getByLabelText('מטבח'), { target: { value: 'ים תיכוני' } })
    fireEvent.click(screen.getByRole('button', { name: 'אחזור' }))
    fireEvent.click(screen.getByRole('button', { name: 'לא אחזור' }))
    fireEvent.change(screen.getByLabelText('הערה'), { target: { value: 'להזמין מקום' } })
    fireEvent.click(await saveButton())

    const summary = await screen.findByRole('region', { name: 'מזנון הנמל' })

    await waitFor(() => expect(summary).toHaveTextContent('תל אביב · ים תיכוני'))
    expect(summary).toHaveTextContent('לא אחזור')
    expect(summary).toHaveTextContent('להזמין מקום')
  })

  it('clears the would-return verdict when its pill is tapped again', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון', wouldReturn: 'yes' }, NOW)

    renderAt(restaurantPath(restaurantId))

    fireEvent.click(await screen.findByRole('button', { name: 'עריכה' }))
    fireEvent.click(await screen.findByRole('button', { name: 'אחזור', pressed: true }))
    fireEvent.click(await saveButton())

    await waitFor(() => expect(screen.getByRole('region', { name: 'מזנון' })).not.toHaveTextContent('אחזור'))
  })

  it('lists the visits newest first with their kind, dish count and total, and opens one', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)
    const earlier = await addVisit({ restaurantId, visitedOn: '2026-10-01', kind: 'delivery' }, NOW)
    const later = await addVisit({ restaurantId, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)

    await addDish({ visitId: earlier, name: 'סביח', price: 40 }, undefined, NOW)
    await addDish({ visitId: later, name: 'שקשוקה', price: 58 }, undefined, NOW)
    await addDish({ visitId: later, name: 'לימונענע', price: 16 }, undefined, NOW)
    renderAt(restaurantPath(restaurantId))

    const visits = within(await screen.findByRole('region', { name: 'ביקורים' })).getAllByRole('button')

    expect(visits.map((visitRow) => visitRow.textContent)).toEqual([
      expect.stringMatching(/3 בנובמבר 2026.*במקום.*2 מנות.*₪74/),
      expect.stringMatching(/1 באוקטובר 2026.*משלוח.*מנה אחת.*₪40/),
    ])

    fireEvent.click(visits[1])

    await waitFor(() => expect(currentPath()).toBe(restaurantsStackVisitPath(earlier)))
    expect(selectedTab()).toBe('restaurants')
  })

  it('shows the toolbar title only after the large name scrolls away', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)

    renderAt(restaurantPath(restaurantId))
    await screen.findByRole('heading', { name: 'מזנון הנמל', level: 1 })

    const toolbarTitle = await ionElement('ion-title')

    expect(toolbarTitle).toHaveTextContent('מזנון הנמל')
    expect(toolbarTitle).toHaveAttribute('aria-hidden', 'true')

    scrollObservedOutOfView()

    await waitFor(() => expect(toolbarTitle).not.toHaveAttribute('aria-hidden', 'true'))
  })

  it('starts a new visit at this restaurant', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)

    renderAt(restaurantPath(restaurantId))

    fireEvent.click(await screen.findByRole('button', { name: 'ביקור חדש כאן' }))

    await waitFor(() => expect(currentPath()).toBe('/tabs/restaurants/visits/new'))
    expect(currentSearch()).toBe(`?restaurant=${restaurantId}`)
    expect(selectedTab()).toBe('restaurants')
  })

  it('deletes the restaurant with its visits and dishes after asking', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)
    const visitId = await addVisit({ restaurantId, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)

    await addDish({ visitId, name: 'סביח' }, undefined, NOW)
    renderAt(restaurantPath(restaurantId))

    const shown = alertShown()

    fireEvent.click(await screen.findByRole('button', { name: 'מחיקת המסעדה' }))
    await shown

    expect(alertHeader()).toBe('למחוק את מזנון הנמל?')
    expect(alertMessage()).toBe('גם הביקורים והמנות שלה יימחקו.')

    clickAlertButton('מחיקה')

    await waitFor(() => expect(currentPath()).toBe(RESTAURANTS_PATH))
    expect(await allRestaurants()).toEqual([])
    expect(await allVisits()).toEqual([])
    expect(await allDishes()).toEqual([])
  })

  it('keeps the restaurant when the deletion is cancelled', async () => {
    const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)

    renderAt(restaurantPath(restaurantId))

    const shown = alertShown()

    fireEvent.click(await screen.findByRole('button', { name: 'מחיקת המסעדה' }))
    await shown

    const dismissed = alertDismissed()

    clickAlertButton('ביטול')
    await dismissed

    expect(await allRestaurants()).toHaveLength(1)
    expect(currentPath()).toBe(restaurantPath(restaurantId))
  })

  it('says so when the restaurant does not exist', async () => {
    renderAt(restaurantPath('missing'))

    expect(await screen.findByText('המסעדה לא נמצאה')).toBeVisible()
  })
})
