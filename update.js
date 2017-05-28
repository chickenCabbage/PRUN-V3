var insp = require("node-metainspector");
var client = new insp("http://www.praguerace.com", {timeout: 99999}); //crawling config
var color = require("colors");
var fs = require("fs");

var title = fs.readFileSync("./update.txt").toString().split(",")[1]; //stores the page's title

client.on("fetch", function(){ //when client.fetch() is called
	title = fs.readFileSync("./update.txt").toString().split(",")[1];
	if(client.title != title) { //if the title changed - new page!
		var time = client.parsedDocument(".cc-publishtime").html() //the div content
		.split("<br>")[0].split("posted ")[1] + " EST"; //remove excess HTML/data
		fs.writeFile("./update.txt", time + "," + client.title + "," + client.images[0]); //change update.txt

		console.log("\n" + color.bold("UPDATED!") + " on " + time + ": " + client.title); //woo
		var date = new Date();
		time = date.getUTCHours() + ":" + date.getUTCMinutes() + " " +
		date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear() //date, in UTC
		console.log("Recoginzed on " + time + "\n");

		title = client.title;

		//ACTIVATE UPDATE MAILING HERE
	}
	else {/*CRY*/}
});

client.on("error", function(err) { //if an error occures
  console.log(err);
});

console.log("Starting now.");
client.fetch(); //initialization

setInterval(function() { //do this every 30 seconds (30,000 milis)
  client.fetch();
}, 30000);