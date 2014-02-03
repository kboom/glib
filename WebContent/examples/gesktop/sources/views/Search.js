var SearchView = {
	name : "SearchView",
	definition : function(System) {		
		System["timer"].stepForward("SearchView");	
		var root; $.get("./resources/structure/search.html", function(val) {
			root = val;
			System["timer"].stepBackward("SearchView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			this["trigger"] = $root.find("#searchTriggerAnchor");
			this["input"] = $root.find("#searchInputAnchor");
		};
	}
};