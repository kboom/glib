var MenuToolbarController = {
	name : "MenuToolbarController",
	definition : function(System) {
		
		return function() {
			var model = this["model"] = System.create("MenuToolbarModel");
			var view = this["view"] = System.create("MenuToolbarView");
			
			model.registerChangeListener("addMenuItem", function(item) {
				var itemView = System.inject(item, "view");
				view["menuItems"].prepend(itemView["root"]);
			});
			
			model.registerChangeListener("removeMenuItem", function(item) {
				var itemView = System.inject(item, "view");
				view["menuItems"].detach(itemView["root"]);
			});
			
			model.registerChangeListener("setSlider", function(item) {
				var itemView = System.inject(item, "view");
				view["slider"].append(itemView["root"]);
			});
			
		};
	}
};