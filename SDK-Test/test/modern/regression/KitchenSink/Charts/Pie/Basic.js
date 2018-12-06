/**
 * modern KS > Charts > Pie Chart > Basic
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
describe("Basic", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Pie Basic';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme', 'Refresh'];
    var chartType = 'polar';
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        dataFromStore = [];

        Lib.Chart.beforeAll("#pie-basic", chartType)
            .and(function(){
                dataFromStore = document['dataFromStore'];
            });
    });

    afterAll(function () {
        Lib.afterAll("pie-basic");
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

        it('Refresh button is working properly', function () {
            Lib.Chart.refreshComplex(desc, dataFromStore, undefined, chartType);
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.pie.Pie');
        })
    });

});