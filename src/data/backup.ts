import { strFromU8, strToU8, unzipSync, Zip, ZipDeflate, ZipPassThrough } from 'fflate'
import { array, type InferOutput, literal, number, object, omit, parse, parseJson, pipe, string } from 'valibot'
import { type Dish, dishSchema, type DishPhoto, restaurantSchema, visitSchema } from '../domain/types'
import { allTables, db } from './db'

const BACKUP_VERSION = 1

const DATA_FILE = 'data.json'

const ZIP_LEVEL = 6

const photoPath = (dishId: string) => `photos/${dishId}.jpg`

const thumbnailPath = (dishId: string) => `thumbnails/${dishId}.jpg`

const backupFileSchema = pipe(
  string(),
  parseJson(),
  object({
    version: literal(BACKUP_VERSION),
    exportedAt: number(),
    restaurants: array(restaurantSchema),
    visits: array(visitSchema),
    dishes: array(omit(dishSchema, ['hasPhoto'])),
  }),
)

type BackupFile = InferOutput<typeof backupFileSchema>

export type ParsedBackup = Omit<BackupFile, 'dishes'> & {
  dishes: Dish[]
  photos: DishPhoto[]
  thumbnails: DishPhoto[]
}

function zipWriter() {
  const chunks: Uint8Array<ArrayBuffer>[] = []

  const zip = new Zip((error, chunk) => {
    if (error) {
      throw error
    }

    chunks.push(chunk)
  })

  function addStored(path: string, bytes: ArrayBuffer) {
    const entry = new ZipPassThrough(path)

    zip.add(entry)
    entry.push(new Uint8Array(bytes), true)
  }

  function addDeflated(path: string, bytes: Uint8Array<ArrayBuffer>) {
    const entry = new ZipDeflate(path, { level: ZIP_LEVEL })

    zip.add(entry)
    entry.push(bytes, true)
  }

  function finish() {
    zip.end()

    return chunks
  }

  return { addStored, addDeflated, finish }
}

export const exportBackup = (now: number) =>
  db.transaction('r', allTables(), async () => {
    const writer = zipWriter()

    const backupFile: BackupFile = {
      version: BACKUP_VERSION,
      exportedAt: now,
      restaurants: await db.restaurants.toArray(),
      visits: await db.visits.toArray(),
      dishes: await db.dishes.toArray(),
    }

    writer.addDeflated(DATA_FILE, strToU8(JSON.stringify(backupFile)))
    await db.photos.each(({ dishId, bytes }) => writer.addStored(photoPath(dishId), bytes))
    await db.thumbnails.each(({ dishId, bytes }) => writer.addStored(thumbnailPath(dishId), bytes))

    return writer.finish()
  })

export function parseBackup(archive: Uint8Array): ParsedBackup {
  const files = unzipSync(archive)
  const dataFile = files[DATA_FILE]

  if (!dataFile) {
    throw new Error(`backup has no ${DATA_FILE}`)
  }

  const backupFile = parse(backupFileSchema, strFromU8(dataFile))

  const photoFiles = backupFile.dishes.flatMap((dish) => {
    const photoFile = files[photoPath(dish.id)]

    return photoFile ? [{ dishId: dish.id, photoFile, thumbnailFile: files[thumbnailPath(dish.id)] ?? photoFile }] : []
  })

  const dishIdsWithPhoto = new Set(photoFiles.map(({ dishId }) => dishId))

  const dishes = backupFile.dishes.map((dish): Dish =>
    dishIdsWithPhoto.has(dish.id) ? { ...dish, hasPhoto: true } : dish,
  )

  return {
    ...backupFile,
    dishes,
    photos: photoFiles.map(({ dishId, photoFile }) => ({ dishId, bytes: photoFile.buffer })),
    thumbnails: photoFiles.map(({ dishId, thumbnailFile }) => ({ dishId, bytes: thumbnailFile.buffer })),
  }
}

export const restoreBackup = (backup: ParsedBackup) =>
  db.transaction('rw', allTables(), async () => {
    await Promise.all(allTables().map((table) => table.clear()))
    await db.restaurants.bulkAdd(backup.restaurants)
    await db.visits.bulkAdd(backup.visits)
    await db.dishes.bulkAdd(backup.dishes)
    await db.photos.bulkAdd(backup.photos)
    await db.thumbnails.bulkAdd(backup.thumbnails)
  })
