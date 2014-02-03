var ContentPaneController = {
	name : "ContentPaneController",
	parent : "PaneController",
	definition : function(System) {
		
		var switchToWorkspaceController = function(model, item) {
			var itemView = System.inject(item, "view");
			this["body"].empty();
			this["body"].append(itemView["root"]);
		};
		
		var removeWorkspaceController = function(model, item) {
			var itemView = System.inject(item, "view");
			itemView["root"].remove();
		};
		
		return function() {
			var model = this["model"] = System.create("ContentPaneModel");
			var view = this["view"] = System.create("ContentPaneView");
			
			model.registerChangeListener("switchToWorkspace", function(item) {
				switchToWorkspaceController.call(view, model, item);
			});
			
			model.registerChangeListener("removeWorkspace", function(item) {
				removeWorkspaceController.call(view, model, item);
			});

		};
	}
};