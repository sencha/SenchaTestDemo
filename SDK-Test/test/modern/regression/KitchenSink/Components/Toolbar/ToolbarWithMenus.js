/**
 * @file ToolbarWithMenus.js
 * @name Component/Toolbars/ToolbarWithMenus.js
 * @created 2017/8/4
 */

describe("Toolbars with Menus", function() {
    var prefix = '#kitchensink-view-toolbars-toolbarmenus ';

    var examplePrefix = "toolbar-menus";

    var but,menuItems,radioOptions;

    var Toolbars = {
        myButtonToggle : function() {
            return ST.button(prefix + 'button[text^=Toggle]');
        },
        myButtonMenu : function() {
            return ST.button(prefix + 'button:first');
        },
        myComp : function(id) {
            return ST.component('component[id='+id+']');
        },
        hideMenu: function() {
			return Ext.first(prefix + 'button').getMenu().hide()
		},
        checkMenuItem: function(object){
            Toolbars.myComp(object.id)
                .and(function(){
                    Toolbars.clickOn(object)
                })
                .wait(function(cmp){
                    return Ext.first('sheet').isVisible();
                })
                .wait(function(cmp) {
                    return Ext.first('sheet').el.dom.textContent === 'You checked the "'+cmp.getText()+'" menu item.';
                })
                .and(function(){
                    expect(object.getChecked()).toBe(true);
                })
                .and(function(){
                    ST.component('sheet:first')
                        .down('=> div.x-toast-text')
                        .and(function(toast) {
                            expect(toast.dom.textContent).toContain(object.getText());
                        })
                        .hidden();
                })
        },
        clickOn: function(object){
            ST.play([
                { type: "mousedown", target: object.el },
                { type: "mouseup", target: object.el },
                { type: "click", target: object.el}
            ]);
        }
    }

    beforeAll(function() {
        Lib.beforeAll('#' + examplePrefix, examplePrefix);
        ST.wait(function(){
                return Ext.ComponentQuery.query(prefix + 'button').length > 1;
            })
            .and(function(){
                Toolbars.myButtonMenu()
                    .click()
                    .and(function(){
                        but = Ext.ComponentQuery.query(prefix + 'button');
                        menuItems = Ext.first(prefix + 'button').getMenu().getInnerItems();
                    })
                    .click();
            });
    });

    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });

    describe("Example loads correctly", function () {
        it("should load correctly", function() {
            Lib.screenshot("UI_toolbars_toolbarWithMenus");
        });
    });

    describe("Button w/ Menu", function () {

        describe("Check items",function(){

            beforeAll(function() {
                Toolbars.myButtonMenu()
                    .click()
                    .wait(function(){
                        return Ext.ComponentQuery.query(prefix + 'button').length > 1;
                    })
            });

            afterAll(function () {
                Toolbars.hideMenu();
            })

            it('Test of checkItem "I like Ext JS"', function(){
                Toolbars.myComp(menuItems[3].id)
                    .click()
                    .wait(function(){
                        return Ext.first('sheet').isVisible();
                    })
                    .and(function(){
                        expect(Ext.first('sheet:visible').getInnerItems()[0].getHtml()).toBe('You unchecked the "I like Ext JS" menu item.');
                    })
                    .wait(function(){
                        return Ext.ComponentQuery.query(menuItems[3].getChecked()) !== false;
                    })
                    .and(function(){
                        expect(menuItems[3].getChecked()).toBe(false);
                    })
                    .click()
                    .wait(function(){
                        return Ext.first('sheet').isVisible();
                    })
                    .wait(function(){
                        return Ext.first('sheet:visible').el.dom.textContent ==='You checked the "I like Ext JS" menu item.';
                    })
                    .and(function(cmp){
                        expect(Ext.first('sheet:visible').getInnerItems()[0].getHtml()).toBe('You checked the "I like Ext JS" menu item.')
                    })
                    .wait(function(cmp){
                        return cmp.getChecked() === true;
                    })
                    .and(function(){
                        expect(menuItems[3].getChecked()).toBe(true);
                    })
            });

            it('Test of checkItem "Intended"', function(){
                Toolbars.myComp(menuItems[4].id)
                    .click()
                    .wait(function(){
                        return Ext.ComponentQuery.query(menuItems[4].getChecked()) !== false;
                    })
                    .wait(function(){
                        return menuItems[4].el.dom.className.indexOf('x-indented') < 0
                    })
                    .and(function(){
                        expect(menuItems[4].getChecked()).toBe(false);
                    })
                    .and(function(){
                        expect(menuItems[4].el.dom.className).not.toContain('x-indented');
                    })
                    .click()
                    .wait(function(){
                        return menuItems[4].getChecked() == true;
                    })
                    .wait(function(){
                        return menuItems[4].el.dom.className.indexOf('x-indented') > 0;
                    })
                    .and(function(){
                        expect(menuItems[4].getChecked()).toBe(true);
                    })
                    .and(function(){
                        expect(menuItems[4].el.dom.className).toContain('x-indented');
                    });
            });

            it('Test of checkItem "Disabled item"', function(){
                Toolbars.myComp(menuItems[5].id)
                    .and(function(){
                        expect(menuItems[5].el.dom.className).toContain('x-disabled');
                    });
            });

            it('Test of menuCheckItem ', function(){
                var menuCheckOption;

                Toolbars.myComp(menuItems[6].id)
                    .and(function(menuitem){
                        ST.play([
                            // mouse over button to show menu on desktops
                            {type: "mouseover", target: menuitem.el},
                            {type: "mouseenter", target: menuitem.el}
                        ]);
                    })
                    // and click to make sure that menu is shown also on touch devices
                    .click()
                    .and(function(menuitem){
                        menuCheckOption = menuitem.getMenu().getInnerItems();
                    })
                    .and(function(){
                        Toolbars.checkMenuItem(menuCheckOption[1]);
                    })
                    .and(function(){
                        Toolbars.checkMenuItem(menuCheckOption[2]);
                    })
                    .and(function(){
                        Toolbars.checkMenuItem(menuCheckOption[3]);
                    });
            });

            it('Test of menu Radio Options ', function(){
                var radioOptions
                Toolbars.myComp(menuItems[7].id)
                    .and(function(menuitem){
                        ST.play([
                            // mouse over button to show menu on desktops
                            {type: "mouseover", target: menuitem.el},
                            {type: "mouseenter", target: menuitem.el}
                        ]);
                    })
                    .click(0,10)
                    .and(function(menuitem){
                        radioOptions = menuitem.getMenu().getInnerItems();
                    })
                    .and(function(){
                        Toolbars.checkMenuItem(radioOptions[1]);
                    })
                    .and(function(){
                        Toolbars.checkMenuItem(radioOptions[2]);
                    })
                    .and(function(){
                        Toolbars.checkMenuItem(radioOptions[3]);
                    });
            });
        });
    });

    describe('Test of Menu Selectfield ', function(){

        beforeAll(function() {
            Toolbars.myButtonMenu()
                .click()
                .wait(function(){
                    return Ext.first(prefix + 'button').getMenu().isVisible()
                })
        });
        it('Open combobox and select Colorado - known issue for Phones EXTJS-26283', function(){
            Lib.Forms.testCombobox('menu selectfield:first','state','Colorado', 'CO')
        })
    });

    describe("Check button", function () {
        it("Button should change toogle after click", function(){
            Toolbars.myButtonToggle()
                .and(function(button){
                    expect(button.el.dom.className).toContain(button.pressedCls);
                })
                .click()
                .wait(function(){
                    return Ext.first('sheet').isVisible();
                })
                .and(function(){
                    ST.component('sheet:first')
                        .down('=> div.x-toast-text')
                        .and(function(toast) {
                            if (Lib.isPhone){expect(toast.dom.textContent).toBe('Button "Toggle" was toggled to unpressed.')}
                            else {expect(toast.dom.textContent).toBe('Button "Toggle Me" was toggled to unpressed.');}
                        })
                        .hidden();
                })
                .wait(function(button){
                    return !button.el.dom.className.includes(button.pressedCls);
                })
                .click()
                .wait(function(){
                    return Ext.first('sheet').isVisible();
                })
                .and(function(){
                    ST.component('sheet:first')
                        .down('=> div.x-toast-text')
                        .and(function(toast) {
                            if (Lib.isPhone) {expect(toast.dom.textContent).toBe('Button "Toggle" was toggled to pressed.');
                            }
                            else {expect(toast.dom.textContent).toBe('Button "Toggle Me" was toggled to pressed.');}
                        })
                        .hidden();
                })
                .wait(function(button){
                    return button.el.dom.className.includes(button.pressedCls);
                })
        });
    });

    describe('Test of panel Selectfield ', function(){

        it('Open panel combobox and select California - known issue for Phones EXTJS-26283', function(){
            Lib.Forms.testCombobox(prefix + 'selectfield:first','state','California','CA')
        })
    });

    describe("Testing of source panel", function () {
        it("Source code", function() {
            Lib.sourceClick('controller.toolbar-menus');
        });
    });
});
