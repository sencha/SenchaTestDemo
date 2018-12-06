/**
* @file Ternary Operators.js
* @name Data binding/Ternary Operators
* @created 2016/10/10
  tested on deskstop chrome, firefox, IE11, Edge
         on tablets Android 6, iOS9, Win10/Edge 
*/

describe("Ternary Operators", function() {

    var numberOfIteration = 4;
    var examplePrefix = "#kitchensink-view-binding-algebraternary ";
    var Field = {	   	           
        myFieldComponent : function(label) {
            return ST.field(examplePrefix + 'textfield[_label=' + label + ']');
        },  
        spinnerButton : function (spin,type){            
            return ST.element(examplePrefix + 'spinnerfield[_label='+(spin?'x':'y') +'] => div.x-spin'+(type?'up':'down')+'trigger')
                .click();                     
        }      
   	};

    beforeAll(function () {
        KitchenSink.app.redirectTo("#binding-algebra-ternary");
        ST.wait(function(){
                return Ext.ComponentQuery.query(examplePrefix + 'spinnerfield')
            });
    });
	afterAll(function(){
		Lib.afterAll("#kitchensink-view-binding-algebraternary");
	});

    function compare(i,spin,type){
        describe("Calculate "+i, function() {
            var x,y,bigger;                 
	    
	        beforeAll(function () {	
                Field.spinnerButton(spin,type);

	            Field.myFieldComponent('x')	               
	                .and(function(textfield){                   
	                    x = Number(textfield.getValue());	                   
	                });   

	            Field.myFieldComponent('y')	                
	                .and(function(textfield){                   
	                    y = Number(textfield.getValue());	                   
	                });    
	        });
	        it("Compare values "+i,function(){                  
                if(x == y){		                            	
	                Field.myFieldComponent('Calculated')	                 
		                .and(function(textfield){  
		                    bigger = textfield.getValue().split(' ')[0];  //return x or y. Depends which is bigger.
		                    expect(x).toBe(y);
		                });					       
	            }else {
		            if(y > x){        	
		                Field.myFieldComponent('Calculated')		                 
			                .and(function(textfield){                   
			                    bigger = textfield.getValue().split(' ')[0];  //return x or y. Depends which is bigger.		                    
			                    expect(y).toBeGreaterThan(x);
			                    expect(bigger).toBe('y');
			                });
		            }else{
		            	if(x > y){	        	
			                Field.myFieldComponent('Calculated')			                 
				                .and(function(textfield){                   
				                    bigger = textfield.getValue().split(' ')[0];	//return x or y. Depends which is bigger.  			                   
				                    expect(x).toBeGreaterThan(y);
				                    expect(bigger).toBe('x');
				                });
				        }   					           
		            }  
	            }  
	        });      	      
	    });
	}     

    function incDec(spin,type){
    	describe("operation with spinnerfield "+ (spin?'x':'y')+ " "+ (type?'up':'down'), function() {
	        for(var i = 0;i < numberOfIteration; i++){                  
                compare(i,spin,type);           
	        }   
	    });   
    }

    describe("Example loads correctly", function () {
        it("screenshot should be same", function () {
            Lib.screenshot('modern_ternaryOperators');
        });
    });

    describe("Operations ", function() {   	
            
        describe("First spinnerfield "+numberOfIteration+" times up", function() {
            incDec(true,true);
        });  

        describe("First spinnerfield "+numberOfIteration+" times down", function() {
            incDec(true,false);
        });   

        describe("Second spinnerfield "+numberOfIteration+" times down", function() {
            incDec(false,false);
        });  

        describe("Second spinnerfield "+numberOfIteration+" times up", function() {
            incDec(false,true);
        }); 
    });   
});
