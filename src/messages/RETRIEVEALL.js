const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
    const keyChecksum = parseInt(params.key, 16)
    const idChecksum = parseInt(global.myId, 16)
    const nextIdChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0 //if we have a next node then get id else put 0

    var ncontents = params.contents //get contents from parameters
    var zifirst = params.thefirst //get the first
    var zitimes = params.times
    var change = false

  
    if (params.thefirst == global.myId){ //if we made a full circle just print the contents gathered
      if (zitimes>0){
        console.log("---Printing contents of node :)---" )
        console.log({ ip: global.ADDRESS, port: global.PORT, id: global.myId })
        console.log("---Contents---")
        for (f in params.contents){ 
          console.log(params.contents[f])
        }
        change =true
        zitimes=zitimes+1
        return
      }
      else {
        if (zitimes == 0) zitimes = zitimes + 1
        else { 
          change=true;
          zitimes = zitimes + 1
        }
      }
    }

    //for every key,value pair in the fileList of the node, put them inside contents
    if (change == false ){
      for (let info in global.fileList){
        ncontents.push(global.fileList[info])
      }
    }

    if (global.nextNode.ip && change==false) {
        return outSocket.sendCommandTo(
          //send retrieve message to next node
          global.nextNode.ip,
          global.nextNode.port,
          messageCommand.RETRIEVEALL,
          outSocket.createCommandPayload(messageCommand.RETRIEVEALL)(zifirst,zitimes,ncontents,/*, resolvedLocation,*/ {
            //inside the retrieve message we include our infos so that the node who has the key can send us the info
            ip: global.ADDRESS,
            port: global.PORT,
            id: global.myId
          })
        )
    }
}
