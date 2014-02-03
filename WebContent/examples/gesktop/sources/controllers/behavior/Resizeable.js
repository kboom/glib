var ResizeableController = {
	name : "ResizeableController",
	parent : "SizeableController",
	definition : function(System) {
		var log = System["logger"].createLog("ResizeableController");	
		
		/*
		 * View -> Model
		 */
		var resizeHandleController = function(view, handle, prepareAction) {
			var model = this;
			
			if(model.getMinHeight() == 0 && view["root"].css("min-height") !== "") {
				var minHeight = parseInt(view["root"].css("min-height").slice(0, -2));
				model.setMinHeight(minHeight);
			}
			
			if(model.getMinWidth() == 0 && view["root"].css("min-width") !== "") {
				var minWidth = parseInt(view["root"].css("min-width").slice(0, -2));
				model.setMinWidth(minWidth);
			}
			
			handle.on("mousedown.resize", function(e) {
				console.log("mousedown.resize");

				
				prepareAction();
				model.startResizing(e.pageX, e.pageY);
				
				
				$(document).on("mouseup.resize", function() {
					console.log("mouseup");
					model.stopResizing();
					$(document).off("mousemove.resize");					
					$(document).off("mouseup.resize");					
				});
				
				$(document).on("mousemove.resize", function(e) {
					console.log("mousemove: " + e.pageX + " : " + e.pageY);						
					model.resize(e.pageX, e.pageY);
				});
			});
		};
		
		/*
		 * Model -> View
		 */		
		
		return function() {
			var model = this["model"];
			var view = this["view"];
			
			var resizeHandleSE = view["resizeHandleSE"];
			var resizeHandleSW = view["resizeHandleSW"];
			var resizeHandleE = view["resizeHandleE"];
			var resizeHandleW = view["resizeHandleW"];
			var resizeHandleS = view["resizeHandleS"];
			
			model.registerChangeListener("onSummon", function() {
				resizeHandleController.call(model, view, resizeHandleSE, function(x,y) {
					//model.startResizing(x, y);
					model.setHorizontalResize(true);
					model.setVerticalResize(true);
					model.setMovingBorder("E");
				});
				resizeHandleController.call(model, view, resizeHandleSW, function(x,y) {
					//model.startResizing(x, y);
					model.setHorizontalResize(true);
					model.setVerticalResize(true);
					model.setMovingBorder("W");
				});
				resizeHandleController.call(model, view, resizeHandleE, function(x,y) {
					//model.startResizing(x, y, "H");
					model.setHorizontalResize(true);
					model.setVerticalResize(false);
					model.setMovingBorder("E");
				});
				resizeHandleController.call(model, view, resizeHandleW, function(x,y) {
					//model.startResizing(x, y, "H");
					model.setHorizontalResize(true);
					model.setVerticalResize(false);
					model.setMovingBorder("W");
				});
				resizeHandleController.call(model, view, resizeHandleS, function(x,y) {
					//model.startResizing(x, y, "V");
					model.setHorizontalResize(false);
					model.setVerticalResize(true);
				});
			});			
			
		};
	}
};