/**
 * modern KS > Charts > 3D Bar Charts > 100% Stacked
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
describe("100% Stacked", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = '3D Bar 100% Stacked';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme'];
    var w;
    var h;
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#bar-stacked-100-3d")
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("bar-stacked-100-3d");
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

        it('Transparency is present when mouseover (Tooltip is present for desktop)', function(){
            ST.component('chart')
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 5 * w / 100, 23 * h / 24, 'IE on Jan: 20%');
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 3 * w / 10, 21 * h / 24, 'Firefox on Feb: 37%');
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 7 * w / 10, 19 * h / 24, 'Chrome on Mar: 37%');
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 95 * w / 100, 17 * h / 24, 'Safari on Apr: 5%');
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 99 * w / 100, h / 24, 'Others on Dec: 3%');
                });
        });

        describe('Legend is working and always fill whole x-axis', function(){
            it('click inside legend and check if is chosen browser disabled after click and last one stays visible', function(){
                Lib.Chart.legend(desc, graph_id_main.replace('main', 'legend'), 340);
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.bar3d.Stacked');
        })
    });
});