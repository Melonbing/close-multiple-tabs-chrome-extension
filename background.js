updateCount();

function updateCount(){
	chrome.windows.getLastFocused({populate:true},function(currentWindow){
		var count = currentWindow.tabs.length;
		chrome.browserAction.setBadgeText({text:count+""});
		chrome.browserAction.setBadgeBackgroundColor({color:'#FF6A00'})

	});
}

chrome.tabs.onRemoved.addListener(updateCount);
chrome.tabs.onCreated.addListener(updateCount);

