import { screen, waitFor } from '@testing-library/react'
import { expect } from 'vitest'

const VISIBLE_PAGE = '.ion-page:not(.ion-page-hidden)'

export function ionElement(selector: string) {
  return waitFor(() => {
    const element = document.querySelector(`${VISIBLE_PAGE} ${selector}`)

    if (!element) {
      throw new Error(`no element ${selector}`)
    }

    return element
  })
}

export function selectedTab() {
  return document.querySelector('ion-tab-button.tab-selected')?.getAttribute('tab')
}

export async function expectInOrder(texts: string[]) {
  const elements = await Promise.all(texts.map((text) => screen.findByText(text)))

  elements.slice(1).forEach((element, index) => {
    expect(elements[index].compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
}
