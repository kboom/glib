var TitledTabView = {
	name : "TitledTabView",
	definition : function(System) {
		System["timer"].stepForward("TitledTabView");	
		var root; $.get("./resources/structure/titled_tab.html", function(val) {
			root = val;
			System["timer"].stepBackward("TitledTabView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			this["body"] = $root.find("#body");
			this["title"] = $root.find("#titleAnchor");
		};
	}
};