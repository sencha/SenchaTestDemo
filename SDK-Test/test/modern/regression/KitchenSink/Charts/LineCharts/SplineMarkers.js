/**
 * modern KS > Charts > Line Charts > Spline + Markers
 * tested on:
 *          desktop:
 *              Chrome 53
 *              Firefox 54
 *              IE 11
 *              Edge 15
 *              Opera 46
 *          tablet:
 *              Safari 10
 *              Android 4.4, 5.0, 6.0, 7.1
 *              Edge 14
 *          mobile:
 *              Safari 9, 10
 *              Edge 15
 *              Android 4.4, 6.0, 7.0
 *
 *          Sencha Test:
 *              2.1.1.31
 */
describe("Spline + Markers", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Line Spline + Markers';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme'];
    var dataFromStore = [];
    var w;
    var h;
    var graph_id_main;

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#line-marked-spline")
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("line-marked-spline");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore);
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc);
        });

        describe('Legend is working and always fill whole y-axis', function(){
            it('click inside legend and check if is chosen fruit disabled after click and last one stays visible', function(){
                Lib.Chart.legend(desc, graph_id_main.replace('main', 'legend'), 170);
            });
        });

        describe('Theme button is working properly', function () {
            Lib.Chart.themeComplex(desc);
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.line.MarkedSpline');
        })
    });
});