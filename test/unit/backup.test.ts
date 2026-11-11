import { strToU8, unzipSync, zipSync } from 'fflate'
import { beforeEach, describe, expect, it } from 'vitest'
import { exportBackup, parseBackup, restoreBackup } from '../../src/data/backup'
import {
  addDish,
  addRestaurant,
  addVisit,
  allDishes,
  allRestaurants,
  allVisits,
  dishPhoto,
  dishThumbnail,
} from '../../src/data/repo'
import { resetDb } from '../helpers/db'
import { shrunkPhoto } from '../helpers/photo'
import { dish, restaurant, visit } from '../helpers/records'

const NOW = new Date(2026, 10, 10, 20, 15).getTime()

const photoBytes = () => new Uint8Array([255, 216, 255, 1, 2, 3]).buffer

const thumbnailBytes = () => new Uint8Array([255, 216, 255, 4]).buffer

const archiveOf = (backupContents: object, photos: Record<string, Uint8Array<ArrayBuffer>> = {}) =>
  zipSync({ 'data.json': strToU8(JSON.stringify(backupContents)), ...photos })

const exportedArchive = async () => new Uint8Array(await new Blob(await exportBackup(NOW)).arrayBuffer())

const harbour = restaurant({ id: 'harbour', name: 'מזנון הנמל' })

const harbourVisit = visit({ id: 'visit', restaurantId: 'harbour', visitedOn: '2026-11-03' })

const sabich = dish({ id: 'sabich', visitId: 'visit', name: 'סביח', price: 42, hasPhoto: true })

const backupData = (version = 1) => ({
  version,
  exportedAt: NOW,
  restaurants: [harbour],
  visits: [harbourVisit],
  dishes: [sabich],
})

async function seedOldData() {
  const restaurantId = await addRestaurant({ name: 'ישן' }, NOW)
  const visitId = await addVisit({ restaurantId, visitedOn: '2026-10-01', kind: 'delivery' }, NOW)

  await addDish({ visitId, name: 'פיצה' }, shrunkPhoto(photoBytes(), thumbnailBytes()), NOW)
}

async function snapshot() {
  const dishes = await allDishes()

  return {
    restaurants: await allRestaurants(),
    visits: await allVisits(),
    dishes,
    photos: await Promise.all(dishes.map((saved) => dishPhoto(saved.id))),
    thumbnails: await Promise.all(dishes.map((saved) => dishThumbnail(saved.id))),
  }
}

describe('backup', () => {
  beforeEach(resetDb)

  it('survives a round trip through a zip, photo and thumbnail bytes included', async () => {
    await seedOldData()
    await addRestaurant({ name: 'נונה רוזה', city: 'תל אביב', wouldReturn: 'yes', note: 'להזמין מקום' }, NOW)

    const before = await snapshot()
    const archive = await exportedArchive()

    await resetDb()
    await restoreBackup(parseBackup(archive))

    expect(await snapshot()).toEqual(before)
  })

  it('writes data.json with the version and export time, and each photo and thumbnail as a jpg', async () => {
    await seedOldData()

    const [saved] = await allDishes()
    const files = unzipSync(await exportedArchive())

    expect(Object.keys(files).sort()).toEqual(['data.json', `photos/${saved.id}.jpg`, `thumbnails/${saved.id}.jpg`])
    expect(JSON.parse(new TextDecoder().decode(files['data.json']))).toMatchObject({ version: 1, exportedAt: NOW })
    expect(files[`photos/${saved.id}.jpg`]).toEqual(new Uint8Array(photoBytes()))
    expect(files[`thumbnails/${saved.id}.jpg`]).toEqual(new Uint8Array(thumbnailBytes()))
  })

  it('replaces all existing data on restore', async () => {
    await seedOldData()

    await restoreBackup(
      parseBackup(
        archiveOf(backupData(), {
          'photos/sabich.jpg': new Uint8Array(photoBytes()),
          'thumbnails/sabich.jpg': new Uint8Array(thumbnailBytes()),
        }),
      ),
    )

    expect(await allRestaurants()).toEqual([harbour])
    expect(await allVisits()).toEqual([harbourVisit])
    expect(await allDishes()).toEqual([sabich])
    expect(await dishPhoto('sabich')).toEqual(photoBytes())
    expect(await dishThumbnail('sabich')).toEqual(thumbnailBytes())
  })

  it('uses the photo as the thumbnail when a backup has a photo without one', async () => {
    await restoreBackup(parseBackup(archiveOf(backupData(), { 'photos/sabich.jpg': new Uint8Array(photoBytes()) })))

    expect((await allDishes())[0].hasPhoto).toBe(true)
    expect(await dishPhoto('sabich')).toEqual(photoBytes())
    expect(await dishThumbnail('sabich')).toEqual(photoBytes())
  })

  it('restores a dish whose photo file is missing without a photo, and ignores photos of unknown dishes', async () => {
    await restoreBackup(
      parseBackup(
        archiveOf(backupData(), {
          'thumbnails/sabich.jpg': new Uint8Array(thumbnailBytes()),
          'photos/stranger.jpg': new Uint8Array(photoBytes()),
        }),
      ),
    )

    const [restored] = await allDishes()

    expect(restored.hasPhoto).toBeUndefined()
    expect(await dishPhoto('sabich')).toBeUndefined()
    expect(await dishThumbnail('sabich')).toBeUndefined()
    expect(await dishPhoto('stranger')).toBeUndefined()
  })

  it.each([
    ['not a zip', () => strToU8('{"version":1}')],
    ['a zip without data.json', () => zipSync({ 'notes.txt': strToU8('hi') })],
    ['invalid JSON', () => zipSync({ 'data.json': strToU8('{oops') })],
    ['another shape', () => archiveOf({ version: 1 })],
    ['a newer version', () => archiveOf(backupData(2))],
    ['a dish without a name', () => archiveOf({ ...backupData(), dishes: [{ ...sabich, name: ' ' }] })],
  ])('rejects %s and leaves the data untouched', async (_name, archive) => {
    await seedOldData()

    const before = await snapshot()

    expect(() => parseBackup(archive())).toThrow()
    expect(await snapshot()).toEqual(before)
  })

  it('restores whole or not at all', async () => {
    await seedOldData()

    const before = await snapshot()
    const duplicateIds = archiveOf({ ...backupData(), dishes: [sabich, { ...sabich, name: 'עוד סביח' }] })

    await expect(restoreBackup(parseBackup(duplicateIds))).rejects.toThrow()
    expect(await snapshot()).toEqual(before)
  })
})
