var insp = require("node-metainspector");
var client = new insp("http://praguerace.com/", {
	timeout: 9999, //maximal reply time in ms. 9999 ~= 10 seconds
	headers: { //custom headers for the request
		"User-Agent": "prunScraper/update.js" //user agent
	}
}); //crawling config
var exec = require("child_process").exec; //for mailing jars
var colors = require("colors"); //for fancy console
var fs = require("fs"); //for readng the files
var intervalTime = 2 * 60 * 1000;

var title = fs.readFileSync("./update.txt").toString().split(",")[1]; //stores the page's title

function errPrint(text) { //in case of error
	console.log("\n" + colors.red("ERROR: ") + text);
	console.log("Error occured on " + now() + "\n");
}
function wrnPrint(text) { //in case of something important
	console.log(colors.yellow("WARNING: ") + text);
}

function now() { //return the current time
	var date = new Date();
	return date.toString();
}

client.on("fetch", function(){ //when client.fetch() is called
	try {
		title = fs.readFileSync("./update.txt").toString().split(",")[1]; //read the current data
		if(client.title != title) { //if the title changed - new page!
			var time = client.parsedDocument(".cc-publishtime").html() //the div content
			.split("<br>")[0].split("posted ")[1] + " EST"; //remove excess HTML/data
			fs.writeFile("./update.txt", time + "," + client.title + "," + client.images[0]); //change update.txt

			wrnPrint("UPDATED! on " + time + ": " + client.title); //woo
			console.log("Recoginzed on " + now() + "\n");

			title = client.title;

			var names = fs.readFileSync("./users/updates.dat").toString();
			names = names.replace("\n", " "); //the people in the mailing list
			var cmd = "java -jar mailer.jar " + names;
			exec(cmd, function(error, stdout, stderr){
				if(stdout != "") { //if there is output
					wrnPrint("mailer.jar says: " + stdout); //print it
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
	console.log("Checking at interval of " + (intervalTime / 1000) + " seconds.\n");
}
else {
	console.log("Checking at interval of " + ((intervalTime / 1000) / 60) + " minutes.\n");
}
client.fetch(); //initialization

setInterval(function() { //do this every [intervalTime] miliseconds
  client.fetch();
}, intervalTime);