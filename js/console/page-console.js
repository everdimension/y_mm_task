(function(window, undefined) {

	'use strict';

	var PageConsole = function(config) {
		this.name = config.name;
		this.tracker = config.tracker;
		this.controlledInterface = config.controlledInterface;

		this.el = document.getElementById('console');
		this.output = this.el.querySelector('.console-output');
		this.inputField = this.el.querySelector('.console-input');
		this.consoleForm = this.el.querySelector('.console-form');

		this.bindEvents();

		this.recentCommands = [];
		this.savedCommandsLimit = 10;

		this.getTemplates();

	};

	PageConsole.prototype.getTemplates = function() {
		this.template = document.getElementById('console-output-template').innerHTML;
	};

	PageConsole.prototype.render = function(msg) {

		var content = msg.commandName ? [msg.commandName, '<br>'].join('') : '';
		content += msg.msg;
		this.output.innerHTML += this.template.replace('{{msg}}', content);

	};

	PageConsole.prototype.clear = function() {
		this.output.innerHTML = '';
	};

	PageConsole.prototype.commands = {
		// string concatenation is awful
		// but in reality we should be using
		// a nice templating language :)

		selectTab: function(argsList) {
			var result = this.controlledInterface.selectTab.apply(this.controlledInterface, argsList);
			return result ?
				['Выбрана вкладка "', result.tabName, '"' ].join('') :
				['Не удалось выбрать вкладку ', argsList[0], '. Доступны вкладки с 0 по ', this.controlledInterface.getTabList().length - 1].join('');
		},
		swapTabs: function(argsList) {
			if (!argsList.length) {
				return 'Не удалось поменять вкладки местами. Укажите номера вкладок';
			}
			var result = this.controlledInterface.swapTabs.apply(this.controlledInterface, argsList);
			return result ?
				[ 'Поменяли табы №', argsList[0], '" ', result[0].tabName, '" и №', argsList[1], ' "', result[1].tabName, ' местами.' ].join('') :
				[ 'Не удалось поменять вкладки №', argsList[0], ' и №', argsList[1], '. Доступны вкладки с 0 по ', this.controlledInterface.getTabList().length - 1 ].join('');
		},
		clear: function() {
			this.clear();
			return '';
		},
		showStat: function() {
			var stats = this.tracker.getStats();
			var message = 'Общее время: ' + Helpers.formatDuration(stats.totalTime);
			for (var key in stats.items) {
				message += ['<br>', key, ' ', this.controlledInterface.getById(parseInt(key)).tabName, ': ', Helpers.formatDuration(stats.items[key])].join('');
			}
			return message;
		}
	};

	PageConsole.prototype.bindEvents = function() {

		var self = this;

		var recentIndex = -1;

		this.consoleForm.addEventListener('submit', function(e) {
			e.preventDefault();

			var userInput = self.inputField.value.trim();
			if (!userInput) {
				return;
			}

			self.render(self.parseInput(userInput));

			self.inputField.value = '';
			self.inputField.focus();
			recentIndex = -1;

		});

		this.inputField.addEventListener('keyup', function(e) {
			if (e.which === 38 && self.recentCommands[++recentIndex]) {
				self.inputField.value = self.recentCommands[recentIndex].fnName + '(' + self.recentCommands[recentIndex].args.join(', ') + ')';
				// ++recentIndex;
			} else if (e.which === 40) {
				if (--recentIndex > -1) {
					// --recentIndex;
					self.inputField.value = self.recentCommands[recentIndex].fnName + '(' + self.recentCommands[recentIndex].args.join(', ') + ')';
				} else  {
					self.inputField.value = '';
					recentIndex = -1;
				}

			} else {
				recentIndex = -1;
			}
		});

	};

	PageConsole.prototype.saveCommand = function(command) {
		if (this.recentCommands.length >= this.savedCommandsLimit) {
			this.recentCommands.pop();
		}
		this.recentCommands.unshift(command);
	};

	PageConsole.prototype.parseInput = function(input) {
		var self = this;
		
		var parsed = Helpers.inputParser.parse(input);

		if (parsed.error) {
			return { msg: parsed.error };
		}

		if (!self.commands[parsed.fnName]) {
			return { msg: "command does not exist" };
		}

		self.saveCommand(parsed);

		return {
			commandName: ['/> ', parsed.fnName, '(', parsed.args.join(', '), ')'].join(''),
			msg: self.commands[parsed.fnName].call(self, parsed.args)
		};
	};


	window.app = window.app || {};

	window.app.PageConsole = PageConsole;

})(window);