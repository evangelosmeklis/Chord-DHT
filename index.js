argList = []
if (process.argv[2]) {
  if (process.argv[2] == "replication"){
    replication = process.argv[3]
  } 
  else{
    argList  = process.argv[2].split(',')
    if (process.argv[3]== 'replication'){
      replication = process.argv[4]
    }
  }
}


const nodeList = argList.map((nodeAddress) => {
  const [address, port] = nodeAddress.split(':')
  return {
    nodeAddress: address,
    nodePort: parseInt(port, 10)
  }
})

require('./src/node').start(nodeList,replication)
