var DesktopView = {
	name : "DesktopView",
	definition : function(System) {
		System["timer"].stepForward("DesktopView");	
		var root; $.get("./resources/structure/desktop.html", function(val) {
			root = val;
			System["timer"].stepBackward("DesktopView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			this["menuToolbar"] = $root.find("#menuToolbarAnchor");
			this["navToolbar"] = $root.find("#navToolbarAnchor");
			this["launchPane"] = $root.find("#launchPaneAnchor");
			this["contentPane"] = $root.find("#contentPaneAnchor");
		};
	}
};