
//Required modules
const ipfsClient = require('ipfs-http-client');
const express = require('express');
const fs = require('fs');
const app = express();

//Connceting to the ipfs network via infura gateway
//const ipfs = ipfsAPI('subgraph.daostack.io', '5001', {protocol: 'https'})
// or specifying a specific API path
var ipfs = ipfsClient({ host: 'subgraph.daostack.io', port: '443', 'api-path': '/ipfs/api/v0/', "protocol": "https", })

//Reading file from computer
let testFile = fs.readFileSync("ipfs-read.js");
//Creating buffer for ipfs function to add file to the system
let testBuffer = new Buffer(testFile);

// //Addfile router for adding file a local file to the IPFS network without any local node
// app.get('/addfile', function(req, res) {
//
//     ipfs.files.add(testBuffer, function (err, file) {
//         if (err) {
//           console.log(err);
//           console.log("t1");
//         }
//         console.log(file)
//         console.log("t2");
//       })
//
// })
// //Getting the uploaded file via hash code.
// app.get('/getfile', function(req, res) {
//
//     //This hash is returned hash of addFile router.
//     const validCID = 'HASH_CODE'
// console.log("t4");
//     ipfs.files.get(validCID, function (err, files) {
//         files.forEach((file) => {
//           console.log(file.path)
//             console.log("t3");
//           console.log(file.content.toString('utf8'))
//         })
//       })
//
// })

//Getting the uploaded file via hash code.
app.get('/pinls', function(req, res) {

    console.log("t4");
    ipfs.cat("QmYDnzLS93jNsfetXEEV4basy4vaw3YYRSTQB1czLQZQjV", function (err, file) {
  if (err) {
    throw err
  }

  console.log(file.toString('utf8'))
})
    // ipfs.pin.ls(function (err, pinset) {
    //     if (err) {
    //       throw err
    //     }
    //     console.log(pinset)
    // })

})
var buffer = '';
ipfs.pin.ls({ type: 'recursive' },function (err, pinset) {
    if (err) {
      throw err
    }
    var counter = 0;
    var filenumber = 0;
    pinset.forEach((pin) => {
        ipfs.get(pin.hash, function (err, files) {
            files.forEach((file) => {
              //console.log(file.path.length)
              if ((file.content  != undefined) && (file.path.length  == 46)) {
                //console.log(file.content.toString('utf8'))
                fs.writeFileSync("./ipfs-files/"+file.path, file.content.toString('utf8'))
                fs.appendFileSync("files_"+filenumber+".txt", "./ipfs-files/" + file.path+'\n')
                counter++;
                if (counter%50 == 0){
                  filenumber++;
                }
              }
            })
    })
   console.log("done")
  //  console.log(pinset)
})

})


app.listen(3000, () => console.log('App listening on port 3000!'))
