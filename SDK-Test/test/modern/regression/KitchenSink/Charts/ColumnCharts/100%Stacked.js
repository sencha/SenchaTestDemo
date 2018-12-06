/**
 * modern KS > Charts > Column Charts > 100% Stacked
 * tested on:
 *          desktop:
 *              Chrome 59
 *              Firefox 54
 *              IE 11
 *              Edge 15
 *          tablet:
 *              Safari 10
 *              Android 4.4, 5.0
 *              Edge 14
 *          mobile:
 *              Safari 9
 *              Edge 15
 *              Android 5,6,7
 *          themes:
 *              Triton
 *              Neptune
 *              iOS
 *              Material
 *          Sencha Test:
 *              2.1.1.27
 */
describe("100% Stacked", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Column 100% Stacked';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme'];
    var w, h;
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#column-stacked-100")
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("column-stacked-100");
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

        it('Tooltip is present', function(){
            if(Lib.isDesktop) {
                ST.component('chart')
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 1 * w / 16, 95 * h / 100, 'Toyota in 2006: 28.4%');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 3 * w / 16, 60 * h / 100, 'GM');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 7 * w / 16, 40 * h / 100, 'Volkswagen');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 13 * w / 16, 20 * h / 100, 'Hyundai');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 15 * w / 16, 5 * h / 100, 'Ford in 2013: 9.5%');
                    });
            }
            else{
                pending('Tooltips are disabled for touch devices');
            }
        });

        describe('Legend is working and always fill whole y-axis', function(){
            it('click inside legend and check if is chosen browser disabled after click and last one stays visible', function(){
                Lib.Chart.legend(desc, graph_id_main.replace('main', 'legend'), 410);
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.column.Stacked100');
        })
    });
});