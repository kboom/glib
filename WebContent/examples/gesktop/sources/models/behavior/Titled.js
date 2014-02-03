var TitledModel = {
	name : "TitledModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("TitledModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var setTitle = ic["setTitle"] = function(title) {
			this["title"] = title;
			this.fireChange.call(this, "setTitle", title);
		};
		
		return function() {
			this["setTitle"] = setTitle;
		};
	}
};