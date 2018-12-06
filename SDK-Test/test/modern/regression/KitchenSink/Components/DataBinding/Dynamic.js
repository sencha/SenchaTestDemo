/**
 * @file Dynamic.js
 * @name Component/DateBindings/Dynamic.js
 * @created 2017/5/22
 */

describe("Dynamic", function () {
    var examplePrefix = "binding-dynamic";
    var exampleUrlPostfix = "#binding-dynamic";

    var prefix = '#kitchensink-view-binding-dynamic';
    var Binding = {
        btnTitle: function () {
            return ST.button('panel[_itemId=kitchensink-view-binding-dynamic] button[_text=Change title]');
        },
        btnContent: function () {
            return ST.button('panel[_itemId=kitchensink-view-binding-dynamic] button[_text=Change content]');
        },
        form: function () {
            return ST.component(prefix);
        },
        getTitle: function () {
            return Ext.first('panel[_itemId=kitchensink-view-binding-dynamic]')._title;
        },
        getHtml: function () {
            return Ext.first('panel[id=kitchensink-view-binding-dynamic]')._html;
        }
    };

    function buttonTitle(i) {
        describe("Check buttons", function () {

            beforeAll(function () {
                Binding.btnTitle()
                    .click()
                    .wait(function () {
                        return Number(Binding.getTitle().split(' ')[4]) == i;
                    });
            });

            it("click " + i, function () {
                Binding.btnTitle()
                    .and(function () {
                        expect(Binding.getTitle()).toBe('Info - New Title '+i);
                    });
            });
        });
    }

    beforeAll(function () {
        Lib.beforeAll(exampleUrlPostfix, examplePrefix);
    });

    afterAll(function () {
        Lib.afterAll(examplePrefix);
    });

    it("should load correctly", function () {
        Binding.form()
            .visible();
        Lib.screenshot("UI_dynamic");
    });

    describe('Test button', function () {
        Lib.testButtons('panel[_itemId=kitchensink-view-binding-dynamic]','Change title');
        Lib.testButtons('panel[_itemId=kitchensink-view-binding-dynamic]','Change content');
    });

    describe('Button Title - functionality', function () {
        for (var i = 2; i < 6; i++) {
            describe('click on button title ' + i, function () {
                buttonTitle(i);
            });
        }
    });

    describe('Change Content', function () {
        it('should open, check and close', function () {
            var html =
                "Stuff: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

            Binding.btnContent()
                .click()
                .wait(function () {
                    return Binding.getHtml() == html;
                })
                .and(function () {
                    expect(Binding.getHtml()).toBe(html);
                });
        });
    });

    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('KitchenSink.view.binding.Dynamic');
        });
    });
});
