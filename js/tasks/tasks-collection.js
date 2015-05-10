(function(window, undefined) {

	'use strict';

	var TasksCollection = function(config) {
		this.table = {};

		this.events = {
			'change': [],
			'change:order': [],
			'change:current': []
		};

		this.tabs = config.models;

		this.tracker = config.tracker;

		if (config.defaults.currentTab) {
			this.setCurrent(config.defaults.currentTab);
		}
		for (var key in config.defaults) {
			if (key !== 'currentTab') {
				this.table[key] = config.defaults[key];
			}
		}

		if (!this.get('currentTab')) {
			this.setCurrent(this.tabs[0].elementId);
		}

	};

	TasksCollection.prototype.getTabs = function() {
		return this.tabs;
	};

	TasksCollection.prototype.broadcast = function(eventName) {
		var self = this;
		self.events[eventName].forEach(function(listener) {
			if (listener.length === 2) {
				listener[0].apply(listener[1]);
			} else {
				listener[0]();
			}
		});
	};

	TasksCollection.prototype.swapTabs = function(index1, index2) {
		if (!this.tabs[index1] || !this.tabs[index2]) {
			return false;
		}
		this.tabs[index1] = this.tabs.splice(index2, 1, this.tabs[index1])[0];
		this.broadcast('change:order');
		return [this.tabs[index2], this.tabs[index1]];
	};

	TasksCollection.prototype.setCurrentByIndex = function(index) {
		if (this.tabs[index]) {
			this.setCurrent(this.tabs[index].elementId);
			return this.tabs[index];
		}
		return false;
	};

	TasksCollection.prototype.set = function(keyName, value) {

		var self = this;

		self.table[keyName] = value;

		self.broadcast('change');

		return self;

	};

	TasksCollection.prototype.get = function(keyName) {

		var self = this;

		return self.table[keyName];

	};

	TasksCollection.prototype.findByName = function(tabName) {
		var len = this.tabs.length;
		for (var i = 0; i < len; i++) {
			if (this.tabs[i].elementId === tabName) {
				return this.tabs[i];
			}
		}
		return null;
	};

	TasksCollection.prototype.findById = function(id) {
		var len = this.tabs.length;
		for (var i = 0; i < len; i++) {
			if (this.tabs[i].id === id) {
				return this.tabs[i];
			}
		}
		console.log('could not find', id, this.tabs);
		return null;
	};

	TasksCollection.prototype.setCurrent = function(tabName) {
		var currentTab;
		var newTab;
		var currentTabName = this.get('currentTab');
		if (currentTabName) {
			this.tracker.stopTracking( this.findByName(currentTabName).id );
		}
		newTab = this.findByName(tabName);
		if (!newTab) {
			return;
		}
		this.set('currentTab', tabName);
		this.tracker.startTracking( newTab.id );
		this.broadcast('change:current');
	};

	TasksCollection.prototype.on = function(eventName, callback, cntxt) {
		var listener = [callback];
		if (cntxt) {
			listener.push(cntxt);
		}
		if (typeof callback === "function") {
			this.events[eventName].push(listener);
		} else {
			console.warn('trying to assign something other than a function as a callback');
		}
	};

	window.app = window.app || {};
	window.app.Tasks = window.app.Tasks || {};
	window.app.Tasks.Collection = TasksCollection;

})(window);