/**
 * modern KS > Charts > Area Charts > Basic
 * tested on:
 *          desktop:
 *              Chrome 53
 *              Firefox 45
 *              IE 11
 *              Edge 14
 *              Opera 39
 *          tablet:
 *              Safari 7, 9, 10
 *              Android 5,6
 *          mobile:
 *              Safari 10
 *          themes:
 *              Triton
 *              Neptune
 *              iOS
 *              Material
 *          OS:
 *              Windows 10 (desktop, mobile)
 *              iOS 7, 9, 10
 *              Android 5,6
 *          Sencha Test:
 *              1.0.4.3
 */
describe("Basic", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Area Basic';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ["Theme"];

    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //other functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#area-basic")
            .and(function(){
                dataFromStore = document['dataFromStore'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("area-basic");
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
            Lib.sourceClick('KitchenSink.view.chart.area.Area');
        })
    });
});