/**
 * @file passwordreset.js
 * @date 25.2.2016
 *
 * Tested on: Chromium, Opera, Safari, IE11, Firefox, Edge Android 6, iOS9
 * Passed on: All except Android 6, iOS9 (can't click on URL)
 */
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
        Lib.screenshot('passwordreset');
    });

    // check if URL works and redirect to another page
    // failing on tablets -  knownIssue - ORION-567
    it('has working URL', function () {
        ST.element('//a[contains(text(),"Back to Log In")]')
            .click();
        ST.component('login')
            .rendered()
            .and(function (el) {
                expect(el).toBeTruthy();
            });
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
        ST.button('passwordreset button')
            .and(function (button) {
                expect(button.isDisabled()).toBeFalsy();
            })
            .click();
        ST.component('panel[title=Network]')
            .rendered()
            .and(function (el) {
                expect(el).toBeTruthy();
            });

    });
});
