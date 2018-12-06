/**
 * modern KS > Charts > 3D Bar Charts > Negative Values
 * tested on:
 *          desktop:
 *              Chrome 61
 *              Firefox 53
 *              IE 11
 *              Edge 15
 *              Opera 45
 *          tablet:
 *              iOS 9, 10
 *              Edge 14
 *              Android 4.4, 7
 *          mobile:
 *              Android 5, 6, 7
 *              Edge
 *              iOS 9
 *          themes:
 *              Triton
 *              Neptune
 *              iOS
 *              Material
 *          Sencha Test:
 *              2.1.0.81
 */
describe("Negative Values", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = '3D Bar Negative Values';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ["Theme"];
    var w;
    var h;
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //other functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#bar-negative-3d")
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("bar-negative-3d");
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

        //green and red bars have to be controlled by screenshot, because it is value really hard to get
        it('When mouseover bar, than it become grey', function(){
            if(Lib.isDesktop) {
                ST.component('chart')
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 5 * w / 18, 9 * h / 24);
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 5 * w / 18, 11 * h / 24);
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 5 * w / 18, 13 * h / 24);
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 8 * w / 18, h / 24);
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 8 * w / 18, 3 * h / 24);
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 7.5 * w / 18, 23 * h / 24);
                    });
            }
            else{
                pending('This functionality is disabled for touch devices');
            }
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.bar3d.Negative');
        })
    });
});