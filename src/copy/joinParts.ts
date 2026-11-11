import { COMMON_COPY } from './common'

export const joinParts = (parts: (string | undefined)[]) =>
  parts.filter((part) => part !== undefined).join(COMMON_COPY.separator)
