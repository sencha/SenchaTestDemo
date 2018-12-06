/**
 */
describe('Lockscreen Page', function () {
    afterAll(function(){
        Lib.afterAll("lockscreen");
    });
    beforeEach(function () {
        Lib.beforeAll("#lockscreen", "lockscreen", undefined, "admin");
    });
    // after each spec clean textfield
    afterEach(function () {
        //Admin.app.redirectTo("#lockscreen");
        ST.textField('lockscreen textfield')
            .and(function (el) {
                el.setValue('');
            });
    });
    // if page is rendered properly
    it('is loaded', function () {
        ST.component('lockscreen')
            .visible()
            .and(function (el) {
                expect(el.rendered).toBeTruthy();
            });
    });
    // comparing actual screen with expected screen
    it('make a screenshot', function () {
        Lib.screenshot('modern_lockscreen');
    });
    // check if URL works
    // failing on tablets -  knownIssue - ORION-567
    it('ORION-567 - has working URL', function () {
        ST.element('//a[contains(text(),"Sign in")]')
            .click();
        ST.component('login')
            .visible()
            .and(function (el) {
                expect(el).toBeTruthy();
            });
    });
    //type and check textfield
    describe('textfield', function () {
        afterEach(function(){
            ST.textField('lockscreen textfield').setValue('');
        });
        it('textfield accepts text', function () {
            var text = 'GiveMeCookies';
            ST.textField('lockscreen textfield')
                .type(text);
            ST.textField('lockscreen textfield')
                .wait(function(textField){
                    return textField.getValue() === text;
                    })
                .and(function (textfield) {
                    var val = textfield.getValue();
                    expect(val).toBe(text);
                });
        });
        it('should clear value when tapped clear icon', function () {
            var text = 'coookie!';
            ST.textField('lockscreen textfield')
                .type(text);
            ST.textField('lockscreen textfield')
                .wait(function(textField){
                    return textField.getValue() === text;
                });
            ST.element('lockscreen textfield => div.x-cleartrigger').click();
            ST.textField('lockscreen textfield')
                .wait(function(textField){
                    return textField.getValue() === '';
                })
                .and(function(textField){
                    var val = textField.getValue();
                    expect(val).toBe('');
                });
        });

    });

    //sinced there is no validation in modern just simply click the login button
    describe('Login button', function () {
        it('should navigate to dashboard page on click', function () {
            ST.button('lockscreen button')
                .click();
            ST.component('panel[title=Network]')
                .visible()
                .and(function (el) {
                    expect(el).toBeDefined();
                });
        });
    });

});
