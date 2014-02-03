var WorkspaceModel = {
	name : "WorkspaceModel",
	parent : "PaneModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("WorkspaceModel");
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		var sp = Clazz.prototype.getSuperType().prototype;
		
		var addWidget = ic["addWidget"] = function(item) {
			this.addComponent(item, "widget");		
			this._widgets.push(item);
			this._state === "summoned" && item.onSummon();
			var that = this;
			item.registerChangeListener("close", function() {
				that.removeWidget(item);
			});
			this.fireChange("addWidget", item);
		};
		
		var removeWidget = ic["removeWidget"] = function(item) {
			var indexToRemove;
			if((indexToRemove = this._widgets.indexOf(item)) < 0) return;
			this.removeComponent(item, "widget");
			this._widgets.splice(indexToRemove, 1);
			this._state === "summoned" && item.onDismiss();
			this.fireChange("removeWidget", item);
		};		
		
		var walkThroughWidgets = ic["walkThroughWidgets"] = function(fn, context) {
			var widgets = this._widgets;
			for(var i = 0; i < widgets.length; i++) {
				fn.call(context || this, widgets[i]);
			}
		};
		
		var getWidgetCount = ic["getWidgetCount"] = function() {
			return this._widgets.length;
		};
		
		var onCreate = ic["onCreate"] = function() {
			sp.onCreate.apply(this, arguments);
		};
		
		var onDestroy = ic["onDestroy"] = function() {
			sp.onDestroy.apply(this, arguments);
		};
		
		var onSummon = ic["onSummon"] = function() {
			sp.onSummon.apply(this, arguments);
		};
		
		var onDismiss = ic["onDismiss"] = function() {
			sp.onDismiss.apply(this, arguments);	
		};
		
		return function() {
			this["_widgets"] = [];
		};
	}
};