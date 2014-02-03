var DynamicWindowModel = {
	name : "DynamicWindowModel",
	parent : "WindowModel",
	augment : "ResizeableModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("WindowModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();		
		
		
		var close = ic["close"] = function() {
			this.fireChange("close");
		};
		
		return function() {

		};
	}
};