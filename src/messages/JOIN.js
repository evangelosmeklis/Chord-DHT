const outSocket = require('../utils/socketClient')
const messageCommand = require('../config/messageStrings')

module.exports = (params) => {
  const idChecksum = parseInt(global.myId, 16)
  const ingressNodeChecksum = parseInt(params.id, 16)
  const nextNodeChecksum = global.nextNode.id ? parseInt(global.nextNode.id, 16) : 0
  //if the id of the joining node is closer to mine then inform the node that is going in that it is getting put behind me
  if (
    Math.abs(idChecksum - ingressNodeChecksum) >= Math.abs(nextNodeChecksum - ingressNodeChecksum) ||
    !global.previousNode.ip
  ) {
    outSocket.sendCommandTo(
      //It informs the node that wants to join that it can join
      params.nodeAddress,
      params.nodePort,
      messageCommand.JOIN_ACK,
      outSocket.createCommandPayload(messageCommand.JOIN_ACK)()
    )

    //if the current node has a node behind it then it informs it that its next node is going to be the one that just joined the network
    if (global.previousNode.ip) {
      outSocket.sendCommandTo(
        //sends the NEW NODE message to the predecessor
        global.previousNode.ip,
        global.previousNode.port,
        messageCommand.NEW_NODE,
        outSocket.createCommandPayload(messageCommand.NEW_NODE)(params.nodeAddress, params.nodePort, params.id)
      )
    }

    //if I am alone in the network then the node that just joined becomes my successor
    if (!global.nextNode.ip) {
      global.nextNode = {
        ip: params.nodeAddress,
        port: params.nodePort,
        id: params.id
      }
    }

    // Atualiza o nó anterior para o novo nó ingressante
    global.previousNode = {
      ip: params.nodeAddress,
      port: params.nodePort,
      id: params.id
    }

    // Realiza a transferência dos arquivos que não estão mais sob a responsabilidade deste nó
    if (Object.keys(global.fileList).length > 0) {
      // Para cada chave de arquivo (hash) armazenado na lista vamos testar se esse hash se encaixa na regra
      // Depois vamos enviar o comando TRANSFER passando o arquivo para o nó que acabou de entrar
      for (let fileHashName in global.fileList) {
        const fileHashChecksum = parseInt(fileHashName, 16)
        if (Math.abs(fileHashChecksum - idChecksum) >= Math.abs(fileHashChecksum - ingressNodeChecksum)) {
          outSocket.sendCommandTo(
            params.nodeAddress,
            params.nodePort,
            messageCommand.TRANSFER,
            outSocket.createCommandPayload(messageCommand.TRANSFER)(fileHashName, global.fileList[fileHashName], {
              ip: global.ADDRESS,
              port: global.PORT,
              id: global.myId
            })
          )
        }
      }
    }
  } else {
    // Se o ID não for maior, então temos que rotear a mensagem para o próximo nó
    outSocket.sendCommandTo(
      global.nextNode.ip,
      global.nextNode.port,
      messageCommand.JOIN,
      outSocket.createCommandPayload(messageCommand.JOIN)(params.nodeAddress, params.nodePort)
    )
  }
}
