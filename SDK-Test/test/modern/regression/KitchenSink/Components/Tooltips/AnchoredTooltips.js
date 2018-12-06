/**
 * @file AnchoredTooltips.js
 * @name Components/Tooltips/Anchored ToolTips
 * @created 2016/10/24
 *
 * @updated 17. 5. 2017
 * Tested on:
 *      desktop: Chrome 58, IE 11, Edge 14, Opera 45, FF 53
 *      tablets: Android 5, 6 and iOS 10
 *      phones: not supported
 */
describe("Anchored Tooltips", function() {
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
        var examplePrefix = "*[id=kitchensink-view-tip-anchoredtooltips]";
        var exampleUrlPostfix = "#anchored-tooltips";
        var tips = ["tooltip[_html=A simple tooltip]", "tooltip[_html^=The current time is]", "tooltip[_html=The anchor is centered]"];

        var Comp = {
            hover: function(name) {
                if (ST.os.deviceType === "Desktop") {
                    ST.play([ 
                        {type: "mouseover",target: "button[_text^="+name+"]",detail: 1}
                    ]);
                } else {
                    ST.play([
                        {type: "touchstart",target: "button[_text^="+name+"]",detail: 1}, 
                        {type: "touchend",target: "button[_text^="+name+"]",detail: 1}
                    ]);
                }
            },
            tip: function(num) {
                return ST.component(tips[num]);
            }
        };

        beforeAll(function() {
            Lib.beforeAll(exampleUrlPostfix, examplePrefix);
        });

        afterAll(function() {
            //hide tooltips
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
            Lib.screenshot("UI_anchored_tooltips");
        });

        it("Simple tooltip should be displayed", function() {
            Comp.hover("Basic Tip");

            Comp.tip(0)
                .and(function(tooltip) {
                    expect(tooltip.getAnchor()).toBe(false);
                    expect(tooltip.getAutoDestroy()).toBe(true);
                    expect(tooltip.getCloseAction()).toBe("hide");
                    expect(tooltip.getTrackMouse()).toBe(false);
                    tooltip.hide();
                })
                .hidden();
        });

        it("Ajax tooltip should be displayed", function() {
            var date = new Date();
            var time = ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

            Comp.hover("Ajax Tip");

            Comp.tip(1)
                .visible()
                .and(function(tooltip) {
                    expect(tooltip.getAnchorToTarget()).toBe(false);
                    expect(tooltip.getAutoDestroy()).toBe(true);
                    expect(tooltip.getCloseAction()).toBe("hide");
                    expect(tooltip.getTrackMouse()).toBe(false);
                    //time was just changed, so it has to be loaded again and check (JZ)
                    if(tooltip._html.indexOf(time) === -1) {
                        time = ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
                    }
                    expect(tooltip._html).toContain(time);
                    tooltip.hide();
                })
                .hidden();
        });

        it("Anchor tooltip should be displayed", function() {
            Comp.hover("Anchor below");

            Comp.tip(2)
                .visible()
                .and(function(tooltip) {
                    expect(tooltip.getAnchorToTarget()).toBe(true);
                    expect(tooltip.getAutoDestroy()).toBe(true);
                    expect(tooltip.getCloseAction()).toBe("hide");
                    expect(tooltip.getTrackMouse()).toBe(false);
                    tooltip.hide();
                })
                .hidden();
        });

        it("Tooltips should be auto destroyed", function() {
            Comp.hover("Basic Tip");
            
            Comp.tip(0)
                //10 second for wait enough (JZ)
                .hidden(10000)
                .and(function(comp){
                    expect(comp.isHidden()).toBe(true);
                });
        });
        
        it("Source code", function() {
            Lib.sourceClick('tip.AnchoredToolTips');
        });
    }
});