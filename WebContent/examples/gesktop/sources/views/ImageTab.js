var ImageTabView = {
	name : "ImageTabView",
	definition : function(System) {
		System["timer"].stepForward("ImageTabView");	
		var root; $.get("./resources/structure/image_tab.html", function(val) {
			root = val;
			System["timer"].stepBackward("ImageTabView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			this["body"] = $root.find("#body");
			this["image"] = $root.find("#imageAnchor");
		};
	}
};