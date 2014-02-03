var SimpleContentView = {
	name : "SimpleContentView",
	definition : function(System) {
		
		return function() {
			var $body = $("<div>");
			this["root"] = $body;
			this["body"] = this["root"];
		};
	}
};