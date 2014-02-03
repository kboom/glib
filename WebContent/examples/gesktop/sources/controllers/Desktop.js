var DesktopController = {
	name : "DesktopController",
	definition : function(System) {
		/*
		 * Async scope.
		 */	
		return function() {
			var model = this["model"] = System.create("DesktopModel");
			var view = this["view"] = System.create("DesktopView");
			
			var rootView = System.inject("RootView");
			var menuToolbarController = System.inject("MenuToolbarController");
			var navToolbarController = System.inject("NavToolbarController");
			var launchPaneController = System.inject("LaunchPaneController");
			var contentPaneController = System.inject("ContentPaneController");

			// Attach to the root view
			view["root"].appendTo(rootView["root"]);
			
			/*
			 * Register listeners
			 */
			model.registerChangeListener("setMenuToolbar", function(toolbar) {
				view["menuToolbar"].append(menuToolbarController.view["root"]);
			});

			model.registerChangeListener("setNavToolbar", function(toolbar) {
				view["navToolbar"].append(navToolbarController.view["root"]);
			});

			model.registerChangeListener("setLaunchPane", function(pane) {
				view["launchPane"].append(launchPaneController.view["root"]);
			});

			model.registerChangeListener("setContentPane", function(pane) {
				view["contentPane"].append(contentPaneController.view["root"]);
			});
			
			/*
			 * Handle models
			 */
			model.setMenuToolbar(menuToolbarController.model);
			model.setNavToolbar(navToolbarController.model);
			model.setLaunchPane(launchPaneController.model);
			model.setContentPane(contentPaneController.model);	
		};
	}
};