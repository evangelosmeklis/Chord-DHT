module.exports = (params) => {
  // When the network has only 2 nodes, then the remaining has to point to itself
  if (params.nextId === global.myId) {
    global.previousNode = { id: null, ip: null, port: null }
    global.nextNode = { id: null, ip: null, port: null }
    return
  }

  global.nextNode = {
    id: params.nextId,
    ip: params.nextIp,
    port: params.nextPort
  }
}
