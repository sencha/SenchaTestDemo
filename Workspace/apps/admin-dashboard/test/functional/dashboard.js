describe('Page Dashboard', function() {
    /*
     * Futures enable tests to practice the DRY (Don’t Repeat Yourself) principle.
     * Instead of creating the future instance at the point of need,
     * consider the following alternative.
     **/
    var Dash = {
        // Sencha Test provides multiple ways to locate an element from a text string
        // A locator solves the same problem as a CSS selector but is a super-set of CSS selector syntax.
        // The locator syntax is more expressive than selectors to provide more options for testing real-world applications.
        // When testing applications, ideally the application developers provide a reliable way for testers
        // to locate application components and elements.
        // More info can be found in documentation http://docs.sencha.com/sencha_test/ST.Locator.html

        // Example of ComponentQuery used to locate Ext.panel.Tool with variable name within panel titled Network
        tool: function (toolName) {
            return ST.component('panel[title=Network] tool[type=' + toolName + ']');
        },
        todoGrid : function(){
            return ST.grid('panel[title=TODO List] grid');
        },
        panel : function(panelName){
            return ST.component('panel[title='+panelName+']');
        },
        todoTextField: function(){
            return ST.textField('panel[title=TODO List] field');
        },
        //Scroll the main panel to ensure that target is visible
        //although Sencha Test scrolls the target into view automatically it sometimes needs a bit of help
        mainPanelScrollY: function(scroll){
            return ST.component('container[id=main-view-detail-wrap]').and(function(panel){
                panel.setScrollY(scroll);
            });
        }
    };
    beforeEach(function(){
        Admin.app.redirectTo("#dashboard"); // make sure you are on dashboard homepage
    });
    describe('Page \'Dashboard\'', function(){
        it('should be loaded correctly', function(){
            Dash.panel('TODO List').visible();
            Dash.panel('Network').visible();
            Dash.panel('Services').visible();
        });
        //visually check whole page
        it('should take screenshot', function(done){
            //wait for components to be available and animations finished before taking screenshot
            Dash.panel('Network').visible().rendered().and(function(){
                ST.screenshot('dashboard', done);
            });
        }, 1000 * 20);
    });
    describe('Panel \'TODO List\'', function(){
        describe('Gridpanel', function(){
            it('should select multiple rows by clicking on checkboxes', function(){
                var model;
                // not necessary for test execution, but it is nice to see what's happening
                Dash.mainPanelScrollY(400);
                Dash.todoGrid().visible()
                    .and(function(grid){
                        model = grid.getSelectionModel();
                    })
                    .rowAt(0).cellAt(0).click().and(function(){
                        model.isSelected(0);
                    })
                    .grid().rowAt(2).cellAt(0).click(15,15).and(function(){
                        model.isSelected(2);
                    })
                    .grid().rowAt(3).cellAt(0).click(15,15).and(function(){
                        model.isSelected(3);
                    })
                    .and(function(){
                        expect(model.isSelected(0)).toBeTruthy();
                        expect(model.isSelected(1)).toBeFalsy();
                        expect(model.isSelected(2)).toBeTruthy();
                        expect(model.isSelected(3)).toBeTruthy();
                        expect(model.isSelected(4)).toBeFalsy();
                    });
            });
        });
        describe('Textbox', function(){
            it('should write text in the field', function(){
                Dash.todoTextField()
                    .click()
                    .focus()
                    .type('Write some tests')
                    // giving framework some time process user input before checking field value
                    .valueLike('Write some tests')
                    .and(function(field){
                        expect(field.value).toBe('Write some tests');
                    });
            });
        });
    });
    describe('Panel \'Network\'', function(){
        // Network panel should have 2 action tools in header
        describe('Tool \'wrench\'', function(){
            it('should be visible', function(){
                Dash.tool('wrench')
                    .visible();  
            });
        });
        describe('Tool \'refresh\'', function(){
            it('should be visible', function(){
                Dash.tool('refresh')
                    .visible();
            });
        });
        describe('Chartnetwork chart', function(){
            it('should animate after click on tool', function(){
                var data1, data2, dataStore;
                //when animation is running the underlying data are changing 
                //so we store data, start animation and compare the new data with the old ones
                ST.component('panel[title=Network] chartnetwork')
                    .and(function(panel){
                        dataStore = panel.getStore();
                        data1 = dataStore.getAt(0).data;
                    });
                Dash.tool('refresh')
                    .click()
                    .wait(function () {
                        return dataStore.isLoaded(); // waiting for the store to load
                    })
                    .click();
                ST.component('panel[title=Network] chartnetwork')
                    .and(function(panel){
                        data2 = panel.getStore().getAt(0).data;
                    })
                    .and(function(){
                        expect(data1).not.toEqual(data2);
                    });
            });
        });
    });
    describe('Panel \'Services\'', function(){
        describe('Polar charts', function(){
            function checkInteraction(i){
                describe('Test polar chart ' + i ,function(){
                    var fl = ['first','last'];
                    it('should have enabled interaction, chart: ' + i, function(){
                        //using ComponentQuery to locate first and last Chart in Service panel
                        ST.component('panel[title=Services] polar:' + fl[i]).visible().and(function(chart){
                            expect(chart.interactions[0].type).toBe('rotate');
                        });
                    });
                });
            }
            for(var i = 0; i < 2; i++){
                checkInteraction(i);
            }
        });
    });
});