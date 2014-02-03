var TitledController = {
	name : "TitledController",
	definition : function(System) {
		var log = System["logger"].createLog("TitledController");	
		
		/*
		 * View -> Model
		 */
		
		/*
		 * Model -> View
		 */
		var setTitleController = function(model, title) {
			this["title"].text(title);
		};
		
		return function() {
			var model = this["model"];
			var view = this["view"];
			
			if(!model.registerChangeListener) return;
			
			model.registerChangeListener("setTitle", function(title) {
				setTitleController.call(view, model, title);
			});	
			
		};
	}
};