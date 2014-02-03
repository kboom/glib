var ActionableController = {
	name : "ActionableController",
	definition : function(System) {
		var log = System["logger"].createLog("ActionableController");	
		
		/*
		 * View -> Model
		 */
		
		/*
		 * Model -> View
		 */
		var setTargetAction = function(model, actionName) {
			var actionTrigger = model.getTargetAction(actionName);
			var element = actionTrigger.element;
			this[element].on(actionName, actionTrigger.callback);			
		};
		
		return function() {
			var model = this["model"];
			var view = this["view"];
			
			if(!model.registerChangeListener) return;
			
			model.registerChangeListener("setTargetAction", function(actionName) {
				setTargetAction.call(view, model, actionName);
			});	
			
		};
	}
};