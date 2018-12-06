/**
 * @file DrillDown.js
 * @name Kitchen Sink (Modern)/PivotGrids/DrillDown.js
 * @created 2016/09/13
 * @date 13.9.2016
 *
 * Tested on: Ubuntu 16.04 (Chrome, Firefox)
 */
describe('Pivot Grid - DrillDown example', function(){
    /**
     * Custom variables for application
     **/
    var examplePrefix = 'drilldown-pivot-grid{isVisible()} ';
    var gridPrefix = examplePrefix + 'pivotgrid ';
    var exampleUrlPostfix = '#drilldown-pivot-grid';
    var screenshotPrefix = 'modern_drilldown-pivot-grid';
    var defaultCountColumn = 8;
    var defaultCountRow = 6;
    var Grid = {
        getPivotGrid: function(){
            return ST.grid(gridPrefix);
        },
        getRowCount: function(){
            return Ext.first(gridPrefix).getStore().getData().length;
        },
        getButton: function(value){
            return ST.button(examplePrefix + 'toolbar button[text=' + value + ']');
        },
        isCountRows: function(value){
            this.getPivotGrid().visible().and(function(){
                expect(this.future.cmp.getStore().getData().length).toBe(value);
            });
        },
        getColumns: function(){
            return Ext.first(gridPrefix).getColumns();
        },
        isCountColumns: function(value){
            this.getPivotGrid().visible().and(function(){
                    expect(this.future.cmp.getColumns().length).toBe(value);
                });
        },
        clickOnColumn: function(index){
            return Grid.getPivotGrid().visible()
                .and(function(){
                    ST.element('#' + this.future.cmp.getColumns()[index].getId()).click();
                });
        },
        expandOrCollapseYearColumn: function(year){
            ST.element(gridPrefix + 'headercontainer gridcolumn[_text=<div class="x-pivot-grid-group-icon x-font-icon"></div><div class="x-pivot-grid-group">' + year + '</div>]:last => div.x-pivot-grid-group-icon').click();
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
        /**
         * Create describe and specs for columns - sorting
         * @param index Order of column in grid
         */
        createDescribeForSorting: function(i){
            describe('nth-' + i + ' column is sortable', function(){
                it('is sorted ASC', function(){
                    if(Ext.ComponentQuery.query(gridPrefix + 'headercontainer:first gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                        Grid.clickOnColumn(i);
                    }
                    Grid.sortColumn(i, 'ASC');
                });
                it('is sorted DESC', function(){
                    if(!Ext.ComponentQuery.query(gridPrefix + 'headercontainer:first gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                        Grid.clickOnColumn(i);
                    }
                    Grid.sortColumn(i, 'DESC');
                });
            });
        },
        sortColumn: function(columnNumber, direction){
            var array = [], divider = 7, sumGroup, rowCount;
            Grid.clickOnColumn(columnNumber)
                .and(function(){
                    // take all cell in column expect last one and push it to array
                    rowCount = Grid.getRowCount() > Grid.getRowCount() ? parseInt(Grid.getRowCount() / divider) * divider : Grid.getRowCount() - 1;
                    sumGroup = rowCount / 7;
                    for(var i = 0; i < rowCount; i++){
                        // At Lib.Pivot.pushNumbersToArray can be issue with rowAt - EXTJS-25284
                        Lib.Pivot.pushNumbersToArray(array, columnNumber, i, gridPrefix);
                    }
                }).and(function(){
                    var fn = Lib.Pivot.sortArray(direction);
                    var dividedSorted = [];
                    if(Grid.getRowCount() > 10){
                        // divide array, because groups are sorted, so we need check only groups
                        dividedSorted = Lib.Pivot.divideArray(array, sumGroup);
                        var firstElements = [];
                        for(var i = 0; i < dividedSorted.length; i++){
                            //firstElements - it is array of cells of Sums for each Person
                            firstElements.push(dividedSorted[i][0]);
                            dividedSorted[i].shift();
                        }
                        expect(Lib.Pivot.isSorted(firstElements, fn)).toBeTruthy();
                        for(var j = 0; j < dividedSorted.length; j++){
                            expect(Lib.Pivot.isSorted(dividedSorted[j], fn)).toBeTruthy();
                        }
                    } else {
                        expect(Lib.Pivot.isSorted(array, fn)).toBeTruthy();
                    }
                });
        },
        scrollToRecord: function(rowAt){
            this.getPivotGrid()
                .and(function(){
                    var model = this.future.cmp.getStore().getAt(rowAt);
                    this.future.cmp.scrollToRecord(model);
                });
        },
        /**
         * Double click on item at grid in position rowAt & cellAt
         * @param rowAt - index for row
         * @param cellAt - index for cell
         * @TODO ORION-1099
         **/
        doubleClickOnItemAtGrid: function(rowAt, cellAt, programmatically){
            var delay;
            if(programmatically){
                Grid.getPivotGrid().and(function(){
                	this.future.cmp.findPlugin('pivotdrilldown')
                		.showPanel({
                			leftKey: "grandtotal",
                			topKey: Ext.first(gridPrefix + 'pivotgridrow').cells[2].getColumn().key,
                			column: Ext.first(gridPrefix).getColumns()[2]
                    });
                });
            } else {
                this.scrollToRecord(rowAt);
                this.getPivotGrid()
                    .rowAt(rowAt)
                    .cellAt(cellAt)
                    .and(function(){
                        ST.play([
                            { type: 'tap', target: this.future.el },
                            { type: 'tap', target: this.future.el, delay: 10, animation: false }
                        ]);
                    });
                Lib.waitOnAnimations();
                ST.wait(function(){
                    return Grid.DrillDown.getExtFirstVisibleSheet() !== null;
                });
            }
        },
        DrillDown: {
            sheetPrefix: (gridPrefix + 'panel[_modal=true]{isVisible()} '),
            titlePrefix: (gridPrefix + 'panel[_modal=true]{isVisible()} titlebar[_title!=""] '),
            gridPrefix: (gridPrefix + 'panel[_modal=true]{isVisible()} grid '),
            pagingPrefix: (gridPrefix + 'panel[_modal=true]{isVisible()} grid pagingtoolbar '),
            getExtFirstVisibleSheet: function(){
                return Ext.first(Grid.DrillDown.sheetPrefix);
            },
            getTitleBar: function(){
                return ST.component(Grid.DrillDown.titlePrefix);
            },
            isTitleBar: function(title){
                return Grid.DrillDown.getTitleBar()
                        .and(function(){
                            expect(this.future.cmp.getTitle()).toBe(title);
                        });
            },
            getDoneButton: function(){
                return ST.component(Grid.DrillDown.titlePrefix + 'button[text=Done]');
            },
            clickOnDoneButton: function(){
                Grid.DrillDown.getDoneButton().click();
                ST.wait(function(){
                    return Grid.DrillDown.getExtFirstVisibleSheet() === null;
                });
            },
            getGrid: function(){
                return ST.grid(Grid.DrillDown.gridPrefix);
            },
            scrollToRecord: function(rowAt){
                Grid.DrillDown.getGrid()
                    .and(function(){
                        var model = this.future.cmp.getStore().getAt(rowAt);
                        this.future.cmp.scrollToRecord(model);
                    });
            },
            getGridColumn: function(key){
                return ST.component(Grid.DrillDown.gridPrefix + 'column[' + key + ']');
            },
            getPagingToolbar: function(){
                return ST.component(Grid.DrillDown.pagingPrefix);
            },
            getPagingButton: function(key){
                return ST.button(Grid.DrillDown.pagingPrefix + 'button[' + key + ']');
            },
            getPagingSlider: function(){
                return ST.component(Grid.DrillDown.pagingPrefix + 'slider');
            },
            getPagingThumb: function(){
                return Grid.DrillDown.getPagingSlider().down('>> .x-thumb');
            },
            getPagingText: function(){
                return ST.component(Grid.DrillDown.pagingPrefix + 'component[xtype=component]');
            },
        },
    };
    beforeAll(function(){
        Lib.beforeAll(exampleUrlPostfix, examplePrefix, 250);
        Grid.getPivotGrid().visible()
            .and(function(){
                this.future.cmp.refresh();
            });
        ST.component(examplePrefix + 'container pivotgridrow[isFirst=true]').visible();
        Grid.getPivotGrid().visible()            
            .and(function(){
                defaultCountColumn = this.future.cmp.getColumns().length;
                defaultCountRow = this.future.cmp.getStore().getData().length;
            });
    });
    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });
    describe('Default display UI and correctly loaded', function(){
        it('Example is loaded properly', function(){
            Grid.getPivotGrid().viewReady();
        });
        it('Screenshot should be same', function(){
            Lib.screenshot(screenshotPrefix);
        });
        it('Should be collapsed all of Rows items', function(){
            Grid.isCountRows(defaultCountRow);
        });
        it('Should be collapsed all of Columns items', function(){
            Grid.isCountColumns(defaultCountColumn);
        });
    });
    /**
     * Describe DrillDown Window
     * @NOTE Browser should be focused and displayed otherwise tests at this describe will be failing
     **/
    describe('DrillDown Window', function(){
        it('Opening & Closing window', function(){
            Grid.doubleClickOnItemAtGrid(Grid.getRowCount() - 1, 3);
            Grid.getPivotGrid()
                .and(function(){
                    expect(Grid.DrillDown.sheetPrefix).toBeDefined();
                    expect(Grid.DrillDown.getExtFirstVisibleSheet()).not.toBe(null);
                });
            Grid.DrillDown.clickOnDoneButton();
            Grid.getPivotGrid().and(function(){
                expect(Grid.DrillDown.getExtFirstVisibleSheet()).toBe(null);
            });
        });
        describe('Window', function(){
            beforeAll(function(){
                if(!Grid.DrillDown.getExtFirstVisibleSheet()){
                    Grid.doubleClickOnItemAtGrid(Grid.getRowCount() - 1, 3, true);
                }
            });
            afterAll(function(){
                Grid.DrillDown.clickOnDoneButton();
            });
            describe('Default UI', function(){
                it('Take a screenshot', function(){
                    Lib.screenshot(screenshotPrefix + '-drilldown-window');
                });
                it('Should be visible components', function(){
                    Grid.DrillDown.getTitleBar().visible()
                        .expect('isVisible').toBeTruthy();
                    Grid.DrillDown.getGrid().visible()
                        .expect('isVisible').toBeTruthy();
                    Grid.DrillDown.getPagingToolbar().visible()
                        .expect('isVisible').toBeTruthy();
                });
                it('Should be displayed correct title', function(){
                    Grid.DrillDown.isTitleBar('Drill down');
                });
                it('Should be displayed correct button text', function(){
                    Grid.DrillDown.getDoneButton().visible()
                        .and(function(){
                            expect(this.future.cmp.getText()).toBe('Done');
                        });
                });
                it('Pagingtoolbar has two buttons, slider and text indicator in DOM', function(){
                    Grid.DrillDown.getPagingSlider().visible()
                        .expect('isVisible').toBeTruthy();
                    Grid.DrillDown.getPagingButton('_iconCls=x-pagingtoolbar-prev').visible()
                        .expect('isVisible').toBeTruthy();
                    Grid.DrillDown.getPagingButton('_iconCls=x-pagingtoolbar-next').visible()
                        .expect('isVisible').toBeTruthy();
                    Grid.DrillDown.getPagingText().visible()
                        .expect('isVisible').toBeTruthy();
                });
            });
            describe('Grid - Scroll & click', function(){
                beforeAll(function(){
                    Grid.DrillDown.getGrid()
                        .and(function(){
                            this.future.cmp.refresh();
                        }).viewReady();
                });
                afterEach(function(){
                    Grid.DrillDown.scrollToRecord(0);
                });
                it('is clickable', function(){
                    Grid.DrillDown.getGrid()
                        .visible()
                        .rowAt(10)
                        .reveal()
                        .click()
                        .and(function(){
                            expect(this.future.el.dom.className).toContain('x-selected');
                        });
                });
                it('is scrolled by clicking on buttons', function(){
                    pending('EXTJS-25310 - Count of pages are wrong displayed at the paging toolbar');
                    var scroller;
                    Grid.DrillDown.getGrid()
                        .visible()
                        .and(function(){
                            scroller = this.future.cmp.getScrollable().getScrollElement().dom.scrollTop;
                        });
                    Grid.DrillDown.getPagingButton('_iconCls=x-pagingtoolbar-next').click();
                    Grid.DrillDown.getGrid()
                        .visible()
                        .wait(function(){
                            return this.cmp.getScrollable().getScrollElement().dom.scrollTop !== 0;
                        })
                        .and(function(){
                            expect(this.future.cmp.getScrollable().getScrollElement().dom.scrollTop).toBeGreaterThan(scroller);
                        });
                });
                it('is scrolled by clicking on slider', function(){
                    pending('EXTJS-25310 - Count of pages are wrong displayed at the paging toolbar');
                    var scroller;
                    Grid.DrillDown.getGrid()
                        .visible()
                        .and(function(){
                            scroller = this.future.cmp.getScrollable().getScrollElement().dom.scrollTop;
                        });
                    Grid.DrillDown.getPagingSlider().click();
                    Grid.DrillDown.getGrid()
                        .and(function(){
                            expect(this.future.cmp.getScrollable().getScrollElement().dom.scrollTop).not.toBe(scroller);
                        });
                });
            });
            describe('Grid - Columns', function(){
                function isSortable(column){
                    describe('Column ' + column.name, function(){
                        function sortColumn(column, direction){
                            it('Should be sorted ' + direction, function(){
                                Grid.DrillDown.getGridColumn(column.selector).click()
                                    .gotoGrid('grid', 'up')
                                    .and(function(){
                                        var sorter = this.future.cmp.getStore().getSorters().getAt(0);
                                        expect(sorter.getDirection()).toBe(direction);
                                        expect(sorter.getProperty()).toBe(column.property);
                                    });
                            });
                        }
                        var direction = ['ASC', 'DESC'];
                        for(var i = 0; i < direction.length; i++){
                            sortColumn(column, direction[i]);
                        }
                    });
                }
                var columns = [{
                        selector: '_text=Company',
                        name: 'Company',
                        property: 'company'
                    },
                    {
                        selector: '_text=Person',
                        name: 'Person',
                        property: 'person'
                    }
                ];
                for(var i = 0; i < columns.length; i++){
                    isSortable(columns[i]);
                }
            });
            describe('Grid - Pagingtoolbar - EXTJS-25310', function(){
                afterEach(function(){
                    Grid.DrillDown.scrollToRecord(0);
                });
                /**
                 * Test for text indicator of page
                 * @NOTE These tests Indicator of page are failing sometimes on iPhone device (iPhone 4 iOS 7, 8)
                 **/
                describe('Indicator of page - EXTJS-25310', function(){
                    var page;
                    beforeEach(function(){
                        Grid.DrillDown.getPagingText()
                            .wait(function(){
                                return parseInt(this.el.dom.innerText.slice(0, 1)) === 1;
                            })
                            .and(function(){
                                page = 1;
                            });
                    });
                    it('Changes position after scroll in grid', function(){
                        pending('EXTJS-25310 - Count of pages are wrong displayed at the paging toolbar');
                        Grid.DrillDown.scrollToRecord(40);
                        Grid.DrillDown.getGrid();
                        Grid.DrillDown.getPagingText()
                            .wait(function(){
                                return (parseInt(this.el.dom.innerText.slice(0, 1))) > page;
                            })
                            .and(function(){
                                expect(parseInt(this.future.el.dom.innerText.slice(0, 1))).toBeGreaterThan(page);
                            });
                    });
                    it('Changes text after clicking on right button', function(){
                        pending('EXTJS-25310 - Count of pages are wrong displayed at the paging toolbar');
                        Grid.DrillDown.getPagingButton('_iconCls=x-pagingtoolbar-next').click();
                        Grid.DrillDown.getGrid();
                        Grid.DrillDown.getPagingText()
                            .wait(function(){
                                return (parseInt(this.el.dom.innerText.slice(0, 1)) - 1) === page;
                            })
                            .and(function(){
                                expect(parseInt(this.future.el.dom.innerText.slice(0, 1)) - 1).toBe(page);
                            });
                    });
                    it('Changes text after clicking on left button', function(){
                        pending('EXTJS-25310 - Count of pages are wrong displayed at the paging toolbar');
                        Grid.DrillDown.getPagingButton('_iconCls=x-pagingtoolbar-next').click();
                        Grid.DrillDown.getGrid();
                        Grid.DrillDown.getPagingText()
                            .wait(function(){
                                return (parseInt(this.el.dom.innerText.slice(0, 1)) - 1) === page;
                            });
                        Grid.DrillDown.getPagingButton('_iconCls=x-pagingtoolbar-prev').click();
                        Grid.DrillDown.getGrid();
                        Grid.DrillDown.getPagingText()
                            .wait(function(){
                                return (parseInt(this.el.dom.innerText.slice(0, 1))) === page;
                            })
                            .and(function(){
                                expect(parseInt(this.future.el.dom.innerText.slice(0, 1))).toBe(page);
                            });
                    });
                    it('Changes text after clicking on slider', function(){
                        pending('EXTJS-25310 - Count of pages are wrong displayed at the paging toolbar');
                        Grid.DrillDown.getPagingSlider().click();
                        Grid.DrillDown.getGrid();
                        Grid.DrillDown.getPagingText()
                            .wait(function(){
                                return parseInt(this.el.dom.innerText.slice(0, 1)) > page;
                            })
                            .and(function(){
                                expect(parseInt(this.future.el.dom.innerText.slice(0, 1))).toBeGreaterThan(page);
                            });
                    });
                });
                describe('Slider - EXTJS-25310', function(){
                    var sliderWidth;
                    beforeAll(function(){
                        Grid.DrillDown.getPagingSlider()
                            .and(function(){
                                sliderWidth = this.future.el.dom.offsetWidth;
                            });
                    });
                    it('Changes position after scroll in grid', function(){
                        pending('EXTJS-25310 - Count of pages are wrong displayed at the paging toolbar');
                        Grid.DrillDown.scrollToRecord(40);
                        Grid.DrillDown.getPagingThumb()
                            .and(function(){
                                expect(parseInt(this.future.el.dom.style.left.split('.')[0])).toBeGreaterThan(0);
                            });
                    });
                    it('Changes position after clicking on right button', function(){
                        pending('EXTJS-25310 - Count of pages are wrong displayed at the paging toolbar');
                        Grid.DrillDown.getPagingButton('_iconCls=x-pagingtoolbar-next').click();
                        Grid.DrillDown.getPagingThumb()
                            .and(function(){
                                expect(parseInt(this.future.el.dom.style.left.split('.')[0])).toBeGreaterThan(0);
                            });
                    });
                    it('Changes position after clicking on left button', function(){
                        pending('EXTJS-25310 - Count of pages are wrong displayed at the paging toolbar');
                        var position;
                        Grid.DrillDown.getPagingButton('_iconCls=x-pagingtoolbar-next').click();
                        Grid.DrillDown.getPagingThumb()
                            .and(function(){
                                position = parseInt(this.future.el.dom.style.left.split('.')[0]);
                            });
                        Grid.DrillDown.getPagingButton('_iconCls=x-pagingtoolbar-prev').click();
                        Grid.DrillDown.getPagingThumb()
                            .and(function(){
                                expect(parseInt(this.future.el.dom.style.left.split('.')[0])).toBeLessThan(position);
                            });
                    });
                    it('Changes position after clicking on slider', function(){
                        pending('EXTJS-25310 - Count of pages are wrong displayed at the paging toolbar');
                        var position, move;
                        Grid.DrillDown.getPagingThumb()
                            .and(function(){
                                position = parseInt(this.future.el.dom.style.left.split('.')[0]);
                                move = position < (sliderWidth / 2) ? sliderWidth * 0.75 : sliderWidth * 0.25;
                                Grid.DrillDown.getPagingSlider().click(move, 0);
                                Lib.waitOnAnimations();
                            });
                        Grid.DrillDown.getPagingThumb()
                            .and(function(){
                                expect(parseInt(this.future.el.dom.style.left.split('.')[0])).not.toBe(position);
                            });
                    });
                    it('changes position of thumb by dragging', function(){
                        pending('EXTJS-25310 - Count of pages are wrong displayed at the paging toolbar');
                        var position;
                        Grid.DrillDown.getPagingThumb()
                            .and(function(){
                                position = parseInt(this.future.el.dom.style.left.split('.')[0]);
                                var move = position > (sliderWidth / 2) ? position - 100 : position + 100;
                                Lib.DnD.dragBy(this.future.el, move, 0);
                            });
                        Grid.DrillDown.getPagingThumb()
                            .wait(function(){
                                return parseInt(this.el.dom.style.left.split('.')[0]) !== position;
                            })
                            .and(function(){
                                expect(parseInt(this.future.el.dom.style.left.split('.')[0])).not.toBe(position);
                            });
                    });
                    it('changes CSS of thumb while dragging', function(){
                        Grid.DrillDown.getPagingThumb()
                            .and(function(){
                                function isPressed(){
                                    Grid.DrillDown.getPagingThumb()
                                        .and(function(){
                                            expect(this.future.el.dom.className).toContain('x-pressing');
                                        });
                                }
                                Lib.DnD.dragByWithFunction(this.future.el, 100, 0, isPressed);
                            });
                    });
                });
            });
        });
    });
    describe('Expandable & Collapsible', function(){
        function createITGrandTotalIsLastRow(){
            /**
             * Sometime it was failing with message error: 'Failed with error "this.future.el is null"'
             * Added the line Grid.getPivotGrid(); because it fixed for all browsers exception firefox there fails are less frequently.
             **/
            it('Grand Total is on last row', function(){
                Grid.scrollToRecord(Grid.getRowCount() - 1);
                Grid.getPivotGrid();//Added line due to try fix random issue
                Grid.getPivotGrid()
                    .rowAt((Grid.getRowCount() - 1))
                    .cellAt(0)
                    .wait(function(){
                        return this !== null;
                    })
                    .and(function(){
                        expect(this.future.el.dom.innerText).toContain('Grand total');
                    });
                Grid.scrollToRecord(0);
            });
        }
        beforeAll(function(){
            Grid.collapseAll();
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
        it('Expanding and collapsing rows - EXTJS-25284', function(){
            ST.element(gridPrefix + 'pivotgridrow[$position!=-10000] pivotgridgroupcell[_value=Adobe] => div.x-pivot-grid-group-icon').click();
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultCountRow !== this.cmp.getStore().getData().length;
                }).and(function(){
                    expect(this.future.cmp.getStore().getData().length).toBeGreaterThan(defaultCountRow);
                });
            ST.element(gridPrefix + 'pivotgridrow[$position!=-10000] pivotgridgroupcell[_value=Adobe] => div.x-pivot-grid-group-icon').click();
            Grid.getPivotGrid().visible()
                .wait(function(){
                    return defaultCountRow === this.cmp.getStore().getData().length;
                }).and(function(){
                    expect(this.future.cmp.getStore().getData().length).toBe(defaultCountRow);
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
        Grid.createDescribeForSorting(0);
        describe('Column 2012', function(){
            beforeAll(function(){
                Grid.expandOrCollapseYearColumn('2012');
            });
            afterAll(function(){
                Grid.expandOrCollapseYearColumn('2012');
            });
            Grid.createDescribeForSorting(2);
            Grid.createDescribeForSorting(14);
        });
        describe('Sorting Grand total', function(){
            describe('when all are collapsed', function(){
                beforeAll(function(){
                    Grid.collapseAll();
                });
                it('is sorted ASC', function(){
                    var i = Ext.first(gridPrefix).getColumns().length - 1;
                    if(Ext.ComponentQuery.query(gridPrefix + 'headercontainer gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                        Grid.clickOnColumn(i);
                    }
                    Grid.sortColumn(i, 'ASC');
                });
                it('is sorted DESC', function(){
                    var i = Ext.first(gridPrefix).getColumns().length - 1;
                    if(!Ext.ComponentQuery.query(gridPrefix + 'headercontainer gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                        Grid.clickOnColumn(i);
                    }
                    Grid.sortColumn(i, 'DESC');
                });
            });
            describe('when all are expanded', function(){
                beforeAll(function(){
                    Grid.expandAll();
                });
                afterAll(function(){
                    Grid.collapseAll();
                });
                it('is sorted ASC - ORION-1726', function(){
                    pending('ORION-1726 - PivotGrid rowAt() will not work for big pivotGrids');
                    var i = Ext.first(gridPrefix).getColumns().length - 3;
                    if(Ext.ComponentQuery.query(gridPrefix + 'headercontainer gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                        Grid.clickOnColumn(i);
                    }
                    Grid.sortColumn(i, 'ASC');
                });
                it('is sorted DESC - ORION-1726', function(){
                    pending('ORION-1726 - PivotGrid rowAt() will not work for big pivotGrids');
                    var i = Ext.first(gridPrefix).getColumns().length - 3;
                    if(!Ext.ComponentQuery.query(gridPrefix + 'headercontainer gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                        Grid.clickOnColumn(i);
                    }
                    Grid.sortColumn(i, 'DESC');
                });
            });
        });
    });
    describe('Source code', function(){
        it('should open, check and close', function(){
            Lib.sourceClick('KitchenSink.view.pivot.DrillDown');
        });
    });
});
