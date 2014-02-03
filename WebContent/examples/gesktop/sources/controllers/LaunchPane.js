var LaunchPaneController = {
	name : "LaunchPaneController",
	parent : "PaneController",
	definition : function(System) {
		
		var addLauncherController = function(model) {
			
		};
		
		var removeLauncherController = function(model) {
			
		};
		
		var showLauncherController = function(model, item) {
			var itemView = System.inject(item, "view");
			var widgetContainer = this["widgetContainer"];
			widgetContainer.append(itemView["root"]);
			model.setContentWidth(widgetContainer.width());
		};
		
		var hideLauncherController = function(model, item) {
			var itemView = System.inject(item, "view");
			itemView["root"].remove();
			widgetContainer = this["widgetContainer"];
			model.setContentWidth(widgetContainer.width());
		};
		
		var emptyListController = function(model) {
			this["widgetContainer"].children().detach();
			widgetContainer = this["widgetContainer"];
			model.setContentWidth(widgetContainer);
		};
		
		var rewindToController = function(model, offset) {
			this["root"].animate({
		         scrollLeft: offset
		    }, model.getRewindSpeed());
		};
		
		return function() {
			var model = this["model"] = System.create("LaunchPaneModel");
			var view = this["view"] = System.create("LaunchPaneView");
			
			model.registerChangeListener("addLauncher", function(item) {
				addLauncherController.call(view, model, item);
			});
			
			model.registerChangeListener("rewindTo", function(offset) {
				rewindToController.call(view, model, offset);
			});
			
			model.registerChangeListener("removeLauncher", function(item) {
				removeLauncherController.call(view, model, item);
			});
			
			model.registerChangeListener("hideLauncher", function(item) {
				hideLauncherController.call(view, model, item);
			});	
			
			model.registerChangeListener("showLauncher", function(item) {
				showLauncherController.call(view, model, item);
			});	
			
			model.registerChangeListener("emptyList", function() {
				emptyListController.call(view, model);
			});
			
		};
	}
};