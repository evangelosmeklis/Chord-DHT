fs = require('fs')
const prompt = require('prompt-sync')();
const outSocket = require('./src/utils/socketClient')
const messageCommand = require('./src/config/messageStrings')
const hashMaker = require('./src/utils/hashFactory')

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const replication = prompt('What is the k: ');
const type = prompt('What is the replication type (0 for chain replication , 1 for eventual-consistensy): ');

const id1 = prompt('What is your id1: ');
const ip1 = prompt('What is your ip1: ');
const port1  = prompt('What is your port1: ');

const id2 = prompt('What is your id2: ');
const ip2 = prompt('What is your ip2: ');
const port2  = prompt('What is your port2: ');

const ip3 = prompt('What is your ip3: ');
const id3 = prompt('What is your id3: ');
const port3  = prompt('What is your port3: ');

const ip4 = prompt('What is your ip4: ');
const id4 = prompt('What is your id4: ');
const port4  = prompt('What is your port4: ');

const ip5 = prompt('What is your ip5: ');
const id5 = prompt('What is your id5: ');
const port5  = prompt('What is your port5: ');

const ip6 = prompt('What is your ip6: ');
const id6 = prompt('What is your id6: ');
const port6  = prompt('What is your port6: ');

const ip7 = prompt('What is your ip7: ');
const id7 = prompt('What is your id7: ');
const port7  = prompt('What is your port7: ');

const ip8 = prompt('What is your ip8: ');
const id8 = prompt('What is your id8: ');
const port8  = prompt('What is your port8: ');

const ip9 = prompt('What is your ip9: ');
const id9 = prompt('What is your id9: ');
const port9  = prompt('What is your port9: ');

const ip10 = prompt('What is your ip10: ');
const id10 = prompt('What is your id10: ');
const port10  = prompt('What is your port10: ');

fs.readFile('insert.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }

    const lines = data.split(/\r?\n/);
    console.time("dbsave");
    // print all lines
    lines.forEach((line) => {
        var choose = getRandomInt(9) + 1
        if (choose == 9) {
            sndrip = ip9
            sndrport = port9
            rcvip = ip1
            rcvport = port1
            rcvid = id1
        }
        if (choose == 8) {
            sndrip = ip8
            sndrport = port8
            rcvip = ip9
            rcvport = port9
            rcvid = id9
        }
        if (choose == 7) {
            sndrip = ip7
            sndrport = port7
            rcvip = ip8
            rcvport = port8
            rcvid = id8
        }
        if (choose == 6) {
            sndrip = ip6
            sndrport = port6
            rcvip = ip7
            rcvport = port7
            rcvid = id7
        }
        if (choose == 5) {
            sndrip = ip5
            sndrport = port5
            rcvip = ip6
            rcvport = port6
            rcvid = id6
        }
        if (choose == 4) {
            sndrip = ip4
            sndrport = port4
            rcvip = ip5
            rcvport = port5
            rcvid = id5
        }
        if (choose == 3) {
            sndrip = ip3
            sndrport = port3
            rcvip = ip4
            rcvport = port4
            rcvid = id4
        }
        if (choose == 2) {
            sndrip = ip2
            sndrport = port2
            rcvip = ip3
            rcvport = port3
            rcvid = id3
        }
        if (choose == 1) {
            sndrip = ip1
            sndrport = port1
            rcvip = ip2
            rcvport = port2
            rcvid = id2
        }
        key = line.split(',')[0]
        val = line.split(',')[1]
        console.log(key)
        const hashKey = hashMaker.generateHashFrom(key) //hashes the key
        outSocket.sendCommandTo(
            sndrip,
            sndrport,
            messageCommand.STORE,
            outSocket.createCommandPayload(messageCommand.STORE)(hashKey, val,replication,type,rcvip,rcvport,rcvid)
          )
        console.log(line);
    })
    console.timeEnd("dbsave")
});
