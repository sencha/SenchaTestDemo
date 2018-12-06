/**
 * @file Simple.js
 * @date 2.9.2016
 *
 * Tested on: iPad9, iPhone9, Android6, Firefox, Chrome, Opera, Edge phone,
 * Passed on: all tested
 */

describe('Drag&Drop Simple example', function () {

    var queryOfElement = '>> .simple-source';

    var eldom = {left: null, top: null};

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

    function dragAndCheck(elementQuery, moveX, moveY) {

        function pxToNumber(value) {
            return Math.round(parseFloat(value.substring(0, value.length - 2)));
        }

        ST.element(elementQuery)
            .wait(function(yellowSquare){
                return yellowSquare.dom.clientHeight > 0;
            });
        Lib.waitOnAnimations();
        ST.element(elementQuery)
            .and(function (el) {
                Lib.DnD.dragBy(el, moveX, moveY);
            })
            .and(function (el) {

                var elLeft = pxToNumber(el.dom.style.left);
                var elTop = pxToNumber(el.dom.style.top);

                //Change for ExtJS 6.5 (JZ)
                expect(elLeft).toBe((moveX));
                expect(elTop).toBe((moveY));
            });
    }

    beforeAll(function() {
        Lib.beforeAll("#drag-simple", "#kitchensink-view-drag-simple", 100);
        setValues(queryOfElement);
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-drag-simple");
    });

    it('is loaded properly', function () {
        ST.element('>> .simple-source')
            .visible();
    });

    it('screenshot should be same', function(){
        Lib.screenshot("modern_DragAndDrop_Simple");
    });

    describe('Square', function () {
        describe('Simple', function () {
            beforeEach(function () {
                setValues(queryOfElement);
            });
            afterEach(function () {
                setDefaultValues(queryOfElement);
            });

            it('is moved by 60px, 0px', function () {
                dragAndCheck(queryOfElement, 60, 0);
            });
            it('is moved by 0px, 60px', function () {
                dragAndCheck(queryOfElement, 0, 60);

            });
            it('is moved by 100px, 100px ', function () {
                dragAndCheck(queryOfElement, 100, 100);
            });

            describe('Title of Simple square', function () {
                it('has correct text: Drag me!', function () {
                    ST.element(queryOfElement)
                        .and(function (el) {
                            expect(el.dom.innerText).toBe('Drag Me!');
                        });
                });
                it('show coordinates during draging', function () {
                    ST.element(queryOfElement)
                        .and(function (el) {

                            var fn = function () {
                                ST.element(queryOfElement)
                                    .and(function (el) {
                                        expect(el.dom.innerText.search(/X: \d+, Y: \d+/)).toBe(0);
                                    });
                            };

                            Lib.DnD.dragByWithFunction(el, 50, 50, fn);
                        });
                });
            });
        });

    });
    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('drag-simple');
        });
    });
});