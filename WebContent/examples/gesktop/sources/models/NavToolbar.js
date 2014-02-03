var NavToolbarModel = {
	name : "NavToolbarModel",
	parent : "CompositeComponentModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("NavToolbarModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var activateTab = ic["activateTab"] = function(item) {
			var tabs = this.tabs;
			if(tabs.indexOf(item) == -1) return;
			var tabno = tabs.length;
			for(var i = 0; i < tabno; i++) {
				var tab = tabs[i];
				if(tabs[i] === item) {
					this._activeTab = item;					
					tab.onSummon();
					tab.activate();
				}
				else {
					tab.onDismiss();
					tab.deactivate();
				}
			}
		};
		
		var addTab = ic["addTab"] = function(item) {
			log.log("verbose", "addTab");
			var that = this;
			sp.addComponent.call(this, item);
			this.tabs.push(item);
			item.onSummon();
			item.registerChangeListener("close", function() {
				that.removeTab(item);
			});
			this.fireChange("addTab", item);
		};
		
		var getActiveTab = ic["getActiveTab"] = function() {
			return this._activeTab;
		};
		
		var removeTab = ic["removeTab"] = function(item) {
			log.log("verbose", "removeTab");
			sp.removeComponent.call(this, item);
			var tabs = this.tabs;
			var removeIndex = tabs.indexOf(item);
			tabs.splice(removeIndex, 1);
			this.activateTab(tabs[tabs.length - 1]);
			this.fireChange("removeTab", item);
		};
		
		var setSearch = ic["setSearch"] = function(item) {
			this._search = item;
			this.fireChange("setSearch", item);
		};
		
		return function() {
			this["tabs"] = [];
		};
	}
};