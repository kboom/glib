var NavToolbarController = {
	name : "NavToolbarController",
	definition : function(System) {
		
		return function() {
			var model = this["model"] = System.create("NavToolbarModel");
			var view = this["view"] = System.create("NavToolbarView");
			
			model.registerChangeListener("addTab", function(item) {
				var itemView = System.inject(item, "view");
				view["tabs"].append(itemView["root"]);
			});
			
			model.registerChangeListener("removeTab", function(item) {
				var itemView = System.inject(item, "view");
				itemView["root"].remove();
			});
			
			model.registerChangeListener("setSearch", function(item) {				
				var itemView = System.inject(item, "view");
				view["search"].append(itemView["root"]);
			});
		};
	}
};