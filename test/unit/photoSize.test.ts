import { describe, expect, it } from 'vitest'
import { shrunkSize } from '../../src/photo/shrink'

const PHOTO_EDGE = 1600

const THUMBNAIL_EDGE = 240

describe('shrunkSize', () => {
  it('scales a landscape photo so its long edge is 1600 px', () => {
    expect(shrunkSize({ width: 4032, height: 3024 }, PHOTO_EDGE)).toEqual({ width: 1600, height: 1200 })
  })

  it('scales a portrait photo by its height', () => {
    expect(shrunkSize({ width: 3024, height: 4032 }, PHOTO_EDGE)).toEqual({ width: 1200, height: 1600 })
  })

  it('rounds to whole pixels', () => {
    expect(shrunkSize({ width: 8064, height: 6048 }, PHOTO_EDGE)).toEqual({ width: 1600, height: 1200 })
    expect(shrunkSize({ width: 3000, height: 2000 }, PHOTO_EDGE)).toEqual({ width: 1600, height: 1067 })
  })

  it('never upscales a photo that is already small', () => {
    expect(shrunkSize({ width: 1200, height: 900 }, PHOTO_EDGE)).toEqual({ width: 1200, height: 900 })
    expect(shrunkSize({ width: 1600, height: 1600 }, PHOTO_EDGE)).toEqual({ width: 1600, height: 1600 })
  })

  it('keeps at least one pixel on the short edge of a very thin photo', () => {
    expect(shrunkSize({ width: 20000, height: 4 }, PHOTO_EDGE)).toEqual({ width: 1600, height: 1 })
  })

  it('scales a shrunk photo down to a thumbnail of at most 240 px', () => {
    expect(shrunkSize({ width: 1600, height: 1200 }, THUMBNAIL_EDGE)).toEqual({ width: 240, height: 180 })
    expect(shrunkSize({ width: 1200, height: 1600 }, THUMBNAIL_EDGE)).toEqual({ width: 180, height: 240 })
  })
})
