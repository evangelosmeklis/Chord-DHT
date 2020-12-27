const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
    logger.info("Storing and Replication were succesfull.")
    logger.info("Last replica on node with id,ip,port :")
    console.log(params.senderid,params.senderip,params.senderport)
}