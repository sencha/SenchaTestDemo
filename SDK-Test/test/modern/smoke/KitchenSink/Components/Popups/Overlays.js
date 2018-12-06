/**
 * @file Overlays.js
 * Overlays
 *
 * tested on:
 *      desktop:
 *          Chrome 59
 *          Edge 15
 *          FF 54
 *          IE 11
 *          Safari 11
 *      tablet:
 *          Edge 14
 *          Safari 10
 *          Android 7.1
 *      phone:
 *          Android 5, 6, 7.0
 *          Safari 9
 **/

describe('Overlays', function () {
    var prefix = 'overlays ';

    beforeAll(function() {
        Lib.beforeAll("#overlays", prefix);
        Overlays.buttonByText('Action Sheet')
            .visible();
    });
    afterAll(function(){
        Lib.afterAll(prefix);
    });

    //TODO Ensure all specs can be run separately

    var Overlays = {
        buttonByText : function (text) {
            return ST.button(prefix + 'button[text="'+text+'"]');
        }
    };

    // Overlays are loaded correctly
        describe("Overlays tabs are loaded correctly", function () {
            it('Overlays Tabs title is visible', function () {
                if (Lib.isDesktop) {
                    ST.component("breadcrumb button[_text=Overlays]")
                        .rendered()
                        .and(function (el) {
                            expect(el.getValue()).toBe('overlays');
                        });
                }
                else{
                    //ORION-1353
                    //pending("Test not provided for non-desktop devices");
                }
            });
        });

    // Clicking on all available menus on actionsheet
    describe("Clicking on all available menus on actionsheet", function () {
        var actionSheetButtons = ['Delete draft', 'Save draft', 'Cancel'];

        function loopActionSheetButtons(btn) {
            it('Clicked on ' + btn + ' button', function () {
                Overlays.buttonByText('Action Sheet')
                    .click();
                ST.component("actionsheet")
                    .and(function (el) {
                        expect(el.rendered).toBeTruthy();
                    })
                    .wait(function(as){
                        return as.el.dom.clientHeight > 0;
                    });
                Lib.waitOnAnimations();
                ST.component("actionsheet")
                    .down("button[_text=" + btn + "]")
                    .click();
                ST.component("actionsheet")
                    //tried to change it, because it caused error (JZ)
                    .hidden()
                    .and(function (actionsheet) {
                        expect(actionsheet.isVisible()).toBeFalsy();
                    })
                    .wait(function(as){
                        return as.el.dom.clientHeight === 0;
                    });
            });
        }

        for (var i = 0; i < actionSheetButtons.length; i++) {
            loopActionSheetButtons(actionSheetButtons[i]);
        }
    });

    // Overlay desktop test (removed from KS)
    /* 
    describe("Overlay test", function () {
        it('Overlay is visible', function () {
            Overlays.buttonByText('Overlay')
                .click();
            ST.element('paneltitle[_text="Overlay Title"]')
                .wait(function (component) {
                    return component.isVisible();
                })
                .and(function (component) {
                    expect(component.isVisible()).toBeTruthy();
                });
        });

        it('Overlay is NOT visible', function () {
            if (ST.os.is.Desktop) {
                ST.play([
                    {type: "tap", target: "#ext-viewport", x: 600, y: 175} // This part does not work without STplay
                ]);
            }
            else {
                var query = 'top' ? '>>div.x-float-wrap > div.x-mask' : '>>div.x-mask';
                ST.element(query)
                    .click();
            }

            ST.component('panel[_hideOnMaskTap=true][_html*="This is a modal"]:last')
                .hidden()
                .and(function (el) {
                    expect(el.isHidden()).toBeTruthy();
                });
        });
    });
    */
    // Alert test
    describe("Alert test", function () {
        it('Alert is visible', function () {
            Overlays.buttonByText('Alert')
                .click();
            ST.component("messagebox")
                .wait(function (component) {
                    return component.isVisible();
                })
                .and(function (component) {
                    expect(component.isVisible()).toBeTruthy();
                });
        });
        it('Alert is NOT visible', function () {
            ST.component("messagebox toolbar button")
                .click();
            ST.component("messagebox")
                .hidden()
                .and(function (el) {
                    expect(el.isHidden()).toBeTruthy();
            });
        });
    });

    // Prompt test
    describe("Prompt test", function () {
        afterAll(function () {
            ST.component("messagebox[_title=Welcome!]")
                .and(function (msgbox) {
                    msgbox.hide();
                }).hidden();
        });
        it('Prompt is visible', function () {
            Overlays.buttonByText('Prompt')
                .click();
            ST.component("messagebox[_title=Welcome!]")
                .wait(function (component) {
                    return component.isVisible();
                })
                .and(function (component) {
                    expect(component.isVisible()).toBeTruthy();
                });
        });
        it('Typing into prompt', function () {
            ST.field("messagebox[_title=Welcome!] textfield")
                .down('>>input') // workaround
                .type('Petr');
            ST.component("messagebox[_title=Welcome!] textfield")
                .and(function (el) {
                    expect(el._value).toContain('Petr');
                });
        });
        it('Close prompt by OK button', function () {
            ST.component("messagebox[_title=Welcome!] button[_text=OK]")
                .click();
            ST.component("messagebox[_title=Welcome!]")
                .hidden();
            ST.component("messagebox[_title=Welcome!]")
                .wait(function (component) {
                    return !component.isVisible();
                })
                .and(function (component) {
                    expect(component.isVisible()).toBeFalsy();
                });
        });
        it('Closing prompt via cancel button', function () {
            Overlays.buttonByText('Prompt')
                .click();
            ST.component("messagebox[_title=Welcome!]")
                .wait(function (component) {
                    return component.isVisible();
                })
                .and(function (component) {
                    expect(component.isVisible()).toBeTruthy();
                });
            ST.component("messagebox[_title=Welcome!] button[_text=Cancel]")
                .click();
            ST.component("messagebox[_title=Welcome!]")
                .wait(function (component) {
                    return !component.isVisible();
                })
                .and(function (component) {
                    expect(component.isVisible()).toBeFalsy();
                });
        });
    });

    // Confirm test
    describe("Confirm test", function () {
        afterAll(function () {
            ST.component("messagebox[_title=Confirmation]")
                .and(function (msgbox) {
                    msgbox.hide();
                }).hidden();
        });
        it('Confirm is visible', function () {
            Overlays.buttonByText('Confirm')
                .click();
            ST.component("messagebox[_title=Confirmation]")
                .wait(function (component) {
                    return component.isVisible();
                })
                .and(function (component) {
                    expect(component.isVisible()).toBeTruthy();
                });
        });
        it('Confirm is NOT visible by Yes button', function () {
            ST.component("messagebox[_title=Confirmation] button[_text=Yes]")
                .click();
            ST.component("messagebox[_title=Confirmation]")
                .hidden()
                .and(function (el) {
                    expect(el.isHidden()).toBeTruthy();
                });
        });
        it('Confirm is NOT visible by No button', function () {
            Overlays.buttonByText('Confirm')
                .click();
            ST.component("messagebox[_title=Confirmation] button[_text=No]")
                .click();
            ST.component("messagebox[_title=Confirmation]")
                .hidden()
                .and(function (el) {
                    expect(el.isHidden()).toBeTruthy();
                });
        });
    });

    // Picker Test
    describe("Picker Test", function () {
        it('Trying picker', function () {
            Overlays.buttonByText('Picker')
                .click();
            ST.component("picker")
                .rendered() //improvement (JZ)
                .and(function (el) {
                    expect(el.rendered).toBeTruthy();
                });
        });
        it('Correctly clicked on all available buttons - bug in iPhones EXTJS-24243', function () {
            var pickerButtons = ['50 KB/s', '100 KB/s', '200 KB/s', '300 KB/s'];

            function loopPickerButtons(pickerButtons) {
                ST.element("//div[contains(text(),'" + pickerButtons + "')]")
                    .click();
                    //better than hardcoded wait (JZ)
                Lib.waitOnAnimations();
                ST.element("//div[contains(text(),'" + pickerButtons + "')]")
                    .and(function (el) {
                        expect(el.dom.innerText).toContain(pickerButtons);
                        expect(el.dom.parentElement.className).toContain('x-focused x-selected');
                    });
            }

            for (var x = 0; x < pickerButtons.length; x++) {
                loopPickerButtons(pickerButtons[x]);
            }
        });
        it('Click on Done button - picker is hidden', function () {
            ST.element("picker button[text=Done]")
                .click();
            ST.component("picker")
                .wait(function (picker) {
                    return !picker.isVisible();
                })
                .and(function (picker) {
                    expect(picker.isVisible()).toBeFalsy();
                });
        });
    });

    // Toast test
    describe("Toast test", function () {
        it('Toast is visible', function () {
            Overlays.buttonByText('Toast')
                .click();
            ST.component("component[_html=Hello Toast!]")
                .wait(function (component) {
                    return component.isVisible();
                })
                .and(function (component) {
                    expect(component.isVisible()).toBeTruthy();
                });
        });
        it('Toast is NOT visible', function () {
            ST.component("component[_html=Hello Toast!]")
                // wait for toast to disappear - better than fixed timeout, it caused errors (JZ)
                .hidden()
                .and(function () {
                    expect(Ext.first('component[_html=Hello Toast!]')).not.toBe(null);
                });
        });
    });
});

