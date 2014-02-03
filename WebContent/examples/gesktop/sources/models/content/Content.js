var ContentModel = {
	name : "ContentModel",
	parent : "ComponentModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("CompositeContent");
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		var sp = Clazz.prototype.getSuperType().prototype;
		
		return function() {

		};		
		
	}
};