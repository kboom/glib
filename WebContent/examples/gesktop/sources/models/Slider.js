var SliderModel = {
	name : "SliderModel",
	parent : "WidgetModel",
	augment : "SlideableModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("SliderModel");		
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		
		return function() {

		};
	}
};
