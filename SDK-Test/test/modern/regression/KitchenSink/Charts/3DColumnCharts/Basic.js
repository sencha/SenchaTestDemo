/**
 * modern KS > Charts > 3D Column Charts > Basic
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
describe("Basic", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = '3D Column Basic';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme', 'Refresh'];
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#column-basic-3d", undefined, undefined, false)
            .and(function(){
                dataFromStore = document['dataFromStore'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("column-basic-3d");
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

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.column3d.Column');
        })
    });
});