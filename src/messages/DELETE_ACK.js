const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
    logger.info("Song was found on node with (id,ip,port): ")
    console.log(params.sender.id,params.sender.ip,params.sender.port)
    logger.info("Deleted.")
}