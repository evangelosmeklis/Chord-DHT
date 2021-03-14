const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
    //IMPLEMENTATION OF CHAIN REPLICATION

    // if the abs  value of the difference between my Id and the hashed key's is lower than the same difference of the next node, then I store it in me.
    // if not then I send the pair to the next node so this can be checked again. 
    if (global.fileList[params.key]){ //if I already have the key push it front
        outSocket.sendCommandTo(
            global.nextNode.ip,
            global.nextNode.port,
            messageCommand.REPLICATE,
            outSocket.createCommandPayload(messageCommand.REPLICATE)(params.key, params.value,params.replication,params.senderip,params.senderport,params.senderid)
        ) 
    }
    else { //so I don't have the key and I must replicate
        global.fileList[params.key] = params.value
        if (params.replication > 1 && (global.replication - (params.replication - 1) < global.weare ) ){ //if there are more replications to be done send replicate message to next node
            //console.log("---more replications---")
            //console.log(params.sender)
            outSocket.sendCommandTo(
            global.nextNode.ip,
            global.nextNode.port,
            messageCommand.REPLICATE,
            outSocket.createCommandPayload(messageCommand.REPLICATE)(params.key, params.value,params.replication-1,params.type,params.senderip,params.senderport,params.senderid)
            )
        }
        else if (params.replication <=1 && params.type==0) { //i am the last replica, better inform somebody about that
            //console.log("---I am the last replica---")
            //console.log(params.sender)
            outSocket.sendCommandTo(
                params.senderip,
                params.senderport,
                messageCommand.REPLICATE_ACK,
                outSocket.createCommandPayload(messageCommand.REPLICATE_ACK)(params.key, params.value,params.replication-1,params.type,global.ADDRESS,global.PORT,global.myId)
            )
        }
    }
}
