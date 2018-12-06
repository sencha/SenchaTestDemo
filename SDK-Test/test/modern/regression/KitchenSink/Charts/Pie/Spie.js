/**
 * modern KS > Charts > Pie Charts > Spie
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
describe("Spie", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Pie Spie';
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
        Lib.Chart.beforeAll("#pie-custom", chartType)
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.afterAll("pie-custom");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore, chartType);
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc, chartType);
        });

        describe('Legend is working', function(){
            it('click inside legend and check if is chosen browser disabled after click and last one stays visible', function(){
                var componentWhereLegendIs = graph_id_main.replace('main', 'legend');
                var fullWidth = 480;
                var componentWhereChartIs = chartType;

                var isHorizontal = true;
                if(Ext.first(componentWhereLegendIs).el.dom.clientWidth < Ext.first(componentWhereLegendIs).el.dom.clientHeight){
                    isHorizontal = false;
                }
                if(Lib.isPhone || isHorizontal) {
                    ST.component(chartType)
                        .and(function(p){
                            p.getLegendStore().data.items[1].data.name = "iOS_ext__";
                            p.getLegendStore().data.items[2].data.name = "Windows";
                            p.getLegendStore().commitChanges();
                        })
                        .and(function(){
                            Lib.Chart.legend(desc, componentWhereLegendIs, fullWidth, componentWhereChartIs);
                        })
                        .and(function(p){
                            p.getLegendStore().data.items[1].data.name = "iOS";
                            p.getLegendStore().data.items[2].data.name = "Windows Phone";
                            p.getLegendStore().commitChanges();
                        });
                }
            });
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
                        Lib.Chart.mouseover(desc, graph_id_main, w/2 - r/3, h/2 + r/3, 'Android: 68.3%');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, w/2 + r/3, h/2 - r/4, 'iOS: 17.9%');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, w/2 + r/4, h/2 - 3*r/4, 'Windows Phone: 10.2%');
                    });
            }
            else{
                pending('Tooltips are disabled for touch devices');
            }
        });

        it('Sector is getting bigger when mouseover / tap on it', function(){
            var x;
            if(w > h) {
                x = w / 2 - 0.25 * h;
            }
            else{
                x = w / 2 - 0.25 * w;
            }
            var y = h/2;
            Lib.Chart.biggerSector(chartType, x, y, undefined, true);
        });

        it('Chart is rotatable', function(){
            Lib.Chart.rotate(desc, graph_id_main);
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.pie.Custom');
        })
    });
});