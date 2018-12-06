/**
 * modern KS > Charts > Pie Charts > Donut
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
describe("Donut", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Pie Donut';
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
        Lib.Chart.beforeAll("#pie-donut", chartType)
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.afterAll("pie-donut");
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
                var fullWidth = 530;
                var componentWhereChartIs = chartType;

                var isHorizontal = true;
                if(Ext.first(componentWhereLegendIs).el.dom.clientWidth < Ext.first(componentWhereLegendIs).el.dom.clientHeight){
                    isHorizontal = false;
                }
                if(isHorizontal) {
                    ST.component(chartType)
                        .and(function(p){
                            p.getLegendStore().data.items[2].data.name = "iOS_ext__";
                            p.getLegendStore().commitChanges();
                        })
                        .and(function(){
                            Lib.Chart.legend(desc, componentWhereLegendIs, fullWidth, componentWhereChartIs);
                        })
                        .and(function(p){
                            p.getLegendStore().data.items[2].data.name = "iOS";
                            p.getLegendStore().commitChanges();
                        });
                }
                else{
                    var lines = 2;
                    var legendWidth = fullWidth;
                    var clientWidth = 0;
                    var clientHeight = 0;
                    var firstCoordinate = 0;
                    var distanceFromTop = 0;

                    ST.element(componentWhereLegendIs)
                    //set variables
                        .and(function (e) {
                            clientWidth = e.dom.clientWidth;
                            clientHeight = e.dom.clientHeight;
                            legendWidth /= lines;
                            firstCoordinate = ((clientWidth - legendWidth) / 2) + legendWidth/3;
                            distanceFromTop = clientHeight/2;
                        })
                        .and(function(){
                            //clicks are adapted to number of rows in legend
                            ST.element(componentWhereLegendIs)
                                .click(firstCoordinate, distanceFromTop - 60)
                                .click(firstCoordinate, distanceFromTop - 30)
                                .click(firstCoordinate, distanceFromTop)
                                .click(firstCoordinate, distanceFromTop + 30)
                                .click(firstCoordinate, distanceFromTop + 60);

                            //verify
                            ST.component(componentWhereChartIs)
                                .and(function(e){
                                    //because it is sorted by columns and not by lines, so sometimes it could happend, that not last is disabled, but one before.
                                    if(e.legendStore.data.items[e.legendStore.data.items.length-2].data.disabled) {
                                        expect(e.legendStore.data.items[e.legendStore.data.items.length - 1].data.disabled).toBe(false);
                                    }
                                });

                            ST.element(componentWhereLegendIs)
                                .click(firstCoordinate, distanceFromTop - 60)
                                .click(firstCoordinate, distanceFromTop - 30)
                                .click(firstCoordinate, distanceFromTop)
                                .click(firstCoordinate, distanceFromTop + 30)
                                .click(firstCoordinate, distanceFromTop + 60);

                            //verify
                            ST.component(componentWhereChartIs)
                                .and(function(e){
                                    expect(e.legendStore.data.items[e.legendStore.data.items.length - 1].data.disabled).toBe(true);
                                });

                            //restore to initial state
                            ST.element(componentWhereLegendIs)
                                .click(firstCoordinate, distanceFromTop + 60);

                            //verify
                            ST.component(componentWhereChartIs)
                                .and(function(e){
                                    expect(e.legendStore.data.items[e.legendStore.data.items.length-1].data.disabled).toBe(false);
                                });
                        })
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
                        Lib.Chart.mouseover(desc, graph_id_main, w/2 + r, h/2, 'Android: 68.3%');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main,  w/2 - r, h/2, 'iOS: 17.9%');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, w/2 - r/4, h/2 - 4/5*r, 'Windows Phone: 10.2%');
                    });
            }
            else{
                pending('Tooltips are disabled for touch devices');
            }
        });

        it('Chart is rotatable', function(){
            Lib.Chart.rotate(desc, graph_id_main, 70, 30);
        });

        it('Sector is getting bigger when mouseover / tap on it', function(){

            ST.component(chartType)
                .and(function (p) {
                    var r = p.getSeries()[0].getRadius() - 20;
                    Lib.Chart.biggerSector(chartType, w/2 + r, h/2, undefined, true, undefined, 20);
                });
        });

        it('Source click', function(){
            Lib.sourceClick('itchenSink.view.chart.pie.Donut');
        })
    });
});