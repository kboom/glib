var SearchModel = {
	name : "SearchModel",
	definition : function(Clazz, System) {
		var log = System["logger"].createLog("SearchModel");
		var sp = Clazz.prototype.getSuperType().prototype;
		var ic = Clazz.prototype.getInstanceContext();
		var sc = Clazz.prototype.getStaticContext();
		
		var setSearchPhrase = ic["setSearchPhrase"] = function(phrase) {
			this._searchPhrase = phrase;
		};
		
		var search = ic["search"] = function() {
			var phrase = this._searchPhrase;
			if(this._searchEngine && this._searchEngine()) {
				this._onMatchAction && this._onMatchAction();
			}
			this._onSearchAction && this._onSearchAction(phrase);
		};
		
		var inputChanged = ic["inputChanged"] = function() {
			this._isDynamicSearchOn && this.search();
		};
		
		var setDynamicSearch = ic["setDynamicSearch"] = function(state) {
			this._isDynamicSearchOn = state;
		};
		
		var setOnSearchAction = ic["setOnSearchAction"] = function(fn) {
			this._onSearchAction = fn;
		};
		
		var setSearchEngine = ic["setSearchEngine"] = function(fn) {
			this._searchEngine = fn;
		};
		
		var setOnMatchAction = ic["setOnMatchAction"] = function(fn) {
			this._onMatchAction = fn;
		};
		
		return function() {
			this["_isDynamicSearchOn"] = true;
		};
	}
};