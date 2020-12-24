module.exports = () => {
    console.log("---Printing contents of node---" )
    console.log({ ip: global.ADDRESS, port: global.PORT, id: global.myId })
    console.log("---Contents---")
    for (let info in global.fileList){
      console.log(global.fileList[info])
    }
}