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
    it('make a screenshot', function (next) {
        ST.screenshot('pageblank', next);
    }, 1000 * 20);
});
