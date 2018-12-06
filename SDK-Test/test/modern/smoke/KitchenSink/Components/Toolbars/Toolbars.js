/**
 * modern KS > UI > Toolbars
 * tested on:
 *          desktop:
 *              Chrome 51
 *              Edge 13
 *              IE 11
 *              Opera 38
 *              Firefox 45
 *          tablet:
 *              Android 4.4, 6.0
 *              Safari 8, 9
 *              Edge 13
 *              IE11
 *          mobile:
 *              Android 5.1, 6.0
 *              Safari 8
 *              Windows Phone 10
 *          themes:
 *              Material
 *              Triton
 *              Neptune
 *              IOS
 *          OS:
 *              Windows 10
 *              Windows 8.1
 *              Android
 *              iOS
 *          Sencha Test:
 *              1.0.3.35
 */
describe("Toolbars", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var panelText = "null][@id^=kitchensink-view-toolbars";
    var buttonsLeft = ['Default'];
    var buttonsMiddle = ['Option 1', 'Option 2'];
    var buttonsRight = ['Action'];
    var prefix = '#kitchensink-view-toolbars-toolbars ';

    //------------------------------------------------functions-------------------------------------------------------//

    //copy of function from library because of checking panel content
    function testButtons (button, pressed) {
        describe(button, function () {
            var button1 = Components.button(button);
            Lib.testButtons(prefix, button);
            //added to library function
            it('content should be properly updated to' + button, function () {
                //ST.button(prefix + button1).click();
                ST.component('panel[id^=kitchensink-view-toolbars]').and(function(panel) {
                    ST.element(panel.innerElement).and(function(body){
                        expect(body.dom.innerHTML).toContain('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
                    });
                });
                //check if button is still pressed (for buttons in the middle)
                if(pressed){
                    if(button === buttonsMiddle[0]){
                        ST.button(button1).missingCls('x-pressed');
                    }
                    else {
                        ST.button(button1).hasCls('x-pressed');
                    }
                }
            });

        });
    }
    //other functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.beforeAll("#basic-toolbar", "#kitchensink-view-toolbars-toolbars");
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-toolbars-toolbars");
    });

    //------------------------------------------------tests-----------------------------------------------------------//

    describe('Check if panel is rendered', function () {
        Lib.panelRendered(panelText);
    });

    describe('Click on buttons and checked if pressed correctly', function(){
        describe('Click on left buttons', function () {
            for (var i = 0; i < buttonsLeft.length; i++) {
                testButtons(buttonsLeft[i]);
            }
        });

        describe('Click on middle buttons', function () {
            for (var i = 0; i < buttonsMiddle.length; i++) {
                testButtons(buttonsMiddle[i], true);
            }
        });

        describe('Click on right buttons', function () {
            for (var i = 0; i < buttonsRight.length; i++) {
                testButtons(buttonsRight[i]);
            }
        });
    });

    describe('Check special button deeper', function(){
        var notification = '2';
        var desc = 'Button ' + buttonsLeft[0] + 'contains notification ' + notification;
        it(desc, function () {
            var button = Components.button(buttonsLeft[0]);
            //has to be element for getting notification text in innerHTML
            ST.element(button)
                .hasCls('x-has-badge')
                .and(function (btn) {
                    expect(btn.dom.innerHTML).toContain(notification);
                });
        });
    });
});