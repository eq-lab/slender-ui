import { isProduction } from '@slender/shared/config'

function writeToDevConsole<T extends 'info' | 'log' | 'error'>(
  method: T,
  ...args: unknown[]
): void {
  if (!isProduction) {
    // only in dev envs
    // eslint-disable-next-line no-console
    console[method](...args)
  }
}

export function logInfo(...args: unknown[]) {
  writeToDevConsole('info', ...args)
}

export function logError(...args: unknown[]) {
  console.log('caught'.toUpperCase(), ...args)
  writeToDevConsole('error', ...args)
}
