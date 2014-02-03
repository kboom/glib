var StaticWindowModel = {
	name : "StaticWindowModel",
	parent : "WindowModel",
	augment : "SizeableModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("WindowModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();		
		
		return function() {

		};
	}
};