/**
 * modern KS > Charts > Column Charts > With Renderer
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
describe("With Renderer", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = '3D Column With Render';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var w;
    var h;
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//
    
    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#column-renderer-3d")
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("column-renderer-3d");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore);
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc);
        });

        it('Columns are blue when mouseover', function () {
            ST.component('chart')
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 1 * w / 24.5, 47 * h / 48.5, undefined, undefined, 0, '#2b82ba');
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 11 * w / 24.5, 24 * h / 48.5, undefined, undefined, 5, '#2b82ba');
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 23 * w / 24.5, 8.5 * h / 48.5, undefined, undefined, 11, '#2b82ba');
                })
        });

        it('Drag&Drop provide zoom', function(){
            if(Lib.isDesktop) {
                var iterations = 2;

                //Zoom and check
                for (var i = 0; i < iterations; i++) {
                    ST.component('chart')
                        .and(function () {
                            Lib.Chart.swipeZoom(graph_id_main, desc, 20, 80);
                        });
                    Lib.waitOnAnimations();
                    ST.component('chart')
                        .and(function (el) {
                            //I don't know how to detect zoom better
                            expect(el.getInteractions()[0].startX).toBeGreaterThan(0);
                        })
                }

                //Undo zoom
                for (i = 0; i < iterations; i++) {
                    ST.component('chart')
                        .and(function (el) {
                            Lib.Chart.swipeZoom(graph_id_main, desc, 80, 20);
                            Lib.waitOnAnimations();
                            //I don't know how to detect zoom better
                            expect(el.getInteractions()[0].startX).toBeGreaterThan(0);
                        });
                }
            }
            else{
                pending('Pinch2Zoom is not supported in ST');
            }
        });

        it('Transparency is present when mouseover (Tooltip is present for desktop only)', function(){
            ST.component('chart')
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 1 * w / 24.5, 47 * h / 48.5, 'Jan: 35%', undefined, 0);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 11 * w / 24.5, 24 * h / 48.5, 'Jun: 42%', undefined, 5);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 23 * w / 24.5, 8.5 * h / 48.5, 'Dec: 47%', undefined, 11);
                })
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.column3d.Renderer');
        })
    });
});