/**
 * modern KS > UI > Carousel
 * tested on:
 *          desktop:
 *              Chrome 58
 *              Firefox 53
 *              IE 11
 *              Edge 14
 *          tablet:
 *              iOS 10
 *              Android 5
 *          mobile:
 *              iOS 9
 *              Android 6
 *          themes:
 *              Triton
 *              Material
 *              Neptune
 *              IOS
 *          OS:
 *              Windows 10
 *          Sencha Test:
 *              1.0.3.35
 *              2.1.0.18
 */
describe("Carousel", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var bottomVerticalCarousel = "carousel[currentAxis=y]";


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
        Lib.beforeAll("#carousel-vertical", "carousel-vertical");
    });
    afterAll(function(){
        Lib.afterAll("carousel-vertical");
    });

    //------------------------------------------------tests-----------------------------------------------------------//

    var desc = 'Bottom vertical carousel';
    describe(desc, function () {
        //from library, but it is not a panel - so panel is changed for component
        it(desc + ' is rendered', function () {
            ST.component(bottomVerticalCarousel)
                .visible()
                .and(function (carousel) {
                    expect(carousel.rendered).toBeTruthy();
                });
        });
        swipeElement(bottomVerticalCarousel, -1, 'And can also', true);
        it(desc + ' use navigator', function () {
            var indicators = Ext.ComponentQuery.query('carousel[currentAxis=y] indicator')[0].indicators;
            ST.element('@' + indicators[2].getId()).click();
            //check Carousel text
            ST.component(bottomVerticalCarousel).and(function(el) {
                ST.element(el.innerElement).and(function(body){
                    expect(body.dom.innerHTML).toContain('Card #3');
                });
            });
        });
        swipeElement(bottomVerticalCarousel, 1, 'And can also use', true);
        swipeElement(bottomVerticalCarousel, 1, 'Carousels can also be vertical', true);
    });
});