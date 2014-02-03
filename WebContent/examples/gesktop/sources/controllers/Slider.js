var SliderController = {
	name : "SliderController",
	parent : "WidgetController",
	augment : "SlideableController",
	definition : function(System) {
		
		return function() {
			var model = this["model"] = System.create("SliderModel");
			var view = this["view"] = System.create("SliderView");			
		};
	}
};