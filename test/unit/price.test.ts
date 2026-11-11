import { describe, expect, it } from 'vitest'
import { INVALID_PRICE, isPriceAmount, parsePriceText } from '../../src/domain/price'

describe('price text', () => {
  it('reads whole shekels and up to two decimals, with a point or a comma', () => {
    expect(parsePriceText('42')).toBe(42)
    expect(parsePriceText(' 44.5 ')).toBe(44.5)
    expect(parsePriceText('38,90')).toBe(38.9)
    expect(parsePriceText('0')).toBe(0)
  })

  it('reads blank text as no price', () => {
    expect(parsePriceText('')).toBeUndefined()
    expect(parsePriceText('   ')).toBeUndefined()
  })

  it('calls anything else invalid', () => {
    expect(parsePriceText('42.555')).toBe(INVALID_PRICE)
    expect(parsePriceText('-3')).toBe(INVALID_PRICE)
    expect(parsePriceText('12.')).toBe(INVALID_PRICE)
    expect(parsePriceText('₪12')).toBe(INVALID_PRICE)
    expect(parsePriceText('1,2,3')).toBe(INVALID_PRICE)
  })

  it('caps a price at a hundred thousand shekels', () => {
    expect(parsePriceText('100000')).toBe(100_000)
    expect(parsePriceText('100000.01')).toBe(INVALID_PRICE)
    expect(parsePriceText('1000000000000000000000')).toBe(INVALID_PRICE)
  })
})

describe('price amount', () => {
  it('accepts a non-negative amount with up to two decimals', () => {
    expect(isPriceAmount(0)).toBe(true)
    expect(isPriceAmount(0.29)).toBe(true)
    expect(isPriceAmount(58)).toBe(true)
  })

  it('refuses more decimals or a negative amount', () => {
    expect(isPriceAmount(42.555)).toBe(false)
    expect(isPriceAmount(-1)).toBe(false)
  })

  it('refuses more than a hundred thousand shekels', () => {
    expect(isPriceAmount(100_000)).toBe(true)
    expect(isPriceAmount(100_001)).toBe(false)
    expect(isPriceAmount(1e21)).toBe(false)
  })
})
