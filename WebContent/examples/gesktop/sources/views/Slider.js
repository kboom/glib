var SliderView = {
	name : "SliderView",
	definition : function(System) {
		System["timer"].stepForward("SliderView");	
		var root; $.get("./resources/structure/slider.html", function(val) {
			root = val;
			System["timer"].stepBackward("SliderView");	
		});
		
		return function() {
			var $root = this["root"] = $(root);
			var body = this["body"] = $root;
		};
	}
};