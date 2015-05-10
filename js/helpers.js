(function(window, undefined) {
	'use strict';

	var getPluralType = function (n) {
		if ((n % 10) == 1 && (n % 100) != 11) {
			return 1;
		}
		if (
			(n % 10) >= 2 && (n % 10) <= 4 &&
			((n % 100) < 12 || (n % 100) > 14) && n == Math.floor(n)
		) {
			return 2;
		}
		if (
			(n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9) ||
			((n % 100) >= 11 && (n % 100) <= 14) && n == Math.floor(n)
		) {
			return 0;
		}
		return 'other';
	};
	
	var Helpers = {
		formatDuration: function(ms) {
			var trailingMilliseconds = ms % 1000;
			var fullSeconds = (ms - trailingMilliseconds) / 1000;
			var trailingSeconds = fullSeconds % 60;
			var fullMinutes = (fullSeconds - trailingSeconds) / 60;
			var trailingMinutes = fullMinutes % 60;
			var fullHours = (fullMinutes - trailingMinutes) / 60;

			var output = '';

			if (fullHours) {
				// show hours only of duration is one hour or more
				output += [fullHours, Helpers.pluralize(fullHours, ['часов', 'час', 'часа'])].join(' ') + ' ';
			}
			if (fullMinutes || fullMinutes) {
				output += [trailingMinutes, Helpers.pluralize(trailingMinutes, ['минут', 'минута', 'минуты'])].join(' ') + ' ';
			}
			output += [trailingSeconds, Helpers.pluralize(trailingSeconds, ['секунд', 'секунда', 'секунды'])].join(' ');

			return output;
		}
	};

	Helpers.pluralize = function(amount, words) {
		return words[getPluralType(amount) || 0];
	};

	Helpers.inputParser = {

		// parser accepts only functions,
		// and only strings and integers as arguments of a function

		functionRe: /^([a-z][a-z0-9]*)\((['"a-z0-9\,\s]*)?\)\;?$/i,
		argumentReStr: /^('|")[a-z0-9]*('|")$/,
		argumentReNum: /^[0-9]*$/,

		parse: function(input) {
			var fnName;
			var args;
			var matchesNum;
			var matchesStr;
			var i, len;
			var output;

			var match = input.match(this.functionRe);

			if (!match) {
				return { error: "Unknown command" };
			}

			fnName = match[1];
			args = match[2];

			if (args) {
				args = args.split(/\,\s*/);
				for (i = 0, len = args.length; i < len; i++) {
					matchesNum = this.argumentReNum.test(args[i]);
					matchesStr = this.argumentReStr.test(args[i]);
					if ( !matchesStr && !matchesNum ) {
						return { error: 'Bad arguments' };
					}

					if (matchesNum) {
						args[i] = parseInt(args[i], 10);

					} else {
						args[i] = args[i].replace(/['"]/g, '');
					}
				}
			} else {
				args = [];
			}

			return {
				fnName: fnName,
				args: args
			};
		}

	};

	window.Helpers = Helpers;

})(window);