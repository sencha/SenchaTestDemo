/**
* @file Chained select.js
* @name Data binding/Chained select
* @created 2016/06/13
*/
describe("Data binding/Chained Select", function() {
	/**
	* Custom variables for applicaiton
	**/
	var examplePrefix = "binding-combo-chaining[$className=KitchenSink.view.binding.ChainedSelect]";
	var exampleUrlPostfix="#binding-combo-chaining";
	var statePickerValue;
	var countryPickerValue;


	var getItemByValue = function(value, nthList) {
		//Hardcoded wait 200 is needed for browsers for picker to be visible (JZ)
		//bug ORION-1323 is present, probably related EXTJS-23239
		// ST.wait(function(){
		// 	return Ext.DomQuery.select('.x-mask[id^=ext-element]').length > 0;
		// });
        Lib.waitOnAnimations().wait(200);

        var query = "";
        var i = 0;
        if(nthList === 0){
        	ST.component('binding-combo-chaining')
				.and(function(){
					var list1 = Ext.ComponentQuery.query('selectfield[label=Country]')[0].getStore().data.items;
					for(i = 0; i < list1.length; i++){
						var item = list1[i];
						if(item.id === value){
                            query = "list:nth-child(1) simplelistitem[recordIndex=" + i + "]";
                            return;
						}
					}
				});
        }
        else{
            ST.component('binding-combo-chaining')
                .and(function(){
                    var list2 = Ext.ComponentQuery.query('selectfield[label=States]')[0].getStore().data.items;
                    for(i = 0; i < list2.length; i++){
                        var item = list2[i];
                        if(item.data.state === value){
                            query = "list:nth-child(2) simplelistitem[recordIndex=" + i + "]";
                            return;
                        }
                    }
                });
        }
        if(!Lib.isPhone) {
            ST.component('binding-combo-chaining')
                .and(function(){
                    Lib.ghostClick(query, true);
                });
        }
        else {
            //todo if fails on phones
			var pickerSlot = 'pickerslot:visible';
			if(nthList === 0){
                pickerSlot += '[_displayField=name]';
			}
			else{
                pickerSlot += '[_displayField=state]';
			}
            ST.component('binding-combo-chaining')
                .and(function() {
                    ST.dataView(pickerSlot)
                        .itemAt(i)
                        .click();
                });
        }

		confirmSelection();

		// ST.wait(function(){
		// 	return Ext.DomQuery.select('.x-mask[id^=ext-element]').length === 0;
		// });
        Lib.waitOnAnimations();
	};

	var Dash = {

		form: function() {
			return ST.component(examplePrefix + " fieldset");
		},
		contentText: function() {
			return ST.component(examplePrefix + " fieldset component[xtype=component]");
		},
		doneButton: function() {
			return ST.component("picker:visible button[_text=Done]:visible");
		},
		cancelButton: function() {
			return ST.component("picker:visible button[_text=Cancel]:visible");
		},
		CountryPicker: {
			getSelf: function() {
				return ST.component("selectfield[_label=Country]");
			},
			getPicker: function () {
				ST.element("selectfield[_label=Country] => div.x-expandtrigger")
					.click();
			},
			getValue: function() {
				return ST.element("selectfield[_label=Country] => input.x-input-el");
			},
			pickItem: function(itemName) {
				getItemByValue(itemName, 0);
			}
		},
		StatePicker: {
			getSelf: function() {
				return ST.component("selectfield[_label=States]");
			},
			getPicker: function () {
				ST.element("selectfield[_label=States] => div.x-expandtrigger")
                    .click();
			},
			getValue: function() {
				return ST.element("selectfield[_label=States] => input.x-input-el");
			},
			pickItem: function(itemName) {
				getItemByValue(itemName, 1);
			}
		}
	};

	var confirmSelection = function() {
		if(Lib.isPhone) {
			Dash.doneButton()
				.click();
		}
	};
	/**
	*
	**/
    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, "#kitchensink-view-binding-chainedselect");
        ST.wait(function() {
            return Dash.form().visible();
        }).and(function(){
        	/*
        	wip
            Ext.first('selectfield:nth-child(1)').showPicker();
            Ext.first('selectfield:nth-child(1)').getPicker().hide();
            Ext.first('selectfield:nth-child(2)').showPicker();
            Ext.first('selectfield:nth-child(2)').getPicker().hide();
            */
		});

    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-binding-chainedselect");
    });

	/**
	*
	**/
	describe("Chained Select example", function() {
		/**
		* Testing UI of the application
		**/
		it("should load correctly", function() {
			Dash.form()
				.visible();
            Lib.screenshot("UI_chained_select");
		});
		/**
		* Tests specific for the application
		**/
		/**
		*
		**/
		describe("select Canada and Canadian state", function(){
			//Canada need to be picked just once (JZ)
			beforeAll(function(){
                Dash.CountryPicker.getPicker();
                Dash.CountryPicker.pickItem("Canada");
			});

            //restore initial state (JZ)
            afterAll(function(){
				Dash.CountryPicker.getPicker();
                Dash.CountryPicker.pickItem("USA");

                Dash.StatePicker.getPicker();
                Dash.StatePicker.pickItem("Alabama");
            });

			it("should be able to select Country", function() {

				//verify that Canada is picked
                Dash.CountryPicker.getSelf()
					.and(function() {
						countryPickerValue = Dash.CountryPicker.getValue();
                    })
                    .and(function() {
						expect(countryPickerValue.el.dom.value).toBe("Canada");
					});
                Lib.waitOnAnimations();

                Dash.CountryPicker.getSelf()
                    .and(function(selected) {
                        expect(selected.getInputValue()).toContain("Canada");
                    });
			});
			/**
			*
			**/
			it("should be able to select State", function() {
				Dash.StatePicker.getPicker();
				Dash.StatePicker.pickItem("Newfoundland and Labrador");

				Dash.StatePicker.getSelf()
					.and(function() {
						statePickerValue = Dash.StatePicker.getValue();
					})
					.and(function() {
						expect(statePickerValue.el.dom.value).toBe("Newfoundland and Labrador");
					});
                Lib.waitOnAnimations();

				Dash.StatePicker.getSelf()
                    .and(function(selected) {
                        expect(selected.getInputValue()).toContain("Newfoundland and Labrador");
                    });
			});
        });

		//We should test USA and American state too (JZ)
        describe("select USA and American state", function(){
            //USA need to be picked just once (JZ)
			//USA SHOULD be always picked in this moment, but just for sure code is provided (JZ)
            beforeAll(function(){
                Dash.CountryPicker.getPicker();
                Dash.CountryPicker.pickItem("USA");
            });

            //restore initial state (JZ)
            afterAll(function(){
                Dash.StatePicker.getPicker();
                Dash.StatePicker.pickItem("Alabama");
            });

            it("should be able to select Country", function() {
                Dash.CountryPicker.getSelf()
                    .and(function() {
                        countryPickerValue = Dash.CountryPicker.getValue();
                    })
                    .and(function() {
                        expect(countryPickerValue.el.dom.value).toBe("USA");
                    });
                Lib.waitOnAnimations();

                Dash.CountryPicker.getSelf()
                    .and(function(selected) {
                        expect(selected.getInputValue()).toContain("USA");
                    });
            });
            /**
             *
             **/
            it("should be able to select State", function() {
                Dash.StatePicker.getPicker();
                Dash.StatePicker.pickItem("Colorado");

                Dash.StatePicker.getSelf()
                    .and(function() {
                        statePickerValue = Dash.StatePicker.getValue();
                    })
                    .and(function() {
                        expect(statePickerValue.el.dom.value).toBe("Colorado");
                    });
                Lib.waitOnAnimations();

                Dash.StatePicker.getSelf()
                    .and(function(selected) {
                        expect(selected.getInputValue()).toContain("Colorado");
                    });
            });
        });

		/**
		*
		**/
		it("should have correct text", function() {
			var expectedText = "The states store contains all states, however it filters based upon the id of the selected record in the country field.";
			Dash.contentText()
				.visible()
				.and(function(text) {
					expect(text.getHtml()).toBe(expectedText);
				});
		});

		//Source click at the end, because it is sometimes failing (JZ)
        it("should open source window when clicked", function() {
            Lib.sourceClick("ChainedSelect");
        });
	});
});
