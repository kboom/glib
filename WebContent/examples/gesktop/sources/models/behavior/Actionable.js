/*
 * A general interface for assigning actions. All actions are processed here, even
 * those connected to dragging (onMousePressed -> onStartDragging) - widget can remain stationary
 * even though it implements needed parameters
 * 
 * ActionTriggers DO NOT possess any logic. What they do is trigger some actions and provide user with some callback abilities
 * ActionTriggers do not have methods except of execute, every field is to be accessed directly
 */
var ActionableModel = {
	name : "ActionableModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("ActionableModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var setTargetAction = ic["setTargetAction"] = function(actionName, actionCallback, element) {
			var actions = this["actions"];
			var action = actions[actionName] ? actions[actionName] : (actions[actionName] = {});		
			action["callback"] = actionCallback.bind(this);
			action["element"] = element || "root";
			this.fireChange.call(this, "setTargetAction", actionName);
		};
		
		var getTargetAction = ic["getTargetAction"] = function(actionName) {
			return this["actions"][actionName];
		};
		
		return function() {
			this["setTargetAction"] = setTargetAction;
			this["getTargetAction"] = getTargetAction;
			
			this["actions"] = {};
		};
	}
};