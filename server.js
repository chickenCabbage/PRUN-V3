var removeEmptyLines = require("remove-blank-lines"); //lazy af
var exec = require("child_process").exec;
var crypto = require("crypto"); //nodejs cryptography
var colors = require("colors"); //awsome console
var http = require("http"); //basic HTTP shit
var fs = require("fs"); //for file I/O
var port = 8888;
var body = ""; //for POST data

function errPrint(text) {
	console.log("\n" + colors.red("ERROR: ") + text + "\n");
}
function wrnPrint(text) {
	console.log(colors.yellow("WARNING: ") + text);
}

function newUser(request, response) { //when a user is trying to subscribe
	body = ""; //THIS IS IMPORTANT SO PAST CREDENTIALS DON'T GET CARRIED OVER
	request.on("data", function(chunk) { //read the request data into body
		body += chunk;
	});
	request.on("end", function() { //when you're done reading the data
		body = body.replace(" ", "%20");

		//for future reference
		//body.split("=")[1].split("&")[0].replace("%40", "@") gives the email
		//body.split("=")[2] gives the password
		//just 'cause

		var name = body.split("=")[1].split("&")[0].replace("%40", "@"); //the POST-extracted username

		try { //for any errors that may occure
			try { //see if the file exists
				fs.readFileSync("./users/" + name + ".usr");
				//if you can find that file there's a user with that name
				//if not an ENOENT (404) will be thrown
				response.writeHead(200, {"Content-Type": "text/plain"}); //DON'T MAKE THIS STATUS 404
				response.end("exists"); //it is required for good client-side JS operation
			}
			catch (err) { //if it doesn't exist it'll throw ENOENT and go here
				if(err.code == "ENOENT"){
					var cmd = "java -jar verify.jar " + name + " " + hash(body.split("=")[2]);
					//run verify.jar with the name and encrypted PW of the new user
					exec(cmd, function(error, stdout, stderr){
						if(stdout != "") { //if there is output
							wrnPrint("Verify.jar says: " + stdout);
						}
						if(stderr != "") { //if there is errput
							errPrint("Verify.jar: " + stderr); //print it too
						}
					}); //end exec
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.end("complete"); //if you made it this far all's cool, things executed well
					wrnPrint("Added user: " + name);
				} //if the file does exist but it did a "wrong step" and died
				else { //general error
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.end(err);
					errPrint("An error occured on signup! " + err + "\nUser: " + name);
				} //end if-else
			} //end catch
		} //end try
		catch(err) { //this sucks
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.end(err);
			errPrint("An error occured on signup! " + err + "\nUser: " + name);

		} //end catch
	}); //end request.on("end", function() {})
} //end newUser return list;

function authLogin(request, response) { //on every login attempt
	body = ""; //THIS IS IMPORTANT SO PAST CREDENTIALS DON'T GET CARRIED OVER
	request.on("data", function(chunk) { //read the POST data
		body += chunk;
	});
	request.on("end", function() { //when you're done
		body = body.replace(" ", "%20");
		try {
			var name = body.split("=")[1].split("&")[0].replace("%40", "@").toString(); //a little shorter
			var password = body.split("=")[2].toString();
			//if the given password matches the decypted password from the file
			if(fs.readFileSync("./users/" + name + ".usr").toString() == hash(password)) {
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.end("complete"); //you're good
			}
			else { //if it doesn't match
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.end("password");
				//either you typed your mail wrong and there's another user with this mail
				//or, y'know, you mistyped/forgot your password
			}
		} //end try
		catch(err) {
			try {
				fs.readFileSync("./users/" + name + ".unv");
				if(err.code == "ENOENT") { //the .usr wasn't found but the .unv was
					//the email hasn't been verified
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.end("verify");
				}
				else { //any other error
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.end(err);
					errPrint("An error occured on login! " + err + "\nUser: " + name);
				}
			}
			catch(err2) {
				if(err2.code == "ENOENT") { //if there's no such file
					//this user doesn't exist yet or you haven't verified your email
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.end("username");
				}
				else { //any other error
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.end(err + "");
					errPrint("An error occured on login! " + err + "\nUser: " + name);
				}
			}
		} //end catch
	}); //end request.on("end", function() {})
} //end authLogin

