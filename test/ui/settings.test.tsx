import { fireEvent, screen, waitFor } from '@testing-library/react'
import { strFromU8, strToU8, unzipSync, zipSync } from 'fflate'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { addDish, addRestaurant, addVisit, allRestaurants } from '../../src/data/repo'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { alertShown, clickAlertButton } from '../helpers/overlays'
import { shrunkPhoto } from '../helpers/photo'
import { dish, restaurant, visit } from '../helpers/records'
import { renderAt } from '../helpers/renderAt'

const NOW = new Date(2026, 10, 7, 9, 30).getTime()

const BACKUP_NAME = 'restaurants-backup-2026-11-07.zip'

const toasts = () => Array.from(document.querySelectorAll('ion-toast'), (toast) => toast.message)

const restaurantNames = async () => (await allRestaurants()).map(({ name }) => name)

const backupArchive = () =>
  zipSync({
    'data.json': strToU8(
      JSON.stringify({
        version: 1,
        exportedAt: NOW,
        restaurants: [restaurant({ id: 'rosa', name: 'נונה רוזה' })],
        visits: [visit({ id: 'visit', restaurantId: 'rosa', visitedOn: '2026-11-01' })],
        dishes: [dish({ id: 'pizza', visitId: 'visit', name: 'פיצה' })],
      }),
    ),
  })

type ShareMock = ReturnType<typeof vi.fn<(shared: ShareData) => Promise<void>>>

function sharedFile(share: ShareMock, call: number) {
  const [file] = share.mock.calls[call][0].files ?? []

  if (!file) {
    throw new Error('nothing shared')
  }

  return file
}

async function seedHarbour() {
  const restaurantId = await addRestaurant({ name: 'מזנון הנמל' }, NOW)
  const visitId = await addVisit({ restaurantId, visitedOn: '2026-11-03', kind: 'dineIn' }, NOW)

  await addDish({ visitId, name: 'סביח' }, shrunkPhoto(new Uint8Array([1, 2, 3]).buffer, new Uint8Array([4]).buffer), NOW)
  await addDish({ visitId, name: 'חומוס' }, undefined, NOW)
}

function chooseFile(bytes: Uint8Array<ArrayBuffer>) {
  fireEvent.change(screen.getByLabelText('קובץ גיבוי'), {
    target: { files: [new File([bytes], 'backup.zip', { type: 'application/zip' })] },
  })
}

async function exportBackupWith(share: ShareMock) {
  Object.assign(navigator, { share, canShare: () => true })
  renderAt('/tabs/settings')
  fireEvent.click(await screen.findByRole('button', { name: 'ייצוא גיבוי' }))
}

describe('settings', () => {
  beforeEach(resetDb)
  freezeDate(NOW)

  afterEach(() => {
    vi.restoreAllMocks()
    Object.assign(navigator, { share: undefined, canShare: undefined })
  })

  it('says what the backup holds and shows the version', async () => {
    await seedHarbour()
    renderAt('/tabs/settings')

    expect(await screen.findByText('מסעדה אחת · ביקור אחד · תמונה אחת')).toBeVisible()
    expect(screen.getByText(/רק בטלפון הזה/)).toBeVisible()
    expect(screen.getByText(`גרסה ${__APP_VERSION__}`)).toBeVisible()
  })

  it('exports a dated zip through the share sheet', async () => {
    await seedHarbour()

    const share: ShareMock = vi.fn<(shared: ShareData) => Promise<void>>().mockResolvedValue()

    await exportBackupWith(share)
    await waitFor(() => expect(share).toHaveBeenCalledOnce())

    const file = sharedFile(share, 0)
    const files = unzipSync(new Uint8Array(await file.arrayBuffer()))

    expect(file.name).toBe(BACKUP_NAME)
    expect(file.type).toBe('application/zip')
    expect(JSON.parse(strFromU8(files['data.json'])).restaurants).toEqual([
      expect.objectContaining({ name: 'מזנון הנמל' }),
    ])
  })

  it('offers a second tap to share when iOS refuses the first one', async () => {
    await seedHarbour()

    const share: ShareMock = vi
      .fn<(shared: ShareData) => Promise<void>>()
      .mockRejectedValueOnce(new DOMException('too late', 'NotAllowedError'))
      .mockResolvedValue()

    await exportBackupWith(share)
    fireEvent.click(await screen.findByRole('button', { name: 'שיתוף' }))

    await waitFor(() => expect(share).toHaveBeenCalledTimes(2))
    expect(sharedFile(share, 1).name).toBe(BACKUP_NAME)
    await waitFor(() => expect(screen.queryByRole('button', { name: 'שיתוף' })).not.toBeInTheDocument())
  })

  it('downloads the zip where sharing files is not supported', async () => {
    const createObjectURL = vi.fn(() => 'blob:backup')
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() })
    renderAt('/tabs/settings')
    fireEvent.click(await screen.findByRole('button', { name: 'ייצוא גיבוי' }))

    await waitFor(() => expect(click).toHaveBeenCalledOnce())
    expect(click.mock.contexts[0]).toHaveProperty('download', BACKUP_NAME)
  })

  it('restores a backup only after confirming', async () => {
    await seedHarbour()
    renderAt('/tabs/settings')
    await screen.findByRole('button', { name: 'שחזור מגיבוי' })

    const shown = alertShown()

    chooseFile(backupArchive())
    await shown

    expect(await restaurantNames()).toEqual(['מזנון הנמל'])

    clickAlertButton('החלפת הכול')

    await waitFor(async () => expect(await restaurantNames()).toEqual(['נונה רוזה']))
    await waitFor(() => expect(toasts()).toContain('הגיבוי שוחזר'))
  })

  it('rejects a file that is not a backup and keeps the data', async () => {
    await seedHarbour()
    renderAt('/tabs/settings')
    await screen.findByRole('button', { name: 'שחזור מגיבוי' })

    chooseFile(strToU8('not a zip'))

    await waitFor(() => expect(toasts()).toContain('הקובץ אינו גיבוי תקין'))
    expect(await restaurantNames()).toEqual(['מזנון הנמל'])
  })
})
