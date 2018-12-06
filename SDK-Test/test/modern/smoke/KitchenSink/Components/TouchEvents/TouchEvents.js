/**
 * @file Touch Events.js
 * @name Components/Touch Events
 * @created 2016/08/10
 */
describe("Touch Events", function() {
    /**
     *  Custom variables for applicaiton
     **/
    var examplePrefix = "touch-events";
    var exampleUrlPostfix = "#touch-events";
    var touchPad = 'toucheventpad';

    var Comp = {

        touchpad: function() {
            return ST.component(examplePrefix + " toucheventpad");
        },
        infoPanel: function() {
            return ST.component(examplePrefix + " toucheventinfo");
        },
        logger: function() {
            return ST.component(examplePrefix + " [reference=eventLog]");
        }
    };

    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, examplePrefix);
        if (Ext.platformTags.phone === true) {
            Comp.infoPanel().visible();
            //Lib.ghostClick("button[action=showConsole]");
            ST.wait(function() {
                return Comp.touchpad().visible();
            });
        } else {
            ST.wait(function() {
                return Comp.touchpad().visible() && Comp.infoPanel().visible();
            });
        }
    });
    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });

    /**
     *  Testing UI of the application
     **/
    it("should load correctly", function() {

        if (Ext.platformTags.phone === true) {
            Comp.touchpad().visible();
            Lib.screenshot("UI_touch_events_phone");
        } else {
            Comp.touchpad().visible();
            Lib.screenshot("UI_touch_events");
        }
    });

    describe('Event logging', function () {
        afterEach(function () {
            ST.component('panel[title="Event Log"]')
                .and(function (logger) {
                    logger.updateHtml('');
                });
        });
        it("Should display tap event in log", function() {
            if (ST.os.deviceType === "Desktop") {
                ST.element(touchPad).click(80,110);
                Comp.logger()
                    .and(function(log) {
                        expect(log.el.dom.textContent).toContain("tap");
                        expect(log.el.dom.textContent).not.toContain("swipe");
                    });

            } else {
                ST.play([
                    {type: "touchstart",target: touchPad,x: 80,y: 110,detail: 1},
                    {type: "touchend",target: touchPad,x: 80,y: 110,detail: 1},
                ]);

                Comp.logger()
                    .and(function(log) {
                        expect(log.el.dom.textContent).toContain("tap");
                        expect(log.el.dom.textContent).not.toContain("swipe");
                    });
            }

        });

        it("Should display move event in log", function() {

            Comp.touchpad().click();

            if (ST.os.deviceType === "Desktop") {
                ST.play([
                    {type: "mousemove",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "mousemove",target: touchPad,x: 110,y: 80,buttons: 1},
                ]);

                Comp.logger()
                    .and(function(log) {
                        expect(log.el.dom.textContent).toContain("touchmove");
                    });

            } else {
                ST.play([
                    {type: "touchstart",target: touchPad,x: 80,y: 110,detail: 1},
                    {type: "touchmove",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "touchmove",target: touchPad,x: 110,y: 80,buttons: 1},
                    {type: "touchend",target: touchPad,x: 80,y: 110,detail: 1},
                ]);

                Comp.logger()
                    .and(function(log) {
                        expect(log.el.dom.textContent).toContain("touchmove");
                    });
            }

        });

        it("Should display longpress event in log - if failing, have focus", function() {

            Comp.touchpad().click();

            if (ST.os.deviceType === "Desktop") {
                ST.play([
                    //there have to be more events "longpress". Without it non-focus Edge is failing (JZ) - ORION-1331
                    {type: "mousedown",target: touchPad,x: 80,y: 110,detail: 1},
                    {type: "longpress",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "longpress",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "longpress",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "longpress",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "mouseup",target: touchPad,x: 80,y: 110,detail: 1},
                ]);

                Comp.logger()
                    .and(function(log) {
                        expect(log.el.dom.textContent).toContain("longpress");
                    });

            } else {
                ST.play([
                    {type: "touchstart",target: touchPad,x: 80,y: 110,detail: 1},
                    {type: "longpress",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "longpress",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "longpress",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "longpress",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "longpress",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "touchend",target: touchPad,x: 80,y: 110,detail: 1},
                ]);

                Comp.logger()
                    .and(function(log) {
                        expect(log.el.dom.textContent).toContain("longpress");
                    });
            }

        });

        it("Should display drag event in log", function() {

            Comp.touchpad().click();

            if (ST.os.deviceType === "Desktop") {
                ST.play([
                    {type: "mousedown",target: touchPad,x: 80,y: 110,detail: 1},
                    {type: "mousemove",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "mousemove",target: touchPad,x: 110,y: 80,buttons: 1},
                    {type: "mouseup",target: touchPad,x: 80,y: 110,detail: 1},
                ]);

                Comp.logger()
                    .and(function(log) {
                        expect(log.el.dom.textContent).toContain("drag");
                    });

            } else {
                ST.play([
                    {type: "touchstart",target: touchPad,x: 80,y: 110,detail: 1},
                    {type: "touchmove",target: touchPad,x: 80,y: 110,buttons: 1},
                    {type: "touchmove",target: touchPad,x: 110,y: 80,buttons: 1},
                    {type: "touchend",target: touchPad,x: 80,y: 110,detail: 1},
                ]);

                Comp.logger()
                    .and(function(log) {
                        expect(log.el.dom.textContent).toContain("drag");
                    });
            }

        });
    });


    it("should open source window when clicked", function() {

        Lib.sourceClick("TouchEvent");
    });

});