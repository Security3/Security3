var upload = require('./upload');
var fs = require('fs');
var walk = require('walk');
var crypto = require('crypto');
	
exports.verify = function(req, res){
	console.log(req.files);
	fs.readFile(req.files.file.path, function (err, data) {
		var newPath = __dirname + "/../public/verifyUploads/"+req.files.file.name;

		var hashedSig = crypto.createHmac('sha256', "Security3")
                       .update(data)
                       .digest('hex');
    		console.log(hashedSig);
		console.log(upload.db);
		fs.writeFile(newPath, data, function (err) {
			res.send("ok");
		});
	});
};

exports.list = function(req, res){
	var files = [];
	var walker  = walk.walk("./public/verifyUploads/", { followLinks: false });

	walker.on('file', function(root, stat, next) {
		// Add this file to the list of files
		var fileName = root + stat.name;
		console.log(fileName);
		fs.readFile(fileName, function (err, data) {
			console.log(err);
			console.log(data);
			var hashedSig = crypto.createHmac('sha256', "Security3")
				.update(data)
				.digest('hex');
			fileName = fileName.replace('./public','http://52.211.100.116');
			var integrity = false;
			var block = null;
			if (upload.findBlock(hashedSig) !== null) {
				integrity = true;
				block = upload.findBlock(hashedSig);
			}
			var fileJSO = {link:fileName,fileName:stat.name,hash:hashedSig,integrity:integrity,block:block};
			files.push(fileJSO);
			next();
		});
	});

	walker.on('end', function() {
		console.log(files);
		res.send(JSON.stringify(files));
	});
};