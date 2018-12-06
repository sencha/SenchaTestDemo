/**
 * @file UITabs.js
 * UI - Tabs
 **/
 describe('Basic tab',function () {
     var prefix = '#kitchensink-view-tabs-tabs ';

     beforeAll(function() {
         Lib.beforeAll("#basic-tabs", prefix);
         ST.component(prefix + 'container[title=Tab 1]')
             .visible();
     });
     afterAll(function(){
         Lib.afterAll(prefix);
     });

     // User Interface tabs are loaded correctly
     if (ST.os.is.Desktop) {
         describe("User Interface tabs are loaded correctly", function () {
             it('UI Tabs tittle is visible', function () {
                 ST.component("breadcrumb button[_text=Basic Tabs]")
                     .rendered()
                     .and(function (el) {
                         expect(el.getValue()).toContain('basic-tabs');
                     });
             });
         });
     }

     // Tab 1 is clicked by default
     describe("Tab 1 is clicked by default", function() {
         it('Tab has selected class', function () {
             ST.component(prefix+ "tabbar tab[_title=Tab 1]")
                 .hasCls("x-active")
                 .and(function (el) {
                     expect(el.el.dom.className).toContain('x-active');
                 });
         });
         it('Tab 1 text is visible', function () {
             ST.component("container[title=Tab 1]")
                 .rendered()
                 .and(function (el) {
                     expect(el.el.dom.innerText).toContain('By default, tabs are aligned to the top of a view.');
                 });
         });
     });

     // Tabs are loaded correctly
     describe("Tabs are loaded correctly", function() {
         function checkTabTitle(i) {
             it("Tab " + i + " has correct title visible", function () {
                 ST.component(prefix+ "tabbar tab[_title=Tab " + i + "]")
                     .rendered()
                     .and(function (el) {
                         expect(el._title).toContain('Tab ' + i);
                     });
             });
         }
         for(var i = 1; i < 4; i++) {
             checkTabTitle(i);
         }
     });

     // Succesfully switched to Tab 2
     describe("Succesfully switched to Tab 2", function() {
         it('Tab 2 text is visible', function () {
             ST.component(prefix+ "tabbar tab[_title=Tab 2]")
                 .click()
                 .hasCls("x-active");
             ST.component(prefix+ "container[title=Tab 2]")
                 .rendered()
                 .and(function (el) {
                     expect(el.el.dom.innerText).toContain('A TabPanel can use different animations by setting layout.animation.');
                 });
         });
     });

     // Succesfully switched to Tab 3
     describe("Succesfully switched to Tab 3", function() {
         it('Tab 2 text is visible', function () {
             ST.component(prefix+ "tabbar tab[_title=Tab 3]")
                 .click()
                 .hasCls("x-active");
             ST.component(prefix+ "container[title=Tab 3]")
                 .rendered()
                 .and(function (el) {
                     expect(el.el.dom.innerText).toContain('User tapped Tab 3');
                 });
         });
     });

     // Tab 2 is not switched
     describe("Tab 2 is not switched", function() {
         it('no active class', function () {
             ST.component(prefix+ "tabbar tab[_title=Tab 2]")
                 .missingCls("x-active");
         });
     });
 });
