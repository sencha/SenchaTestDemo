describe('Login Page', function () {
    // We need to  start every test from Login page, even the first round.
    beforeEach ( function () {
        Admin.app.redirectTo("#login"); // redirection on login page
    });

    // Canceling every changes on login page. We need to start every test from clear state
    afterEach ( function () {
        Admin.app.redirectTo("#login");
            // we can locate element via couple of ways
            // http://docs.sencha.com/sencha_test/ST.Locator.html
            // Locating Elements
                // At-Path locator needs to ID. It's bad practice to use dynamic ID
                // dynamic ID is changing very often. This ID will change during the test run
                    //ST.textField('@textfield-1102-inputEl')
                // XPath locator
                    // ST.textField("//input[@name='userid']")
                // DOM Query locator
                    // ST.textField(">>input[name='userid']")
            // Locating Components
                // Component Query locator
                    //ST.textField('login [name=userid]')
                // Composite Query locator
                    // ST.textField('login => input[name=userid]')
            ST.textField(">>input[name='userid']") // DOW Query locator used  
            .and(function (textfield) {
                textfield.setValue(''); // clearing userid textfield
            });

        ST.textField('login [name=password]')
            .and(function (textfield) {
                textfield.setValue('');
            });

        ST.checkBox('login checkbox')
            .uncheck(); // unchecking the checkbox, if it was checked
    });

    // login page
    describe('Login page - common', function () {
        it('Login page is loaded', function () {
            ST.component('login')
                .visible()
                    .and(function (page) {
                    expect(page.rendered).toBeTruthy();
                });
        });

        it('Screen comparison of Login page', function (done) {
            // comparing actual screen with expected screen
            ST.screenshot('loginPage', done);
        }, 1000 * 20);
    });

    // user id textfield
    describe('User ID textfield', function () {
        it('User id textfield is editable', function () {
            ST.textField('login [name=userid]')
                .type('login@sencha.com')
                .and(function (textfield) {
                    // check if textfield contains expected value/string
                    expect(textfield.getValue()).toBe('login@sencha.com');
                });
        });
        
        it('User id textfield is invalid', function () {
            ST.textField('login [name=userid]')
                .and(function (textfield) {
                    textfield.setValue('');
                    // check if textfield is invalid
                    expect(textfield.isValid()).toBeFalsy();
                });
        });
        
        it('User id textfield is valid', function () {
            ST.textField('login [name=userid]')
                .type('login@sencha.com')
                .and(function (textfield) {
                    // check if textfield is valid
                    expect(textfield.isValid()).toBeTruthy();
                });
        });
    });

    // password textfield
    describe('Password textfield', function () { 
        it('Password textfield is editable', function () {
            ST.textField('login [name=password]')
                .type('pasword123')
                .and(function (textfield) {
                    expect(textfield.getValue()).toBe('pasword123');
                });
        });

        it('Password textfield is invalid', function () {
            ST.textField('login [name=password]')
                .and(function (textfield) {
                    textfield.setValue('');
                    expect(textfield.isValid()).toBeFalsy();
                });
        });

        it('Password textfield is valid', function () {
            ST.textField('login [name=password]')
                .type('pasword123')
                .and(function (textfield) {
                    expect(textfield.isValid()).toBeTruthy();
                });
        });
    });

    // remember me checkbox
    describe('Remember me checkbox', function () { 
        it('Remember me checkbox is checked', function () {
           ST.checkBox('login checkboxfield')
           // using click method instead of check(), as it's closer to real user action
           .click(0,15)
           .checked()
           .and(function (checkbox) {
               // check if checkbox is really checked
               expect(checkbox.checked).toBeTruthy();
           });
        });
        
        it('Remember me checkbox is unchecked', function () {
            // select Remember me checkbox, as it is only one on the page, isn't 
            // necessary to specify location
            ST.checkBox('login checkboxfield')
                .click(0,15)
                .checked()
                .click(0,15)
                .unchecked()
                .and(function (checkbox) {
                    // check if checkbox is really unchecked
                    expect(checkbox.unchecked).toBeFalsy();
           });
        });
    });

    // login button
    describe('Login button', function () {
        it('Login button is disabled', function () {
            ST.button('login [text=Login]') 
           .and(function (button) {
               // check if login button is disabled, when necessary fields aren't filled
               expect(button.disabled).toBeTruthy();
           });
        });
        
        it('Login button is enabled and works', function () {
            ST.textField('login [name=password]')
                .type('pasword123');
            ST.textField('login [name=userid]')
                .type('user@sencha.com');
            ST.button('login [text=Login]') 
                .and(function (button) {
                    // check if login button is enabled, when all necessary fields are filled
                    expect(button.disabled).toBeFalsy();
                })
                .click();
            ST.component('admindashboard')
                .visible()
                .and(function (page) {
                    expect(page).toBeTruthy();
                });
        });
    });

    // login with facebook button
    it('Login with facebook button works', function () {
        ST.button('login [text=Login with Facebook]')
            .click();
        ST.component('admindashboard')
            .visible()
            .and(function (page) {
                expect(page).toBeTruthy();
            });
    });

    // create account button
    it('Create Account button works', function () {
        ST.button('login [text=Create Account]').
            click();
        ST.component('register')
            .visible()
            .and(function (page) {
                expect(page).toBeTruthy();
            });
    });
});
