const FIRST_FILE = 0

const NO_FILE_CHOSEN = ''

export function takePickedFile(input: HTMLInputElement) {
  const file = input.files?.[FIRST_FILE]

  input.value = NO_FILE_CHOSEN

  return file
}
