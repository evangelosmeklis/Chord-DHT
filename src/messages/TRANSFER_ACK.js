module.exports = (params) => {
  // the receiving node deletes the pair from the fileList, because the data was transfered
  delete global.fileList[params.key]
}
