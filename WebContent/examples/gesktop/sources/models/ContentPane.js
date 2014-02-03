var ContentPaneModel = {
	name : "ContentPaneModel",
	parent : "PaneModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("ContentPaneModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var switchToWorkspace = ic["switchToWorkspace"] = function(item) {
			log.log("verbose", "switchToWorkspace");			
			var workspaces = this._workspaces;
			if(workspaces.indexOf(item) == -1) return;			
			var workspacesno = workspaces.length;
			this.fireChange("switchToWorkspace", item);
			for(var i = 0; i < workspacesno; i++) {
				if(workspaces[i] === item) {
					this.activeWorkspace = item;
					workspaces[i].onSummon();
				}
				else workspaces[i].onDismiss();
			}			
		};
		
		var addWorkspace = ic["addWorkspace"] = function(item) {
			log.log("verbose", "addWorkspace");
			var that = this;
			sp.addComponent.call(this, item);
			this._workspaces.push(item);
			item.onCreate();
			this.fireChange("addWorkspace", item);
		};
		
		var removeWorkspace = ic["removeWorkspace"] = function(item) {
			log.log("verbose", "removeTab");
			sp.removeComponent.call(this, item);
			var workspaces = this._workspaces;
			var workspaceIndex = workspaces.indexOf(item);
			this._workspaces.splice(workspaceIndex, 1);
			item.onDestroy();
			this.switchToWorkspace(workspaces[workspaces.length - 1]);
			this.fireChange("removeWorkspace", item);
		};
		
		var walkThroughWorkspaces = ic["walkThroughWorkspaces"] = function(fn, context) {
			var workspaces = this._workspaces;
			for(var i = 0; i < workspaces.length; i++) {
				fn.call(context || this, workspaces[i]);
			}
		};
		
		var getActiveWorkspace = ic["getActiveWorkspace"] = function() {
			return this.activeWorkspace;
		};
		
		return function() {
			this["_workspaces"] = [];
		};
	}
};