var upload = require('./upload');


exports.list = function(req, res){
        res.send(JSON.stringify(upload.db));
};

exports.createBlock = function(){

};