/**
 * @file SalesPerEmployee.js
 * @name D3/Heatmap/Sales Per Employee
 * @created 2016/10/18
 */
describe("Sales Per Employee", function() {
    /**
     *  Custom variables for applicaiton
     **/
    var examplePrefix = "d3-view-heatmap-sales";
    var exampleUrlPostfix = "#d3-view-heatmap-sales";
    var set = [];
    var refreshed = [];

    var Comp = {
        heatmap: function() {
            return ST.component(examplePrefix + " d3-heatmap");
        },
        tiles: function() {
            return Lib.xpath("//*[name()='g' and @class='x-d3-tile']");
        }
    };

    var Func = {
        getValues: function(field, loc, rgb) {
            rgb = rgb || false;
            if (rgb) {
                if (ST.browser.name === "Safari" && (ST.browser.version < 10)) {
                    var color = Func.hexToRgb(Lib.xpath(loc).snapshotItem(0).style.fill);
                    var items = color.slice(4, -1);
                } else {
                    var items = Lib.xpath(loc).snapshotItem(0).style.fill.slice(4, -1);
                }
                items = items.split(",");
                for (var i = 0; i < items.length; i++) {
                    field.push(parseInt(items[i]));
                }
            } else {
                var items = Lib.xpath(loc);
                for (var i = 0; i < items.snapshotLength; i++){
                    field.push(parseInt(items.snapshotItem(i).textContent));
                }
            }
        },
        getParentValues: function(field, loc) {
            var items = Lib.xpath(loc).snapshotItem(0).parentNode;
            if (ST.browser.name === "Safari" && (ST.browser.version < 10)) {
                var color = Func.hexToRgb(items.childNodes[0].style.fill);
                items = color.slice(4, -1);
            } else {
                items = items.childNodes[0].style.fill.slice(4, -1);
            }
            items = items.split(",");
            for (var i = 0; i < items.length; i++) {
                field.push(parseInt(items[i]));
            }
        },
        hexToRgb: function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return "rgb(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")";
        },
        checkColor: function(num) {
            var legend = [];
            var value = parseInt(Lib.xpath("//*[name()='g' and @class='x-d3-tile']//*[name()='text']").snapshotItem(num).textContent);
            Func.getValues(legend, "//*[name()='g' and @class='x-d3-legend-item']//*[name()='text']");
            legend.push(value);
            legend = legend.sort(function(a, b) {
                return a - b;
            });
            var x = legend.map(function(e) {
                return e;
            }).indexOf(value);
            if (x > 0 && x != legend.length - 1) {
                var bottom = [];
                Func.getParentValues(bottom, "//*[name()='g' and @class='x-d3-legend-item']//*[name()='text' and text()='" + legend[x - 1] + "']");
                var top = [];
                Func.getParentValues(top, "//*[name()='g' and @class='x-d3-legend-item']//*[name()='text' and text()='" + legend[x + 1] + "']");
                var choosen = [];
                Func.getValues(choosen, "//*[name()='g' and @class='x-d3-tile']//*[name()='rect']", true);
                for (var i = 0; i < 3; i++) {
                    expect(bottom[i] >= choosen[i]).toBeTruthy();
                    expect(top[i] <= choosen[i]).toBeTruthy();
                }
            } else if (x == legend.length - 1) {
                var bottom = [];
                Func.getParentValues(bottom, "//*[name()='g' and @class='x-d3-legend-item']//*[name()='text' and text()='" + legend[x - 1] + "']");
                var choosen = [];
                Func.getValues(choosen, "//*[name()='g' and @class='x-d3-tile']//*[name()='rect']", true);
                for (var i = 0; i < 3; i++) {
                    expect(bottom[i] >= choosen[i]).toBeTruthy();
                }
            } else {
                var top = [];
                Func.getParentValues(top, "//*[name()='g' and @class='x-d3-legend-item']//*[name()='text' and text()='" + legend[x + 1] + "']");
                var choosen = [];
                Func.getValues(choosen, "//*[name()='g' and @class='x-d3-tile']//*[name()='rect']", true);
                for (var i = 0; i < 3; i++) {
                    expect(top[i] <= choosen[i]).toBeTruthy();
                }
            }
        },
        getWidth: function(num) {
            return Lib.xpath("//*[name()='g' and @class='x-d3-tile']//*[name()='rect']").snapshotItem(num).getAttribute("width");
        },
        getHeight: function(num) {
            return Lib.xpath("//*[name()='g' and @class='x-d3-tile']//*[name()='rect']").snapshotItem(num).getAttribute("height");
        }
    };

    beforeAll(function() {
        KitchenSink.app.redirectTo(exampleUrlPostfix);
        ST.wait(function() {
            return Lib.xpath("//*[name()='g' and @class='x-d3-tile']").snapshotLength > 0;
        });
    });

    afterAll(function(){
        Lib.D3.afterAll("d3-view-heatmap-sales");
    });

    /**
     *  Testing UI of the application
     **/
    it("should load correctly", function() {
        Comp.heatmap().visible()
            .and(function(d3) {
                expect(d3.rendered).toBeTruthy();
                expect(Comp.tiles().snapshotLength).toBe(50);
            });
    });

    it("refresh data", function() {
        if(!Lib.isDesktop){
            pending('not present on mobile phones');
        }
        Func.getValues(set, "//*[name()='g' and @class='x-d3-tile']//*[name()='text']");
        ST.component(examplePrefix + " button[_text=Refresh Data]")
            .click()
            .and(function() {
                Func.getValues(refreshed, "//*[name()='g' and @class='x-d3-tile']//*[name()='text']");
                expect(set).not.toBe(refreshed);
            });
        expect(Comp.tiles().snapshotLength).toBe(50);
    });

    it("refresh size", function() {
        if(!Lib.isDesktop){
            pending('not present on mobile phones');
        }
        Func.getValues(set, "//*[name()='g' and @class='x-d3-tile']//*[name()='text']");
        var height = Func.getHeight(0);
        var width = Func.getWidth(0);
        var heatmapLength;
        ST.component(examplePrefix + " button[_text=Refresh Size]")
            .and(function(){
                heatmapLength = Ext.first("d3-heatmap").getStore().data.length;
            })
            .click()
            .wait(function(){
                var newLength = Ext.first("d3-heatmap").getStore().data.length;
                return heatmapLength !== newLength;
            })
            .and(function() {
                Func.getValues(refreshed, "//*[name()='g' and @class='x-d3-tile']//*[name()='text']");
                expect(set).not.toBe(refreshed);
                var newLength = Ext.first("d3-heatmap").getStore().data.length;
                expect(heatmapLength).not.toBe(newLength);

            });
    });

    /**
     *  Comapring respective color of tile with the legend
     **/
    it("check the correct color of tile", function() {
        if (Lib.isPhone) {
            pending("Legend is not present on mobile phones");
        } else {
            ST.element('viewport')
                .down('>> .x-d3-tile rect')
                .wait(function(rect){
                    return rect.dom.style.fill !== "";
                })
                .wait(1000) //wait due to new animation
                .and(function(){
                    Func.checkColor(0);
                });
        }
    });
    
    it("should open source window when clicked", function() {
        Lib.sourceClick("Sales");
    });

});
