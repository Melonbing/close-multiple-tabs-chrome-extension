function renderTabs() {
    chrome.tabs.query({currentWindow: true}, displayTabs);
};

function closeSelected() {
	var toCloseIds = [];
	var toCloseElems = [];
	var options = document.getElementsByTagName("option");
	
	var highestIndex = -1;
	var len = tabs.length;
	for (var i = 0; i < len; i++)
	{
	    if (options[i].selected)
	    {
			toCloseIds.push(parseInt(options[i].value));
			toCloseElems.push(options[i]);
			highestIndex = i;
	    }
	}
	chrome.tabs.remove(toCloseIds);
	for (i = 0; i < toCloseElems.length; i++)
	{
	    toCloseElems[i].remove();
	}

	// select the next tab after the closed ones
	if (highestIndex >= 0) {
		var nextFocusIndex = -1;
		if (highestIndex == len-1) {
			nextFocusIndex = len-1-toCloseIds.length
		} else {
			nextFocusIndex = highestIndex+1-toCloseIds.length
		}
		options[nextFocusIndex].selected = true;
	}
};

function organizeTabs() {
	chrome.tabs.query({currentWindow: true}, function(tabs) {
		function moveTabs(tabsToMove, targetIndex) {
			// console.log(tabsToMove + " left to move")
			if (tabsToMove.length == 0) {
				groupTabsAt(targetIndex)
			} else {
				chrome.tabs.move(tabsToMove.pop(), {'index': targetIndex}, function(movedTab) {
					// console.log("moved tab " + movedTab.url + " " + movedTab.id + " to index " + targetIndex)
					moveTabs(tabsToMove, targetIndex+1)
				})
			}
		}

		function groupTabsAt(index) {
			chrome.tabs.query({currentWindow: true}, function(tabs) {
				// console.log('groupTabsAt: ' + index)
				if (index >= tabs.length) return;
				domainName = getDomainName(tabs[index].url)
				while (index+1 < tabs.length && getDomainName(tabs[index+1].url) == domainName) {
					index++
				}
				tabsToMove = []
				for (j = index+1; j < tabs.length; j++) {
					curDomain = getDomainName(tabs[j].url)
					if (curDomain == domainName) {
						tabsToMove.push(tabs[j].id);
					}
				}
				if (tabsToMove.length == 0)
					groupTabsAt(index+1)
				else
					moveTabs(tabsToMove.reverse(), index+1)
			})
		}

		groupTabsAt(0)
	})
}

function gotoSelected() {
	chrome.tabs.query({currentWindow: true}, function(tabs) { 
		tabs.sort(domainComparator)
		var tabId = null
		var options = document.getElementsByTagName("option");
		for (var i = 0; i < tabs.length; i++)
		{
		    if (options[i].selected)
		    {
				tabId = tabs[i].id
				break
		    }
		}
		if (tabId) {
	  		chrome.tabs.get(tabId, function(tab) {
  				chrome.tabs.highlight({'tabs': tab.index}, function() {});
  			})
		}
	})
}

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
	console.log("enter function removeDuplicates")
	chrome.tabs.query({currentWindow: true}, function(tabs) { 
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
	if ((e.keyCode || e.which) == 8) { // delete
		closeSelected()
	} else if ((e.keyCode || e.which) == 68) {// d
		removeDuplicates()
	} else if ((e.keyCode || e.which) == 13) { // enter
		gotoSelected()
	}
}

var MAX_SELECT_SIZE = 20

function displayTabs(tabs) {
	//alert('hello')
    tabs.sort(domainComparator)

    var tabDescription = getDomainName(tabs[0].url) + ' *** ' + tabs[0].title
    $('#tabs').append('<option value=\"' + tabs[0].id + '\" selected>' + tabDescription + '</option>')
    for (var i = 1; i < tabs.length; i++) {
    	var tabDescription = getDomainName(tabs[i].url) + ' *** ' + tabs[i].title
		$('#tabs').append('<option value=\"' + tabs[i].id + '\">' + tabDescription + '</option>')
    }
    $('#tabs').attr('size', Math.min(tabs.length, MAX_SELECT_SIZE))
    document.onkeyup = eventDispatcher;
};

window.onload = renderTabs
