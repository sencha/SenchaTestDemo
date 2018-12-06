/**
 * modern KS > Trees > TreeList
 * tested on:
 *          desktop:
 *              Chrome 52, 54, 55
 *              Firefox 45, 49 (ubuntu), 51
 *              IE 11
 *              Edge 14
 *              Opera 39, 40
 *              Safari 7, 9
 *          tablet:
 *              iOS(Safari) 9, 10
 *              Edge 13
 *              Android 4.4, 5.0, 5.1, 6
 *          mobile:
 *              iOS(Safari) 8, 10
 *              Android 5, 6
 *              Edge 14
 *          themes:
 *              Triton
 *              Material
 *              Neptune
 *              iOS
 *          OS: 
 *              Windows 10 (desktop, tablet, mobile)
 *              iOS
 *              Android
 *              Ubuntu 16.0.4
 *          Sencha Test:
 *              1.0.4.3, 2.0.0.236
 */
describe("TreeList", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var toolbar = 'tree-list toolbar';
    var bottomPanel = 'tree-list component[id^=ext-component]';
    var buttons = ['Nav', 'Micro'];

    //------------------------------------------------functions-------------------------------------------------------//

        //copy of function from library because of checking panel content
    function selectAndCheckElement (element, path, id) {
        var desc = 'Select element ' + element + ', see if highlighted and if path is ' + path;
        if(id !== undefined){
            desc += ', id: ' + id;
        }
        it(desc, function () {
            Lib.scrollToElement(element, 'container');
            ST.component(element).click().wait(200);
            Lib.textInsideElement(bottomPanel, 'Selected: ' + path);
            ST.component(element).hasCls('x-treelist-item-selected');
        });
    }

    //copy of function from library because of checking panel content
    function selectAndCheckElementMicro (yCoordinates, path) {
        var desc = 'Select ' + (yCoordinates/(176/4) + 0.5) + '. element, see if path is ' + path;
        it(desc, function () {
            ST.play([
                { type: "tap", target: "treelist", x: 20, y: yCoordinates }
            ]);
            ST.wait(200);
            Lib.textInsideElement(bottomPanel, 'Selected: ' + path);
        });
    }

    //copy of function from library because of checking panel content
    function testButtons (button, micro) {
        var desc = 'After click on ' + button + ' button, ' + ' cls didn\'t have x-btn-pressed and now has it, nav style is present and button stay pressed, nav is disabled and than click to going back to initial state and check it';
        if(micro){
            desc += '\nFor micro nav is checked too.'
        }
        it(desc, function () {
            var button1 = Components.button(button);
            ST.button(button1).missingCls('x-button-pressed');
            clickAndCheckButtonsCls('', button1);
            //added to library function
            ST.component('tree-list segmentedbutton').and(function(tl) {
                expect(tl.items.items[0]._value).toContain('nav');
            });
            //ST.button(button1).hasCls('x-button-pressed');
            if(micro){
                ST.component('treelist').hasCls('x-treelist-micro');
                ST.button(Components.button(buttons[0])).hasCls('x-disabled');
                clickAndCheckButtonsCls('', button1);
            }
            clickAndCheckButtonsCls('', Components.button(buttons[0]));
            if(micro){
                ST.component('treelist').missingCls('x-treelist-micro');
                ST.button(button1).missingCls('x-button-pressed');
            }
            ST.button(Components.button(buttons[0])).missingCls('x-button-pressed');
        });
    }

    function testExpandCollapseSelect(){
        describe('Expand and Collapsed a few items and see if are expanded, collapsed', function(){
            Lib.expandElement(Components.treeListItem('Home'), 6, true);
            Lib.expandElement(Components.treeListItem('Users'), 7, true);
            Lib.expandElement(Components.treeListItem('Settings'), 8, true);
        });

        describe('Expand hidden row, select item and see if is selected', function(){
            beforeAll(function() {
                expandCollapse(ST.element(Components.treeListItem('Home')));
            });
            afterAll(function(){
                expandCollapse(ST.element(Components.treeListItem('Home')));
            });
            Lib.expandElement(Components.treeListItem('Archive'), 200, true);
        });

        describe('Expand and Collapse all items and see if chosen items are correctly selected', function(){
            beforeAll(function() {
                expandCollapse(ST.element(Components.treeListItem('Home')));
                expandCollapse(ST.element(Components.treeListItem('Archive')));
                expandCollapse(ST.element(Components.treeListItem('Users')));
                expandCollapse(ST.element(Components.treeListItem('Settings')));
            });
            afterAll(function(){
                expandCollapse(ST.element(Components.treeListItem('Settings')));
                expandCollapse(ST.element(Components.treeListItem('Users')));
                expandCollapse(ST.element(Components.treeListItem('Archive')));
                expandCollapse(ST.element(Components.treeListItem('Home')));
            });
            selectAndCheckElement(Components.treeListItem('Video'), '\/Home\/Video', 11);
            selectAndCheckElement(Components.treeListItem('Tagged'), '\/Users\/Tagged', 12);
            selectAndCheckElement(Components.treeListItem('First'), '\/Home\/Archive\/First', 13);
            selectAndCheckElement(Components.treeListItem('Network'), '\/Settings\/Network', 14);
            selectAndCheckElement(Components.treeListItem('Groups'), '\/Groups', 15);
        });
    }
    //other functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.beforeAll("#tree-list", "#kitchensink-view-grid-tree-list");
        ST.grid('tree-list')
            .wait(function(tl){
                return tl.el.dom.clientHeight > 0;
            });
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-grid-tree-list");
    });

    //------------------------------------------------tests-----------------------------------------------------------//

    describe('Check if treeList is rendered', function () {
        //from library, but it is not a panel - so panel is changed for component
        it('TreeList is visible and rendered', function () {
            ST.component('treelist')
                .visible()
                .and(function (page) {
                    expect(page.rendered).toBeTruthy();
                });
        });
    });

    testExpandCollapseSelect();

    describe('Click on Nav button', function(){
        testButtons(buttons[0]);
    });

    describe('Expand and Collapse all items when Nav is pressed, see if chosen items are correctly selected and correct path is present', function(){
        beforeAll(function() {
            ST.button(Components.button(buttons[0])).missingCls('x-button-pressed').click();
        });
        afterAll(function() {
            ST.button(Components.button(buttons[0])).click();
        });
        testExpandCollapseSelect();
    });

    describe('Click on Micro button', function(){
        testButtons(buttons[1], true);
    });

    describe('Expand and Collapse all items when Micro is pressed, see if chosen items are correctly selected and correct path is present', function(){
        beforeAll(function() {
            ST.button(Components.button(buttons[1])).missingCls('x-button-pressed').click();
        });
        afterAll(function() {
            ST.button(Components.button(buttons[1])).click();
            ST.button(Components.button(buttons[0])).click();
            ST.element(bottomPanel).click();
        });
        selectAndCheckElementMicro((176/8), '\/Home');
        selectAndCheckElementMicro(3*(176/8), '\/Users');
        selectAndCheckElementMicro(5*(176/8), '\/Groups');
        selectAndCheckElementMicro(7*(176/8), '\/Settings');
    });

    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('TreeItem');
        });
    });
});
