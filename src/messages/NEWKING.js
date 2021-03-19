const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')
const logger = require('knoblr')

module.exports = (params) => {
    if (!(params.change==1 && global.bootstrap == global.myId)) console.log("New bootstrap node is: " + params.bootstrap )
    global.bootstrap = params.bootstrap
    change = params.change
    if (global.nextNode.ip) {
        if (global.bootstrap == global.myId && params.change ==1 ) return
        else if (global.bootstrap == global.myId) change = params.change + 1

        return outSocket.sendCommandTo(
        global.nextNode.ip,
        global.nextNode.port,
        messageCommand.NEWKING,
        outSocket.createCommandPayload(messageCommand.NEWKING)(params.bootstrap,change)
        )
    }
}