var PaneModel = {
	name : "PaneModel",
	parent : "CompositeComponentModel",
	augment : "SizeableModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("PaneModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		
		return function() {

		};
	}
};