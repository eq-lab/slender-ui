import { isProduction } from '@slender/shared/config'
import { postRequest } from '@slender/shared/api'

const SEND_EMAIL_PROD_PATH = 'https://api.slender.fi/api/users'
const SEND_EMAIL_DEV_PATH = 'https://api-stage.slender.fi/api/users'

const SEND_EMAIL_PATH = isProduction ? SEND_EMAIL_PROD_PATH : SEND_EMAIL_DEV_PATH

export function sendEmail(email: string) {
  return postRequest(SEND_EMAIL_PATH, 'POST', {
    email,
    scope: 'Slender Landing',
    skipMailchimpCreation: false,
  })
}
