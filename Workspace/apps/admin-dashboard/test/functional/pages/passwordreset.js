describe('PasswordReset Page', function () {
    beforeEach(function () {
        Admin.app.redirectTo("#passwordreset");
    });

    //clean value of textfield
    afterEach(function () {
        Admin.app.redirectTo("#passwordreset");
        ST.textField('passwordreset textfield')
            .and(function (el) {
                el.setValue('');
            });
    });

    // if page is rendered properly
    it('is loaded', function () {
        ST.component('passwordreset')
            .rendered()
            .and(function (el) {
                expect(el.rendered).toBeTruthy();
            });
    });

    // comparing actual screen with expected screen
    it('make a screenshot', function () {
        ST.screenshot('passwordreset');
    });

    // type and check if value of textfiled is correct
    it('textfield is editable', function () {
        ST.textField('passwordreset textfield')
            .type('GiveMeCookies@MonsterCookie.com')
            .and(function (textfield) {
                expect(textfield.getValue()).toBe('GiveMeCookies@MonsterCookie.com');
            });
    });

    // type invalid value and check - textfield should be invalid
    it('textfield validation - invalid email', function () {
        ST.textField('passwordreset textfield')
            .type('InValid Email')
            .and(function (el) {
                expect(el.isValid()).toBeFalsy();
            });
    });

    // type valid value and check - texfield should be valid
    it('textfield validation - valid email', function () {
        ST.textField('passwordreset textfield')
            .type('user@sencha.com')
            .and(function (el) {
                expect(el.isValid()).toBeTruthy();
            });
    });

    // type invalid value and check button - button should be disabled
    it('button should be disabled if texfield is invalid', function () {
        ST.textField('passwordreset textfield')
            .type('coookie!');
        ST.button('passwordreset button')
            .and(function (button) {
                expect(button.isDisabled()).toBeTruthy();
            })
            .click();
        ST.textField('passwordreset textfield')
            .rendered()
            .visible();
    });

    // type valid value and check button - button should be enabled
    it('button should be active if texfield is valid', function () {
        ST.textField('passwordreset textfield')
            .type('user@sencha.com');
        // we can locate element via couple of ways
            // http://docs.sencha.com/sencha_test/ST.Locator.html
            // Locating Elements
                // At-Path locator needs to ID. It's bad practice to use dynamic ID
                // dynamic ID is changing very often. This ID will change during the test run
                    // ST.button('@button-1040-btnWrap')
                // XPath locator
                    // ST.button("//*[text()='Reset Password'][@data-ref='btnInnerEl']")
                // DOM Query locator
                    // ST.button(">>span[data-ref='btnInnerEl'].x-btn-inner-soft-blue-large")
            // Locating Components
                // Component Query locator
                    // ST.button('passwordreset button')
                // Composite Query locator
                    // ST.button('passwordreset button => span.x-btn-inner-soft-blue-large')
                
        ST.button("//*[text()='Reset Password'][@data-ref='btnInnerEl']") // XPath locator is used
            .and(function (button) {
                expect(button.isDisabled()).toBeFalsy();
            })
            .click();

        // select title on Dashboard home page for checking correct redirection
        ST.component('panel[title=Network]')
            .rendered()
            .and(function (el) {
                expect(el).toBeTruthy();
            });
    });
});
