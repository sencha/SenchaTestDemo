/**
 */
    
describe('Register Page', function () {

    var listFields = ['Full Name', 'Username', 'Email', 'Password'],
        listValues = ["Sencha Name", "sencha", "login@sencha.com", "pasword123"];

    // common function for testing text field
    var Register = {
        fieldByplaceholder : function(name){
            return ST.textField('register textfield[placeholder="'+name+'"]');
        },
        checkboxField : function () {
            return ST.checkBox('register checkboxfield');
        },
        typeIntoField : function (name, value) {
            describe(name + ' textfield ', function () {
                it(name + ' textfield is editable', function () {
                    Register.fieldByplaceholder(name)
                        .type(value);
                    Register.fieldByplaceholder(name)
                        .and(function (textfield) {
                            // check if textfield contains expected value/string
                            var val = textfield.getValue();
                            expect(val).toBe(value);
                        });
                });
                it('should clear '+ name + ' textfield value when clicked clear icon', function () {
                    var text = 'coookie!';
                    Register.fieldByplaceholder(name)
                        .type(text);
                    Register.fieldByplaceholder(name)
                        .wait(function(textField){
                            return textField.getValue() === text;
                        });
                    ST.element('register textfield[placeholder="'+name+'"] => div.x-cleartrigger').click();
                    Register.fieldByplaceholder(name)
                        .wait(function(textField){
                            return textField.getValue() === '';
                        })
                        .and(function(textField){
                            var val = textField.getValue();
                            expect(val).toBe('');
                        });


                });
            });
        },
        resetFieldValue : function (name) {
            Register.fieldByplaceholder(name)
                .and(function(field){
                    field.setValue('');
                });
        },
        buttonByText : function (text) {
            return ST.button('register button[text="'+text+'"]');
        }
    };
    // We need to start every test from Login page, even the first round.
    beforeEach(function () {
        Lib.beforeAll("#register", "register", undefined, "admin");
    });
    afterAll(function(){
        //Lib.afterAll("register");//It is not need destroyed
        ST.options.eventDelay = 500;
    });
    
    it('Register page is loaded', function () {
        ST.component('register')
            .visible()
            .and(function (page) {
                expect(page.rendered).toBeTruthy();
            });
    });

    it('Screen comparison of Register page', function () {
        // comparing actual screen with expected screen
        Lib.screenshot('modern_registerPage');
    });

    // test all text fields on register page, using for cycle makes much shorter your final code
    // much better maintainable
    describe('Fields', function () {
        afterEach(function () {
            for(var i=0 ; i<listFields.length ; i++) {
                Register.resetFieldValue(listFields[i]);
            }
        });
        for(var i=0 ; i<listFields.length ; i++) {
            Register.typeIntoField(listFields[i],listValues[i]);
        }
    });

    
    // Agrees checkbox
    describe('Checkbox', function () {
        var val;
        afterEach(function () {
            Register.checkboxField()
             .uncheck();
        });
        it('should check when clicked', function () {
            Register.checkboxField()
                // using click method instead of check(), as it's closer to real user action
                .click()
                .checked()
                .and(function (checkbox) {
                    val = checkbox.isChecked();
                    expect(val).toBeTruthy();
                });
        });

        it('should check and uncheck when clicked twice', function () {
            Register.checkboxField()
                .click()
                .checked()
                .click()
                .unchecked()
                .and(function (checkbox) {
                    val = checkbox.isChecked();
                    expect(val).toBeFalsy();
                });
        });
    });
    describe('Buttons', function () {
        // Signup button
        // No form validation is available in modern so you can login with empty form
        it('Signup button should navigate to Main Dashboard page', function () {
            Register.buttonByText('Signup')
                .click();
          ST.component('admindashboard')
                .visible()
                .and(function (page) {
                    // check if user is redirected on the correct page
                    expect(page).toBeTruthy();
                });
        });
        // Login with Facebook button
        it('Login with facebook button works', function () {
            Register.buttonByText('Login with Facebook')
                .click();
            ST.component('admindashboard')
                .visible()
                .and(function (page) {
                    expect(page).toBeTruthy();
                });
        });
    });
});