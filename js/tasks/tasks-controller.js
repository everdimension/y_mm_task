(function(window, undefined) {

	'use strict';

	var TasksController = function(config) {
		this.config = config;
		this.name = config.name || config.elementId;

		this.view = new config.View({
			elementId: config.elementId,
			model: config.model
		});
	};

	TasksController.prototype.selectTab = function(tabId) {
		return this.config.model.setCurrentByIndex(tabId);
	};

	TasksController.prototype.getTabList = function() {
		return this.config.model.getTabs();
	};

	TasksController.prototype.swapTabs = function(tab1, tab2) {
		return this.config.model.swapTabs(tab1, tab2);
	};

	TasksController.prototype.getModelValue = function(keyName) {
		return this.config.model.get(keyName);
	};

	TasksController.prototype.getById = function(id) {
		return this.config.model.findById(id);
	};

	window.app = window.app || {};
	window.app.Tasks = window.app.Tasks || {};
	window.app.Tasks.Controller = TasksController;

})(window);