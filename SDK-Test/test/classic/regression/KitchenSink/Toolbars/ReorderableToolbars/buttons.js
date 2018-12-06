/**
 * Toolbars and menus: Reorderable Toolbars
 * tested on:
 *          desktop:
 *              Chrome 49, 51
 *              Firefox 38, 45
 *              IE 11
 *              Opera 36
 *          tablet:
 *              Chrome 49
 *              Edge 13
 *              Safari 7
 *          mobile:
 *              Chrome 49
 *              Edge 13
 *          themes:
 *              Triton
 *              Neptune
 *              Neptune Touch
 *              Classic
 *              Crisp
 *          OS:
 *              Windows 7, 8, 10
 *              Android 5,6
 *              OSX - Safari 7
 *              WP 10
 */
describe("Checking all buttons", function() {
    //------------------------------------------------variables-------------------------------------------------------//
    
    var buttons = ['Copy', 'Format'];
    var splitButtons = ['Menu Button', 'Cut'];
    var menuButtons = ['Paste'];
    var menuItems = ['Menu Button 1', 'Cut Menu Item', 'Paste Menu Item'];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file LibraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        KitchenSink.app.redirectTo("#basic-toolbar");
    });

    //------------------------------------------------tests-----------------------------------------------------------//

    //var panelText = "panel[@componentCls=x-panel]";
    var panelText = "null][@componentCls=x-panel";

    describe('Check if panel is rendered', function () {
        Lib.panelRendered(panelText);
    });

    panelText = "panel[title=null][@componentCls=x-panel]";

    describe('Reorder buttons', function () {
        for (var i = 0; i < splitButtons.length; i++) {
            Lib.moveButtons(panelText, splitButtons[i]);
        }

        for (i = 0; i < menuButtons.length; i++) {
            Lib.moveButtons(panelText, menuButtons[i]);
        }

        for (i = 0; i < buttons.length; i++) {
            Lib.moveButtons(panelText, buttons[i]);
        }

    });

});