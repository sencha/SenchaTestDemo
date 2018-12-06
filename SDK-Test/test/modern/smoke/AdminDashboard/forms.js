/**
 * @file formsModern.js
 * Forms - modern
 **/

describe('Forms', function () {

    beforeEach(function () {
        // make sure you are on search results page
        Lib.beforeAll("#forms", "forms", undefined, "admin");
    });
    afterAll(function(){
        //Lib.afterAll("forms");//It is not need destroyed
        ST.options.eventDelay = 500;
    });

// Waits for page to load
    describe("Waits for login page to load", function () {
        it('Forms page is loaded correctly', function () {
            ST.component("forms wizard")
                .wait(function (forms) {
                    return forms.isVisible();
                })
                .and(function (forms) {
                    expect(forms.isVisible()).toBeTruthy()
                });
        });
    });

// Account form back button is disabled by defalut
    describe("Account form back button is disabled by defalut", function () {
        it('Back button is disabled', function () {
            ST.component("toolbar button[text=Back]")
                .disabled()
                .and(function (el) {
                    expect(el.isDisabled()).toBeTruthy()
                });
        });
    });

// Account fields are empty by default
    describe("Account fields are empty by default", function () {
        var AccountButtons = ['Username must be unique', 'Email (ex: me@somewhere.com)', 'Enter a password', 'Passwords must match'];

        function loopAccount(AccountButtons) {
            it('Field contain  ' + AccountButtons + ' placeholder', function () {
                ST.component("accountform textfield[_placeholder=" + AccountButtons + "]")
                    .visible()
                    .rendered()
                    .and(function (el) {
                        expect(el._placeholder).toContain(AccountButtons);
                    });
            });
        }

        for (var i = 0; i < AccountButtons.length; i++) {
            loopAccount(AccountButtons[i]);
        }
    });

// Typing into Account textfields
    describe("Typing into Account textfields", function () {
        var AccountButtons = ['Username must be unique', 'Email (ex: me@somewhere.com)', 'Enter a password', 'Passwords must match'];
        var AccountButtonsText = ['Username', 'email@email.cz', 'password', 'password'];

        function loopAccount2(AccountButtons, AccountButtonsText) {
            it('textfields contains ' + AccountButtons + ' text', function () {
                ST.textField('accountform textfield[_placeholder=' + AccountButtons + ']')
                    .type(AccountButtonsText);
                ST.textField('accountform textfield[_placeholder=' + AccountButtons + ']')
                    .and(function (textfield) {
                        expect(textfield.getValue()).toBe(AccountButtonsText);
                    });
            });
        }

        for (var i = 0; i < AccountButtons.length; i++) {
            loopAccount2(AccountButtons[i], AccountButtonsText[i]);
        }
    });

// Moving to profile section
    describe("Moving to profile section", function () {
        it('Switched to profile section', function () {
            ST.component("toolbar button[text=Next]")
                .click();
            ST.component("profileform")
                .wait(function (profileform) {
                    return profileform.isVisible();
                })
                .and(function (profileform) {
                    expect(profileform.isVisible()).toBeTruthy()
                });
        });
        it('Back button is NOT disabled', function () {
            ST.component("toolbar button[text=Back]")
                .enabled()
                .and(function (el) {
                    expect(el.isDisabled()).toBeFalsy()
                });
        });
    });

// Typing into Profile textfields
    describe("Typing into Profile textfields", function () {
        var ProfileValues = ['First Name', 'Last Name', 'Company'];

        function loopProfile(ProfileValues) {
            it('textfields contains ' + ProfileValues + ' text', function () {
                ST.component("profileform textfield[_placeholder=" + ProfileValues + "]")
                    .type(ProfileValues);
                ST.component("profileform textfield[_placeholder=" + ProfileValues + "]")
                    .and(function (textfield) {
                        expect(textfield.getValue()).toBe(ProfileValues);
                    });
            });
        }

        for (var i = 0; i < ProfileValues.length; i++) {
            loopProfile(ProfileValues[i]);
        }
    });

// Clicking on all Member type buttons
    describe("Clicking on all Member type buttons", function () {
        var segmentedButtons = ['Free', 'Personal', 'Gold'];

        function loopSegmentedButtons(segmentedButtons) {
            it('Button ' + segmentedButtons + ' is pressed when clicked', function () {
                ST.button("profileform segmentedbutton button[_text=" + segmentedButtons + "]")
                    .click()
                    .pressed()
                    .and(function (button) {
                        expect(button.isPressed()).toBeTruthy()
                    });
            });
        }

        for (var i = 0; i < segmentedButtons.length; i++) {
            loopSegmentedButtons(segmentedButtons[i]);
        }
        it('Personal button is NOT pressed', function () {
            ST.button("profileform segmentedbutton button[_text=Personal]")
                .unpressed()
                .and(function (button) {
                    expect(button.isPressed()).toBeFalsy()
                });
        });
        it('Free button is NOT pressed', function () {
            ST.button("profileform segmentedbutton button[_text=Free]")
                .unpressed()
                .and(function (button) {
                    expect(button.isPressed()).toBeFalsy()
                });
            ST.component("toolbar button[text=Next]")
                .click();
        });
    });

// Typing into Adress textfields
    describe("Typing into Adress textfields", function () {
        var AddressButtons = ['Phone Number', 'Address', 'City', 'Postal / Zip Code'];
        var AddressButtonsText = ['777 666 555', 'Bazaly', 'Ostrava', '742 85'];

        function loopAdress(AddressButtons, AddressButtonsText) {
            it('textfields contains ' + AddressButtons + ' text', function () {
                ST.textField('addressform textfield[_placeholder=' + AddressButtons + ']')
                    .type(AddressButtonsText);
                ST.textField('addressform textfield[_placeholder=' + AddressButtons + ']')
                    .and(function (textfield) {
                        expect(textfield.getValue()).toBe(AddressButtonsText);
                    });
            });
        }

        for (var i = 0; i < AddressButtons.length; i++) {
            loopAdress(AddressButtons[i], AddressButtonsText[i]);
        }
    });

// Finish section
    describe("Finish section", function () {
        it('Moved to finish section', function () {
            ST.component("toolbar button[text=Next]")
                .click();
            ST.component("finishform")
                .visible()
                .rendered()
                .and(function (el) {
                    expect(el.el.dom.innerText).toContain('Thank You');
                });
        });
    });

// Clicking on all tabbar buttons
    describe("Clicking on all tabbar buttons", function () {
        var TabbarButtons = ['Finish', 'Address', 'Profile', 'Account'];

        function loopTabbarButtons(TabbarButtons) {
            it('Button ' + TabbarButtons + ' has active class', function () {
                ST.component("tabbar tab[_title=" + TabbarButtons + "]")
                    .click()
                    .hasCls("x-active")
                    .and(function (el) {
                        expect(el.el.dom.className).toContain('x-active');
                    });
            });
        }

        for (var i = 0; i < TabbarButtons.length; i++) {
            loopTabbarButtons(TabbarButtons[i]);
        }
    });
});
