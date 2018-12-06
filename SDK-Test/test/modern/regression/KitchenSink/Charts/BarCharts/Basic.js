/**
 * modern KS > Charts > Bar Charts > Basic
 * tested on:
 *          desktop:
 *              Chrome 61
 *              Firefox 53
 *              IE 11
 *              Edge 15
 *              Opera 45
 *          tablet:
 *              iOS 10
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
describe("Basic", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Bar Basic';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme'];
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#bar-basic")
            .and(function(){
                dataFromStore = document['dataFromStore'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("bar-basic", true);
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

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.bar.Basic');
        })
    });
});