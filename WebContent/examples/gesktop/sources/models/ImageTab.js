var ImageTabModel = {
	name : "ImageTabModel",
	parent : "TabModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("ImageTabModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		ic["setImage"] = function(src) {
			this["image"] = src;
			this.fireChange("setImage", src);
		};
		
		return function() {
			
		};
	}
};
