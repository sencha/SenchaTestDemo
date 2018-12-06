/**
* @file unaryOperators.js
* @name Data binding/Unary Operators
* @created 2016/10/10
*/

describe("Unary Operators.js", function() {
    
    var numberOfIteration = 4;
    var examplePrefix = "#kitchensink-view-binding-algebraunary ";
    var Field = {	   	           
        myFieldComponent : function(label) {
            return ST.field(examplePrefix + ' textfield[_label=' + label + ']');
        },  
        spinnerButton : function (type){            
            return ST.element(examplePrefix +' spinnerfield[_label=x] => div.x-spin'+(type?'up':'down')+'trigger')
                .click();                     
        }      
   	};

   	beforeAll(function () {
        KitchenSink.app.redirectTo("#binding-algebra-unary");
        ST.wait(function(){
                return Ext.ComponentQuery.query(examplePrefix + 'textfield');
            });
    });

    function compare(i,type){
        describe("Calculate "+i, function() {
            var x,negX,plusX,minusX,globals;    
           
        	beforeAll(function () {
                Field.spinnerButton(type); 

                Field.myFieldComponent('x')	               
	                .and(function(textfield){
	                    x = Number(textfield.getValue());
	                });	            
            });             
	        
	        it("negation x "+i, function() {
	            Field.myFieldComponent('!x')	                
	                .and(function(textfield){
	                    negX = textfield.getValue()===false?false:true;
	                    expect(negX).toBe(!x);
	                });
	        });

	        it("plus x "+i, function() {	        	
	            Field.myFieldComponent('+x')	                
	                .and(function(textfield){                   
	                    plusX = Number(textfield.getValue());		                      
	                    expect(plusX).toBe(+x);                
	                });
	        });

	        it("minus x "+i, function() {	        	
	            Field.myFieldComponent('-x')	                
	                .and(function(textfield){                   
	                    minusX = Number(textfield.getValue());	      	                   
	                    expect(minusX).toBe(-x);            
	                });
	        });

	        it("globals version "+i, function() {	        	
	            Field.myFieldComponent('Globals')	                
	                .and(function(textfield){                   
	                    globals = textfield.getValue().split(' ')[3];
	                    expect(globals).toBe(Ext.getVersion().version); 	                   
	                });
	        });               
	    });
	}     

    function incDec(type){
    	describe("operation with spinnerfield x "+ (type?'up':'down'), function() {
	        for(var i = 0;i < numberOfIteration; i++){
	           describe('click itself ' +i, function() {	                  
	                compare(i,type); 
                   });          
	        }   
	    });   
    }

    describe("Example loads correctly", function () {
        it("screenshot should be same", function () {
        	//screenshot muted due to changing example in each version of framework
        	pending('pending due to example is changed in each version - there is version number in this example');
            Lib.screenshot('modern_unaryOperators');
        });
    });

    describe("First spinnerfield "+numberOfIteration+" times up", function() {
        incDec(false);
    });  

    describe("First spinnerfield "+numberOfIteration+" times down", function() {
        incDec(true);
    });
});
