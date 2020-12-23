module.exports = (min, max) => { //returns a random integer
  return Math.floor(Math.random() * (max - min + 1)) + min
}
