var SlideableController = {
	name : "SlideableController",
	parent : "PositionableController",
	definition : function(System) {
		var log = System["logger"].createLog("SlideableController");	
		
		/*
		 * View -> Model
		 */
		var slideController = function(view, handle) {	
			var model = this;
			var rootView = view["root"];
			var parentView = rootView.parent();
			rootView.on("mousedown.slide", function(e) {	
				console.log("mousedown : slide");
				
				var parentViewOffset = parentView.offset();
				var parentViewX = parentViewOffset.left;
				var parentViewY = parentViewOffset.top;
				var parentViewWidth = parentView.width();
				var parentViewHeight = parentView.height();
				model.setSliderRect(parentViewX, parentViewY, parentViewWidth, parentViewHeight);
				
				model.startSliding(e.pageX, e.pageY);				
				
				$(document).on("mouseup.slide", function() {
					console.log("mouseup : slide");
					model.stopSliding();
					$(document).off("mousemove.slide");					
					$(document).off("mouseup.slide");					
				});
				
				$(document).on("mousemove.slide", function(e) {
					console.log("mousemove : slide: " + e.pageX + " : " + e.pageY);						
					model.slide(e.pageX, e.pageY);
				});
			});			
		};
		
		/*
		 * Model -> View
		 */		
		
		return function() {
			var model = this["model"];
			var view = this["view"];
			
			model.registerChangeListener("onSummon", function() {			
				slideController.call(model, view);				
			});			
			
		};
	}
};