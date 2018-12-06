/**
 * @file Grouped.js
 * @name Lists/Grouped
 * @created 2016/07/20
 */
describe("Grouped List", function() {
    /**
     *  Custom variables for applicaiton
     **/
    var examplePrefix = "grouped-list";
    var exampleUrlPostfix = "#grouped-list";

    var Comp = {
        list: function() {
            return ST.component(examplePrefix);
        },
        items: function() {
            return Ext.ComponentQuery.query(examplePrefix + " simplelistitem");
        },
        scrollTo: function(pos) {
            var list = Ext.ComponentQuery.query(examplePrefix)[0];
            var record = list.getStore().getAt(pos);
            return list.scrollToRecord(record);
        }
    };

    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, examplePrefix);
        ST.wait(function() {
            return Comp.list().visible();
        });
    });
    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });

    /**
     *  Testing UI of the application
     **/
    it("should load correctly", function() {

        Comp.list().visible()
            .and(function(list) {
                var visibleItems = Ext.ComponentQuery.query('grouped-list simplelistitem').length;
                expect(list.getStore().getCount()).toBe(visibleItems);
            });
        Lib.screenshot("UI_grouped_List");
    });

    /**
     * Scroll to record position then check the position of the scroller using scrollTop 
     **/
    it("should scroll down and up", function() {

        Comp.scrollTo(20);
        var scrollTop;
        Comp.list()
            .and(function(list) {
                scrollTop = list.getScrollable().getScrollElement().dom.scrollTop;
                expect(scrollTop).toBeGreaterThan(0);
                Comp.scrollTo(0);
            })
            .wait(function(list){
                return list.getScrollable().getScrollElement().dom.scrollTop == Ext.first('itemheader').el.dom.clientHeight + Ext.first('itemheader').el.dom.clientTop;
            })
            .and(function(list) {
                scrollTop = list.getScrollable().getScrollElement().dom.scrollTop;
                expect(scrollTop).toBe(Ext.first('itemheader').el.dom.clientHeight + Ext.first('itemheader').el.dom.clientTop);
            });
    });

    /**
     * Comparing two fields of characters to test if list is grouped
     **/
    it("list should be grouped", function() {

        var names = [];
        var index = 0;
        for (var x = 0; x < Comp.items().length; x++) {
            var name = Comp.items()[x].el.dom.textContent;
            name = name.charAt(0);
            index = names.indexOf(name);
            if (index == -1) {
                names.push(name);
                names.push(1);
            }
            else{
                names[index+1] = Number(names[index+1]) + 1;
            }
        }
        //second field contains headers of groups found by xpath
        var headers = [];
        var results = Lib.xpath("//div[not(contains(@class, 'pinned')) and contains(@data-componentid, 'itemheader')]//div[@class='x-innerhtml']");
        for (var y = 0; y < results.snapshotLength; y++) {
            headers.push(results.snapshotItem(y).innerHTML);
        }
        ST.wait(function() {
                return names.length > 0;
            })
            .and(function() {
                expect(names.length).toBe(2*headers.length);
                for (var z = 0; z < headers.length; z++) {
                    expect(names[2*z] + ' (' + names[2*z+1] + ')').toBe(headers[z]);
                }
            });
    });

    it("should open source window when clicked", function() {

        Lib.sourceClick("GroupedList");
    });

});