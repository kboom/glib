var LauncherModel = {
	name : "LauncherModel",
	parent : "WidgetModel",
	augment : "DraggableModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("LauncherModel");
		
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var setTitle = ic["setTitle"] = function(title) {
			this["title"] = title;
			this.fireChange("title", title);
		};
		
		var setDescription = ic["setDescription"] = function(description) {
			this["description"] = description;
			this.fireChange("description", description);
		};
		
		var setImage = ic["setImage"] = function (source) {
			this["imageSource"] = source;
			this.fireChange("imageSource", source);
		};
		
		var addKeywords = ic["addKeywords"] = function() {
			var keywords = this._keywords;
			for(var i = 0; i < arguments.length; i++) {
				keywords.push(arguments[i]);
			};
		};
		
		var matchesAnyKeyword = ic["matchesAnyKeyword"] = function() {
			var keywords = this._keywords;
			for(var i = 0; i < keywords.length; i++) {
				for(var j = 0; j < arguments.length; j++) {
					if(keywords[i] == arguments[j]) return true;
				}				
			};
			return false;
		};
		
		var matchesAnyPhrase = ic["matchesAnyPhrase"] = function() {
			var keywords = this._keywords;
			for(var i = 0; i < keywords.length; i++) {
				for(var j = 0; j < arguments.length; j++) {
					if(keywords[i].indexOf(arguments[j]) >= 0) return true;
				}				
			};
			return false;
		};
		
		return function() {
			this["_keywords"] = [];
		};
	}
};
