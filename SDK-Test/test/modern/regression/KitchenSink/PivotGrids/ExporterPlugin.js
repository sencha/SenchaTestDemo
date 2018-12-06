/**
* @file ExporterPlugin.js
* @name Kitchen Sink (Modern)/PivotGrids/ExporterPlugin.js
* @created 2016/11/23
* @date 23.11.2016
* @edited 2017/05/31
* 
* Tested on: Ubuntu 16.04 (Chrome, Firefox)
* Passed on: All tested
*/
describe('PivotGrids Exporter Plugin', function(){
    /**
     * Custom variables for application
     **/
    var examplePrefix = 'exporter-pivot-grid{isVisible()} ';
    var gridPrefix = examplePrefix + 'pivotgrid ';
    var exampleUrlPostfix = '#exporter-pivot-grid';
    var namesPersons = ['Anne', 'John', 'Mary', 'Michael', 'Müller', 'Robert'];
    var textButtons = ['Export to ...', 'Configurator'];
    var d = new Date();
    var defaultCountColumn = d.getFullYear() - 2011 + 3, defaultCountRow = 7;
    var countColumn = (d.getFullYear() - 2012) * 7 + 4, countRow = 37;
    var Grid = {
        getGrid: function(){
            return ST.grid(gridPrefix);
        },
        getButton: function(text){
            return ST.button(examplePrefix + 'toolbar button[_text=' + (text ? text : 'Export to ...') + ']{isVisible()}');
        },
        /**
         * Get Action Sheer which is displayed when user clicked on "Export to ..." button
         * @return {ST.component object}
         **/
        getActionMenu: function(){
            return ST.component('menu[id^=ext-menu]{isVisible()} ');
        },
        /**
         * Click (ghostClick) on the column at index
         * @param index - column index
         * @return {ST.grid object}
         **/
        clickOnColumn: function(index){
            return Grid.getGrid().visible()
                .and(function(){
                    ST.element('#' + this.future.cmp.getColumns()[index].getId()).click();
                });
        },
        /**
         * Expand all items in a grid (column and row groups)
         * ExtJS 6.2 Note: We used functions expandAllColumns() and expandAllRows() because function expandAll() doesn't work for touch devices (tablet, phone)
         **/
        expandAll: function(){
            this.getGrid().and(function(){
                this.future.cmp.expandAllColumns();
                this.future.cmp.expandAllRows();
            });
        },
        expandAllColumns: function(){
            this.getGrid().and(function(){
                this.future.cmp.expandAllColumns();
            });
        },
        /**
         * Expand column which have year (text)
         * @param year - it is the text column by column which we want to expand
         **/
        expandYearColumn: function(year){
            ST.element(gridPrefix + 'headercontainer gridcolumn[_text=<div class="x-pivot-grid-group-icon x-font-icon"></div><div class="x-pivot-grid-group">' + year + '</div>]')
                .click();
        },
        expandAllRows: function(){
            this.getGrid().and(function(){
                this.future.cmp.expandAllRows();
            });
        },
        /**
         * Expand or collapse row which has same text like param namePerson
         * @param namePerson - is is the text row which we want to expand
         **/
        expandOrCollapsePersonRow: function(namePerson){
            //Because all pivotgridrows aren't re-initialized, so we need use [$position!=-10000] for the correct choice
            ST.element(gridPrefix + 'pivotgridrow[$position!=-10000] pivotgridgroupcell[_value=' + namePerson + '] => div.x-pivot-grid-group-icon')
                .click();
        },
        /**
         * Collapse all items (Rows and Columns)
         * @param manual - switch for it when we want collapse and destroyed header gridcolumn because ST functions collapseAll* didn't destroyed it 
         **/
        collapseAll: function(manual){
            this.collapseAllRows();
            this.collapseAllColumns();
        },
        /**
         * Collapse all columns
         * @param manual - switches between ST function and our code for collapse. ST function didn't destroy header gridcolumn, our code is destroyed it. 
         **/
        collapseAllColumns:function(manual){
            if(manual){
                ST.grid(gridPrefix + 'headercontainer[_docked=top]').and(function(){
                    for(var i = 0; i < this.future.cmp.getRefItems().length - 1; i++){
                        if(this.future.cmp.getRefItems()[i].el.dom.classList.contains('x-group')){
                            ST.element('#' + this.future.cmp.getRefItems()[i].getId() + ' => div.x-pivot-grid-group-icon')
                                .click();
                        }
                    }
                });
            } else {
                this.getGrid().and(function(){
                    this.future.cmp.collapseAllColumns();
                });
            }
        },
        collapseAllRows: function(){
            this.getGrid().and(function(){
                this.future.cmp.collapseAllRows();
            });
        },
        collapseYearColumn: function(year){
            ST.element(gridPrefix + 'headercontainer gridcolumn[_text=<div class="x-pivot-grid-group-icon x-font-icon"></div><div class="x-pivot-grid-group">'+year+'</div>] => div.x-pivot-grid-group-icon')
                .click();
        },
        /**
         * Is value equal with count columns
         * @param value - the value which we want to compare
         **/
        isCountColumns: function(value){
            ST.grid(gridPrefix + 'headercontainer[_docked=top]').visible()
                .and(function(){
                    expect(this.future.cmp.getColumns().length).toBe(value);
            });
        },
        isCountColumnsGreaterThan: function(value){
            ST.grid(gridPrefix + 'headercontainer[_docked=top]').visible()
                .and(function(){
                    expect(this.future.cmp.getColumns().length).toBeGreaterThan(value);
            });
        },
        /**
         * Is value equal with count group (parrent) columns
         * @param value - the value which we want to compare
         **/
        isCountParentColumns: function(value){
            ST.grid(gridPrefix + 'headercontainer[_docked=top]').visible()
                .and(function(){
                    expect(this.future.cmp.getRefItems().length).toBe(value);
            });
        },
        /**
         * Compare the value with count columns and checks relation between count columns and count group (parrent) columns
         * @param value - the value for the compare and check relation
         **/
        checkCountParentColumnsWhenCountColumnsIs: function(value){
            this.isCountColumns(value);
            this.isCountParentColumns(defaultCountColumn + (value - defaultCountColumn) / 6);
        },
        /**
         * Waiting on when value same like column count
         * @param value
         **/
        waitOnCountColumns: function(value){
            this.getGrid().wait(function(){
                return this.cmp.getColumns().length === value;
            });
        },
        waitOnCountColumnsGreaterThan: function(value){
            this.getGrid().wait(function(){
                return this.cmp.getColumns().length > value;
            });
        },
        /**
         * Waiting on when value same like row count
         * @param value
         **/
        waitOnCountRows: function(value){
            this.getGrid().wait(function(){
                return this.cmp.getStore().getData().length === value;
            });
        },
        /**
         * Checks if a column is sorted.
         * @param index - index column
         * @param direction - type sorting: ASC/DESC
         * @param value - for case if it should be true or not
         **/
        isSortColumn: function(index, direction, value){
            var array = [], divider = 6, sumGroup, rowCount;
            Grid.clickOnColumn(index).and(function(){
                var length = this.future.cmp.getStore().getData().length;
                var visibleRows = this.future.cmp.visibleCount;
                // take all cell in column expect last one and push it to array
                rowCount = (length > visibleRows) ? (visibleRows / divider) * divider : length - 1;
                sumGroup = rowCount / 6;
                for ( var i = 0; i < rowCount; i++){
                    Lib.Pivot.pushNumbersToArray(array, index, i, gridPrefix);
                }
            }).and(function(){
                var fn = Lib.Pivot.sortArray(direction);
                var dividedSorted = [];
                if(this.future.cmp.getStore().getData().length > 10){
                    // divide array, because groups are sorted, so we need check only groups
                    dividedSorted = Lib.Pivot.divideArray(array, sumGroup);
                    var firstElements = [];
                    for (var i = 0; i < dividedSorted.length; i++){
                        //firstElements - it is array of cells of Sums for each Person
                        firstElements.push(dividedSorted[i][0]);
                        dividedSorted[i].shift();
                    }
                    if(value){
                        expect(Lib.Pivot.isSorted(firstElements, fn)).toBeTruthy();
                        for (var j = 0; j < dividedSorted.length; j++){
                            expect(Lib.Pivot.isSorted(dividedSorted[j], fn)).toBeTruthy();
                        }
                    } else {
                        if(index !== 1){
                            expect(Lib.Pivot.isSorted(firstElements, fn)).not.toBeTruthy();
                        }
                        for (var jj = 0; jj < dividedSorted.length; jj++){
                            expect(Lib.Pivot.isSorted(dividedSorted[jj], fn)).not.toBeTruthy();
                        }
                    }
                } else {
                    if(value){
                        expect(Lib.Pivot.isSorted(array, fn)).toBeTruthy();
                    } else {
                        expect(Lib.Pivot.isSorted(array, fn)).not.toBeTruthy();
                    }
                }
            });
        },
        /**
         * Is value equal with count rows
         * @param value - the value which we want to compare
         **/
        isCountRows: function(value){
            this.getGrid().visible().and(function(){
                expect(this.future.cmp.getStore().getData().length).toBe(value);
            });
        },
        /**
         * Create "it" for expand and collapse row with text in Person column
         * @param namePerson - the text for compare and identify row
         **/
        createItForExpandRow: function(namePerson){
            it('Should be expanded/collapsed the row with text ' + namePerson, function(){
                Grid.expandOrCollapsePersonRow(namePerson);
                Grid.waitOnCountRows(defaultCountRow + 5);
                Grid.isCountRows(defaultCountRow + 5);
                Grid.expandOrCollapsePersonRow(namePerson);
                Grid.waitOnCountRows(defaultCountRow);
                Grid.isCountRows(defaultCountRow);
            });
        },
        /**
         * Create describe with "it" for columns - sorting
         * @param name - Person name/specific describe name
         * @param index - it is column index
         * @param value - for case if it should be true or not for isSortColumn(index, direction, value) function
         **/
        createDescribeForSortable: function(name, index, value){
            describe('Column[' + index + '] ' + name + ((value)? ' is sortable' : ' is not sortable'), function(){
                    it('is sorted ASC', function(){
                        pending('ORION-1726 - PivotGrid rowAt() will not work for big pivotGrids');
                        if(Ext.ComponentQuery.query(gridPrefix + 'gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                            Grid.clickOnColumn(index);
                        }
                        Grid.isSortColumn(index, 'ASC', value);
                        Grid.waitOnCountColumnsGreaterThan(countColumn);
                    });
                    it('is sorted DESC', function(){
                        pending('ORION-1726 - PivotGrid rowAt() will not work for big pivotGrids');
                        if(!Ext.ComponentQuery.query(gridPrefix + 'gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                            Grid.clickOnColumn(index);
                        }
                        Grid.isSortColumn(index, 'DESC', value);
                        Grid.clickOnColumn(index);
                        Grid.waitOnCountColumnsGreaterThan(countColumn);
                    });
                });
        },
        /**
         * Create "it" for expand year group column
         * @param year - year/text which should have column
         **/
        createItForExpandYearColumn: function(year){
            var d = new Date();
            if(year < d.getFullYear()){
                it('Should be expanded/collapsed the column for year ' + year, function(){
                    Grid.expandYearColumn(year);
                    Grid.waitOnCountColumns(defaultCountColumn + 6);
                    Grid.checkCountParentColumnsWhenCountColumnsIs(defaultCountColumn + 6);
                    Grid.collapseYearColumn(year);
                    Grid.waitOnCountColumns(defaultCountColumn);
                    Grid.checkCountParentColumnsWhenCountColumnsIs(defaultCountColumn);
                });
            } else {
                it('Should be expanded/collapsed the column for year ' + year, function(){
                    if(Ext.first(gridPrefix + 'headercontainer gridcolumn[_text=<div class="x-pivot-grid-group-icon x-font-icon"></div><div class="x-pivot-grid-group">' + year + '</div>]') !== null){
                        Grid.expandYearColumn(year);
                        Grid.waitOnCountColumnsGreaterThan(defaultCountColumn);
                        Grid.isCountColumnsGreaterThan(defaultCountColumn);
                        Grid.collapseYearColumn(year);
                        Grid.waitOnCountColumns(defaultCountColumn);
                        Grid.checkCountParentColumnsWhenCountColumnsIs(defaultCountColumn);
                    }
                });
            }
        },
        /**
         * Create "it" for scrolling to record on row
         * @param index - it is index row
         * @param down - for it when we want scroling from below to up or from top to down
         **/
        createItForScrollToRecordRow: function(index, down){
            it('Should be scrolled to row[' + index + ']', function(){
                // height set on different value for different device and browser
                var height = (Lib.isPhone) ? (((navigator.userAgent).indexOf("Edge") !== -1) ? 46 : 45) : ((ST.browser.is('IE') || ST.browser.is('Edge')) ? 34 : 33);
                Grid.getGrid()
                    .wait(function(){
                        var scrollTop = this.cmp.getScrollable().getScrollElement().dom.scrollTop;
                        if(down){
                            return scrollTop === 0;
                        } else {
                            return scrollTop !== 0;
                        }
                    });
                Grid.scrollToRecord(index)
                    .visible()
                    .viewReady()
                    .wait(function(){
                        var scrollTop = this.cmp.getScrollable().getScrollElement().dom.scrollTop;
                        if(down){
                            return scrollTop < (index) * height;
                        } else {
                            return scrollTop >= ((index - 9) * height);
                        }
                    })
                    .and(function(){
                        var scrollTop = this.future.cmp.getScrollable().getScrollElement().dom.scrollTop;
                        expect(scrollTop).not.toBeLessThan(((index - 9 < 0)? 0 : index - 9) * height);
                        expect(scrollTop).not.toBeGreaterThan(index * height);
                    });
            });
        },
        /**
         * Create "it" for reveal (scroll) on row and cell from the position
         * @param row - which row has been seeing
         * @param cell - which column has been seeing
         * @param setTop - set up scrollTop before than start reveal() function
         * @param setLeft - set up scrollLeft before than start reveal() function
         **/
        createItForReveal: function(row, cell, setTop, setLeft){
            it('Reveal to Row[' + row + '] and cell[' + cell + '] from scrollTop=' + setTop + ' and scrollLeft=' + setLeft, function(){
                if(row >= 30){ 
                    pending('ORION-1726 - PivotGrid rowAt() will not work for big pivotGrids');
                }
                // height and width set on different values for different device and browser
                var height = (Lib.isPhone) ? (((navigator.userAgent).indexOf("Edge") !== -1) ? 46 : 45) : ((ST.browser.is('IE') || ST.browser.is('Edge')) ? 34 : 33);
                var width = (Lib.isPhone) ? 118 : 120;
                var ccaGridWidth, ccaGridHeight, wWin, hWin;
                ST.component('viewport[id=ext-viewport]').visible()
                    .and(function(){
                        wWin = this.future.cmp.getWindowWidth();
                        hWin = this.future.cmp.getWindowHeight();
                    })
                    .and(function(){
                        // calculate height and width for the Grid, because grid height and width properties are specified in percentages
                        ccaGridHeight = (hWin - 44 - 43) * 0.9;
                        if (Lib.isDesktop){
                            ccaGridWidth = wWin * 0.75 * 0.9;
                        } else {
                            ccaGridWidth = wWin * 0.9;
                        }
                    });
                Grid.setScrollToTopAndLeft(setTop, setLeft);
                Grid.getGrid().rowAt(row).cellAt(cell).reveal();
                Grid.getGrid()
                    .and(function(){
                        var visibleCount = this.future.cmp.visibleCount;
                        var scrollTop = this.future.cmp.getScrollable().getScrollElement().dom.scrollTop;
                        var scrollLeft = this.future.cmp.getScrollable().getScrollElement().dom.scrollLeft;
                        expect(scrollTop).not.toBeLessThan((row - visibleCount > 0) ? (row - visibleCount) * height : 0);
                        expect(scrollTop).not.toBeGreaterThan((row) * height);
                        expect(scrollLeft).not.toBeLessThan((cell - ccaGridWidth / width > 0) ? (cell - ccaGridWidth / width) * width - 20 : 0);
                        expect(scrollLeft).not.toBeGreaterThan(cell * width);
                    });
            });
        },
        scrollToRecord: function(index){
            return this.getGrid().and(function(){
                var record = this.future.cmp.getStore().getAt(index);
                this.future.cmp.scrollToRecord(record);
            });
        },
        /**
         * Set up scrollTop and scrollLeft
         * @param top - set up scrollTop to value of top variable
         * @param left - set up scrollLeft to value of left variable
         **/
        setScrollToTopAndLeft: function(top, left){
            this.getGrid().visible().and(function(){
                this.future.cmp.getScrollable().getScrollElement().dom.scrollTop = top;
                this.future.cmp.getScrollable().getScrollElement().dom.scrollLeft = left;
            });
        }
    };
    beforeAll(function(){
        Lib.beforeAll(exampleUrlPostfix, examplePrefix, 200);
        ST.component(examplePrefix + 'container pivotgridrow[isFirst=true]').visible();
        Grid.getGrid().visible()
            .and(function(){
                defaultCountColumn = this.future.cmp.getColumns().length;
                defaultCountRow = this.future.cmp.getStore().getData().length;
                countColumn = (defaultCountColumn - 4) * 7 + 4;
                countRow = (defaultCountRow - 1) * 6 + 1;
            });
    });
    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });
    describe('Default display UI and correctly loaded', function(){
        it('Should load correctly', function(){
            Grid.getGrid().viewReady();
            Lib.screenshot('UI_appMain_PivotGrids_Exporter_Plugin');
        });
        it('Should be collapsed all of Rows items', function(){
            Grid.isCountRows(defaultCountRow);
        });
        it('Should be collapsed all of Columns items', function(){
            Grid.checkCountParentColumnsWhenCountColumnsIs(defaultCountColumn)
        });
        it('Should be visibled buttons', function(){
            Grid.getButton(textButtons[0]).visible()
                .and(function(){
                    expect(this.future.cmp.isVisible()).toBeTruthy();
                });
            Grid.getButton(textButtons[1]).visible()
                .and(function(){
                    expect(this.future.cmp.isVisible()).toBeTruthy();
                });
        });
    });
    describe('Expandable/Collapsible', function(){
        afterEach(function(){
            Grid.waitOnCountColumns(defaultCountColumn);
            Grid.waitOnCountRows(defaultCountRow);
        });
        it('Expanding and collapsing all rows and columns', function(){
            Grid.expandAll();
            Grid.waitOnCountRows(countRow);
            Grid.isCountRows(countRow);
            Grid.waitOnCountColumnsGreaterThan(countColumn);
            Grid.isCountColumnsGreaterThan(countColumn);
            Grid.collapseAll(true);
            Grid.waitOnCountRows(defaultCountRow);
            Grid.waitOnCountColumns(defaultCountColumn);
            Grid.isCountRows(defaultCountRow);
            Grid.checkCountParentColumnsWhenCountColumnsIs(defaultCountColumn);
        });
        describe('Expanding and collapsing rows', function(){
            /**
             * Here create "it"s for expanding and collapsing row
             **/
            for(var i = 0; i < defaultCountRow - 1; i++){
                Grid.createItForExpandRow(namesPersons[i]);
            }
            it('Expanded/Collapsed all Person rows', function(){
                Grid.isCountRows(defaultCountRow);
                Grid.expandAllRows();
                Grid.waitOnCountRows(countRow);
                Grid.isCountRows(countRow);
                Grid.collapseAllRows();
                Grid.waitOnCountRows(defaultCountRow);
                Grid.isCountRows(defaultCountRow);
            });
            /**
             * Row with text "Grand total" must be only last position in the grid
             **/
            it('Should be Grand total on last row when rows were not expanded', function(){
                Grid.getGrid().visible()
                    .rowAt(defaultCountRow - 1).cellAt(0)
                    .and(function(){
                        expect(this.future.el.dom.innerText).toContain('Grand total');
                    });
            });
            /**
             * Row with text "Grand total" must be only last position in the grid
             **/
            it('Should be Grand total on last row when rows was expanded', function(){
                pending('ORION-1726 - PivotGrid rowAt() will not work for big pivotGrids');
                Grid.expandAllRows();
                Grid.waitOnCountRows(countRow);
                Grid.getGrid().visible()
                    .rowAt(countRow - 1).cellAt(0).reveal()
                    .and(function(){
                        expect(this.future.el.dom.innerText).toContain('Grand total');
                    });
                Grid.getGrid().visible()
                    .rowAt(0).cellAt(0).reveal();
                Grid.collapseAllRows();
                Grid.waitOnCountRows(defaultCountRow);
            });
            /**
             * Row with text "Grand total" can not be expanded
             **/
            it('Should not be expanded Grand total row', function(){
                Grid.isCountRows(defaultCountRow);
                ST.element(gridPrefix + 'pivotgridrow[$position!=-10000] pivotgridgroupcell[_value=Grand total]').click();
                Grid.isCountRows(defaultCountRow);
            });
        });
    });
    describe('Sortable', function(){
        beforeAll(function(){
            Grid.expandAll();
        });
        afterAll(function(){
            Grid.collapseAll(false);
        });
        /**
         * Here create Describes for sorting
         **/
        Grid.createDescribeForSortable('Person', 0, true);
        Grid.createDescribeForSortable('Company', 1, false);
        Grid.createDescribeForSortable('2012 Australia', 2, true);
        Grid.createDescribeForSortable('2012 Canada', 4, true);
        Grid.createDescribeForSortable('Total (2012)', 8, true);
        Grid.createDescribeForSortable('2013 United Kingdom', 13, true);
        Grid.createDescribeForSortable('2016 United States', 35, true);
    });
    describe('Pivotgrid is scrollable', function(){
        beforeAll(function(){
            Grid.expandAll();
            Grid.waitOnCountRows(countRow);
            Grid.waitOnCountColumnsGreaterThan(countColumn);
        });
        afterEach(function(){
            Grid.setScrollToTopAndLeft(0, 0);
        });
        afterAll(function(){
            Grid.getGrid().visible()
                .and(function(){
                    this.future.cmp.collapseAllRows();
                    this.future.cmp.collapseAllColumns(true);
                });
            Grid.waitOnCountRows(defaultCountRow);
        });
        describe('Scroll down to record',function(){
            /**
             * Here create "it"s for scroll to record row
             **/
            for(var i = 6; i < countRow; i += 6)
            {
                Grid.createItForScrollToRecordRow(i, true);
            }
        });
        describe('Scroll up to record', function(){
            beforeEach(function(){
                Grid.setScrollToTopAndLeft(countRow * 33, 0);
            });
            /**
             * Here create "it"s for scrollToRecord
             **/
            for(var i = countRow - 1; i >= 0; i -= 6)
            {
                Grid.createItForScrollToRecordRow(i, false);
            }
        });
    });
    describe('Export to some file - ORION-1897', function(){
        it('Should button be displayed with text "Export to ..." - ORION-1897', function(){
            Grid.getButton(textButtons[0]).visible()
                .and(function(){
                    expect(this.future.cmp.isVisible()).toBeTruthy();
                    expect(this.future.cmp.getText()).toBe('Export to ...')
                });
        });
        it('Should be shown Action menu after click on the Export button and then close it - EXTJS-25284 & ORION-1897', function(){
            Grid.getButton(textButtons[0]).visible().click();
            Grid.getActionMenu().visible()
                .wait(function(){
                    return this.cmp.isVisible();
                })
                .and(function(){
                    expect(this.future.cmp.isVisible()).toBe(true);
                    expect(this.future.cmp.getRefItems().length).toBe(11);
                });
            Grid.getGrid().click();
        });
        /**
         * From ExtJS 6.2
         * Grid must be exported to file or show "ask" window
         * This test is not executed until we find reliable way how to handle native browser behavior.
         **/
        /*it('Should export actual table into .xml file when click on the button "Excel xml (all items)"', function(){
            Grid.getExportButton().visible().click();
            Lib.ghostClick('viewport actionsheet[id^=ext-actionsheet]{isVisible()} button[_text=Excel xml (all items)]', true);
            if(ST.browser.is('IE')){
                ST.component(examplePrefix + 'loadmask')
                    .wait(function(){
                        return this.cmp.getMessage() === 'Document is prepared for export. Please wait ...';
                    })
                    .and(function(){
                        expect(this.future.cmp.getMessage()).toBe('Document is prepared for export. Please wait ...');
                    })
                    .hidden();
            } else {
                ST.component(examplePrefix + 'loadmask')
                    .visible()
                    .wait(function(){
                        return this.cmp.getMessage() === 'Document is prepared for export. Please wait ...';
                    })
                    .and(function(){
                        expect(this.future.cmp.getMessage()).toBe('Document is prepared for export. Please wait ...');
                    })
                    .hidden();
            }
        });*/
    });
    describe('Source code', function(){
        it('Source code view should work correctly', function(){
            Lib.sourceClick('KitchenSink.view.pivot.Exporter');
        });
    });
});
