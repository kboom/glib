var WindowView = {
	name : "WindowView",
	definition : function(System) {		
		System["timer"].stepForward("WindowView");	
		var root; $.get("./resources/structure/window.html", function(val) {
			root = val;
			System["timer"].stepBackward("WindowView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			this["body"] = this["root"];
			this["title"] = $root.find("#titleAnchor");
			this["content"] = $root.find("#contentAnchor");			
		};
	}
};