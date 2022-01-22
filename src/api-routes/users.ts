'use strict'

import { S3 } from 'aws-sdk'
import { Operation, OperationHandlerArray } from 'express-openapi'
import env from '../env'

export default function (s3Client: S3): OperationHandlerArray {
  const get: Operation = [
    /* business middleware not expressible by OpenAPI documentation goes here */
    async (_req, res): Promise<void> => {
      console.debug('Get file list')
      const bucketParams = {
        Bucket: env.AWS_S3_BUCKET,
      }
      // Call S3 to obtain a list of the objects in the bucket
      try {
        const response = await s3Client.listObjectsV2(bucketParams).promise()
        res.json(response.Contents)
      } catch (error) {
        console.error(error)
        res.status(500).json('Unable to fetch file list')
      }
    },
  ]
  const api = {
    get,
  }
  return api
}
