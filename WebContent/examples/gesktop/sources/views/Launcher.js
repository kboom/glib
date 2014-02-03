var LauncherView = {
	name : "LauncherView",
	definition : function(System) {
		System["timer"].stepForward("LauncherView");	
		var root; $.get("./resources/structure/launcher.html", function(val) {
			root = val;
			System["timer"].stepBackward("LauncherView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			this["body"] = $root.find("#body");
			this["dragHandle"] = this["root"];
			this["title"] = $root.find("#titleAnchor");
			this["image"] = $root.find("#imageAnchor");
			this["description"] = $root.find("#descriptionAnchor");
		};
	}
};