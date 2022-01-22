import { cleanEnv, str, port } from 'envalid'

const env = cleanEnv(process.env, {
  HEALTH_CHECK_PORT: port({ default: 9000 }),
  PORT: port({ default: 8080 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
  AWS_ACCESS_KEY_ID: str(),
  AWS_SECRET_ACCESS_KEY: str(),
  AWS_DEFAULT_REGION: str(),
  AWS_S3_BUCKET: str(),
})

export default env
