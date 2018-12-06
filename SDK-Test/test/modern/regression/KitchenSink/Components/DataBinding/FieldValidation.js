/**
 * @file FieldValidation.js
 * @name Component/DateBindings/FieldValidation.js
 * @created 2017/5/22
 *
 * @date 2017/07/18
 * tested on:
 *      desktop:
 *          Chrome 59, Edge 15, IE 11, Opera 46, FF 54, Safari 9.1
 *      tablet:
 *          Android 5, iOS 10
 *      phone:
 *          iOS 9, Android 7
 */


describe("FieldValidation ", function () {
    var examplePrefix = "binding-field-validation";
    var exampleUrlPostfix = "#binding-field-validation";
    var tips = "tooltip[_html=Must be in the format xxx-xxx-xxxx]";

    var input = 'xxxxx';
	var input2 = '123-456-78908';

    var prefix = '#kitchensink-view-binding-fieldvalidation';
    var Binding = {
        panel: function () {
            return ST.component('panel[id=kitchensink-view-binding-fieldvalidation]');
        },
        panelTextfield: function () {
            return ST.field('panel[id=kitchensink-view-binding-fieldvalidation] textfield');
        },
        panelTextfieldIcon: function () {
            return ST.element('panel[id=kitchensink-view-binding-fieldvalidation] textfield => div.x-icon-el');
        },
        panelTextfieldErrorIcon: function () {
            return ST.element('panel[id=kitchensink-view-binding-fieldvalidation] textfield => div.x-error-icon-el');
        },
        getTextfieldId: function () {
            return Ext.first('panel[id=kitchensink-view-binding-fieldvalidation] textfield').id;
        },
        tip: function() {
            return ST.component(tips);
        },
        panelTextfieldReset: function () {
            return ST.textField('textfield[label=Phone]').and(function(field){field.reset();});
        }
    };

    beforeAll(function () {
        Lib.beforeAll(exampleUrlPostfix, examplePrefix);
    });

    afterAll(function () {
        Lib.afterAll(examplePrefix);
    });

    describe("Example loads correctly", function () {
        it("should load correctly", function() {
            Lib.screenshot("UI_binding_field_validation");
        });
    });

    describe("Testing of textfield", function () {

        beforeAll(function () {
            Binding.panelTextfieldIcon()
                .click();
            Binding.panelTextfield()
                .wait(function(textField){
                    return textField.getValue().length === 0;
                });
        });

        it("Is textfield invalid after press Xclear button?", function () {
            Binding.panelTextfield()
                .and(function (element) {
                    expect(element.el.dom.classList).toContain('x-invalid');
                });
        });

        it("Is tooltip visible?", function () {
            if (Lib.isDesktop) {
                ST.play([
                    {type: "mouseover", target: '#'+Binding.getTextfieldId() + ' => div.x-error-icon-el'},
                    {type: "mouseenter", target:'#'+Binding.getTextfieldId() + ' => div.x-error-icon-el'}
                ]);
            } else {
                Binding.panelTextfieldErrorIcon()
                    .click();
            }

            Binding.tip()
                .visible()
                .and(function(tooltip) {
                    expect(tooltip._anchorToTarget).toBe(true);
                    expect(tooltip._autoDestroy).toBe(true);
                    expect(tooltip._closeAction).toBe("hide");
                    expect(tooltip._trackMouse).toBe(false);
                    tooltip.hide();
                })
                .hidden();
        });
        describe('Field validation', function () {
            beforeAll(function () {
                Binding.panelTextfield()
                    .visible()
                    .setValue(input2)
                    //workaround due to ORION-2100
                    .down('>>input')
                    .and(function (input) {
                        input.dom.value=input2;
                    });
                Binding.panelTextfield()
                    .wait(function (textField) {
                        return  textField.getValue() === input2;
                    })
            });
            it("Insert correct tel. number" , function () {
                Binding.panelTextfield()
                    .and(function(textField) {
                        expect(textField.getValue()).toBe(input2);
                        expect(textField.el.dom.classList).toContain('x-invalid');
                    });
            });
            it("Was 1 number deleted", function () {
                Binding.panelTextfield()
                    .and(function(){
                        ST.play([
                            { type: "type", target: "#"+ Binding.getTextfieldId()+" => input", key: "Backspace", caret: 13 }
                        ]);
                    })
                    .wait(function(textField){
                        return textField.getValue().length === (input2.length-1);
                    })
                    .and(function(textField) {
                        expect(textField.getValue()).toBe(input2.slice(0, (input2.length-1)));
                    });
            });
        });



    });

    describe("Testing of source panel", function () {
        it("Source code", function() {
            Lib.sourceClick('binding.FieldValidation');
        });
    });
});
