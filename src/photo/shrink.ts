import type { ShrunkPhoto } from '../domain/types'

type PhotoSize = {
  width: number
  height: number
}

const MAX_PHOTO_EDGE = 1600

const MAX_THUMBNAIL_EDGE = 240

const JPEG_QUALITY = 0.82

const JPEG_TYPE = 'image/jpeg'

const NO_UPSCALE = 1

const SMALLEST_EDGE = 1

const RELEASED_CANVAS_EDGE = 0

const CANVAS_ORIGIN = 0

export function shrunkSize({ width, height }: PhotoSize, longestEdge: number): PhotoSize {
  const scale = Math.min(NO_UPSCALE, longestEdge / Math.max(width, height))

  return {
    width: Math.max(SMALLEST_EDGE, Math.round(width * scale)),
    height: Math.max(SMALLEST_EDGE, Math.round(height * scale)),
  }
}

async function naturalSize(file: File): Promise<PhotoSize> {
  const url = URL.createObjectURL(file)
  const image = new Image()

  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve
      image.onerror = reject
      image.src = url
    })

    return { width: image.naturalWidth, height: image.naturalHeight }
  } finally {
    URL.revokeObjectURL(url)
  }
}

function jpegBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('photo could not be encoded'))),
      JPEG_TYPE,
      JPEG_QUALITY,
    )
  })
}

async function encodeAt(bitmap: ImageBitmap, { width, height }: PhotoSize) {
  const canvas = document.createElement('canvas')

  try {
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('no canvas context for the photo')
    }

    context.imageSmoothingQuality = 'high'
    context.drawImage(bitmap, CANVAS_ORIGIN, CANVAS_ORIGIN, width, height)

    return await (await jpegBlob(canvas)).arrayBuffer()
  } finally {
    canvas.width = RELEASED_CANVAS_EDGE
    canvas.height = RELEASED_CANVAS_EDGE
  }
}

export async function shrinkPhoto(file: File): Promise<ShrunkPhoto> {
  const photoSize = shrunkSize(await naturalSize(file), MAX_PHOTO_EDGE)

  const bitmap = await createImageBitmap(file, {
    resizeWidth: photoSize.width,
    resizeHeight: photoSize.height,
    resizeQuality: 'high',
  })

  try {
    return {
      photo: await encodeAt(bitmap, photoSize),
      thumbnail: await encodeAt(bitmap, shrunkSize(photoSize, MAX_THUMBNAIL_EDGE)),
    }
  } finally {
    bitmap.close()
  }
}
