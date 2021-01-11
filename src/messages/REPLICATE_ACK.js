const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
    if (params.type==0){
        logger.info("Storing and Replication were succesfull (chain replication).")
        logger.info("Last replica on node with id,ip,port :")
        console.log(params.senderid,params.senderip,params.senderport)
    }
    else if (params.type == 1){
        logger.info("Storing and Replication were succesfull (eventual consistency).")
        logger.info("First replica on node with id,ip,port :")
        console.log(params.senderid,params.senderip,params.senderport)
    }
}