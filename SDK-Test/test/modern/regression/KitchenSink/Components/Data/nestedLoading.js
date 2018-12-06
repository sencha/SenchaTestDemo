/**
 * @file nestedLoading.js
 * @date 18.8.2016
 * Tested on: Chrome, Firefox, Opera, Safari, Android6 and iOS9 tablet, mobile, Edge
 * Passed on: all tested platforms
 *
 * @date: 15. 5. 2017
 * Tested on:
 *      desktop: Chrome, Firefox, IE 11, Edge 14
 *      tablets: Android5 and iOS10
 *      phones: Android 6 and iOS 9
 */
describe('Nested Loading example', function () {
    var Cmp = {
        buttonByText: function (text) {
            return ST.button('button[text=' + text + ']');
        },
        getNestedText: function () {
            return Ext.first('nestedloading component[reference=dataview]').el.dom.innerText;
        },
        clickOnMask: function () {
            ST.component('viewport').down('>> .x-float-wrap').down('>> .x-mask').click()
        }
    };

    beforeAll(function() {
        Lib.beforeAll("#nestedloading", "#kitchensink-view-data-nestedloading");
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-data-nestedloading");
    });

    it('is loaded properly', function () {
        Cmp.buttonByText('Load Nested Data')
            .visible();
        Cmp.buttonByText('Explain')
            .visible();
    });

    it('screenshot should be same', function(){
        Lib.screenshot("modern_nestedLoading");
    });

    describe('Nested Data', function () {
        beforeAll(function(){
            ST.options.timeout = 10000;
        });
        afterAll(function(){
            ST.options.timeout = 5000;
        });
        
        it('are loaded after clicking on button Load Nested Data', function () {
            var expectedText = 'Jamie Avins\'s orders:';

            Cmp.buttonByText('Load Nested Data')
                .click()
                .wait(function () {
                    return Cmp.getNestedText().indexOf(expectedText) >= 0;
                })
                .and(function () {
                    expect(Cmp.getNestedText()).toContain(expectedText);
                });
        });
    });

    describe('Explain window', function () {
        describe('Closing', function () {

            beforeEach(function () {
                Cmp.buttonByText('Explain')
                    .click()
                    .wait(function () {
                        //panel is inicialized after clicking, so we can be sure, that panel is really last.
                        return Ext.first('messagebox component[baseCls=x-component]').getHtml() != null;
                    });
            });

            it('is hidden after clicking on button OK', function () {
                Cmp.buttonByText('OK').click();
                //it was failing sometimes, so waiting added for fixing random bugs (JZ)
                ST.element('messagebox component[baseCls=x-component]')
                    .hidden();
            });
        });

        describe('Content', function () {
            beforeAll(function () {
                Cmp.buttonByText('Explain')
                    .click()
                    .wait(function () {
                        return Ext.first('messagebox component[baseCls=x-component]').getHtml() != null;
                    });
            });
            afterAll(function () {
                Cmp.clickOnMask();
            });

            it('has correct text in window.', function () {
                ST.panel('messagebox component[baseCls=x-component]')
                    .visible()
                    .and(function (panel) {
                        expect(panel.getHtml()).toContain('The data package can load deeply nested data in a single request.');
                    });
            });

            it('has correct title', function () {
                ST.panel('messagebox')
                    .visible()
                    .and(function (title) {
                        expect(title.getTitle()).toBe('Loading Nested Data');
                    });
            });
        });
    });
});
