/**
 * @file icons.js
 * @name Kitchen Sink (Modern)/Components/Icons/icons.js
 * @created 2016/07/18
 * 
 * Tested on: Ubuntu 16.04 (Chrome, Firefox), Android (4, 5), iOS (7, 8) Safari,
 *            Windows 10 (Edge, Chrome), Windows Phone 10 Edge
 * Sencha Test: 2.0.0.292
 * Passed on: All tested
 */
describe("Icons", function(){
    /**
     * Custom variables for application
     **/
    var examplePrefix = 'fa-icons ';
    var exampleUrlPostfix = '#fa-icons';
    var Icons = {
        getTabPanel: function(){
            return ST.component(examplePrefix);
        },
        getToolBarText: function(){
            return 'toolbar[id^=ext-toolbar]';
        },
        getTabBarText: function(){
            return 'tabbar[id^=ext-tabbar]';
        },
        /**
         * Copy of function from library because of checking panel content
         * @param button - it
         */
        testButtons: function(buttonText){
            var desc = 'Click on ' + buttonText + ' button';
            describe(desc, function(){
                var but = Components.button(buttonText);
                Lib.testButtons(Icons.getTabBarText(), buttonText);
                it('check content is properly updated', function () {
                    ST.component(examplePrefix + 'tab[title='+buttonText+']')
                        .click();
                    Icons.getTabPanel()
                        .wait(function (panel) {
                            return panel.getActiveItem().title === buttonText;
                        })
                        .and(function(panel){
                            var txtToCheck = buttonText==='Info'?'Font Awesome':buttonText;
                            expect(panel.getActiveItem().getHtml()).toContain(txtToCheck);
                        });
                    ST.button(but).hasCls('x-active');
                });

            });
        },
    };
    var buttonsText = ['Info', 'Download', 'Favorites', 'Bookmarks', 'More'];
    beforeAll(function(){
        Lib.beforeAll(exampleUrlPostfix, examplePrefix, 200);
    });
    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });
    describe('Default display UI', function(){
        it('Should load correctly', function(){
            Icons.getTabPanel().visible().rendered();
            Lib.screenshot('UI_appMain_Icons');
        });
        it('Page is visible and rendered', function(){
            Icons.getTabPanel().visible()
                .and(function(){
                    expect(this.future.cmp.isRendered()).toBeTruthy();
                });
        });
    });
    describe('Click on button icons and checked if pressed correctly', function(){
        for (var i = 1; i <= 6; i++){
            Lib.testButtons(Icons.getToolBarText(), null, i);
        }
    });
    describe('Click on button tabs and checked if pressed correctly', function(){
        for (var i = 1; i < buttonsText.length; i++){
            Icons.testButtons(buttonsText[i]);
        }
        Icons.testButtons(buttonsText[0]);
    });
    describe('Source code', function(){
        it('Source code view should work correctly', function(){
            Lib.sourceClick('KitchenSink.view.icons.Icons');
        });
    });
});
