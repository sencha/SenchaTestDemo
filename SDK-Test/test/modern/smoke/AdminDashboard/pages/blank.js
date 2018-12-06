/**
 */

describe('Blank Page', function(){
    beforeAll(function() {
        Lib.beforeAll("#pageblank", "pageblank", undefined, "admin");
    });
    afterAll(function(){
        //Lib.afterAll("pageblank");//It is not need destroyed
        ST.options.eventDelay = 500;
    });

    // if page is rendered properly
    it('loaded correctly', function(){
       ST.component('pageblank')
           .visible()
           .and(function(el){
               expect(el.rendered).toBeTruthy();
           });
    });
    // comparing actual screen with expected screen
    it('make a screenshot', function () {
        Lib.screenshot('modern_pageblank');
    });
});
