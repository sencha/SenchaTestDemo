/**
 * @file FieldValidation.js
 * @name UI/Forms/Field Validation
 * @created 2017/02/13
 * Tested on Chrome 58, Firefox 54, Edge, iOS iPhone, Android tablet, IE11
 */
 
describe('FieldValidation', function(){
    var fieldLabels = ['ID','Name','Date of Birth','Email','Phone Number',
                        'Homepage','Salary','Last Login','Rating'];
    var validInputs = ['123-abcd', 'Pablo', '01/01/1980', 'vader@darkside.com', '1234567890', 
                        'http://web', '12', '06/01/1991 01:15 AM', '3'];
    var prefix = '#kitchensink-view-forms-fieldvalidation';
    var Form = {
        field: function(id) {
            return ST.textField('[_label='+fieldLabels[id]+']');
        },
        fieldInput: function(num) {
            return ST.element('textfield[_label='+fieldLabels[num]+'] => input');  
        },
        button: function(text) {
            return ST.component(prefix + ' button[_text='+text+']');
        },
        toast: function(){
            return ST.component('sheet[$className=Ext.Toast]');    
        },
        clearField: function(id, text){
            Form.fieldInput(id)
                .type(text);
            Form.field(id)
                .down('=> div.x-cleartrigger')
                .click();
            Form.fieldInput(id)
                .and(function(field) {
                    expect(field.dom.value).toBe('');        
                });
        },
        resetField: function(id) {
            ST.wait(500);
            Form.field(id)
                .and(function(field) {
                    field.reset();
                });
        }
    };
    
    beforeAll(function() {
        Lib.beforeAll("#field-validation", prefix);
        ST.component(prefix).visible();
    });
    
    afterAll(function(){
        Lib.afterAll(prefix);
    });
    
    it('Example should load correctly', function() {
        Lib.screenshot('fieldValidationUI', 10);    
    });
    
    describe('ID field', function() {
        afterEach(function(){
            Form.resetField(0);
        });
        it('invalid format', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[0]+']', false, 'wrong', 'Is in the wrong format');
        });
        it('required', function() {
            Form.button('Submit').click();
            Lib.Forms.validateError('field[_label='+fieldLabels[0]+']', false, '', 'This field is required');
        });
        it('tooltip is displayed', function() {
            Form.button('Submit').click();
            Lib.Forms.tooltipError('field[_label='+fieldLabels[0]+']', 'This field is required');
            Form.fieldInput(0).type('wrong');
            Lib.Forms.tooltipError('field[_label='+fieldLabels[0]+']', 'Is in the wrong format');
        });
        it('valid input', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[0]+']', true, validInputs[0]);
            Form.resetField(0);
            Lib.Forms.validateInput('field[_label='+fieldLabels[0]+']', validInputs[0]);
        });
        it('clear field', function() {
            Form.clearField(0, 'text');
        });
    });
    
    describe('Name field', function() {
        afterEach(function(){
            Form.resetField(1);   
        });
        it('required', function() {
            Form.button('Submit').click();
            Lib.Forms.validateError('field[_label='+fieldLabels[1]+']', false, '', 'This field is required');   
        });
        it('tooltip is displayed', function() {
            Form.button('Submit').click();
            Lib.Forms.tooltipError('field[_label='+fieldLabels[1]+']', 'This field is required');
        });
        it('valid input', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[1]+']', true, validInputs[1]);
            Form.resetField(1);
            Lib.Forms.validateInput('field[_label='+fieldLabels[1]+']', validInputs[1]);
        });
        it('clear field', function() {
            Form.clearField(1, 'text');
        });
    });
        
    describe('Email field', function() {
        afterEach(function(){
            Form.resetField(3);    
        });
        it('invalid format', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[3]+']', false, 'wrong', 'Is not a valid email address');
        });
        it('required', function() {
            Form.button('Submit').click();
            Lib.Forms.validateError('field[_label='+fieldLabels[3]+']', false, '', 'This field is required');    
        });
        it('tooltip is displayed', function() {
            Form.button('Submit').click();
            Lib.Forms.tooltipError('field[_label='+fieldLabels[3]+']', 'This field is required');
            Form.fieldInput(3).type('wrong');
            Lib.Forms.tooltipError('field[_label='+fieldLabels[3]+']', 'Is not a valid email address');
        });
        it('valid input', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[3]+']', true, validInputs[3]);
            Form.resetField(3);
            Lib.Forms.validateInput('field[_label='+fieldLabels[3]+']', validInputs[3]);
        });
        it('clear field', function() {
            Form.clearField(3, 'text');
        });
    });
        
    describe('URL field', function() {
        afterEach(function(){
            Form.resetField(5);   
        });
        it('invalid format', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[5]+']', false, 'wrong', 'Is not a valid URL');
        });
        it('tooltip is displayed', function() {
            Form.fieldInput(5).type('wrong');
            Lib.Forms.tooltipError('field[_label='+fieldLabels[5]+']', 'Is not a valid URL');
        });
        it('valid input', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[5]+']', true, validInputs[5]);
            Form.resetField(5);
            Lib.Forms.validateInput('field[_label='+fieldLabels[5]+']', validInputs[5]);
        });
        it('clear field', function() {
            Form.clearField(5, 'text');
        });
    });
    
    describe('Salary field', function() {
        afterEach(function(){
            Form.resetField(6);    
        });
        it('invalid format', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[6]+']', false, 'wrong', 'Invalid salary');
        });
        it('tooltip is displayed', function() {
            Form.fieldInput(6).type('wrong');
            Lib.Forms.tooltipError('field[_label='+fieldLabels[6]+']', 'Invalid salary');
        });
        it('valid input', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[6]+']', true, validInputs[6]);
            Form.resetField(6);
            Lib.Forms.validateInput('field[_label='+fieldLabels[6]+']', validInputs[6]);
        });
        it('clear field', function() {
            Form.clearField(6, 'text');
        });
    });
    
    describe('Login date and time field', function() {
        afterEach(function(){
            Form.resetField(7);   
        });
        it('invalid format', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[7]+']', false, 'wrong', 'Invalid date and/or time');
        });
        it('tooltip is displayed', function() {
            Form.fieldInput(7).type('wrong');
            Lib.Forms.tooltipError('field[_label='+fieldLabels[7]+']', 'Invalid date and/or time');
        });
        it('valid input', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[7]+']', true, validInputs[7]);
            Form.resetField(7);
            Lib.Forms.validateInput('field[_label='+fieldLabels[7]+']', validInputs[7]);
        });
        it('clear field', function() {
            Form.clearField(7, 'text');
        });
    });
    
    describe('Rating field', function() {
        afterEach(function(){
            Form.resetField(8);  
        });
        it('invalid format', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[8]+']', false, '6', 'Invalid rating, must be between 1 and 5');
        });
        it('tooltip is displayed', function() {
            Form.fieldInput(8).type('6');
            Lib.Forms.tooltipError('field[_label='+fieldLabels[8]+']', 'Invalid rating, must be between 1 and 5');
        });
        it('valid input', function() {
            Lib.Forms.validateError('field[_label='+fieldLabels[8]+']', true, validInputs[8]);
            Form.resetField(8);
            Lib.Forms.validateInput('field[_label='+fieldLabels[8]+']', validInputs[8]);
        });
        it('clear field', function() {
            Form.clearField(8, '1');
        });
    });
    
    describe('Reset button', function() {
        it('clear all fields - ORION-1927 Phone Numer interaction', function() {
            for(var i=0; i<fieldLabels.length; i++) {
                Form.fieldInput(i)
                    .type('6')
                    .and(function(field) {
                        expect(field.dom.value).not.toBe('');        
                    });
            }
            Form.button('Reset').click();
            for(var i=0; i<fieldLabels.length; i++) {
                Form.fieldInput(i)
                    .and(function(field) {
                        expect(field.dom.value).toBe('');        
                    });
            }
        });
            
    });
    
    describe('Submit button', function() {
        it('valid form - ORION-1927 Phone Numer interaction', function() {
            for(var i=0; i<fieldLabels.length; i++) {
                Form.fieldInput(i)
                    .type(validInputs[i]);
            }
            Form.button('Submit').click();
            Form.toast()
                .down('=> div.x-toast-text')
                .and(function(toast) {
                    expect(toast.dom.textContent).toBe("Form is valid!");        
                }).hidden();
            Form.button('Reset').click();
        });
        
        it('empty (invalid) form', function() {
            Form.button('Reset').click();
            Form.button('Submit').click();
            Form.toast()
                .down('=> div.x-toast-text')
                .and(function(toast) {
                    expect(toast.dom.textContent).toBe("Form is invalid, please correct the errors.");        
                }).hidden();
        });
            
    });
    
    it("should open source window when clicked", function() {
        Lib.sourceClick("FieldValidation");
    });
});