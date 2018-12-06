/**
 * @file Handles.js
 * @date 2.9.2016
 *
 * Tested on: Chrome, Firefox, Opera, Win Phone Edge, iOS9phone, iOS9 tablet, Android6 mobile
 * Passed on: all tested
 */

describe('Drag&Drop Handles example', function () {
    function setOffset(el) {
        return {left: el.dom.offsetLeft, top: el.dom.offsetTop};
    }

    function dragAndCheckNotDraggability(query, startX, startY) {

        var initialOffset = {left: null, top: null}, move = 60;
        ST.element(query)
            .and(function (yellowSquare) {
                initialOffset = setOffset(yellowSquare);
                Lib.DnD.dragBy(yellowSquare, move, 0, startX, startY);
            })
            .and(function (yellowSquare) {
                expect(yellowSquare.dom.offsetLeft).toBe(initialOffset.left);
                expect(yellowSquare.dom.offsetTop).toBe(initialOffset.top);
            });
    }

    function createsItsForField(el) {
        describe('Field "' + el.title + '"', function () {
            var query = el.query;

            it('placeholder is visible during dragging', function () {
                ST.element(query)
                    .and(function (el) {

                        var fn = function () {
                            ST.element('>> .x-drag-dragging')
                                .and(function (el) {
                                    expect(el).toBeDefined();
                                });
                        };

                        Lib.DnD.dragByWithFunction(el, 50, 0, fn);

                    });
            });

            it('has correct title on placeholder', function () {
                ST.element(query)
                    .and(function (el) {
                        var text = el.dom.innerText;
                        var fn = function () {
                            ST.element('>> .x-drag-dragging')
                                .and(function (el) {
                                    expect(el.dom.innerText).toBe(text);
                                });
                        };

                        Lib.DnD.dragByWithFunction(el, 50, 0, fn);

                    });
            });
        });
    }

    var yellow = ['>> .handle-handles', '>> .handle-handles > .handle'];
    var red = ['>> .handle-repeat',
        {query: '>> .handle-repeat > div.handle:nth-child(1)', title: 'Foo'},
        {query: '>> .handle-repeat > div.handle:nth-child(2)', title: 'Bar'},
        {query: '>> .handle-repeat > div.handle:nth-child(3)', title: 'Baz'}];

    beforeAll(function() {
        Lib.beforeAll("#drag-handle", "#kitchensink-view-drag-handle", 100);
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-drag-handle");
    });

    it('is loaded properly', function () {
        ST.element(yellow[0])
            .visible();
        ST.element(yellow[1])
            .visible();
        ST.element(red[0])
            .visible();
        ST.element(red[1].query)
            .visible();
    });

    it('screenshot should be same', function(){
        Lib.screenshot("modern_DragAndDrop_Handles");
    });


    describe('Squares', function () {

        describe('Yellow', function () {
            var query = yellow[0];
            it('is moved by dragging Blue field "Drag"', function () {
                var initialOffset = {left: null, top: null}, move = 60;
                ST.element(query)
                    .wait(function(yellowSquare){
                        return yellowSquare.dom.clientHeight > 0;
                    });
                Lib.waitOnAnimations();
                ST.element(query)
                    .and(function (yellowSquare) {
                        initialOffset = setOffset(yellowSquare);
                    })
                    .down(yellow[1])
                    .and(function (blueField) {
                        Lib.DnD.dragBy(blueField, move, move);
                    })
                    .up(query)
                    .and(function (yellowSquare) {
                        expect(yellowSquare.dom.offsetLeft).toBe(initialOffset.left + move);
                        expect(yellowSquare.dom.offsetTop).toBe(initialOffset.top + move);
                    });
            });

            it('is not moved by dragging yellow square', function () {
                dragAndCheckNotDraggability(query);
            });
        });
        describe('Red', function () {

            it('is not draggable', function () {
                var query = red[0];
                dragAndCheckNotDraggability(query, 1, 1);
            });

            for (var i = 1; i < red.length; i++) {
                createsItsForField(red[i]);
            }
        });
    });
    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('drag-handle');
        });
    });
});
