var MenuItemController = {
	name : "MenuItemController",
	parent : "WidgetController",
	definition : function(System) {
		
		return function() {
			var model = this["model"] = System.create("MenuItemModel");
			var view = this["view"] = System.create("MenuItemView");
			
			model.registerChangeListener("setTitle", function(title) {
				view["title"].text(title);
			});
		};
	}
};