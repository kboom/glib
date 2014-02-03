var ViewFactory = function(System) {
	var log = System["Logger"].createLog("ViewFactory module");

	log.log("debug", "Preparing manager");
	
	var viewSources = System["sources"].findChildByName("views");
	var ViewFactory = System["factories"].createChild("viewFactory");
	
	viewSources.setHandler(ViewFactory);
	
	var create = function(viewNode, viewContext, params) {
		var currentNode = viewNode;	
		var processingChain = [];		
		do {
			var currentViewBuilder = currentNode.getObject();
			processingChain.push(currentViewBuilder);			
		} while((currentNode = currentNode.getParent()) !== viewSources);	

		for(var i = processingChain.length-1; i >= 0; i--) {
			processingChain[i].call(viewContext, params);
		}
	};
	
	ViewFactory["create"] = function(viewNode, params) {
		log.log("debug", "Creating new view \"" + viewNode.getName() + "\"");
		
		var viewContext = {};
		create(viewNode, viewContext, params);
		
		return viewContext;
	};
};