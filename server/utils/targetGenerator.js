var crypto = require('crypto');
var upload = require('../routes/upload');

exports.compareHashes = compareHashes;
function compareHashes(hashA, hashB) {
    if(hashA === hashB){
        return 0;
    }
    else{
        for(var i = 0; i < hashA.length; i++) {
            if(hashA[i] === hashB[i])
                continue;
            if(hashA[i] > hashB[i]) {
                return 1;
                break;
            } else {
                return -1;
                break;
            }
        }
    }
}
exports.generateTarget = function() {
    var i = 0;
    var hashedSig = crypto.createHmac('sha256', "Security3")
        .update(String(Math.random()))
        .digest('hex');
    while(true) {
        if(hashedSig[0] === "4") {
            break;
        } else {
            hashedSig = crypto.createHmac('sha256', "Security3")
                .update(String(Math.random()))
                .digest('hex');
        }
    }
    console.log(hashedSig);
    return hashedSig;
}

exports.solveTarget = solveTarget;
function solveTarget(hash, index){
        setTimeout(function(){
            var nonce = String(Math.random());
            var hashedSig = crypto.createHmac('sha256', "Security3")
                .update(nonce)
                .digest('hex');
            if(compareHashes(hashedSig,hash) === -1) {
                //todo
                console.log(hashedSig);
                upload.addNonce(index,nonce);
            } else {
                solveTarget(hash, index);
            }
        },0);
}