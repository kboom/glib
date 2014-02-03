var CompositeComponentModel = {
	name : "CompositeComponentModel",
	parent : "ComponentModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("CompositeComponentModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		
		ic["addComponent"] = function(component, args) {
			log.log("verbose", "addComponent");
			this.childComponents.push(component);
			component.onCreate();
			return this;
		};
		
		ic["removeComponent"] = function(component, args) {
			log.log("verbose", "removeComponent");
			var childComponents = this.childComponents;
			var removeIndex = childComponents.indexOf(component);
			childComponents.splice(removeIndex, 1);	
			component.onDestroy();
			return this;
		};
		
		ic["getComponent"] = function(index) {
			return this.childComponents[index];
		};
		
		ic["onCreate"] = function() {
			sp.onCreate.apply(this, arguments);
			for(var i = 0; i < this.childComponents.length; i++) {
				var component = this.childComponents[i];
				component.onCreate.apply(component, arguments);				
			}
		};
		
		ic["onDestroy"] = function() {
			sp.onDestroy.apply(this, arguments);
			for(var i = 0; i < this.childComponents.length; i++) {
				var component = this.childComponents[i];
				component.onDestroy.apply(component, arguments);		
			}
		};
		
		ic["onSummon"] = function() {
			sp.onSummon.apply(this, arguments);
			for(var i = 0; i < this.childComponents.length; i++) {
				var component = this.childComponents[i];
				component.onSummon.apply(component, arguments);	
			}
		};
		
		ic["onDismiss"] = function() {
			sp.onDismiss.apply(this, arguments);
			for(var i = 0; i < this.childComponents.length; i++) {
				var component = this.childComponents[i];
				component.onDismiss.apply(component, arguments);	
			}
		};
		
		return function() {
			this["childComponents"] = [];
		};
	}
};