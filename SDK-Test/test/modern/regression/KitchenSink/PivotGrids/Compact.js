/**
 * @file Compact.js
 * @name Kitchen Sink (Modern)/PivotGrids/Compact.js
 * @created 2016/09/06
 * @date 6.9.2016
 *
 * Tested on: Firefox, Chrome, Edge
 */
describe('Pivot Grid - Compact example', function(){
    /**
     * Custom variables for application
     **/
    var examplePrefix = 'compact-pivot-grid{isVisible()} ';
    var gridPrefix = examplePrefix + 'pivotgrid ';
    var exampleUrlPostfix = '#compact-pivot-grid';
    var buffs;
    var Grid = {
        getPivotGrid: function(){
            return ST.grid(gridPrefix);
        },
        getRowCount: function(){
            return Ext.first(gridPrefix).getStore().getData().length;
        },
        getColumns: function(){
            return Ext.first(gridPrefix).getColumns();
        },
        expandAll: function(){
            this.getPivotGrid().and(function(){
                this.future.cmp.expandAllColumns();
                this.future.cmp.expandAllRows();
            });
        },
        collapseAll: function(){
            this.getPivotGrid().and(function(){
                this.future.cmp.collapseAllColumns();
                this.future.cmp.collapseAllRows();
            });
        },
        getButton: function(value){
            return ST.button(examplePrefix + 'toolbar button[text=' + value + ']');
        },
        getIdOfColumnByText: function(text, end){
            if (end)
                return Ext.first(gridPrefix + 'gridheadergroup:last').getId();
            return Ext.first(gridPrefix + 'gridcolumn[text=<div class=\"x-pivot-grid-group-icon x-font-icon\"></div><div class=\"x-pivot-grid-group\">' + text + '</div>]').getId();
        },
        expandOrCollapseYearColumn: function(year){
            ST.element(gridPrefix + 'headercontainer gridcolumn[_text=<div class="x-pivot-grid-group-icon x-font-icon"></div><div class="x-pivot-grid-group">' + year + '</div>]:last => div.x-pivot-grid-group-icon').click();
        },
        clickOnColumn: function(index){
            return Grid.getPivotGrid().visible()
                .and(function(){
                    ST.element('#' + this.future.cmp.getColumns()[index].getId()).click();
                });
        },
    };
    function createDescribeForSorting(i){
        describe('nth-' + i + ' column', function(){
            it('is sorted ASC', function(){
                if(Ext.ComponentQuery.query(gridPrefix + 'gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                    Grid.clickOnColumn(i);
                }
                sortColumn(i, 'ASC');
            });
            it('is sorted DESC', function(){
                if(!Ext.ComponentQuery.query(gridPrefix + 'gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                    Grid.clickOnColumn(i);
                }
                sortColumn(i, 'DESC');
            });
        });
    }
    function sortColumn(columnNumber, direction){
        var array = [], divider = 6, sumGroup, rowCount;
        ST.component('#' + Grid.getColumns()[columnNumber].getId())
            .click()
            .and(function(){
                // take all cell in column expect last one and push it to array
                rowCount = Grid.getRowCount() > Grid.getRowCount() ? parseInt(Grid.getRowCount() / divider) * divider : Grid.getRowCount() - 1;
                sumGroup = Math.floor(rowCount / 21); //round down
                for(var i = 0; i < rowCount; i++){
                    Lib.Pivot.pushNumbersToArray(array, columnNumber, i, gridPrefix);
                }
            })
            .and(function(){
                var fn = Lib.Pivot.sortArray(direction), dividedSorted = [];
                // collapsed or expanded?
                if(Grid.getRowCount() > 10){
                    // divide array, because groups are sorted, so we need check only groups
                    function checkFirst(array, sumGroup){
                        dividedSorted = Lib.Pivot.divideArray(array, sumGroup);
                        var firstElements = [];
                        for(var i = 0; i < dividedSorted.length; i++){
                            //firstElements - it is array of cells of Sums for each Person
                            firstElements.push(dividedSorted[i][0]);
                            dividedSorted[i].shift();
                        }
                        expect(Lib.Pivot.isSorted(firstElements, fn)).toBeTruthy();
                        return dividedSorted;
                    }
                    // check sorting name
                    var names = checkFirst(array, sumGroup);
                    for(var i = 0; i < names.length; i++){
                        // check sorting company
                        var company = checkFirst(names[i], 5);
                        //check sorting company groups
                        for(var j = 0; j < company.length; j++){
                            expect(Lib.Pivot.isSorted(company[j], fn)).toBeTruthy();
                        }
                    }
                } else {
                    expect(Lib.Pivot.isSorted(array, fn)).toBeTruthy();
                }
            });
    }
    beforeAll(function(){
        Lib.beforeAll(exampleUrlPostfix, gridPrefix, 200);
        Grid.getPivotGrid()
            .visible()
            .and(function(){
                buffS = this.future.cmp.getBufferSize();
                this.future.cmp.setBufferSize(100);
                this.future.cmp.refresh();
            });
        ST.component(gridPrefix + 'pivotgridrow[isFirst=true]').visible();
    });
    afterAll(function(){
        Grid.getPivotGrid()
            .visible()
            .and(function(){
                this.future.cmp.setBufferSize(buffS);
                this.future.cmp.refresh();
            });
        Lib.afterAll(examplePrefix);
    });
    it('is loaded properly', function(){
        Grid.getPivotGrid().viewReady();
    });
    it('screenshot should be same', function(){
        Lib.screenshot("UI_modern_compact-pivot-grid");
    });
    describe('Expandable/Collapsible', function(){
        var defaultCountColumn, defaultCountRow;
        beforeAll(function(){
            Grid.collapseAll();
            Grid.getPivotGrid().visible()
                .and(function(){
                    defaultCountColumn = this.future.cmp.getColumns().length;
                    defaultCountRow = this.future.cmp.getStore().getData().length;
                });
        });
        it('Buttons "Expand all" and "Collapse all" should be working', function(){
            Grid.getButton('Expand all').visible().click();
            Grid.getPivotGrid().visible()
                .and(function(){
                    expect(this.future.cmp.getColumns().length).toBeGreaterThan(defaultCountColumn);
                    expect(this.future.cmp.getStore().getData().length).toBeGreaterThan(defaultCountRow);
                });
            Grid.getButton('Collapse all').visible().click();
            Grid.getPivotGrid().visible()
                .and(function(){
                    expect(defaultCountColumn).toBe(this.future.cmp.getColumns().length);
                    expect(defaultCountRow).toBe(this.future.cmp.getStore().getData().length);
                });
        });
        it('Expanding and collapsing columns', function(){
            Grid.expandOrCollapseYearColumn('2012');
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultCountColumn !== this.cmp.getColumns().length;
                }).and(function(){
                    expect(this.future.cmp.getColumns().length).toBeGreaterThan(defaultCountColumn);
                });
            Grid.expandOrCollapseYearColumn('2012');
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultCountColumn === this.cmp.getColumns().length;
                }).and(function(){
                    expect(this.future.cmp.getColumns().length).toBe(defaultCountColumn);
                });
        });
        it('Expanding and collapsing rows', function(){
            var tmpCountRow = defaultCountRow;
            ST.element(gridPrefix + 'pivotgridrow[$position!=-10000] pivotgridgroupcell[_value=Anne] => div.x-pivot-grid-group-icon').click();
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultCountRow !== this.cmp.getStore().getData().length;
                }).and(function(){
                    tmpCountRow = this.future.cmp.getStore().getData().length;
                    expect(tmpCountRow).toBeGreaterThan(defaultCountRow);
                });
            ST.element(gridPrefix + 'pivotgridrow[$position!=-10000] pivotgridgroupcell[_value=Dell] => div.x-pivot-grid-group-icon').click();
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultCountRow !== this.cmp.getStore().getData().length;
                }).and(function(){
                    expect(this.future.cmp.getStore().getData().length).toBeGreaterThan(tmpCountRow);
                });
            ST.element(gridPrefix + 'pivotgridrow[$position!=-10000] pivotgridgroupcell[_value=Anne] => div.x-pivot-grid-group-icon').click();
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultCountRow === this.cmp.getStore().getData().length;
                }).and(function(){
                    expect(this.future.cmp.getStore().getData().length).toBe(defaultCountRow);
                });
        });
        describe('Group', function(){
            beforeAll(function(){
                Grid.collapseAll();
            });
            it('First group is expanded by clicking on + icon - EXTJS-25284', function(){
                var rowCount = Grid.getRowCount();
                Grid.getPivotGrid()
                    .rowAt(0)
                    .cellAt(0)
                    .and(function(){
                        if(!this.future.el.dom.classList.contains('x-pivot-grid-group-header-collapsed')){
                            ST.element('>> #' + this.future.el.dom.id + ' .x-pivot-grid-group-icon').click();
                        }
                        ST.element('>> #' + this.future.el.dom.id + ' .x-pivot-grid-group-icon').click();
                    }).and(function(){
                        expect(this.future.el.dom.classList).not.toContain('x-pivot-grid-group-header-collapsed');
                    });
                Grid.getPivotGrid()
                    .and(function(){
                        expect(Grid.getRowCount()).not.toBeLessThan(rowCount);
                    })
                    .rowAt(0)
                    .cellAt(0)
                    .and(function(){
                        ST.element('>> #' + this.future.el.dom.id + ' .x-pivot-grid-group-icon').click();
                    });
            });
            it('First group is collapsed by clicking on - icon', function(){
                var rowCount = Grid.getRowCount();
                Grid.getPivotGrid()
                    .rowAt(0)
                    .cellAt(0)
                    .and(function(){
                        if(this.future.el.dom.classList.contains('x-pivot-grid-group-header-collapsed')){
                            ST.element('>> #' + this.future.el.dom.id + ' .x-pivot-grid-group-icon').click();
                        }
                    });
                Grid.getPivotGrid()
                    .and(function(){
                        expect(Grid.getRowCount()).not.toBeLessThan(rowCount);
                    })
                    .rowAt(0)
                    .cellAt(0)
                    .and(function(){
                        ST.element('>> #' + this.future.el.dom.id + ' .x-pivot-grid-group-icon').click();
                    }).and(function(){
                        expect(this.future.el.dom.classList).toContain('x-pivot-grid-group-header-collapsed');
                    });
            });
            it('Second group is expanded and collapsed by clicking +/- icons', function(){
                var rowCount1 = Grid.getRowCount();
                var rowCount2;
                Grid.getPivotGrid()
                    .rowAt(0)
                    .cellAt(0)
                    .and(function(){
                        if(this.future.el.dom.classList.contains('x-pivot-grid-group-header-collapsed')){
                            ST.element('>> #' + this.future.el.dom.id + ' .x-pivot-grid-group-icon').click();
                        }
                    });
                Grid.getPivotGrid()
                    .and(function(){
                        rowCount2 = Grid.getRowCount();
                        expect(rowCount2).not.toBeLessThan(rowCount1);
                    })
                    .rowAt(1)
                    .cellAt(0)
                    .and(function(){
                        if(this.future.el.dom.classList.contains('x-pivot-grid-group-header-collapsed')){
                            ST.element('>> #' + this.future.el.dom.id + ' .x-pivot-grid-group-icon').click();
                        }
                    }).and(function(){
                        expect(this.future.el.dom.classList).not.toContain('x-pivot-grid-group-header-collapsed');
                    });
                Grid.getPivotGrid()
                    .and(function(){
                        expect(Grid.getRowCount()).not.toBeLessThan(rowCount2);
                    })
                    .rowAt(1)
                    .cellAt(0)
                    .and(function(){
                        ST.element('>> #' + this.future.el.dom.id + ' .x-pivot-grid-group-icon').click();
                    }).and(function(){
                        expect(this.future.el.dom.classList).toContain('x-pivot-grid-group-header-collapsed');
                    });
                Grid.getPivotGrid()
                    .and(function(){
                        expect(Grid.getRowCount()).not.toBeGreaterThan(rowCount2);
                    })
                    .rowAt(0)
                    .cellAt(0)
                    .and(function(){
                        ST.element('>> #' + this.future.el.dom.id + ' .x-pivot-grid-group-icon').click();
                    });
            });
        });
    });
    describe('Sortable', function(){
        beforeAll(function(){
            Grid.collapseAll();
        });
        beforeEach(function(){
            if(!Ext.ComponentQuery.query(gridPrefix + 'gridcolumn')[0].el.dom.classList.contains('x-sorted-asc')){
                Grid.clickOnColumn(0);
            }
        });
        afterAll(function(){
            Grid.collapseAll();
            Grid.getPivotGrid()
                .and(function(){
                    if(!Ext.ComponentQuery.query(gridPrefix + 'gridcolumn')[0].el.dom.classList.contains('x-sorted-asc')){
                        Grid.clickOnColumn(0);
                    }
                });
        });
        createDescribeForSorting(0);
        describe('Column 2012', function(){
            beforeAll(function(){
                Grid.expandOrCollapseYearColumn('2012');
            });
            afterAll(function(){
                Grid.expandOrCollapseYearColumn('2012');
            });
            createDescribeForSorting(1);
            createDescribeForSorting(13);
        });
    });
    describe('Grand Total', function(){
        beforeAll(function(){
            Grid.getPivotGrid()
                .and(function(){
                    this.future.cmp.expandAll();
                    this.future.cmp.collapseAllRows();
                });
        });
        it('is on last row', function(){
            Grid.getPivotGrid()
                .rowAt(6)
                .cellAt(0)
                .and(function(cell){
                    expect(cell.el.dom.innerText).toContain('Grand total');
                });
        });
    });
    describe('Source code', function(){
        it('Source code view should work correctly', function(){
            Lib.sourceClick('KitchenSink.view.pivot.LayoutCompact');
        });
    });
});