function replacePW(request, response) {
	body = ""; //THIS IS IMPORTANT SO PAST CREDENTIALS DON'T GET CARRIED OVER
	request.on("data", function(chunk) { //read the POST data
		body += chunk;
	});
	request.on("end", function() { //when you're done
		body = body.replace(" ", "%20");
		var name = body.split("=")[1].split("&")[0].replace("%40", "@");
		var oldp = body.split("=")[2].toString().split("&")[0];
		var newp = body.split("=")[3].toString();

		try {
			//if the given password matches the decypted password from the file
			var content = fs.readFileSync("./users/" + name + ".usr")
			if(content == hash(oldp)) {
				response.writeHead(200, {"Content-Type": "text/plain"});

				fs.writeFileSync("./users/" + name + ".usr", hash(newp));
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.end("complete"); //you're good
			}
			else { //if it doesn't match
				response.writeHead(200, {"Content-Type": "text/plain"});
				response.end("password");
				//either you typed your mail wrong and there's another user with this mail
				//or, y'know, you mistyped/forgot your password
			}
		} //end try
		catch(err) {
			try {
				fs.readFileSync("./users/" + name + ".unv");
				if(err.code == "ENOENT") { //the .usr wasn't found but the .unv was
					//the email hasn't been verified
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.end("verify");
				}
				else { //any other error
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.end(err);
					errPrint("An error occured on password change! " + err + "\nUser: " + name);
				}
			}
			catch(err2) {
				if(err2.code == "ENOENT") { //if there's no such file
					//this user doesn't exist yet or you haven't verified your email
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.end("username");
				}
				else { //any other error
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.end(err);
					errPrint("An error occured on password change! " + err + "\nUser: " + name);
				}
			}
		} //end catch
	});
}

function savePrefs(request, response) {
	body = ""; //THIS IS IMPORTANT SO PAST CREDENTIALS DON'T GET CARRIED OVER
	request.on("data", function(chunk) { //read the request data into body
		body += chunk;
	});
	request.on("end", function() { //when you're done reading the data
		body = body.replace(" ", "%20");
		var name = body.split("=")[1].split("&")[0].replace("%40", "@"); //their username
		var pass = body.split("=")[2].toString().split("&")[0]; //password
		var mail = body.split("=")[3].toString().split("&")[0] == "true"; //do they want to be updated
		var logs = body.split("=")[4].toString() == "true"; //devlogs mailing list

		try {
			if(fs.readFileSync("./users/" + name + ".usr") == hash(pass)) {
				if(mail) { //user wants to subscribe
					var content = fs.readFileSync("./users/updates.dat");
					if(content.indexOf(name) == -1) { //if they're not already subscribed
						fs.appendFile("./users/updates.dat", "\n" + name); //add them - this works
					}
				}
				else { //user wants to unsubscribe
					var content = fs.readFileSync("./users/updates.dat").toString();
					content = content.split("\n"); //split it to lines
					var l = content.length, a = 0; //a is the index, l is the length
					fs.writeFileSync("./users/updates.dat", ""); //clear it for writing
					var data = "";
					while(l > a) { //for every element in the array
						if(content[a] != name) { //check if it's the name
							data += (content[a] + "\n");
						}
						a ++;
					}
					data = removeEmptyLines(data);
					fs.writeFile("./users/updates.dat", data);
				}

				if(logs) { //user wants to get devlogs
					var content = fs.readFileSync("./users/devlogs.dat");
					if(content.indexOf(name) == -1) {
						fs.appendFile("./users/devlogs.dat", "\n" + name);
					}
				}
				else {
					var content = fs.readFileSync("./users/devlogs.dat").toString();
					content = content.split("\n"); //split it to lines
					var l = content.length, a = 0; //a is the index, l is the length
					fs.writeFileSync("./users/devlogs.dat", ""); //clear it for writing
					var data = "";
					while(l > a) { //for every element in the array
						if(content[a] != name) { //check if it's the name
							data += (content[a] + "\n");
						}
						a ++;
					}
					data = removeEmptyLines(data);
					fs.writeFile("./users/devlogs.dat", data);
				}

				response.writeHead(200, {"Content-Type": "text/plain"});
				response.end("complete"); //you're good
			}
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.end("password"); //you're not good
		}
		catch(err) {
			if(err.code == "ENOENT") {
				try {
					fs.readFileSync("./users/" + name + ".unv");
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.end("verify");
				}
				catch(err2) {
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.end("username");
				}
			}
			else {
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.end(err);
				errPrint("An error occured on prefs saving! " + err + "\nUser: " + name);
			}
		}
	});
}

