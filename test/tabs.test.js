var assert = require('assert');
window = {'onload': null} // hack, change later
var tabsModule = require('../tabs');

describe('Test move at index', function () {
	it('should move tabs at index 2 to index 1', function() {
		tabs = [{id: 0, url: 'https://google.com'}, {id: 1, url: 'https://facebook.com'}, {id: 2, url: 'https://google.com'}]
		assert.deepEqual(tabsModule.getTabsToMove(tabs, 0), {'tabsToMove': [2], 'targetIndex': 1})
	})
});