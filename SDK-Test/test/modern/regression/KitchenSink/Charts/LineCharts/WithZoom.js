/**
 * modern KS > Charts > Line Charts > With Zoom
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
describe("With Zoom", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Line With Zoom';
    var dataFromStore = [];
    var buttons = ["Theme", 'Undo Zoom'];
    var w, h;
    var graph_id_main;

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#line-crosszoom", undefined, undefined, false)
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("line-crosszoom");
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

        it('Drag and Drop creates rectangle and zoom chart', function(){
            //Ext.first('chart').getInteractions()[0].zoomHistory
            var iterations = 2;
            var counter = 1;

            //Zoom and check
            for(var i = 0; i < iterations;i++) {
                ST.component('chart')
                    .and(function (el) {
                        Lib.Chart.swipeZoom(graph_id_main, desc, 20);
                        Lib.waitOnAnimations();
                        expect(el.getInteractions()[0].zoomHistory.length === counter);
                        counter++;
                    })
            }

            counter = 1;
            //Undo zoom
            for(i = 0; i < iterations;i++) {
                ST.component('chart')
                    .and(function(el){
                        el.getInteractions()[0].undoZoom();
                        Lib.waitOnAnimations();
                        expect(el.getInteractions()[0].zoomHistory.length === (iterations - counter));
                        counter++;
                    });
            }
        });

        it('Doubleclick / Doubletap unzoom chart', function(){
            var iterations = 2;
            var counter = 1;

            //Zoom and check
            for(var i = 0; i < iterations;i++) {
                ST.component('chart')
                    .and(function (el) {
                        Lib.Chart.swipeZoom(graph_id_main, desc, 80, 20);
                        Lib.waitOnAnimations();
                        expect(el.getInteractions()[0].zoomHistory.length === counter);
                        counter++;
                    })
            }

            counter = 1;
            for(i = 0; i < iterations;i++) {
                Lib.Chart.doubleClick(graph_id_main);
                Lib.waitOnAnimations();
                ST.component('chart')
                    .and(function (el) {
                        expect(el.getInteractions()[0].zoomHistory.length === (iterations - counter));
                        counter++;
                    });
            }
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.line.CrossZoom');
        })
    });
});