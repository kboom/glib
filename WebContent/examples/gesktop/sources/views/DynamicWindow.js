var DynamicWindowView = {
	name : "DynamicWindowView",
	definition : function(System) {		
		System["timer"].stepForward("DynamicWindowView");	
		var root; $.get("./resources/structure/dynamic_window.html", function(val) {
			root = val;
			System["timer"].stepBackward("DynamicWindowView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			this["body"] = this["root"];
			this["title"] = $root.find("#titleAnchor");
			this["content"] = $root.find("#contentAnchor");
			this["dragHandle"] = $root.find("#dragHandleAnchor");
			
			this["close"] = $root.find("#closeButtonAnchor");
			
			this["resizeHandleSE"] = $root.find("#resizeHandleSEAnchor");
			this["resizeHandleSW"] = $root.find("#resizeHandleSWAnchor");
			this["resizeHandleE"] = $root.find("#resizeHandleEAnchor");
			this["resizeHandleW"] = $root.find("#resizeHandleWAnchor");
			this["resizeHandleS"] = $root.find("#resizeHandleSAnchor");
		};
	}
};