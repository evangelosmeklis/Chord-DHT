const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
    var zifirst = params.thefirst //get the first
    var zitimes = params.times
    var change = false
    var cnodesid = []
    var cnodesip = []
    var cnodesport = []
  
    if (params.thefirst == global.myId){ //if we made a full circle just print the contents gathered
      if (zitimes>0){
        console.log("---Printing node IDs,IPs,Ports:)---" )
        for (f in params.thenodesid){ 
          console.log(params.thenodesid[f])
          console.log(params.thenodesip[f])
          console.log(params.thenodesport[f])
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

    if (change == false ){
        cnodesid = params.thenodesid
        cnodesip = params.thenodesip
        cnodesport = params.thenodesport
        cnodesid.push(global.myId)
        cnodesip.push(global.ADDRESS)
        cnodesport.push(global.PORT)
    }

    if (global.nextNode.ip && change==false) {
        return outSocket.sendCommandTo(
          //send overlay message to next node
          global.nextNode.ip,
          global.nextNode.port,
          messageCommand.OVERLAY,
          outSocket.createCommandPayload(messageCommand.OVERLAY)(zifirst,zitimes,cnodesid,cnodesip,cnodesport,params.sender)
        )
    }
}