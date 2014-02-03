/**
 * A general purpose container for content.
 */
var SimpleContentModel = {
	name : "SimpleContentModel",
	parent : "ContentModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("ContainerModel");
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		var sp = Clazz.prototype.getSuperType().prototype;
		
		ic["onSummon"] = function() {
			sp.onSummon.call(this);
			this.fireChange("onSummon");
		};
		
		ic["setContent"] = function(content) {
			this.content = content;
			this.fireChange("setContent", content);
		};
		
		return function() {
			this.content || (this.content = "");
		};
	}
};