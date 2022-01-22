import express from 'express'
import { readFileSync } from 'fs'
import { initialize } from 'express-openapi'
import { json } from 'body-parser'
import path from 'path'
import cors from 'cors'
import { createLightship } from 'lightship'
import { Server } from 'http'
import { Application } from 'express-serve-static-core'
import { S3, config } from 'aws-sdk'
import env from './env'

function initAwsClient(): S3 {
  const client = new S3({ apiVersion: '2006-03-01' })
  config.update({ region: env.AWS_DEFAULT_REGION })
  return client
}

export function initApp(s3Client: S3): Application {
  const app = express()
  const apiRoutesPath = path.resolve(__dirname, 'api-routes')
  app.use(cors())
  app.use(json())

  initialize({
    apiDoc: readFileSync(path.resolve(__dirname, 'api-doc.yml'), 'utf8'),
    app: app,
    dependencies: {
      s3Client,
    },
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
  const awsClient = initAwsClient()
  const app = initApp(awsClient)
  startServer(app)
}
