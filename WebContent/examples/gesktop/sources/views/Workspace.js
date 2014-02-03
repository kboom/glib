var WorkspaceView = {
	name : "WorkspaceView",
	definition : function(System) {
		System["timer"].stepForward("WorkspaceView");	
		var root; $.get("./resources/structure/workspace.html", function(val) {
			root = val;
			System["timer"].stepBackward("WorkspaceView");	
		});
		
		
		return function() {
			var $root = this["root"] = $(root);
			this["body"] = this["root"];
			this["widgetContainer"] = $root.find("#widgetContainerAnchor");
		};
	}
};