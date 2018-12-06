/**
* @file Binding selection.js
* @name Data binding/Binding selection
* @created 2016/09/09
*/
describe("Binding Selection", function() {
   
    
    var examplePrefix = "*[identifiablePrefix=kitchensink-view-binding-selection-]";

    var Dash = {		
		contentText: function() {
			return ST.component(examplePrefix + " component[_html^=This]");
		},
        textfield : function (label) {
            return ST.textField('textfield[label=' + label + ']');
        },
        myClick : function (target) {    //click on some component. used fo clearing o textfield
            ST.play([
                {type: "mousedown", target: target,  detail: 1},
                {type: "mouseup", target: target,  detail: 1}
            ]);
        }
	};
    var prefix = "#kitchensink-view-binding-selection";

    function typeAndValidate(firstName, lastName, counter){
        it(firstName +' '+lastName + ' Inserting', function () {
            ST.element(prefix + ' list simplelistitem[recordIndex='+counter+']')   //this part is for clicking in dataview
                .click()
                .hasCls('x-selected');
                                      
            Dash.textfield('First Name')                      
                .and(function(textfield){                         
                    textfield.setValue('');                    //This part is clear textfield programatically
                 })                 
                .down('>>input') 
                .type(firstName);                               //This is for typing new value  

            Dash.textfield('First Name')
                .and(function(textfield){                      
                    expect(textfield.getValue()).toBe(firstName);
                });     

            Dash.textfield('Last Name')
                .and(function(textfield){
                    textfield.setValue('');
                 }) 
                .down('>>input')
                .type(lastName);
               
            Dash.textfield('Last Name')
                .and(function(textfield){
                    expect(textfield.getValue()).toBe(lastName);
                });
        });
    }

    function clickOnItems(firstName, lastName, counter){
        it("Click on "+ firstName +" "+ lastName + " item and check value", function() {
            ST.element(prefix + ' list simplelistitem[recordIndex='+counter+']')  //this part is for clicking in dataview
            .click();

            Dash.textfield('First Name')
                .visible()
                .value(firstName)
                .and(function(textfield){
                    expect(textfield.getValue()).toBe(firstName);    //After select of item in dataview need to check it
                });
            Dash.textfield('Last Name')
                .visible()
                .and(function(textfield){
                    expect(textfield.getValue()).toBe(lastName);
                }); 
        });
    }

    function clearTextfield(counter){
        it("Delete "+ (counter+1) +" row", function() {
            ST.element(prefix + ' list simplelistitem[recordIndex='+counter+']')  //this part is for clicking in dataview
                .click();
            
            if(!Lib.isDesktop){
                Lib.ghostClick('textfield[label="First Name"] => div.x-cleartrigger');
                Lib.ghostClick('textfield[label="Last Name"] => div.x-cleartrigger');
            }else {

                ST.element('textfield[label="First Name"] => div.x-cleartrigger')    //This is for clearing of textfield
                    .click();

                ST.element('textfield[label="Last Name"] => div.x-cleartrigger')
                    .click();    
            }                      
        });
    }

    beforeAll(function() {
        Lib.beforeAll("#binding-selection");
    });
    afterAll(function(){
        Lib.afterAll(prefix);
    });

    describe("Example loads correctly", function () {
        it("screenshot should be same", function(){
            ST.component(prefix)
                .visible();
            Lib.screenshot("modern_BindingSelection");

        });
    });

    describe("Click and check Values", function() {

        var names = [['Gareth','Keenan'],    //Declarationof new field
                    ['Tim','Canterbury'],
                    ['Dawn','Tinsley'],
                    ['Neil','Godwin'],
                    ['David','Brent'] ];

        for(var i = 0; i < names.length; i++){
            clickOnItems(names[i][0], names[i][1], i);
        }       
    });
       
    describe("Insert new data", function() {
        var names = [['Martin','Prokes'],     //Declaration of new field
                    ['Jiri','Znoj'],
                    ['Ondrej','Soukup'],
                    ['Michal','Golis'],
                    ['Libor','Pustejovsky'] ];

        for(var i = 0; i < names.length; i++){
            typeAndValidate(names[i][0], names[i][1], i);     //calling function
        }                 
    });    

    describe("Clear textfields - EXTJS-25500", function() {
 
        for(var i = 0; i < 5; i++){
            clearTextfield(i);
        }
    }); 
});
