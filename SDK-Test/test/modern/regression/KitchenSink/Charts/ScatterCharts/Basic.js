/**
 * modern KS > Charts > Scatter Charts > Basic
 * tested on:
 *          desktop:
 *              Chrome 59
 *              Firefox 54
 *              IE 11
 *              Edge 15
 *              Opera 46
 *          tablet:
 *              Safari 10
 *              Android 4.4
 *          mobile:
 *              Safari 9
 *              Windows 10 Edge
 *              Android 6
 *          Sencha Test:
 *              2.2.0.60
 */
describe("Basic", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Scatter Basic';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Refresh', "Theme"];
    var w, h, graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#scatter-basic")
            .and(function(){
                    dataFromStore = document['dataFromStore'];
                    graph_id_main = document['graph_id_main'];
                    w = document['w'];
                    h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("scatter-basic");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore);
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc);
        });

        describe('Theme button is working properly', function () {
            Lib.Chart.themeComplex(desc);
        });

        it('Refresh button is working properly', function () {
            Lib.Chart.refreshComplex(desc, dataFromStore);
        });

        describe('Legend is working and always fill whole y-axis', function(){
            it('click inside legend and check if is chosen g disabled after click and last one stays visible', function(){
                Lib.Chart.legend(desc, graph_id_main.replace('main', 'legend'), 100);
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.scatter.Scatter');
        })
    });
});