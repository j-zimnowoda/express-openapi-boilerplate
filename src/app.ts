import express from 'express'
import { readFileSync } from 'fs'
import { initialize } from 'express-openapi'
import { json } from 'body-parser'
import path from 'path'
import cors from 'cors'
import { createLightship } from 'lightship'

import { cleanEnv, str, port } from 'envalid'
import { Server } from 'http'
import { Application } from 'express-serve-static-core'
const env = cleanEnv(process.env, {
  HEALTH_CHECK_PORT: port({ default: 9000 }),
  PORT: port({ default: 8080 }),
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
})
export function initApp(): Application {
  const app = express()
  const apiRoutesPath = path.resolve(__dirname, 'api-routes')
  app.use(cors())
  app.use(json())

  initialize({
    apiDoc: readFileSync(path.resolve(__dirname, 'api-doc.yml'), 'utf8'),
    app: app,
    enableObjectCoercion: true,
    paths: apiRoutesPath,
    routesGlob: '**/*.{ts,js}',
    routesIndexFileRegExp: /(?:index)?\.[tj]s$/,
  })
  return app
}

export async function startServer(app: Application): Promise<Server> {
  const lightship = createLightship({ detectKubernetes: false, port: env.HEALTH_CHECK_PORT })
  const server = app
    .listen(env.PORT, () => {
      console.info(`Listening on port: http://127.0.0.1:${env.PORT}`)
      lightship.signalReady()
    })
    .on('error', () => {
      lightship.shutdown()
    })

  lightship.registerShutdownHandler(() => {
    server.close()
  })
  return server
}

if (typeof require !== 'undefined' && require.main === module) {
  const app = initApp()
  startServer(app)
}
