#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const ipfsClient = require('ipfs-http-client')

if (process.argv.length < 4) {
  console.error(`Usage: ${path.basename(process.argv[1])} <ipfs-node> <file>`)
  console.error('')
  console.error('Each line of <file> must contain the path of a file to be uploaded.')
  console.error('')
  console.error('Example:')
  console.error('')
  console.error(`  ${path.basename(process.argv[1])} https://api.thegraph.com/ipfs/ files.txt`)
  process.exit(1)
}

let NODE = new URL(process.argv[2])
let FILE = process.argv[3]
let i=5;

setInterval(intervalFunc, 10000);

function intervalFunc() {
  console.log('Cant stop me now!');
FILE= "files_"+i+".txt";
i = i+1;
console.log('FILE:'+FILE);
// Read all filenames from the input file
let filenames = fs.readFileSync(FILE, 'utf-8').trim().split('\n').filter(line => line !== '')

if (filenames.length === 0) {
  console.error(`Error: No filenames found in ${FILE}`)
  process.exit(1)
}

// Check if all files exist
let nonExistentFiles = false
for (let filename of filenames) {
  if (!fs.existsSync(filename)) {
    console.error(`Error: File ${filename} does not exist`)
    nonExistentFiles = true
  }
}
if (nonExistentFiles) {
  process.exit(1)
}


// Upload all files in parallel
(async () => {
  // Connect to IPFS
  let ipfs = ipfsClient({
    host: NODE.host,
    protocol: NODE.protocol.replace(':', ''),
    port: NODE.port,
    'api-path': `${NODE.pathname}/api/v0/`,
  })



  // try {
  //   try {
  //     let result = await ipfs.addFromFs("./ipfs-files/")
  //     console.log(`Uploaded :)`)
  //     //console.log(`Uploaded ${filename} -> ${result[0].hash}`)
  //   } catch (e) {
  //     console.error(`Failed to upload ${filename}`)
  //     throw e
  //   }
  // } catch (_e) {
  //   console.error(`Error: Failed to upload files to IPFS at ${NODE}`)
  //   process.exit(1)
  // }
  setTimeout(function () {

var counter = 1;
var file_number = 1;
  try {
    filenames.forEach(async (filename) => {
    file_number++;
    //await Promise.all(filenames.map(async filename => {
      try {
        let result = await ipfs.add(fs.readFileSync(filename))
        console.log(`Uploaded ${filename} -> ${result[0].hash} ` + counter)
        counter++;

      } catch (e) {
        console.error(`Failed to upload ${filename}`)
        throw e
      }
    })
  } catch (_e) {
    console.error(`Error: Failed to upload files to IPFS at ${NODE}`)
    process.exit(1)
  }
}, 10)
})()
}
