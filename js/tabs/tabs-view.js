(function(window, undefined) {
	var TabsView = function(config) {

		this.model = config.model;
		this.tabs = config.model.tabs;
		this.el = document.getElementById('tabs-panel');

		this.getTemplates();
		this.bindEvents();
		this.render();

		this.model.on('change:order', this.render, this);
		this.model.on('change:current', this.render, this);

	};

	TabsView.prototype.getTemplates = function() {
		this.template = document.getElementById('nav-item-template').innerHTML;
	};

	TabsView.prototype.render = function() {
		var self = this;
		var isCurrent;
		self.el.innerHTML = '';

		var html = '';

		self.tabs.forEach(function(tab) {
			if (self.model.get('currentTab') === tab.elementId) {
				isCurrent = true;
				window.location.hash = "#" + tab.elementId;
			} else {
				isCurrent = false;
			}

			html += self.template.replace(/{{tabId}}/g, tab.elementId).replace('{{isActive}}').replace('{{tabName}}', tab.tabName).replace('{{isSelected}}', isCurrent ? 'active' : '');
		});
		self.el.innerHTML = html;

	};

	TabsView.prototype.bindEvents = function() {
		var self = this;
		this.el.addEventListener('click', function(e) {
			e.preventDefault();
			if (e.target.classList.contains("tab-toggle")) {
				self.model.setCurrent(e.target.getAttribute('data-tab'));
			}
		});
	};

	window.app = window.app || {};
	window.app.TabsView = TabsView;
})(window);