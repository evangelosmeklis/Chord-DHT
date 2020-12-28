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
    else replication = 1
  }
}

type = 0
if (process.argv[4]){
  if (process.argv[4] == "type"){
    if (process.argv[5] == "chain-replication") type = 0
    else if (process.argv[5] == "eventual-consistency" ) type = 1
    else {
      type = 0
      console.log("type not recognized. Implementing chain replication")
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

require('./src/node').start(nodeList,replication,type)
