/**
 * modern KS > Charts > Radar Charts > Multiaxis
 * tested on:
 *          desktop:
 *              Chrome 59
 *              Firefox 54
 *              IE 11
 *              Edge 15
 *          tablet:
 *              Safari 10
 *              Android 4.4
 *              Windows 10 Edge
 *          mobile:
 *              Safari 9
 *              Android 4.4, 7
 *          Sencha Test:
 *              2.1.1.31
 */
describe("Multiaxis", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Radar Multiaxis';
    var prefix = '#kitchensink-view-chart-radar-multiaxis';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ['Theme', 'Refresh'];
    var graph_id_main;
    var chartType = prefix + ' polar';

    var fieldBegin;
    var fieldNewBegin;
    var fieldCurrent;
    var dataFromStore = [
        { month: 'Jan', high: 14.7, low: 5.6  },
        { month: 'Feb', high: 16.5, low: 6.6  },
        { month: 'Mar', high: 18.6, low: 7.3  },
        { month: 'Apr', high: 20.8, low: 8.1  },
        { month: 'May', high: 23.3, low: 9.9  },
        { month: 'Jun', high: 26.2, low: 11.9 },
        { month: 'Jul', high: 27.7, low: 13.3 },
        { month: 'Aug', high: 27.6, low: 13.2 },
        { month: 'Sep', high: 26.4, low: 12.1 },
        { month: 'Oct', high: 23.6, low: 9.9  },
        { month: 'Nov', high: 17  , low: 6.8  },
        { month: 'Dec', high: 14.7, low: 5.8  }
    ];

    //------------------------------------------------functions-------------------------------------------------------//

    function compareFields(field1, field2){
        var isEqual = true;
        for(var i = 0; i < field1.length; i++){
            if(field1[i] !== field2[i]){
                isEqual = false;
            }
        }
        return isEqual;
    }

    function copyFromStore(store){
        var field = [];
        for(var i = 0; i < store.length; i++){
            field.push(store[i].data.highF);
        }
        return field;
    }
    //functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#radar-multi-axis", chartType, undefined, undefined, false)
            .and(function(el){
                fieldBegin = copyFromStore(el.getStore().data.items).slice();
                graph_id_main = document['graph_id_main'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("radar-multi-axis");
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

        describe('Refresh button is working properly', function () {
            it('Reload and check if values are new', function () {
                ST.button(Components.button(buttons[1]))
                    .click();
                ST.component(chartType)
                    .and(function(el){
                        fieldCurrent = copyFromStore(el.getStore().data.items).slice();
                        expect(compareFields(fieldBegin, fieldCurrent)).not.toBeTruthy();
                    });
            });

            it('Reload 4-times and check if values are new', function () {
                ST.button(Components.button(buttons[1]))
                    .click();
                Lib.waitOnAnimations();
                ST.component(chartType)
                    .and(function (el) {
                        fieldNewBegin = copyFromStore(el.getStore().data.items).slice();
                        expect(compareFields(fieldBegin, fieldNewBegin)).not.toBeTruthy();
                    });
                for (var i = 0; i < 4; i++) {
                    ST.button(Components.button(buttons[1]))
                        .click();
                    Lib.waitOnAnimations();
                    ST.component(chartType)
                        .and(function (el) {
                            fieldCurrent = copyFromStore(el.getStore().data.items).slice();
                            expect(compareFields(fieldNewBegin, fieldCurrent)).not.toBeTruthy();
                            expect(compareFields(fieldBegin, fieldCurrent)).not.toBeTruthy();
                            fieldNewBegin = fieldCurrent.slice();
                        });
                }
            });
        });

        it('Chart is rotatable', function(){
            Lib.Chart.rotate(desc, graph_id_main);
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.radar.MultiAxis');
        })
    });
});