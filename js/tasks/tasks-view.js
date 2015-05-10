(function(window, undefined) {

	'use strict';

	var TasksView = function(config) {
		this.model = config.model;
		this.el = document.getElementById(config.elementId);

		this.tabsView = new app.TabsView({ model: this.model });

		this.tabs = this.el.querySelectorAll('.tab');

		this.model.on('change', this.render, this);
		// this.model.on('change:order', this.tabsView.render, this.tabsView);

		this.bindEvents();

		this.render();
	};

	TasksView.prototype.bindEvents = function() {
		
	};

	TasksView.prototype.render = function() {

		var currentTab = this.model.get('currentTab');
		this.setTab(currentTab);

	};

	TasksView.prototype.setTab = function(tabName) {

		var self = this;

		this.tabs.forEach(function(tab, index) {

			if (tab.classList) {
				tab.classList.remove('open');

			} else {
				tab.className = tab.className.replace(new RegExp('(^|\\b)' + 'open' + '(\\b|$)', 'gi'), ' ');
			}

			// tab.classList.toggle = 'none';

			if (tab.getAttribute('id') === tabName) {
				if (tab.classList) {
					tab.classList.add('open');

				} else {
					tab.className += ' ' + 'open';
				}
			}

		});
	};

	window.app = window.app || {};
	window.app.Tasks = window.app.Tasks || {};
	window.app.Tasks.View = TasksView;

})(window);