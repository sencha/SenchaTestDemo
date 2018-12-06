/**
 * @file LoginForm.js
 * @name UI/Forms/Login Form
 * @created 2017/02/21
 * Tested on Chrome, Firefox, Edge, iOS iPad, iPhone, Android tablet, IE11
 *
 * updated by Jiri Znoj
 * 28. 7. 2017
 * tested on:
 *      desktop:
 *          Chrome 59
 *          Edge 15
 *          FF 54
 *          IE 11
 *      tablet:
 *          Edge 14
 *          Safari 10
 *          Android 7.1
 *      phone:
 *          Android 5, 6, 7
 *          Safari 9
 */
 
describe('LoginForm', function(){

    var prefix = '#kitchensink-view-forms-login';
    var fieldLabels = ['User ID', 'Password'];
    var Form = {
        field: function(num) {
            return ST.component('textfield[_label='+fieldLabels[num]+']');  
        },
        fieldInput: function(num) {
            return ST.element('textfield[_label='+fieldLabels[num]+'] => input');  
        },
        button: function(text) {
            return ST.component('button[_text='+text+']');
        },
        clearAll: function() {
            for (var i=0; i<2; i++){
                Form.field(i)
                    .down('=> div.x-cleartrigger')
                    .click();
                Form.field(i)    
                    .and(function(field) {
                        expect(field.getValue()).toBe('');    
                    });
            }
        },
        login: function(title) {
            Form.button('Login').click();
            ST.component('messagebox[_title='+title+']')
                .visible()
                .down('button')
                .click()
                .hidden();    
        },
        isRequired: function(id) {
            Form.field(id)
                .and(function(field) {
                    expect(field.el.dom.className).toContain('invalid');
                    expect(field._errorMessage).toContain('This field is required'); 
                });       
        },
        validFormat: function(id, text) {
            Form.fieldInput(id)
                .type(text);
            Form.field(id)
                .and(function(field) {
                    expect(field.el.dom.className).not.toContain('invalid');
                    expect(field._errorMessage).toBe(null);        
                });      
        },
        tooltipRequired: function(id) {
            // focus field to display tooltip on touch devices 
            Form.field(id).click();
            if (Ext.theme.name == 'Material') {
                ST.play([
                    { type: "mouseover", target: "textfield[_label="+fieldLabels[id]+"]", y:40}
                ]);
            } else {
                ST.play([
                    { type: "mouseover", target: "textfield[_label="+fieldLabels[id]+"]"}
                ]);
            }
            ST.component('tooltip')
                .visible()
                .and(function(tip) {
                    expect(tip._html).toContain('This field is required'); 
                }).hidden();
        }
    };
    
    beforeAll(function() {
        Lib.beforeAll("#form-login", prefix);
        ST.component(prefix).visible();
    });
    
    afterAll(function(){
        //hide tooltip
        ST.component('tooltip')
            .and(function() {
                this.future.cmp.hide();
            });
        Lib.afterAll(prefix);
    });
    
    it('Example should load correctly', function() {
        Lib.screenshot('loginFormUI', 10);    
    });
    
    describe('Valid login', function() {
        it('Valid inputs', function() {
            for(var i=0; i<2; i++){
                Form.validFormat(i, 'snapcaster');               
            }
            Form.login('Login Success');
        });
        it('Checkbox button', function() {
            ST.component('checkbox')
                .visible()
                .and(function(check) {
                    expect(check._checked).toBe(false);
                });
            ST.component('checkbox => input')
                .click()
                .and(function(check) {
                    expect(check._checked).toBe(true);    
                });
        });
        it('Clear fields', function() {
            for(var i=0; i<2; i++){
                Form.validFormat(i, 'text');                
            } 
            Form.clearAll();
            
        });
    });
    
    describe('Invalid login', function() {
        afterEach(function(){
            ST.component('viewport').click(1,1);
            Lib.waitOnAnimations();
        });

        describe('Fields are required', function() {
            it('User ID field', function() {
                Form.login('Login Failure');
                Form.isRequired(0);              
            });
            
            it('Password field', function() {
                Form.login('Login Failure');
                Form.isRequired(1);
            });
        });
        
        describe('Tooltips are displayed', function() {
            it('User ID field', function() {
                Form.login('Login Failure');
                Form.tooltipRequired(0);                
            });
            
            it('Password field', function() {
                Form.login('Login Failure');
                Form.tooltipRequired(1); 
            });
        });
    });
    
    it("should open source window when clicked", function() {
        Lib.sourceClick("LoginForm");
    });
});