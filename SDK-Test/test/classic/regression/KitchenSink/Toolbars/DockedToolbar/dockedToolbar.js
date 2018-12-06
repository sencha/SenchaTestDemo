/**
 * Toolbars and menus: Vertical Toolbars
 * tested 17. 1. 2017 on:
 *          desktop:
 *                  Firefox 45
 *                  IE 11
 *                  Edge 14
 *                  Chrome 55
 *                  Safari 8
 *          tablet:
 *                  Chrome 55
 *                  Safari 8
 *          mobile:
 *                  example (classic) is unsupported for mobile devices
 *          themes:
 *                  Neptune
 *                  Classic
 *                  Triton
 *                  Crisp Touch
 *          OS:
 *                  Win 10
 *                  OS X 10.10
 *                  Android 6
 *                  IOS 8
 */
describe("Checking all panels", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    //title of concrete panel - used for ST.component()
    var panels = ['Top', 'Right', 'Left', 'Bottom'];
    var panelsLocation = ['top', 'right', 'left', 'bottom'];
    var glyphCode = [61, 88, 70, 47];
    var textInPanel = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    var prefix = 'docked-toolbars';
    var panelText;

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file LibraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.beforeAll("#" + prefix, prefix);
    });

    afterAll(function(){
        Lib.afterAll(prefix);
    });

    //------------------------------------------------tests-----------------------------------------------------------//


    describe('Panels loaded, rendered and screenShot match', function () {
        for (var i = 0; i < panels.length; i++) {
            Lib.panelRendered(panels[i]);
            Lib.textInPanel(panels[i], textInPanel);
        }
        it('screenShot', function(){
            Lib.screenshot("vertical_toolbars");
        })
    });

    describe('Checking panel location', function(){
        var panelDirection;
        beforeAll(function(){
            panelDirection = Ext.ComponentQuery.query(prefix + ' panel toolbar');
        });

        Array.apply(null, Array(4)).map(function (_, i) {return i;}).forEach(function(i){
            it('Check if icon (glyph) code match in ' + i + '. panels', function(){
                expect(panelDirection[i].dock).toBe(panelsLocation[i]);
            });
        });
    });

    describe("Checking all buttons", function() {
        for(var panel = 0; panel < panels.length; panel++) {
            panelText = Components.panel(panels[panel]);

            describe('Click on buttons on ' + panelText + ' panel', function () {
                var numberOfButtons = 4;
                for (var i = 0; i < numberOfButtons; i++) {
                    Lib.testTabButtons(panelText, 'null', i+1);
                }
            });
        }
        panelText = Components.panel(panels[0]);
    });

    describe('Checking icons', function () {
        var numberOfButtons = 4;
        for(var panel = 0; panel < panels.length; panel++) {
            panelText = Components.panel(panels[panel]);
            it('Check if icon (glyph) code match in ' + panelText + ' panel', function(){
                for (var i = 0; i < numberOfButtons; i++) {
                    expect(Ext.ComponentQuery.query(panelText + ' button')[i].glyph.codepoint).toBe(glyphCode[i]);
                }
            });
        }
    });

});