/**
* @file Two Way.js
* @name Data binding/Two Way
* @created 2016/05/03
*/

describe("Data binding/Two Way", function() {
	/**
	* Custom variables for applicaiton
	**/
	var examplePrefix = "binding-two-way";
	var exampleUrlPostfix = "#binding-two-way";
	var input = "Test title";


	var Dash = {
		form: function() {
			return ST.component(examplePrefix);
		},
		randomizeButton: function() {
			return ST.button(examplePrefix + " button");
		},
		randomizedTextField: function() {
			return ST.textField(examplePrefix + " textfield");
		},
		randomizedTitle: function() {
			return ST.component(examplePrefix + " titlebar title");
		}
	};
	/**
	*
	**/
    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, "#kitchensink-view-binding-twoway");
        ST.wait(function() {
            return Dash.form().visible();
        });
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-binding-twoway");
    });
	/**
	*
	**/
	describe("Two way example", function() {
		/**
		* Testing UI of the application
		**/
		it("should load correctly", function() {
			Dash.form()
				.visible();
            Lib.screenshot("UI_two_way");
		});

		/**
		* Tests specific for the application
		**/
		/**
		*
		**/
		it("should have correct title", function() {
			Dash.randomizedTextField()
				.visible()
				.setValue(input)
				.and(function(textField) {
					expect(textField.getValue()).toBe(input);
				});
			Dash.randomizedTitle()
				.visible()
				.wait(function(title) {
					return title.getHtml() == input;
				})
				.and(function(title) {
					expect(title.getHtml()).toBe(input);
				});
		});
		/**
		*
		**/
		it("should be able to generate random Title by button", function() {
			Dash.randomizeButton()
				.click();
			Dash.randomizedTextField()
				.and(function(textField) {
					var randomValue = Ext.ComponentQuery.query(examplePrefix + " titlebar title")[0].getTitle();
					expect(textField.getValue()).toBe(randomValue);
				});
		});
        it("should open source window when clicked", function() {
            Lib.sourceClick("TwoWay");
        });
	});
});
