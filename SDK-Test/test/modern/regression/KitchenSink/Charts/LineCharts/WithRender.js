/**
 * modern KS > Charts > Line Charts > With Renderer
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
describe("With Render", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Line With Render';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Refresh'];
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //functions in file libraryFunctions.js

    function valueColor(c, isPositive){
        var current;
        var previous;
        var isUp;
        var strokeStyle;
        var fillStyle;
        var instance;
        for(var i = 0; i < c.getStore().data.items.length; i++){
            current = c.getStore().data.items[i].data.g1;
            if(current > 0){
                previous = current;
                if(i > 0){
                    previous = c.getStore().data.items[i-1].data.g1;
                }
                isUp = current >= previous;
                instance = c.getSeries()[0].getSurface().getItems()[0].dataMarker.instances[i];
                strokeStyle = '#6495ed';
                fillStyle = '#f0f8ff';

                if(isUp && isPositive) {
                    expect(instance.fillStyle).toBe(fillStyle);
                    expect(instance.strokeStyle).toBe(strokeStyle);
                }
                else if(!isUp && !isPositive){
                    strokeStyle = '#ff6347';
                    fillStyle = '#ffb6c1';

                    expect(instance.fillStyle).toBe(fillStyle);
                    expect(instance.strokeStyle).toBe(strokeStyle);
                }
            }
        }
    }

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#line-renderer", undefined, undefined, false)
            .and(function(){
                dataFromStore = document['dataFromStore'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("line-renderer");
    });

    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore);
        });

        it('is rendered', function () {
            Lib.Chart.isRendered(desc);
        });

        it('Refresh button is working properly', function () {
            Lib.Chart.refreshComplex(desc, dataFromStore);
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.line.Renderer');
        })
    });
});