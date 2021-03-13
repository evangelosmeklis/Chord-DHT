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
        fcontents = []
        if (global.replication > 1){
            //console.log(ncontents)
            check = 0
            for(i=0;i<ncontents.length-1;i++){
                var temp0 = ncontents[i][0]
                var temp1 = ncontents[i][1]
                //console.log(temp0,temp1)
                //console.log("contents length: " + ncontents.length)
                for (g=i+1;g<ncontents.length-1;g++) {
                    //console.log(ncontents[g][0],ncontents[g][1])
                    if (ncontents[g][0] == temp0 && ncontents[g][1] == temp1){
                        check=1
                    } 
                }
                if (check == 0){
                    fcontents.push([temp0,temp1])
                }
                else check = 0
            }
            //console.log(ncontents)
        }
        else {
            fcontents = ncontents
        }
        for(let f in fcontents){
            //console.log(ncontents[f][0])
            outSocket.sendCommandTo(
                global.nextNode.ip,
                global.nextNode.port,
                messageCommand.STORE,
                outSocket.createCommandPayload(messageCommand.STORE)(ncontents[f][0], ncontents[f][1],global.replication,global.type,1,global.ADDRESS,global.PORT,global.myId)
              )
        }
    }
    else if (params.foundb == 1) {
        for (let fileHashName in global.fileList){
            var ar = [ fileHashName,global.fileList[fileHashName] ]
            //console.log(ar)
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