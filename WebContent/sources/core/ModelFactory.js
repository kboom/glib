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