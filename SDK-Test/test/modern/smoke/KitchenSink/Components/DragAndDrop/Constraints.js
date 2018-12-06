/**
 * @file Constraints.js
 * @date 26.8.2016
 *
 * Tested on: iPhone9, iPad9, Android6, Firefox, Chrome, Opera, Edge phone, IE11
 * Passed on: all tested
 */

describe('Constraints example', function () {

    var eldom = {left: null, top: null};
    var xtype = 'drag-constraint';

    function setValues(queryOfElement) {
        ST.element(queryOfElement)
            .and(function (el) {
                eldom.left = el.dom.offsetLeft;
                eldom.top = el.dom.offsetTop;
            });
    }

    function setDefaultValues(queryOfElement) {
        ST.element(queryOfElement)
            .and(function (el) {
                el.dom.style.left = null;
                el.dom.style.top = null;
            });
    }

    function dragAndCheck(elementQuery, moveX, moveY, expectedX, expectedY, limited) {

        function pxToNumber(value) {
            return Math.round(parseFloat(value.substring(0, value.length - 2)));
        }

        expectedX = !(expectedX == null) ? expectedX : moveX;
        expectedY = !(expectedY == null) ? expectedY : moveY;

        ST.element(elementQuery)
            .and(function (el) {
                Lib.DnD.dragBy(el, moveX, moveY);
            })
            .and(function (el) {

                var elLeft = pxToNumber(el.dom.style.left);
                var elTop = pxToNumber(el.dom.style.top);

                if (limited) {
                    // problem on bigger phone's screens in round - this is a little fix
                    if ((elLeft - expectedX) == 1)
                        elLeft -= 1;
                    expect(elLeft).toBe(expectedX);
                    expect(elTop).toBe(expectedY);
                } else {
                    expect(elLeft).toBe((eldom.left + expectedX));
                    expect(elTop).toBe((eldom.top + expectedY));
                }
            });
    }

    beforeAll(function() {
        Lib.beforeAll("#drag-constraint", xtype);
    });
    afterAll(function(){
        Lib.afterAll(xtype);
    });

    it('is loaded properly', function () {
        ST.element('>> .constrain-snap')
            .visible();
        ST.element('>> .constrain-vertical')
            .visible();
        ST.element('>> .constrain-horizontal')
            .visible();
        ST.element('>> .constrain-parent')
            .visible();
    });

    it('screenshot should be same', function(){
        Lib.screenshot("modern_DragAndDrop_Constraints");
    });

    describe('DragAnDrop', function () {

        describe('constrain-snap', function () {
            var queryOfElement = '>> .constrain-snap';
            beforeEach(function () {
                setValues(queryOfElement);
            });
            afterEach(function () {
                setDefaultValues(queryOfElement);
            });

            it('is moved by -60px, -60px', function () {
                dragAndCheck(queryOfElement, -60, -60, -60, -50);
            });
            it('is moved by -120px, -100px', function () {
                dragAndCheck(queryOfElement, -120, -100);

            });
            it('is moved by -125px, -105px and it should be moved to -120px, -100px', function () {
                dragAndCheck(queryOfElement, -125, -105, -120, -100);
            });
        });

        describe('constrain-vertical - EXTJS-23727', function () {
            var queryOfElement = '>> .constrain-vertical';
            beforeEach(function () {
                setValues(queryOfElement);
            });
            afterEach(function () {
                setDefaultValues(queryOfElement);
            });

            it('is moved by 0px, 30px - EXTJS-23727', function () {
                dragAndCheck(queryOfElement, 0, 30);
            });

            it('is moved by -60px, 60 and it should be moved to 0, 60 - EXTJS-23727', function () {
                dragAndCheck(queryOfElement, -60, 60, 0, 60);
            });

            it('is moved by 10px, 10px and it should be moved to 0px, 10px - EXTJS-23727', function () {
                dragAndCheck(queryOfElement, 10, 10, 0, 10);
            });
        });

        describe('constrain-horizontal', function () {
            var queryOfElement = '>> .constrain-horizontal';
            beforeEach(function () {
                setValues(queryOfElement);
            });
            afterEach(function () {
                setDefaultValues(queryOfElement);
            });

            it('is moved by 30px, 0px', function () {
                dragAndCheck(queryOfElement, 30, 0);
            });

            it('is moved by 60px, -60 and it should be moved to 0, 60', function () {
                dragAndCheck(queryOfElement, 60, -60, 60, 0);
            });

            it('is moved by 10px, 10px and it should be moved to 0px, 10px', function () {
                dragAndCheck(queryOfElement, 10, 10, 10, 0);
            });
        });

        describe('constrain-parent', function () {
            var queryOfElement = '>> .constrain-parent';
            var parent = {};
            beforeAll(function () {
                ST.element('>> .constrain-drag-ct')
                    .and(function (el) {
                        // 80 is dimension of cube and 10 is border
                        parent.width = el.dom.offsetWidth - 80 - 10;
                        parent.height = el.dom.offsetHeight - 80 - 10;
                    });
            });
            beforeEach(function () {
                setValues(queryOfElement);
            });
            afterEach(function () {
                setDefaultValues(queryOfElement);
            });

            it('is moved by 30px, 0px', function () {
                //hack for Firefox, Firefox counts it differently
                if (ST.browser.is.Firefox) {
                    eldom.left -= 5;
                    eldom.top -= 5;
                }
                dragAndCheck(queryOfElement, 30, 0);
            });

            it('is moved by 300px, 0 and it should stuck on border of parent div', function () {
                dragAndCheck(queryOfElement, 300, 0, parent.width, 50, true);
            });

            it('is moved by 300px, 400px and it should stuck on borders of parent div', function () {
                dragAndCheck(queryOfElement, 300, 400, parent.width, parent.height, true);
            });
        });
    });
    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('drag-constraint');
        });
    });
});
