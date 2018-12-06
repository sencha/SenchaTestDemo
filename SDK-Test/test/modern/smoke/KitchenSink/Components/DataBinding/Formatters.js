/**
 * @file Formatters.js
 * @name Components/Data Binding/Formatters
 * @created 2016/09/29
 */
describe("Data Binding - Formatters", function() {
    /**
     *  Custom variables for applicaiton
     **/
    var examplePrefix = "binding-algebra-formatters";
    var exampleUrlPostfix = "#binding-algebra-formatters";

    var Comp = {

        form: function() {
            return ST.element(examplePrefix);
        },
        x: function() {
            return ST.component(examplePrefix + " spinnerfield[_label=x]");
        },
        y: function() {
            return ST.component(examplePrefix + " spinnerfield[_label=y]");
        },
        single: function() {
            return ST.component(examplePrefix + " textfield[_label=Single]");
        },
        chained: function() {
            return ST.component(examplePrefix + " textfield[_label=Chained]");
        },
        nested: function() {
            return ST.component(examplePrefix + " textfield[_label=Nested]");
        }
    };

    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, examplePrefix);
        ST.wait(function() {
            return Comp.form().visible();
        });
    });
    afterAll(function(){
        Lib.afterAll("binding-algebra-formatters");
    });

    beforeEach(function() {
        Comp.x()
            .and(function(x) {
                x.setValue(8);
            });
        Comp.y()
            .and(function(y) {
                y.setValue(8);
            });
    });

    /**
     * Testing UI of the application
     **/
    it("should load correctly", function() {
        Comp.form()
            .visible();
        Lib.screenshot("UI_formatters");
    });

    /**
     *   Tests specific for the application
     **/
    it("should be able to increase value of x field by spinner", function() {
        Comp.x()
            .visible()
            .and(function() {
                Comp.x().down("=> div.x-spinuptrigger")
                    .click();
            })
            .and(function(x) {
                expect(x.getValue()).toBe(9);
            });
        Comp.single()
            .and(function(single) {
                expect(single.getValue()).toBe("9");
            });
        Comp.chained()
            .and(function(chained) {
                expect(chained.getValue()).toBe("7 kb");
            });
        Comp.nested()
            .and(function(nested) {
                expect(nested.getValue()).toBe("usd72.00");
            });
    });

    it("should be able to decrease value of x field by spinner", function() {
        Comp.x()
            .visible()
            .and(function() {
                Comp.x().down("=> div.x-spindowntrigger")
                    .click();
            })
            .and(function(x) {
                expect(x.getValue()).toBe(7);
            });
        Comp.single()
            .and(function(single) {
                expect(single.getValue()).toBe("4.00");
            });
        Comp.chained()
            .and(function(chained) {
                expect(chained.getValue()).toBe("5.5 kb");
            });
        Comp.nested()
            .and(function(nested) {
                expect(nested.getValue()).toBe("usd56.00");
            });
    });
    /**
     *
     **/
    it("should be able to increase value of y field by spinner", function() {
        Comp.y()
            .visible()
            .and(function() {
                Comp.y().down("=> div.x-spinuptrigger")
                    .click();
            })
            .and(function(y) {
                expect(y.getValue()).toBe(9);
            });
        Comp.single()
            .and(function(single) {
                expect(single.getValue()).toBe("4.50");
            });
        Comp.chained()
            .and(function(chained) {
                expect(chained.getValue()).toBe("7 kb");
            });
        Comp.nested()
            .and(function(nested) {
                expect(nested.getValue()).toBe("usd72.00");
            });
    });

    it("should be able to decrease value of y field by spinner", function() {
        Comp.y()
            .visible()
            .and(function() {
                Comp.y().down("=> div.x-spindowntrigger")
                    .click();
            })
            .and(function(y) {
                expect(y.getValue()).toBe(7);
            });
        Comp.single()
            .and(function(single) {
                expect(single.getValue()).toBe("8");
            });
        Comp.chained()
            .and(function(chained) {
                expect(chained.getValue()).toBe("5.5 kb");
            });
        Comp.nested()
            .and(function(nested) {
                expect(nested.getValue()).toBe("usd56.00");
            });
    });

    it("should open source window when clicked", function() {
        Lib.sourceClick("Formatters");
    });

});