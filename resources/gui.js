function openNav() { //open the sidenav
	document.getElementById("sidepanel").style.width = "26%";
	document.getElementById("navicon").style.opacity = "0";
}
function closeNav() { //close the sidenav
	document.getElementById("sidepanel").style.width = "0%";
	document.getElementById("navicon").style.opacity = "1";
}
function openSpoiler() { //open the last page image
	document.getElementById("spoilers").style.width = "100%";
}
function closeSpoiler() { //close the last page image
	document.getElementById("spoilers").style.width = "0%";
}
function togglePW() {
	document.getElementById("passbar").style.opacity = (1 - document.getElementById("passbar").style.opacity).toString();
	document.getElementById("hr").style.opacity = (1 - document.getElementById("hr").style.opacity).toString();
}