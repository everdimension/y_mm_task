(function(window, undefined) {

	var Stats = function(config) {

		this.startTime = new Date();
		this.trackedItems = {};
		if (config.trackedItems) {
			for (var key in config.trackedItems) {
				this.trackItem(config.trackedItems[key]);
			}
		}
	};

	Stats.prototype.trackItem = function(item) {
		this.trackedItems[item.id] = {
			isOffline: true,
			totalTime: 0,
			startTime: null
		};
	};

	Stats.prototype.startTracking = function(id) {
		var item = this.trackedItems[id];
		if (!item) {
			console.warn('item must be added first', id);
			return;
		}
		if (!item.isOffline) {
			// already being tracked
			return; 
		}

		item.startTime = new Date();
		item.isOffline = false;
	};

	Stats.prototype.stopTracking = function(id) {
		var item = this.trackedItems[id];
		if (!item) {
			console.warn('item must be added first', id);
			return;
		}
		item.totalTime += new Date().getTime() - item.startTime.getTime();
		item.startTime = null;
		item.isOffline = true;
	};

	Stats.prototype.getStats = function(itemName) {
		var summary = {
			totalTime: new Date().getTime() - this.startTime.getTime(),
			items: {}
		};

		var item;
		for (var id in this.trackedItems) {
			item = this.trackedItems[id];
			summary.items[id] = item.isOffline ? item.totalTime : item.totalTime + (new Date().getTime() - item.startTime.getTime());
		}

		return summary;
	};

	window.app = window.app || {};
	window.app.Stats = Stats;

})(window);