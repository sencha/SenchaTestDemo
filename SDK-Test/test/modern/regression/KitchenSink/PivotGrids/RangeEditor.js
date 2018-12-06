/**
 * @file RangeEditor.js
 * @name Kitchen Sink (Modern)/PivotGrids/RangeEditor.js
 * @created 2016/11/15
 * 
 * Tested on:
 *      Chrome, Firefox, Opera, Edge, IE, Android
 *
 * updated by Jiri Znoj
 * 28. 7. 2017
 * tested on:
 *      desktop:
 *          Chrome 59
 *          Edge 15
 *          FF 54
 *          IE 11
 *          Safari 11
 *      tablet:
 *          Edge 14
 *          Safari 10
 *          Android 5.0, 7.1
 *      phone:
 *          Android 5, 6, 7.0
 *          Safari 9
 *  remain sorting bug - EXTJS-25684
 */
describe('Pivot Grid - RangeEditor plugin', function(){
    /**
     * Custom variables for application
     **/
    var examplePrefix = 'rangeeditor-pivot-grid{isVisible()} ';
    var gridPrefix = examplePrefix + 'pivotgrid ';
    var exampleUrlPostfix = '#rangeeditor-pivot-grid';
    var buffS;
    var Grid = {
        getRowCount: function(){
            return Ext.first(gridPrefix).getStore().getData().length;
        },
        getColumns: function(){
            return Ext.first(gridPrefix).getColumns();
        },
        getPivotGrid: function(){
            return ST.grid(gridPrefix);
        },
        clickOnColumn: function(index){
            return Grid.getPivotGrid().visible()
                .and(function(){
                    ST.element('#' + this.future.cmp.getColumns()[index].getId()).click();
                });
        },
        getButton: function(value){
            return ST.button(examplePrefix + 'toolbar button[text=' + value + ']');
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
        expandOrCollapseYearColumn: function(year){
            ST.element(gridPrefix + 'headercontainer gridcolumn[_text=<div class="x-pivot-grid-group-icon x-font-icon"></div><div class="x-pivot-grid-group">' + year + '</div>]:last => div.x-pivot-grid-group-icon').click();
        },
        Range: {
            sheetPrefix: (gridPrefix + 'pivotrangeeditor '),
            getSheet: function(){
                return ST.component(Grid.Range.sheetPrefix);
            },
            getType: function(num){
                return ST.component('boundlist simplelistitem[$datasetIndex=' + num + ']');
            },
            getField: function(label){
                return ST.textField(Grid.Range.sheetPrefix + 'textfield[_label=' + label + ']');
            },
            getButton: function(text){
                return ST.component(Grid.Range.sheetPrefix + 'button[_text=' + text + ']');
            },
            columnData: function(field, num, from, to){
                for(var i = (from? from : 1); i < (to? to : Grid.getRowCount()); i++){
                    var x = Lib.xpath("//div[contains(@data-componentid, 'pivotgridrow')][" + i + "]//div[contains(@data-componentid, 'pivotgridcell')][" + num + "]");
                    if(x.snapshotItem(0).innerText === ''){
                        field.push(0);
                        continue;
                    }
                    field.push(x.snapshotItem(0).innerText);
                }
            },
        }
    };
    var value, column = [], next = [];
    var type = ['Percentige', 'Increment', 'Overwrite', 'Uniform'];
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
        Lib.beforeAll(exampleUrlPostfix, gridPrefix + 'pivotgridcell[value=Adobe]', 250);
        Grid.getPivotGrid()
            .visible()
            .and(function(){
                buffS = this.future.cmp.getBufferSize();
                this.future.cmp.setBufferSize(200);
                this.future.cmp.refresh();
            });
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
        Grid.getPivotGrid()
            .viewReady();
    });
    it('screenshot should be same', function(){
        Lib.screenshot("UI_RangeEditor_pivotgrid");
    });
    describe('open range editor plugin by "dbclick"', function(){
        var rows;
        beforeAll(function(){
            Grid.getPivotGrid()
                .and(function(){
                    rows = this.future.cmp.getStore().getData().length;
                    this.future.cmp.expandAllRows();
                })
                .down('pivotgridgroupcell:first')
                .wait(function(cell){
                    return cell.dom.className.indexOf('collapsed') < 0;
                });
            Grid.getPivotGrid()
                .wait(function(){
                    return rows < this.cmp.getStore().getData().length;
                });
        });
        afterAll(function(){
            Grid.getPivotGrid()
                .and(function(){
                    this.future.cmp.collapseAllRows();
                })
                .down('pivotgridgroupcell:first')
                .wait(function(cell){
                    return cell.dom.className.indexOf('collapsed') >= 0;
                });
        });
        it('main row - ST bug ORION-561', function(){
            if(Lib.isDesktop && !ST.browser.is.Edge && !ST.browser.is.IE){
                Grid.getPivotGrid()
                    .rowAt(0)
                    .cellAt(2)
                    .and(function(){
                        var xCoordinates = this.future.el.dom.clientWidth*3/4;
                        if(Number(this.future.getValue) < 999){
                            this.future.setValue(9999999);
                        }
                        ST.play([
                            { type: 'tap', x: xCoordinates, target: this.future.el },
                            { type: 'tap', x: xCoordinates, target: this.future.el, delay: 10, animation: false }
                        ]);
                    });
                Grid.Range.getSheet()
                    .visible()
                    .wait(function(s){
                        return s.el.dom.clientHeight > 0;
                    });
                Grid.Range.getButton('Ok').click();
                Grid.Range.getSheet().hidden();
            } else {
                pending('Double-click does not work on touch devices and Edge/IE');
            }
        });
        it('subgroup row', function(){
            if(Lib.isDesktop && !ST.browser.is.Edge && !ST.browser.is.IE){
                Grid.getPivotGrid()
                    .rowAt(3)
                    .cellAt(3)
                    .and(function(){
                        var xCoordinates = this.future.el.dom.clientWidth*3/4;
                        if(Number(this.future.getValue) < 999){
                            this.future.setValue(9999999);
                        }
                        ST.play([
                            { type: 'tap', x: xCoordinates, target: this.future.el },
                            { type: 'tap', x: xCoordinates, target: this.future.el, delay: 10, animation: false }
		                ]);
                    });
                Grid.Range.getSheet()
                    .visible()
                    .wait(function(s){
                        return s.el.dom.clientHeight > 0;
                    });
                Grid.Range.getButton('Ok').click();
                Grid.Range.getSheet().hidden();
            } else {
                pending('Double-click does not work on touch devices and Edge/IE');
            }
        });
    });
    describe('edit group row', function(){
        beforeEach(function(){
            Grid.getPivotGrid()
                .wait(function(){
                    return Ext.first(gridPrefix).getLeftAxisItem(Ext.first(gridPrefix + 'pivotgridrow').cells[2].getRecord()) !== undefined;
                })
                .and(function(){
                    this.future.cmp
                        .findPlugin('pivotrangeeditor')
                        .showPanel({
                            leftKey: Ext.first(gridPrefix).getLeftAxisItem(Ext.first(gridPrefix + 'pivotgridrow').cells[2].getRecord()).key,
                            topKey: Ext.first(gridPrefix + 'pivotgridrow').cells[2].getColumn().key,
                            column: Ext.first(gridPrefix).getColumns()[2]
                        });
                });
            Grid.Range.getSheet()
                .visible()
                .wait(function(s){
                    return s.el.dom.clientHeight > 0;
                });
        });
        it('clear row', function(){
            ST.element('textfield[_label=Value] => div.x-cleartrigger').click();
            Grid.Range.getButton('Ok').visible().click().hidden();
            Grid.Range.getSheet()
                .hidden()
                .wait(function(s){
                    return s.el.dom.clientHeight === 0;
                });
            Grid.getPivotGrid()
                .rowAt(0)
                .cellAt(2)
                .wait(function(cell){
                    return cell.el.dom.textContent === '0';
                })
                .and(function(){
                    expect(this.future.el.dom.textContent).toBeCloseTo('0');
                });
        });
        it('edit row', function(){
            Grid.Range.getField('Value')
                .setValue('234');
            Grid.Range.getButton('Ok').visible().click().hidden();
            Grid.Range.getSheet().hidden();
            Grid.getPivotGrid()
                .rowAt(0)
                .cellAt(2)
                .wait(function(cell){
                    return cell.el.dom.textContent == 234;
                })
                .and(function(){
                    expect(this.future.el.dom.textContent).toBeCloseTo('234');
                });
        });
        it('cancel changes', function(){
            Grid.getPivotGrid()
                .rowAt(0)
                .cellAt(2)
                .and(function(cell){
                    value = cell.el.dom.textContent;
                });
            Grid.Range.getField('Value')
                .setValue('23');
            Grid.Range.getButton('Cancel').visible().click();
            Grid.Range.getSheet().hidden();
            Grid.getPivotGrid()
                .rowAt(0)
                .cellAt(2)
                .and(function(cell){
                    expect(value).toBe(cell.el.dom.textContent);
                });
        });
        describe('Type changes', function(){
            it('Uniform should be set as default', function(){
                Grid.Range.getField('Type')
                    .and(function(){
                        expect(this.future.cmp.getValue()).toBe('uniform');
                    });
                Grid.Range.getButton('Ok').click();
                Grid.Range.getSheet().hidden();
            });
            function testTypes(i){
                it(type[i], function(){
                    next = [];
                    column = [];
                    Grid.Range.columnData(column, 1);
                    //Some times it does not click on textfield>x-after-input-el on phones, then this test case failed
                    Grid.Range.getField('Type').down('>> div.x-after-input-el').visible().click();
                    if(Lib.isPhone){
                        ST.picker('picker').rendered().visible();
                        // When wait is not here so it fails.. I don't know why.
                        ST.picker('pickerslot')
                            .wait(100)
                            .and(function(){
                                var item = Ext.get(this.future.cmp.getItemAt(i));
                                this.future.cmp.scrollToItem(item);
                                ST.element(item).click();
                            });
                        ST.component('picker button[_text=Done]').click();
                        ST.component('picker').hidden();
                    } else {
                        Grid.Range.getType(i).visible()
                            .click()
                            .hidden()
                            .and(function(){
                                if(ST.browser.is.Firefox){
                                    var len = Ext.dom.Element.query('[class=x-mask]').length;
                                    if(len > 0){
                                        Ext.dom.Element.query('[class=x-mask]')[0].remove();
                                    }
                                }

                            });
                    }
                    Grid.Range.getButton('Ok').visible().click().hidden();
                    Grid.Range.getSheet().hidden();
                    Grid.getPivotGrid()
                        .rowAt(0)
                        .cellAt(2)
                        .wait(function(cell){
                            if(i == 3){
                                return cell.el.dom.innerText == column[0];
                            } else {
                                return cell.el.dom.innerText !== column[0];
                            }
                        })
                        .and(function(){
                            Grid.Range.columnData(next, 1);
                            if(!column[c] === ''){
                                for(var c = 0; c < next.length; c++){
                                    if(i == 3){
                                        expect(next[c]).toBe(column[c]);
                                    } else {
                                        expect(next[c]).not.toBe(column[c]);
                                    }
                                }
                            }
                        });
                });
            }
            for(var i = 0; i < (type.length - 1); i++){
                testTypes(i);
            }
        });
    });
    describe('Subgroup rows', function(){
        var rows;
        beforeAll(function(){
            Grid.getPivotGrid()
                .and(function(){
                    rows = this.future.cmp.getStore().getData().length;
                    this.future.cmp.expandAllRows();
                });
            Grid.getPivotGrid()
                .wait(function(){
                    return rows < this.cmp.getStore().getData().length;
                });
        });
        afterAll(function(){
            Grid.getPivotGrid()
                .and(function(){
                    this.future.cmp.collapseAllRows();
                });
        });
        it('sum group', function(){
            var x = 0.00;
            column = [];
            Grid.Range.columnData(column, 2, 1, 8);
            Grid.getPivotGrid()
                .and(function(){
                    for(var i = 1; i < column.length; i++){
                        var f = parseFloat(column[i].replace(",", ""));
                        x += f ? f : 0.00;
                    }
                    expect(parseFloat(column[0].replace(",", ""))).toBeCloseTo(x.toFixed(2), 1);
                });
        });
        describe('Edit subgroup row', function(){
            var x, rowIndex = 1;
            beforeAll(function(){
                Grid.getPivotGrid().visible()
                    .and(function(){
                        for(var i = 6; i > 1; i--){
                            var x = Lib.xpath("//div[contains(@data-componentid, 'pivotgridrow')][" + i + "]//div[contains(@data-componentid, 'pivotgridcell')][" + 2 + "]").snapshotItem(0).innerText;
                            if(parseFloat(x.replace(",", ""))){
                        		rowIndex = i;
                        		break;
                        	}
                        }
                    });
            });
            beforeEach(function(){
                x = 0.0;
                Grid.getPivotGrid()
                    .and(function(){
                        this.future.cmp
                            .findPlugin('pivotrangeeditor')
                            .showPanel({
                                leftKey: Ext.first(gridPrefix).getLeftAxisItem(Ext.ComponentQuery.query(gridPrefix + 'pivotgridrow')[rowIndex].cells[3].getRecord()).key,
                                topKey: Ext.ComponentQuery.query(gridPrefix + 'pivotgridrow')[rowIndex].cells[3].getColumn().key,
                                column: Ext.first(gridPrefix).getColumns()[2]
                            });
                    });
                Grid.Range.getSheet()
                    .visible()
                    .wait(function(s){
                        return s.el.dom.clientHeight > 0;
                    });
            });
            it('clear row', function(){
                column = [];
                ST.element('textfield[_label=Value] => div.x-cleartrigger').click();
                Grid.Range.getButton('Ok').click();
                Grid.Range.getSheet().hidden();
                Grid.getPivotGrid()
                    .rowAt(rowIndex)
                    .cellAt(3)
                    .wait(function(cell){
                        return cell.el.dom.textContent == 0;
                    })
                    .and(function(){
                        Grid.Range.columnData(column, 2, 1, 8);
                        for(var i = 1; i < column.length; i++){
                            var f = parseFloat(column[i].replace(",", ""));
                            x += f ? f : 0.00;
                        }
                        expect(parseFloat(column[0].replace(",", ""))).toBeCloseTo(x.toFixed(2), 1);
                    });
            });
            it('edit row', function(){
                column = [];
                Grid.Range.getField('Value')
                    .setValue('234');
                Grid.Range.getButton('Ok').click();
                Grid.Range.getSheet().hidden();
                Grid.getPivotGrid()
                    .rowAt(rowIndex)
                    .cellAt(3)
                    .wait(function(cell){
                        return cell.el.dom.textContent == 234;
                    })
                    .and(function(){
                        Grid.Range.columnData(column, 2, 1, 8 );
                        for(var i = 1; i < column.length; i++){
                            var f = parseFloat(column[i].replace(",", ""));
                            x += f ? f : 0.00;
                        }
                        expect(parseFloat(column[0].replace(",", ""))).toBeCloseTo(x.toFixed(2), 1);
                    });
            });
            it('cancel changes', function(){
                Grid.getPivotGrid()
                    .rowAt(rowIndex)
                    .cellAt(3)
                    .and(function(cell){
                        value = cell.el.dom.textContent;
                    });
                Grid.Range.getField('Value')
                    .setValue('23');
                Grid.Range.getButton('Cancel').click();
                Grid.Range.getSheet().hidden();
                Grid.getPivotGrid()
                    .rowAt(rowIndex)
                    .cellAt(3)
                    .and(function(cell){
                        expect(value).toBe(cell.el.dom.textContent);
                    });
            });
        });
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
            //This IT can failed due to use cell.click above -TypeError: Cannot read property 'dom' of null
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
        createDescribeForSorting(0);
        describe('Column 2012', function(){
            beforeAll(function(){
                Grid.expandOrCollapseYearColumn('2012');
            });
            afterAll(function(){
                Grid.expandOrCollapseYearColumn('2012');
            });
            createDescribeForSorting(2);
            createDescribeForSorting(14);
        });
        describe('Sorting Grand total', function(){
            describe('when all are collapsed', function(){
                beforeAll(function(){
                    Grid.collapseAll();
                });
                it('is sorted ASC', function(){
                    var i = Ext.first(gridPrefix).getColumns().length - 1;
                    if(Ext.ComponentQuery.query(gridPrefix + 'gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                        Grid.clickOnColumn(i);
                    }
                    sortColumn(i, 'ASC');
                });
                it('is sorted DESC', function(){
                    var i = Ext.first(gridPrefix).getColumns().length - 1;
                    if(!Ext.ComponentQuery.query(gridPrefix + 'gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                        Grid.clickOnColumn(i);
                    }
                    sortColumn(i, 'DESC');
                });
            });
            describe('when all are expanded', function(){
                beforeAll(function(){
                    Grid.expandAll();
                });
                afterAll(function(){
                    Grid.collapseAll();
                });
                it('is sorted ASC', function(){
                    var i = Ext.first(gridPrefix).getColumns().length - 1;
                    if(Ext.ComponentQuery.query(gridPrefix + 'gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                        Grid.clickOnColumn(i);
                    }
                    sortColumn(i, 'ASC');
                });
                it('is sorted DESC', function(){
                    var i = Ext.first(gridPrefix).getColumns().length - 1;
                    if(!Ext.ComponentQuery.query(gridPrefix + 'gridcolumn')[i].el.dom.classList.contains('x-sorted-asc')){
                        Grid.clickOnColumn(i);
                    }
                    sortColumn(i, 'DESC');
                });
            });
        });
    });
    describe('Grand Total', function(){
        beforeAll(function(){
            Grid.getButton('Collapse all').click()
                .and(function(){
                    expect(Grid.getRowCount()).toBeLessThan(10);
                });
        });
        it('is on last row', function(){
            Grid.getPivotGrid()
                .rowAt(5)
                .cellAt(0)
                .and(function(cell){
                    expect(cell.el.dom.innerText).toContain('Grand total');
                });
        });
    });
    describe('Source code', function(){
        it('should open, check and close', function(){
            Lib.sourceClick('pivot.RangeEditor');
        });
    });
});
