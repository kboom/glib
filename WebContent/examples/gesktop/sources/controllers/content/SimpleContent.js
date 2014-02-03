var SimpleContentController = {
	name : "SimpleContentController",
	parent: "ContentController",
	definition : function(System) {
		
		var setContentController = function(model, item) {
			var itemView;
			if(typeof(item) === "string") {
				itemView = $("<div>");
				itemView.html(item);
			}
			else itemView = System.inject(item, "view");			
			this["body"].append(itemView);
		};
		
		return function() {
			var model = this["model"] = System.create("SimpleContentModel");
			var view = this["view"] = System.create("SimpleContentView");
			
			console.log("ON CREATION: " + view["root"].html() + " END");
			
			
			model.registerChangeListener("setContent", function(item) {
				setContentController.call(view, model, item);
			});
			
		};
	}
};