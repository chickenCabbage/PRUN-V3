var indexFlag = true;
var updateText;
var lastCheckTime = 0;

//// NOTIFICATIONS ////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() { //ask for permissions
	if (Notification.permission !== "granted")
	 Notification.requestPermission(); //please OwO
});

function notify(image) {
	if (!Notification) {
		alert("Prague Race updated!\nDesktop notifications aren't available in your browser.");
		return;
	}

	if (Notification.permission !== "granted"){ //if you didn't get permission
		Notification.requestPermission();
	}
	else { //if you did though
		console.log("UPDATE!");
		var notification = new Notification("Prague Race updated!", {
			icon: image,
			body: "We just noticed an update to Prague Race, you should go check it out!",
		});
		notification.onclick = function() {
			window.open("http://www.praguerace.com/");
			notification.close();      
		};
	}
}

//// ACTUAL "MECHANISM" ///////////////////////////////////////////////////////////////////

window.onLoad = jQuery.get("/update.txt", function(data, status) { //init
	updateText = data;
	document.getElementById("lad").innerHTML = updateText.split(",")[0];
	document.getElementById("lat").innerHTML = updateText.split(",")[1];
	document.getElementById("spoiler").src = updateText.split(",")[2];
});

function check() {
	document.getElementById("status").innerHTML = "Checking for update...";
	jQuery.get("/update.txt", function(data, status) {
		if(data == updateText) {}
		else { //yes update
			document.getElementById("status").innerHTML = "Update!";
			document.getElementById("lad").innerHTML = updateText.split(",")[0];
			document.getElementById("lat").innerHTML = updateText.split(",")[1];
			document.getElementById("spoiler").src = updateText.split(",")[2];
			notify(updateText.split(",")[2]);
		}
		updateText = data;
	});
}

//// TIMER ////////////////////////////////////////////////////////////////////////////////

window.onLoad = setInterval(function() {
	document.getElementById("status").innerHTML = "Checked " + lastCheckTime + " seconds ago."
	if (lastCheckTime == 30){ //reset the check loop
		check(); //refresh
		lastCheckTime = 0;
	}
	lastCheckTime ++;
}, 1000);