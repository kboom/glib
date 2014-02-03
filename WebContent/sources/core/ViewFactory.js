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