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
                       .digest('base64');
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
		console.log('Searching hash for: ' + stat.name);
		fs.readFile(fileName, function (err, data) {
			console.log(err);
			console.log(data);
			var hashedSig = crypto.createHmac('sha256', "Security3")
				.update(data)
				.digest('base64');

			var fileJSO = {link:fileName,fileName:stat.name,hash:hashedSig};
			files.push(fileJSO);
			next();
		});
	});

	walker.on('end', function() {
		console.log(files);
		res.send(JSON.stringify(files));
	});
};