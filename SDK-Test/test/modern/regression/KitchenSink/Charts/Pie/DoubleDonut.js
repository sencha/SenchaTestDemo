/**
 * modern KS > Charts > Pie Charts > Double Donut
 * tested on:
 *          desktop:
 *              Chrome 59
 *              Firefox 54
 *              IE 11
 *              Edge 15
 *              Opera 46
 *          tablet:
 *              Safari 10
 *              Android 4.4, 5.0, 7.0
 *              Edge 14
 *          mobile:
 *              Safari 9
 *              Edge 15
 *              Android 6.0, 7.0
 *          Sencha Test:
 *              2.1.1.31
 */
describe("Double Donut", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Pie Double Donut';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme'];
    var chartType = 'polar';
    var w, h;
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#pie-double-donut", chartType)
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.afterAll("pie-double-donut");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore, chartType);
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc, chartType);
        });

        describe('Theme button is working properly', function () {
            Lib.Chart.themeComplex(desc, undefined, chartType);
        });

        it('Tooltip is provided by mouseover / tap', function(){
            if(Lib.isDesktop) {
                var r;
                ST.component(chartType)
                    .and(function (p) {
                        r = p.getSeries()[0].getRadius() - 2;
                        Lib.Chart.mouseover(desc, graph_id_main, w/2 - r, h / 2, 'VMWare: 380');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, w/2 + r, h / 2, 'Amazon: 370');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, w/2 - r/3, h / 2, 'Private sector: 380');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, w/2 + r/3, h / 2, 'Public sector: 620');
                    });
            }
            else{
                pending('Tooltips are disabled for touch devices');
            }
        });

        it('Outside sector is getting bigger when mouseover / tap on it', function(){
            ST.component(chartType)
                .and(function (p) {
                    var r = p.getSeries()[0].getRadius() - 2;

                    var x = w/2 - r;
                    var y = h/2;
                    Lib.Chart.biggerSector(chartType, x, y, 4, true, undefined, -10);

                    x = w/2 + r;
                    Lib.Chart.biggerSector(chartType, x, y, 0, true, undefined, +10);

                });
        });

        it('Chart is rotatable', function(){
            Lib.Chart.rotate(desc, graph_id_main, 80, 20);
        });

        it('Source click', function(){
            Lib.sourceClick('itchenSink.view.chart.pie.Donut');
        })
    });
});