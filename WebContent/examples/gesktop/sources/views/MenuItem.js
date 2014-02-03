var MenuItemView = {
	name : "MenuItemView",
	definition : function(System) {
		System["timer"].stepForward("MenuItemView");	
		var root; $.get("./resources/structure/menu_item.html", function(val) {
			root = val;
			System["timer"].stepBackward("MenuItemView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			this["body"] = $root.find("#body");
			this["title"] = $root.find("#titleAnchor");
		};
	}
};