/**
 * @file FormValidation.js
 * @name UI/Forms/Form Validation
 * @created 2017/02/08
 * Tested on Chrome, Firefox, Edge tablet, iOS phone, Android tablet
 */
 
describe('FormValidation', function(){
    var fields = ['azonly','nonblank','validated'];
    var prefix = '#kitchensink-view-forms-formvalidation';
    var Form = {
        field: function(num) {
            return ST.component('textfield[name='+fields[num]+']');  
        },
        fieldInput: function(num) {
            return ST.element('textfield[name='+fields[num]+'] => input');  
        },
        functions: function(text) {
            ST.component('button[_text=Functions]')
                .click();
            
            ST.component('menu')
                .down('menuitem[_text='+text+']')
                .click();
        },
        messages: function() {
            return ST.component('panel[_title=Messages]');
        },
        msgBox: function() {
            return ST.component('messagebox[_title=isValid()]');    
        },
        value: function(field) {
            return Ext.ComponentQuery.query('textfield[_name='+field+']')[0].getValue();
        },
        getErrors: function(field) {
            Form.messages()
                .and(function(msg) {
                    var array = msg.el.dom.textContent;
                    array = array.split(":").slice(2);
                    if(field === 'azonly'){
                        expect(array[0]).toContain('a to z only');
                        expect(array[1]).toContain('null');
                        expect(array[2]).toContain('null');
                    } else if(field === 'nonblank'){
                        expect(array[0]).toContain('null');
                        expect(array[1]).toContain('is required');
                        expect(array[1]).toContain('non blank');
                        expect(array[2]).toContain('null');
                    } else if(field === 'validated') {
                        expect(array[0]).toContain('null');
                        expect(array[1]).toContain('null');
                        expect(array[2]).toContain('Is in the wrong format');
                    } else {
                        expect(array[0]).toContain('null');
                        expect(array[1]).toContain('null');
                        expect(array[2]).toContain('null');
                    }
                    
                });
        },
        isValid: function(bool) {
            Form.functions('isValid()');
            Form.msgBox()
                .visible()
                .and(function(msg) {
                    expect(msg._message._html).toBe(bool);
                });        
        }
    };
    
    beforeAll(function() {
        Lib.beforeAll("#form-validation", prefix);
        ST.component('formpanel').visible();
    });
    
    afterAll(function(){
        Lib.afterAll(prefix);
    });
    
    it('Example should load correctly', function() {
        Lib.screenshot('formValidationUI', 10);    
    });
    
    describe('setErrors() functionality', function() {
        
        afterAll(function() {
            Form.functions('clearErrors()');
        });
        
        describe('az only field', function() {
            afterEach(function() {
                Form.functions('clearErrors()');
                ST.component('textfield[name=azonly] => div.x-cleartrigger').click();    
            });
            it('Invalid az only field', function() {
                Form.fieldInput(0)
                    .click()
                    .type('7');
                Form.functions('setErrors()');
                Form.field(0)
                    .and(function(field) {
                        expect(field.el.dom.className).toContain('invalid');
                        expect(field._errorMessage).toContain('a to z only'); 
                    });
            });
            it('Valid az only field', function() {
                Form.fieldInput(0)
                    .click()
                    .type('seven');
                Form.functions('setErrors()');
                Form.field(0)
                    .and(function(field) {
                        expect(field.el.dom.className).not.toContain('invalid');
                        expect(field._errorMessage).toBe(''); 
                    });
            });
        });
        describe('nonblank field', function() {
            afterEach(function() {
                Form.functions('clearErrors()');
                if(Form.value('nonblank') !== null) {
                    if(Form.value('nonblank').length > 0 ){
                        ST.component('textfield[name=nonblank] => div.x-cleartrigger').click();                    
                    }
                }
            });
            it('Invalid nonblank field', function() {
                Form.functions('setErrors()');
                Form.field(1)
                    .and(function(field) {
                        expect(field.el.dom.className).toContain('invalid');
                        expect(field._errorMessage).toContain('non blank');
                        expect(field._errorMessage).toContain('is required');
                    });
            });
            it('Valid nonblank field', function() {
                Form.fieldInput(1)
                    .click()
                    .type('blanc');
                Form.functions('setErrors()');
                Form.field(1)
                    .and(function(field) {
                        expect(field.el.dom.className).not.toContain('invalid');
                        expect(field._errorMessage).toBe(''); 
                    });
            });
        });
        describe('validator field', function() {
            afterEach(function() {
                Form.functions('clearErrors()');
                if(Form.value('validated') !== null) {
                    if(Form.value('validated').length > 0 ){
                        ST.component('textfield[name=validated] => div.x-cleartrigger').click();                    
                    }
                }
            });
            it('Invalid validator field', function() {
                Form.fieldInput(2)
                    .click()
                    .type('lower');                
                Form.functions('setErrors()');
                Form.field(2)
                    .and(function(field) {
                        expect(field.el.dom.className).toContain('invalid');
                        expect(field._errorMessage).toContain('Is in the wrong format');
                    });
            });
            it('Valid validator field', function() {
                Form.functions('setErrors()');
                Form.field(2)
                    .and(function(field) {
                        expect(field.el.dom.className).not.toContain('invalid');
                        if(Form.value('validated') !== null) {
                            expect(field._errorMessage).toBe('');
                        } else { expect(field._errorMessage).toBe(null); }
                    });
            });
        });
        it('Messages panel', function() {
            Form.functions('setErrors()');
            Form.messages()
                .and(function(msg) {
                    expect(msg._html).toBe('<h2>setErrors() called</h2>');
                });
        });
    });
    
    describe('getErrors() functionality', function() {
        
        afterEach(function() {
            Form.functions('clearErrors()');
            for(var i =0; i<3; i++){
                if(Form.value(fields[i]) !== null) {
                    if(Form.value(fields[i]).length > 0 ){
                        ST.component('textfield[name='+fields[i]+'] => div.x-cleartrigger').click();                    
                    }
                }
            }
            
        });
            
        it('Messages with no error', function() {
            Form.functions('getErrors()');
            Form.messages()
                .and(function(msg) {
                    expect(msg._html).toContain('getErrors() returned'); 
                    Form.getErrors();
                });
        });
        
        it('a-z only error', function() {
            Form.fieldInput(0)
                .click()
                .type('7');
            Form.fieldInput(1)
                .click()
                .type('blanc');
            Form.functions('setErrors()');
            Form.functions('getErrors()');
            Form.messages()
                .and(function(msg) {
                    Form.getErrors('azonly');
                });
        });
        
        it('nonblank error', function() {
            Form.functions('setErrors()');
            Form.functions('getErrors()');
            Form.messages()
                .and(function(msg) {
                    Form.getErrors('nonblank');
                });
        });
        
        it('validator error', function() {
            Form.fieldInput(2)
                .click()
                .type('low');
            Form.functions('getErrors()');
            Form.messages()
                .and(function(msg) {
                    Form.getErrors('validated');
                });
        });
    });
    
    describe('clearErrors() functionality', function() {
        
        describe('Clear', function() {
            
            it('setErrors()', function() {
                Form.functions('setErrors()');
                Form.field(1)
                    .and(function(field) {
                        expect(field._errorMessage).toContain('is required');
                    });
                Form.functions('clearErrors()');
                Form.field(1)
                    .and(function(field) {
                        expect(field._errorMessage).toBe('');
                    });
            });
            
            it('validate()', function() {
                Form.fieldInput(2)
                    .click()
                    .type('low');
                Form.field(2)
                    .and(function(field) {
                        expect(field._errorMessage).toContain('Is in the wrong format');
                    });
                Form.functions('clearErrors()');
                Form.field(2)
                    .and(function(field) {
                        expect(field._errorMessage).toBe('');
                    });
                ST.component('textfield[name='+fields[2]+'] => div.x-cleartrigger').click();
            });
        });
        
        it('Messages panel', function() {
            Form.functions('clearErrors()');
            Form.messages()
                .and(function(msg) {
                    expect(msg._html).toContain('clearErrors() called');
                });
        });    
        
    });
    
    describe('validate() functionality', function() {
        
        it('setErrors()', function() {
            Form.functions('setErrors()');
            Form.field(1)
                .and(function(field) {
                    expect(field._errorMessage).toContain('is required');
                    expect(field._errorMessage).toContain('non blank');
                });
            Form.functions('validate()');
            Form.field(1)
                .and(function(field) {
                    expect(field._errorMessage).toBe('This field is required');
            });
        });
        
        it('Messages panel', function() {
            Form.functions('validate()');
            Form.messages()
                .and(function(msg) {
                    expect(msg._html).toContain('validate() called');
                });
        });     
    });
    
    describe('isValid() functionality', function() {
        
        afterEach(function() {
            ST.component('button[_text=OK]').click();   
        });
        
        it('No errors', function() {
            Form.functions('clearErrors()');
            Form.isValid('true');    
        });
        
        it('setErrors', function() {
            Form.functions('setErrors()');
            Form.isValid('false');
        });
        
        it('clearErrors', function() {
            Form.functions('setErrors()');
            Form.functions('clearErrors()');
            Form.isValid('true');
        });
        
        it('validate', function() {
            Form.functions('validate()');
            Form.isValid('false');
        });
    });
    
    it("should open source window when clicked", function() {
        Lib.sourceClick("FormValidation");
    });
});
