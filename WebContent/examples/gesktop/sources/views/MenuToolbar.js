var MenuToolbarView = {
	name : "MenuToolbarView",
	definition : function(System) {		
		System["timer"].stepForward("MenuToolbarView");	
		var root; $.get("./resources/structure/menu_toolbar.html", function(val) {
			root = val;
			System["timer"].stepBackward("MenuToolbarView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			this["body"] = $root.find("#body");
			this["menuItems"] = $root.find("#menuItemsAnchor");
			this["slider"] = $root.find("#sliderAnchor");
		};
	}
};