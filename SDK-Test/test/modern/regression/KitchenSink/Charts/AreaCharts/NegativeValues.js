/**
 * modern KS > Charts > Area Charts > Negative Values
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
describe("Negative Values", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Negative Values';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ["Theme"];
    var w;
    var h;
    var leftAxesRange;
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //other functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#area-negative")
            .and(function(c){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];

                leftAxesRange = c.getAxes()[0].oldRange;
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("area-negative");
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

        it('Tooltip on each line in chart is provided - text and dot on line - Edge EXTJS-25404', function(){
            ST.component('chart')
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 0, (leftAxesRange[1]+7)*h/(leftAxesRange[1] - leftAxesRange[0]), 'Q1 2012: -7', 'Corporate and Other');
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 2*w/11, (leftAxesRange[1]-5)*h/(leftAxesRange[1] - leftAxesRange[0]), 'Q3 2012: 5', 'Gaming Hardware');
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 8*w/11, (leftAxesRange[1]-6)*h/(leftAxesRange[1] - leftAxesRange[0]), 'Q1 2014: 6', 'Consumer Licensing');
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 10*w/11, (leftAxesRange[1]-12)*h/((leftAxesRange[1] - leftAxesRange[0])), 'Q3 2014: 12', 'Phone Hardware');
                });
        });

        describe('Legend is working and y-axis adaptates', function(){
            it('click inside legend and check if is chosen fruit disabled after click and last one stays visible', function(){
                Lib.Chart.legend(desc, graph_id_main.replace('main', 'legend'), 613);
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.area.Area');
        })
    });
});