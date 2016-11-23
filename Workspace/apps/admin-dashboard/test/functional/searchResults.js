describe('Page search results', function() {
    /*
     * Futures enable tests to practice the DRY (Don’t Repeat Yourself) principle.
     * Instead of creating the future instance at the point of need,
     * consider the following alternative.
     */
    var Dash = {
        // Sencha Test provides multiple ways to locate an element from a text string
        // A locator solves the same problem as a CSS selector but is a super-set of CSS selector syntax.
        // The locator syntax is more expressive than selectors to provide more options for testing real-world applications.
        // When testing applications, ideally the application developers provide a reliable way for testers
        // to locate application components and elements.
        // More info can be found in documentation http://docs.sencha.com/sencha_test/ST.Locator.html

        // Following locates ExtJS Grid component based on it's xtype and title property - this locator is called ComponentQuery
        // and can be used to locate Components in applications built using Sencha frameworks.
        // The majority of logic operates at a layer above elements: Components.
        // It is therefore more desirable to locate and operate on components than raw DOM elements.
        // http://docs.sencha.com/extjs/6.0/6.0.2-classic/#!/api/Ext.ComponentQuery
        searchGridAll: function () {
            return ST.grid('gridpanel[title=All]');
        },

        searchGridUsRes: function(){
            return ST.grid('grid[title=User Results]');
        },

        // Another example of Component query using diffent property - title
        searchTabbarTab: function(title){
            return ST.component('tabbar tab[title=' + title + ']');
        },

        searchMessGrid: function(){
            return ST.grid('grid[title=Messages]');
        },

        // Scrolls app main container to desired Y offset
        mainPanelScrollY: function(scroll){
            return ST.component('container[id=main-view-detail-wrap]').and(function(panel){
                panel.setScrollY(scroll);
            });
        },

        // This ComponentQuery locator return Ext.grid.Column instance identified by it's parent grid and column name
        columnHeader: function(name){
            return ST.component('grid[title=User Results] gridcolumn[text=' + name + ']');
        },

        isDesktop : ST.os.deviceType == "Desktop"
    };

    beforeEach(function(){
        Admin.app.redirectTo("#searchresults"); // make sure you are on search results page
    });

    describe('Tab \'All\'', function(){

        describe('Screenshot tab \'All\'', function(){
            //visually check whole page
            it('should take screenshot', function(){
                //wait for components to be available and animations finished before taking screenshot
                Dash.searchTabbarTab('All')
                    .visible()
                    .rendered();
                ST.screenshot('tabAll');
            });
        });
        
        describe('Gridpanel', function(){
            it('should be visible', function() {
                Dash.searchGridAll()
                    .rendered()
                    .and(function (grid) {
                        expect(grid.isHidden()).toBe(false);
                    });
            });

            for (var i = 0; i < 10; i++) {
                checkRowSelection(i);
            }

            function checkRowSelection (i) {
                it('row # '+i+' should be selected after click', function(){
                    var selRow,gridStore;
                    //click first ten rows of grid and check they are selected
                        Dash.searchGridAll()
                            .viewReady()
                            .rowAt(i) // get row at index i
                            .reveal() // scroll row into view
                            .click(100,10) // and click at x,y coordinates
                            .wait(function(row){
                                console.log(row);
                                return row.el.dom.className.indexOf('x-grid-item-selected') > 0;
                            })
                            .and(function(row){
                                expect(row.el.dom.className.indexOf('x-grid-item-selected') > 0).toBe(true);
                            });
                });
            }
        });
    });

    describe('Tab \'User Results\'', function () {
        beforeAll(function(){
            //scroll to top and select the right tab before each spec
            Dash.mainPanelScrollY(0);
            Dash.searchTabbarTab('User Results')
                .visible()
                .click();
        });

        describe('Screenshot tab \'User Results\'', function(){
            //visually check whole page
            it('should take screenshot', function(){
                //wait for components to be available and animations finished before taking screenshot
                Dash.searchTabbarTab('User Results')
                    .visible()
                    .rendered();
                ST.screenshot('tabUserResults');
            });
        });

        describe('Gridpanel', function() {
            it('should be visible', function () {
                Dash.searchGridUsRes()
                    .visible()
                    .and(function (grid) {
                        expect(grid.isHidden()).toBe(false);
                    });
            });

            //click each sortable header and check that corresponding column is sorted using sorter
            it('should sort after click on header', function(){
                var store = Ext.ComponentQuery.query('grid[title=User Results]')[0].getStore();
                var names = ['#', 'User', 'Name', 'Email', 'Date', 'Subscription', 'Actions'];

                for (var i = 1; i < names.length; i++) {
                    if (Ext.ComponentQuery.query('grid[title=User Results] gridcolumn[text=' + names[i] + ']')[0].sortable) {
                        Dash.columnHeader(names[i]).visible().click();

                        Dash.searchGridUsRes()
                            .visible()
                            .and(function(){
                                expect(store.getSorters().getAt(0).getDirection()).toBe('ASC');
                            });

                        Dash.columnHeader(names[i]).click();

                        Dash.searchGridUsRes().visible().and(function(){
                            expect(store.getSorters().getAt(0).getDirection()).toBe('DESC');
                        });
                    }
                }
            });

            //select first ten rows, click them and make sure each row is selected
            describe('selecting grid rows', function(){
                function clickRow(i){
                    it('Clicking row '+ i + ' selects row ' + i, function () {
                        Dash.searchGridUsRes()
                            .visible()
                            .rowAt(i)
                            .reveal()
                            .click()
                            .wait(function(row){
                                console.log(row);
                                return row.el.dom.className.indexOf('x-grid-item-selected') > 0;
                            })
                            .and(function(row){
                                expect(row.el.dom.className.indexOf('x-grid-item-selected') > 0).toBe(true);
                            });
                    });
                }

                for (var i = 0; i < 10; i++) {
                    clickRow(i);
                }
            });
        });
    });

    describe('Tab \'Messages\'', function(){
        beforeAll( function(){
            //scroll to the top and select the right tab
            Dash.mainPanelScrollY(0);
            Dash.searchTabbarTab('Messages')
                .rendered()
                .click();
        });

        describe('Screenshot tab \'Messages\'', function(){
            //visually check whole page
            it('should take screenshot', function(){
                //wait for components to be available and animations finished before taking screenshot
                Dash.searchTabbarTab('Messages')
                    .visible()
                    .rendered();
                ST.screenshot('tabMessages');
            });
        });

        describe('Gridpanel', function(){
            it('should be visible', function(){
                Dash.searchMessGrid()
                    .visible()
                    .and(function(grid){
                        expect(grid.isHidden()).toBe(false);
                    });
            });

            //select first ten rows, click them and make sure each row is selected
            describe('selecting grid rows', function(){
                function clickRow(i){
                    it('Clicking row '+ i + ' selects row ' + i, function () {
                        Dash.searchMessGrid()
                            .visible()
                            .rowAt(i)
                            .cellAt(1)
                            .click();
                        Dash.searchMessGrid()
                            .visible()
                            .rowAt(i)
                            .wait(function(row){
                                console.log(row);
                                return row.el.dom.className.indexOf('x-grid-item-selected') > 0;
                            })
                            .and(function(row){
                                expect(row.el.dom.className.indexOf('x-grid-item-selected') > 0).toBe(true);
                            });
                    });
                }

                for (var i = 0; i < 10; i++) {
                    clickRow(i);
                }
            });

            //select a cell in grid and navigate right using keyboard events, then check focus changed
            //disabled on tablets, there is no need to test keyboard navigation on keyboardless devices
            if (Dash.isDesktop) {
                it('should navigate right using keyboard', function(){
                    var prevCell;

                    Dash.searchMessGrid()
                        .viewReady()
                        .rowAt(1) //get second row
                        .cellAt(1) //get second column
                        .click() // and click to set focus, alternatively you can use .focus()
                        .and(function(cell){
                            prevCell = cell;
                        })
                        .row() // return back to row
                        .cellAt(2) //and get 3rd cell
                        .and(function(cell){
                            ST.play([
                                // using At-Path location strategy to identify elements by their id
                                {type: 'keydown', target: '@' + prevCell.el.dom.id, key: 'ArrowRight'},
                                {type: 'keyup', target: '@' + cell.el.dom.id, key: 'ArrowRight'}
                            ]);
                        }).focused();
                });

                //select a cell in grid and navigate left using keyboard events, then check focus changed
                it('should navigate left using keyboard', function(){
                    var prevCell;
                    Dash.searchMessGrid()
                        .rendered()
                        .rowAt(2)
                        .cellAt(2)
                        .click()//to set focus, alternatively you can use .focus()
                        .and(function(cell){
                            prevCell = cell;
                        })
                        .grid()
                        .rowAt(2)
                        .cellAt(1)
                        .and(function(cell){
                            ST.play([
                                {type: 'keydown', target: '@' + prevCell.el.dom.id, key: 'ArrowLeft'},
                                {type: 'keyup', target: '@' + cell.el.dom.id, key: 'ArrowLeft'}
                            ])
                        }).focused()
                });
            }
        });
    });
});
