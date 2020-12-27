const fs = require('fs')
const path = require('path')
const logger = require('knoblr')

module.exports = (params) => {
  logger.info(`Song was found on node with (id,ip,port): `)
  console.log(params.senderid,params.senderip,params.senderport)
  logger.info('And value: ')
  logger.info(params.value)
}
