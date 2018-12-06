/**
* @file Binary Operators.js
* @name Data binding/Binary Operators
* @created 2016/09/20
*/

describe("Binary Operators", function() {

    var textInput;
    var numberOfIteration = 5;
	var examplePrefix = "#kitchensink-view-binding-algebrabinary ";
    var Field = {	    	
        myField : function(id) {
            return ST.component('textfield[id=' + id + ']');
        },
        spinnerButton : function (spin,type){            
            return ST.element(examplePrefix + 'spinnerfield[_label='+(spin?'x':'y') +'] => div.x-spin'+(type?'up':'down')+'trigger')
                    .click();                     
        }
   	};

    beforeAll(function() {
        Lib.beforeAll("#binding-algebra-binary", examplePrefix);
        ST.wait(function(){
            return Ext.ComponentQuery.query(examplePrefix + 'textfield').length >= 15;
        }).and(function(){
            textInput = Ext.ComponentQuery.query(examplePrefix + 'textfield');
        });
    });
    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });

    function calc(i, spin, type){
        describe("Calculate "+i, function() {		               
            var x,y;
		beforeAll(function(){
			Field.spinnerButton(spin,type);

			Field.myField(textInput[0].id)
				.and(function(textinput){
					x = Number(textinput.getValue());
				});
			Field.myField(textInput[8].id)
				.and(function(textinput){
					y = Number(textinput.getValue());
				});
		});

	        it("x + y "+i, function() {
	        	var val = x+y;
	            Field.myField(textInput[1].id)
	                .and(function(textinput){                   
	                    expect(Number(textinput.getValue())).toBe(val);
	                });
	        });

	        it("x * y "+i, function() {
	        	var val = x * y;
	            Field.myField(textInput[2].id)
	                .and(function(textinput){                   
	                    expect(Number(textinput.getValue())).toBe(val);
	                });
	        });

	        it("x > y "+i, function() {
	        	var val = (x > y);
	            Field.myField(textInput[3].id)
	                .and(function(textinput){                         
	                    expect(textinput.getValue()).toBe(val);
	                });
	        });

	        it("x >= y "+i, function() {
	        	var val=(x >= y);
	            Field.myField(textInput[4].id)
	                .and(function(textinput){                         
	                    expect(textinput.getValue()).toBe(val);
	                });
	        });

	        it("x == y "+i, function() {
	        	var val = (x==y);
	            Field.myField(textInput[5].id)
	                .and(function(textinput){                         
	                    expect(textinput.getValue()).toBe(val);
	                });
	        });

	        it("x === y "+i, function() {
	        	var val = (x === y);
	            Field.myField(textInput[6].id)
	                .and(function(textinput){                         
	                    expect(textinput.getValue()).toBe(val);
	                });
	        });

	        it("x > y && y >=10 "+i, function() {
	        	var val = (x > y && y >= 10);
	            Field.myField(textInput[7].id)
	                .and(function(textinput){                         
	                    expect(textinput.getValue()).toBe(val);
	                });
	        });
	        it("x / y "+i, function() {
	        	var val = x/y;
	            Field.myField(textInput[9].id)
	                .and(function(textinput){                         
	                    expect(Number(textinput.getValue())).toBe(val);
	                });
	        });

	        it("x < y "+i, function() {
	        	var val = (x < y);
	            Field.myField(textInput[10].id)
	                .and(function(textinput){                         
	                    expect(textinput.getValue()).toBe(val);
	                });
	        });

	        it("x <= y "+i, function() {
	        	var val = (x <= y);
	            Field.myField(textInput[11].id)
	                .and(function(textinput){                         
	                    expect(textinput.getValue()).toBe(val);
	                });
	        });

	        it("x != y "+i, function() {
	        	var val = (x != y);
	            Field.myField(textInput[12].id)
	                .and(function(textinput){                         
	                    expect(textinput.getValue()).toBe(val);
	                });
	        });

	        it("x !== y "+i, function() {
	        	var val = (x !== y);
	            Field.myField(textInput[13].id)
	                .and(function(textinput){                         
	                    expect(textinput.getValue()).toBe(val);
	                });
	        });

	        it("x > y || y >= 10 "+i, function() {
	        	var val = ((x > y) || (y >= 10));
	            Field.myField(textInput[14].id)
	                .and(function(textinput){                         
	                    expect(textinput.getValue()).toBe(val);
	                });
	        });
	    });       
    }

    function incDec(spin,type){
    	describe("operation with spinnerfield "+ (spin?'x':'y')+ " "+ (type?'up':'down'), function() {

	        for(var i = 0;i < numberOfIteration; i++){
                calc(i, spin, type);
	        }   
	    })   
    }

    describe("Example loads correctly", function () {
        it("screenshot should be same", function () {
            Lib.screenshot('modern_binaryOperators');
        });
    });

    describe("Operations", function() {
            
        describe("First spinnerfield "+numberOfIteration+" times up - EXTJS-25500", function() {
            incDec(true,true);
        });

        describe("First spinnerfield "+numberOfIteration+" times down - EXTJS-25500", function() {
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
