var FocusableModel = {
	name : "FocusableModel",
	parent : "ActivateModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("FocusableModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var focus = ic["focus"] = function() {
			if(this._lockFocus || this._isActivated) return;			
			this["_hasFocus"] = true;
			this.fireChange.call(this, "focus");
		};
		
		var focusLost = ic["focusLost"] = function() {
			if(this._lockFocus) return;			
			if(this._isActivated) return;
			this["_hasFocus"] = false;
			this.fireChange.call(this, "focusLost");
		};
		
		var hasFocus = ic["hasFocus"] = function() {
			return this["_hasFocus"] || false;
		};
		
		var lockFocus = ic["lockFocus"] = function(value) {
			this["_lockFocus"] = value;
		};	
		
		return function() {
			this["focus"] = focus;
			this["focusLost"] = focusLost;
			this["hasFocus"] = hasFocus;
			this["lockFocus"] = lockFocus;
			
			this["_lockFocus"] = false;
		};
	}
};