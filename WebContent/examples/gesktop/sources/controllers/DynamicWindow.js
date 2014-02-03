var DynamicWindowController = {
	name : "DynamicWindowController",
	parent : "WindowController",
	augment : [ "ResizeableController", "DraggableController" ],
	definition : function(System) {
		
		return function() {
			var model = this["model"] = System.create("DynamicWindowModel");
			var view = this["view"] = System.create("DynamicWindowView");
			
			model.registerChangeListener("onSummon", function() {
				view["close"].on("click", function() {
					alert("closing!");
					model.close();
				});
			});			
			
		};
		
	}
};