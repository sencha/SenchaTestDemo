describe("webDesktopGrid", function () {

    var Dash = {
        gridColumn: function (columnName) {
            return ST.component('gridcolumn[text=' + columnName + ']');
        },
        gridWindow: function () {
            return ST.grid('grid');
        },
        isDesktop: ST.os.deviceType == "Desktop"
    };

    describe("Example loads correctly", function () {
        it("Web desktop page screenshot should match baseline", function () {
            Lib.screenshot('Web_Desktop');
        });
    });

    it('click', function () {
        ST.element('>> #GridWindow-shortcut').click();
    });

    describe('Grid Actions', function () {
        var gridStore;
        beforeAll(function () {
            Dash.gridWindow()
                .viewReady()
                .and(function (grid) {
                    gridStore = grid.getStore();
                });
        });

        describe('columns are sortable', function () {
            afterAll(function (next) {
                Dash.gridWindow()
                    .and(function (grid) {
                        //reset sorting after tests
                        grid.getView().getScrollable().scrollBy(-1000, 0);
                        grid.getStore().getSorters().clear();
                        grid.getStore().load(next);
                    });
            });

            describe('by clicking on header', function () {
                var sorter;
                it('\'Company\' should sort emails by sender ASC', function () {
                    Dash.gridColumn('Company')
                        .click(10, 10)
                        .wait(50)
                        .and(function () {
                            sorter = gridStore.getSorters().getAt(0);
                            expect(sorter.getDirection()).toBe('ASC');
                            expect(sorter.getProperty()).toBe('company');
                            expect(gridStore.getAt(0).get('company')).toBe('3m Co');
                        });
                });
                it('\'Price\' should sort emails by Title ASC', function () {
                    Dash.gridColumn('Price')
                        .click(10, 10)
                        .and(function () {
                            sorter = gridStore.getSorters().getAt(0);
                            expect(sorter.getDirection()).toBe('ASC');
                            expect(sorter.getProperty()).toBe('price');
                            expect(gridStore.getAt(0).get('price')).toBe(19.88);
                        });
                });

                it('\'Change\' should sort emails by Title ASC', function () {
                    Dash.gridColumn('Change')
                        .click(10, 10)
                        .wait(50)
                        .and(function () {
                            sorter = gridStore.getSorters().getAt(0);
                            expect(sorter.getDirection()).toBe('ASC');
                            expect(sorter.getProperty()).toBe('change');
                            expect(gridStore.getAt(0).get('change')).toBe(-0.48);
                        });
                });
                it('\'%Change\' should sort emails by Title ASC', function () {
                    Dash.gridColumn('% Change')
                        .click(10, 10)
                        .wait(50)
                        .and(function () {
                            sorter = gridStore.getSorters().getAt(0);
                            expect(sorter.getDirection()).toBe('ASC');
                            expect(sorter.getProperty()).toBe("pctChange");
                            expect(gridStore.getAt(0).get("pctChange")).toBe(-1.54);
                        });
                });
            });
        });

        describe('by using header menu', function () {
            function sortColumnDesc(text, prop, expectedVal) {
                var sorter, x, y;
                if (Dash.isDesktop) {
                    //1st we need to show header menu trigger for desktop and then open menu
                    ST.play([
                        {type: "mouseover", target: 'gridcolumn[text=' + text + ']', x: 15, y: 2},
                        {
                            type: "mouseover",
                            target: 'gridcolumn[text=' + text + '] => div.x-column-header-trigger',
                            x: -25
                        }
                    ]);
                    ST.component('gridcolumn[text=' + text + '] => div.x-column-header-trigger')
                        //.wait(500)
                        .click();
                } else {
                    //or open header menu on tablet
                    ST.component('gridcolumn[text=' + text + ']').and(function (col) {
                        x = col.getWidth() - 5;
                        y = col.getHeight();
                        ST.component('gridcolumn[text=' + text + ']').click(x, y / 2);
                    });

                }
                ST.component('menuitem[text="Sort Descending"]')
                    .click()
                    .and(function () {
                        sorter = gridStore.getSorters().getAt(0);
                        expect(sorter.getDirection()).toBe('DESC');
                        expect(sorter.getProperty()).toBe(prop);
                        expect(gridStore.getAt(0).get(prop)).toEqual(expectedVal);
                    });
                if (Dash.isDesktop) {
                    ST.play([
                        {type: "mouseout", target: 'gridcolumn[text=' + text + ']', x: 15, y: 2} //remove highlight from column as would happen when user moves mouse out of column
                    ]);
                }
            }

            it('\'From\' should sort DESC', function () {
                sortColumnDesc('Company', 'company', 'Walt Disney Company (The) (Holding Company)');
            });
            it('\'Title\' should sort DESC', function () {
                sortColumnDesc('Price', 'price', 71.72);
            });
            it('\'Received\' should sort DESC', function () {
                sortColumnDesc('Change', 'change', 1.09);
            });
        });
    });

    describe("Buttons should be clickable", function () {

        it('Button Add Something', function () {
            ST.button('button[text=Add Something]')
                .visible()
                .click();
        });
        it('Button Options', function () {
            ST.button('button[text=Options]')
                .visible()
                .click();
        });
        it('Button Remove Something', function () {
            ST.button('button[text=Remove Something]')
                .visible()
                .click();
        });
    });

    it('Take a screenshot', function () {
        // comparing actual screen with expected screen
        Lib.screenshot('webGrid');
    });

    describe("Tools should work", function () {

        it('maximize grid', function () {
            ST.component('tool[type=maximize]:first')
                .visible().click()
                .and(function () {
                    ST.panel('panel[title=Grid Window]{isVisible()}')
                        .and(function (panel) {
                            expect(panel.getWidth()).toBe(Ext.first('viewport').getWidth());
                            expect(panel.getHeight()).toBe(Ext.first('viewport').getHeight() - 36); // 36px is height of navigation strip
                        });
                });
        });

        it('minimize grid', function () {
            ST.component('tool[type=minimize]:first')
                .visible().click();
        });

        it('re-open grid', function () {
            ST.button('button[text=Grid Window]')
                .visible().click()
                .and(function () {
                    ST.panel('panel[title=Grid Window]{isVisible()}')
                        .and(function (panel) {
                            expect(panel.getWidth()).toBe(Ext.first('viewport').getWidth());
                            expect(panel.getHeight()).toBe(Ext.first('viewport').getHeight() - 36); // 36px is height of navigation strip
                        });
                });
        });

        it('Close grid', function () {
            ST.component('tool[type=close]:first')
                .visible()
                .click();
        });
    });
});
