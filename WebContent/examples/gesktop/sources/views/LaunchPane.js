var LaunchPaneView = {
	name : "LaunchPaneView",
	definition : function(System) {
		System["timer"].stepForward("LaunchPaneView");	
		var root; $.get("./resources/structure/launch_pane.html", function(val) {
			root = val;
			System["timer"].stepBackward("LaunchPaneView");	
		});
		
		
		return function() {
			var $root = this["root"] = $(root);
			this["body"] = $root.find("#body");
			this["widgetContainer"] = $root.find("#widgetContainerAnchor");
		};
	}
};