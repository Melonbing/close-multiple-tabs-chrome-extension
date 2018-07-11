window.onload = function() {
    chrome.tabs.query({}, function (tabs) {
	for (var i = 0; i < tabs.length; i++) {
	var elem = document.createElement("h3");
	elem.innerHTML = tabs[i].title;
	document.body.appendChild(elem);
    }	      
});
};
