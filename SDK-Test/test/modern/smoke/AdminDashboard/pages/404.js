/**
 */

describe('404 Page', function(){

    beforeAll(function() {
        Lib.beforeAll("#page404", "page404", undefined, "admin");
    });
    afterAll(function(){
        //Lib.afterAll("page404");//It is not need destroyed
        ST.options.eventDelay = 500;
    });

    // if page is rendered properly
    it('loaded correctly', function(){
        ST.component('page404')
            .visible()
            .and(function(el){
                expect(el.rendered).toBeTruthy();
            });
    });
    // comparing actual screen with expected screen
    it('make a screenshot', function () {
        Lib.screenshot('modern_page404');
    });
    // check if URL works
    it('ORION-567 - has working URL', function () {
        ST.element('page404 => a')
            .click();
        ST.component('panel[title=Network]')
            .visible()
            .and(function(el){
                expect(el).toBeDefined();
            });
    });
});
