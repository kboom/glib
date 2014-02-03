var TabModel = {
	name : "TabModel",
	parent : "WidgetModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("TabModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var close = ic["close"] = function() {
			if(!this._isCloseable) return;
			this.fireChange("close");
		};
		
		var setCloseable = ic["setCloseable"] = function(state) {
			this._isCloseable = state;
		};
		
		return function() {
			this["_isCloseable"] = true;
		};
	}
};
