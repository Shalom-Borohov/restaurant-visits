import { afterEach, beforeEach } from 'vitest'
import type { ShrunkPhoto } from '../../src/domain/types'

export const shrunkPhoto = (photo: ArrayBuffer, thumbnail: ArrayBuffer): ShrunkPhoto => ({ photo, thumbnail })

export const PHOTO_URL = 'blob:dish-photo'

const ORIGINAL_CREATE = URL.createObjectURL

const ORIGINAL_REVOKE = URL.revokeObjectURL

export function stubObjectUrls() {
  beforeEach(() => {
    URL.createObjectURL = () => PHOTO_URL
    URL.revokeObjectURL = () => {}
  })

  afterEach(() => {
    URL.createObjectURL = ORIGINAL_CREATE
    URL.revokeObjectURL = ORIGINAL_REVOKE
  })
}

export const cameraPhoto = () => new File([new Uint8Array([9, 9, 9])], 'IMG_0001.jpg', { type: 'image/jpeg' })
