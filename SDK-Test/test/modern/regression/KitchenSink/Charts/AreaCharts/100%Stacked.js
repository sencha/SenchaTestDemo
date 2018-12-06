/**
 * modern KS > Charts > Area Charts > 100% Stacked
 * tested on:
 *          desktop:
 *              Chrome 59
 *              IE 11
 *              Edge 15
 *              Opera 45
 *              Firefox 53
 *          tablet:
 *              Android 6
 *              iPad 10
 *          mobile:
 *              Android 4.4, 7
 *              iPhone 9
 *              Edge
 *          themes:
 *              Triton
 *              Neptune
 *              iOS
 *              Material
 *          Sencha Test:
 *              2.1.0.81
 *
 *              IE11 - ORION-1897
 *              Edge - EXTJS-25404
 */
describe("100% Stacked", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Area 100% Stacked';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ["Theme"];
    var w;
    var h;
    var graph_id;
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //other functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#area-stacked-100")
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id = document['graph_id'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("area-stacked-100", true);
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

        describe('Legend is working and always fill whole y-axis', function(){
            it('click inside legend and check if is chosen fruit disabled after click and last one stays visible', function(){
                Lib.Chart.legend(desc, graph_id_main.replace('main', 'legend'), 340);
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.area.Area');
        })
    });
});