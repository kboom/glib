var StaticWindowController = {
	name : "StaticWindowController",
	parent : "WindowController",
	augment : "SizeableController",
	definition : function(System) {
		
		return function() {
			var model = this["model"] = System.create("StaticWindowModel");
			var view = this["view"] = System.create("WindowView");
			
		};
		
	}
};