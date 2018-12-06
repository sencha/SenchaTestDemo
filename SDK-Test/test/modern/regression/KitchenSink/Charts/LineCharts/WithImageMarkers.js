/**
 * modern KS > Charts > Line Charts > With Image Markers
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
 *
 *              EXTJS-25462
 */
describe("With Image Markers", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Line With Image Markers';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme', 'Refresh', 'Reset pan/zoom', 'Pan', 'Zoom'];
    if(Lib.isPhone){
        buttons[2] = "Reset";
    }
    var w;
    var h;
    var graph_id;
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //other functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#line-markers")
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id = document['graph_id'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("line-markers");
    });
    //------------------------------------------------tests-----------------------------------------------------------//


    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore);
        });

        it('Chart is rendered ', function () {
            Lib.Chart.isRendered(desc);
        });

        describe('Legend is working and always fill whole y-axis', function(){
            it('click inside legend and check if is chosen fruit disabled after click and last one stays visible', function(){
                Lib.Chart.legend(desc, graph_id_main.replace('main', 'legend'), 250);
            });
        });

        describe('Theme button is working properly', function () {
            Lib.Chart.themeComplex(desc);
        });

        it('Refresh button is working properly', function () {
            Lib.Chart.refreshComplex(desc, dataFromStore);
        });

        it('Reset pan/zoom button is working properly', function () {
            var zoom;
            ST.component('chart')
                .and(function(b){
                    zoom = b.getAxes()[1].getVisibleRange()[1];
                    expect(zoom).not.toBe(1);
                });
            ST.button(Components.button(buttons[2]))
                .click();
            ST.component('chart')
                .wait(function(b){
                    zoom = b.getAxes()[1].getVisibleRange()[1];
                    return zoom === 1;
                })
                .and(function(b){
                    //max axisY
                    zoom = b.getAxes()[0].getVisibleRange()[1];
                    expect(zoom).toBe(1);
                    //max axisX
                    zoom = b.getAxes()[1].getVisibleRange()[1];
                    expect(zoom).toBe(1);
                })
        });

        describe('Pan / Zoom works (buttons on desktop) '+((Ext.supports.Touch && Ext.platformTags.desktop)?' - EXTJS-25462':''), function () {
            it('Click on button and check if correct button is visible and selected', function () {
                Lib.Chart.panZoomButtons();
            });

            it('Pan - control by screenShot', function () {
                Lib.Chart.pan(desc, graph_id, 1, false, false, buttons[4]);
            });

            it('Zoom - control by screenShot', function () {
                Lib.Chart.zoom(desc, graph_id, 1, false, false, buttons[4]);
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.line.ImageMarkers');
        })
    });
});