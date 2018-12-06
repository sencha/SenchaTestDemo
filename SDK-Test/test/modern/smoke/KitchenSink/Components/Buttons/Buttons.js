/********************
 * @file Buttons.js
 * Buttons
 *
 * @TODO Needs refactoring, now it performs just basic check of buttons
 *
 * Tested on : Chrome, FF, IE11, Edge, Android 4.4 tablet && phone, iOS 10 tablet && phone, Android 7 phone, WP10, Safari 10 Mac OSX, iOS 7, 8 tablet
 * Passed on : Chrome, FF, IE11, Edge, Android 4.4 tablet && phone, iOS 10 tablet && phone, Android 7 phone, WP10, Safari 10 Mac OSX
 * Failed on : iOS 7, 8 tablet
 ********************/

describe("Buttons", function () {
    var prefix = 'buttons-basic ';
    //var buttons = ['Normal', 'Decline', 'Confirm', 'Disabled', 'Menu', 'null][iconCls=x-fa fa-home', 'Icon][iconCls=x-fa fa-home'];
    var buttons = ['Normal][menu=null', 'Badge][menu=null', 'Disabled][menu=null', 'Menu' ,'null][iconCls=x-fa fa-home'];
    var btnClassesNormal = ['null][shadow!=true', 'alt', 'raised'];
    var btnClassesBadge = ['null][shadow!=true', 'alt', 'raised'];
    var btnClassesDisabled = ['null][disabled=true][shadow!=true', 'alt][disabled=true', 'raised][disabled=true'];
    var btnMenuTxt = ['Normal','Badge','Disabled'];
    var btnClassesIcon = ['null][iconCls=x-fa fa-home][disabled!=true][badgeText!=2', 'null][shadow!=true][badgeText=2','null][disabled=true'];
    var btnClassesDecline = ['decline][shadow!=true', 'action decline', 'round decline', 'decline][shadow=true'];
    var btnClassesConfirm = ['confirm][shadow!=true', 'action confirm', 'round confirm', 'confirm][shadow=true'];
    //var btnClassesDisabled = ['null][disabled=true][shadow!=true', 'action][disabled=true', 'round][disabled=true', 'null][disabled=true][shadow=true'];
    var btnClassesMenu = ['null][disabled!=true][shadow!=true][badgeText!=2', 'decline', 'confirm', 'null][disabled=true'];
    //var btnClassesIcon = ['null][iconCls=x-fa fa-home][disabled!=true][badgeText!=2', 'decline][iconCls=x-fa fa-home'];
    var btnClassesIconText = ['confirm][iconCls=x-fa fa-home', 'null][iconCls=x-fa fa-home][disabled=true'];

    var classes = [ 'x-component-action', 'x-component-alt', 'x-component-confirm', 'x-component-decline'];

    function notCointainCls(btn, number, offsetQuery) {
        var button1 = Components.button(btn, number);
        if(Lib.isPhone && offsetQuery) {
            var offset = Ext.first(offsetQuery).el.dom.offsetTop;
            ST.component('buttons').and(function (example) {
                offset += Ext.first(button1).el.dom.offsetTop;
                example.getScrollable().scrollTo(0, offset);
            });
        }
        ST.play([
            // press button
            {type: "mouseenter", target: button1},
            {type: "mousedown", target: button1}
        ]);
        //class depends on toolkit
        var cls = 'x-pressing';
        ST.button(button1).missingCls(cls);

        ST.play([
            {type: "mouseleave", target: button1},
            {type: "mouseup", target: button1}
            //{ type: "click", target: button1 }
        ]);
    }

    beforeAll(function () {
        // redirect to page Components>Buttons
        Lib.beforeAll("#buttons-basic", prefix);
    });
    afterAll(function () {
        Lib.afterAll(prefix);
    });

    var Buttons = {
        getBtn : function (text,ui) {
            var locator = prefix + 'button[text='+text+']'+ (ui?'[_ui=' + ui + ']':'');
            console.log(locator);
            return ST.button(locator);
        },
        getMenuBtn : function (text) {
            var locator = prefix + 'button[text='+text+']{getMenu()}';
            console.log(locator);
            return ST.button(locator);
        }
    };

    // buttons are loaded correctly
    describe("Buttons are loaded correctly", function () {
        describe(buttons[0] + ' buttons', function () {
            btnClassesNormal.forEach(function(cls) {
                it('with ui = ' +cls+ ' is loaded', function(){
                    Buttons.getBtn(buttons[0], cls)
                        .visible()
                        .and(function (component) {
                            expect(component.isVisible()).toBeTruthy()
                        });
                });
            });
        });

        describe(buttons[1] + ' buttons are loaded', function () {
            btnClassesBadge.forEach(function(cls) {
                it('with ui = ' +cls+ ' is loaded', function(){
                    Buttons.getBtn(buttons[1], cls)
                        .visible()
                        .and(function (component) {
                            expect(component.isVisible()).toBeTruthy()
                        });
                });
            });
        });

        describe(buttons[2] + ' buttons are loaded', function () {
            btnClassesDisabled.forEach(function(cls) {
                it('with ui = ' +cls+ ' is loaded', function() {
                    Buttons.getBtn(buttons[2], cls)
                        .visible()
                        .and(function (component) {
                            expect(component.isVisible()).toBeTruthy()
                        });
                });
            });
        });

        describe(buttons[3] + ' buttons are loaded', function () {
            btnMenuTxt.forEach(function(txt) {
                it('menu button with text = ' +txt+ ' is loaded', function() {
                    Buttons.getMenuBtn(txt)
                        .visible()
                        .and(function (component) {
                            expect(component.isVisible()).toBeTruthy()
                        });
                });
            });
        });

        describe(buttons[4] + ' buttons are loaded', function () {
            btnClassesIcon.forEach(function(cls) {
                it('with  = ' +cls+ ' is loaded', function() {
                    Buttons.getBtn(buttons[4], cls)
                        .visible()
                        .and(function (component) {
                            expect(component.isVisible()).toBeTruthy()
                        });
                });
            });
        });
        it('Screenshots should be same', function () {
            Lib.screenshot('modern_buttons');
        })
    });

   /* describe('Button click',function () {
        [0, 1, 2].forEach(function(numberBtn){
            [1, 2, 3, 4].forEach(function(number) {
                var query = "phone-buttons container[xtype=container]:nth-child("+ (number*2 - 1) +")";
                Lib.testButtons(prefix,buttons[numberBtn], number, undefined, query);
            });
        });

        [1, 2, 3, 4].forEach(function(number) {
            it('When click on ' + number + '. button with text ' + buttons[3], function () {
                var query = "phone-buttons container[xtype=container]:nth-child("+ (number*2 - 1) +")";
                notCointainCls(buttons[3], number, query);
            });
        });

        [1, 2, 3].forEach(function(number) {
            var query = "phone-buttons container[xtype=container]:nth-child("+ 9 +")";
            Lib.testButtons(prefix,buttons[4], number, undefined, query);
        });
        it('When click on ' + 4 + '. (5. in desktop) button with text ' + buttons[4], function () {
            if(Lib.isPhone){
                var query = "phone-buttons container[xtype=container]:nth-child("+ 9 +")";
                notCointainCls(buttons[4], 4, query);
            }
            else{
                notCointainCls(buttons[4], 5);
            }
        });

        [1, 2].forEach(function(number) {
            var query = "phone-buttons container[xtype=container]:nth-child("+ 11 +")";
            Lib.testButtons(prefix,buttons[5], number, undefined, query);
        });

        var query = "phone-buttons container[xtype=container]:nth-child("+ 11 +")";
        Lib.testButtons(prefix,buttons[6], 1, undefined, query);

        it('When click on ' + 4 + '. button with text ' + buttons[6], function () {
            var query = "phone-buttons container[xtype=container]:nth-child("+ 11 +")";
            notCointainCls(buttons[6], 2, query);
        });

    });

    describe('Button check classes',function () {
        it('Check classes for Action buttons', function () {
            var counter = 0;
            [btnClassesNormal, btnClassesDecline, btnClassesConfirm, btnClassesDisabled].forEach(function(classes) {
                Buttons.getBtn(buttons[counter++], classes[1])
                    .visible()
                    .hasCls('x-button-action')
                    .hasCls('x-component-action')
                    .and(function(btn){
                        expect(btn.el.dom.className).toContain('x-button-action');
                        expect(btn.el.dom.className).toContain('x-component-action');
                    });
            });
        });

        it('Check classes for Round buttons', function () {
            var counter = 0;
            [btnClassesNormal, btnClassesDecline, btnClassesConfirm, btnClassesDisabled].forEach(function(classes) {
                Buttons.getBtn(buttons[counter++], classes[2])
                    .visible()
                    .hasCls('x-button-round')
                    .hasCls('x-component-round')
                    .and(function(btn){
                        expect(btn.el.dom.className).toContain('x-button-round');
                        expect(btn.el.dom.className).toContain('x-component-round');
                    });
            });
        });

        it('Check classes for Raised buttons', function () {
            var counter = 0;
            [btnClassesNormal, btnClassesDecline, btnClassesConfirm, btnClassesDisabled].forEach(function(classes) {
                Buttons.getBtn(buttons[counter++], classes[3])
                    .visible()
                    .hasCls('x-shadow')
                    .and(function(btn){
                        expect(btn.el.dom.className).toContain('x-shadow');
                    });
            });
        });

        it('Check classes for Menu buttons', function () {
            [0,1,2,3].forEach(function(counter) {
                Buttons.getBtn(buttons[4], btnClassesMenu[counter])
                    .visible()
                    .hasCls('x-has-menu')
                    .hasCls('x-arrow-align-right')
                    .and(function(btn){
                        expect(btn.el.dom.className).toContain('x-has-menu');
                        expect(btn.el.dom.className).toContain('x-arrow-align-right');
                    });
            });
        });

        it('Check classes for Icon 1. and 2. buttons', function () {
            [0,1].forEach(function(counter) {
                Buttons.getBtn(buttons[5], btnClassesIcon[counter])
                    .visible()
                    .hasCls('x-has-icon')
                    .and(function(btn){
                        expect(btn.el.dom.className).toContain('x-has-icon');
                    });
            });
        });

        it('Check classes for Icon 3. and 4. buttons', function () {
            [0,1].forEach(function(counter) {
                Buttons.getBtn(buttons[6], btnClassesIconText[counter])
                    .visible()
                    .hasCls('x-has-icon')
                    .and(function(btn){
                        expect(btn.el.dom.className).toContain('x-has-icon');
                    });
            });
        });

    });

    describe('Button Menu', function () {
        it('Should be able to open menu when button is enabled', function () {
            if(Lib.isPhone) {
                var query = "phone-buttons container[xtype=container]:nth-child(" + 11 + ")";
                var offset = Ext.first(query).el.dom.offsetTop;
                Ext.first('buttons').getScrollable().scrollTo(0, offset);
            }
            [0,1,2].forEach(function(counter) {
                Buttons.getBtn(buttons[4], btnClassesMenu[counter])
                    .click()
                    .and(function(menuBtn){
                        var menu = menuBtn.getMenu();
                        expect(menu).not.toBe(null);
                        expect(menu.isVisible()).toBe(true);

                        ST.component('#' + menu.getId())
                            .click();
                    });
                Lib.waitOnAnimations();
                Buttons.getBtn(buttons[4], btnClassesMenu[counter])
                    .and(function(menuBtn){
                        var menu = menuBtn.getMenu();
                        expect(menu.isVisible()).toBe(false);
                    });
            });
        });

        it('Should not be able to open menu when button is disabled', function () {
            Buttons.getBtn(buttons[4], btnClassesMenu[3])
                .click()
                .and(function(btn){
                    var menu = btn.getMenu();
                    expect(menu.isVisible()).toBe(false);
                });
        });
    });*/

    describe('Source code', function(){
        it('should open, check and close', function(){
            Lib.sourceClick('KitchenSink.view.buttons.Buttons');
        });
    });
});
