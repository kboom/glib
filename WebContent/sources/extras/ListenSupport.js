var ListenSupport = function(Module) {
	var log = Module["Logger"].createLog("ListenSupport module");
	var util = Module["util"];

	var toUppercase = function() {
		this.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
	        return $1.toUpperCase();
	    });
	};
	
	return {
		/**
		 * This method is called when the object holding property changes it to
		 * the newer value.
		 */
		change : function(source, value) {
			this["on" + source](value);
		},
		/**
		 * This method shall be called when object having this method wants to
		 * change property state. It might look odd, because it delegates action
		 * to method from same object. It is so because we want to avoid making
		 * everything in jQuery anonymous method that cannot be referred to or
		 * controlled.
		 * 
		 * $obj.on("view_event", changeProperty("propertyX", null/inline
		 * extraction))
		 * 
		 * function changePropertyX(value // none) {
		 * 	// model.setX(value) or value = $.css(...) and then
		 * }
		 */
		changeProperty : function(source, newValue) {
			var uppercasedSource = toUppercase.call(source);
			this["on" + uppercasedSource](newValue);
		}
	};
};