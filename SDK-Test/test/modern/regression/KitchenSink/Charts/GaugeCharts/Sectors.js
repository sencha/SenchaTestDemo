/**
 * modern KS > Charts > Gauge Charts > Sectors
 * tested on:
 *          desktop:
 *              Chrome 59
 *              Firefox 54
 *              IE 11
 *              Edge 15
 *              Opera 46
 *          tablet:
 *              Safari 10
 *              Android 5
 *              Windows 10 Edge
 *          mobile:
 *              Safari 9
 *              Android 7
 *          Sencha Test:
 *              2.1.1.31
 */
describe("Sectors", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Gauge Sectors';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Refresh'];
    var dataFromStore1 = [];
    var prefix = 'gauge-sectors';
    var Cmp = {
        chartId: function () {
            return 'gauge-sectors polar';
        }
    };
    
    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.beforeAll("#gauge-sectors", prefix);
        ST.component(Cmp.chartId())
            .and(function(el){
                dataFromStore1 = [];
                for(var i = 0; i < el.getStore().data.items.length; i++) {
                    dataFromStore1.push(Ext.clone(el.getStore().data.items[i].data));
                }
            });
        Lib.waitOnAnimations();
    });

    afterAll(function () {
        Lib.Chart.afterAll("gauge-sectors");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore1, Cmp.chartId());
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc, Cmp.chartId());
        });

        it('Refresh button is working properly', function () {
            Lib.Chart.refreshComplex(desc, dataFromStore1, undefined, Cmp.chartId());
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.gauge.Sectors');
        })
    });
});