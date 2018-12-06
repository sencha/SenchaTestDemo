/**
 * modern KS > Charts > Bar Charts > Stacked
 * tested on:
 *          desktop:
 *              Chrome 61
 *              Firefox 53
 *              IE 11
 *              Edge 15
 *              Opera 45
 *          tablet:
 *              iOS 9, 10
 *              Edge 14
 *              Android 4.4, 7
 *          mobile:
 *              Android 5, 6, 7
 *              Edge
 *              iOS 9
 *          themes:
 *              Triton
 *              Neptune
 *              iOS
 *              Material
 *          Sencha Test:
 *              2.1.0.81
 */
describe("Stacked", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Bar Stacked';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme', 'Refresh'];
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#bar-stacked")
            .and(function(){
                dataFromStore = document['dataFromStore'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll(false, "bar-stacked", true);
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
            Lib.sourceClick('KitchenSink.view.chart.bar.Stacked');
        })
    });
});