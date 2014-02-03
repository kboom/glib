var WindowModel = {
	name : "WindowModel",
	parent : "WidgetModel",
	augment : [ "DraggableModel", "TitledModel" ],
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("WindowModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();		

		
		var setContent = ic["setContent"] = function(content) {
			this["content"] = content;
			this.fireChange.call(this, "setContent", content);
		};
		
		var getContent = ic["getContent"] = function() {
			return this["content"];
		};
		
		var onCreate = ic["onCreate"] = function() {
			sp.onCreate.apply(this, arguments);
			this["content"] && this["content"].onCreate();
		};
		
		var onDestroy = ic["onDestroy"] = function() {
			sp.onDestroy.apply(this, arguments);
			this["content"] && this["content"].onDestroy();
		};
		
		var onSummon = ic["onSummon"] = function() {
			sp.onSummon.apply(this, arguments);
			this["content"] && this["content"].onSummon();
		};
		
		var onDismiss = ic["onDismiss"] = function() {
			sp.onDismiss.apply(this, arguments);	
			this["content"] && this["content"].onDismiss();
		};
		
		return function() {
			
		};
	}
};