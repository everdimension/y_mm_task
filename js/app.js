(function(window) {

	'use strict';

	// remove no-js class
	document.documentElement.className = document.documentElement.className.replace(/(^|\s)no-js(\s|$)/, '$1js$2');

	if (!window.app) {
		console.warn('App dependencies are unresolved');
		return;
	}

	var tabs = [
		{
			id: 0,
			elementId: 'progressTab',
			tabName: 'Progress bar'
		},
		{
			id: 1,
			elementId: 'buttonTab',
			tabName: 'Кнопка'
		},
		{
			id: 2,
			elementId: 'browsersTab',
			tabName: 'Браузеры'
		},
		{
			id: 3,
			elementId: 'articleTab',
			tabName: 'Article'
		}
	];

	var tabsTracker = new app.Stats({ trackedItems: tabs });

	var tasksModel = new app.Tasks.Collection({
		models: tabs,
		tracker: tabsTracker,
		defaults: { currentTab: window.location.hash.substring(1) }
	});


	app.tasks = new app.Tasks.Controller({ 
		elementId: 'tasks',
		View: app.Tasks.View,
		model: tasksModel
	});

	app.pageConsole = new app.PageConsole({
		elementId: 'console',
		name: 'tasks',
		controlledInterface: app.tasks,
		tracker: tabsTracker
	});

})(window, undefined);