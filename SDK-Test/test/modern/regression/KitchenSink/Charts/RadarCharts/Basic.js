/**
 * modern KS > Charts > Radar Charts > Basic
 * tested on:
 *          desktop:
 *              Chrome 59
 *              Firefox 54
 *              IE 11
 *              Edge 15
 *          tablet:
 *              Safari 10
 *              Android 4.4
 *              Windows 10 Edge
 *          mobile:
 *              Safari 9
 *              Android 4.4, 7
 *          Sencha Test:
 *              2.1.1.31
 */
describe("Basic", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Radar Basic';
    var prefix = '#kitchensink-view-chart-radar-basic';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme'];
    var graph_id_main;
    var chartType = prefix + ' polar';
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#radar-basic", chartType)
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("radar-basic");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore, chartType);
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc, chartType);
        });

        describe('Theme button is working properly', function () {
            Lib.Chart.themeComplex(desc, undefined, chartType);
        });

        it('Chart is rotatable', function(){
            Lib.Chart.rotate(desc, graph_id_main);
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.radar.Basic');
        })
    });
});