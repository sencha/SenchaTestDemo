/**
 * modern KS > Charts > Navigator > Line Chart
 * tested on:
 *          desktop:
 *              Chrome 53
 *              Firefox 54
 *              IE 11
 *              Edge 15
 *              Opera 46
 *          tablet:
 *              Safari 10
 *              Android 4.4, 5.0, 7.1
 *              Edge 14
 *          mobile:
 *              Safari 9, 10
 *              Edge 15
 *              Android 4.4, 6.0, 7.0
 *
 *          Sencha Test:
 *              2.1.1.31
 *
 *              EXTJS-25462
 */
describe("Line Chart", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Navigator Line Chart';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme', 'Pan', 'Zoom'];
    var w;
    var h;
    var graph_id, graph_id2, graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //other functions in file libraryFunctions.js
    function ddAndCheck(graphId, startX, endX, isZoom){
        var xMaxRange;
        var yMaxRange;
        var range;
        ST.component('chart:first')
            .and(function (ch) {
                if(isZoom){
                    xMaxRange = ch.getSeries()[0].getXAxis().getVisibleRange()[0];
                    range = ch.getAxes()[1].getVisibleRange()[1] - ch.getAxes()[1].getVisibleRange()[0];
                    range = Math.round(range * 100)/100;
                }
                else{
                    xMaxRange = ch.getSeries()[0].getXAxis().getVisibleRange()[1];
                }
                xMaxRange = Math.round(xMaxRange * 100)/100;
                yMaxRange = ch.getSeries()[0].getYAxis().getVisibleRange()[0];
                yMaxRange = Math.round(yMaxRange * 100)/100;

                Lib.Chart.swipeZoom(graphId, desc, startX, endX);
            });
        Lib.waitOnAnimations();
        ST.component('chart:first')
            .and(function (ch) {
                var temp;
                if(isZoom){
                    var range2 = ch.getAxes()[1].getVisibleRange()[1] - ch.getAxes()[1].getVisibleRange()[0];
                    range2 = Math.round(range2 * 100)/100;
                    temp = ch.getSeries()[0].getXAxis().getVisibleRange()[0];
                    expect(temp).toBeLessThan(xMaxRange);
                    expect(range2).toBeGreaterThan(range);

                }
                else{
                    temp = ch.getSeries()[0].getXAxis().getVisibleRange()[1];
                    temp = Math.round(temp * 100)/100;
                }
                expect(temp).toBeLessThan(xMaxRange);
                expect(ch.getSeries()[0].getYAxis().getVisibleRange()[0]).toBe(yMaxRange);
                Lib.Chart.swipeZoom(graphId, desc, endX, startX);
            });
        Lib.waitOnAnimations();
        ST.component('chart:first')
            .and(function (ch) {
                var temp;
                if(isZoom){
                    temp = ch.getSeries()[0].getXAxis().getVisibleRange()[0];
                    temp = Math.round(temp * 100)/100;
                    var range2 = ch.getAxes()[1].getVisibleRange()[1] - ch.getAxes()[1].getVisibleRange()[0];
                    range2 = Math.round(range2 * 100)/100;
                    expect(range2).toBe(range);
                }
                else{
                    temp = ch.getSeries()[0].getXAxis().getVisibleRange()[1];
                    temp = Math.round(temp * 100)/100;
                }
                expect(temp).toBe(xMaxRange);
                temp = ch.getSeries()[0].getYAxis().getVisibleRange()[0];
                temp = Math.round(temp * 100)/100;
                expect(temp).toBe(yMaxRange);
            })
    }

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#navigator-line", "chart:first")
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id = document['graph_id'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });

        ST.component('chart:last')
            .and(function (ch) {
                graph_id2 = '#' + ch.el.id + '-overlay';
            });

    });

    afterAll(function () {
        Lib.afterAll("navigator-line");
    });
    //------------------------------------------------tests-----------------------------------------------------------//


    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore, 'chart:first');
        });

        it('Chart is rendered ', function () {
            Lib.Chart.isRendered(desc, 'chart:first');
        });

        it('Legend is working', function(){
            var componentWhereLegendIs = graph_id + '-legend';
            var fullWidth = 70;
            var componentWhereChartIs = 'chart:first';

            var isHorizontal = true;
            if(Ext.first(componentWhereLegendIs).el.dom.clientWidth < Ext.first(componentWhereLegendIs).el.dom.clientHeight){
                isHorizontal = false;
            }
            if(Lib.isPhone || isHorizontal) {
                Lib.Chart.legend(desc, componentWhereLegendIs, fullWidth, componentWhereChartIs);
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
                        firstCoordinate = ((clientWidth - legendWidth) / 2) + legendWidth/2;
                        distanceFromTop = clientHeight/2;
                    })
                    .and(function(){
                        //clicks are adapted to number of rows in legend
                        ST.element(componentWhereLegendIs)
                            .click(firstCoordinate, distanceFromTop - 12)
                            .click(firstCoordinate, distanceFromTop + 12);

                        //verify
                        ST.component(componentWhereChartIs)
                            .and(function(e){
                                //because it is sorted by columns and not by lines, so sometimes it could happend, that not last is disabled, but one before.
                                if(e.legendStore.data.items[e.legendStore.data.items.length-2].data.disabled) {
                                    expect(e.legendStore.data.items[e.legendStore.data.items.length - 1].data.disabled).toBe(false);
                                }
                            });

                        ST.element(componentWhereLegendIs)
                            .click(firstCoordinate, distanceFromTop - 12)
                            .click(firstCoordinate, distanceFromTop + 12);

                        //verify
                        ST.component(componentWhereChartIs)
                            .and(function(e){
                                expect(e.legendStore.data.items[e.legendStore.data.items.length - 1].data.disabled).toBe(true);
                            });

                        //restore to initial state
                        ST.element(componentWhereLegendIs)
                            .click(firstCoordinate, distanceFromTop + 10);

                        //verify
                        ST.component(componentWhereChartIs)
                            .and(function(e){
                                expect(e.legendStore.data.items[e.legendStore.data.items.length-1].data.disabled).toBe(false);
                            });
                    })
            }
        });

        describe('Theme button is working properly', function () {
            Lib.Chart.themeComplex(desc, undefined, 'chart:first');
        });

        it('Chart is movable to side (by x-axis)', function(){
            ddAndCheck(graph_id, 20, 80);
        });

        it('Chart is movable by window over chart preview under the chart', function(){
            ddAndCheck(graph_id2, 90, 10);
        });

        it('Chart is changing its width by changing window width under that chart', function(){
            ddAndCheck(graph_id2, 80, 0.001, true);
        });

        describe('Pan / Zoom works (buttons on desktop) '+((Ext.supports.Touch && Ext.platformTags.desktop)?' - EXTJS-25462':''), function () {
            it('Click on button and check if correct button is visible and selected', function () {
                Lib.Chart.panZoomButtons();
            });

            it('Pan - control by screenShot', function () {
                Lib.Chart.pan(desc, graph_id, 1, false, false, buttons[2]);
            });

            it('Zoom - control by screenShot', function () {
                Lib.Chart.zoom(desc, graph_id, 1, false, false, buttons[2]);
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.navigator.Line');
        })
    });
});