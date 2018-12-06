/**
 * modern KS > Charts > 3D Column Charts > Grouped
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
describe("Grouped", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = '3D Column Grouped';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme'];
    var w, h;
    var graph_id;
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#column-grouped-3d", undefined, undefined, false)
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id = document['graph_id'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("column-grouped-3d");
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

        it('Transparency is present when mouseover', function(){
            ST.component('chart')
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 1.6 * w / 16, 90 * h / 100, undefined, undefined, 0);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 2.6 * w / 16, 50 * h / 100, undefined, undefined, [0,1]);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 5.6 * w / 16, 70 * h / 100, undefined, undefined, [1,0]);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 6.6 * w / 16, 20 * h / 100, undefined, undefined, [1,1]);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 14.6 * w / 16, 10 * h / 100, undefined, undefined, [3,1]);
                });
        });

        describe('Legend is working and always fill whole y-axis', function(){
            it('click inside legend and check if is chosen browser disabled after click and last one stays visible', function(){
                Lib.Chart.legend(desc, graph_id_main.replace('main', 'legend'), 250);
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.column3d.Grouped');
        })
    });
});