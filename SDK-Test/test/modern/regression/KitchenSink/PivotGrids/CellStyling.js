/**
* @file CellStyling.js
* @name Kitchen Sink (Modern)/PivotGrids/CellStyling.js
* @created 2017/1/13
* 
* Tested on: Chrome, Firefox, Android, Edge, Opera
*/
describe('Cell Styling', function(){
    /**
     * Custom variables for application
     **/
    var examplePrefix = 'cellediting-pivot-grid{isVisible()} ';
    var exampleUrlPostfix = '#cellediting-pivot-grid';
    var bufs;
    var prefix = '#kitchensink-view-pivot-cellstyling';
    var company = ['Adobe','Apple','Dell','Google','Microsoft'];
    var names = ['Anne','John','Mary','Michael','Müller','Robert'];
	var Grid = {
	    getPivotGrid: function(){
	        return ST.grid(examplePrefix);
	    },
        getColumnsCount: function(){
            return Ext.first(gridPrefix).getColumns().length;
        },
        getRowCount: function(){
            return Ext.ComponentQuery.query(examplePrefix)[0].getStore().getData().length;
        },
        collapseAllRows: function(){
            this.getPivotGrid()
                .and(function(){
                    this.future.cmp.collapseAllRows();
                });
        },
        collapseAllColumns:function(manual){
            this.getPivotGrid()
                .and(function(){
                    this.future.cmp.collapseAllColumns();
                });
        },
        collapseAll: function(manual){
            this.collapseAllRows();
            this.collapseAllColumns();
        },
        getHeaderColumn: function(text){
            return ST.element(examplePrefix + 'headercontainer gridcolumn[_text=<div class="x-pivot-grid-group-icon x-font-icon"></div><div class="x-pivot-grid-group">' + text + '</div>]');
        },
        /**
         * Expand or collapse the header column of grid that contains the text
         * @param text - it is the text by column which we want to expand/collapse
         **/
        expandOrCollapseColumn: function(text){
            return this.getHeaderColumn(text).click();
        },
        clickOnHeaderColumn: function(index){
            return Grid.getPivotGrid().visible()
                .and(function(){
                    ST.element('#' + this.future.cmp.getColumns()[index].getId()).click();
                });
        },
        /**
         * Get row expand/collapse icon for row with text. If it has more than one occurrence so we choose with the num parameter.
         * @param text - it is the text by row which we want
         * @param num - for case if it has more that one occurrence, so we can choose with this parameter
         * @return {ST.element object} - expand/collapse icon for a row
         **/
        getRowIcon: function(text, num){
            return ST.element(prefix +' pivotgridgroupcell[_value='+text+']:nth-child('+num+') => div.x-pivot-grid-group-icon');
        },
        expandOrCollapseRow: function(text, num){
            this.getRowIcon(text, num).click();
        },
        
    };
    function createDescribeForSorting(i){
        describe('nth-' + i + ' column', function(){
            it('is sorted ASC', function(){
                if(Ext.ComponentQuery.query(examplePrefix + 'gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                    Grid.clickOnHeaderColumn(i);
                }
                sortColumn(i, 'ASC');
            });
            it('is sorted DESC', function(){
                if(!Ext.ComponentQuery.query(examplePrefix + 'gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                    Grid.clickOnHeaderColumn(i);
                }
                sortColumn(i, 'DESC');
            });
        });
    }
    function sortColumn(columnNumber, direction){
        var array = [], divider = 6, sumGroup, rowCount;
        Grid.clickOnHeaderColumn(columnNumber)
            .and(function () {
                var length = this.future.cmp.getStore().getData().length;
                var visibleRows = this.future.cmp.visibleCount;
                // take all cell in column expect last one and push it to array
                rowCount = (length > visibleRows) ? parseInt(visibleRows / divider) * divider : length - 1;
                sumGroup = rowCount / 6;
                for(var i = 0; i < rowCount; i++){
                    Lib.Pivot.pushNumbersToArray(array, columnNumber, i, examplePrefix);
                }
            })
            .and(function(){
                var fn = Lib.Pivot.sortArray(direction), dividedSorted = [];
                if(this.future.cmp.getStore().getData().length > 10){
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
    function clickOnGroupIconName(name,num){
        it('expand '+name, function () {
            Grid.getRowIcon(name,num)
                .and(function () {
                    ST.component(examplePrefix + 'pivotgridgroupcell[_value='+name+']:nth-child('+num+')')
                        .and(function (element) {
                            expect(element.el.dom.classList).toContain('x-pivot-grid-group-header-collapsed');
                        });
                });
            Grid.getPivotGrid()
                .and(function (element) {
                    var record = Ext.ComponentQuery.query('pivotgridgroupcell[_value='+name+']:nth-child('+num+')')[0].getRecord();
                    element.scrollToRecord(record);
                });

            Grid.getRowIcon(name,num)
                .click()
                .and(function () {
                    ST.component(examplePrefix + 'pivotgridgroupcell[_value='+name+']:nth-child('+num+')')
                        .and(function (element) {
                            expect(element.el.dom.classList).not.toContain('x-pivot-grid-group-header-collapsed');
                        });
                });
        });
    }
    beforeAll(function(){
        Lib.beforeAll(exampleUrlPostfix, examplePrefix, 200);
        Grid.getPivotGrid()
            .visible()
            .and(function(){
                buffS = this.future.cmp.getBufferSize();
                this.future.cmp.setBufferSize(500);
                this.future.cmp.refresh();
            });
        ST.component(examplePrefix + 'pivotgridrow[isFirst=true]').visible();
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
        var defaultColumn, defaultRow;
        beforeAll(function(){
            Grid.collapseAll();
            Grid.getPivotGrid().visible()
                .and(function(){
                    defaultColumn = this.future.cmp.getColumns().length;
                    defaultRow = this.future.cmp.getStore().getData().length;
                });
        });
        it('Expanding and collapsing columns', function(){
            Grid.expandOrCollapseColumn('Year 2012');
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultColumn !== this.cmp.getColumns.length;
                })
                .and(function(){
                    expect(this.future.cmp.getColumns().length).toBeGreaterThan(defaultColumn);
                });
            Grid.expandOrCollapseColumn('Year 2012');
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultColumn === this.cmp.getColumns().length;
                })
                .and(function(){
                    expect(this.future.cmp.getColumns().length).toBe(defaultColumn);
                });
        });
        it('Expanding and collapsing row - Person column', function(){
            Grid.expandOrCollapseRow('Anne', 1);
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultRow !== this.cmp.getStore().getData().length;
                })
                .and(function(){
                    expect(this.future.cmp.getStore().getData().length).toBeGreaterThan(defaultRow);
                });
            Grid.expandOrCollapseRow('Anne', 1);
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultRow === this.cmp.getStore().getData().length;
                })
                .and(function(){
                    expect(this.future.cmp.getStore().getData().length).toBe(defaultRow);
                });
        });
        it('Expanding and collapsing row - Person + Company columns', function(){
            var tmpCountRow;
            Grid.expandOrCollapseRow('Anne', 1);
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultRow !== this.cmp.getStore().getData().length;
                })
                .and(function(){
                    tmpCountRow = this.future.cmp.getStore().getData().length;
                });
            Grid.expandOrCollapseRow('Adobe', 1); 
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return tmpCountRow !== this.cmp.getStore().getData().length;
                })
                .and(function(){
                    expect(this.future.cmp.getStore().getData().length).toBeGreaterThan(tmpCountRow);
                });
            Grid.expandOrCollapseRow('Adobe', 1);
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return tmpCountRow === this.cmp.getStore().getData().length;
                })
                .and(function(){
                    expect(this.future.cmp.getStore().getData().length).toBe(tmpCountRow);
                });
            Grid.expandOrCollapseRow('Anne', 1);
        });
        describe('Expand All names', function(){
            for(var i = 0;i <= 1; i++){
                clickOnGroupIconName(names[i]);
            }
            describe('Expand companies under name '+names[0], function(){
                for(var i = 0;i <= 4; i++){
                    clickOnGroupIconName(company[i],1);
                }
            });
        });
    });
    describe('Sortable', function(){
        beforeAll(function(){
            Grid.collapseAll();
        });
        beforeEach(function(){
            if(!Ext.ComponentQuery.query(examplePrefix + 'gridcolumn')[0].el.dom.classList.contains('x-sorted-asc')){
                Grid.clickOnHeaderColumn(0);
            }
        });
        afterAll(function(){
            Grid.collapseAll();
        });
        createDescribeForSorting(0);
        describe('Expand Year 2012', function(){
            beforeAll(function(){
                Grid.expandOrCollapseColumn('Year 2012');
            });
            afterAll(function(){
                Grid.expandOrCollapseColumn('Year 2012');
            });
            createDescribeForSorting(3);
        });
        describe('Expand Year 2013', function(){
            beforeAll(function(){
                Grid.expandOrCollapseColumn('Year 2013');
            });
            afterAll(function(){
                Grid.expandOrCollapseColumn('Year 2013');
            });
            createDescribeForSorting(4);
        });
    });
    describe('Source code', function(){
        it('Source code view should work correctly', function(){
            Lib.sourceClick('KitchenSink.view.pivot.CellStyling');
        });
    });
});
