/**
 * @file AMF3.js
 * @date 26.8.2016
 *
 * Tested on: Firefox, Chrome, Opera, iOS phone 8.3, iOS tablet 9, Android6 phone, Android6 tablet
 * Passed on: all tested
 */
describe('AMF3 example', function () {
    var prefix = 'amf-three ';
    var Grid = {
        grid: function () {
            return ST.grid(prefix);
        },
        gridcolumn: function (selector) {
            return ST.component(prefix + 'gridcolumn' + selector);
        }
    };

    beforeAll(function() {
        Lib.beforeAll("#amf-three", "amf-three gridcell[value=Danish]");
    });
    afterAll(function(){
        Lib.afterAll(prefix);
    });

    it('is loaded properly and grid has 14 rows', function () {
        Grid.grid()
            .visible()
            .wait(function(grid){
                return grid.getStore().getCount();
            })
            .and(function(grid){
                expect(grid.getStore().getCount()).toBe(14);
            });
    }, 10*1000);

    it('screenshot should be same', function () {
        Lib.screenshot("modern_AMF3");
    });

    describe('Columns', function () {
        function isSortable(column) {
            describe('Column ' + column.name, function () {
                function sortColumn(column, direction) {
                    it('should be sorted ' + direction, function () {
                        Grid.gridcolumn(column.selector)
                            .click();
                        Grid.grid()
                            .and(function (grid) {
                                var sorter = grid.getStore().getSorters().getAt(0);
                                expect(sorter.getDirection()).toBe(direction);
                                expect(sorter.getProperty()).toBe(column.property);
                            });
                    });
                }

                var direction = ['ASC', 'DESC'];
                for (var i = 0; i < direction.length; i++) {
                    sortColumn(column, direction[i]);
                }
            });
        }

        var columns = [
            {
                selector: ':first',
                name: 'Language',
                property: 'language'
            },
            {
                selector: ':last',
                name: 'Pangram',
                property: 'text'
            }
        ];

        for (var i = 0; i < columns.length; i++) {
            isSortable(columns[i]);
        }
    });

    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('AMF3');
        });
    });
});

