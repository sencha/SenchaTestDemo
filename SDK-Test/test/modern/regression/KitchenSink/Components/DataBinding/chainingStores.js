/**
 * @file chainingStores.js
 * @name Components/Data Binding/Chaining Stores
 * @created 2016/11/11
 */

describe("chainingStores", function() {
     /**
     *  Custom variables for application
     **/
    var examplePrefix = "#kitchensink-view-binding-chainedstore ";
    var numberOfMovesSlider = 8;  // 10 is maximum
    var IDs;

    var Comp = {
    	getRowCount: function () {   // return number of items,which are visible in second grid
            return Ext.first(examplePrefix + 'grid[title^=People aged]').getStore().getCount();
        },
    	getRowAge: function (row) {    // return value of Age in added row
            return Ext.first(examplePrefix + 'grid[title^=People aged]').getStore().data.items[row].data.age;
        },
        getSliderValue: function () {  // return  slider value
            return Ext.first(examplePrefix + 'singlesliderfield[_label=Minimum Age]').getValue();
        },
        getTitleNumber: function () { // return just  
            return Number(Ext.first(examplePrefix + 'grid[title^=People aged] title').getTitle().split(' ')[2])
        },
        sliders: function() {
            return Ext.first(examplePrefix + "singlesliderfield[_label=Minimum Age]").getId()
        },
        myThumb : function (id) {
            return ST.component("thumb[id=" + id + "]");
        }      
    };

    var Grid = {
        grid: function () {
            return ST.grid('grid');
        },
        gridByTitle: function (title) {
            return ST.grid('grid[title='+title+']');
        },
        gridcolumn: function (selector) {
            return ST.component('gridcolumn' + selector);
        }
    };

    beforeAll(function () {
        KitchenSink.app.redirectTo('#binding-chained-stores');
        ST.wait(function(){              
            return Ext.first(examplePrefix + 'slider');              
        }).and(function(){
                IDs = Ext.ComponentQuery.query(examplePrefix + 'slider')[0].getThumbs()[0].id
        });
    }); 
    
    function dragAndCheck(moveX, moveY) {       	
		var numberOfIteration;
      
        Comp.myThumb(IDs)
            .and(function(thumb){
                Lib.DnD.dragBy(thumb, moveX, moveY);
            });    

        ST.element(examplePrefix + 'slider')
            .and(function () { 	                           
                numberOfIteration = Comp.getRowCount();	                     
                ST.wait(function(){
                    return Comp.getTitleNumber() == Comp.getSliderValue();   
                })
            })
            .and(function () {
                for(var a = 0; a <numberOfIteration; a++){
	            	expect(Comp.getRowAge(a)).toBeGreaterThan(Comp.getSliderValue()-1);		            			
		        }  
            })    
    }

     describe("Example loads correctly", function () {
        it("All people grid should load 15 items", function () {
            Grid.gridByTitle('All People').
                and(function (grid) {
                var count = grid.getStore().getCount();
                expect(count).toBe(15);
            });
        });
    });

    describe("Check slider up", function() {
    	var sliderSize;
        beforeAll(function () {                             
            ST.component(examplePrefix + 'slider')
                .and(function(slider) { 
                    sliderSize = slider.elementWidth/10;                       
                });

            Comp.myThumb(IDs)
                .and(function(thumb){
                    Lib.DnD.dragBy(thumb, -200, 0);
            });     
        });

        describe("operators up", function() {
         	for(var i = 0;i < numberOfMovesSlider;i++){
                it('is moved by slider to right '+ i, function () {                                         
                    dragAndCheck(sliderSize, 0);	                              				                        
                }); 
        	}
        })        
    });

    describe("Check slider down", function() {
    	var sliderSize;
       
        beforeAll(function () {             
            ST.component(examplePrefix + 'slider')
                .and(function(slider) { 
                    sliderSize = slider.elementWidth/10;            
                })
        });

        describe("operators down", function() {
         	for(var i = 0;i < numberOfMovesSlider;i++){
                it('is moved by slider to left '+ i, function () {                                            
                    dragAndCheck(-sliderSize, 0);				                        
                }); 
        	}   
        })     
    });
   
    describe('Columns sort', function () {
        function isSortable(column) {
            describe('Column ' + column.name, function () {

                function sortColumn(column, direction) {
                    it('should be sorted ' + direction, function () {
                        Grid.gridcolumn(column.selector)
                            .click()
                            .gotoGrid('grid', 'up')
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
                name: 'First Name in grid All People',
                property: 'firstName'
            },
            {
                selector: ':nth-child(2)',
                name: 'Last Name in grid All People',
                property: 'lastName'
            },
            {
                selector: ':nth-child(3)',
                name: 'Age in grid All People',
                property: 'age'
            },
            {
                selector: ':nth-child(4)',
                name: 'First Name in grid People over year',
                property: 'firstName'
            },
            {
                selector: ':nth-child(5)',
                name: 'Last Name in grid People over year',
                property: 'lastName'
            },
            {
                selector: ':last',
                name: 'Age in grid People over year',
                property: 'age'
            }
        ];

        for (var i = 0; i < columns.length; i++) {
            isSortable(columns[i]);
        }
    });
});
