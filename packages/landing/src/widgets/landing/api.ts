import { isProduction } from '@slender/shared/config'

const SEND_EMAIL_PROD_PATH = 'https://api.slender.fi/api/users'
const SEND_EMAIL_DEV_PATH = 'https://api-stage.slender.fi/api/users'

const SEND_EMAIL_PATH = isProduction ? SEND_EMAIL_PROD_PATH : SEND_EMAIL_DEV_PATH

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'manual', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json()
}

export function sendEmail(email: string) {
  return postData(SEND_EMAIL_PATH, {
    email,
    scope: 'Slender Landing',
    skipMailchimpCreation: false,
  })
}
