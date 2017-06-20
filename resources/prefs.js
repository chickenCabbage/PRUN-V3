window.onLoad = check();

function check() {
	if(document.cookie.toString().length == 0 || document.cookie.toString() == "null") {
		if(confirm("You aren't logged in, and you won't be able to access this page until you log in. Log in now?")) {
			window.location = "/login.html";
		}
		else {
			window.location = "/";
		}
	}
	else {
		try {
			var name = document.cookie.split(",")[0];
			var password = document.cookie.split(",")[1].split(";")[0];
			jQuery.post("/login", {
				username: name,
				pass: password
			}, function(result) {
				switch(result.split(",")[0]) {
					case "complete":
					break;
					case "password":
						if(confirm("Your password/username is incorrect, and you won't\n" +
							"be able to access this page until you log in.\nLog in now?")) {
							window.location = "/login.html";
						}
						else {
							window.location = "/";
						}
					break;
					case "username":
						if(confirm("Your username credentials doesn't exist, and you won't\n" +
							"be able to access this page until you log in.\nLog in now?")) {
							window.location = "/login.html";
						}
						else {
							window.location = "/";
						}
					break;

					default:
						alert("A server error occured. When you press \"OK\" the page will be refreshed." +
							"\nError: " + result);
						window.location.reload();
					break;
				}
			});
		}
		catch(err) {
			alert("There was an error: \n" + err + 
			"\nWhen you click \"OK\" you will be redirected to the homepage.");
			window.location = "/";
		}
	}

	jQuery.get("/subbed", {
		name: document.cookie.split(",")[0]
	}, function(result) {
		result = result.split(",");
		var mails = (result[0] == "true");
		var dlogs = (result[1] == "true");

		document.getElementById("mailing").checked = mails;
		document.getElementById("devlogs").checked = dlogs;
	});
}

function logOut() {
	document.cookie = "; path=/prefs.html";
	document.cookie = "; path=/login.html";
	window.location = "/login.html";
}

//// SAVE DATA TO THE SERVER //////////////////////////////////////////////////////////////

function postPrefs() {
	try {
		var name = document.cookie.split(",")[0];
		var password = document.cookie.split(",")[1].split(";")[0];
		var updatemails = document.getElementById("mailing").checked;
		var devlogs = document.getElementById("devlogs").checked;

		jQuery.post("/save", {
			username: name,
			pass: password,
			mails: updatemails,
			logs: devlogs
		}, function(result) {
			switch(result.split(",")[0]) {
				case "complete":
					window.location.reload();
				break;
				case "password":
					if(confirm("Your password/username is incorrect, and you won't\n" +
						"be able to access this page until you log in.\nLog in now?")) {
						window.location = "/login.html";
					}
					else {
						window.location = "/";
					}
				break;
				case "username":
					if(confirm("Your username credential doesn't exist, and you won't\n" +
						"be able to access this page until you log in.\nLog in now?")) {
						window.location = "/login.html";
					}
					else {
						window.location = "/";
					}
				break;

				default:
					alert("A server error occured. When you press \"OK\" the page will be refreshed." +
						"\nError: " + result);
					window.location.reload();
				break;
			}
		});
	}
	catch(err) {
		alert("There was an error: \n" + err + 
			"\nWhen you click \"OK\" you will be redirected to the homepage.");
			window.location = "/";
	}
}

function postPW() {
	try {
		var name = document.cookie.split(",")[0];
		var password = document.getElementById("oldPW").value;
		var newPass = document.getElementById("newPW1").value;

		jQuery.post("/newPass", {
			username: name,
			pass: password,
			olga: newPass
		}, function(result) {
			switch(result.split(",")[0]) {
				case "complete":
				break;
				case "verify":
					if(confirm("Your username isn't verified, and you won't\n" +
						"be able to access this page until you verify your email.\nRefresh now?")) {
						window.location.reload();
					}
					else {
						window.location = "/";
					}
				break;
				case "password":
					logOut();
					if(confirm("Your password/username is incorrect, and you won't\n" +
						"be able to access this page until you log in.\nLog in now?")) {
						window.location = "/login.html";
					}
					else {
						window.location = "/";
					}
				break;
				case "username":
					logOut();
					if(confirm("Your username credentials doesn't exist, and you won't\n" +
						"be able to access this page until you log in.\nLog in now?")) {
						window.location = "/login.html";
					}
					else {
						window.location = "/";
					}
				break;

				default:
					alert("A server error occured. When you press \"OK\" the page will be refreshed." +
						"\nError: " + result);
					window.location.reload();
				break;
			}
		});
	}
	catch(err) {
		alert("There was an error: \n" + err + 
			"\nWhen you click \"OK\" you will be redirected to the homepage.");
			window.location = "/";
	}
}

function checkPW() {
	try {
		var pw1 = document.getElementById("newPW1").value;
		var pw2 = document.getElementById("newPW2").value;
		if (pw1 == pw2) {
			if(pw1.indexOf(",") != -1
				|| pw1.indexOf(":") != -1
				|| pw1.indexOf(" ") != -1
				|| pw1.indexOf("'") != -1
				|| pw1.indexOf("*") != -1
				|| pw1.indexOf("&") != -1
				|| pw1.indexOf("=") != -1
				|| pw1.indexOf("(") != -1
				|| pw1.indexOf(")") != -1
				|| pw1.indexOf("{") != -1
				|| pw1.indexOf("}") != -1
				|| pw1.indexOf("[") != -1
				|| pw1.indexOf("]") != -1
				|| pw1.indexOf("+") != -1
				|| pw1.indexOf("\\") != -1
				|| pw1.indexOf("\"") != -1) { //check for sh*t
				document.getElementById("warn").innerHTML = "Invalid password.";
				document.getElementById("warn").style.opacity = "1";
				document.getElementById("submit").disabled = true;
			}
			else {
				if (pw1.length > 6) {
					document.getElementById("warn").style.opacity = "0";
					document.getElementById("submit").disabled = false;
				}
				else {
					document.getElementById("warn").innerHTML = "Please use a password with more characters. (> 6)";
					document.getElementById("warn").style.opacity = "1";
					document.getElementById("submit").disabled = true;
				}
			}
		}
		else {
			document.getElementById("warn").innerHTML = "Passwords don't match!";
			document.getElementById("warn").style.opacity = "1";
			document.getElementById("submit").disabled = true;
		}
	}
	catch(err) {
		alert("There was an error: \n" + err + 
			"\nWhen you click \"OK\" you will be redirected to the homepage.");
			window.location = "/";
	}
}

function changePW() {
	try {
		var name = document.cookie.split(",")[0];
		var oldPass = document.getElementById("oldPW").value;
		var newPass = document.getElementById("newPW1").value;
		jQuery.post("/newPass", {
			username: name,
			pass: oldPass,
			new: newPass
		}, function(result) {
		console.log(result);
		});
	}
	catch(err) {
		alert("There was an error: \n" + err + 
			"\nWhen you click \"OK\" you will be redirected to the homepage.");
			window.location = "/";
	}
}