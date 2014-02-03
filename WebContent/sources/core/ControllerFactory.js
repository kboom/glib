//  Copyright 2014 Grzegorz Gurgul gurgul.grzegorz@gmail.com
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.

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