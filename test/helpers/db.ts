import { db } from '../../src/data/db'

export async function resetDb() {
  await Promise.all(db.tables.map((table) => table.clear()))
}
