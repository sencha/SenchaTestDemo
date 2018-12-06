describe("startPanel", function () {
    var Start = {
        startButton : function () {
            return ST.button('button[iconCls=ux-start-button-icon]');
        },
        startPanel : function () {
            return ST.panel('panel[title="Don Griffin"]');
        },
        settings : function () {
            return ST.component('window[title="Change Settings"]');
        },
        tabWindowButton : function () {
            return ST.component('menuitem[iconCls=tabs]');
        },
        tabWindow : function () {
            return ST.component('window[title="Tab Window"]');
        }
    }

    it("Should show start panel when clicked on button", function () {
        Start.startButton()
            .click();
        Start.startPanel()
            .visible()
            .and(function (panel) {
                panel.hide();
            })

    });
    describe ('Tab Window', function () {
        beforeAll(function () {
            Start.startButton()
                .click();
            Start.tabWindowButton()
                .click();
        });
        afterAll(function () {
            Start.tabWindow()
                .and(function (win) {
                    win.hide();
                });
        });
        it('check tabs', function () {
            ST.play([
                {type: "tap", target: "tab[text=Tab Text 2]"},
                {type: "tap", target: "tab[text=Tab Text 3]"},
                {type: "tap", target: "tab[text=Tab Text 4]"}
            ]);

        });
        describe("Toolbar tools", function () {
            it('Maximize tool should expand window', function () {
                ST.component('tool[type=maximize]:first')
                    .visible()
                    .click();
            });
            it('Minimize tool should minimize window', function () {
                ST.component('tool[type=minimize]:first')
                    .visible().click();
            });
            it('should re-open minimized window', function () {
                ST.button('button[text=Tab Window]')
                    .visible()
                    .click();
            });
            it('Close tool should close window', function () {
                ST.component('tool[type=close]:first')
                    .visible()
                    .click();
            });
        });
    });
    describe('Settings', function () {
        beforeAll(function () {
            Start.startButton()
                .click();
        });
        afterAll(function () {
            Start.settings()
                .and(function (win) {
                    win.close();
                });
        });
        it('should open when clicked in menu', function () {
            ST.play([
                {type: "tap", target: "button[text=Settings]"}
            ]);
            Start.settings()
                .visible();
        });
        it('Select theme', function () {
            ST.play([
                {type: "tap", target: "treeview => [data-recordindex=\"2\"]", x: 50},
                {type: "tap", target: "treeview => [data-recordindex=\"3\"]", x: 50},
                {type: "tap", target: "treeview => [data-recordindex=\"6\"]", x: 50}
            ]);

        });
    });




});