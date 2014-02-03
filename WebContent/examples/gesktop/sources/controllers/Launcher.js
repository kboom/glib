var LauncherController = {
	name : "LauncherController",
	parent : "WidgetController",
	augment : "DraggableController",
	definition : function(System) {
		
		return function() {
			var model = this["model"] = System.create("LauncherModel");
			var view = this["view"] = System.create("LauncherView");
			
			model.registerChangeListener("title", function(title) {
				view["title"].text(title);
			});
			
			model.registerChangeListener("image", function(source) {
				view["image"].src(source);
			});
			
			model.registerChangeListener("description", function(description) {
				view["description"].text(description);
			});
			
		};
	}
};