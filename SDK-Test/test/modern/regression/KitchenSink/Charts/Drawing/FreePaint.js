/**
 * modern KS > Charts > Drawing > Free Paint
 * tested on:
 *          desktop:
 *              Chrome 54
 *              Firefox 45
 *              IE 11
 *              Edge 14
 *              Opera 40
 *          tablet:
 *              Safari 8, 9
 *              Android 6
 *          mobile:
 *              Android 4.4, 5, 6
 *              Windows 10 Edge
 *          themes:
 *              Triton
 *              Neptune
 *              iOS
 *              Material
 *          OS:
 *              Windows 10 (desktop, mobile)
 *              iOS 8, 9
 *              Android 4.4, 5,6
 *          Sencha Test:
 *              1.0.4.3
 */
describe("Free Paint", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Drawing Free Paint';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Clear'];
    var w, h;

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.beforeAll("#free-paint", 'free-paint');
        ST.component('[reference=drawComponent]')
            .and(function (c) {
                w = c.el.dom.clientWidth;
                h = c.el.dom.clientHeight;
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("free-paint");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        it('is rendered', function () {
            Lib.Chart.isRendered(desc, 'free-paint');
        });

        it('paint', function () {
            Lib.Chart.swipeZoom('[reference=drawComponent]', desc, 80, 80, w/4, 3*h/4, true);
            Lib.Chart.swipeZoom('[reference=drawComponent]', desc, 30, 10, 3*w/4, h/4, true);
            ST.button(Components.button(buttons[0]))
                .click();
        });

        describe('click on buttons', function () {
            it('Clear and check if canvas is cleared - has to be solved by screenshots', function () {
                Lib.Chart.swipeZoom('[reference=drawComponent]', undefined, 40, 60, w/4, 3*h/4, true);
                //screenshot should be the same - white
                ST.button(Components.button(buttons[0]))
                    .click();
                Lib.screenshot(desc + '_clearCanvas');
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.drawing.FreeDraw');
        })
    });
});