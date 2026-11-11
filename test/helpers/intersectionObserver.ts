import { act } from '@testing-library/react'

type ObservedEntry = { isIntersecting: boolean }

type ObserverCallback = (entries: ObservedEntry[]) => void

const activeCallbacks = new Set<ObserverCallback>()

class FakeIntersectionObserver {
  private readonly callback: ObserverCallback

  constructor(callback: ObserverCallback) {
    this.callback = callback
  }

  observe() {
    activeCallbacks.add(this.callback)
    this.callback([{ isIntersecting: true }])
  }

  unobserve() {
    activeCallbacks.delete(this.callback)
  }

  disconnect() {
    activeCallbacks.delete(this.callback)
  }

  takeRecords() {
    return []
  }
}

export function installIntersectionObserver() {
  Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: FakeIntersectionObserver })
}

export function scrollObservedOutOfView() {
  act(() => activeCallbacks.forEach((callback) => callback([{ isIntersecting: false }])))
}
