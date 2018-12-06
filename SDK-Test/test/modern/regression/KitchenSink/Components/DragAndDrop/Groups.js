/**
 * @file Groups.js
 * @date 5.9.2016
 *
 * Tested on: Chrome, Firefox, Opera, Win10 Edge phone, iOS9 phone, iOS7phone, iOS9 tablet, Android6 phone, Android6 tablet
 * Passed on: all tested
 */

describe('Drag&Drop Groups example', function () {

    function moveBy10andCheckPlaceholder(query) {
        it('is moved by 10px and placeholder is not validated', function () {
            ST.element(query)
                .and(function (el) {

                    var fn = function () {
                        ST.element('>> .x-drag-dragging')
                            .and(function (el) {
                                expect(el.dom.className).not.toContain('group-proxy-valid');
                                expect(el.dom.className).not.toContain('group-proxy-invalid');
                            });
                    };

                    Lib.DnD.dragByWithFunction(el, 10, 0, fn);
                });
        });
    }

    function moveTargetToSourceAndValid(query, target, valid) {
        var isValid = valid ? 'group-proxy-valid' : 'group-proxy-invalid';

        it('is moved to ' + target + ' and placeholder has class ' + isValid, function () {

            var targ = {left: null, top: null};
            ST.element(target)
                .and(function (target) {
                    targ.left = target.dom.offsetLeft;
                    targ.top = target.dom.offsetTop + 50;
                });

            ST.element(query)
                .and(function (el) {

                    var standardY = el.dom.offsetHeight / 2;

                    var moveX = targ.left - el.dom.offsetLeft;
                    var moveY = targ.top - el.dom.offsetTop - standardY;

                    var fn = function () {
                        ST.element('>> .x-drag-dragging')
                            .and(function (el) {
                                expect(el.dom.className).toContain(isValid);
                            });
                    };

                    Lib.DnD.dragByWithFunction(el, moveX, moveY, fn);
                });
        });
    }

    var groupSource = ['>> .group-source-group1', '>> .group-source-group2', '>> .group-source-both'];
    var groupTarget = ['>> .group-target-group1', '>> .group-target-group2', '>> .group-target-both'];

    beforeAll(function() {
        Lib.beforeAll("#drag-group", "#kitchensink-view-drag-group", 100);
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-drag-group");
    });

    it('is loaded properly', function () {
        for (var i = 0; i < groupSource.length; i++) {
            ST.element(groupSource[i])
                .visible();

            ST.element(groupTarget[i])
                .visible();
        }
    });

    it('screenshot should be same', function(){
        Lib.screenshot("modern_DragAndDrop_Groups");
    });


    describe('Squares', function () {

        describe('group1', function () {
            moveBy10andCheckPlaceholder(groupSource[0]);
            moveTargetToSourceAndValid(groupSource[0], groupTarget[0], true);
            moveTargetToSourceAndValid(groupSource[0], groupTarget[1], false);
            moveTargetToSourceAndValid(groupSource[0], groupTarget[2], true);
        });

        describe('group2', function () {
            moveBy10andCheckPlaceholder(groupSource[1]);
            moveTargetToSourceAndValid(groupSource[1], groupTarget[0], false);
            moveTargetToSourceAndValid(groupSource[1], groupTarget[1], true);
            moveTargetToSourceAndValid(groupSource[1], groupTarget[2], true);
        });

        describe('group1, group2', function () {
            moveBy10andCheckPlaceholder(groupSource[2]);
            moveTargetToSourceAndValid(groupSource[2], groupTarget[0], true);
            moveTargetToSourceAndValid(groupSource[2], groupTarget[1], true);
            moveTargetToSourceAndValid(groupSource[2], groupTarget[2], true);
        });

    });
    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('drag-group');
        });
    });
});

