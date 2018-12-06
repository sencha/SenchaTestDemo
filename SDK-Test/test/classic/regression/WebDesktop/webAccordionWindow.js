describe("webAccordionWindow", function () {
    it("Click on icon Accordion Window", function () {
        ST.element('>> #AccordionWindow-shortcut').click();
    });

    var Dash = {
        windowPanelUsers: function (windowPanelUsers) {
            return ST.component('panel[title=Online Users]');
        },
        windowPanelSettings: function (windowPanelSettings) {
            return ST.component('panel[title=Settings]');
        },
        windowPanelMoreStuff: function (windowPanelMoreStuff) {
            return ST.component('panel[title=Even More Stuff]');
        },
        windowPanelMyStuff: function (windowPanelMyStuff) {
            return ST.component('panel[title=My Stuff]');
        },
        accordionButton: function (cls) {
            return ST.component('panel[title=Accordion Window] button[iconCls=' + cls + ']');
        }
    };

    it("Click on Panels", function () {

        Dash.windowPanelSettings().visible()
            .click();

        Dash.windowPanelMoreStuff().visible()
            .click();

        Dash.windowPanelMyStuff().visible()
            .click();

        Dash.windowPanelUsers().visible()
            .click();
    });

    describe("Click on toolbar buttons", function () {
        var FCls = ['connect', 'user-add', 'user-delete'];
        var counter = 0;

        function clickOnButtonFCls(FCls) {
            it('Button ' + FCls, function () {
                Dash.accordionButton(FCls)
                    .click();
            });
        }

        for (var i = 0; i < FCls.length; i++) {
            clickOnButtonFCls(FCls[counter++]);
        }
    });


    describe("Tools and buttons", function () {
        it('should maximize grid when clicked', function () {
            ST.component('panel[title=Accordion Window] tool[type=maximize]:first')
                .visible().click()
                .and(function () {
                    ST.panel('panel[title=Accordion Window]{isVisible()}')
                        .and(function (panel) {
                            expect(panel.getWidth()).toBe(Ext.first('viewport').getWidth());
                            expect(panel.getHeight()).toBe(Ext.first('viewport').getHeight() - 36); // 36px is height of navigation strip
                        });
                });
        });
        it('should minimize grid', function () {
            ST.component('panel[title=Accordion Window] tool[type=minimize]:first')
                .visible().click();
        });

        it('should re-open grid', function () {
            ST.button('button[text=Accordion Window]')
                .visible().click()
                .and(function () {
                    ST.panel('panel[title=Accordion Window]{isVisible()}')
                        .and(function (panel) {
                            expect(panel.getWidth()).toBe(Ext.first('viewport').getWidth());
                            expect(panel.getHeight()).toBe(Ext.first('viewport').getHeight() - 36); // 36px is height of navigation strip
                        });
                });
        });

        it('Close grid', function () {
            ST.component('panel[title=Accordion Window] tool[type=close]:first')
                .visible().click();
        });
    });

    it('Take a screenshot', function () {
        // comparing actual screen with expected screen
        Lib.screenshot('webAccordioWin');
    });

    it('Open and Close Node', function () {
        ST.play([
            {type: "tap", target: "dataview => [data-recordindex=\"1\"]", x: 50, y: 52},
            {type: "tap", target: "treeview => [data-recordindex=\"0\"]", x: 14, y: 14},
            {type: "tap", target: "treeview => [data-recordindex=\"1\"]", x: 18, y: 13}
        ]);
    });

    it('Tree should be refreshed', function () {
        ST.component('panel[title=Online Users] tool[type=refresh]')
            .visible().click();
    });

    it('Close grid', function () {
        ST.component('panel[title=Accordion Window] tool[type=close]:first')
            .visible().click();
    });
});
