/**
 * @file ClosableToolTips.js
 * @name Components/Tooltips/Closable ToolTips
 * @created 2016/11/02
 *
 * @updated 28. 7. 2017
 * Tested on:
 *      desktop: Chrome 59, IE 11, Edge 15, FF 54
 *      tablets: Android 7.1, iOS 10, Edge 14
 *      phones: not supported
 */
describe("Closable Tooltips", function() {
    /**
     * Tooltips examples were not implementation for all of mobile devices.
     **/
    if (Lib.isPhone) {
        it('Example is not available on phone devices', function() {
            pending('This examples are not for mobile devices');
        });
    } else {
        /**
         *  Custom variables for applicaiton
         **/
        var examplePrefix = "*[id=kitchensink-view-tip-closabletooltips]";
        var exampleUrlPostfix = "#closable-tooltips";
        var tips = ["tooltip[_html=Click the X to close this]", "tooltip[_html*=5 bedrooms]"];

        var Comp = {
            tip: function(num) {
                return ST.component(tips[num]);
            },
            closeTool: function(num) {
                return ST.component(tips[num] + " paneltool");
            },
            hover: function(name) {
                if (ST.os.deviceType === "Desktop") {
                    ST.play([
                        {type: "mouseover",target: "button[_text^="+name+"]",detail: 1},
                    ]);
                } else {
                    ST.play([
                        {type: "touchstart",target: "button[_text^="+name+"]",detail: 1}, 
                        {type: "touchend",target: "button[_text^="+name+"]",detail: 1},
                    ]);
                }
            }
        };

        beforeAll(function() {
            Lib.beforeAll(exampleUrlPostfix, examplePrefix);
        });

        afterAll(function() {
            for (var i = 0; i < tips.length; i++) {
                Comp.tip(i)
                    .and(function() {
                        this.future.cmp.hide();
                    });
            }
            Lib.afterAll(examplePrefix);
        });

        /**
         *  Testing UI of the application
         **/
        it("should load correctly", function() {
            Lib.screenshot("UI_closable_tooltips");
        });

        it("Simple tooltip should be displayed", function() {
            Comp.hover("autoHide:");

            Comp.tip(0)
                .visible()
                .and(function(tooltip) {
                    expect(tooltip.getAnchorToTarget()).toBe(true);
                    expect(tooltip.getAnchor()).toBe(false);
                    expect(tooltip.getAutoDestroy()).toBe(true);
                    expect(tooltip.getCloseAction()).toBe("hide");
                    expect(tooltip.getTrackMouse()).toBe(false);
                });

            Comp.closeTool(0)
                .click()
                .hidden();

        });

        it("Anchor tooltip should be displayed", function() {
            Comp.hover("anchor:");

            Comp.tip(1)
                .visible()
                .and(function(tooltip) {
                    expect(tooltip.getAnchorToTarget()).toBe(true);
                    expect(tooltip.getAnchor()).not.toBe(false);
                    expect(tooltip.getAutoDestroy()).toBe(true);
                    expect(tooltip.getCloseAction()).toBe("hide");
                    expect(tooltip.getTrackMouse()).toBe(false);
                });

            Comp.closeTool(1)
                .click()
                .hidden();
        });

        it("Tooltips should not be auto destroyed", function() {
            Comp.hover("autoHide: false");
            ST.wait(5000);
            Comp.tip(0).visible();

            Comp.closeTool(0)
                .click()
                .hidden();
        });

        it("Source code", function() {
            Lib.sourceClick('tip.ClosableToolTips');
        });
    }
});
