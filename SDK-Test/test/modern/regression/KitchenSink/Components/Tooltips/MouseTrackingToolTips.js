/**
 * @file MouseTrackingToolTips.js
 * @name Components/Tooltips/Mouse Tracking ToolTips
 * @created 2016/10/24
 *
 * @updated 15. 5. 2017
 * Tested on:
 *      desktop: Chrome 58, IE 11, Edge 14, Opera 45, FF 53
 *      tablets: not supported
 *      phones: not supported
 */
describe("Mouse Tracking ToolTips", function() {
    /**
     * Tooltips examples were not implementation for all of mobile devices.
     **/
    if (!Lib.isDesktop) {
        it('Example is not available on touch devices', function() {
            pending('This examples are not for touch devices');
        });
    } else {
        /**
         *  Custom variables for applicaiton
         **/
        var examplePrefix = "*[id=kitchensink-view-tip-mousetracktooltips]";
        var exampleUrlPostfix = "#mousetrack-tooltips";
        var tips = ["tooltip[_html=This tip will follow the mouse while it is over the element]", "tooltip[_html=Following the mouse with an anchor]"];

        var Comp = {
            hover: function(name) {
                ST.play([
                    {type: "mouseover",target: "button[_text=" + name + "]",detail: 1} 
                ]);
            },
            track: function(name, tip) {
                ST.play([
                    {type: "mouseover", target: "button[_text=" + name + "]", detail: 1},
                    {type: "mousemove", target: "button[_text=" + name + "]", x: 0, y: 0, detail: 1}
                ]);

                ST.component(tip)
                    .visible();

                ST.play([
                    {type: "mouseleave", target: examplePrefix, detail: 1} 
                ]);

                ST.component(tip)
                    .hidden();
            },
            tip: function(num) {
                return ST.component(tips[num]);
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
            ST.screenshot("UI_mousetrack_tooltips");
        });

        it("Simple tooltip should be displayed", function() {
            Comp.hover("Track Mouse");

            ST.component(tips[0])
                .visible()
                .and(function(tooltip) {
                    expect(tooltip.getAnchorToTarget()).toBe(true);
                    expect(tooltip.getAnchor()).toBe(false);
                    expect(tooltip.getAutoDestroy()).toBe(true);
                    expect(tooltip.getCloseAction()).toBe("hide");
                    expect(tooltip.getTrackMouse()).toBe(true);
                });

            Comp.track("Track Mouse", tips[0]);
        });

        it("Anchor tooltip should be displayed", function() {
            Comp.hover("Anchor with tracking");

            ST.component(tips[1])
                .visible()
                .and(function(tooltip) {
                    expect(tooltip.getAnchorToTarget()).toBe(true);
                    expect(tooltip.getAutoDestroy()).toBe(true);
                    expect(tooltip.getCloseAction()).toBe("hide");
                    expect(tooltip.getTrackMouse()).toBe(true);
                });

            Comp.track("Anchor with tracking", tips[1]);
        });

        it("Tooltips should be auto destroyed", function() {
            Comp.hover("Track Mouse");

            ST.wait(function() {
                return ST.component(tips[0]).hidden();
            });
        });
        
        it("Source code", function() {
            Lib.sourceClick('tip.MouseTrackToolTips');
        });

    }

});