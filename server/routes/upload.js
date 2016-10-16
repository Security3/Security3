/**
 * http://usejsdoc.org/
 */
var fs = require('fs');
var walk = require('walk');
var crypto = require('crypto');

var db = [];
exports.db = db;
	
exports.upload = function(req, res){
	console.log(req.files);
	fs.readFile(req.files.file.path, function (err, data) {
  		// ...
  		var newPath = __dirname + "/../public/uploads/"+req.files.file.name;
		console.log(newPath);

		var hashedSig = crypto.createHmac('sha256', "Security3")
                       .update(data)
                       .digest('base64');
    		console.log(hashedSig);
		var nuHash = {fileName:req.files.file.name,hash:hashedSig};
		db.push(nuHash);
		console.log(db);
  		fs.writeFile(newPath, data, function (err) {
    			res.send("ok");
  		});
	});
};
exports.list = function(req, res){
	var files = [];
	var walker  = walk.walk("./public/uploads/", { followLinks: false });

	walker.on('file', function(root, stat, next) {
    		// Add this file to the list of files
		var fileName = root + stat.name;
		fileName = fileName.replace('./public','http://52.211.100.116');
		console.log('Searching hash for: ' + stat.name);
		var curHash = db[findHash(stat.name)].hash;
		var fileJSO = {link:fileName,fileName:stat.name,hash:curHash};
    		files.push(fileJSO);
    		next();
	});

	walker.on('end', function() {
    		console.log(files);
		res.send(JSON.stringify(files));
	});
};

function findFile(hash, fileName) {
	var index = null;
	for(var i = 0; i < db.length; i++) {
		if(db[i].hash === hash && db[i].fileName === fileName) {
			index = i;
			break;
		}
	}
	return index;
}

exports.findHash = findHash;

function findHash(fileName) {
	console.log('In findHash for: ' + fileName);
	var index = null;
	console.log("Current db.length: " + db.length);
	for(var i = 0; i < db.length; i++) {
		console.log('Current set: ' + db[i].fileName + ";" + db[i].hash);
		if(db[i].fileName === fileName) {
			console.log('Found set: ' + db[i].fileName + ";" + db[i].hash);
			index = i;
			console.log('Breaking...');
			break;
		}
	}
	console.log('Returning: ' + index);
	return index;
}

exports.refreshDb = refreshDb;

function refreshDb() {
	//import all hashes
	var walker  = walk.walk("./public/uploads/", { followLinks: false });

	walker.on('file', function(root, stat, next) {
		var fileName = stat.name;

		fs.readFile(root + stat.name, function (err, data) {
			var hashedSig = crypto.createHmac('sha256', "Security3")
				.update(data)
				.digest('base64');
			var nuHash = {fileName:fileName,hash:hashedSig};
			db.push(nuHash);
			next();
		});


	});

	walker.on('end', function() {
		console.log(db);
	});
};

//AngularJS post für SHA hashkey
		
		
