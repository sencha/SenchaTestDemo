/**
 * @file Files.js
 * @date 5.9.2016
 *
 * Comment: Test if component is visible and make a screenshot. Other functionality is allowed only. Example is only on desktop
 * Tested on: Chrome, Firefox, Opera, iOS9 phone, iOS7phone, iOS9 tablet, Android6 phone, Android6 tablet
 * Passed on: all tested
 */

describe('Drag&Drop Files example', function () {
    function pendingTouch(text) {
        if(!Lib.isDesktop){
            pending(text);
        }
    }

    beforeAll(function () {
        if(Lib.isDesktop) {
            Lib.beforeAll("#drag-file", "#kitchensink-view-drag-file");
        }
    });

    afterAll(function () {
        if(Lib.isDesktop) {
            Lib.afterAll("#kitchensink-view-drag-file");
        }
    });

    var expectedText = '<div class="drag-file-label">Drag a file from your computer here</div><div class="drag-file-icon"></div>';
    it('is loaded properly', function () {
        pendingTouch('Example not available on touch devices');
        ST.component('drag-file')
            .visible()
            .and(function (cmp) {
                expect(cmp.getHtml()).toBe(expectedText);
            });
    });

    it('screenshot should be same', function(){
        pendingTouch('Example not available on touch devices');
        Lib.screenshot("modern_DragAndDrop_File");
    });

    describe('Source code', function () {
        it('should open, check and close', function () {
            pendingTouch('Example not available on touch devices');
            Lib.sourceClick('drag-file');
        });
    });

});

