/**
 * @file Two Way Formulas.js
 * @name Data binding/Two Way Formulas
 * @created 2016/05/04
 *
 * @updated 2017/07/18
 * tested on:
 * 		desktop:
 * 			Chrome 59
 * 			Edge 15
 * 			FF 54
 * 			IE 11
 * 			Opera 46
 * 		tablet:
 *			Android 4.4, 5
 *			iOS 10
 *			Edge 14
 *		phone:
 *			Android 4.4, 5, 7
 *			iOS 9
 *			Edge 15
 *
*/

describe("Data binding/Two Way Formulas", function() {
	/**
	* Custom variables for applicaiton
	**/
	var examplePrefix = "";
	var exampleUrlPostfix="#binding-two-way-formulas";

	var Dash = {
		form: function() {
			return ST.component(examplePrefix + " binding-two-way-formulas");
		},
		kelvinField: function() {
			return ST.component(examplePrefix + " spinnerfield[_label=Kelvin \u00b0]");
		},
		fahrenheitField: function() {
			return ST.component(examplePrefix + " spinnerfield[_label=Fahrenheit \u00b0]");
		},
		celciusField: function() {
			return ST.component(examplePrefix + " spinnerfield[_label=Celcius \u00b0]");
		}
	};

	var increase = function(component) {
		ST.element(examplePrefix + " " + component.xtype + "[_label=" + component._label + "] => div.x-spinuptrigger")
			.click()
	};
	var decrease = function(component) {
		ST.element(examplePrefix + " " + component.xtype + "[_label=" + component._label + "] => div.x-spindowntrigger")
			.click()
	};

	function compare(spinnerField, value){
        expect(spinnerField.getInputValue()).toBe("" + value);
        expect(Math.round(spinnerField.getValue()*10)/10).toBe(value);
	}

	/**
	*
	**/
    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, "binding-two-way-formulas");
        ST.wait(function() {
            return Dash.form().visible();
        });
    });
    afterAll(function(){
        Lib.afterAll("binding-two-way-formulas");
    });

	beforeEach(function() {
		var waitTime = 100;
		Dash.kelvinField()
			.wait(waitTime)
			.and(function(kelvin) {
				kelvin.setValue(300.1);
			});
		});
	/**
	*
	**/
	describe("Two way formulas example", function() {

		/**
		* Testing UI of the application
		**/
		it("should load correctly", function() {
			Dash.form()
				.visible()
				.and(function() {
					Lib.screenshot("UI_two_way_formula");
				});
		});
		it("should open source window when clicked", function() {
			Lib.sourceClick("TwoWayFormula");
		});
		/**
		*   Tests specific for the application
		**/
		it("should be able to increase value of Kelvin field by spinner", function() {
			Dash.kelvinField()
				.visible()
				.and(function(spinnerField) {
					increase(spinnerField);
				})
				.and(function(spinnerField) {
					compare(spinnerField, 300.2);
				});
			Dash.fahrenheitField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 80.7);
				});
			Dash.celciusField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 27.1);
				});
		});
		/**
		*
		**/
		it("should be able to decrease value of Kelvin field by spinner", function() {
			Dash.kelvinField()
				.visible()
				.and(function(spinnerField) {
					decrease(spinnerField);
				})
				.and(function(spinnerField) {
                    compare(spinnerField, 300.0);
				});
			Dash.fahrenheitField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 80.3);
				});
			Dash.celciusField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 26.9);
				});
		});
		/**
		*
		**/
		it("should be able to increase value of Fahrenheit field by spinner", function() {
			Dash.fahrenheitField()
				.visible()
				.and(function(spinnerField) {
					increase(spinnerField);
				})
				.and(function(spinnerField) {
                    compare(spinnerField, 80.6);
				});
			Dash.kelvinField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 300.2);
				});
			Dash.celciusField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 27);
				});
		});
		/**
		*
		**/
		it("should be able to decrease value of Fahrenheit field by spinner", function() {
			Dash.fahrenheitField()
				.visible()
				.and(function(spinnerField) {
					decrease(spinnerField);
				})
				.and(function(spinnerField) {
                    compare(spinnerField, 80.4);
				});
			Dash.kelvinField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 300);
				});
			Dash.celciusField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 26.9);
				});
		});
		/**
		*
		**/
		it("should be able to increase value of Celcius field by spinner", function() {
			Dash.celciusField()
				.visible()
				.and(function(spinnerField) {
					increase(spinnerField);
				})
				.and(function(spinnerField) {
                    compare(spinnerField, 27.1);
				});
			Dash.kelvinField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 300.2);
				});
			Dash.fahrenheitField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 80.7);
				});
		});
		/**
		*
		**/
		it("should be able to decrease value of Celcius field by spinner", function() {
			Dash.celciusField()
				.visible()
				.and(function(spinnerField) {
					decrease(spinnerField);
				})
				.and(function(spinnerField) {
                    compare(spinnerField, 26.9);
				});
			Dash.kelvinField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 300.0);
				});
			Dash.fahrenheitField()
				.visible()
				.and(function(spinnerField) {
                    compare(spinnerField, 80.3);
				});
		});
	});
});
