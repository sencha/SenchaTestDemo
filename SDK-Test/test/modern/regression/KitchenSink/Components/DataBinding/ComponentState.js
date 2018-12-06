/**
* @file Component state.js
* @name Data binding/Component state
* @created 2016/06/13
*/
describe("Data binding/Component State", function() {
	/**
	* Custom variables for applicaiton
	**/
	var examplePrefix = "binding-component-state[$className=KitchenSink.view.binding.ComponentState]";
	var exampleUrlPostfix="#binding-component-state";

	var input = "There is no place for the wicked.";

	var Dash = {
		form: function() {
			return ST.component(examplePrefix);
		},
		contentText: function() {
			return ST.component(examplePrefix + " component[xtype=component]");
		},
		isAdminCheckBox: function() {
			return ST.checkBox(examplePrefix + " checkboxfield");
		},
		AdminKeyField: {
			getSelf: function() {
				return ST.textField(examplePrefix + " textfield[_label=Admin Key]");
			},
			clearText: function() {
				Lib.ghostClick(examplePrefix + " textfield[_label=Admin Key] => div.x-cleartrigger");
			}
		},
		PriorityToggleField: {
			getSelf: function() {
				return ST.textField(examplePrefix + " togglefield");
			},
			getToggle: function() {
				return ST.element(examplePrefix + " togglefield => div.x-toggleslider");
			}
		},
		HighPriorityCodeField: {
			getSelf: function() {
				return ST.textField(examplePrefix + " textfield[_label=High Priority Code]");
			},
			clearText: function() {
				ST.textField(examplePrefix + " textfield[_label=High Priority Code] => div.x-cleartrigger");
			}
		}
	};
	/**
	*
	**/
    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix);
        ST.wait(function() {
            return Dash.form().visible();
        });
    });
    afterAll(function(){
        Lib.afterAll(Dash.form());
    });

	/**
		* Testing UI of the application
		**/
		it("should load correctly", function() {
			Dash.form()
				.visible();
			Lib.screenshot("UI_formulas");
		});

		/**
		*
		**/
		it("should have correct text", function() {
			var expectedText = "The admin key field is disabled when the admin checkbox is not checked. The high priority field is hidden when the priority is toggled.";
			Dash.contentText()
				.visible()
				.and(function(text) {
					expect(text.getHtml()).toBe(expectedText);
				});
		});

	/**
	*
	**/
	describe("Admin Key test", function() {
		
		it("should have disabled \"Admin Key\" field on unchecked checkbox component", function() {
			Dash.isAdminCheckBox()
				.text("Is Admin")
				.unchecked()
				.and(function() {
					Dash.AdminKeyField
						.getSelf()
						.disabled()
						.valueEmpty();
				});
		});
		/**
		*
		**/
		it("should enable \"Admin Key\" field on checked checkbox component", function() {
			Dash.isAdminCheckBox()
				.check()
				.checked()
				.and(function() {
					Dash.AdminKeyField
						.getSelf()
						.enabled()
						.valueEmpty();
				});

			Dash.isAdminCheckBox()
				.uncheck();
		});
		/**
		*
		**/
		it("should have working \"Admin Key\" textfield", function() {
			Dash.isAdminCheckBox()
				.check();

			Dash.AdminKeyField
				.getSelf()
				.setValue(input)
				.and(function(textField) {
					expect(textField.getValue()).toBe(input);
				});

			Dash.isAdminCheckBox()
				.uncheck();
		});
		/**
		*
		**/
		it("should preserved \"Admin Key\" preserved on unchecked checkbox component", function() {
			Dash.isAdminCheckBox()
				.check();

			Dash.AdminKeyField
				.getSelf()
				.setValue(input);

			Dash.isAdminCheckBox()
				.uncheck()
				.unchecked()
				.and(function() {
					Dash.AdminKeyField
						.getSelf()
						.disabled()
						.value(input);
				});
		});
		/**
		*
		**/
		it("should clear text in \"Admin Key\" textfield - EXTJS-25500", function() {
			Dash.isAdminCheckBox()
				.check();

			Dash.AdminKeyField
				.getSelf()
				.setValue(input);

			Dash.AdminKeyField
				.clearText();

			Dash.AdminKeyField
				.getSelf()
				.valueEmpty();
		});

	});
		/**
		*
		**/

	describe("Priority test", function() {

		it("should toggle togglefield on/off", function() {
			Dash.PriorityToggleField
				.getToggle()
				.and(function(toggle) {
					toggle.hasCls("x-off");
				})
				.click()
				.and(function(toggle) {
					toggle.hasCls("x-on");
				})
				.click()
				.and(function(toggle) {
					toggle.hasCls("x-off");
				})
		});
		/**
		*
		**/
		it("should have \"High Priority Code\" hidden when toggle component is toggle component is in \"off\" state", function() {
			Dash.HighPriorityCodeField
				.getSelf()
				.hidden()
				.valueEmpty();
		});
		/**
		*
		**/
		it("should have \"High Priority Code\" visible when toggle component is toggle component is in \"on\" state", function() {
			Dash.PriorityToggleField
				.getToggle()
				.click();

			Dash.HighPriorityCodeField
				.getSelf()
				.visible()
				.valueEmpty();

			Dash.PriorityToggleField
				.getToggle()
				.click();
		});
		/**
		*
		**/
		it("should have working \"High Priority Code\" textfield", function() {
			Dash.PriorityToggleField
				.getToggle()
				.click();

			Dash.HighPriorityCodeField
				.getSelf()
				.setValue(input)
				.and(function(textField) {
					expect(textField.getValue()).toBe(input);
				});

			Dash.PriorityToggleField
				.getToggle()
				.click();
		});
		/**
		*
		**/
		it("should preserved \"High Priority Code\" preserved when using toggle component", function() {
			Dash.PriorityToggleField
				.getToggle()
				.click();

			Dash.HighPriorityCodeField
				.getSelf()
				.setValue(input);	

			Dash.PriorityToggleField
				.getToggle()
				.click();

			Dash.HighPriorityCodeField
				.getSelf()
				.and(function(textField) {
					expect(textField.getValue()).toBe(input);
				});
		});
		
	});

    it("should open source window when clicked", function() {
        Lib.sourceClick("ComponentState");
    });

});
