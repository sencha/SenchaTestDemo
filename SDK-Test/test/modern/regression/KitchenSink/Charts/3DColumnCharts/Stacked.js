/**
 * modern KS > Charts > 3D Column Charts > Stacked
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
 *
 */
describe("Stacked", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = '3D Column Stacked';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme', 'Group', 'Stack'];
    var graph_id, w, h;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#column-stacked-3d", undefined, undefined, false)
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id = document['graph_id'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("column-stacked-3d");
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

        describe('Group (Stack) button is working properly ', function() {
            it('Group - check if stacked, click, check if grouped, click, check if stacked again', function () {
                Lib.Chart.group(desc);
            });
        });

        it('Transparency is present when mouseover (Tooltip is present for desktop only)', function(){
            ST.component('chart')
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 1 * w / 10, 20 * h / 170, 'Services: 12,500,746 (millions of USD)', undefined, [0,3]);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 3 * w / 10, 167 * h / 170, 'Agriculture: 918,138 (millions of USD)', undefined, 1);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 5 * w / 10, 154 * h / 170, 'Industry: 1,640,091 (millions of USD)', undefined, [2,1]);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 7 * w / 10, 150 * h / 170, 'Services: 1,910,915 (millions of USD)', undefined, [3,2]);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 9 * w / 10, 145 * h / 170, 'Services: 1,215,198 (millions of USD)', undefined, [4,3]);
                });
        });

        describe('Legend is working and y-axis adaptates', function(){
            it('click inside legend and check if is chosen browser disabled after click and last one stays visible', function(){
                Lib.Chart.legend(desc, graph_id_main.replace('main', 'legend'), 280);
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.column3d.Stacked');
        })
    });
});