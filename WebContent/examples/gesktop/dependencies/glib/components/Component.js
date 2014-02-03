var Component = {
	name : "Component",
	onLoad : function() { },
	definition : function(System) {
		var Log = System["Logger"].createLog("Component module");
		var util = System["Util"];

		Log.log("verbose", "Component module is being loaded...");
		var Component = function() {
			/** class scope */
		};

		/**
		 * Creates a new class with specified interface from the base class.
		 */
		Component.prototype["createSubtype"] = function() {
			var SuperTypeProto = this;

			var Clazz = function(args) {
				util.each(args, function(value, key) {
					if(this[key] === undefined) this[key] = value;
				}, this);
				return this;
			};

			// inheritance
			var Surrogate = function() {
			};
			Surrogate.prototype = SuperTypeProto;
			Clazz.prototype = new Surrogate;
			Clazz.prototype.constructor = Clazz;

			// augmentation if provided
			var augment = Array.prototype.slice.call(arguments, 1);
			for ( var i = 0; i < arguments.length; i++) {
				util.augment(Clazz.prototype, arguments[i]);
			}

			// class awareness
			Clazz.prototype.getType = function() {
				return Clazz;
			};
			
			// class awareness
			Clazz.prototype.getSuperType = function() {
				return SuperTypeProto.getType();
			};

			return Clazz;
		};
		
		Component.prototype["augmentWith"] = function() {
			for(var i = 0; i < arguments.length; i++) {
				util.augment(this, arguments[i]);
			}
		};

		Component.prototype["getType"] = function() {
			return Component;
		};

		Component.prototype["getStaticContext"] = function() {
			return this.getType();
		};

		Component.prototype["getInstanceContext"] = function() {
			return this;
		};

		Component.prototype["setId"] = function(id) {
			this.id = id;
		};

		Component.prototype["getId"] = function() {
			return this.id || DEFAULT_ID;
		};

		Component.prototype["sealType"] = function(Clazz) {
			// remember the class / seals it?
			return Clazz;
		};

		return Component.prototype["sealType"](Component);
	}
};