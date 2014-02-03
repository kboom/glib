var SearchController = {
	name : "SearchController",
	definition : function(System) {
		
		return function() {
			var model = this["model"] = System.create("SearchModel");
			var view = this["view"] = System.create("SearchView");
			
			var searchInputView = view["input"];
			var searchTriggerView = view["trigger"];
			
			searchInputView.on("change", function() {
				var inputText = searchInputView.val();
				model.setSearchPhrase(inputText);
				model.setSearchPhrase(inputText);				
				model.inputChanged();				
			});
			
			searchTriggerView.on("click", function() {
				model.search();
			});
			
			searchInputView.keypress(function (e) {
				if (e.which == 13) {
					 e.preventDefault();				  
					 model.search();
					 return false;
				}				
			});
			
			searchInputView.keyup(function() {
				searchInputView.trigger("change");	
			});
			
		};
	}
};