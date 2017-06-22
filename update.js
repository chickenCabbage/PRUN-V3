var insp = require("node-metainspector");
var client = new insp("http://www.praguerace.com", {timeout: 99999}, {"User-Agent" : "prunUpdater"}); //crawling config
var exec = require("child_process").exec;
var colors = require("colors");
var fs = require("fs");
var intervalTime = 1 * 60 * 1000;

var title = fs.readFileSync("./update.txt").toString().split(",")[1]; //stores the page's title

function errPrint(text) {
	console.log("\n" + colors.red("ERROR: ") + text);
	console.log("Error occured on " + now + "\n");
}
function wrnPrint(text) {
	console.log(colors.yellow("WARNING: ") + text);
}

function now() {
	var date = new Date();
	return date.toString();
}

client.on("fetch", function(){ //when client.fetch() is called
	try {
		title = fs.readFileSync("./update.txt").toString().split(",")[1];
		console.log("Made a request: " + title);
		if(client.title != title) { //if the title changed - new page!
			var time = client.parsedDocument(".cc-publishtime").html() //the div content
			.split("<br>")[0].split("posted ")[1] + " EST"; //remove excess HTML/data
			fs.writeFile("./update.txt", time + "," + client.title + "," + client.images[0]); //change update.txt

			wrnPrint("UPDATED! on " + time + ": " + client.title); //woo
			console.log("Recoginzed on " + now() + "\n");

			title = client.title;

			var names = fs.readFileSync("./users/updates.dat").toString();
			names = names.replace("\n", " ");

			var cmd = "java -jar mailer.jar " + names;
			exec(cmd, function(error, stdout, stderr){
				if(stdout != "") { //if there is output
					wrnPrint("mailer.jar says: " + stdout);
				}
				if(stderr != "") { //if there is errput
					errPrint("Mailer.jar: " + stderr); //print it too
				}
			}); //end exec
		}//end if
	}//end try
	catch(err) {
		errPrint(err);
	}
});

client.on("error", function(err) { //if an error occures
	errPrint(err);
});

console.log("Starting now, " + now() + ".");
if(((intervalTime / 1000) / 60) == 0) {
	console.log("Checking at interval of " + (intervalTime / 1000) + " seconds.");
}
else {
	console.log("Checking at interval of " + ((intervalTime / 1000) / 60) + " minutes.");
}
now();
client.fetch(); //initialization

setInterval(function() { //do this every 30 seconds (30,000 milis)
  client.fetch();
}, intervalTime);