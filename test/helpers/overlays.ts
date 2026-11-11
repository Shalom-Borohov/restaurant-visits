import { fireEvent } from '@testing-library/react'

function last(selector: string) {
  const elements = document.querySelectorAll(selector)
  const element = elements.item(elements.length - 1)

  if (!element) {
    throw new Error(`no element ${selector}`)
  }

  return element
}

function buttonIn(overlay: string, button: string, text: string) {
  const match = Array.from(last(overlay).querySelectorAll(button)).find(
    (element) => element.textContent?.trim() === text,
  )

  if (!match) {
    throw new Error(`no ${overlay} button ${text}`)
  }

  return match
}

const overlayEvent = (name: 'ionAlertDidPresent' | 'ionAlertDidDismiss' | 'ionModalDidDismiss') =>
  new Promise((resolve) => {
    document.addEventListener(name, resolve, { once: true })
  })

export const alertShown = () => overlayEvent('ionAlertDidPresent')

export const alertDismissed = () => overlayEvent('ionAlertDidDismiss')

export const modalDismissed = () => overlayEvent('ionModalDidDismiss')

export const alertHeader = () => last('ion-alert .alert-title').textContent

export const alertMessage = () => last('ion-alert .alert-message').textContent

export const clickAlertButton = (text: string) => fireEvent.click(buttonIn('ion-alert', '.alert-button', text))
