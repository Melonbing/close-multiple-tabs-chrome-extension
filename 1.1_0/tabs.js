function renderTabs() {
    chrome.tabs.query({currentWindow: true}, displayTabs);
};

function closeSelected(e) {
    if ((e.keyCode || e.which) == 88) // x
    {
	var toCloseIds = [];
	var toCloseElems = [];
	var options = document.getElementsByTagName("option");
	
	for (var i = 0; i < tabs.length; i++)
	{
	    if (options[i].selected)
	    {
		toCloseIds.push(parseInt(options[i].value));
		toCloseElems.push(options[i]);
	    }
	}
	chrome.tabs.remove(toCloseIds);
	for (i = 0; i < toCloseElems.length; i++)
	{
	    toCloseElems[i].remove();
	}
    }
};


function displayTabs(tabs) {
    var instructions = 'Select tabs and press <i>x</i> to close them.'
    var selectHTML = '<select id=\"tabs\" size=' + tabs.length + ' multiple>';
    for (var i = 0; i < tabs.length; i++) {
	selectHTML += '<option value=\"' + tabs[i].id + '\">' + tabs[i].title + '</option>';
    }
    selectHTML += '</select>';
    document.body.innerHTML = instructions + selectHTML;
    var tabsElem = document.getElementById("tabs");
    tabsElem.onkeyup = closeSelected;
};

document.addEventListener("DOMContentLoaded", renderTabs);
