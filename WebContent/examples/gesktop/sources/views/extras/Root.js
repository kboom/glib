var RootView = {
	name : "RootView",
	definition : function(System) {
		var $body = $("body");
		return function() {
			this["root"] = $body;
		};
	}
};