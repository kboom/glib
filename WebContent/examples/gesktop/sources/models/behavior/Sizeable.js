var SizeableModel = {
	name : "SizeableModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("SizeableModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var setWidth = ic["setWidth"] = function(x) {
			this["width"] = x;
			this.fireChange.call(this, "width", x);
		};
		
		var setHeight = ic["setHeight"] = function(y) {
			this["height"] = y;
			this.fireChange.call(this, "height", y);
		};
		
		var getWidth = ic["getWidth"] = function() {
			return this["width"];
		};
		
		var getHeight = ic["getHeight"] = function() {
			return this["height"];
		};
		
		return function() {
			this["setWidth"] = setWidth;
			this["setHeight"] = setHeight;
			this["getWidth"] = getWidth;
			this["getHeight"] = getHeight;
		};
	}
};