/**
 * @file 500.js
 * @date 25.2.2016
 *
 * Tested on: Chromium, Opera, Safari, IE11, Firefox, Android 6, iOS9
 * Passed on: All except Android 6, iOS9 (can't click on URL)
 */

describe('500 Page', function(){
    beforeAll(function () {
        Admin.app.redirectTo("#page500");
    });
    // if page is rendered properly
    it('is loaded', function(){
        ST.component('page500')
            .rendered()
            .and(function(el){
                expect(el.rendered).toBeTruthy();
            });
    });
    // comparing actual screen with expected screen
    it('make a screenshot', function () {
        Lib.screenshot('page500');
    });
    // check if URL works
    it('has working URL', function () {
        ST.element('page500 => a')
            .click();
        ST.component('panel[title=Network]')
            .rendered()
            .and(function(el){
                expect(el).toBeTruthy();
            });
    });
});
