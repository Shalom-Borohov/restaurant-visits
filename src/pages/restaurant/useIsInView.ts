import { useCallback, useState } from 'react'

export function useIsInView() {
  const [isInView, setIsInView] = useState(true)

  const observedRef = useCallback((element: HTMLElement | null) => {
    if (!element) {
      return
    }

    const observer = new IntersectionObserver((entries) =>
      entries.forEach((entry) => setIsInView(entry.isIntersecting)),
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return { isInView, observedRef }
}
