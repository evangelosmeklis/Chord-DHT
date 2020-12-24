const fs = require('fs')
const path = require('path')
const logger = require('knoblr')

module.exports = (params) => {
  logger.info(`Song was found: `)
  logger.info(params.value)
}
