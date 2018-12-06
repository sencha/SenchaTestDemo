/**
 * @file ModelValidation.js
 * @name Component/DateBindings/ModelValidation.js
 * @created 2017/5/26
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

 describe("Model Validation ", function () {
    var examplePrefix = "binding-model-validation";
    var exampleUrlPostfix = "#binding-model-validation";
    var tips = "tooltip[_html=Must be present]";

 	var input = 'profic';

    var prefix = '#kitchensink-view-binding-modelvalidation';
    var Binding = {
        panel: function () {
            return ST.component('panel[id=kitchensink-view-binding-modelvalidation]');
        },
        panelTextfield: function () {
            return ST.field('panel[id=kitchensink-view-binding-modelvalidation] textfield');
        },
        panelTextfieldIcon: function () {
            return ST.element('panel[id=kitchensink-view-binding-modelvalidation] textfield => div.x-icon-el');
        },
        panelTextfieldErrorIcon: function () {
            return ST.element('panel[id=kitchensink-view-binding-modelvalidation] textfield => div.x-error-icon-el');
        },
        getTextfieldId: function () {
            return Ext.first('panel[id=kitchensink-view-binding-modelvalidation] textfield').id;
        },
        tip: function() {
            return ST.component(tips);
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
        beforeAll(function(){
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

        it("Insering and deleting chars in textfield and check", function () {
            Binding.panelTextfield()
                .visible()
                .setValue(input)
                .down('>>input')
                .and(function (inputEl) {
                    inputEl.dom.value=input;
                });
            Binding.panelTextfield()
                .and(function(textField) {
                    expect(textField.getValue()).toBe(input);
                });

            Binding.panelTextfield()
                .visible()
                .and(function(){
                    ST.play([
                        { type: "type", target: "#"+ Binding.getTextfieldId()+" => input", key: "Backspace", caret: 13 }
                    ]);
                })
                .wait(function(textField){
                    return textField.getValue().length === (input.length - 1)
                })
                .and(function(textField) {
                    expect(textField.getValue()).toBe("profi");
                });

            Binding.panelTextfield()
                .visible()
                .and(function(){
                    ST.play([
                        { type: "type", target: "#"+ Binding.getTextfieldId()+" => input", text: "q-ci", caret: 5 }
                    ]);
                })
                .wait(function(textField){
                    return textField.getValue().length === (input.length-1 + "q-ci".length)
                })
                .and(function(textField) {
                    expect(textField.getValue()).toBe("profiq-ci");
                });
        });
    });

    describe("Testing of source panel", function () {
        it("Source code", function() {
            Lib.sourceClick('binding.ModelValidation');
        });
    });
});
