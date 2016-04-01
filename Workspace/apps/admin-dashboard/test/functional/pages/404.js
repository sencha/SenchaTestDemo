/**
 * @file 404.js
 * @author Vojtech Cerveny
 * @date 25.2.2016
 *
 * Tested on: Chromium, Opera, Safari, IE11, Firefox, Android 6, iOS9
 * Passed on: All except Android 6, iOS9 (can't click on URL)
 * Note: sometimes IE throws error "Failed: Unable to get property 'getActive' of undefined or null reference"
 * ^^    It must be focused.
 */
describe('404 Page', function(){
    beforeAll(function () {
        Admin.app.redirectTo("#page404");
    });
    // if page is rendered properly
    it('is loaded', function(){
        ST.component('page404')
            .rendered()
            .and(function(el){
                expect(el.rendered).toBeTruthy();
            });
    });
    // comparing actual screen with expected screen
    it('make a screenshot', function (done) {
        ST.screenshot('page404', done);
    }, 1000 * 20);
});
