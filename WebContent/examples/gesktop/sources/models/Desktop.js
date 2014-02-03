var DesktopModel = {
	name : "DesktopModel",
	parent : "CompositeComponentModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("DesktopModel");
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		var sp = Clazz.prototype.getSuperType().prototype;

		ic["setMenuToolbar"] = function(toolbar) {
			this["menuToolbar"] && sp.removeComponent.call(this, this["menuToolbar"]);
			sp.addComponent.call(this, toolbar);
			this["menuToolbar"] = toolbar;
			this.fireChange("setMenuToolbar", toolbar);
		};
		
		ic["setNavToolbar"] = function(toolbar) {
			this["navToolbar"] && sp.removeComponent.call(this, this["navToolbar"]);
			sp.addComponent.call(this, toolbar);
			this["navToolbar"] = toolbar;
			this.fireChange("setNavToolbar", toolbar);
		};
		
		ic["setLaunchPane"] = function(pane) {
			this["launchPane"] && sp.removeComponent.call(this, this["launchPane"]);
			sp.addComponent.call(this, pane);
			this["launchPane"] = pane;
			this.fireChange("setLaunchPane", pane);
		};

		ic["setContentPane"] = function(pane) {
			this["contentPane"] && sp.removeComponent.call(this, this["contentPane"]);
			sp.addComponent.call(this, pane);
			this["contentPane"] = pane;
			this.fireChange("setContentPane", pane);
		};
		
		return function() {
			
		};
	}
};