var ModelFactory = function(System) {
	
	var log = System["Logger"].createLog("ModelFactory module");
	var Util = System["Util"];
	
	log.log("debug", "Preparing manager");
	
	var modelSources = System["sources"].findChildByName("models");	
	var ModelFactory = System["factories"].createChild("modelFactory");
		
	// become a handler for all children of model source node
	modelSources.setHandler(ModelFactory);
	
	var create = function(modelNode, modelContext) {
		var currentNode = modelNode;
		do {
			var margs = {};
			var source = currentNode.getData()["cargs"];
			source instanceof Function ? source.call(margs) : (margs = source);	
						
			var augmentNodes = currentNode.getData().augments;
			Util.each(augmentNodes, function(anode) {
				create(anode, modelContext);
		 	});
			
			Util.each(margs, function(v,k) {
				if(modelContext[k] === undefined) modelContext[k] = v;
			});
			
		} while((currentNode = currentNode.getParent()) !== modelSources);	
	};
	
	
	ModelFactory["create"] = function(modelNode, params) {
		log.log("debug", "Creating new model \"" + modelNode.getName() + "\"");
		
		var modelContext = {};
		Util.addAll(modelContext, params);
		create(modelNode, modelContext);

		var model = modelNode.getObject();
		return new model(modelContext);
	};
	
};