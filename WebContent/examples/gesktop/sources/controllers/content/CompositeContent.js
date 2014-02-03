var CompositeContentController = {
	name : "CompositeContentController",
	parent: "ContentController",
	definition : function(System) {
		
		var addContentController = function(model, item) {
			var itemView = System.inject(item, "view");
			this["body"].append(itemView["root"]);
		};
		
		removeContentController = function(model, item) {
			
		};
		
		return function() {
			var model = this["model"] = System.create("CompositeContentModel");
			var view = this["view"] = System.create("CompositeContentView");
			
			model.registerChangeListener("addContent", function(item) {
				addContentController.call(view, model, item);
			});
			
			model.registerChangeListener("removeContent", function(item) {
				removeContentController.call(view, model);
			});
		};
	}
};