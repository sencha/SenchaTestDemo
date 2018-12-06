/**
 * modern KS > Charts > 3D Column Charts > Negative Values
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
describe("Negative Values", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = '3D Column Negative Values';
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
        Lib.Chart.beforeAll("#column-negative-3d", undefined, undefined, false)
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("column-negative-3d");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore);
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc);
        });

        it('Positive values are green', function () {
            ST.component('chart')
                .and(function(c){
                    for(var i = 0; i < c.getStore().data.items.length; i++){
                        if(c.getStore().data.items[i].data.gaming > 0){
                            expect(c.getSeries()[0].getSurface().getItems()[1].instances[i].fillStyle).toBe('#94ae0a');
                        }
                    }
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 5 * w / 24.5, 7.5 * h / 17.5, undefined, undefined, 2, '#94ae0a');
                })
        });

        it('Negative values are red', function () {
            ST.component('chart')
                .and(function(c){
                    for(var i = 0; i < c.getStore().data.items.length; i++){
                        if(c.getStore().data.items[i].data.gaming < 0){
                            expect(c.getSeries()[0].getSurface().getItems()[1].instances[i].fillStyle).toBe('#974144');
                        }
                    }
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 13 * w / 24.5, 17 * h / 17.5, undefined, undefined, 6, '#974144');
                })
        });

        describe('Theme button is working properly', function () {
            Lib.Chart.themeComplex(desc);
        });

        it('Transparency is present when mouseover', function(){
            ST.component('chart')
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 1 * w / 24.5, 10.5 * h / 17.5, undefined, undefined, 0);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 5 * w / 24.5, 7.5 * h / 17.5, undefined, undefined, 2);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 11 * w / 24.5, 13.5 * h / 17.5, undefined, undefined, 5);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 13 * w / 24.5, 17 * h / 17.5, undefined, undefined, 6);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 21 * w / 24.5, 6 * h / 17.5, undefined, undefined, 10);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 23 * w / 24.5, 2 * h / 17.5, undefined, undefined, 11);
                });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.column3d.Negative');
        })
    });
});