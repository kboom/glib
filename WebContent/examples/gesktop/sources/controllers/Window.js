var WindowController = {
	name : "WindowController",
	parent : "WidgetController",
	augment : [ "PositionableController", "TitledController" ],
	definition : function(System) {
		
		var summonController = function(model) {
			var content = model.getContent();
			if(!content) return;
			var contentView = System.inject(content, "view");
			this["content"].html(contentView["root"].html());
		};
		
		var dismissController = function(model) {
			this["content"].html("");
		};
		
		return function() {
			var model = this["model"];
			var view = this["view"];
			
			model.registerChangeListener("onSummon", function() {
				summonController.call(view, model);
			});
			
			model.registerChangeListener("onDismiss", function() {
				dismissController.call(view, model);
			});
			
		};
		
	}
};