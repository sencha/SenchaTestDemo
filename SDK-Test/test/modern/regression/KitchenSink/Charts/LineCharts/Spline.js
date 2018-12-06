/**
 * modern KS > Charts > Line Charts > Spline
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
 */
describe("Spline", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Line Spline';
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#line-spline", undefined, undefined, false)
            .and(function(){
                dataFromStore = document['dataFromStore'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("line-spline");
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
            Lib.sourceClick('KitchenSink.view.chart.line.Spline');
        })
    });
});