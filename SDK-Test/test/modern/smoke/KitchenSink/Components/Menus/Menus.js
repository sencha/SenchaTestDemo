/**
 * 28. 7. 2017
 * tested on:
 *      desktop:
 *          Chrome 59
 *          Edge 15
 *          FF 54
 *          IE 11
 *          Safari 11
 *      tablet:
 *          Edge 14
 *          Safari 10
 *          Android 7.1
 *      phone:
 *          Android 5, 6, 7.0
 *          Safari 9
 */
describe("Menus", function() {
    var exampleName = "Menus";
    var Menus = {
        buttonByText : function (text) {
            return ST.button('button[text="'+text+'"]');
        },
        menuBySide : function(side){
            return ST.component('actionsheet[side='+side+'][_hidden=false]');
        },
        menuButtonByText : function (text) {
            return ST.button('actionsheet[hidden=false] button[text="'+text+'"]');
        },
        checkMenu : function (side, btnText) {
            it('should show '+side+' menu when clicked on button', function () {
                Menus.buttonByText(btnText)
                    .click();
                Menus.menuBySide(side)
                    .visible()
                    .wait(function(menu){
                        return !menu.isAnimating;
                    })
                    .and(function (menu) {
                        expect(menu.getSide()).toBe(side);
                    })
                    // added teardown steps to hide menu
                    .and(function(){
                        Ext.Viewport.hideMenu(side);
                    })
                    .hidden();
            });
            //ORION-1350
            describe('dismiss menu', function(){
                var menu;
                beforeEach(function () {
                    Menus.buttonByText(btnText)
                        .visible()
                        .click();
                    Menus.menuBySide(side)
                        .visible()
                        .wait(function(menu){
                            return !menu.isAnimating;
                        })
                        .and(function (cmp) {
                            menu = cmp;
                        });
                });
                //hide proper menu after each spec
                afterEach(function(){
                    ST.component('actionsheet[side='+side+']').wait(function(menu){
                        return !menu.isAnimating;
                    }).hidden();

                    //just for sure due to bug EXTJS-24385
                    Ext.Viewport.hideAllMenus()
                });

                it('by clicking on "Settings" button', function(){
                    Menus.clickOnMenuButton('Settings',menu);
                });
                it('by clicking on "New Item" button', function(){
                    Menus.clickOnMenuButton('New Item',menu);
                });
                it('by clicking on "Star" button', function(){
                    Menus.clickOnMenuButton('Star',menu);
                });
                it('by clicking on mask', function(){
                    if(side === 'top'){
                        ST.element('>> div.x-float-wrap')
                            .down('>> div.x-mask')
                            .click();
                    }
                    else{
                        ST.element('>> div.x-mask')
                            .click();
                    }
                    ST.wait(function(){
                            return !menu.isVisible();
                        })
                        .and(function () {
                            var visible = menu.isVisible();
                            expect(visible).toBe(false);
                        });
                });
            });
        },
        clickOnMenuButton : function (text,menu) {
            Menus.menuButtonByText(text)
                .click()
                .wait(function(){
                    return !menu.isVisible();
                })
                .and(function () {
                    var visible = menu.isVisible();
                    expect(visible).toBe(false);
                });
        }
    };

    beforeAll(function() {
        Lib.beforeAll("#menus", "menus");
    });
    afterAll(function(){
        Ext.Viewport.hideAllMenus();
        Lib.afterAll("menus");
    });

    // Check if example is loaded correctly
    it("should load correctly", function() {
        Lib.checkExampleTitle(exampleName);
        Lib.screenshot("modern_Menus");
    });
    describe('Left menu', function () {
        var btnText = 'Toggle left menu';
        Menus.checkMenu('left',btnText);
    });
    describe('Right menu', function () {
        var btnText = 'Toggle right menu';
        Menus.checkMenu('right', btnText);
    });
    describe('Top menu', function () {
        var btnText = 'Toggle top menu';
        Menus.checkMenu('top', btnText);
    });
    describe('Bottom menu', function () {
        var btnText = 'Toggle bottom menu';
        Menus.checkMenu('bottom', btnText);
    });

    describe('Floating menu - TODO', function () {
        it("TODO", function(){
            pending('TODO');
        })
    });
});
