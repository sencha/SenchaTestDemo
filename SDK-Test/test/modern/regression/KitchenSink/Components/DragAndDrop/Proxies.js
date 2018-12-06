/**
 * @file Proxies.js
 * @date 2.9.2016
 *
 * Tested on: Chrome, Firefox, Opera, Win Phone Edge, iOS9phone, iOS9 tablet, Android6 mobile
 * Passed on: all tested
 */

describe('Drag&Drop Proxies example', function () {

    var square = ['>> .proxy-none', '>> .proxy-original', '>> .proxy-placeholder'];

    beforeAll(function() {
        Lib.beforeAll("#drag-proxy", "#kitchensink-view-drag-proxy", 100);
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-drag-proxy");
    });

    it('is loaded properly', function () {
        ST.element(square[0])
            .visible();
        ST.element(square[1])
            .visible();
        ST.element(square[2])
            .visible();
    });

    it('screenshot should be same', function(){
        Lib.screenshot("modern_DragAndDrop_Proxies");
    });

    describe('Squares', function () {
        describe('Proxy none', function () {
            var query = square[0];
            it('stays on same position during draging', function () {
                var initialOffsetLeft, initialOffsetTop;
                ST.element(query)
                    .and(function (el) {
                        initialOffsetLeft = el.dom.offsetLeft;
                        initialOffsetTop = el.dom.offsetTop;
                        Lib.DnD.dragBy(el, 60, 0);
                    })
                    .and(function (el) {
                        expect(el.dom.offsetLeft).toBe(initialOffsetLeft);
                        expect(el.dom.offsetTop).toBe(initialOffsetTop);
                    });
            });
            it('shows coordinates', function () {

                ST.element(query)
                    .and(function (el) {

                        var fn = function () {
                            ST.element(query)
                                .and(function (el) {
                                    expect(el.dom.innerText.search(/X: \d+, Y: \d+/)).toBe(0);
                                });
                        };

                        Lib.DnD.dragByWithFunction(el, 50, 0, fn);

                    });
            });
        });
        describe('Proxy original', function () {
            var query = square[1];
            beforeEach(function () {
                ST.element(query)
                    .wait(function (el) {
                        return !el.dom.style.left;
                    });
            });

            it('is moveable', function () {
                ST.element(query)
                    .and(function (el) {
                        Lib.DnD.dragBy(el, 30, 0);
                    })
                    .and(function (el) {
                        expect(el.dom.style.left.search(/\d+px/)).toBe(0);
                    });
            });
            it('return to basic position', function () {
                ST.element(query)
                    .and(function (el) {
                        Lib.DnD.dragBy(el, 30, 0);
                    })
                    .and(function (el) {
                        expect(el.dom.style.left.search(/\d+px/)).toBe(0);
                    })
                    .wait(function (el) {
                        return !el.dom.style.left;
                    })
                    .and(function (el) {
                        console.log(el.dom.style.left);
                        expect(el.dom.style.left).toBe('');
                    });
            });

        });
        describe('Proxy placeholder', function () {
            var query = square[2];
            it('placeholder is visible during dragging', function () {
                ST.element(query)
                    .and(function (el) {

                        var fn = function () {
                            ST.element('>> .proxy-drag-custom')
                                .and(function (el) {
                                    expect(el.dom.className).toContain('x-drag-dragging');
                                });
                        };

                        Lib.DnD.dragByWithFunction(el, 50, 0, fn);

                    });
            });
        });

    });
    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('drag-proxy');
        });
    });
});