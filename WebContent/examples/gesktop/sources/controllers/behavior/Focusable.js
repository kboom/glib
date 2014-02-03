var FocusableController = {
	name : "FocusableController",
	parent : "ActivateController",
	definition : function(System) {
		var log = System["logger"].createLog("Activate");	
		
		/*
		 * View -> Model
		 */
		var vmFocusController = function(view) {
			this.focus();		
		};
		
		var vmFocusLostController = function(view) {
			this.focusLost();
		};
		
		/*
		 * Model -> View
		 */
		var mvFocusController = function(model) {
			this["body"].removeClass("inactive");
			this["body"].addClass("active");
		};
		
		var mvFocusLostController = function(model) {
			this["body"].removeClass("active");
			this["body"].addClass("inactive");
		};
		
		return function() {
			var model = this["model"];
			var view = this["view"];
			
			var vmFocusControllerCb = function() {
				vmFocusController.call(model, view);
			};
			
			model.registerChangeListener("onSummon", function() {
				view["root"].on("mouseenter", vmFocusControllerCb);
				
				view["root"].on("mouseleave", function() {
					vmFocusLostController.call(model, view);
				});
			});
			
			model.registerChangeListener("onDismiss", function() {
				view["root"].off("mouseenter", vmFocusControllerCb);
				
				view["root"].off("mouseleave", function() {
					vmFocusLostController.call(model, view);
				});
			});	
			
			if(!model.registerChangeListener) return;
			
			model.registerChangeListener("focus", function() {
				mvFocusController.call(view, model);
			});	
			
			model.registerChangeListener("focusLost", function() {
				mvFocusLostController.call(view, model);
			});				
		};
	}
};