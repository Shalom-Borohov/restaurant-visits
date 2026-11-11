const JPEG_TYPE = 'image/jpeg'

const urlsByBytes = new WeakMap<ArrayBuffer, string>()

const revokeWhenBytesCollected = new FinalizationRegistry<string>((url) => URL.revokeObjectURL(url))

export function objectUrlOf(bytes: ArrayBuffer) {
  const known = urlsByBytes.get(bytes)

  if (known) {
    return known
  }

  const url = URL.createObjectURL(new Blob([bytes], { type: JPEG_TYPE }))

  urlsByBytes.set(bytes, url)
  revokeWhenBytesCollected.register(bytes, url)

  return url
}
