
describe('Forms', function(){
    var Form = {
        button : function (color, text) {
            return ST.button('forms wizardform[colorScheme=' + color + '] button[text=' + text + ']');
        },
        textfield : function (color, emptyText) {
            return ST.component('forms wizardform[colorScheme=' + color + '] textfield[emptyText=' + emptyText + ']');
        },
        checkbox : function(color, boxLabel){
            return ST.checkBox('forms wizardform[colorScheme=' + color + '] checkbox[boxLabel='+ boxLabel+']');
        },
        mainPanelScrollY: function(scroll){
            return ST.component('container[id=main-view-detail-wrap]').and(function(panel){
                panel.setScrollY(scroll);
            });
        },
        isDesktop : ST.os.deviceType == "Desktop"
    };

// type text into field identified by color and label
    function typeAndValidate(color, label, text){
        it( label + ' should be editable', function () {
            Form.textfield(color, label)
                .type(text)
                .and(function(cmp){
                    expect(cmp.getValue()).toBe(text);
                });
        });
    }
//remove value from given component - in this case it is only textfield
    function clearTextfield(cmp) {
        cmp
            .and(function (cmp) {
                cmp.setValue('');
            });
    }
// test single form identified by it's color
    function colorForm(color){

        describe(color + ' form', function () {
            describe('WizardForm first page', function () {

                afterEach(function () {
                    //remove values from textfields
                    clearTextfield(Form.textfield(color, 'Username must be unique.'));
                    clearTextfield(Form.textfield(color, 'ex: me@somewhere.com'));
                    clearTextfield(Form.textfield(color, 'Enter a password'));
                    clearTextfield(Form.textfield(color, 'Passwords must match'));

                });
                // check if buttons have correct state
                describe("Button", function () {
                    it('\'Previous\' should be disabled', function () {
                        Form.button(color, 'Previous').and(function (cmp) {
                            expect(cmp.isDisabled()).toBeTruthy();
                        });
                    });

                    it('\'Next\' should be active', function () {
                        Form.button(color, 'Next').and(function (cmp) {
                            expect(cmp.isDisabled()).toBeFalsy();
                        });
                    });
                });


                describe('TextField', function () {
                    // array - [[emptyText of textfield, typed string]]
                    var strings = [
                        ['Username must be unique.', 'SenchaUser'],
                        ['ex: me@somewhere.com', 'user@sencha.com'],
                        ['Enter a password', 'giveMeCookies'],
                        ['Passwords must match', 'giveMeCookies']];
                    // loop for checking all texfields
                    // much better maintainable
                    for(var i = 0; i < strings.length; i++)
                        typeAndValidate(color, strings[i][0], strings[i][1]);

                });

                it('Email validation works properly', function () {
                    Form.textfield(color, 'ex: me@somewhere.com')
                        .click()
                        .type('user')
                        .and(function (el) {
                            expect(el.getValue()).toBe('user');
                            //check if element valids data correctly
                            expect(el.isValid()).toBeFalsy();

                        })
                        .type('@sencha.com')
                        .and(function (el) {
                            expect(el.getValue()).toBe('user@sencha.com');
                            // 'user' is not valid email
                            expect(el.isValid()).toBeTruthy();
                        });
                });
            });
            describe('WizardForm second page', function () {
                //move to next slide before each spec
                beforeAll(function () {
                    Form.button(color, 'Next').click();
                });
                // clean up field values after each spec and navigate back
                afterEach(function () {
                    clearTextfield(Form.textfield(color, 'First Name'));
                    clearTextfield(Form.textfield(color, 'Last Name'));
                    clearTextfield(Form.textfield(color, 'Company'));
                    //Form.button(color, 'Previous').click();
                });
                afterAll(function(){
                    Form.button(color, 'Previous').click();
                });
                describe("Button", function () {
                    it('\'Previous\' should be active', function () {
                        Form.button(color, 'Previous').and(function (cmp) {
                            expect(cmp.isDisabled()).toBeFalsy();
                        });
                    });
                    it('\'Next\' should be active', function () {
                        Form.button(color, 'Next').and(function (cmp) {
                            expect(cmp.isDisabled()).toBeFalsy();
                        });
                    });
                });

                describe('TextField', function () {
                    var strings = [['First Name', 'Cookie'],
                        ['Last Name', 'Monster'],
                        ['Company', 'Sesame street']];
                    // loop for checking all texfields
                    // much better maintainable
                    for(var i = 0; i < strings.length; i++){
                        typeAndValidate(color, strings[i][0], strings[i][1]);
                    }
                });
                // clicking on radiobutton and check - if clicking change checked checkbox
                describe('RadioButton group check', function () {
                    beforeAll(function(){
                        if(!Form.isDesktop&&color!='blue'){
                            Form.checkbox(color, 'Free').and(function(cb){
                                //and scroll into view due to issue on tablets
                                var scrollY = cb.getY();
                                Form.mainPanelScrollY(scrollY);
                            });
                        }
                    });
                    afterEach(function(){
                        //set checkbox group selection to default state
                        Form.checkbox(color, 'Free').uncheck();
                        Form.checkbox(color, 'Personal').uncheck();
                        Form.checkbox(color, 'Black').uncheck();
                    });
                    it('check \'Free\' checkbox ', function(){
                        Form.checkbox(color, 'Free')
                            .and(function(el){
                                expect(el.checked).toBeFalsy();
                            })
                            .click(10,10)
                            .and(function(el){
                                expect(el.checked).toBeTruthy();
                            });
                    });
                    it('check \'Personal\' checkbox ', function(){
                        Form.checkbox(color, 'Personal')
                            .and(function(el){
                                expect(el.checked).toBeFalsy();
                            })
                            .click(10,10)
                            .and(function(el){
                                expect(el.checked).toBeTruthy();
                            });
                    });
                    it('\'Free\' checkbox should be unchecked when \'Personal\' is checked', function(){
                        Form.checkbox(color, 'Free')
                            .check();
                        Form.checkbox(color, 'Personal')
                            .click(10,10);
                        Form.checkbox(color, 'Free')
                            .and(function(el){
                                expect(el.checked).toBeFalsy();
                            });
                    });
                    it('check \'Black\' checkbox ', function(){
                        Form.checkbox(color, 'Black')
                            .and(function(el){
                                expect(el.checked).toBeFalsy();
                            })
                            .click(10,10)
                            .and(function(el){
                                expect(el.checked).toBeTruthy();
                            });
                    });
                });
            });

            describe('WizardForm third page', function () {
                //need to navigate to 3rd slide before each test
                beforeAll(function () {
                    Form.button(color, 'Next').click().click();
                });
                //clean up field values after each spec and navigate back to init state
                afterEach(function () {
                    clearTextfield(Form.textfield(color, 'Phone number'));
                    clearTextfield(Form.textfield(color, 'Address'));
                    clearTextfield(Form.textfield(color, 'City'));
                    clearTextfield(Form.textfield(color, 'Postal Code / Zip Code'));
                });
                afterAll(function(){
                    Form.button(color, 'Previous').click().click();
                });
                describe("Button", function () {
                    it('\'Previous\' should be active', function () {
                        Form.button(color, 'Previous').and(function (cmp) {
                            expect(cmp.isDisabled()).toBeFalsy();
                        });
                    });
                    it('\'Next\' should be active', function () {
                        Form.button(color, 'Next').and(function (cmp) {
                            expect(cmp.isDisabled()).toBeFalsy();
                        });
                    });
                });
                describe('TextFields are editable', function () {
                    describe('TextField', function () {
                        var strings = [['Phone number', '+420777666555'],
                            ['Address', 'Sesame street 5'],
                            ['City', 'Prague'],
                            ['Postal Code / Zip Code', '123']];
                        for(var i = 0; i < strings.length; i++){
                            typeAndValidate(color, strings[i][0], strings[i][1]);
                        }
                    });
                });
            });
            describe('WizardForm fourth page', function () {
                // navigate to right page in form
                beforeAll(function () {
                    Form.button(color, 'Next').click().click().click();
                });
                // navigate back to init state
                afterAll(function () {
                    Form.button(color, 'Previous').click().click().click();
                });
                describe("Button", function () {
                    it('\'Previous\' should not be active', function () {
                        Form.button(color, 'Previous').and(function (cmp) {
                            expect(cmp.isDisabled()).toBeFalsy();
                        });
                    });
                    it('\'Next\' should be active', function () {
                        Form.button(color, 'Next').and(function (cmp) {
                            expect(cmp.isDisabled()).toBeTruthy();
                        });
                    });
                });
            });
        });
    }
    beforeEach(function () {
        Admin.app.redirectTo("#forms");

    });

    // check if page is loaded properly
    it('loads correctly', function(){
        Form.button('blue', 'Next')
            .rendered()
            .and(function(panel){
                expect(panel.rendered).toBeTruthy();
        });
    });

    // comparing actual screen with expected screen
    it('make a screenshot', function () {
        Lib.screenshot('form');
    });
    // call function and give a color of forms
    describe('Panel', function(){
        colorForm('blue');
        colorForm('soft-green');
        colorForm('soft-purple');

    });
});
