var ActivateModel = {
	name : "ActivateModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("ActivateModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var activate = ic["activate"] = function() {
			if(this._isActivationLocked) return;
			this._isActivated = true;
			this._onActivateAction && this._onActivateAction();
			this.fireChange.call(this, "activate");
		};
		
		var deactivate = ic["deactivate"] = function() {
			if(this._isActivationLocked) return;
			this._isActivated = false;	
			this._onDeactivateAction && this._onDeactivateAction();
			this.fireChange.call(this, "deactivate");
		};
		
		var isActivated = ic["isActivated"] = function() {
			return this._isActivated;
		};
		
		var setLockActivation = ic["setLockActivation"] = function(state) {
			this._isActivationLocked = state;
		};
		
		var setOnActivateAction = ic["setOnActivateAction"] = function(fn) {
			this._onActivateAction = fn;
		};
		
		var setOnDeactivateAction = ic["setOnDeactivateAction"] = function(fn) {
			this._onDeactivateAction = fn;
		};
		
		return function() {
			this["activate"] = activate;
			this["deactivate"] = deactivate;
			this["isActivated"] = isActivated;
			this["setLockActivation"] = setLockActivation;
			this["setOnActivateAction"] = setOnActivateAction;
			this["setOnDeactivateAction"] = setOnDeactivateAction;
			
			this["_isActivated"] = false;
			this["_isActivationLocked"] = false;
		};
	}
};