describe('Breadcrumb.js', function() {
    var splitButtons = ['app', 'grid', 'menu', 'tab'];
    var menulist = ['Application.js', 'Grid.js', 'CheckItem.js', 'Bar.js'];
    var NormalButtons = ['ActionSheet.js', 'Audio.js', 'Button.js', 'Component.js', 'Container.js', 'Editor.js', 'Gadget.js', 'Img.js', 'LoadMask.js', 'MessageBox.js', 'Panel.js', 'Sheet.js'];

    beforeAll(function() {
        KitchenSink.app.redirectTo('#breadcrumb-toolbar');
        ST.wait(4000);
    });

    describe('Checking  splitbutton- Breadcrumb Navigation', function() {
        if ((ST.browser.is('IE'))) {
            it('check for Splitbutton Breadcrumb Navigation', function() {
                ST.element('splitbutton[text=Ext JS]').click();
                ST.element('splitbutton[text=Ext JS] => .x-splitArrow-el').click();
                ST.component('menuitem:nth-child(1)').click();
                ST.button('splitbutton:nth-child(2) => .x-splitArrow-el').click();
                ST.component('menuitem[_text="' + menulist[0] + '"]').click();
                ST.component('splitbutton[_text="' + menulist[0] + '"]').click()
                    .visible().and(function(el) {
                        var buttonname = menulist[0]
                        expect(el._text).toContain(buttonname);
                    });
                ST.element('splitbutton[text=Ext JS]').click();
                ST.element('splitbutton[text=Ext JS] => .x-splitArrow-el').click();
                ST.component('menuitem:nth-child(5)').click();
                ST.component('splitbutton[_text="' + NormalButtons[0] + '"]').click()
                    .visible().and(function(el) {
                        var b1 = NormalButtons[0]
                        expect(el._text).toContain(b1);

                    });
            });
        } else {
            for (let i = 1; i < 5; i++) {
                it('check for Splitbutton ' + splitButtons[i - 1] + ' Breadcrumb Navigation', function() {
                    ST.element('splitbutton[text=Ext JS]').click();
                    ST.element('splitbutton[text=Ext JS] => .x-splitArrow-el').click();
                    ST.component('menuitem:nth-child(' + i + ')').click();
                    ST.button('splitbutton:nth-child(2) => .x-splitArrow-el').click();
                    ST.component('menuitem[text="' + menulist[i - 1] + '"]').click();
                    ST.component("splitbutton[_text=" + menulist[i - 1] + "]").click()
                        .visible().and(function(el) {
                            var buttonname = menulist[i - 1]
                            expect(el._text).toContain(buttonname);
                        });
                });
            }
            for (let p = 5; p < 17; p++) {
                it('check for ' + NormalButtons[p - 5] + ' Breadcrumb Navigation ', function() {
                    ST.element('splitbutton[text=Ext JS]').click();
                    ST.element('splitbutton[text=Ext JS] => .x-splitArrow-el').click();
                    ST.component('menuitem:nth-child(' + p + ')').click();
                    ST.component("splitbutton[_text=" + NormalButtons[p - 5] + "]").click()
                        .visible()
                        .and(function(el) {
                            var buttonname = NormalButtons[p - 5];
                            expect(el._text).toContain(buttonname);

                        });
                });
            }
        }
    });

    describe('Checking  Normalbutton- Breadcrumb Navigation', function() {
        if ((ST.browser.is('IE'))) {
            it('check for NormalButton Breadcrumb Navigation', function() {
                ST.button('button[text="Ext JS"][xtype="button"]').click();
                ST.component('menu:nth-child(2) menuitem:nth-child(1)').click();
                ST.button('button[text="' + splitButtons[0] + '"]').click();
                ST.component('menu:nth-child(3) menuitem[text="' + menulist[0] + '"]').click();
                ST.button('breadcrumbbar:nth-child(2) button[text="' + menulist[0] + '"]').click()
                    .visible().and(function(el) {
                        var b1 = menulist[0]
                        expect(el._text).toContain(b1);
                    });
                ST.button('button[text="Ext JS"][xtype="button"]').click();
                ST.component('menu:nth-child(2) menuitem:nth-child(5)').click();
                ST.button('breadcrumbbar:nth-child(2) button[text="' + NormalButtons[0] + '"]').click()
                    .visible().and(function(el) {
                        var buttonname = NormalButtons[0];
                        expect(el._text).toContain(buttonname);
                    });
            });
        } else {
            for (let i = 1; i < 5; i++) {
                it('check for Normal ' + splitButtons[i - 1] + ' Breadcrumb Navigation', function() {
                    ST.button('button[text="Ext JS"][xtype="button"]').click();
                    ST.component('menu:nth-child(2) menuitem:nth-child(' + i + ')').click();
                    ST.button('button[text="' + splitButtons[i - 1] + '"]').click();
                    ST.component('menu:nth-child(3) menuitem[text="' + menulist[i - 1] + '"]').click();
                    ST.button('breadcrumbbar:nth-child(2) button[text="' + menulist[i - 1] + '"]').click()
                        .visible().and(function(el) {
                            var buttonname = menulist[i - 1]
                            expect(el._text).toContain(buttonname);
                        });
                });
            }
            for (let p = 5; p < 17; p++) {
                it('check for Normal ' + NormalButtons[p - 5] + ' Breadcrumb Navigation ', function() {
                    ST.button('button[text="Ext JS"][xtype="button"]').click();
                    ST.component('menu:nth-child(2) menuitem:nth-child(' + p + ')').click();
                    ST.button('breadcrumbbar:nth-child(2) button[text="' + NormalButtons[p - 5] + '"]').click()
                        .visible()
                        .and(function(el) {
                            var buttonname = NormalButtons[p - 5];
                            expect(el._text).toContain(buttonname);

                        });
                });
            }
        }
    });
});