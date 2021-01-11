const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
    logger.info("Value was written succesfully in the network on node with id,ip,port :")
    console.log(params.senderid,params.senderip,params.senderport)
}