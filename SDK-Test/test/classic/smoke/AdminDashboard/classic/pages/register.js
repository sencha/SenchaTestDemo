/**
 * @file register.js
 * @date 26.2.2016
 *
 * Tested on: Chrome, Firefox, Opera, Safari, IE11, Edge, Android6 and iOS9
 * Passed on: all tested platforms
 */
    
describe('Register Page', function () {

    var listFields = ["fullName", "userid", "email", "password" ],
        listValues = ["Sencha Name", "sencha", "login@sencha.com", "pasword123"],
        i;

    // common function for testing text field
    function testField (textfield, value) {
        describe(textfield + ' textfield ', function () {
            it(textfield + ' textfield is editable', function () {
                ST.textField('register [name=' + textfield +']')
                    .type(value)
                    .and(function (textfield) {
                        // check if textfield contains expected value/string
                        expect(textfield.getValue()).toBe(value);
                    });
            });

            it(textfield + ' textfield is invalid', function () {
                ST.textField('register [name=' + textfield +']')
                    .and(function (textfield) {
                        textfield.setValue('');
                        // check if textfield is invalid
                        expect(textfield.isValid()).toBeFalsy();
                    });
            });

            it(textfield + ' textfield is valid', function () {
                ST.textField('register [name=' + textfield +']')
                    .type(value)
                    .and(function (textfield) {
                        // check if textfield is valid
                        expect(textfield.isValid()).toBeTruthy();
                    });
            });
        });
    }
    // We need to start every test from Login page, even the first round.
    beforeEach(function () {
        Admin.app.redirectTo("#register");
    });
    
    // Canceling every changes on register page. We need to start every test from clear state
    afterEach(function () {
        Admin.app.redirectTo("#register");
        for(i=0 ; i<listFields.length ; i++) {
            ST.textField('register [name=' + listFields[i] + ']')
                .and(function (textfield) {
                    textfield.setValue('');
                });
        }
        ST.checkBox('register checkbox')
            .uncheck();
    });
    
    // register page
    describe('Register page - common', function () {
        it('Register page is loaded', function () {
            ST.component('register')
                .visible()
                .rendered()
                .and(function (page) {
                    expect(page.rendered).toBeTruthy();
                });
        });
        
        it('Screen comparison of Register page', function () {
            // comparing actual screen with expected screen
            Lib.screenshot('registerPage');
        });
    });
    
    // test all text fields on register page, using for cycle makes much shorter your final code
    // much better maintainable
    for(i=0 ; i<listFields.length ; i++) {
        testField(listFields[i],listValues[i]);
    }
    
    // Agrees checkbox
    describe('Agrees checkbox', function () {
        it('Agrees checkbox is checked', function () {
           ST.checkBox('register checkbox')
                // using click method instead of check(), as it's closer to real user action
                .click(0,15)
                .checked()
                .and(function (checkbox) {
                    expect(checkbox.checked).toBeTruthy();
                });
        });
        
        it('Agrees checkbox is unchecked', function () {
           ST.checkBox('register checkbox')
                .click(0,15)
                .checked()
                .click(0,15)
                .unchecked()
                .and(function (checkbox) {
                    expect(checkbox.unchecked).toBeFalsy();
                });
        });
    });
    
    // Signup button
    describe('Signup button', function () {
        it('Signup button is disabled', function () {
            ST.button('register [text=Signup]') 
                .and(function (button) {
                    // check if signup button is disabled, when necessary fields aren't filled
                    expect(button.disabled).toBeTruthy();
                });
        });
        
        it('Signup button is enabled and works', function () {
            for(i=0 ; i<listFields.length ; i++) {
                ST.textField('register [name=' + listFields[i] + ']')
                    .type(listValues[i]);
            } 
            ST.checkBox('register checkbox')
                .check();
            ST.button('register [text=Signup]') 
                .enabled()
                .and(function (button) {
                    // check if signup button is enabled, when all necessary fields are filled
                    expect(button.disabled).toBeFalsy();
                })
                .click();
          ST.component('admindashboard')
                .rendered()
                .and(function (page) {
                    // check if user is redirected on the correct page
                    expect(page).toBeTruthy();
                });
        });
    });
    
    // Login with Facebook button
    it('Login with facebook button works', function () {
        ST.button('register [text=Login with Facebook]').
            click();
        ST.component('admindashboard')
            .rendered()
            .and(function (page) {
                expect(page).toBeTruthy();
            });
    });
});