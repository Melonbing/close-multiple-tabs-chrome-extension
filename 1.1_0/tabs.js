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

    function stringComparator(s1, s2) {
    	if (s1 < s2)
    		return -1
    	else if (s1 == s2)
    		return 0
    	return 1
    }

	function getDomainName(url) {
		hostname = (new URL(url)).hostname;
		if (hostname.startsWith('www.')) {
			hostname = hostname.slice('www.'.length)
		}
		return hostname
	}

    domainComparator = function(tab1, tab2) {
    	var dn1 = getDomainName(tab1.url)
    	var dn2 = getDomainName(tab2.url)
    	return stringComparator(dn1, dn2)
    }

    tabs.sort(domainComparator)

    for (var i = 0; i < tabs.length; i++) {
	selectHTML += '<option value=\"' + tabs[i].id + '\">' + tabs[i].title + '</option>';
    }
    selectHTML += '</select>';
    document.body.innerHTML = instructions + selectHTML;
    var tabsElem = document.getElementById("tabs");
    tabsElem.onkeyup = closeSelected;
};

document.addEventListener("DOMContentLoaded", renderTabs);
