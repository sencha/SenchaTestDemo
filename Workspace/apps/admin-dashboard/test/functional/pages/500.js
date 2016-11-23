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
        ST.screenshot('page500');
    });
});
