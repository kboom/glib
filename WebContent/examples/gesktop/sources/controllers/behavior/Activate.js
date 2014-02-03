var ActivateController = {
	name : "ActivateController",
	definition : function(System) {
		var log = System["logger"].createLog("Activate");	
		
		/*
		 * View -> Model
		 */
		
		/*
		 * Model -> View
		 */
		var activateController = function(model, view) {
			view["body"].removeClass("inactive");
			view["body"].addClass("active");
			view["body"].focus();
		};
		
		var deactivateController = function(model, view) {
			view["body"].removeClass("active");
			view["body"].addClass("inactive");
			view["body"].blur();
		};
		
		return function() {
			var model = this["model"];
			var view = this["view"];
			var rootView = view["root"];
			var rootParent = rootView.parent();
			model.registerChangeListener("onSummon", function() {
				
				view["root"].on("click", function(e) {
					if(model.isActivated()) return;
					
					var watchUnclick = function() {
						rootView.one("mouseleave", function() {
							$(document).one("click", function() {
								model.deactivate();
							});
							rootView.one("mouseenter", function() {
								watchUnclick();								
							});
						});
					};
					watchUnclick();
					
					model.activate();
				});
				
			});
			
			if(!model.registerChangeListener) return;
			
			model.registerChangeListener("activate", function() {
				activateController(model, view);
			});	
			
			model.registerChangeListener("deactivate", function() {
				deactivateController(model, view);
			});				
		};
	}
};