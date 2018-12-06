/**
 * @file blank.js
 * @date 25.2.2016
 *
 * Tested on: Chromium, Opera, Safari, IE11, Firefox, Android 6, iOS9, IE11, Edge
 * Passed on: Chromium, Opera, Safari, IE11, Firefox, Android 6, iOS9, IE11, Edge
 */

describe('Blank Page', function(){
    beforeAll(function () {
        Admin.app.redirectTo("#pageblank");
    });
    // if page is rendered properly
    it('is loaded', function(){
       ST.component('pageblank')
           .visible()
           .rendered()
           .and(function(el){
               expect(el.rendered).toBeTruthy();
           });
    });
    // comparing actual screen with expected screen
    it('make a screenshot', function () {
        Lib.screenshot('pageblank');
    });
});
