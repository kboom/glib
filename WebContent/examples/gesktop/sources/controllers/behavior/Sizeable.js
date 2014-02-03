var SizeableController = {
	name : "SizeableController",
	definition : function(System) {
		var log = System["logger"].createLog("SizeableController");	
		
		/*
		 * View -> Model
		 */
		var sizeControllerVM = function(view) {
			var width = view["root"].width();
			var height = view["root"].height();
			this.setWidth(width);
			this.setHeight(height);
		};
		
		/*
		 * Model -> View
		 */
		var sizeControllerMV = function(model) {
			this["root"].css({
				"width" : model.getWidth(), 
				"height" : model.getHeight()
			});
		};
		
		var setWidthController = function(model, x) {
			this["root"].css({ "width" : x+"px" });
		};
		
		var setHeightController = function(model, y) {
			this["root"].css({ "height" : y+"px" });
		};
		
		return function() {
			var model = this["model"];
			var view = this["view"];
			
			model.registerChangeListener("onSummon", function() {
				sizeControllerVM.call(model, view);
			});
			
			model.registerChangeListener("width", function(x) {
				setWidthController.call(view, model, x);
			});
			
			model.registerChangeListener("height", function(y) {
				setHeightController.call(view, model, y);
			});
			
		};
	}
};