function recoverMail(name, request, response) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.end("complete");
	//////////////////////////////////////////////////////////////////////////////////////////////////
}

function hash(text) { //encrypt text
	try {
		return crypto.createHash("md5").update(text).digest("hex");
	}
	catch(err) {
		return null;
	}
}

http.createServer(function(request, response) { //on every request to the server
	try {
		if(request.url == "/server.js"
			|| request.url == "/update.js"
			|| request.url == "/verify.jar"
			|| request.url == "/mailer.jar"
			|| request.url == "/README.md"
			|| request.url.toString().indexOf("/users/") != -1) { //NOPE
			throw "403"; //FORBIDDEN AS F**K
		}

		if(request.method == "GET") { //if it's a normal request
			if(request.url == "/") { //because index.html's path isn't actually "/"
				var file;
				file = fs.readFileSync("./index.html");
			}
			else if(request.url.toString().split(".")[1] == "png") {
				response.writeHead(200, {"Content-Type": "image/png"});
				var file = fs.readFileSync("." + request.url);
				response.end(file);
			}
			else if(request.url.toString().split(".")[1] == "ico") {
				response.writeHead(200, {"Content-Type": "image/x-icon"});
				var file = fs.readFileSync("." + request.url);
				response.end(file);
			}
			else if(request.url.toString().split(".")[1] == "jpg") {
				response.writeHead(200, {"Content-Type": "image/jpg"});
				var file = fs.readFileSync("." + request.url);
				response.end(file);
			}
			else if(request.url.toString().split(".")[1] == "css") { //css styleshits
				response.writeHead(200, {"Content-Type": "text/css"});
				var file = fs.readFileSync("." + request.url);
				response.end(file);
			}
			else if(request.url.toString().split(".")[1] == "js") { //js files
				response.writeHead(200, {"Content-Type": "application/javascript"});
				var file = fs.readFileSync("." + request.url);
				response.end(file);
			}
			else if(request.url.toString().indexOf("verify?name=") != -1) {
			//if someone is trying to verify their mail
				try {
					var name = request.url.split("?")[1].split("=")[1].split("&")[0]; //get the name
					var number = request.url.split("?")[1].toString().split("=")[2]; //get the number
					var contentArr = fs.readFileSync("./users/" + name + ".unv").toString().split(" ");

					if(contentArr[1] == number) { //authenticate
						fs.writeFileSync("./users/" + name + ".usr", contentArr[0]);
						fs.unlink("./users/" + name + ".unv");

						file = fs.readFileSync("./login.html");
						response.writeHead(200, {"Content-Type": "text/html"});
						response.end(file);
					}
				}
				catch(err) {
					if(err.code == "ENOENT"){
						try {
							fs.readFile("./users/" + name + ".usr");
							file = fs.readFileSync("./login.html");
							response.writeHead(200, {"Content-Type": "text/html"});
							response.end(file);
						}
						catch(err2) {
							file = fs.readFileSync("./login.html");
							response.writeHead(404, {"Content-Type": "text/html"});
							response.end(file);
						}
					}
					else {
						response.writeHead(500, {"Content-Type": "text/html"});
						response.end(err);
						errPrint("Error in mailing list check!\n" + err);
					}
				}
			}
			else if(request.url.toString().indexOf("recover?name=") != -1) {
				try {
					var name = request.url.split("?")[1].split("=")[1].replace("%40", "@");
					errPrint(name);
					recoverMail(name, request, response);
				}
				catch(err) {
					errPrint("Error on password recovery! " + err);

				}
			}
			else if(request.url.toString().indexOf("subbed?name=") != -1) {
				try {
					var name = request.url.toString().split("=")[1].toString().replace("%40", "@");
					var mails = (fs.readFileSync("./users/updates.dat").toString().indexOf(name) != -1);
					var dlogs = (fs.readFileSync("./users/devlogs.dat").toString().indexOf(name) != -1);

					response.writeHead(200, {"Content-Type": "text/html"});
					response.end(mails + "," + dlogs);
				}
				catch(err) {
					response.writeHead(500, {"Content-Type": "text/html"});
					response.end(err);
					errPrint("Error in mailing list check!\n" + err);
				}
			}
			else {
				file = fs.readFileSync("." + request.url); //read the requested file
			}
			response.writeHead(200, {"Content-Type": "text/html"});
			response.end(file);
		}
		else { //if it's a POST request; if it has data
			if(request.url == "/newUser") { //someone is trying to sign up, handle with newUser
				response.writeHead(200, {"Content-Type": "text/plain"});
				newUser(request, response);
			}
			else if(request.url == "/login") { //someone is trying to log in, handle with authLogin
				response.writeHead(200, {"Content-Type": "text/plain"});
				authLogin(request, response);
			}
			else if(request.url == "/newPass") {
				replacePW(request, response);
			}
			else if(request.url == "/save") {
				savePrefs(request, response);
			}
			else { //just a request for a normal file
				var file = fs.readFileSync("." + request.url); //read the requested file
				response.writeHead(200, {"Content-Type": "text/html"});
				response.end(file);
			}
		}
	}
	catch(err) {
		if(err.code == "ENOENT") {
			response.writeHead(404, {"Content-Type": "text/html"});
			response.end("<h1>Oops.</h1>" +
				"<p>There was an error, the page you're looking for can't be found.</p>" +
				"<p>HTTP error 404.</p>");
			wrnPrint("Served 404 for " + request.url);
		}
		else if(err == "403") {
			response.writeHead(403, {"Content-Type": "text/html"});
			response.end("<h1>Oops.</h1>" +
				"<p>There was an error, the file you're trying to access is forbidden.</p>" +
				"<p>Trying to access this file after being warned is ground for legal action.</p>" +
				"<p>HTTP error code: 403.</p>");

			var ip = request.headers['x-forwarded-for'] || //extract IP address from the request
				request.connection.remoteAddress ||
				request.socket.remoteAddress ||
				request.connection.socket.remoteAddress;
			var now = new Date();

			console.log(colors.red("\nERROR: ") + "Served 403 for " + request.url + ", 403 Forbidden.");
			console.log(colors.red("TIME: ") + now);//I want to have records of this in case something is hacked
			console.log(colors.red("IP: ") + ip + '\n');
		}
		else {
			response.writeHead(500, {"Content-Type": "text/html"});
			response.end("<h1>Oops.</h1>" +
				"<p>There was an error.</p>" +
				"<p>JavaScript error code: " + err.code + "</p>");
			errPrint("Served 500 for error: " + err + "\nRequest: " + request.url);
		}
	}
}).listen(port);
console.log("Listening on " + port + ".");