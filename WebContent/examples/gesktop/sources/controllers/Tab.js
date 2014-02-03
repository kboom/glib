var TabController = {
	name : "TabController",
	parent: "WidgetController",
	definition : function(System) {
		
		return function() {
			var model = this["model"];
			var view = this["view"];
			
			
			view["root"].on("click", function(e) {
				if (e.which == 2) {
					e.preventDefault();
					model.close();
				}
			});
		};
	}
};