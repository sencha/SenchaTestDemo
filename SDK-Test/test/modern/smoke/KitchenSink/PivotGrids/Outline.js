/**
 * @file Outline.js
 * @date 6.9.2016
 *
 * Tested on: Firefox, Chrome, Opera, Android6, iOS9 tablet/phone, Edge Win10phone
 * Passed on: all tested
 */
describe('Pivot Grid - Outline example', function () {

    var Grid = {
        getRowCount: function () {
            return Ext.first('grid{isVisible()}').getStore().data.length;
        },
        getColumns: function () {
            return Ext.first('grid{isVisible()}').getColumns();
        },
        getVisibleRowCount: function () {
            return Ext.dom.Element.query('.x-gridrow').length;
        },
        grid: function(){
            return ST.grid('grid{isVisible()}');
        }
    };

    /**
     * Create describe and specs for columns - sorting
     * @param i Order of column in grid
     */
    function createDescribe(i) {
        describe('nth-' + i + ' column', function () {
            it('is sorted ASC', function () {
                sortColumn(i, 'ASC');
            });
            it('is sorted DESC', function () {
                ST.component('#' + Grid.getColumns()[i].getId())
                    .click();
                sortColumn(i, 'DESC');
            });
        });
    }

    function sortColumn(columnNumber, direction) {

        var array = [],
            // number of rows in each group
            divider = 3,
            sumGroup,
            rowCount;
        ST.component('#' + Grid.getColumns()[columnNumber].getId())
            .click()
            .and(function () {
                // take all cell in column expect last one and push it to array
                rowCount = Grid.getRowCount() > Grid.getVisibleRowCount() ? parseInt(Grid.getVisibleRowCount() / divider) * divider : Grid.getRowCount() - 1;
                sumGroup = rowCount / 21; // 21 is total number of rows for each record in Person column
                for (var i = 0; i < rowCount; i++) {
                    Lib.Pivot.pushNumbersToArray(array, columnNumber, i);
                }
            })
            .and(function () {
                var fn = Lib.Pivot.sortArray(direction);

                var dividedSorted = [];
                if (Grid.getRowCount() > 10) {

                    // divide array, because groups are sorted, so we need check only groups
                    dividedSorted = Lib.Pivot.divideArray(array, sumGroup);
                    var firstElements = [];
                    for (var i = 0; i < dividedSorted.length; i++) {
                        //firstElements - it is array of cells of Sums for each Person
                        firstElements.push(dividedSorted[i][0]);
                        dividedSorted[i].shift();
                    }
                    expect(Lib.Pivot.isSorted(firstElements, fn)).toBeTruthy();
                    for (var i = 0; i < dividedSorted.length; i++) {
                        expect(Lib.Pivot.isSorted(dividedSorted[i], fn)).toBeTruthy();
                    }
                } else {
                    expect(Lib.Pivot.isSorted(array, fn)).toBeTruthy();
                }
            });

    }



    beforeAll(function() {
        Lib.beforeAll("#outline-pivot-grid", "#kitchensink-view-pivot-layoutoutline");
        ST.wait(function () {
            //waiting for first cell in grid - get by id;
            return Ext.first('pivotgridrow');
        });
    });
    afterAll(function(){
        Grid.grid()
            .and(function (grid) {
                grid.destroy();
            });
        Lib.afterAll("#kitchensink-view-pivot-layoutoutline");
    });

    it('is loaded properly', function () {
        Grid.grid()
            .viewReady();
    });

    it('screenshot should be same', function () {
        Lib.screenshot("modern_outline-pivot-grid");
    });

    describe('Column (collapsed)', function () {
        beforeAll(function () {
            ST.button('button[text=Collapse all]')
                .click();
        });

        afterEach(function () {
            ST.component('#' + Grid.getColumns()[0].getId())
                .click();
        });
        for (var i = 0; i < 5; i++) {
            if (i == 1)
                continue;
            createDescribe(i);
        }
    });

    describe('Column (expanded)', function () {
        beforeAll(function () {
            ST.button('button[text=Expand all]')
                .click();
        });

        afterEach(function () {
            ST.component('#' + Grid.getColumns()[0].getId())
                .click();
        });
        for (var i = 0; i < 5; i++) {
            if (i == 1)
                continue;
            createDescribe(i);
        }
    });

    describe('Group', function () {
        it('is collapsed by clicking on +', function () {
            Grid.grid()
                .rowAt(0)
                .cellAt(0)
                .and(function (cell) {
                    if (cell.el.dom.classList.contains('x-pivot-grid-group-header-collapsed')) {
                        ST.element('>> #' + cell.el.dom.id + ' .x-pivot-grid-group-icon')
                            .click();
                    }
                    ST.element('>> #' + cell.el.dom.id + ' .x-pivot-grid-group-icon')
                        .click();
                })
                .and(function (cell) {
                    expect(cell.el.dom.classList).toContain('x-pivot-grid-group-header-collapsed');
                });
        });

        it('is collapsed by clicking on -', function () {
            Grid.grid()
                .rowAt(0)
                .cellAt(0)
                .and(function (cell) {
                    if (!cell.el.dom.classList.contains('x-pivot-grid-group-header-collapsed')) {
                        ST.element('>> #' + cell.el.dom.id + ' .x-pivot-grid-group-icon')
                            .click();
                    }
                    ST.element('>> #' + cell.el.dom.id + ' .x-pivot-grid-group-icon')
                        .click();
                })
                .and(function (cell) {
                    expect(cell.el.dom.classList).not.toContain('x-pivot-grid-group-header-collapsed');
                });
        });
    });
    describe('Button Collapse All', function () {
        it('collapses all rows', function () {
            ST.button('button[text=Collapse all]')
                .click()
                .and(function () {
                    expect(Grid.getRowCount()).toBeLessThan(10);
                });
        });
    });

    describe('Button Expand All', function () {
        it('expands all rows', function () {
            ST.button('button[text=Expand all]')
                .click()
                .and(function () {
                    expect(Grid.getRowCount()).toBeGreaterThan(30);
                });
        });
    });

    describe('Grand Total', function () {
        beforeAll(function () {
            ST.button('button[text=Collapse all]')
                .click();
        });
        it('is on last row', function () {
                ST.component('grid pivotgridrow[_eventName=pivottotal] gridcell[value=Grand total]')
                .and(function (cell) {
                    expect(cell.el.dom.innerText).toContain('Grand total');

                });
        });
    });
    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('Ext.pivot.Grid');
        });
    });
});
