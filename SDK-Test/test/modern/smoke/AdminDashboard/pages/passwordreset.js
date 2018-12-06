/**
 */
describe('PasswordReset Page', function () {
    beforeEach(function () {
        Lib.beforeAll("#passwordreset", "passwordreset", undefined, "admin");
    });
    afterAll(function(){
        //Lib.afterAll("passwordreset");//It is not need destroyed
        ST.options.eventDelay = 500;
    });

    //clean value of textfield
    afterEach(function () {
        //Admin.app.redirectTo("#passwordreset");
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
        Lib.screenshot('modern_passwordreset');
    });

    describe('Reset panel', function(){
        // check if URL works and redirect to another page
        // failing on tablets -  knownIssue - ORION-567
        it('ORION-588 - Click on Back to Login link navigates to Login Page', function () {
            ST.element('//a[contains(text(),"Back to Login")]')
                .click();
            ST.component('login')
                .visible()
                .and(function (el) {
                    expect(el).toBeTruthy();
                });
        });
        describe('Email field', function(){
            //field is missing any validation so it accepts any value
            var val;
            it('accepts any input', function () {
                var text = 'GiveMeCookies@MonsterCookie.com';
                ST.textField('passwordreset textfield')
                    .type(text);
                ST.textField('passwordreset textfield')
                    .and(function (textfield) {
                        val = textfield.getValue();
                        expect(val).toBe(text);
                    });
            });
            it('should clear value when tapped clear icon', function () {
                var text = 'coookie!';
                ST.textField('passwordreset textfield')
                    .type(text);
                ST.textField('passwordreset textfield')
                    .wait(function(textField){
                        return textField.getValue() === text;
                    });
                ST.element('passwordreset textfield => div.x-cleartrigger').click();
                ST.textField('passwordreset textfield')
                    .wait(function(textField){
                        return textField.getValue() === '';
                    })
                    .and(function(textField){
                        var val = textField.getValue();
                        expect(val).toBe('');
                    });
            });
        });
        describe('Reset Password button', function(){
            it('should navigate to Dashboard page on click', function () {
                ST.button('passwordreset button')
                    .click();
                ST.component('panel[title=Network]')
                    .visible()
                    .and(function (el) {
                        expect(el).toBeTruthy();
                    });
            });
        });
    });


});
