var MenuItemModel = {
	name : "MenuItemModel",
	parent : "WidgetModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("MenuItemModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var setTitle = ic["setTitle"] = function(title) {
			this["title"] = title;
			//sp.fireChange.call(this, "setTitle", title);
			this.fireChange("setTitle", title);
		};
		
		return function() {
			
		};
	}
};
