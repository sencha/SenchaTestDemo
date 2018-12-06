/**
 * @file JSONP.js
 * @date 25.8.2016
 *
 * Tested on: Firefox, Chrome, Opera, iOS phone 8.3, iOS tablet 9, Android6 phone, Android6 tablet
 * Passed on: all tested
 */
describe('JSONP example', function () {
    var Cmp = {
        buttonByText: function (text) {
            return ST.button('button[text=' + text + ']');
        },
        getPanelText: function () {
            return Ext.first('jsonp component[reference=results]').el.dom.innerText;
        }
    };

    beforeAll(function() {
        Lib.beforeAll("#jsonp", "#kitchensink-view-data-jsonp");
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-data-jsonp");
    });

    it('is loaded properly', function () {
        Cmp.buttonByText('Load using JSON-P')
            .visible();
    });

    it('screenshot should be same', function(){
        Lib.screenshot("modern_JSONP");
    });

    describe('JSONP Data', function () {
        var time;
        beforeAll(function(){
            ST.options.timeout = 10000;

            time = new Date();

        });
        afterAll(function(){
            ST.options.timeout = 5000;
        });

        it('are loaded after clicking on button Load using JSON-P - EXTJS-26238', function () {
            var correctMonth = time.getMonth()+1;
            var correctDay = time.getDate();
            var expectedText = correctMonth + '/' + correctDay + '/' + time.getFullYear();

            Cmp.buttonByText('Load using JSON-P')
                .click()
                .wait(function () {
                    return Cmp.getPanelText().indexOf(expectedText) >= 0;
                })
                .and(function () {
                    expect(Cmp.getPanelText()).toContain(expectedText);
                });
        });
    });

    describe('Source code', function(){
        it('should open, check and close', function(){
            Lib.sourceClick('JSONP');
        });
    });
});
