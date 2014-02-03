var CompositeContentView = {
	name : "CompositeContentView",
	definition : function(System) {
		var $body = $("<div>");
		return function() {
			this["root"] = $body;
			this["body"] = this["root"];
		};
	}
};