var WidgetModel = {
	name : "WidgetModel",
	parent : "ComponentModel",
	augment : [ "ActionableModel", "FocusableModel" ],
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("WidgetModel");
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		var sp = Clazz.prototype.getSuperType().prototype;
		
		/**
		 * System name of this component. It is not displayed.
		 */
		ic["setName"] = function(name) {
			this["name"] = name;
			this.fireChange("setName", name);
		};
		
		ic["setData"] = function(data) {
			this._data = data;
		}
		
		ic["getData"] = function() {
			return this._data || {};
		};
		
		return function() {

		};
	}
};