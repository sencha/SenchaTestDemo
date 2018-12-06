describe('Page search results', function() {
    var Dash = {
        searchGridAll: function () {
            return ST.grid('gridpanel[title=All]');
        },
        searchGridUsRes: function(){
            return ST.grid('grid[title=User Results]');
        },
        searchTabbarTab: function(title){
            return ST.component('tabbar tab[title=' + title + ']');
        },
        searchMessGrid: function(){
            return ST.grid('grid[title=Messages]');
        },
        mainPanelScrollY: function(scroll){
            return ST.component('container[id=main-view-detail-wrap]').and(function(panel){
                panel.setScrollY(scroll);
            });
        },
        columnHeader: function(name){
            return ST.component('grid[title=User Results] gridcolumn[text=' + name + ']');
        }
    };
    
    beforeEach(function(){
        Admin.app.redirectTo("#searchresults"); // make sure you are on search results page
    });



    describe('Tab \'All\'', function(){
        
        beforeEach(function(){
            //scroll to top and select the right tab
            Dash.mainPanelScrollY(0);
            Dash.searchTabbarTab('All')
                .rendered()
                .click();
        });

        describe('Screenshot tab \'All\'', function(){
            //visually check whole page
            it('should take screenshot after 500ms wait', function(){
                //wait for components to be available and animations finished before taking screenshot
                Dash.searchTabbarTab('All').visible().wait(500/*if screens vary, try to increase this a bit*/)
                Lib.screenshot('tabAll');
            });
        });
        
    });
    
    describe('Tab \'User Results\'', function(){
        
        beforeEach(function(){
            //scroll to top and select the right tab
            Dash.mainPanelScrollY(0);
            Dash.searchTabbarTab('User Results')
                .rendered()
                .click();
        });

        describe('Screenshot tab \'User Results\'', function(){
            //visually check whole page
            it('should take screenshot after 500ms wait', function(){
                //wait for components to be available and animations finished before taking screenshot
                Dash.searchTabbarTab('User Results').visible().wait(500/*if screens vary, try to increase this a bit*/)
                Lib.screenshot('tabUserResults');
            });
        });

        describe('Gridpanel', function() {
            it('should be visible', function () {
                Dash.searchGridUsRes()
                    .rendered()
                    .and(function (grid) {
                        expect(grid.isHidden()).toBe(false);
                    });
            });

            //click each sortable header and check that corresponding column is sorted using sorter
            it('should sort after click on header', function(){
                var store = Ext.ComponentQuery.query('grid[title=User Results]')[0].getStore();
                var names = ['#', 'User', 'Name', 'Email', 'Date', 'Subscription', 'Actions'];

                for(var i = 1; i < names.length; i++){
                    if(Ext.ComponentQuery.query('grid[title=User Results] gridcolumn[text=' + names[i] + ']')[0].sortable){

                        Dash.columnHeader(names[i]).rendered().click();

                        Dash.searchGridUsRes()
                            .rendered()
                            .and(function(){
                                expect(store.getSorters().getAt(0).getDirection()).toBe('ASC');
                            });

                        Dash.columnHeader(names[i]).rendered().click();

                        Dash.searchGridUsRes().rendered().and(function(){
                            expect(store.getSorters().getAt(0).getDirection()).toBe('DESC');
                        });
                    }
                }
            });

            //sort column using header menu and check that column is sorted using sorter
            it('should sort using menu', function(){
                var store = Ext.ComponentQuery.query('grid[title=User Results]')[0].getStore();
                var names = ['#', 'User', 'Name', 'Email', 'Subscription', 'Actions'];

                for(var i = 1; i < names.length; i++){
                    if(Ext.ComponentQuery.query('grid[title=User Results] gridcolumn[text=' + names[i] + ']')[0].sortable){

                        ST.play([
                            { type: 'mouseover', target: 'grid[title=User Results] gridcolumn[text=' + names[i] + ']' }
                        ]);

                        ST.component('grid[title=User Results] gridcolumn[text=' + names[i] + '] => div.x-column-header-trigger').click();

                        ST.component('menuitem[text=Sort Ascending]').click().and(function(){
                            expect(store.getSorters().getAt(0).getDirection()).toBe('ASC');
                        });

                        ST.play([
                            { type: 'mouseover', target: 'grid[title=User Results] gridcolumn[text=' + names[i] + ']' }
                        ]);

                        ST.component('grid[title=User Results] gridcolumn[text=' + names[i] + '] => div.x-column-header-trigger').click();

                        ST.component('menuitem[text=Sort Descending]')
                            .click()
                            .wait(100)
                            .and(function(){
                                expect(store.getSorters().getAt(0).getDirection()).toBe('DESC');
                            });

                        ST.play([
                            {type: 'mouseout', target: 'grid[title=User Results] gridcolumn[text=' + names[i] + ']'}
                        ]);
                    }
                }
            });
        });
    });
    
    describe('Tab \'Messages\'', function(){
        beforeEach( function(){
            //scroll to the top and select the right tab
            Dash.mainPanelScrollY(0);
            Dash.searchTabbarTab('Messages')
                .rendered()
                .click();
        });

        describe('Screenshot tab \'Messages\'', function(){
            //visually check whole page
            it('should take screenshot after 500ms wait', function(){
                //wait for components to be available and animations finished before taking screenshot
                Dash.searchTabbarTab('Messages').visible()
                Lib.screenshot('tabMessages');
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

            //select a cell in grid and navigate right using keyboard events, then check focus changed
            it('should navigate right using keyboard', function(){
                var prevCell;

                Dash.searchMessGrid()
                    .rendered()
                    .rowAt(1)
                    .cellAt(1)
                    .click() //to set focus, alternatively you can use .focus()
                    .and(function(cell){
                        prevCell = cell;
                    })
                    .grid()
                    .rowAt(1)
                    .cellAt(2)
                    .and(function(cell){
                        ST.play([
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
        });
    });
});