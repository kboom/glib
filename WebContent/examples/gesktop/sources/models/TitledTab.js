var TitledTabModel = {
	name : "TitledTabModel",
	parent : "TabModel",
	augment : "TitledModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("TitledTabModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var startRenaming = ic["startRenaming"] = function() {
			this["beingRenamed"] = true;
		};
		
		var stopRenaming = ic["stopRenaming"] = function() {
			this["beingRenamed"] = false;
		};
		
		var acceptInput = ic["acceptInput"] = function() {
			this.fireChange("acceptInput");
		};
		
		var ignoreInput = ic["ignoreInput"] = function() {
			this.fireChange("ignoreInput");
		};
		
		var inputTitle = ic["inputTitle"] = function() {
			if(this.beingRenamed) this.acceptInput();
			else this.ignoreInput();
		};
		
		var makeSelected = ic["makeSelected"] = function() {
			this["state"] = "selected";
			this.ignoreInput();
		};
		
		var makeFocused = ic["makeFocused"] = function() {
			this["state"] = "focused";
			this.acceptInput();
		};
		
		return function() {
			
		};
	}
};
