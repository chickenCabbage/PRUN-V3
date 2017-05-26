var insp = require("node-metainspector");
var client = new insp("http://www.praguerace.com", {timeout: 99999}); //crawling config
var fs = require("fs");

var title = fs.readFileSync("./update.txt").toString().split(",")[1]; //stores the page's title

client.on("fetch", function(){ //when client.fetch() is called
	if(client.title != title) { //if the title changed - new page!
		var date = new Date();
		var time = date.getUTCHours() + ":" + date.getUTCMinutes() + " " +
		date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear() //date, in UTC

		console.log("UPDATED! on " + time + ": " + client.title); //woo
		fs.writeFile("./update.txt", time + "," + client.title + "," + client.images[0]); //change update.txt

		title = client.title;

		//ACTIVATE UPDATE MAILING HERE
	}
	else {
		console.log("DEBUG NOPE");
	}
});

client.on("error", function(err) { //if an error occures
  console.log(err);
});

client.fetch(); //initialization

setInterval(function() { //do this every 30 seconds (30,000 milis)
  client.fetch();
}, 30000);