const PRICE_TEXT_PATTERN = /^\d+([.,]\d{1,2})?$/

const PRICE_AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/

const DECIMAL_COMMA = ','

const DECIMAL_POINT = '.'

const MAXIMUM_PRICE = 100_000

export const INVALID_PRICE = 'invalid'

type ParsedPrice = number | undefined | typeof INVALID_PRICE

export const isPriceAmount = (price: number) => price <= MAXIMUM_PRICE && PRICE_AMOUNT_PATTERN.test(String(price))

export function parsePriceText(text: string): ParsedPrice {
  const trimmed = text.trim()

  if (!trimmed) {
    return undefined
  }

  if (!PRICE_TEXT_PATTERN.test(trimmed)) {
    return INVALID_PRICE
  }

  const price = Number(trimmed.replace(DECIMAL_COMMA, DECIMAL_POINT))

  return price <= MAXIMUM_PRICE ? price : INVALID_PRICE
}
