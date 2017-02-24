'use strict'

const uuid = require('uuid')

exports.ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'f8b9b2cf-068b-4b25-adf9-2a35e34805a0' || uuid.v4()
