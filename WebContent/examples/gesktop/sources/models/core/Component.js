var ComponentModel = {
	name : "ComponentModel",
	augment : "ChangeSupport",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("ComponentModel");
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		ic["getId"] = function() {
			return this["id"];
		};
		
		ic["getState"] = function() {
			return this._state;
		};
		
		ic["isDisposable"] = function() {
			return this._state === "destroyed" ? true : false;
		};
		
		ic["onCreate"] = function() {
			log.log("verbose", "onCreate");
			this._state = "created";
			this.fireChange("onCreate");
			this.onCreateCb && this.onCreateCb();
		};
		
		ic["onDestroy"] = function() {
			log.log("verbose", "onDestroy");
			this._state = "destroyed";
			this.fireChange("onDestroy");
			this.onDestroyCb && this.onDestroyCb();
		};
		
		ic["onSummon"] = function() {
			log.log("verbose", "onSummon");
			this._state = "summoned";
			this.fireChange("onSummon");
			this.onSummonCb && this.onSummonCb();
		};
		
		ic["onDismiss"] = function() {
			log.log("verbose", "onDismiss");
			this._state = "dismissed";
			this.fireChange("onDismiss");
			this.onDismissCb && this.onDismissCb();
		};
		
		ic["setOnCreateAction"] = function(fn) {
			this["onCreateCb"] = fn;
		};
		
		ic["setOnDestroyAction"] = function(fn) {
			this["onDestroyCb"] = fn;
		};
		
		ic["setOnSummonAction"] = function(fn) {
			this["onSummonCb"] = fn;
		};
		
		ic["setOnDismissAction"] = function(fn) {
			this["onDismissCb"] = fn;
		};
		
		return function() {
			
		};
	}
};