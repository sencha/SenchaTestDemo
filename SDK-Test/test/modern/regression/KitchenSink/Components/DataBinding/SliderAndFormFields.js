/**
 * @file Form.js
 * @name Components/Data Binding/SliderAndFormFields
 * @created 2016/10/03
 */
describe("Data Binding - SliderAndFormFields", function() {
    /**
     *  Custom variables for applicaiton
     **/
    var examplePrefix = "#kitchensink-view-binding-form";
    var exampleUrlPostfix = "#binding-form";

    var Comp = {

        form: function() {
            return ST.element(examplePrefix);
        },
        red: function() {
            return ST.component(examplePrefix + " containerfield[_label=Red] numberfield");
        },
        blue: function() {
            return ST.component(examplePrefix + " containerfield[_label=Blue] numberfield");
        },
        green: function() {
            return ST.component(examplePrefix + " containerfield[_label=Green] numberfield");
        },
        sliders: function(num) {
            return Ext.ComponentQuery.query(examplePrefix + " singlesliderfield")[num];
        },
        canvas: function() {
            return ST.element(examplePrefix + " >component:not(containerfield):first");
        },
        colorNum: function(canvas, num) {
            var rgb = [];
            var color = canvas.dom.style.backgroundColor.slice(4, -1);
            //IE fix (JZ)
            color = color.replace('(', '').split(", ");
            for (var i = 0; i <= color.length; i++) {
                rgb.push(parseInt(color[i]));
            }
            if(isNaN(rgb[num])){
                rgb[num] = 0;
            }
            return rgb[num];
        }
    };

    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, "#kitchensink-view-binding-form");
        ST.wait(function() {
            return Comp.form().visible();
        });
    });

    afterAll(function(){
        Lib.afterAll("#kitchensink-view-binding-form");
    });


    beforeEach(function() {

        Comp.red()
            .and(function(red) {
                red.setValue(50);
            });
        Comp.green()
            .and(function(green) {
                green.setValue(100);
            });
        Comp.blue()
            .and(function(blue) {
                blue.setValue(255);
            });
    });

    /**
     * Testing UI of the application
     **/
    it("should load correctly", function() {
        Comp.form()
            .visible();
        Lib.screenshot("UI_form");
    });

    /**
     *   Tests specific for the application
     **/
    it("should be able to change the color by Red slider", function() {
        ST.element("#" + Comp.sliders(0).getId() + " => div.x-thumb").and(function (dragEl) {
            Lib.DnD.dragBy(dragEl,-30,0);
        });
        //fix for tests failing randomly (JZ)
        ST.wait(function(){
            return Comp.canvas().visible();
        });

        Comp.canvas()
            //to prevent random bug on FF (JZ)
            .wait(function(canvas){
                return (Comp.colorNum(canvas, 0) < 50);
            })
            .and(function(canvas) {
                expect(Comp.colorNum(canvas, 0)).toBeLessThan(50);
                expect(Comp.colorNum(canvas, 1)).toBe(100);
                expect(Comp.colorNum(canvas, 2)).toBe(255);
            });

        ST.component(Comp.sliders(0))
            .and(function(red) {
                red = red.getValue();
                expect(red).toBeLessThan(50);
            });
    });

    it("should be able to change the color by Green slider", function() {
        ST.element("#" + Comp.sliders(1).getId() + " => div.x-thumb").and(function (dragEl) {
            Lib.DnD.dragBy(dragEl,-30,0);
        });
        //fix for tests failing randomly (JZ)
        ST.wait(function(){
            return Comp.canvas().visible();
        });

        Comp.canvas()
             //to prevent random bug on FF (JZ)
            .wait(function(canvas){
                return (Comp.colorNum(canvas, 1) < 100);
            })
            .and(function(canvas) {
                expect(Comp.colorNum(canvas, 0)).toBe(50);
                expect(Comp.colorNum(canvas, 1)).toBeLessThan(100);
                expect(Comp.colorNum(canvas, 2)).toBe(255);
            });

        ST.component(Comp.sliders(1))
            .and(function(green) {
                expect(green.getValue()).toBeLessThan(100);
            });
    });

    it("should be able to change the color by Blue slider", function() {
        ST.element("#" + Comp.sliders(2).getId() + " => div.x-thumb").and(function (dragEl) {
            Lib.DnD.dragBy(dragEl,-30,0);
        });
        //fix for tests failing randomly (JZ)
        ST.wait(function(){
            return Comp.canvas().visible();
        });

        Comp.canvas()
            //to prevent random bug on FF (JZ)
            .wait(function(canvas){
                return (Comp.colorNum(canvas, 2) < 255);
            })
            .and(function(canvas) {
                expect(Comp.colorNum(canvas, 0)).toBe(50);
                expect(Comp.colorNum(canvas, 1)).toBe(100);
                expect(Comp.colorNum(canvas, 2)).toBeLessThan(255);
            });

        ST.wait(function(){
            return (Ext.ComponentQuery.query('thumb')[2]._slider._value < 255);
        });
        ST.component(Comp.sliders(2))
            .and(function(blue) {
                expect(blue.getValue()).toBeLessThan(255);
            });
    });

    it("should be able to edit a value of color in Red field - EXTJS-25500", function() {
        if (Lib.isDesktop) {
            Comp.red().down(">> div.x-cleartrigger").click();
        } else {
            Lib.ghostClick(examplePrefix + " containerfield[_label=Red] numberfield => div.x-cleartrigger");
        }
        //if failed in NEW FF, than bug in Orion is present (error: "Failed with error "caret is null"")
        //I tried it in experimental FF 51, but in 45 ESR it is okay and run as it should
        //so it could be browser FF bug or ST - hard to say, but probably good to know
        Comp.red().down("=> input")
            .click()
            .type("99")
            .wait(function(red) {
                return red.dom.value === "99";
            });
        Comp.canvas()
            //to prevent random bug on FF (JZ)
            .wait(function(canvas){
                return (Comp.colorNum(canvas, 0) === 99);
            })
            .and(function(canvas) {
                expect(Comp.colorNum(canvas, 0)).toBe(99);
                expect(Comp.colorNum(canvas, 1)).toBe(100);
                expect(Comp.colorNum(canvas, 2)).toBe(255);
            });

        ST.component(Comp.sliders(0))
            .and(function(red) {
                expect(red.getValue()).toBe(99);
            });
    });

    it("should be able to edit a value of color in Green field - EXTJS-25500", function() {
        if (Lib.isDesktop) {
            Comp.green().down(">> div.x-cleartrigger").click();
        } else {
            Lib.ghostClick(examplePrefix + " containerfield[_label=Green] numberfield => div.x-cleartrigger");
        }
        //if failed in NEW FF, than bug in Orion is present (error: "Failed with error "caret is null"")
        //I tried it in experimental FF 51, but in 45 ESR it is okay and run as it should
        //so it could be browser FF bug or ST - hard to say, but probably good to know
        Comp.green().down("=> input").click()
            .type("99")
            .wait(function(green) {
                return green.dom.value === "99";
            });
        Comp.canvas()
            //to prevent random bug on FF (JZ)
            .wait(function(canvas){
                return (Comp.colorNum(canvas, 1) === 99);
            })
            .and(function(canvas) {
                expect(Comp.colorNum(canvas, 0)).toBe(50);
                expect(Comp.colorNum(canvas, 1)).toBe(99);
                expect(Comp.colorNum(canvas, 2)).toBe(255);
            });

        ST.component(Comp.sliders(1))
            .and(function(green) {
                expect(green.getValue()).toBe(99);
            });
    });

    it("should be able to edit a value of color in Blue field - EXTJS-25500", function() {
        if (Lib.isDesktop) {
            Comp.blue().down(">> div.x-cleartrigger").click();
        } else {
            Lib.ghostClick(examplePrefix + " containerfield[_label=Blue] numberfield => div.x-cleartrigger");
        }
        //if failed in NEW FF, than bug in Orion is present (error: "Failed with error "caret is null"")
        //I tried it in experimental FF 51, but in 45 ESR it is okay and run as it should
        //so it could be browser FF bug or ST - hard to say, but probably good to know
        Comp.blue().down("=> input").click()
            .type("99")
            .wait(function(blue) {
                return blue.dom.value === "99";
            });
        Comp.canvas()
            //to prevent random bug on FF (JZ)
            .wait(function(canvas){
                return (Comp.colorNum(canvas, 2) === 99);
            })
            .and(function(canvas) {
                expect(Comp.colorNum(canvas, 0)).toBe(50);
                expect(Comp.colorNum(canvas, 1)).toBe(100);
                expect(Comp.colorNum(canvas, 2)).toBe(99);
            });

        ST.component(Comp.sliders(2))
            .and(function(blue) {
                expect(blue.getValue()).toBe(99);
            });
    });

    it("should be able to clear a value of color in a numberfield - EXTJS-25500", function() {
        if (Lib.isDesktop) {
            Comp.red().down(">> div.x-cleartrigger").click();
            Comp.green().down(">> div.x-cleartrigger").click();
            Comp.blue().down(">> div.x-cleartrigger").click();
        } else {
            Lib.ghostClick(examplePrefix + " containerfield[_label=Red] numberfield => div.x-cleartrigger");
            Lib.ghostClick(examplePrefix + " containerfield[_label=Green] numberfield => div.x-cleartrigger");
            Lib.ghostClick(examplePrefix + " containerfield[_label=Blue] numberfield => div.x-cleartrigger");
        }
        Comp.red().down("=> input")
            .wait(function(red) {
                return red.dom.value === "";
            });
        Comp.green().down("=> input")
            .wait(function(green) {
                return green.dom.value === "";
            });
        Comp.blue().down("=> input")
            .wait(function(blue) {
                return blue.dom.value === "";
            });

        for (var i = 0; i < 3; i++) {
            ST.component(Comp.sliders(i))
                .and(function(slider) {
                    expect(slider.getValue()).toBe(0);
                });
        }
    });

    it("should open source window when clicked", function() {
        Lib.sourceClick("Form");
    });
});