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

/**
 * A self-populating tree that holds controllers all of which are static. These
 * are used by the AssemblyFactory to link model to a corresponding view if
 * exists.
 * 
 */
var ControllerTemplate = function(System) {
	var Log = System["Logger"].createLog("ControllerTemplate module");
	var Util = System["Util"];
	
	var Root = System["sources"].createChild("controllers");

	return (function() {
		var CONTROLLER = "addControllers";

		var builder = {};
		var configApply;
		var configSlot = (function() {
			return this;
		}).call(function(slot) {
			configSlot = slot;
			configSlot[CONTROLLER] = slot[CONTROLLER]
					|| (slot[CONTROLLER] = {});
		});

		builder[CONTROLLER] = function(config) {
			if(!(config instanceof Object)) 
				throw new Ex.WRONG_ARGUMENT("Wrong notation. Controllers must be listed in object literal notation.");

			Util.each(config, function(item, name) {
				(function(name) { 
					configApply.call(function(config) {				
						var name = config.name || name;
						var parent = config.parent || "controllers";
						var augment = config.augment ? (config.augment instanceof Array ? config.augment : [ config.augment ]) : [];
						var definition = config.definition;
						
						Log.log("debug", "Controller definition <" + name + "> extends <" + parent + "> loaded.");
						
						configSlot[CONTROLLER][name] = {
							name : name,
							parent : parent,
							augment : augment,
							definition : definition
						};
					}, item, name);
				})(name);
			});
		};

		return {
			"getBuilder" : function(config, apply) {
				configSlot(config);
				configApply = apply;
				return builder;
			},
			"construct" : function() {
				var exposedMethods = {
					"create" : Util.bind(System["create"], System),
		 			"inject" : Util.bind(System["inject"], System),
		 			"logger" : System["Logger"],
		 			"timer" : System["Timer"],
		 			"remove" : Util.bind(System["remove"], System),
				};
				Root.setObject(function() {});
				Root.setData({});
				
				function extract(v) {
					var pname = v.parent;
					var cname = v.name;
					var anames = v.augment;
					var cdef = v.definition;
					
					var pnode = Root.findChildByName(pname);
					var cnode = pnode.createChild(cname);					
					var ccontroller = (cdef).call(this, exposedMethods);
					
					var augments = {};
					Util.each(anames, function(aname) {
				 		var anode = Root.findChildByName(aname);
				 		augments[aname] = anode;
				 	});
					
					cnode.setData({ 
						"augments" : augments
					});
					
//					Util.each(anames, function(aname) {
//				 		var anode = Root.findChildByName(aname);
//				 		var aaugm = anode.getObject();
//				 		aaugm.call(ccontroller);
//				 	});
					
					cnode.setObject(ccontroller);
				}
				
				var elementsToGo = configSlot[CONTROLLER];
				
				function extractInOrder(index) {
					var pname = elementsToGo[index].parent;
					if(elementsToGo[pname]) extractInOrder(pname);
					
					Util.each(elementsToGo[index].augment, function(v) {
						if(elementsToGo[v]) extractInOrder(v);
					});
					
					extract(elementsToGo[index]);
					delete elementsToGo[index];					
				}
				
				Util.each(elementsToGo, function(element, name) {
					extractInOrder(name);
				});				
				delete this;
			}
		};
	})();
};