const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
    const keyChecksum = parseInt(params.key, 16)
    const idChecksum = parseInt(global.myId, 16)
    const nextIdChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0 //if we have a next node then get id else put 0

    console.log("---Printing contents of node---" )
    console.log({ ip: global.ADDRESS, port: global.PORT, id: global.myId })
    console.log("---Contents---")
    for (let info in global.fileList){
      console.log(global.fileList[info])
    }
    if (global.nextNode.ip) {
        return outSocket.sendCommandTo(
          //send retrieve message to next node
          global.nextNode.ip,
          global.nextNode.port,
          messageCommand.RETRIEVE,
          outSocket.createCommandPayload(messageCommand.RETRIEVEALL)(key,/*, resolvedLocation,*/ {
            //inside the retrieve message we include our infos so that the node who has the key can send us the info
            ip: global.ADDRESS,
            port: global.PORT,
            id: global.myId
          })
        )
    }
}
