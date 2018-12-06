/**
 * modern KS > Charts > Column Charts > Stacked
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
 *
 *              bug for touchscreen / Edge tablet - EXTJS-25462
 */
describe("Stacked", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Column Stacked';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme', 'Refresh', 'Group', 'Stack', 'Pan', 'Zoom'];
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#column-stacked", undefined, undefined, false)
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("column-stacked");
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

        it('Refresh button is working properly', function () {
            Lib.Chart.refreshComplex(desc, dataFromStore);
        });

        describe('Group button is working properly ', function() {
            it('Group - check if stacked, click, check if grouped, click, check if stacked again', function () {
                Lib.Chart.group(desc);
            });
        });

        describe('Pan / Zoom works (buttons on desktop) '+((Ext.supports.Touch && Ext.platformTags.desktop)?' - EXTJS-25462':''), function () {
            it('Click on button and check if correct button is visible and selected', function () {
                Lib.Chart.panZoomButtons();
            });

            it('Pan - control by screenShot', function () {
                Lib.Chart.pan(desc, graph_id_main, 1, false, false, buttons[5]);
            });

            it('Zoom - control by screenShot', function () {
                Lib.Chart.zoom(desc, graph_id_main, 1, false, false, buttons[5]);
            });
        });

        describe('Legend is working and y-axis adaptates', function(){
            it('click inside legend and check if is chosen browser disabled after click and last one stays visible', function(){
                Lib.Chart.legend(desc, graph_id_main.replace('main', 'legend'), 420);
            });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.column.Stacked');
        })
    });
});