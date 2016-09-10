 #!/usr/bin/env node
if (process.argv.length < 3) {
	console.log('Usage: node ' + process.argv[1] + ' FILENAME');
	process.exit(1);
}


var fs = require('fs');
var readline = require('readline');
var jsonArr=[];
var filename = process.argv[2];


var rd = readline.createInterface({
	input: fs.createReadStream(filename),
	output: process.stdout,
	terminal: false
});

rd.on('line', function(line) {
	var length = line.length;
	var start_pos = line.indexOf('[') + 1;
	var end_pos = line.indexOf(']',start_pos);
	var unameEnd = line.indexOf(':',end_pos);
	var time = line.substring(start_pos,end_pos);
	var uname = line.substring(end_pos+1,unameEnd).trim();
	var chatString = line.substring(unameEnd+1,length).trim();
	var json = {};
	json.timeStamp = time;
	json.username = uname;
	json.chatData = chatString;
	jsonArr.push(json);
});
rd.on('close',function(){
	var len = jsonArr.length;
	for(var i = 0;i<len;i++){
		var t = jsonArr[i].timeStamp;
		var ts = Math.round(new Date(t).getTime()/1000);
		jsonArr[i].timeStamp = ts;
	}
	var chatHistory = {
		"chatHistory":jsonArr
	};
	var outputFile = 'skypeChat.json';
	fs.writeFile(outputFile, JSON.stringify(chatHistory, null, 4), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("JSON saved to " + outputFile);
		}
	}); 
});


