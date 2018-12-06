/**
 * @file Ajax.js
 * @date 26.8.2016
 *
 * Tested on: Firefox, Chrome, Opera, iOS phone 8.3, iOS tablet 9, Android6 phone, Android6 tablet
 * Passed on: all tested
 */
describe('Ajax example', function () {
    var Cmp = {
        buttonByText: function (text) {
            return ST.button('button[text=' + text + ']');
        },
        getPanelText: function () {
            return Ext.first('ajax component[reference=results]').el.dom.innerText;
        },
        getLengthLines: function () {
            return Cmp.getPanelText().split('\n').length;
        }
    };

    beforeAll(function() {
        Lib.beforeAll("#ajax", "#kitchensink-view-data-ajax");
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-data-ajax");
    });

    it('is loaded properly', function () {
        Cmp.buttonByText('Load using Ajax')
            .visible();
    });

    it('screenshot should be same', function(){
        Lib.screenshot("modern_Ajax");
    });

    describe('Ajax Data', function () {
        beforeAll(function () {
            ST.options.timeout = 10000;
        });
        afterAll(function () {
            ST.options.timeout = 5000;
        });

        it('should be undefined if you didn\'t load it before', function () {
            var expectedText = '';
            Cmp.buttonByText('Format JSON')
                .click()
                .wait(function () {
                    return Cmp.getPanelText().length >= 0;
                })
                .and(function () {
                    expect(Cmp.getPanelText()).toBe(expectedText);
                });
        });

        it('are loaded after clicking on button Load using Ajax', function () {
            var expectedText = 'Jean';
            Cmp.buttonByText('Load using Ajax')
                .click()
                .wait(function () {
                    return Cmp.getPanelText().length >= 1000;
                })
                .and(function () {
                    expect(Cmp.getPanelText()).toContain(expectedText);
                });
        });
    });

    describe('Format JSON', function () {

        beforeAll(function () {
            Cmp.buttonByText('Load using Ajax')
                .click()
                .wait(function () {
                    return Cmp.getPanelText().length >= 1000;
                });
        });

        beforeEach(function () {
            if (Ext.first('button[text=Format JSON]').isPressed()) {
                Cmp.buttonByText('Format JSON')
                    .click();
            }
        });
        it('click and format', function () {

            Cmp.buttonByText('Format JSON')
                .click()
                .and(function () {
                    // high sum of lines indicates, that text is formatted correctly
                    expect(Cmp.getLengthLines()).toBeGreaterThan(100);
                });
        });

        it('click and unformat formated text', function () {

            Cmp.buttonByText('Format JSON')
                .click()
                .wait(function () {
                    return Cmp.getLengthLines() > 100;
                })
                .click()
                .and(function () {
                    // low sum of lines indicates, that text is not formatted
                    expect(Cmp.getLengthLines()).toBeLessThan(10);
                });
        });
    });

    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('AJAX');
        });
    });
});
