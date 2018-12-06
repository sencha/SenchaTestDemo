/**
 * @file PurchasesByDay.js
 * @name D3/Heatmap/Purchases By Day
 * @created 2016/10/17
 */
describe("Purchases By Day", function() {
    /**
     *  Custom variables for application
     **/
    var examplePrefix = "d3-view-heatmap-purchases";
    var exampleUrlPostfix = "#d3-view-heatmap-purchases";

    var Comp = {
        heatmap: function() {
            return ST.component(examplePrefix + " d3-heatmap");
        },
        rgb: function() {
            return Lib.xpath("//*[name()='g' and @class='x-d3-tile']//*[name()='rect']").snapshotItem(0).style.fill;
        }
    };

    beforeAll(function() {
        Lib.D3.beforeAll(exampleUrlPostfix, "d3-heatmap");
        ST.wait(function() {
            return Lib.xpath("//*[name()='g' and @class='x-d3-tile']").snapshotLength > 0;
        });
    });

    afterAll(function(){
        Lib.D3.afterAll("d3-heatmap");
    });

    /**
     *  Testing UI of the application
     **/
    it("should load correctly", function() {
        Comp.heatmap().visible();
        Lib.screenshot("UI_heatmap_purchases");
    });

    it("tile should have respective color", function() {
        if (ST.browser.name === "Safari" && (ST.browser.version < 10)) {
            expect(Comp.rgb()).toBe("#a5d2a5");
        } else {
            expect(Comp.rgb()).toBe("rgb(165, 210, 165)");
        }
    });

    it("respective tooltip should be displayed", function() {

        //XPath field didn't work properly in IE11 (JZ)
        var targetString = "d3-view-heatmap-purchases => .x-d3-tile:nth-child(1)";

        if (ST.os.deviceType === "Desktop") {
            ST.play([
                {type: "mouseover",target: targetString, x: 0, y: 0 }

            ]);
        } else {
            ST.play([
                {type: "touchstart",target: targetString, x: 0, y: 0 },
                {type: "touchend",target: targetString, x: 0, y: 0 }
            ]);
        }

        ST.component("tooltip[_delegate=g.x-d3-tile]")
            .visible()
            .and(function(tooltip) {
                expect(tooltip._html).toContain("119 customers");
            });
    });

    it("should open source window when clicked", function() {
        Lib.sourceClick("Purchases");
    });

});