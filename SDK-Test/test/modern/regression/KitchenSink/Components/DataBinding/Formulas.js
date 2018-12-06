/**
* @file Formulas.js
* @name Data binding/Formulas
* @created 2016/05/04
*/

describe("Data binding/Formulas", function() {
	/**
	* Custom variables for applicaiton
	**/
	var examplePrefix = "binding-formulas[$className=KitchenSink.view.binding.Formula]";
	var exampleUrlPostfix="#binding-formulas";

	var Dash = {
		form: function() {
			return ST.component(examplePrefix);
		},
		numberField: function() {
			return ST.component(examplePrefix + " spinnerfield[_label=Number]");
		},
		numberTimesTwoField: function() {
			return ST.component(examplePrefix + " textfield[_label=Times 2]");
		},
		numberTimesFourField: function() {
			return ST.component(examplePrefix + " textfield[_label=Times 4]");
		},
		contentText: function() {
			return ST.component(examplePrefix + " component[xtype=component]");
		}
	};

	var increase = function(component) {
		ST.element(examplePrefix + " " + component.xtype + "[_label=" + component._label + "] => div.x-spinuptrigger")
			.click();
	};
	var decrease = function(component) {
		ST.element(examplePrefix + " " + component.xtype + "[_label=" + component._label + "] => div.x-spindowntrigger")
			.click();
	};
	/**
	*
	**/
    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, "#kitchensink-view-binding-formula");
        ST.wait(function() {
            return Dash.form().visible();
        });
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-binding-formula");
    });
	/**
	*
	**/
	describe("Formulas example - EXTJS-24190 instead of 1 there is 0", function() {
		/**
		* Testing UI of the application
		**/
		it("should load correctly", function() {
			Dash.form()
				.visible();
            Lib.screenshot("UI_formulas");
		});

		/**
		* Tests specific for the application
		**/
		/**
		*
		**/
		it("should be able to increase Number from 1 to 2", function() {
			Dash.numberField()
				.visible()
				.and(function(numberField) {
					increase(numberField);
				})
                .wait(function(numberField){
                    return numberField.getValue() === 2;
                })
				.and(function(numberField) {
					expect(numberField.getValue()).toBe(2);
					//set good value, so it is not failing all after one fail (JZ)
                    numberField.setValue(2);
				});
			Dash.numberTimesTwoField()
				.visible()
				.and(function(numberTimesTwoField) {
					expect(numberTimesTwoField.getValue()).toBe("2 * 2 = 4");
				});
			Dash.numberTimesFourField()
				.visible()
				.and(function(numberTimesTwoField) {
					expect(numberTimesTwoField.getValue()).toBe("2 * 4 = 8");
				});
			Dash.numberField()
				.and(function(numberField) {
					decrease(numberField);
				});
		});
		/**
		*
		**/
		it("should be able to increase Number from 1 to 3", function() {
			Dash.numberField()
				.visible()
				.and(function(numberField) {
					increase(numberField);
					increase(numberField);
				})
				.wait(function(numberField){
					return numberField.getValue() === 3;
				})
				.and(function(numberField) {
					expect(numberField.getValue()).toBe(3);
                    //set good value, so it is not failing all after one fail (JZ)
                    numberField.setValue(3);
				});
			Dash.numberTimesTwoField()
				.visible()
				.and(function(numberTimesTwoField) {
					expect(numberTimesTwoField.getValue()).toBe("3 * 2 = 6");
				});
			Dash.numberTimesFourField()
				.visible()
				.and(function(numberTimesTwoField) {
					expect(numberTimesTwoField.getValue()).toBe("3 * 4 = 12");
				});
			Dash.numberField()
				.and(function(numberField) {
					decrease(numberField);
					decrease(numberField);
				});
		});
		/**
		*
		**/
		it("should be able to increase Number from 1 to 0", function() {
			Dash.numberField()
				.visible()
				.and(function(numberField) {
					decrease(numberField);
				})
                .wait(function(numberField){
                    return numberField.getValue() === 0;
                })
				.and(function(numberField) {
					expect(numberField.getValue()).toBe(0);
                    //set good value, so it is not failing all after one fail (JZ)
                    numberField.setValue(0);
				});
			Dash.numberTimesTwoField()
				.visible()
				.and(function(numberTimesTwoField) {
					expect(numberTimesTwoField.getValue()).toBe("0 * 2 = 0");
				});
			Dash.numberTimesFourField()
				.visible()
				.and(function(numberTimesTwoField) {
					expect(numberTimesTwoField.getValue()).toBe("0 * 4 = 0");
				});
			Dash.numberField()
				.and(function(numberField) {
					increase(numberField);
				});
		});
		/**
		*
		**/
		it("should be able to increase Number from 1 to -1", function() {
			Dash.numberField()
				.visible()
				.and(function(numberField) {
					decrease(numberField);
					decrease(numberField);
				})
                .wait(function(numberField){
                    return numberField.getValue() === -1;
                })
				.and(function(numberField) {
					expect(numberField.getValue()).toBe(-1);
                    //set good value, so it is not failing all after one fail (JZ)
                    numberField.setValue(-1);
				});
			Dash.numberTimesTwoField()
				.visible()
				.and(function(numberTimesTwoField) {
					expect(numberTimesTwoField.getValue()).toBe("-1 * 2 = -2");
				});
			Dash.numberTimesFourField()
				.visible()
				.and(function(numberTimesTwoField) {
					expect(numberTimesTwoField.getValue()).toBe("-1 * 4 = -4");
				});
			Dash.numberField()
				.and(function(numberField) {
					increase(numberField);
					increase(numberField);
				});
		});
		/**
		*
		**/
		it("should have correct text", function() {
			var expectedText = "As the field changes, the formula calculates the 2x and 4x values.";
			Dash.contentText()
				.visible()
				.and(function(text) {
					expect(text.instructions).toBe(expectedText);
				});
		});

        it("should open source window when clicked", function() {
            Lib.sourceClick("Formula");
        });
	});
});
