var assert = require('assert');
var sinon = require('sinon');
var MockBrowser = require('mock-browser').mocks.MockBrowser;
var mock = new MockBrowser();
global.document = mock.getDocument();
global.window = {'onload': null} // hack, change later
var tabsModule = require('../tabs');

describe('Test organizeTabs', function () {
	it('should move tabs at index 2 to index 1', function() {
		tabs = [{id: 0, url: 'https://google.com'}, {id: 1, url: 'https://facebook.com'}, {id: 2, url: 'https://google.com'}]
		assert.deepEqual(tabsModule.getTabsToMove(tabs, 0), {'tabsToMove': [2], 'targetIndex': 1})
	})
});

describe('Test removeDuplicates', function () {
	getElemsByTagTame = sinon.stub(document, 'getElementsByTagName');
	it('should remove duplicates which do not appear in order', function() {
		tabs = [{id: 0, url: 'https://google.com'}, {id: 1, url: 'https://facebook.com'}, {id: 2, url: 'https://google.com'}]
		options = [document.createElement("option"), document.createElement("option"), document.createElement("option")]
		options[0].text = 'facebook.com *** Facebook'
		options[1].text = 'google.com *** Google'
		options[2].text = 'facebook.com *** Facebook'
		getElemsByTagTame.withArgs('option').returns(options);
		assert.deepEqual(tabsModule.getDuplicates(tabs), {'toCloseIds': [2], 'toCloseElems': [options[2]]})
	})

	it('should remove duplicates in same domain not in order', function() {
		tabs = [{id: 0, url: 'https://facebook.com', title: 'Facebook'},
				{id: 1, url: 'https://google.com/search?q=hello', title: 'hello - Google Search'},
				{id: 2, url: 'https://google.com', title: 'Google'},
				{id: 3, url: 'https://google.com/search?q=hello', title: 'hello - Google Search'}]
		options = [document.createElement("option"), document.createElement("option"), document.createElement("option")]
		options[0].text = 'facebook.com *** Facebook'
		options[1].text = 'google.com *** Google'
		options[2].text = 'facebook.com *** Facebook'
		getElemsByTagTame.withArgs('option').returns(options);
		assert.deepEqual(tabsModule.getDuplicates(tabs), {'toCloseIds': [3], 'toCloseElems': [options[3]]})
	})
});