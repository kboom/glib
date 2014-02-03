var ControllerFactory = function(System) {
	var log = System["Logger"].createLog("ControllerDresser module");
	var Util = System["Util"];

	log.log("debug", "Preparing manager");
	
	var controllerSources = System["sources"].findChildByName("controllers");
	var ControllerFactory = System["factories"].createChild("controllerFactory");
	
	controllerSources.setHandler(ControllerFactory);
	
	var create = function(controllerNode, controllerContext, params) {
		var currentNode = controllerNode;	
		do {
			var controllerDresser = currentNode.getObject();
			controllerDresser.call(controllerContext);			
			var augmentNodes = currentNode.getData().augments;
			Util.each(augmentNodes, function(anode) {
				create(anode, controllerContext, params);
		 	});
		} while((currentNode = currentNode.getParent()) !== controllerSources);
	};
	
	ControllerFactory["create"] = function(controllerNode, params, nest) {
		log.log("debug", "Dressing with controller \"" + controllerNode.getName() + "\"");
		
		var controllerContext = {};
		
		create(controllerNode, controllerContext, params);	
		
		nest("model", controllerContext.model);
		nest("view", controllerContext.view);
		
		return controllerContext;
	};
	
};