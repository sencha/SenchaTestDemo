/**
 * modern KS > Charts > Pie Chart > 3D Pie
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
describe("3D", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = '3D Pie';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Refresh', 'Theme'];
    var w, h, graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#pie-3d", 'polar')
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.afterAll("pie-3d");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore, 'polar');
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc, 'polar');
        });

        it('Sector is getting bigger when mouseover / tap on it', function(){
            ST.component('polar')
                .and(function (p) {
                    var r = p.getSeries()[0].getRadius() - 20;

                    var x = w/2 - r;
                    var y = h/2;
                    Lib.Chart.biggerSector('polar', x, y, 5, undefined, 40);

                    x = w/2 + r;
                    Lib.Chart.biggerSector('polar', x, y, 2, undefined, 40, -20);

                    x = w/2;
                    y = h/2 + r/3;
                    Lib.Chart.biggerSector('polar', x, y, 4, undefined, 40);
                });
        });

        describe('Theme button is working properly', function () {
            Lib.Chart.themeComplex(desc, undefined, 'polar');
        });

        it('Refresh button is working properly', function () {
            Lib.Chart.refreshComplex(desc, dataFromStore, undefined, 'polar');
        });

        it('Chart is rotatable', function(){
            Lib.Chart.rotate(desc, graph_id_main);
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.pie.Pie3D');
        })
    });
});