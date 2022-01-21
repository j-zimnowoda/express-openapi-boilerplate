'use strict'

import { Operation, OperationHandlerArray } from 'express-openapi'

export default function (): OperationHandlerArray {
  const get: Operation = [
    /* business middleware not expressible by OpenAPI documentation goes here */
    (_req, res): void => {
      console.debug('Get')
      res.json({})
    },
  ]
  const api = {
    get,
  }
  return api
}
