/**
 * @file Data.js
 * @date 5.9.2016
 *
 * Tested on: Chrome, Firefox, Opera, Win10 Edge phone, iOS9 phone, iOS7phone, iOS9 tablet, Android6 phone, Android6 tablet
 * Passed on: all tested
 */

describe('Drag&Drop Groups example', function () {

    var source = [
        {
            query: '>> .data-source > div:nth-child(1)',
            title: 'Overnight',
            text: 'Your parcel will arrive within 2 days'
        },
        {
            query: '>> .data-source > div:nth-child(2)',
            title: 'Expedited',
            text: 'Your parcel will arrive within 7 days'
        },
        {query: '>> .data-source > div:nth-child(3)', title: 'Standard', text: 'Your parcel will arrive within 21 days'}
    ];

    var target = '>> .data-target';
    var tgt = {centerX: null, centerY: null};

    function isWindowHidden() {
        return Ext.first('messagebox[title=Delivery set]').el.dom.className.indexOf('x-hidden') > 0;
    }

    function checkItem(obj) {
        describe(obj.title, function () {
            it('has correct text in window', function () {
                ST.element(obj.query)
                    .and(function (el) {
                        var x = tgt.centerX - (el.dom.offsetLeft + (el.dom.offsetWidth / 2));
                        var y = tgt.centerY - (el.dom.offsetTop + (el.dom.offsetHeight / 2));
                        Lib.DnD.dragBy(el, x, y);
                    })
                    .wait(function () {
                        return Ext.first('messagebox[title=Delivery set]').isVisible();
                    })
                    ST.component('messagebox[title=Delivery set] component[html^=Your parcel will arrive]')
                    .and(function (msgBox) {
                        expect(msgBox.getHtml()).toBe(obj.text);
                    });
            })
        })
    }

    beforeAll(function() {
        Lib.beforeAll("#drag-data", "#kitchensink-view-drag-data");
        ST.element(target)
            .and(function (el) {
                tgt.centerX = el.dom.offsetLeft + (el.dom.offsetWidth / 2);
                tgt.centerY = el.dom.offsetTop + (el.dom.offsetHeight / 2);
            });
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-drag-data");
    });

    it('is loaded properly', function () {
        for (var i = 0; i < source.length; i++) {
            ST.element(source[i].query)
                .visible();
        }
        ST.element(target)
            .visible();
    });

    it('screenshot should be same', function(){
        Lib.screenshot("modern_DragAndDrop_Data");
    });

    describe('DnD', function(){
        afterEach(function () {
            ST.component('messagebox[title=Delivery set]:first')
                .and(function(messagebox){
                    messagebox.hide();
                })
                .hidden();
        });
        describe('Target (big rectangle)', function () {
            it('change class and background', function () {
                var query = source[0].query;
                ST.element(query)
                    .and(function (el) {

                        var fn = function () {
                            ST.element(target)
                                .and(function (el) {
                                    expect(el.dom.className).toContain('data-target-valid');
                                });
                        };

                        var standardX = el.dom.offsetWidth / 2;
                        var standardY = el.dom.offsetHeight / 2;

                        var moveX = tgt.centerX - standardX;
                        var moveY = tgt.centerY - standardY;

                        Lib.DnD.dragByWithFunction(el, moveX, moveY, fn);
                    })
            });
        });


        describe('Items', function () {
            for (var i = 0; i < source.length; i++) {
                checkItem(source[i]);
            }
        });

        describe('Window', function () {
            it('is visible after dragging item to rectangle', function () {
                ST.element(source[0].query)
                    .and(function (el) {
                        var x = tgt.centerX - (el.dom.offsetLeft + (el.dom.offsetWidth / 2));
                        var y = tgt.centerY - (el.dom.offsetTop + (el.dom.offsetHeight / 2));
                        Lib.DnD.dragBy(el, x, y);
                    })
                    .wait(function () {
                        return Ext.first('messagebox').isVisible();
                    })
                    .and(function () {
                        expect(Ext.first('messagebox[title=Delivery set]').el.dom.className).not.toContain('x-hidden');
                    });
            });

            it('is closed by clicking on button OK', function () {
                ST.element(source[0].query)
                    .and(function (el) {
                        var x = tgt.centerX - (el.dom.offsetLeft + (el.dom.offsetWidth / 2));
                        var y = tgt.centerY - (el.dom.offsetTop + (el.dom.offsetHeight / 2));
                        Lib.DnD.dragBy(el, x, y);
                    });
                ST.button('messagebox button')
                    .click()
                    .wait(function () {
                        return isWindowHidden();
                    })
                    .and(function () {
                        expect(Ext.first('messagebox[title=Delivery set]').el.dom.className).toContain('x-hidden');
                    });
            });
        });
    });

    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('drag-data');
        });
    });
});


