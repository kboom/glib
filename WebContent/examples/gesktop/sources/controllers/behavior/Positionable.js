var PositionableController = {
	name : "PositionableController",
	parent : "SizeableController",
	definition : function(System) {
		var log = System["logger"].createLog("PositionableController");	
		
		/*
		 * View -> Model
		 */
		
		
		/*
		 * Model -> View
		 */
		var setOffsetController = function(model, x, y) {
			this["root"].css({
				"right" : "",
				"bottom" : "",
				"left" : x + "px", 
				"top" : y + "px"
			});
		};
		
		var setOffsetLeftController = function(model, offset) {
			this["root"].css({
				"right" : "",
				"left" : offset + "px"
			});
		};
		
		var setOffsetRightController = function(model, offset) {
			this["root"].css({
				"left" : "",
				"right" : offset + "px"
			});
		};
		
		var setOffsetTopController = function(model, offset) {
			this["root"].css({
				"bottom" : "",
				"top" : offset + "px"
			});
		};
		
		var setOffsetBottomController = function(model, offset) {
			this["root"].css({
				"top" : "",
				"bottom" : offset + "px"
			});
		};
		
		return function() {
			var model = this["model"];
			var view = this["view"];
			
			model.registerChangeListener("width", model.invalidatePosition);
			model.registerChangeListener("height",  model.invalidatePosition);
			
			model.registerChangeListener("onSummon", function() {
//				var position = view["root"].position();
//				model.setOffset(position.left, position.top);
			});
			
			model.registerChangeListener("offset", function(x, y) {
				setOffsetController.call(view, model, x, y);
			});
			
			model.registerChangeListener("offsetLeft", function(offset) {
				setOffsetLeftController.call(view, model, offset);
			});
			
			model.registerChangeListener("offsetRight", function(offset) {
				setOffsetRightController.call(view, model, offset);
			});
			
			model.registerChangeListener("offsetTop", function(offset) {
				setOffsetTopController.call(view, model, offset);
			});
			
			model.registerChangeListener("offsetBottom", function(offset) {
				setOffsetBottomController.call(view, model, offset);
			});
			
		};
	}
};