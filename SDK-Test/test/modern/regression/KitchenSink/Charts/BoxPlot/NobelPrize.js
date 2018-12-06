/**
 * modern KS > Charts > Box plot > Nobel prize
 * tested on:
 *          desktop:
 *              Chrome 58, 59
 *              IE 11
 *              Edge 14, 15
 *              Opera 45
 *              Firefox 53
 *              Safari 10.1
 *          tablet:
 *              Android 4.4, 5.0, 6.0, 7.1
 *              iPad 10
 *              Edge 14
 *          mobile:
 *              Android 4.4, 5.0, 5.1, 6.0, 7.0
 *              iPhone 9, 10
 *              Edge 15
 *          themes:
 *              Triton
 *              Neptune
 *              iOS
 *              Material
 *          Sencha Test:
 *              2.1.1.27
 *
 */
describe("Nobel prize", function() {
    //------------------------------------------------variables-------------------------------------------------------//

    var desc = 'Nobel prize';
    var toolbar = "toolbar[id^=ext-toolbar]";
    var buttons = ["Theme"];
    var w;
    var h;
    var graph_id_main;
    var dataFromStore = [];

    //------------------------------------------------functions-------------------------------------------------------//

    //other functions in file libraryFunctions.js

    //------------------------------------------------navigation------------------------------------------------------//

    beforeAll(function() {
        Lib.Chart.beforeAll("#boxplot-nobel")
            .and(function(){
                dataFromStore = document['dataFromStore'];
                graph_id_main = document['graph_id_main'];
                w = document['w'];
                h = document['h'];
            });
    });

    afterAll(function () {
        Lib.Chart.afterAll("boxplot-nobel", true);
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
            it('Theme and check if baseColor is changed', function(){
                Lib.Chart.theme(desc);
            });
        });

        it('Mouseover box gives more information', function(){
            if(Lib.isDesktop) {
                ST.component('chart')
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, w / 12, h / 2, 'High: 88', 'physic');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 5 * w / 12, 3 * h / 8, 'Low: 35', 'chemistry');
                    })
                    .and(function () {
                        Lib.Chart.mouseover(desc, graph_id_main, 11 * w / 12, 2.5 * h / 8, 'Q1: 61', 'economics');
                    });
            }
            else{
                pending('Disabled for touch devices');
            }
        });

        it('Mouseover changes color', function(){
            ST.component('chart')
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 7*w/12, 2.8*h/8);
                })
                .and(function () {
                    Lib.Chart.mouseover(desc, graph_id_main, 11*w/12, 2.5*h/8);
                });
        });

        it("Middle red line is present with text \"Theoretical mean: \"", function(){
            ST.component('chart')
                .and(function(chart){
                    var value = chart.getAxes()[0].config.limits[0].value;
                    var text = chart.getAxes()[0].config.limits[0].line.title.text;
                    expect(text).toContain("Theoretical mean: ");
                    expect(text).toContain(value);
                });
        });

        it("Blue points with outlying observation are present", function(){
            ST.component('chart')
                .and(function(chart){
                    expect(chart.getStore().type).toBe("nobel-outlier");
                    expect(chart.getStore().data.items.length).toBeGreaterThan(0);
                });
        });

        it('Source click', function(){
            Lib.sourceClick('KitchenSink.view.chart.boxplot.BoxPlot');
        })
    });
});