/**
 * modern KS > UI > Carousel
 * tested on:
 *          desktop:
 *              Chrome 51
 *              Firefox 45
 *              IE 11
 *              Edge 13
 *              Opera 38
 *          tablet:
 *          mobile:
 *          themes:
 *              Triton
 *              Material
 *              Neptun
 *              IOS
 *          OS:
 *              Windows 10
 *          Sencha Test:
 *              1.0.3.35
 */
describe("Basic", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var topHorizontalCarousel = "carousel[currentAxis=x]";


    var toolbar = "toolbar[id^=ext-toolbar]";
    var tabbar = "toolbar[id^=ext-tabbar]";

    //------------------------------------------------functions-------------------------------------------------------//

    //copy of function from library because of checking content
    function swipeElement (element, direction, carouselText, verticalMove) {
        var side = 'horizontally';
        if(verticalMove){
            side = 'vertically';
        }
        var directionString = direction==-1?'next':'prev';

        desc = 'Swipe ' + side + ' to the ' + directionString + ' slide and check text to contain text ' + carouselText;
        it(desc, function () {
            justSwipe(element, direction, verticalMove);
            //added to std. function
            ST.component(element).and(function(el) {
                ST.element(el.innerElement).and(function(body){
                    expect(body.dom.innerHTML).toContain(carouselText);
                });
            });
        });
    }
    //other functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.beforeAll("#carousel-basic", "carousel-basic");
    });
    afterAll(function(){
        Lib.afterAll("carousel-basic");
    });

    //------------------------------------------------tests-----------------------------------------------------------//

    var desc = 'Top horizontal carousel';
    describe(desc, function () {
        //from library, but it is not a panel - so panel is changed for component
        it(desc + ' is rendered', function () {
            ST.component(topHorizontalCarousel)
                .visible()
                .and(function (carousel) {
                    expect(carousel.rendered).toBeTruthy();
                });
        });

        swipeElement(topHorizontalCarousel, -1, 'You can also tap on');
        it('Go to last slide using navigator indicator and check text to contain Card #3', function () {
            var indicators = Ext.ComponentQuery.query('carousel[currentAxis=x] indicator')[0].indicators;
            ST.element('@' + indicators[2].getId()).click();
            //check Carousel text
            ST.component(topHorizontalCarousel).and(function(el) {
                ST.element(el.innerElement).and(function(body){
                    expect(body.dom.innerHTML).toContain('Card #3');
                });
            });
        });
        swipeElement(topHorizontalCarousel, 1, 'You can also tap on');
        swipeElement(topHorizontalCarousel, 1, 'Swipe left to show');
    });
});