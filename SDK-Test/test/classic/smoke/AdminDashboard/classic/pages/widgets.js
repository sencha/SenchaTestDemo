/**
 * @file widgets.js
 * @date 2.3.2016
 *
 * Tested on: Chrome, Firefox, Opera, Safari, IE11, Edge, Android6 and iOS9
 * Passed on: all tested platforms
 */

describe('Widgets Page', function () {
    var locator = {
            createBig : function (text,order)  {
                return 'widgets button[text=' + text + ']:nth-child(' + order + ')';
            },

            createSmall : function(order) {
                return 'widgets button:nth-child(' + order + ')';
            }
        },
        bigButtons = ['Follow','Message'],
        smallButtons = ['Facebook','Twitter',"Google+","Envelope"],
        i, button1;

// common function for testing buttons on widgets page
    function testButtons (element,button,order) {
        it('Click on ' + button + ' button on ' + element, function () {
            if (order>2) {
                button1 = locator.createSmall(order);
            } else {
                button1 = locator.createBig(button, order);
            }

            // we have to use mousedown/mouseup methods for checking pressing button
            // via mousedown/mouseup we divide click on the 'click/unclick' operations
            // via click method isn't possible to check if button was pressed
            ST.play([
                // press button
                { type: "mousedown", target: button1, x: 20, y: 10, detail: 1 }
            ]);
            ST.component(button1)
                .and(function (button,next) {
                    expect(button.el.dom.className).toContain('x-btn-pressed');
                    next();
                });
            ST.play([
                // unpress button
                { type: "mouseup", target: button1, x: 20, y: 10, detail: 1 }
            ]);
        });
    }
// We need to  start every test from widgets page, even the first round.
    beforeEach(function () {
        Admin.app.redirectTo("#widgets");
    });

    // widgets page
    describe('Widgets page - common', function () {
        it('Widgets page is loaded', function () {
            ST.component('widgets')
                .visible()
                .rendered()
                .and(function (page) {
                    expect(page.rendered).toBeTruthy();
                });
        });

        it('Screen comparison of Widgets page', function () {
            // comparing actual screen with expected screen
            Lib.screenshot('widgetsPage');
        });
    });

    // test all text fields on register page, using for cycle makes much shorter your final code
    // much better maintainable

    // click on the buttons on John Doe
    describe('John Doe buttons', function () {
        for(i=0 ; i<bigButtons.length ; i++) {
            testButtons('John Doe',bigButtons[i],1);
        }
    });

    // click on the buttons on Lucy Moon
    describe('Lucy Moon buttons', function () {
        for(i=0 ; i<smallButtons.length ; i++) {
            testButtons('Lucy Moon',smallButtons[i],i+3);
        }
    });

    // click on the buttons on Goff Smith
    describe('Goff Smith buttons', function () {
        for(i=0 ; i<bigButtons.length ; i++) {
            testButtons('Goff Smith',bigButtons[i],2);
        }
    });

});