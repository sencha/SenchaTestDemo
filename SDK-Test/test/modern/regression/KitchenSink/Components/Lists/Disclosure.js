/**
 * @file Disclosure.js
 * @name Lists/Disclosure
 * @created 2016/07/21
 *
 * @updated: 15. 5. 2017
 * Tested on:
 *      desktop: Chrome 58, IE 11, Edge 14
 *      tablets: Android 5 and iOS 10
 *      phones: Android 6 and iOS 9
 */
describe("Disclosure List", function() {
    /**
     *  Custom variables for applicaiton
     **/
    var examplePrefix = "disclosure-list";
    var exampleUrlPostfix = "#disclosure-list";

    var Comp = {
        list: function() {
            return ST.component(examplePrefix);
        },
        trigger: function() {
            return ST.element(examplePrefix + " simplelistitem[_recordIndex=0] => div.x-tool-type-disclosure");
        },
        messagebox: function() {
            return ST.component("messagebox");
        },
        scrollTo: function(pos) {
            var list = Ext.ComponentQuery.query(examplePrefix)[0];
            var record = list.getStore().getAt(pos);
            return list.scrollToRecord(record);
        }
    };

    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, "#kitchensink-view-lists-disclosurelist");
        ST.wait(function() {
            return Comp.list().visible();
        });
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-lists-disclosurelist");
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
        Lib.screenshot("UI_disclosure_List");
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

    it("should display and hide disclosure window", function() {

        //fix for TC stc - waiting for messagebox to be hidden (JZ)
        Comp.trigger()
            .click();
        Comp.messagebox()
            .visible();
        ST.component("messagebox button")
            .click()
            .hidden();
        Comp.messagebox()
            .and(function(msg) {
                expect(msg._hidden).toBe(true);
            });
        //mask need to be gone ORION-1350 (JZ)
        ST.wait(function(){
            return Ext.DomQuery.select('.x-mask[id^=ext-element]').length === 0;
        });
    });

    it("should open source window when clicked", function() {

        Lib.sourceClick("DisclosureList");
    });

});