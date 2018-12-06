/**
 * @file DataChanges.js
 * @name Kitchen Sink (Modern)/PivotGrids/DataChanges.js
 * @created 2016/11/15
 * 
 * Tested on: Chrome, Firefox, Edge, Android, IE 11
 * Failed on: IE 11 - due to the issue ORION-1897
 */
describe('Pivot Grids - Data Changes', function(){
    /**
     * Custom variables for application
     **/
    var examplePrefix = 'datachanges-pivot-grid{isVisible()} ';
    var gridPrefix = examplePrefix + 'pivotgrid ';
    var exampleUrlPostfix = '#datachanges-pivot-grid';
    var rows, cols, total;
    var Grid = {
        getPivotGrid: function(){
            return ST.grid(gridPrefix);
        },
        getRowCount: function(){
            return Ext.first(gridPrefix).getStore().data.length;
        },
        getColCount: function(){
            return Ext.first(gridPrefix).getColumns().length;
        },
        getColumns: function(){
            return Ext.first(gridPrefix).getColumns();
        },
        getButtonDataChanges: function(){
            return ST.component(examplePrefix + 'toolbar button[_text=Change data]');
        },
        getMenu: function(textMenu){
            return ST.component('menu menuitem[_text=' + (textMenu ? textMenu : 'Clear all') + ']');
        },
        clickOnMenuItem: function(textMenu){
            this.getButtonDataChanges().click();
            this.getMenu(textMenu)
                .visible()
                .click()
                .hidden();
        },
        addItem: function(){
            this.clickOnMenuItem('Add');
        },
        updateItems: function(){
            this.clickOnMenuItem('Update');
        },
        removeItem: function(){
            this.clickOnMenuItem('Remove');
        },
        clearAllItem: function(){
            this.clickOnMenuItem('Clear all');
        },
        getRowIcon: function(index){
            return ST.element('datachanges-pivot-grid pivotgrid pivotgridrow[$position!=10000] pivotgridgroupcell[_value^=20]:first => div.x-pivot-grid-group-icon');
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
        clickOnColumn: function(index){
            return Grid.getPivotGrid().visible()
                .and(function(){
                    ST.element('#' + this.future.cmp.getColumns()[index].getId()).click();
                });
        },
        getItemFromRowCell: function(rowAt, cellAt){
            return Grid.getPivotGrid()
                .rowAt(rowAt)
                .cellAt(cellAt);
        }
    };
    function createDescribe(i, name){
        describe('nth-' + i + ' column - ' + name, function(){
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
        Grid.clickOnColumn(columnNumber)
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
        Lib.beforeAll(exampleUrlPostfix, gridPrefix, 250);
        Grid.getPivotGrid().visible();
    });
    afterAll(function(){
       Lib.afterAll(examplePrefix);
    });
    it('is loaded properly', function(){
        Grid.getPivotGrid().viewReady();
    });
    it('screenshot should be same', function(){
        Lib.screenshot('UI_DataChanges_pivotgrid');
    });
    describe('Data changes - ORION-1897', function(){
        beforeAll(function(){
            Grid.addItem();
            Grid.addItem();
            ST.wait(function(){
                return Grid.getRowCount() === 3 || Grid.getColCount() === 8;
            });
            Grid.expandAll();
            Grid.getPivotGrid()
                .and(function(){
                    rows = Grid.getRowCount();
                    cols = Grid.getColCount();
                });
        });
        it('add data - ORION-1897', function(){
            Grid.addItem();
            Grid.getPivotGrid()
                .wait(function(){
                    return rows !== Grid.getRowCount() || cols !== Grid.getColCount();
                })
                .and(function(){
                    expect((Grid.getRowCount() > rows) || (Grid.getColCount() > cols)).toBeTruthy();
                });
        });
        it('update data - ORION-1897', function(){
            Grid.getItemFromRowCell(Grid.getRowCount() - 1, Grid.getColCount() - 2)
                .and(function(){
                    total = this.future.el.dom.innerText;
                });
            Grid.updateItems();
            Grid.getItemFromRowCell(Grid.getRowCount() - 1, Grid.getColCount() - 2).removed()
                .grid().rowAt(Grid.getRowCount() - 1).cellAt(Grid.getRowCount() - 2)
                .wait(function(){
                    return total !== this.el.dom.innerText && this.el.dom.innerText !== ''; 
                }).and(function(){
                    expect(total).not.toBe(this.future.el.dom.innerText);
                });
        });
        it('remove data - ORION-1897', function(){
            Grid.getPivotGrid()
                .and(function(){
                    rows = Grid.getRowCount();
                    cols = Grid.getColCount();
                });
            Grid.removeItem();
            Grid.getPivotGrid()
                .wait(function(){
                    return Grid.getRowCount() < rows || Grid.getColCount() < cols;
                })
                .and(function(){
                    expect(Grid.getRowCount() < rows || Grid.getColCount() < cols).toBeTruthy();
                });
        });
        it('clear all data - ORION-1897', function(){
            Grid.clearAllItem();
            Grid.getPivotGrid()
                .wait(function(){
                    return Grid.getRowCount() === 1 && Grid.getColCount() === 4;
                })
                .and(function(){
                    expect(Grid.getRowCount()).toBe(1);
                    expect(Grid.getColCount()).toBe(4);
                });
        });
        describe('Data changes - one row - ORION-1897', function(){
            it('add row - ORION-1897', function(){
                Grid.addItem();
                Grid.getPivotGrid()
                    .wait(function(){
                        return Grid.getRowCount() > 1;
                    })
                    .and(function(){
                        expect(Grid.getRowCount()).toBe(2);
                    });
            });
            it('remove row - ORION-1897', function(){
                Grid.removeItem();
                Grid.getPivotGrid()
                    .wait(function(){
                        return Grid.getRowCount() === 1;
                    })
                    .and(function(){
                        expect(Grid.getRowCount()).toBe(1);
                    });
            });
        });
    });
    describe('Sort column (collapsed) - ORION-1897', function(){
        beforeAll(function(){
            var columnId = null;
            Grid.addItem();
            Grid.addItem();
            Grid.addItem();
            Grid.getPivotGrid()
                .and(function(){
                    columnId = this.future.cmp.getColumns()[0].getId();
                }).wait(function(){
                    return this.cmp.getColumns()[0].getId() !== columnId;
                });
        });
        afterEach(function(){
            if(!Ext.ComponentQuery.query(gridPrefix + 'gridcolumn')[0].el.dom.classList.contains('x-sorted-asc')){
                Grid.clickOnColumn(0);
            }
        });
        createDescribe(0, 'Year');
        createDescribe(2, 'Column Total');
    });
    describe('Expand & collapse row - ORION-1897', function(){
        beforeAll(function(){
            Grid.addItem();
            Grid.addItem();
            Grid.getPivotGrid()
                .and(function(){
                    columnId = this.future.cmp.getColumns()[0].getId();
                }).wait(function(){
                    return this.cmp.getColumns()[0].getId() !== columnId;
                });
            Grid.collapseAll();
            Grid.getPivotGrid()
                .and(function(){
                    rows = Grid.getRowCount();
                });
        });
        it('Expand and Collapse row - ORION-1897', function(){
            Grid.getRowIcon().click();
            Grid.getPivotGrid()
                .wait(function(){
                    return this.cmp.getStore().getData().length > rows;
                })
                .and(function(){
                    expect(this.future.cmp.getStore().getData().length).toBeGreaterThan(rows);
                });
            Grid.getRowIcon().click();
            Grid.getPivotGrid()
                .wait(function(){
                    return this.cmp.getStore().getData().length === rows;
                })
                .and(function(){
                    expect(this.future.cmp.getStore().getData().length).toBe(rows);
                });
        });
    });
    describe('Source code', function(){
        it('should open, check and close', function(){
            Lib.sourceClick('pivot.DataChanges');
        });
    });
});
