var subscribeFlag = true;

//// VALIDATE THE PASSWORD ////////////////////////////////////////////////////////////////

function checkPW() {
	var name = document.getElementById("name").value;
	var pw1 = document.getElementById("pw1").value;
	var pw2 = document.getElementById("pw2").value;

	if (pw1 == pw2) {
		if(pw1.indexOf(",") != -1
			|| pw1.indexOf(":") != -1
			|| pw1.indexOf(" ") != -1
			|| pw1.indexOf("'") != -1
			|| pw1.indexOf("*") != -1
			|| pw1.indexOf("&") != -1
			|| pw1.indexOf("=") != -1
			|| pw1.indexOf("\\") != -1
			|| pw1.indexOf("\"") != -1) { //check for sh*t
			document.getElementById("warn").innerHTML = "Invalid password.";
			document.getElementById("warn").style.opacity = "1";
			document.getElementById("submit").disabled = true;
		}
		else {
			if (pw1.length > 6) {
				if((name.indexOf("@") != -1 || name.indexOf(".") != -1) && name.length > 4) {
					document.getElementById("warn").style.opacity = "0";
					document.getElementById("submit").disabled = false;
				}
				else {
					document.getElementById("warn").innerHTML = "Invalid email.";
					document.getElementById("warn").style.opacity = "1";
					document.getElementById("submit").disabled = true;
				}
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
};

//// POST DATA TO THE SERVER //////////////////////////////////////////////////////////////

function post() {
	var name = document.getElementById("name").value;
	var password = document.getElementById("pw1").value;
	var pw1 = password;
	var pw2 = document.getElementById("pw2").value;

	if(pw1.indexOf(",") != -1
		|| pw1.indexOf(":") != -1
		|| pw1.indexOf(" ") != -1
		|| pw1.indexOf("'") != -1
		|| pw1.indexOf("*") != -1
		|| pw1.indexOf("&") != -1
		|| pw1.indexOf("=") != -1
		|| pw1.indexOf("\\") != -1
		|| pw1.indexOf("\"") != -1) { //not gonna inject me, boi
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

	jQuery.post("/newUser", {
		username: name.toLowerCase(),
		pass: password
	}, function(result) {
		switch(result) {
			case "complete":
				document.getElementById("warn").style.opacity = "0";
				window.location = "/login.html";
			break;
			case "exists": //this user already exists
				document.getElementById("warn").innerHTML = "This email is already registered.";
				document.getElementById("warn").style.opacity = "1";
			break;

			default: //error
				document.getElementById("warn").innerHTML = "A server error occured:\n" + result;
				document.getElementById("warn").style.opacity = "1";
			break;
		}
	});
}