var ContentPaneView = {
	name : "ContentPaneView",
	definition : function(System) {
		System["timer"].stepForward("ContentPaneView");	
		var root; $.get("./resources/structure/content_pane.html", function(val) {
			root = val;
			System["timer"].stepBackward("ContentPaneView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			this["body"] = this["root"];
		};
	}
};