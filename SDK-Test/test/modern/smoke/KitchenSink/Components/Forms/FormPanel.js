/**
 * @file FormPanel.js
 * @name UI/Forms/FormPanel
 * @created 2016/04/26
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
describe('FormPanel', function(){
    var colorVals = ['red','blue','green', 'purple'];
    var prefix = '#kitchensink-view-forms-formpanel ';
    var Form = {
        textField : function(name) {
            // need to use element as workaround because ST returns div element instead of input in Modern toolkit
            return ST.element(prefix + 'fieldset field[name='+name+'] => input');
        },
        //identifies field by its name [value] is not mandatory and cen be null
        fieldCmp : function (name,value) {
            return ST.field(prefix + 'fieldset field[name='+name+']'+(value?'[value='+value+']':''));
        },
        // type should be 1 for plus button and 0 for minus button
        spinnerButton : function (type){
            return ST.element(prefix + 'fieldset field[name=spinner] => div.x-spin'+(type?'up':'down')+'trigger' );
        },
        radioField : function(name,value) {
            return ST.element(prefix + 'fieldset radiofield[name='+name+'][value='+value+'] => input.x-input-el');
        },
        backButton : function () {
            return ST.button(prefix + 'button[text=Back][ui=back]:last');
        },
        checkboxFieldInput : function(){
            return ST.element(prefix + 'fieldset checkboxfield[name=cool] => input.x-input-el');
        },
        textAreaField : function(name){
            return ST.element(prefix + 'fieldset textareafield[name='+name+'] => textarea');
        },
        radioFieldNotSelected : function (name,i){
            it('Radio field '+colorVals[i]+' is not selected', function () {
                Form.fieldCmp(name,colorVals[i]).and(function(cmp){
                    var isSelected = cmp.isChecked();
                    expect(isSelected).toBe(false);
                });
            });
        },
        selectRadioFieldAndValidate : function (name, i) {
            describe(colorVals[i]+' radio field', function () {
                it('should select on click', function(){
                    Form.radioField(name,colorVals[i])
                        .click();
                    Form.fieldCmp(name,colorVals[i])
                        .wait(function(cmp){
                            return cmp.isChecked();
                        })
                        .and(function(cmp){
                            var isSelected = cmp.isChecked();
                            expect(isSelected).toBe(true);
                        });
                });
                describe('should deselect remaining radio fields when clicked',function(){
                    for(var j = 0;j<colorVals.length; j++){
                        if(j!==i){
                            Form.radioFieldNotSelected(name,j);
                        }
                    }
                });

            });
        },
        deselectRadioField : function(name,i){
            Form.fieldCmp(name,colorVals[i])
                .and(function(cmp){
                    cmp.uncheck();
                });
        },
        disableBtn : function() {
            return ST.button(prefix + 'button[text="Disable fields"]');
        },
        enableBtn : function() {
            return ST.button(prefix + 'button[text="Enable fields"]');
        },
        resetBtn : function() {
            return ST.button(prefix + 'button[text="Reset"]');
        },
        fieldset : function(i){
            i = i||1;
            return ST.component(prefix + '#fieldset'+i);
        },
        afterEachClearText : function(name){
            Form.fieldCmp(name)
                .visible()
                .setValue('')
                .and(function (el) {
                    // Workaround due to EXTJS-25982
                    el.setInputValue('');
                })
                .wait(function(el){
                    // Workaround due to EXTJS-25982
                    return el.getInputValue() === '';
                });
        }
    };

    beforeAll(function() {
        Lib.beforeAll("#form-panel", "#kitchensink-view-forms-formpanel");
        Form.textField('name')
            .visible()
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-forms-formpanel");
    });

    it('Example should load correctly', function () {
        Form.textField('name')
            .visible();
        //don't know if it is workin, it is not properly documented and tested (JZ)
        //there is different because of date
        //this maybe could be removed, because new screenshot comparison is provided after changing date (JZ)
        pending('pending due to changing example every day');
        Lib.screenshot('Forms_FormPanel', 10);
    });
    describe('Personal Info fieldset', function(){
        describe('field', function(){
            function typeAndValidate(name,text){
                Form.textField(name)
                    .click()
                    .type(text)
                    .wait(function(el){
                        return el.dom.value === text;
                    })
                    .and(function(field){
                        var val = field.dom.value;
                        expect(val).toBe(text);
                    });
            }
            function clearAndValidate(name,text){
                Form.textField(name)
                    .click()
                    .type(text)
                    .wait(function(el){
                        return el.dom.value === text;
                    });
                ST.component(prefix + 'fieldset field[name='+name+'] => div.x-cleartrigger').click();
                Form.textField(name)
                    .wait(function(el){
                        return el.dom.value === '';
                    })
                    .and(function(field){
                        var val = field.dom.value;
                        expect(val).toBe('');
                        field.dom.value = '';
                    });
            }
            describe('"edit focused field - EXTJS-25982', function () {
                var name = 'name',
                    text = 'Martin';
                afterAll(function () {
                    Form.afterEachClearText(name);
                });
                it('should update value when field is focused', function () {
                    Form.fieldCmp(name).setValue('test')
                        .click()
                        .type({text : text, caret : 4})
                        .value('test' + text)
                        .setValue('');
                    Form.textField(name)
                        .wait(function(el){
                            return el.dom.value === '';
                        })
                        .and(function(field){
                            var val = field.dom.value;
                            expect(val).toBe('');
                            field.dom.value = '';
                        });
                });
            });
            describe('"Name"', function(){
                var name = 'name',
                    text = 'Martin';
                afterEach(function () {
                    Form.afterEachClearText(name);
                });
                it('should accept text', function () {
                    typeAndValidate(name,text);
                });
                it('should get empty when clicked on clear icon', function () {
                    clearAndValidate(name, text);
                });
            });
            describe('"Password"', function () {
                var name = 'password',
                    text = 'pass';
                afterEach(function () {
                    Form.afterEachClearText(name);
                });
                it('should accept text', function () {
                    typeAndValidate(name,text);
                });
                it('should get empty when clicked on clear icon', function () {
                    clearAndValidate(name, text);
                });
            });
            describe('"Email"', function () {
                var name = 'email',
                    text = 'sencha@sencha.com';
                afterEach(function () {
                    Form.afterEachClearText(name);
                });
                it('should accept text', function () {
                    typeAndValidate(name,text);
                });
                it('should get empty when clicked on clear icon', function () {
                    clearAndValidate(name, text);
                });
            });
            describe('"Url"', function () {
                var name = 'url',
                    text = 'www.sencha.com';
                afterEach(function () {
                    Form.afterEachClearText(name);
                });
                it('should accept text', function () {
                    typeAndValidate(name,text);
                });
                it('should get empty when clicked on clear icon', function () {
                    clearAndValidate(name, text);
                });
            });
            describe('"Spinner"', function () {
                var name = 'spinner';
                beforeAll(function(){
                    Lib.scrollToElement(prefix + 'fieldset field[name='+name+']', "formpanel");
                });
                afterEach(function () {
                    Form.fieldCmp(name).setValue(0);
                });
                it('should increase value when clicking on + button', function () {
                    Form.spinnerButton(1)
                        .click();
                    Form.fieldCmp(name)
                        .value(1)
                        .and(function(field){
                            var val = field.getValue();
                            expect(val).toBe(1);
                        });
                });
                it('should decrease value when clicking on - button', function () {
                    Form.spinnerButton(0)
                        .click();
                    Form.fieldCmp(name)
                        // min max value is set so going negative results in value of 10
                        .value(10)
                        .and(function(field){
                            var val = field.getValue();
                            expect(val).toBe(10);
                        });
                });
            });
            describe('"Cool checkbox"', function(){
                var name = 'cool';
                beforeAll(function(){
                    Lib.scrollToElement(prefix + 'fieldset field[name='+name+']', "formpanel");
                });
                afterEach(function () {
                    Form.fieldCmp(name)
                        .and(function(cmp){
                            cmp.setChecked(false);
                        })
                        .and(function(cmp) {
                            return !cmp.isChecked();
                        });
                });
                it('should check if previously unchecked', function () {
                    //Form.fieldCmp(name)
                    Form.checkboxFieldInput()
                        .click();
                    Form.fieldCmp(name)
                        .wait(function(cmp){
                            return cmp.isChecked();
                        })
                        .and(function(field){
                            var val = field.isChecked();
                            expect(val).toBe(true);
                        });
                });
                it('should uncheck if previously checked', function () {
                    Form.checkboxFieldInput()
                        .click();
                    Form.fieldCmp(name)
                        .wait(function(cmp){
                            return cmp.isChecked();
                        });
                    Form.checkboxFieldInput()
                        .click();
                    Form.fieldCmp(name)
                        .wait(function(cmp){
                            return !cmp.isChecked();
                        })
                        .and(function(field){
                            var val = field.isChecked();
                            expect(val).toBe(false);
                        });
                });
            });
            // @TODO cratee CommonLib for datefield handling
            // disable datepicker tests due to component changes in 6.5
            /*describe('"Start Date"', function () {
                var DatePicker = {
                    picker : function(){
                        return ST.component('datepicker');
                    },
                    datePickerTrigger : function () {
                        return ST.element('datepickerfield => div.x-datetrigger');
                    },
                    //name can be month, day, year
                    pickerSlot : function (name) {
                        return ST.component('pickerslot[name='+name+']');
                    },
                    pickerCancelButton : function () {
                        //Wait are important here, because without it sometimes datepicker is not closed and the rest of the test is failing
                        ST.button('datepicker button[text=Cancel]')
                            .click()
                            .destroyed();
                    },
                    pickerDoneButton : function () {
                        ST.button('datepicker button[text=Done]')
                            .click()
                            .destroyed();
                    },
                    pickerSlotItem : function(name) {
                        return ST.element('pickerslot[name='+name+'] => div.x-picker-item');
                    },
                    selectValueInPicker : function(name,index){

                        // It might happen that slot is visible but slot items are not, so need to wait for those prior to  click.
                        DatePicker.pickerSlotItem(name).visible();
                        DatePicker.pickerSlot(name)
                            .visible()
                            .and(function(cmp){
                                //need to scroll to desired item to ensure it's visible before click
                                var item = cmp.getItemAt(index);
                                item = Ext.get(item);
                                cmp.scrollToItem(item);
                                ST.element(item).click();
                            })
                    },
                    // performs selecting item at index from slot identified by name and checks for given value
                    selectValueAtIndexAndValidate : function (name, index, value) {
                        DatePicker.pickerSlotItem(name).visible();
                        DatePicker.pickerSlot(name)
                            .visible()
                            .and(function(cmp){
                                //need to scroll to desired item to ensure it's visible before click
                                var item = cmp.getItemAt(index);
                                item = Ext.get(item);
                                cmp.scrollToItem(item);
                                ST.element(item).click();
                            })
                            .wait(function(cmp){
                                return cmp.getSelection().get('text') === value;
                            })
                            .and(function(cmp){
                                var val = cmp.getSelection().get('text');
                                expect(val).toBe(value);
                            });

                    }
                };
                var name = 'date';
                beforeAll(function(){
                    Lib.scrollToElement(prefix + 'fieldset field[name='+name+']', "formpanel");
                });
                it('should show picker when clicked', function () {
                    DatePicker.datePickerTrigger().click();
                    DatePicker.picker().visible();
                    //tear down - close picker
                    DatePicker.pickerCancelButton();
                });
                describe('picker', function(){
                    beforeAll(function () {
                        DatePicker.datePickerTrigger().click();
                        DatePicker.picker().visible();
                    });
                    afterAll(function () {
                        DatePicker.pickerCancelButton();
                    });
                    it('should be able to select month',function () {
                        DatePicker.selectValueAtIndexAndValidate('month',0,'January');
                    });
                    it('should be able to select day',function () {
                        DatePicker.selectValueAtIndexAndValidate('day',0,1);
                    });
                    it('should be able to select year',function () {
                        DatePicker.selectValueAtIndexAndValidate('year',0,1990);
                    });
                });
                it('should be able to pick date', function () {
                    DatePicker.datePickerTrigger().click();
                    DatePicker.picker().visible();
                    DatePicker.pickerSlotItem('month').visible();
                    // pick date 7/7/2007 and click Done button
                    DatePicker.selectValueInPicker('month',6);
                    DatePicker.selectValueInPicker('day',6);
                    DatePicker.selectValueInPicker('year',17);
                    DatePicker.pickerDoneButton();
                    Form.fieldCmp(name)
                        .wait(function(cmp){
                            var date = new Date(2007, 6, 7);
                            return (date-cmp.getValue()) === 0;
                        })
                        .and(function(cmp){
                            var val = cmp.getValue();
                            var expVal = new Date(2007, 6, 7);
                            expect(val-expVal).toBe(0);
                        });
                });
                it('should reset value when clicked Cancel', function () {
                    // set up right expected value
                    DatePicker.datePickerTrigger().click();
                    Form.fieldCmp(name)
                        .and(function(){
                            DatePicker.pickerSlotItem('month').visible();
                            DatePicker.pickerSlotItem('day').visible();
                            DatePicker.pickerSlotItem('year').visible();
                            DatePicker.picker().visible()
                                .and(function(cmp){
                                    cmp.setValue(new Date(2007, 6, 7));
                                })
                                .wait(function(cmp){
                                    var date = new Date(2007, 6, 7);
                                    return (date-cmp.getValue()) === 0;
                                });
                        });
                    // pick date 1/1/1990 and click Cancel button
                    DatePicker.selectValueInPicker('month',0);
                    DatePicker.selectValueInPicker('day',0);
                    DatePicker.selectValueInPicker('year',0);
                    DatePicker.pickerCancelButton();
                    Form.fieldCmp(name)
                        .wait(function(cmp){
                            var date = new Date(2007, 6, 7);
                            return (date-cmp.getValue()) === 0;
                        })
                        .and(function(cmp){
                            var val = cmp.getValue();
                            var expVal = new Date(2007, 6, 7);
                            expect(val-expVal).toBe(0);
                        });
                });

            });*/

            describe('"Rank" picker', function(){
                var name = 'rank';
                var Picker = {
                    // will return list or picker based on device
                    picker : function(){
                        var pId = Ext.first('form-panel selectfield[name=rank]').getPicker().getId();
                        return ST.component('#'+ pId);
                    },
                    pickerTrigger : function () {
                        return ST.element('selectfield[name=rank] => div.x-expandtrigger');
                    },
                    isPhone : function () {
                        return ST.os.deviceType === 'Phone';
                    },
                    pickerCancelButton : function () {
                        ST.button('picker:visible button[text=Cancel]').click();
                    },
                    pickerDoneButton : function(){
                        ST.button('picker:visible button[text=Done]').click();
                    },
                    selectValueInPickerSlot : function (index) {
                        if(Picker.isPhone()){
                            ST.component('pickerslot:visible')
                                .and(function(cmp){
                                    //need to scroll to desired item to ensure it's visible before click
                                    var item = cmp.getItemAt(index);
                                    item = Ext.get(item);
                                    cmp.scrollToItem(item);
                                    ST.element(item)
                                        .click();
                                    Picker.pickerDoneButton();
                                });

                        }else{
                            Picker.picker().visible()
                                .and(function (cmp) {
                                    var model = cmp.getStore().getAt(index);
                                    //cmp.scrollToRecord(model);
                                    var name = model.get('text');
                                    Lib.ghostClick('simplelistitem:nth-child('+(index+1)+')', true);
                                });
                        }
                    }
                };
                afterEach(function () {
                    Picker.picker().and(function(picker){picker.hide();});
                });
                it('should show picker when clicked', function () {
                    //navigate to "Rank" picker for chance to be visible (bug explored in iOS 7 iPhone)
                    Lib.scrollToElement(prefix + 'fieldset field[name='+name+']', "formpanel");
                    Picker.pickerTrigger().click();
                    Picker.picker().visible();
                    //tear down - click Cancel on phone or click out of list on other devices
                    if(Picker.isPhone()){
                        Picker.pickerCancelButton();
                    }else{
                        ST.absent('//div[@class="x-mask"]');
                    }
                });
                it('should be able to select Apprentice value - ORION-1662', function () {
                    Picker.pickerTrigger().click();
                    Picker.picker().visible();
                    Picker.selectValueInPickerSlot(2, 'text');
                    Form.fieldCmp(name)
                        .wait(function(comp){
                            return comp.getValue() === 'apprentice';
                        })
                        .and(function (comp) {
                            var val = comp.getValue();
                            expect(val).toBe('apprentice');
                        });
                });
            });

            describe('"State" picker', function(){
                var label = 'State';
                var Picker = {
                    // will return list or picker based on device
                    picker : function(){
                        var pId = Ext.first('form-panel combobox[label=State]').getPicker().getId();
                        return ST.component('#'+ pId);
                    },
                    pickerTrigger : function () {
                        return ST.element('combobox => div.x-expandtrigger');
                    },
                    isPhone : function () {
                        return ST.os.deviceType === 'Phone';
                    },
                    pickerCancelButton : function () {
                        ST.button('picker:visible button[text=Cancel]').click();
                    },
                    pickerDoneButton : function(){
                        ST.button('picker:visible button[text=Done]').click();
                    },
                    selectValueInPickerSlot : function (index, displayField) {
                        if(Picker.isPhone()){
                            ST.component('pickerslot:visible[_displayField=' + displayField +']')
                                .and(function(cmp){
                                    //need to scroll to desired item to ensure it's visible before click
                                    var item = cmp.getItemAt(index);
                                    item = Ext.get(item);
                                    cmp.scrollToItem(item);
                                    ST.element(item)
                                        .click();
                                    Picker.pickerDoneButton();
                                });

                        }else{
                            Picker.picker().visible()
                                .and(function (cmp) {
                                    var model = cmp.getStore().getAt(index);
                                    //cmp.scrollToRecord(model);
                                    var name = model.get('state');
                                    Lib.ghostClick('simplelistitem{getRecord().get("state")==="'+name+'"}', true);
                                });
                        }
                    }
                };
                afterEach(function () {
                    Picker.picker().and(function(picker){picker.hide();});
                });
                it('should show picker when clicked', function () {
                    //navigate to "State" picker for chance to be visible (bug explored in iOS 7 iPhone)
                    Lib.scrollToElement(prefix + 'fieldset field[label='+label+']', "formpanel");
                    Picker.pickerTrigger().click()
                        .and(function(){
                            Picker.picker().visible();
                        });
                    //tear down - click Cancel on phone or click out of list on other devices
                    if(Picker.isPhone()){
                        Picker.pickerCancelButton();
                    }else{
                        Picker.pickerTrigger().click()
                    }
                });
                it('should be able to select Alabama value - ORION-1662', function () {
                    Picker.pickerTrigger().click()
                        .and(function(){
                            Picker.picker().visible();
                        });
                    Picker.selectValueInPickerSlot(0, 'state');
                    ST.field(prefix + 'fieldset field[label='+label+']')
                        .wait(function(comp){
                            return comp.getValue() === 'AL';
                        })
                        .and(function (comp) {
                            var val = comp.getValue();
                            expect(val).toBe('AL');
                        });
                });
            });

            describe('"Bio" text area', function(){
                var name = 'bio',
                    text = 'Martin';
                beforeAll(function(){
                    Lib.scrollToElement(prefix + 'fieldset field[name='+name+']', "formpanel");
                });
                afterEach(function () {
                    Form.afterEachClearText(name);
                });
                it('should accept text', function () {
                    Form.textAreaField(name)
                        .click()
                        .type(text)
                        .wait(function(el){
                            return el.dom.value === text;
                        })
                        .and(function(field){
                            var val = field.dom.value;
                            expect(val).toBe(text);
                        });
                });
            });
        });
    });
    describe('Favorite Color fieldset', function(){
        beforeAll(function(){
            //need to scroll down to ensure color fields are visible before testing
            ST.component(prefix).and(function(cmp){
                cmp.getScrollable().scrollTo(0, 10000);
            });
        });
        var name = 'color';
        describe('radioField', function(){
            describe('initial value', function(){
                for(var i = 0;i<colorVals.length; i++){
                    Form.radioFieldNotSelected(name,i);
                }
            });
            describe('click should select appropriate field', function(){
                afterAll(function(){
                    //deselect all radios after testing
                    for(var i = 0;i<colorVals.length; i++){
                        Form.deselectRadioField(name,i);
                    }
                });
                for(var i = 0;i<colorVals.length; i++){
                    Form.selectRadioFieldAndValidate(name,i);
                }
            });

        });

    });
    describe('bottom toolbar', function(){
        beforeAll(function(){
            //need to scroll down to ensure buttons are visible before testing
            ST.component(prefix).and(function(cmp){
                cmp.getScrollable().scrollTo(0, 10000);
            });
        });
        afterAll(function(){
            //disable/enable button functionality might be broken for some reason, so need to ensure all fields are enabled after testing
            Form.fieldset(1).and(function(cmp){
                cmp.enable();
            });
            Form.fieldset(2).and(function(cmp){
                cmp.enable();
            });
        });
        it('should disable all fields when clicked on Disable button', function(){
            Form.disableBtn()
                .click();
            Form.enableBtn()
                .visible()
                .and(function(){
                    // return to default state
                    var enabledFields = Ext.ComponentQuery.query('field{isDisabled()===false}');
                    expect(enabledFields.length).toBe(0);
                })
                .click();
            Form.disableBtn().visible();
        });
        it('should enable all fields when clicked on Enable button', function(){
            Form.disableBtn()
                .click();
            Form.enableBtn()
                .visible()
                .click();
            Form.disableBtn()
                .visible()
                .and(function(){
                    // return to default state
                    var disabledFields = Ext.ComponentQuery.query(prefix + 'field{isDisabled()}');
                    expect(disabledFields.length).toBe(0);
                });
        });
        describe('reset button', function(){
            var fieldNames = ['name','password','email','url','spinner','cool','date','rank','bio'];
            var fieldNamesLen = fieldNames.length;
            var Reset = {
                checkValue : function(cmp){
                    var val;
                    if(cmp.xtype==='datepickerfield'){
                        val = cmp.getValue();
                        expect(val.toLocaleDateString()).toBe(new Date().toLocaleDateString());
                        return;
                    }
                    else if(cmp.xtype==='checkboxfield'||cmp.xtype==='radiofield'){
                        val = cmp.getChecked();
                    }
                    else if(cmp.xtype==='selectfield'){
                        expect(cmp.getValue()).toBe(null);
                        return;
                    }
                    else{
                        val = cmp.getValue();
                    }
                    expect(val).toBeFalsy();

                },
                setValue : function(cmp){
                    var val = 'text';
                    if(cmp.xtype==='datepickerfield'){
                        val = new Date(2007, 6, 7);
                    }
                    else if(cmp.xtype==='spinnerfield'){
                        val = 5;
                    }
                    else if(cmp.xtype==='checkboxfield'||cmp.xtype==='radiofield'){
                        cmp.setChecked(true);
                        return;
                    }
                    else if(cmp.xtype==='selectfield'){
                        val = 'journeyman';
                    }
                    cmp.setValue(val);
                },
                //checks if model associated with field is set to initial value
                resetAndCheckField : function(i){
                    it('should reset '+fieldNames[i]+' field model value on click', function(){
                        Form.fieldCmp(fieldNames[i]).and(Reset.checkValue);
                    });
                }
            };
            beforeAll(function(){
                //set field values
                for(var i = 0; i< fieldNamesLen; i++){
                    Form.fieldCmp(fieldNames[i]).and(Reset.setValue);
                }
                Form.fieldCmp('color','red').and(Reset.setValue).wait(function(cmp){
                    return cmp.getChecked();
                });
                Form.resetBtn()
                    .click()
                    .wait(function(){
                        return Ext.first(prefix + 'textfield[name=name]').getValue() === '';
                    });

            });
            //check form fields values are being cleaned as expected
            // tests added due to issue with cleaning field value

            //screenshot comparison, because from here it is same after each run (JZ)
            it('Example with custom dataset should look always the same', function () {
                Lib.screenshot('Forms_FormPanel_custom_data');
            });

            describe('should reset model', function(){
                for(var i = 0; i< fieldNamesLen; i++){
                    Reset.resetAndCheckField(i);
                }
                it('should reset Color radiofield value on click', function(){
                    Form.resetBtn()
                        .click()
                        .and(function(){
                            Form.fieldCmp('color','red').and(Reset.checkValue);
                        });
                });
            });
            describe('should reset field value', function(){
                it('input field Name should be empty', function(){
                    Form.textField('name').and(function(el){
                        expect(el.dom.value).toBe('');
                    });
                });
                it('input field Password should be empty', function(){
                    Form.textField('password').and(function(el){
                        expect(el.dom.value).toBe('');
                    });
                });
                it('input field Email should be empty', function(){
                    Form.textField('email').and(function(el){
                        expect(el.dom.value).toBe('');
                    });
                });
                it('input field URL should be empty', function(){
                    Form.textField('url').and(function(el){
                        expect(el.dom.value).toBe('');
                    });
                });
                it('textArea input Bio should be empty', function(){
                    Form.textAreaField('bio').and(function(el){
                        expect(el.dom.value).toBe('');
                    });
                });
            });
            // need to add one extra iterration for color radiofield

        });
    });
});