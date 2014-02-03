var WidgetController = {
	name : "WidgetController",
	augment : [ "ActionableController", "FocusableController" ],
	definition : function(System) {
		var log = System["logger"].createLog("WidgetController");		
		
		return function() {
			var model = this["model"];
			var view = this["view"];	
			
			if(!model.registerChangeListener) return;
			
			model.registerChangeListener("onDestroy", function() {
				view["root"].off();
			});
		};
	}
};