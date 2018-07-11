function renderTabs() {
    chrome.tabs.query({currentWindow: true}, displayTabs);
};

function closeSelected() {
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
};

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

// same url or same domain plus title
function removeDuplicates() {
	chrome.tabs.query({currentWindow: true}, function(tabs) { 
		console.log('removing duplicates')
		tabs.sort(domainComparator)
		var toCloseIds = [];
		var toCloseElems = [];
		var options = document.getElementsByTagName("option");

	    prevUrl = null
	    prevDomain = null
	    prevTitle = null
	    for (var i = 0; i < tabs.length; i++) {
	    	var curDomain = getDomainName(tabs[i].url)
	    	if (tabs[i].url == prevUrl || (curDomain == prevDomain && tabs[i].title == prevTitle)) {
	    		toCloseIds.push(tabs[i].id)
	    		toCloseElems.push(options[i])
	    	} else {
	    		prevUrl = tabs[i].url
	    		prevDomain = curDomain
	    		prevTitle = tabs[i].title
	    	}
	    }
	    chrome.tabs.remove(toCloseIds);
		for (i = 0; i < toCloseElems.length; i++)
		{
		    toCloseElems[i].remove();
		}
	} );
}

function eventDispatcher(e) {
	if ((e.keyCode || e.which) == 88) { // x
		closeSelected()
	} else if ((e.keyCode || e.which) == 68) {// d
		console.log(e.keyCode)
		removeDuplicates()
	} else {
		console.log(e.keyCode)
	}
}

var MAX_SELECT_SIZE = 20

function toggle_options() {
        alert('hello')
        var curVisibility = $('#more_options').style.visibility
        if (curVisibility == 'hidden') {
          $('#more_options').style.visibility = 'visible'
          $('#more_options').html('Hide')
        } else if (curVisibility == 'visible') {
          $('#more_options').style.visibility = 'hidden'
          $('#more_options').html('Show more options')
        }
      }

function displayTabs(tabs) {
    tabs.sort(domainComparator)
    var optionsHtml = ''

    for (var i = 0; i < tabs.length; i++) {
    	var tabDescription = '' + getDomainName(tabs[i].url) + ' *** ' + tabs[i].title
		$('#tabs').append('<option value=\"' + tabs[i].id + '\">' + tabDescription + '</option>')
    }
    $('#tabs').attr('size', Math.min(tabs.length, MAX_SELECT_SIZE))
    var tabsElem = document.getElementById("tabs");
    tabsElem.onkeyup = eventDispatcher;
};

document.addEventListener("DOMContentLoaded", renderTabs);
