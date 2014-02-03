/**
 * A self-populating tree that holds model prototypes and their construction
 * data in inheritance order. These are used by the AssemblyFactory to create
 * valid instances of types defined here. See the manual pages for valid
 * arguments structure.
 * 
 */
var ModelTemplate = function(System) {	
	var Log = System["Logger"].createLog("ModelTemplate module");
	Log.log("verbose", "Loading");	
	var Ex = System["Exception"];
	var Util = System["Util"];
	
	var Root = System["sources"].createChild("models");
	
	return (function() {
		var MODEL = "addModels";
		var BASE = "setSuperType";
		
		var builder = {};
		var configApply;
		var configSlot = (function() {
			return this;
		}).call(function(slot) {
			configSlot = slot;
			configSlot[MODEL] = slot[MODEL] || (slot[MODEL] = {});			
			configSlot[BASE] = slot[BASE] || (slot[BASE] = function() {});
		});
		
		builder[MODEL] = function(config) {
			if(!(config instanceof Object)) 
				throw new Ex.WRONG_ARGUMENT("Wrong notation. Models must be listed in object literal notation.");

			Util.each(config, function(item, name) {
				(function(name) { 
					configApply.call(function(config) {				
						var name = config.name || name;
						var parent = config.parent || "models";
						var augment = config.augment ? (config.augment instanceof Array ? config.augment : [ config.augment ]) : [];
						var dependency = config.dependency ? (config.dependency instanceof Array ? config.dependency : [ config.dependency ]) : [];
						var definition = config.definition;
						
						Log.log("debug", "Model definition <" + name + "> extends <" + parent + "> loaded.");
						
						configSlot[MODEL][name] = {
							name : name,
							parent : parent,
							augment : augment,
							dependency : dependency,
							definition : definition							
						};
					}, item, name);
				})(name);
			});					
		};
		
		builder[BASE] = function(config) {	
			if(!(config instanceof Object)) 
				throw new Ex.WRONG_ARGUMENT("Wrong notation. Models must be listed in object literal notation.");

			Util.each(config, function(item, name) {
				(function(name) { 
					configApply.call(function(config) {				
						configSlot[BASE] =  config.definition;
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
				Root.setObject(configSlot[BASE](System));
				Root.setData({"cargs" : {}});
				var exposedMethods = {
					"create" : Util.bind(System["create"], System),
		 			"inject" : Util.bind(System["inject"], System),
		 			"augment" : Util.augment,
		 			"util" : Util,
		 			"logger" : System["Logger"],
		 			"timer" : System["Timer"],
		 			
				};				
				
				function extract(v) {
					var pname = v.parent;
					var cname = v.name;
					var anames = v.augment;
					var cdef = v.definition;
					
					var pnode = Root.findChildByName(pname);
					var ptype = pnode.getObject();
					
					var ctype = ptype.prototype.createSubtype();
				 	var cargs = (cdef).call({}, ctype, exposedMethods);
					
				 	var augments = {};
					Util.each(anames, function(aname) {
				 		var anode = Root.findChildByName(aname);
				 		augments[aname] = anode;
				 	});			 	
					
					var cnode = pnode.createChild(cname);
					cnode.setObject(ctype);
					ctype.prototype.sealType();
					cnode.setData({ "augments" : augments, "cargs" : cargs });
				}
				
				var elementsToGo = configSlot[MODEL];
				
				function extractInOrder(index) {
					var pname = elementsToGo[index].parent;
					if(elementsToGo[pname]) extractInOrder(pname);
					
					Util.each(elementsToGo[index].dependency, function(v) {
						if(elementsToGo[v]) extractInOrder(v);
					});
					
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