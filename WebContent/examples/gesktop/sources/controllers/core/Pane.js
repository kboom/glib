var PaneController = {
	name : "PaneController",
	augment : "SizeableController",
	definition : function(System) {
		var log = System["logger"].createLog("PaneController");		
		
		return function() {
			var model = this["model"];
			var view = this["view"];	
			
			if(!model.registerChangeListener) return;
		};
	}
};