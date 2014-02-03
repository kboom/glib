var NavToolbarView = {
	name : "NavToolbarView",
	definition : function(System) {		
		System["timer"].stepForward("NavToolbarView");	
		var root; $.get("./resources/structure/nav_toolbar.html", function(val) {
			root = val;
			System["timer"].stepBackward("NavToolbarView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			this["body"] = $root.find("#body");
			this["tabs"] = $root.find("#tabsAnchor");
			this["search"] = $root.find("#searchAnchor");
		};
	}
};