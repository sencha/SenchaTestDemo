/**
 * @file Basic.js
 * @name Lists/Basic
 * @created 2016/06/28
 */
describe("Basic List", function() {
    /**
     *  Custom variables for applicaiton
     **/
    var examplePrefix = "basic-list";
    var exampleUrlPostfix = "#basic-list";

    var Comp = {
        list: function() {
            return ST.component(examplePrefix);
        },
        scrollTo: function(pos) {
            var list = Ext.ComponentQuery.query(examplePrefix)[0];
            var record = list.getStore().getAt(pos);
            return list.scrollToRecord(record);
        }
    };

    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, "#kitchensink-view-lists-basiclist");
        ST.wait(function() {
            return Comp.list().visible();
        });
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-lists-basiclist");
    });

    /**
     *  Testing UI of the application
     **/
    it("should load correctly", function() {

        Comp.list().visible()
            .and(function(list) {
                expect(list.getStore().getCount()).toBe(list.dataItems.length);
                expect(list.getStore().getCount()).toBe(list.getItemCount());
            });
        Lib.screenshot("UI_basic_List");
    });

    /**
     * Scroll to record position then check the position of the scroller using scrollTop 
     **/
    it("should scroll down and up", function() {

        Comp.scrollTo(20);
        Comp.list()
            .and(function(list) {
                var scrollTop = list.getScrollable().getScrollElement().dom.scrollTop;
                expect(scrollTop).toBeGreaterThan(0);
                Comp.scrollTo(0);
            })
            .and(function(list) {
                var scrollTop = list.getScrollable().getScrollElement().dom.scrollTop;
                expect(scrollTop).toBe(0);
            });
    });

    it("should open source window when clicked", function() {

        Lib.sourceClick("BasicList");
    });

});