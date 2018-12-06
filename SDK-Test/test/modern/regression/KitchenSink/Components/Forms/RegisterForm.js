/**
 * @file RegisterForm.js
 * @name KS/Components/Forms/Login Form
 * @created 2017/05/31
 * Tested on Chrome, Firefox, Edge, iOS iPad, iPhone, Android tablet, IE11
 */
 
describe('RegisterForm', function(){

    var prefix = '#kitchensink-view-forms-register';
    var fieldLabels = ['User ID', 'First Name', 'Last Name', 'Company', 'Password', 'Verify', 'Email',
                        'State', 'Date of Birth', 'Profile pic'];
    var required = [0,4,5,6];
    var Form = {
        fieldType: function(id, type) {
            return ST.component(type+'field[_label='+fieldLabels[id]+']');  
        },
        field: function(id) {
            return ST.component('field[_label='+fieldLabels[id]+']'); 
        },
        statePicker: function() {
            return ST.comboBox('[name=state]');
        },
        button: function(text) {
            return ST.component('button[_text='+text+']');
        },
        clear: function(id, set) {
            set = false || set;
            if(set) {
                Form.field(id)
                    .and(function() {
                        this.future.cmp.setValue('');
                    });
            } else {
                Form.field(id)
                    .down('=> div.x-cleartrigger')
                    .click();    
            }
        },
        register: function(title) {
            Form.button('Register').click();
            ST.component('messagebox[_title='+title+']')
                .visible()
                .down('button')
                .click()
                .hidden();    
        }   
    };
    
    beforeAll(function() {
        Lib.beforeAll("#form-register", prefix);
        ST.component(prefix).visible();
    });
    
    afterAll(function(){
        Lib.afterAll(prefix);
        ST.component('tooltip')
            .and(function() {
                this.future.cmp.hide();
            });
    });
    
    it('Example should load correctly', function() {
        Lib.screenshot('registerFormUI', 10);    
    });
    
    describe('Fields editing', function() {
        var incT = 0;
            incP = 4;
        
        for(var i=0; i<4; i++) {
            it('Textfield ' +fieldLabels[i], function() {
                Form.fieldType(incT, 'text')
                    .focus().focused()
                    .type('cryptic')
                    .and(function() {
                        expect(this.future.cmp.getValue()).toBe('cryptic');
                        expect(this.future.cmp._inputType).toBe('text');
                    });
                Form.clear(incT);
                incT++;
            });  
        }
        
        for(var i=4; i<6; i++) {
            it('Passwordfield ' +fieldLabels[i], function() {
                Form.fieldType(incP, 'password')
                    .focus().focused()
                    .type('cryptic')
                    .and(function() {
                        expect(this.future.cmp.getValue()).toBe('cryptic');
                        expect(this.future.cmp.isPassword).toBe(true);
                        expect(this.future.cmp._inputType).toBe('password');
                    });
                Form.clear(incP);
                incP++;
            });
        }   
        
        it('Emailfield', function() {
            Form.fieldType(6, 'email')
                .focus().focused()
                .type('cryptic')
                .and(function() {
                    expect(this.future.cmp.getValue()).toBe('cryptic');
                    expect(this.future.cmp._inputType).toBe('email');
                });
            Form.clear(6);
        });
        
        it('Datefield', function() {
            Form.fieldType(8, 'datepicker')
                .focus().focused()
                .type('10/10')
                .down('=> input')
                .and(function() {
                    expect(this.future.el.dom.value).toBe('10/10');    
                });
            Form.clear(8, true);
        });
    });
    describe('Required fields', function() {
        beforeAll(function() {
            Form.button('Register').click();
            ST.component('messagebox[_title=Registration Failure]')
                .visible()
                .down('button')
                .click()
                .hidden();    
        });

        var incM = 0;
            incT = 0;
        
        for(var i=0; i<required.length; i++){
            it('Invalid mark of ' +fieldLabels[required[i]], function() {
                Lib.Forms.validateError('textfield[_label='+fieldLabels[required[incM]]+']', false, '', 'This field is required'); 
                incM++; 
            });
        }        
        
    });
    describe('Email field validation', function() {

        afterEach(function() { 
            Form.clear(6);
        });

        it('valid email', function() {
            Lib.Forms.validateError('textfield[_label='+fieldLabels[6]+']', true, 'test@email.ufo'); 
            Form.field(6, 'email')
                .down('=> div.x-cleartrigger')
                .click(); 
            Lib.Forms.validateInput('textfield[_label='+fieldLabels[6]+']', 'test@email.ufo');      
        });

        it('invalid email', function() {
            Lib.Forms.validateError('textfield[_label='+fieldLabels[6]+']', false, 'wrong', 'Is not a valid email address');    
        });

        it('invalid tooltip', function() {
            Form.field(6, 'email')
                .type('wrong');
            Lib.Forms.tooltipError('textfield[_label='+fieldLabels[6]+']', 'Is not a valid email address');
        });
    });
    describe('State comboBox selection', function() {
        it('auto suggestion', function() {
            Form.statePicker()
                .type('Ha')
            ST.component('boundlist')
                .visible()
                .and(function(l) {
                    expect(l._itemCount).toBe(1);
                }).down('simplelistitem')
                    .click()
                    .hidden();
            Form.statePicker().focus().value('HI');
            Form.field(7).and(function() {
                expect(this.future.cmp._inputValue).toBe('Hawaii');
            });
            Form.clear(7, true);
        });
    });
    describe('Date selection', function() {
        it('pick a date', function() {
            Lib.DatePanel.pickDate('field[_label="Date of Birth"]', 1, 6, 1997);
            Lib.Forms.validateField('field[_label="Date of Birth"]', 1, 6, 1997);
            Form.field(8)
                .and(function() {
                    expect(this.future.cmp._inputValue).toContain('06/01/');    
                });
            Form.clear(8, true);
        }); 
    });

    describe('Confirm success registration', function() {
        it('Register complete', function() {
            Form.field(0)
                .type('user');
            Form.field(4)
                .type('pass');
            Form.field(5)
                .type('pass');
            Form.field(6)
                .type('email@mars.ufo'); 

            Form.button('Register')
                .click();
            ST.component('messagebox[_title=Registration Complete]')
                .visible()
                .down('button')
                .click()
                .hidden();
        });

    });
    
    it("should open source window when clicked", function() {
        Lib.sourceClick("form-register");
    });
});