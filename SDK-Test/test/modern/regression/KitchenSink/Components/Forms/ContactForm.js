/**
 * @file ContactForm.js
 * @name UI/Forms/Contact Form
 * @created 2017/05/16
 * Tested on Chrome, Firefox, Edge, iOS tablet, Android phone, IE11
 */
 
describe('ContactForm', function(){
    var prefix = '#kitchensink-view-forms-contactform';
    var fieldLabels = ['First', 'Last', 'Email', 'Message'];
    var Form = {
        field: function(num) {
            if (num > 1){
                return ST.component('field[label='+fieldLabels[num]+']');     
            } else {
                return ST.component('field[placeholder='+fieldLabels[num]+']');     
            }     
        },
        dialog: function() {
            return ST.component('dialog[_title=Dialog]');    
        },
        button: function(text, component) {
            component = component || prefix;
            return ST.component(component+' button[_text='+text+']:visible');
        },
        required: function() {
            Form.button('OK', 'dialog[_title=Dialog]').click();
            for(var i=0; i<4; i++){
                Form.field(i)
                    .and(function(field) {
                        expect(field.el.dom.className).toContain('invalid');
                        expect(field._errorMessage).toContain('This field is required'); 
                    });    
            }
        },
        validFormat: function() {
            for(var i=0; i<4; i++){
                if(i == 2){
                    Form.field(i)
                        .type('valid@mail.ea');
                } else if (i == 3){
                    Form.field(i).down('=> textarea')
                        .type('text');
                } else {
                    Form.field(i)
                        .type('text');
                }
                Form.field(i)
                    .and(function(field) {
                        expect(field.el.dom.className).not.toContain('invalid');
                        if (field._errorMessage !== null) {
                            expect(field._errorMessage).toBe('');    
                        } 
                    });
            }
        },
        tooltipRequired: function() {
            Form.button('OK', 'dialog[_title=Dialog]').click();
            for(var i=0; i<4; i++){
                // focus field to display tooltip on touch devices 
                Form.field(i).click();
                if (i > 1) {
                    if (Ext.theme.name == 'Material') {
                        ST.play([
                            { type: "mouseover", target: "field[_label="+fieldLabels[i]+"]", y:40}
                        ]);
                    } else {
                        ST.play([
                            { type: "mouseover", target: "field[_label="+fieldLabels[i]+"]"}
                        ]);
                    }
                } else {
                    if (Ext.theme.name == 'Material') {
                        ST.play([
                            { type: "mouseover", target: "field[_placeholder="+fieldLabels[i]+"]", y:40}
                        ]);
                    } else {
                        ST.play([
                            { type: "mouseover", target: "field[_placeholder="+fieldLabels[i]+"]"}                      ]);
                    }
                }
                ST.component('tooltip')
                    .visible()
                    .and(function(tip) {
                        expect(tip._html).toContain('This field is required'); 
                    }).hidden();
            }
        },
        clearAll: function() {
            for (var i=0; i<3; i++){
                Form.field(i).down('=> div.x-cleartrigger').click();
            }
            ST.textField('[_label=Message]').setValue('');
        }
    };
    
    beforeAll(function() {
        Lib.beforeAll("#form-contact", prefix);
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
        Lib.screenshot('contactFormUI', 10);    
    });
    
    describe('Contact Us dialog', function() {
        it('open and close dialog', function() {
            Form.button('Contact Us').click(); 
            Form.dialog().visible()
                .down('=> div.x-dialogtool')
                .click();
            Form.dialog().hidden();
        });
        it('drag dialog', function() {
            var w,h;
            Form.button('Contact Us').click();
            Form.dialog()
                .visible()
                .and(function(d){
                    x = d._x;
                    y = d._y;
                })
                .down('panelheader')
                .and(function(win){
                    Lib.DnD.dragBy(win, 20, 10);
                });
                
            Form.dialog()
                .and(function(d){
                    expect(x).not.toBe(d._x);
                    expect(y).not.toBe(d._y);
                })
                .down('=> div.x-dialogtool')
                .click();
        });
    });
    
    describe('Form validation', function() {
        beforeEach(function() {
            Form.button('Contact Us').click();
            Form.dialog().visible();
        });
        afterEach(function() {
            Form.button('Cancel', 'dialog[_title=Dialog]').click();
            Form.dialog().hidden();
        });
        
        it('required and wrong format', function() {
            Form.required();
            Form.field(2)
                .click()
                .type('tarmogoyf');
                
            Form.field(2)   
                .and(function(field) {
                    expect(field._errorMessage).toContain('Is not a valid email address'); 
                });
                
            Form.field(2).down('=> div.x-cleartrigger').click();
        });
        
        it('tooltips are displayed', function() {
            Form.tooltipRequired();
        });
        
        it('valid inputs', function() {
            Form.validFormat();
            Form.clearAll();
        });
    });
    
    describe('Form buttons functionality', function() {
        beforeEach(function() {
            Form.button('Contact Us').click();
            Form.dialog().visible();
        });
        
        it('Cancel button', function() {
            Form.button('Cancel', 'dialog').click();
            Form.dialog().hidden();
        });
    });
    
    it("should open source window when clicked", function() {
        Lib.sourceClick("ContactForm");
    });
});
