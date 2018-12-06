/**
 * modern KS > Charts > Financial Charts > OHLC
 * tested on:
 *          desktop:
 *              Chrome 59
 *              Firefox 54
 *              IE 11
 *              Edge 15
 *              Opera 46
 *          tablet:
 *              Safari 10
 *              Android 4.4, 5.0
 *              Windows 10 Edge 14
 *          mobile:
 *              Android 4.4, 5.0, 6.0, 7
 *              Safari 9, 10
 *              Windows Phone 10 Edge 15
 *          themes:
 *              Triton
 *              Neptune
 *              iOS
 *              Material
 *          Sencha Test:
 *              2.1.1.31
 */
describe("Financial", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Financial OHLC';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Pan', 'Zoom'];
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#financial-ohlc")
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("financial-ohlc");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore);
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc);
        });

        describe('Pan / Zoom works (buttons on desktop)', function () {
            it('Click on button and check if correct button is visible and selected', function () {
                Lib.Chart.panZoomButtons();
            });

            it('Pan - control by screenShot', function () {
                Lib.Chart.pan( desc, graph_id_main, -1, false, true);
            });

            it('Zoom <--> control by screenShot', function () {
                ST.button(Components.button(buttons[1]))
                    .click();
                Lib.Chart.zoom(desc, graph_id_main, 1, false, false, buttons[1]);
                ST.button(Components.button(buttons[0]))
                    .click();
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.financial.OHLC');
        })
    });
});