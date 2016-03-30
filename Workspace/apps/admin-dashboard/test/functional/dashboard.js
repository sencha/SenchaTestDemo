describe('Page Dashboard', function() {
    var Dash = {
        tool: function (toolName) {
            return ST.component('panel[title=Network] tool[type=' + toolName + ']');
        }, 
        todoGrid : function(){
            return ST.grid('panel[title=TODO List] grid');
        },
        todoTextfield: function(){
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
            ST.component('panel[title=TODO List]').visible();
            ST.component('panel[title=Network]').visible();
            ST.component('panel[title=Services]').visible();
        });
        
        //visually check whole page
        it('should take screenshot after 500ms wait', function(done){
            //wait for components to be available and animations finished before taking screenshot
            ST.component('panel[title=Network]').visible().wait(500/*if screens vary, try to increase this a bit*/).and(function(){
                ST.screenshot('dashboard', done);
            });
        }, 1000 * 20);
    });
    describe('Panel \'TODO List\'', function(){
        describe('Gridpanel', function(){
            it('should select multiple rows by clicking on checkboxes', function(){
                var model;

                //not necessary for test execution, but it is nice to see what's happening
                Dash.mainPanelScrollY(400);

                Dash.todoGrid().visible()
                    .and(function(grid){
                        model = grid.getSelectionModel();
                    })
                    .rowAt(0).cellAt(0).click().wait(100)
                    .grid().rowAt(2).cellAt(0).click(15,15).wait(100)
                    .grid().rowAt(3).cellAt(0).click(15,15).wait(100).and(function(){
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
                Dash.todoTextfield()
                    .visible()
                    .click()
                    .focus()
                    .type('Write some tests')
                    .wait(100)
                    .and(function(field){
                        expect(field.value).toBe('Write some tests');
                    });
            });
        });
    });
    describe('Panel \'Network\'', function(){
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
                var data1, data2;
                
                //when animation is running the underlying data are changing 
                //so we store data, start animation and compare the new data with the old ones
                ST.component('panel[title=Network] chartnetwork')
                    .and(function(panel){
                        data1 = panel.getStore().getAt(0).data;
                    });
                
                Dash.tool('refresh')
                    .visible()
                    .click()
                    .wait(1000)
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