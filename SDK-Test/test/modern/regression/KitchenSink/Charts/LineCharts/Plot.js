/**
 * modern KS > Charts > Line Charts > Plot
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
 *
 *              EXTJS-25462
 */
describe("Plot", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Line Plot';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ["Theme", 'Refresh', 'Pan', 'Zoom'];
    var graph_id;
    var fieldNewBegin;
    var fieldCurrent;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    function compareFields(field1, field2){
        var isEqual = true;
        for(var i = 0; i < field1.length; i++){
            if(field1[i].x !== field2[i].x){
                isEqual = false;
            }
            else if(field1[i].y1 !== field2[i].y1){
                isEqual = false;
            }
        }
        return isEqual;
    }

    //other functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#line-plot", undefined, undefined, false)
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id = document['graph_id'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("line-plot");
    });
    //------------------------------------------------tests-----------------------------------------------------------//


    describe(desc, function () {
        afterEach(function() {
            Lib.Chart.afterEach(dataFromStore);
        });

        it('Chart is rendered', function () {
            Lib.Chart.isRendered(desc);
        });

        it('Refresh button is working properly', function () {
            ST.button(Components.button(buttons[1]))
                .click();
            ST.component('chart')
                .and(function(el){
                    fieldCurrent = [];
                    for(var i = 0; i < el.getStore().data.items.length; i++) {
                        fieldCurrent.push(Ext.clone(el.getStore().data.items[i].data));
                    }
                    expect(compareFields(fieldCurrent, dataFromStore)).not.toBeTruthy();
                });
            Lib.screenshot(desc + '_refresh');

            ST.button(Components.button(buttons[1]))
                .click();
            ST.component('chart')
                .and(function (el) {
                    fieldNewBegin = [];
                    for(var i = 0; i < el.getStore().data.items.length; i++) {
                        fieldNewBegin.push(Ext.clone(el.getStore().data.items[i].data));
                    }
                    expect(compareFields(dataFromStore, fieldNewBegin)).not.toBeTruthy();
                });
            for (var i = 0; i < 4; i++) {
                ST.button(Components.button(buttons[1]))
                    .click();
                ST.component('chart')
                    .and(function (el) {
                        fieldCurrent = [];
                        for(var i = 0; i < el.getStore().data.items.length; i++) {
                            fieldCurrent.push(Ext.clone(el.getStore().data.items[i].data));
                        }
                        expect(compareFields(fieldNewBegin, fieldCurrent)).not.toBeTruthy();
                        expect(compareFields(dataFromStore, fieldCurrent)).not.toBeTruthy();
                        fieldNewBegin = fieldCurrent.slice();
                    });
            }
        });

        describe('Theme button is working properly', function () {
            Lib.Chart.themeComplex(desc);
        });

        describe('Pan / Zoom works (buttons on desktop) '+((Ext.supports.Touch && Ext.platformTags.desktop)?' - EXTJS-25462':''), function () {
            it('Click on button and check if correct button is visible and selected', function () {
                Lib.Chart.panZoomButtons();
            });

            it('Zoom', function () {
                Lib.Chart.zoom(desc, graph_id, 1, false, false, buttons[3], buttons[2]);
            });

            it('Pan', function () {
                Lib.Chart.pan( desc, graph_id, 1, false, false, buttons[3], buttons[2]);
            });
        });

        it('Source click', function(){
            Lib.sourceClick('Ext.chart.PlotChart');
        })
    });
});