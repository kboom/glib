var MenuToolbarModel = {
	name : "MenuToolbarModel",
	parent : "CompositeComponentModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("MenuToolbarModel");
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		var sp = Clazz.prototype.getSuperType().prototype;
		
		ic["addMenuItem"] = function(item) {
			log.log("verbose", "addMenuItem");
			sp.addComponent.call(this, item);
			this.menuItems.push(item);
			item.onSummon();
			this.fireChange("addMenuItem", item);
		};
		
		ic["removeMenuItem"] = function(item) {
			log.log("verbose", "addMenuItem");
			sp.removeComponent.call(this, item);
			this.menuItems.remove(item);
			item.onDismiss();
			this.fireChange("removeMenuItem", item);
		};	
		
		ic["setSlider"] = function(item) {
			sp.addComponent.call(this, item);
			this._slider = item;
			this.fireChange("setSlider", item);
			item.onSummon();			
		};
		
		return function() {
			this["menuItems"] = [];
		};
	}
};