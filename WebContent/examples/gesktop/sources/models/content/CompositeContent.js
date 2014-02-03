var CompositeContentModel = {
	name : "CompositeContentModel",
	augment : "ContainerModel",
	parent : "ContentModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("CompositeContent");
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		var sp = Clazz.prototype.getSuperType().prototype;
				
		ic["addContent"] = function(item) {
			log.log("verbose", "addMenuItem");
			this.content.push(item);			
			this.fireChange("addContent", item);
		};
		
		ic["removeContent"] = function(item) {
			log.log("verbose", "addMenuItem");
			this.content.remove(item);
			this.fireChange("removeContent", item);
		};	
		
		return function() {
			this["content"] = [];
		};		
		
	}
};