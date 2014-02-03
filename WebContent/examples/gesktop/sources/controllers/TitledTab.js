var TitledTabController = {
	name : "TitledTabController",
	parent : "TabController",
	augment : "TitledController",
	definition : function(System) {

		return function() {
			var model = this["model"] = System.create("TitledTabModel");
			var view = this["view"] = System.create("TitledTabView");

			var nameInputView = view["root"].find("input");


			nameInputView.on("dblclick", function() {
				model.makeFocused();
			});

			nameInputView.on("click", function() {
				model.makeSelected();
			});

			model.registerChangeListener("acceptInput", function() {
				nameInputView.removeAttr('readonly');
				nameInputView.focus();
			});

			model.registerChangeListener("ignoreInput", function() {
				nameInputView.attr('readonly', 'readonly');
				nameInputView.blur();
			});

			nameInputView.on("change", function() {
				var inputText = nameInputView.val();
				model.setTitle(inputText);
			});
		};
	}
};