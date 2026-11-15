import { COMMON_COPY } from '../copy/common'

export function Shekels({ amount, className }: { amount: number; className: string }) {
  return (
    <bdi className={className} dir="ltr">
      {COMMON_COPY.shekels(amount)}
    </bdi>
  )
}
