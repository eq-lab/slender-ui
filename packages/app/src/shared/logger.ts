import { isProduction } from '@slender/landing/src/shared/config'

export function logInfo(...args: unknown[]) {
  if (!isProduction) {
    // only in dev envs
    // eslint-disable-next-line no-console
    console.info(...args)
  }
}
