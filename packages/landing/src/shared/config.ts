type EnvName = 'prod' | 'dev'

const DEFAULT_ENV_NAME: EnvName = 'dev'

const envName: EnvName =
  (process.env.NEXT_PUBLIC_DEPLOY_ENVIRONMENT as EnvName | undefined) ?? DEFAULT_ENV_NAME

export const isProduction = envName === 'prod'
