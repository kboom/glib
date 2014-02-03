var ImageTabController = {
	name : "ImageTabController",
	parent: "TabController",
	definition : function(System) {
		
		return function() {
			var model = this["model"] = System.create("ImageTabModel");
			var view = this["view"] = System.create("ImageTabView");
			
			model.registerChangeListener("setImage", function(src) {
				view["image"].attr("src", src);
			});
		};
	}
};