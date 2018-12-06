/**
 */
 
describe('Login Page', function () {

    var Login = {
        loginPage : function () {
            return ST.component('login');
        },
        emailField : function(){
            return ST.textField('login textfield[placeholder=Email]');
        },
        passField : function () {
            return ST.textField('login textfield[placeholder=Password]');
        },
        rememberCheckBox : function(){
            return ST.checkBox('login checkboxfield');
        },
        buttonByText : function(text){
            return ST.button('login button[text="'+text+'"]');
        }
    };
    // We need to  start every test from Login page, even the first round.
    beforeEach(function () {
        Lib.beforeAll("#login", "login", undefined, "admin");
    });
    afterAll(function(){
        //Lib.afterAll("login");//It is not need destroyed
        ST.options.eventDelay = 500;
    });

    it('Login page is loaded', function () {
        Login.loginPage()
            .visible()
            .and(function (page) {
                expect(page.rendered).toBeTruthy();
            });
    });

    it('Screen comparison of Login page', function () {
        // comparing actual screen with expected screen
        Lib.screenshot('modern_loginPage');
    });


    describe('Fields',function () {
        //Email textfield
        describe('Email textfield', function () {
            afterEach(function () {
                Login.emailField()
                    .and(function (textfield) {
                        textfield.setValue(''); // clearing userid textfield
                    });
            });
            it('should accept text', function () {
                var text = 'login@sencha.com';
                //should accept any text since no validation is defined
                Login.emailField()
                    .type(text);
                Login.emailField()
                    .and(function (textfield) {
                        // check if textfield contains expected value/string
                        var val = textfield.getValue();
                        expect(val).toBe(text);
                    });
            });
            it('should clear value when tapped clear icon', function () {
                var text = 'coookie!';
                Login.emailField()
                    .type(text);
                Login.emailField()
                    .wait(function(textField){
                        return textField.getValue() === text;
                    });
                ST.element('login textfield[placeholder=Email] => div.x-cleartrigger').click();
                Login.emailField()
                    .wait(function(textField){
                        return textField.getValue() === '';
                    })
                    .and(function(textField){
                        var val = textField.getValue();
                        expect(val).toBe('');
                    });
            });
        });

        // password textfield
        describe('Password textfield', function () {
            afterEach(function () {
                Login.passField()
                    .and(function (textfield) {
                        textfield.setValue(''); // clearing userid textfield
                    });
            });
            it('Password textfield is editable', function () {
                var text = 'pasword123';
                Login.passField()
                    .type(text);
                Login.passField()
                    .and(function (textfield) {
                        var val =  textfield.getValue();
                        expect(val).toBe(text);
                    });
            });

            it('should clear value when tapped clear icon', function () {
                var text = 'coookie!';
                Login.passField()
                    .type(text);
                Login.passField()
                    .wait(function(textField){
                        return textField.getValue() === text;
                    });
                    
                ST.component('passwordfield cleartrigger').click();
                

                Login.emailField()
                    .wait(function(textField){
                        return textField.getValue() === '';
                    })
                    .and(function(textField){
                        var val = textField.getValue();
                        expect(val).toBe('');
                    });
            });
        });

        // remember me checkbox
        describe('Remember me checkbox', function () {
            var val;
            afterEach ( function () {
                Login.rememberCheckBox()
                    .uncheck(); // unchecking the checkbox, if it was checked
            });
            it('should check checkbox on click', function () {
                Login.rememberCheckBox()
                    // using click method instead of check(), as it's closer to real user action
                    .click()
                    .checked()
                    .and(function (checkbox) {
                        // check if checkbox is really checked
                        val = checkbox.isChecked();
                        expect(val).toBeTruthy();
                    });
            });

            it('should toggle state on double click', function () {
                Login.rememberCheckBox()
                    .click()
                    .checked()
                    .click()
                    .unchecked()
                    .and(function (checkbox) {
                        // check if checkbox is really unchecked
                        val = checkbox.isChecked();
                        expect(val).toBeFalsy();
                    });
            });
        });
    });
    // forgot password link
    // failing on tablets -  knownIssue - ORION-567
    it('ORION-567 - click on Forgot password link should navigate to Password reset page', function () {
        ST.element('//a[contains(text(),"Forgot Password")]')
            .click();
        ST.component('passwordreset')
            .visible()
            .and(function (page) {
                // check if user is redirected on the correct page
                expect(page).toBeTruthy();
            });
    });
    describe('Buttons', function () {
        describe('Login button', function () {
            it('clicking on Login button should navigate to Dashboard page', function () {
                Login.buttonByText('Login')
                    .click();
                ST.component('admindashboard')
                    .visible()
                    .and(function (page) {
                        expect(page).toBeTruthy();
                    });
            });
        });

        // login with facebook button
        describe('Login with facebook button', function () {
            it('Lclicking on Login with facebook button should navigate to Dashboard page', function () {
                Login.buttonByText('Login with Facebook')
                    .click();
                ST.component('admindashboard')
                    .visible()
                    .and(function (page) {
                        expect(page).toBeTruthy();
                    });
            });
        });
        // create account button
        describe('Create account button', function () {
            it('Create Account button works', function () {
                Login.buttonByText('Create Account')
                    .click();
                ST.component('register')
                    .visible()
                    .and(function (page) {
                        expect(page).toBeTruthy();
                    });
            });
        });
    });
});
