import { describe, expect, it } from 'vitest'
import { isAfterToday, isVisitDate, todayVisitDate } from '../../src/domain/visitDate'

describe('visit date', () => {
  it('accepts a real calendar day', () => {
    expect(isVisitDate('2026-11-10')).toBe(true)
  })

  it('rejects a year alone, a day that does not exist and other text', () => {
    expect(isVisitDate('2026')).toBe(false)
    expect(isVisitDate('2026-02-30')).toBe(false)
    expect(isVisitDate('yesterday')).toBe(false)
  })

  it('gives today in local time', () => {
    expect(todayVisitDate(new Date(2026, 10, 10, 23, 30))).toBe('2026-11-10')
  })

  it('tells a future day from today and earlier days', () => {
    expect(isAfterToday('2026-11-11', '2026-11-10')).toBe(true)
    expect(isAfterToday('2027-01-01', '2026-11-10')).toBe(true)
    expect(isAfterToday('2026-11-10', '2026-11-10')).toBe(false)
    expect(isAfterToday('2025-12-31', '2026-11-10')).toBe(false)
  })
})
