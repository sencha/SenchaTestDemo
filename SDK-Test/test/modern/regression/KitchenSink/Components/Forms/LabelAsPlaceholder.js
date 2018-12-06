/**
 * @file LabelAsPlaceholder.js
 * @name Components/Forms/LabelAsPlaceholder
 * @created 2016/09/10
 *
 *
 * updated by Jiri Znoj
 * 28. 7. 2017
 * tested on:
 *      desktop:
 *          Chrome 59
 *          Edge 15
 *          FF 54
 *          IE 11
 *      tablet:
 *          Edge 14
 *          Safari 10
 *          Android 7.1
 *      phone:
 *          Android 5, 6, 7
 *          Safari 9
 *
 */
describe('Label As Placeholder', function(){
    var tBoxes,
    prefix = '#kitchensink-view-forms-placeholderlabel ',
    Placeholders = {
        textField : function(title) {
            return ST.element(prefix + 'textfield[label=' + title + '] => input');
        },
        textArea : function(title) {
            return ST.element(prefix + 'field[label=' + title + '] => textarea');
        },
        clearTrigger : function(triggerId){
            return ST.element("trigger[id=" + triggerId + "]");
        },
        testThisField : function(title, tBoxNumber, beforeAllP) {
            describe("Test " + title + " textfield", function(){
                beforeAll(function(){
                    if(beforeAllP) {
                        var query = prefix + ' textfield[label=' + title + '] => div.x-cleartrigger';
                        ST.component(query).click();
                    }
                });
                it("Shoul be loaded correctly", function(){
                    Placeholders.textField(title)
                        .and(function(){
                            expect(tBoxes[tBoxNumber].getLabelAlign()).toBe("placeholder");
                            var empty = tBoxes[tBoxNumber].getValue();
                            if(empty === null){
                                empty = '';
                            }
                            expect(empty).toBe("");
                        })
                });
                it("Should have focus", function(){
                    Placeholders.textField(title)
                        .click()
                        .focus()
                        .focused()
                        .and(function(){
                            var val = tBoxes[tBoxNumber].getValue() === null ? "" : tBoxes[tBoxNumber].getValue();
                            expect(val).toBe("");
                        });
                });
                describe("Should type text", function(){
                    var text = "龴ↀ◡ↀ龴";
                    beforeAll(function () {
                        Placeholders.textField(title)
                            .type(text);
                    });
                    it('should contain correct text', function () {
                        Placeholders.textField(title)
                            .and(function(){
                                expect(tBoxes[tBoxNumber].getValue()).toBe(text);
                            });
                    });
                    it('label should be visible', function () {
                        ST.element(prefix + 'textfield[label=' + title + '] => label')
                            .and(function (el) {
                                expect(el.dom.clientHeight).toBeGreaterThan(0);
                            });
                    });

                });
                it("Should clear the text using clear button", function(){
                    var triggerId = tBoxes[tBoxNumber].getTriggers().clear.id;
                    Placeholders.clearTrigger(triggerId)
                        .visible()
                        .click();

                    Placeholders.textField(title)
                        .and(function(){
                            expect(tBoxes[tBoxNumber].getValue()).toBe("");
                        });
                });
            });
        }
    };

    beforeAll(function() {
        Lib.beforeAll("#form-placeholder", "#kitchensink-view-forms-placeholderlabel");
        ST.wait(function(){
            return Ext.ComponentQuery.query(prefix + 'textfield').length >= 0;
        }).and(function(){
            tBoxes = Ext.ComponentQuery.query(prefix + 'textfield');
        })
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-forms-placeholderlabel");
    });

    describe("Test textbox Title", function(){
        Placeholders.testThisField("Title", 0);
    });

    describe("Test textbox Price", function(){
        Placeholders.testThisField("Price", 1);
    });

    describe("Test textbox Specific Location (optional)", function(){
        Placeholders.testThisField("Specific Location (optional)",2, true);
    });

    describe("Test textarea Description", function(){
        it("Shoul be loaded correctly", function(){
            Placeholders.textArea("Description")
                .and(function(){
                    expect(tBoxes[3].getLabelAlign()).toBe("placeholder");
                    var empty = tBoxes[3].getValue();
                    if(empty === null){
                        empty = '';
                    }
                    expect(empty).toBe("");
                })
        });
        it("Should have focus", function(){
            Placeholders.textArea("Description")
                .click()
                .focus()
                .focused()
                .and(function(){
                    var val = tBoxes[3].getValue() === null ? "" : tBoxes[3].getValue(); 
                    expect(val).toBe("")
                });
        });
        it("Should type text", function(){
            var text = "┻━┻︵  \\(°□°)/ ︵ ┻━┻ ";
            Placeholders.textArea("Description")
                .type(text)
                .and(function(){
                    expect(tBoxes[3].getValue()).toBe(text)
                })
        });
        it("Should remove all text", function(){
            Placeholders.textArea("Description")
                .and(function(){
                    tBoxes[3].setValue("")
                })
                .and(function(){
                    expect(tBoxes[3].getValue()).toBe("")
                });
        });
    });
});