var LaunchPaneModel = {
	name : "LaunchPaneModel",
	parent : "PaneModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("Launchpane");
		var util = System["util"];
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var addLauncher = ic["addLauncher"] = function(item) {
			log.log("verbose", "addLauncher");
			var that = this;
			sp.addComponent.call(this, item);
			this._allLaunchers.push(item);
			item.onCreate();
			this.fireChange("addLauncher", item);
		};
		
		var removeLauncher = ic["removeLauncher"] = function(item) {
			log.log("verbose", "removeTab");
			sp.removeComponent.call(this, item);
			this._allLaunchers.remove(item);
			item.onDestroy();
			this.fireChange("removeLauncher", item);
		};
		
		var hideLaunchers = ic["hideLaunchers"] = function() {
			var displayedLaunchers = this._displayedLaunchers;
			for(var i = 0; i < displayedLaunchers.length; i++) {
				var launcher = displayedLaunchers[i];
				launcher.onDismiss();
				this.fireChange("hideLauncher", launcher);
			}
			this._displayedLaunchers = [];
			this.fireChange("emptyList");
			this._onDisplayAction && this._onDisplayAction();
		};
		
		var displayAll = ic["displayAll"] = function() {
			this.hideLaunchers();
			var displayedLaunchers = this._displayedLaunchers;
			var launchers = this._allLaunchers;
			for(var i = 0; i < launchers.length; i++) {
				var launcher = launchers[i];
				displayedLaunchers.push(launcher);
				this.fireChange("showLauncher", launcher);
				launcher.onSummon();				
			}
			this._onDisplayAction && this._onDisplayAction();
		};
		
		var displayByReference = ic["displayByReference"] = function() {
			var displayedLaunchers = this._displayedLaunchers;
			for(var i = 0; i < arguments.length; i++) {
				var launcher = arguments[i];
				if(util.containsValue(displayedLaunchers, launcher)) continue;
				displayedLaunchers.push(launcher);
				this.fireChange("showLauncher", launcher);
				launcher.onSummon();				
			}
			this._onDisplayAction && this._onDisplayAction();
		};
		
		var displayByFilter = ic["displayByFilter"] = function(cb) {
			this.hideLaunchers();
			var displayedLaunchers = this._displayedLaunchers;
			var allLaunchers = this._allLaunchers;
			for(var i = 0; i < allLaunchers.length; i++) {
				var launcher = allLaunchers[i];
				if(!cb(launcher)) continue;				
				displayedLaunchers.push(launcher);
				this.fireChange("showLauncher", launcher);
				launcher.onSummon();
			}
			this._onDisplayAction && this._onDisplayAction();
		};
		
		var refresh = ic["refresh"] = function() {
			var displayedLaunchers = this._displayedLaunchers;
			this.hideLaunchers();
			displayByReference.apply(this, displayedLaunchers);
		};
		
		var setOnDisplayAction = ic["setOnDisplayAction"] = function(fn) {
			this._onDisplayAction = fn;
		};
		
		var setContentWidth = ic["setContentWidth"] = function(width) {
			this["_contentWidth"] = width;
		};
		
		var setDisplayWidth = ic["setDisplayWidth"] = function(width) {
			this["_displayWidth"] = width;
		};
		
		var rewind = ic["rewindTo"] = function(scale) {
			var displayLine = this._displayLine = scale * (this._contentWidth - this._displayWidth);
			this.fireChange("rewindTo", displayLine);
		};
		
		var setRewindSpeed = ic["setRewindSpeed"] = function(ms) {
			this["_rewindSpeed"] = ms;
		};
		
		var getRewindSpeed = ic["getRewindSpeed"] = function() {
			return this._rewindSpeed || 0;
		};
		
		return function() {
			this["_displayedLaunchers"] = [];
			this["_allLaunchers"] = [];
		};
	}
};