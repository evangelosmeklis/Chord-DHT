const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
    var ncontents = params.contents
    var times = params.times
    //console.log("times : " + times)
    if (global.myId == global.bootstrap && times == 0){
        //console.log("Hi")
        for (let fileHashName in global.fileList){
            var ar = [ fileHashName,global.fileList[fileHashName] ]
            //console.log(ar)
            ncontents.push(ar)
            //console.log(ncontents)

        }
        for (let fileHashName in global.fileList){
            delete global.fileList[fileHashName]
        }
        outSocket.sendCommandTo(
            global.nextNode.ip,
            global.nextNode.port,
            messageCommand.REDISTR,
            outSocket.createCommandPayload(messageCommand.REDISTR)(1,1,ncontents,global.ADDRESS,global.PORT,global.myId)
          )
    }
    else if (global.myId == global.bootstrap && times == 1){
        //console.log("final : " + ncontents)
        for(let f in ncontents){
            //console.log(ncontents[f][0])
            outSocket.sendCommandTo(
                global.nextNode.ip,
                global.nextNode.port,
                messageCommand.STORE,
                outSocket.createCommandPayload(messageCommand.STORE)(ncontents[f][0], ncontents[f][1],global.sreplication,global.type,1,global.ADDRESS,global.PORT,global.myId)
              )
        }
    }
    else if (params.foundb == 1) {
        for (let fileHashName in global.fileList){
            var ar = [ fileHashName,global.fileList[fileHashName] ]
            console.log(ar)
            ncontents.push(ar)
        }
        //console.log(ncontents)
        for (let fileHashName in global.fileList){
            delete global.fileList[fileHashName]
        }
        outSocket.sendCommandTo(
            global.nextNode.ip,
            global.nextNode.port,
            messageCommand.REDISTR,
            outSocket.createCommandPayload(messageCommand.REDISTR)(params.times,1,ncontents,global.ADDRESS,global.PORT,global.myId)
          )
    }
    else {
        outSocket.sendCommandTo(
            global.nextNode.ip,
            global.nextNode.port,
            messageCommand.REDISTR,
            outSocket.createCommandPayload(messageCommand.REDISTR)(0,0,params.contents,global.ADDRESS,global.PORT,global.myId)
          )
    }

}