import { describe, expect, it } from 'vitest'
import { photoFadeForVerdict } from '../../src/domain/photoFade'

describe('photoFadeForVerdict', () => {
  it('keeps the photos of dishes to order in full colour', () => {
    expect(photoFadeForVerdict('must')).toBeUndefined()
    expect(photoFadeForVerdict('good')).toBeUndefined()
    expect(photoFadeForVerdict('fine')).toBeUndefined()
  })

  it('leaves an unrated dish in full colour', () => {
    expect(photoFadeForVerdict(undefined)).toBeUndefined()
  })

  it('dims a dish rated לא משהו and darkens one rated לא להזמין', () => {
    expect(photoFadeForVerdict('weak')).toBe('dim')
    expect(photoFadeForVerdict('avoid')).toBe('dark')
  })
})
