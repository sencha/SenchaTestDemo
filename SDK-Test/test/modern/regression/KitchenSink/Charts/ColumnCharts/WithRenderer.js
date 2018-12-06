/**
 * modern KS > Charts > Column Charts > With Renderer
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
 */
describe("With Renderer", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Column With Render';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Refresh'];
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    function checkColor(shoudBeGreen){
        var instances;
        //constants
        var paleGreen = '#98fb98';
        var tomato = '#ff6347';
        ST.component('chart')
            .wait(function(){
                return dataFromStore[0].hasOwnProperty('g1') && dataFromStore[0].hasOwnProperty('g2');
            })
            .and(function(el){
                for(var i = 0; i <el.getSeries()[0].getSurface().getItems().length; i++){
                    if(el.getSeries()[0].getSurface().getItems()[i].type === 'instancing'){
                        instances = el.getSeries()[0].getSurface().getItems()[i].instances;
                        break;
                    }
                }
            })
            .wait(function(){
                Lib.waitOnAnimations(); //has to be here for wait to change colors
                if(dataFromStore[0].g1 > dataFromStore[0].g2){
                    return (instances[0].fillStyle === paleGreen);
                }
                else{
                    return (instances[0].fillStyle === tomato);
                }
            })
            .and(function(){
                if(shoudBeGreen){
                    for(var i = 0; i < dataFromStore.length; i++){
                        if(dataFromStore[i].g1 > dataFromStore[i].g2){
                            expect(instances[i].fillStyle).toBe(paleGreen);
                        }
                    }
                }
                else{
                    for(i = 0; i < dataFromStore.length; i++){
                        if(dataFromStore[i].g1 < dataFromStore[i].g2){
                            expect(instances[i].fillStyle).toBe(tomato);
                        }
                    }
                }
            })

    }
    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#column-renderer")
            .and(function(){
                dataFromStore = document['dataFromStore'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("column-renderer");
    });
    //------------------------------------------------tests-----------------------------------------------------------//

    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore);
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc);
        });

        //has to be provided before refresh due to rendering time to prevent active waiting
        describe('Columns check', function(){

            it('Column are red when inside yellow one are higher', function () {
                checkColor(false);
            });

            it('Column are green when inside yellow one are smaller', function(){
                checkColor(true);
            });

            it('Checked label value of diff for red columns', function () {
                ST.component('chart')
                    .wait(function(){
                        return dataFromStore[0].hasOwnProperty('g1') && dataFromStore[0].hasOwnProperty('g2');
                    })
                    .and(function(el){
                        for(var i = 0; i < dataFromStore.length; i++){
                            if(dataFromStore[i].g1 < dataFromStore[i].g2){
                                var diff = dataFromStore[i].g2 - dataFromStore[i].g1;
                                diff = Math.round(diff);
                                var num = parseFloat(el.getSeries()[0].getSurface().myTextSprites[i].attr.text.split(' ')[1]);
                                expect(diff).toBe(num);
                            }
                        }
                    })
            });

            it('First and last column are compared by blue triangle with percentage', function(){
                ST.component('chart')
                    .wait(function(){
                        return dataFromStore[0].hasOwnProperty('g1');
                    })
                    .and(function(el){
                        var diff = dataFromStore[dataFromStore.length-1].g1 / dataFromStore[0].g1;
                        diff = (diff - 1) * 100;
                        var numText = el.getSeries()[0].getSurface().myLineSprites[1].attr.text;
                        var num = parseFloat(numText.split(' ')[1]);
                        if(diff < 0){
                            expect(numText).toContain('-');
                            diff *= -1;
                        }
                        else{
                            expect(numText).toContain('+');
                        }
                        expect(numText).toContain('%');
                        diff = Math.round(diff);
                        expect(diff).toBe(num);
                    });
            });
        });

        it('Refresh button is working properly', function () {
            Lib.Chart.refreshComplex(desc, dataFromStore);
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.column.Renderer');
        })
    });
});