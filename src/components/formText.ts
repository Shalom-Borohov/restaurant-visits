export function formText(form: HTMLFormElement, fieldName: string) {
  const field = new FormData(form).get(fieldName)

  return typeof field === 'string' ? field : undefined
}
