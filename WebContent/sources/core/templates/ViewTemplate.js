/**
 * A self-populating tree that holds views all of which are static either cached
 * or not. These are used by the AssemblyFactory to link models with it using
 * controller.
 * 
 */
var ViewTemplate = function(System) {
	var Log = System["Logger"].createLog("ViewTemplate module");
	var Util = System["Util"];
	
	var Root = System["sources"].createChild("views");

	return (function() {
		var VIEW = "addViews";

		var builder = {};
		var configApply;
		var configSlot = (function() {
			return this;
		}).call(function(slot) {
			configSlot = slot;
			configSlot[VIEW] = slot[VIEW] || (slot[VIEW] = {});
		});

		builder[VIEW] = function(config) {
			if(!(config instanceof Object)) 
				throw new Ex.WRONG_ARGUMENT("Wrong notation. Views must be listed in object literal notation.");

			Util.each(config, function(item, name) {
				(function(name) { 
					configApply.call(function(config) {				
						var name = config.name || name;
						var parent = config.parent || "views";
						var augment = config.augment ? (config.augment instanceof Array ? config.augment : [ config.augment ]) : [];
						var definition = config.definition;
						
						Log.log("debug", "View definition <" + name + "> extends <" + parent + "> loaded.");
						
						configSlot[VIEW][name] = {
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
		 			"timer" : System["Timer"]
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
					var cview = (cdef).call(this, exposedMethods);
					
					Util.each(anames, function(aname) {
				 		var anode = Root.findChildByName(aname);
				 		var aaugm = anode.getData().cargs;
				 		aaugm.call(cview);
				 	});					
					
					cnode.setObject(cview);
				}
				
				var elementsToGo = configSlot[VIEW];
				
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