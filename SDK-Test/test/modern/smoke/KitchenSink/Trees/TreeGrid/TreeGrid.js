/**
 * modern KS > Trees > TreeGrid
 * tested on:
 *          desktop:
 *              Chrome 52
 *              Firefox 45
 *              IE 11
 *              Edge 14
 *              Opera 39
 *              Safari 10
 *          tablet:
 *              iOS(Safari) 9
 *          mobile:
 *              iOS(Safari) 8
 *              Android 6
 *              Edge 14
 *          themes:
 *              Triton
 *              Material
 *              Neptun
 *              IOS
 *          OS:
 *              Windows 10 (desktop, mobile)
 *              iOS (mobile, tablet, desktop)
 *              Android
 *          Sencha Test:
 *              1.0.4.3
 */
describe("TreeGrid", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var toolbar = 'tree-grid toolbar';
    var prefix = '#kitchensink-view-grid-tree-treegrid';

    //------------------------------------------------functions-------------------------------------------------------//

    //copy of function from library because of checking panel content
    function selectAndCheckRowInGrid (grid, number) {
        var desc = 'Select ' + number + '. row in grid and check if selected.';
        if(grid !== undefined){
            desc += grid;
        }
        it(desc, function () {
            ST.grid(grid).rowAt(number).reveal().select().selected();
        });
    }

    //other functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//


    beforeAll(function() {
        Lib.beforeAll("#tree-grid", prefix);
    });
    afterAll(function(){
        Lib.afterAll(prefix);
    });

    //------------------------------------------------tests-----------------------------------------------------------//

    describe('Check if treeGrid is rendered', function () {
        //from library, but it is not a panel - so panel is changed for component
        it('TreeGrid is visible and rendered', function () {
            ST.component('tree')
                .visible()
                .and(function (page) {
                    expect(page.rendered).toBeTruthy();
                });
        });
    });

    describe('Select a row items and see if are selected', function(){
        for (var i = 0; i < 4; i++) {
            selectAndCheckRowInGrid(prefix, i);
        }
    });

    describe('Expand and Collapsed a few items and see if are expanded, collapsed', function(){
        Lib.expandElement(4, 4, true, '>', prefix);
        Lib.expandElement(2, 2, true, '>', prefix);
        Lib.expandElement(1, 1, true, '>', prefix);
        Lib.expandElement(0, undefined, true, '>', prefix);
    });

    describe('Expand hidden row, select item and see if is selected', function(){
        beforeAll(function() {
            expandCollapse(ST.grid(prefix).rowAt(1).reveal().down('>> .x-treecell'), true);
        });
        afterAll(function(){
            expandCollapse(ST.grid(prefix).rowAt(1).reveal().down('>> .x-treecell'), true);
        });

        Lib.expandElement(3, 3, true, '>', prefix);
    });

    describe('Expand and Collapse all items and see if chosen items are correctly selected', function(){
        beforeAll(function() {
            expandCollapse(ST.grid(prefix).rowAt(4).reveal().down('>> .x-treecell'), true);
            expandCollapse(ST.grid(prefix).rowAt(2).reveal().down('>> .x-treecell'), true);
            expandCollapse(ST.grid(prefix).rowAt(1).reveal().down('>> .x-treecell'), true);
            expandCollapse(ST.grid(prefix).rowAt(3).reveal().down('>> .x-treecell'), true);
        });
        afterAll(function(){
            expandCollapse(ST.grid(prefix).rowAt(3).reveal().down('>> .x-treecell'), true);
            expandCollapse(ST.grid(prefix).rowAt(1).reveal().down('>> .x-treecell'), true);
            expandCollapse(ST.grid(prefix).rowAt(2).reveal().down('>> .x-treecell'), true);
            expandCollapse(ST.grid(prefix).rowAt(4).reveal().down('>> .x-treecell'), true);
        });

        selectAndCheckRowInGrid(prefix, 5);
        selectAndCheckRowInGrid(prefix, 10);
        selectAndCheckRowInGrid(prefix, 0);
    });

    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('tree-grid');
        });
    });
});
