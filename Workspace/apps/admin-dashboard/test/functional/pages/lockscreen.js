describe('Lockscreen Page', function () {
    beforeEach(function () {
        Admin.app.redirectTo("#lockscreen");
    });
    // after each spec clean textfield
    afterEach(function () {
        Admin.app.redirectTo("#lockscreen");
        ST.textField('lockscreen textfield')
            .and(function (el) {
                el.setValue('');
            });
    });
    // if page is rendered properly
    it('is loaded', function () {
        ST.component('lockscreen')
            .rendered()
            .and(function (el) {
                expect(el.rendered).toBeTruthy();
            });
    });
    // comparing actual screen with expected screen
    it('make a screenshot', function (done) {
        ST.screenshot('lockscreen', done);
    }, 1000 * 20);
    //type and check textfield - textfield should contains typed value
    it('textfield is editable', function () {
        ST.textField('lockscreen textfield')
            .type('GiveMeCookies')
            .and(function (textfield) {
                expect(textfield.getValue()).toBe('GiveMeCookies');
            });
    });

    it('textfield show not be empty', function () {
        ST.textField('lockscreen textfield')
            .and(function (el) {
                expect(el.isValid()).toBeFalsy();
            })
            .type('coookie!')
            .and(function (el) {
                expect(el.isValid()).toBeTruthy();
            });
    });

    //type valid value to textfield and check button - button should be active
    it('button should react on valid texfield', function () {
        ST.textField('lockscreen textfield')
            .type('coookie!');
        ST.button('lockscreen button').
            and(function (button) {
                expect(button.isDisabled()).toBeFalsy();
            });
        ST.textField('lockscreen textfield')
            .and(function (el) {
                el.setValue('');
            });
        ST.button('lockscreen button')
            .wait(200)
            .and(function (button) {
                expect(button.isDisabled()).toBeTruthy();
            });
    });
    //type and check - button should be active and redirect to another page by clicking
    it('button should accept password and redirect to next page', function () {
        ST.textField('lockscreen textfield')
            .type('coookie!');
        ST.button('lockscreen button')
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
