var WorkspaceController = {
	name : "WorkspaceController",
	parent : "PaneController",
	definition : function(System) {

		var addWidgetController = function(model, item) {
			var itemView = System.inject(item, "view");
			this["widgetContainer"].append(itemView["root"]);			
		};
		
		var removeWidgetController = function(model, item) {
			var itemView = System.inject(item, "view");
			itemView["root"].remove();					
		};
		
		/*
		 * View -> Model
		 */	
		
		return function() {
			var model = this["model"] = System.create("WorkspaceModel");
			var view = this["view"] = System.create("WorkspaceView");

			model.registerChangeListener("addWidget", function(item) {
				addWidgetController.call(view, model, item);
			});
			
			model.registerChangeListener("removeWidget", function(item) {
				removeWidgetController.call(view, model, item);
			});
			
			model.registerChangeListener("onCreate", function() {

			});
			
			model.registerChangeListener("onDestroy", function() {

			});
			
			model.registerChangeListener("onSummon", function() {
				
			});
			
			model.registerChangeListener("onDismiss", function() {
				
			});
		};
	}
};