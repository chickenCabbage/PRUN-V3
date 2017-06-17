//// POST DATA TO THE SERVER //////////////////////////////////////////////////////////////

function check() {
	var name = document.cookie.split(",")[0];
	var password = document.cookie.split(",")[1].split(";")[0];
	jQuery.post("/login", {
		username: name,
		pass: password
	}, function(result) {
		if(result.indexOf("complete") == 0) {
			window.location = "/prefs.html";
		}
	});
}

function post() {
	var name = document.getElementById("name").value.toLowerCase();
	var password = document.getElementById("pw").value;

	if(password.indexOf(",") != -1
		|| password.indexOf(":") != -1
		|| password.indexOf(" ") != -1
		|| password.indexOf("'") != -1
		|| password.indexOf("*") != -1
		|| password.indexOf("&") != -1
		|| password.indexOf("=") != -1
		|| password.indexOf("\\") != -1
		|| password.indexOf("\"") != -1) { //not gonna inject me, boi
		document.getElementById("warn").innerHTML = "Invalid password.";
		document.getElementById("warn").style.opacity = "1";
		return;
	}
	if(name.indexOf(",") != -1
		|| name.indexOf(":") != -1
		|| name.indexOf(" ") != -1
		|| name.indexOf("'") != -1
		|| name.indexOf("*") != -1
		|| name.indexOf("&") != -1
		|| name.indexOf("=") != -1
		|| name.indexOf("%") != -1
		|| name.indexOf("\\") != -1
		|| name.indexOf("\"") != -1
		|| name.indexOf("@") == -1
		|| name.indexOf(".") == -1) {
		document.getElementById("warn").innerHTML = "Invalid email address.";
		document.getElementById("warn").style.opacity = "1";
		return;
	}
	else {
		document.getElementById("warn").style.opacity = "0";
		document.getElementById("warn").innerHTML = "Access granted, hacking the mainframe...";
	}

	jQuery.post("/login", {
		username: name,
		pass: password
	}, function(result) {
		switch(result.split(",")[0]) {
			case "complete":
				var d = new Date();
				d.setTime(d.getTime() + (28 * 24 * 60 * 60 * 1000)); //in four weeks the cookie will expire
				var ex = d.toUTCString();

				document.cookie = name + "," + password + "; expires=" + ex + "; path=/prefs.html";
				document.cookie = name + "," + password + "; expires=" + ex + "; path=/login.html";
				document.getElementById("warn").style.opacity = "0";
				window.location = "/prefs.html";
			break;
			case "password": //the password deosn't match the username
				document.getElementById("warn").innerHTML = "Incorrect password.";
				document.getElementById("warn").style.opacity = "1";
			break;
			case "username": //username doesn't exist
				document.getElementById("warn").innerHTML = "This user doesn't exist!";
				document.getElementById("warn").style.opacity = "1";
			break;
			case "verify": //the user's email isn't verified
				document.getElementById("warn").innerHTML = "You need to verify your email before logging in.";
				document.getElementById("warn").style.opacity = "1";
			break;

			default: //error
				document.getElementById("warn").innerHTML = "A server error occured:\n" + result;
				document.getElementById("warn").style.opacity = "1";
			break;
		}
	});
}

function recover() {
	var mail = prompt("Please enter your email for recovery. You will me sent a message containing instructions.");
	if(mail == "null" || mail == null) {
		return;
	}
	else {
		jQuery.get("/recover", {
			name: mail
		}, function(result) {
			switch(result) {
				case "complete":
					alert("Please check your email.");
				break;
				case "mail":
					alert("Your email was invalid.");
				break;

				default:
					alert("And error occured!\n" + result);
				break;
			}
		});
	}
}