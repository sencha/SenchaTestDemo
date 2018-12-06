/**
 * @file charts.js
 * @name AdminDashboard-Modern/charts.js
 * 
 * Tested on: Ubuntu 16.04 (Chrome, Firefox, Opera), Android (4, 5), iOS (7, 8, 9) Safari,
 *            Windows 10 (Edge, IE), Windows Phone 10 Edge
 * Sencha Test: 2.0.0.292
 * Passed on: All tested
 */
describe("Charts", function() {
    /**
     * Custom variables for application
     */
    var examplePrefix = 'charts[id^=ext-charts]{isVisible()} ';
    var exampleUriPostfix = '#charts';
    var chartsName = ['Area Chart', '3D Pie Chart', 'Radial Chart', 'Stacked Bar Chart', 'Bar Chart', 'Gauge Chart'];
    var chartsDataCount = [ 24, 3, 10, 11, 12, 1];
    var Charts = {
        getCharts: function(){
            return ST.component(examplePrefix);
        },
        chartsAreaPanel: function(){
            return ST.component(examplePrefix + 'chartsareapanel');
        },
        chartsPolarPanel: function(){
            return ST.component(examplePrefix + 'chartspolarpanel');
        },
        chartsStackedPanel: function(){
            return ST.component(examplePrefix + 'chartsstackedpanel');
        },
        chartsBarPanel: function(){
            return ST.component(examplePrefix + 'chartsbarpanel');
        },
        chartsGaugePanel: function(){
            return ST.component(examplePrefix + 'chartsgaugepanel');
        },
        chartsPie3dPanel: function(){
            return ST.component(examplePrefix + 'chartspie3dpanel');
        },
        getTheChartDataLength: function(index){
            return Ext.first(examplePrefix).getInnerItems()[index].getInnerItems()[0].getStore().getData().length;
        },
        /**
         * Move or zoom pan with following parameeters
         * Copy of function from library and changed it
         * @param elementId - id of element where coordinates are counted and swipe is provided
         * @param direction - direction of displacement, '-1' means left or up, '1' means right or down
         * @param isVertical - direction of displacement (vertical/horizontal), if value is 'true', than pan is provided verticaly
         * @param startX - optional - start X coordinate
         * @param startY - optional - start Y coordinate
         * @param beginPercent - optional - how far (%) from left swipe should begin
         * @param endPercent - optional - how far (%) from the bottom swipe should end
         */
        justSwipe: function(element, direction, isVertical, beginPercent, endPercent){
            var horizontal = 1, vertical = 0;
            if(isVertical){
                horizontal = 0; vertical = 1;
            }
            beginPercent = beginPercent/100 || 0.3;
            endPercent = endPercent/100 || 0.7;
            ST.element(element)
                .and(function(){
                    var width = this.future.el.dom.scrollWidth;
                    var height = this.future.el.dom.scrollHeight;
                    var initialPositionX = width*horizontal*beginPercent + width*vertical*0.5;
                    var initialPositionY = height*vertical*beginPercent + height*horizontal*0.5;
                    var stepX = direction*(endPercent - beginPercent)*width*horizontal/3;
                    var stepY = direction*(endPercent - beginPercent)*height*vertical/3;
                    if(direction < 0){
                        initialPositionX = width - initialPositionX;
                        initialPositionY = height - initialPositionY;
                    }
                    if(Lib.isDesktop){
                        ST.play([
                            {type: "mouseenter", target: element, x: initialPositionX, y: initialPositionY},
                            {type: "mousedown", target: element, x: initialPositionX, y: initialPositionY},
                            {type: "mousemove", target: element, x: initialPositionX + stepX, y: initialPositionY + stepY},
                            {type: "mousemove", target: element, x: initialPositionX + stepX*2, y: initialPositionY + stepY*2},
                            {type: "mousemove", target: element, x: initialPositionX + stepX*3, y: initialPositionY + stepY*3},
                            {type: "mouseup", target: element, x: width - initialPositionX, y: height - initialPositionY},
                            {type: "mouseleave", target: element, x: width - initialPositionX, y: height - initialPositionY}
                        ]);
                    } else {
                        ST.play([
                            {type: "tap", target: element, x: initialPositionX, y: initialPositionY},
                            {type: "touchstart", target: element, x: initialPositionX, y: initialPositionY},
                            {type: "touchmove", target: element, x: initialPositionX + stepX, y: initialPositionY + stepY},
                            {type: "touchmove", target: element, x: initialPositionX + stepX*2, y: initialPositionY + stepY*2},
                            {type: "touchmove", target: element, x: initialPositionX + stepX*3, y: initialPositionY + stepY*3},
                            {type: "touchmove", target: element, x: width - initialPositionX, y: height - initialPositionY},
                            {type: "touchend", target: element, x: width - initialPositionX, y: height - initialPositionY}
                        ]);
                    }
                });
        },
        /**
         * Scroll to a chart element, height for one chart is 300, but charts can have one or two columns
         * @param index - indec for chart in the component charts
         */
        scrollChartsElement: function(index){
            ST.component('charts').visible().and(function(){
                if(this.future.cmp.el.dom.scrollWidth < 740){
                    this.future.cmp.getScrollable().getScrollElement().dom.scrollTop = 300*index;
                } else {
                    this.future.cmp.getScrollable().getScrollElement().dom.scrollTop = (index%2)? 300*(index - 1)/2 : 300*index/2;
                }
            });
        },
        /**
         * Create "it" for swipe (rotatio/zoom) a chart with screenshot
         * It doesn't work for touch devices
         * @param index - index for chart in the component charts
         */
        createSwipeIt: function(index){
            it('Chart "' + chartsName[index] + '" should be interactive on to swipe', function(){
                Charts.scrollChartsElement(index);
                Lib.screenshot('UI_adminDashboard_' + chartsName[index]);
                if (Lib.isDesktop){
                    Charts.justSwipe('#' + Ext.first('charts').getInnerItems()[index].getInnerItems()[0].getId(), -1, false); //because some charts item with swipe don't work correctly in the first time, but next it works correctly.
                    Charts.justSwipe('#' + Ext.first('charts').getInnerItems()[index].getInnerItems()[0].getId(), 1, false);
                    Lib.screenshot('UI_adminDashboard_' + chartsName[index] + '_afterSwipeRight');
                    Charts.justSwipe('#' + Ext.first('charts').getInnerItems()[index].getInnerItems()[0].getId(), -1, false);
                    Lib.screenshot('UI_adminDashboard_' + chartsName[index] + '_afterSwipeLeft');
                    Charts.justSwipe('#' + Ext.first('charts').getInnerItems()[index].getInnerItems()[0].getId(), -1, true);
                    Lib.screenshot('UI_adminDashboard_' + chartsName[index] + '_afterSwipeUp');
                    Charts.justSwipe('#' + Ext.first('charts').getInnerItems()[index].getInnerItems()[0].getId(), 1, true, 20, 80); //because for horizontal zoom out must have large swipe than for horizontal zoom
                    Lib.screenshot('UI_adminDashboard_' + chartsName[index] + '_afterSwipeDown');
                } else {
                    if(Lib.isPhone){
                        pending('This IT doesn\'t work on mobile device - EXTJS-23287');
                    }
                    pending('can\'t simulate zoom on touchDevices - ORION-1113');
                }
                Lib.screenshot('UI_adminDashboard_' + chartsName[index]);
            });
        },
        isTitleForChart:function(index, expectTitle){
            Charts.getCharts().visible()
                .and(function(){
                    expect(this.future.cmp.getInnerItems()[index].getTitle()).toBe(expectTitle);
                });
        },
    };
    beforeAll(function(){
        // make sure you are on dashboard homepage
        Lib.beforeAll(exampleUriPostfix, examplePrefix, 200, 'admin');
    });
    afterAll(function(){
        //Lib.afterAll(examplePrefix);//It is not need destroyed
        ST.options.eventDelay = 500;
    });
    describe('Default display UI', function(){
        it('Should load correctly', function(){
            // comparing actual screen with expected screen
            Charts.getCharts().visible()
                // https://sencha.jira.com/browse/EXTJS-19905 - if it is fixed, delete wait(500)
                // .wait(function(){
                //     return !Ext.AnimationQueue.isRunning })
                .wait(500)
                .and(function () {
                    expect(this.future.cmp.rendered).toBeTruthy();
                });
            // make sure all charts are visible and laid out properly
            Lib.screenshot('UI_adminDashboard_appMain_Charts');
        });
        it('Should be loaded 6 charts', function(){
            Charts.getCharts().visible()
                .and(function(){
                    expect(this.future.cmp.getInnerItems().length).toBe(6);
                });
            Charts.chartsAreaPanel().visible()
                .and(function(){
                    expect(this.future.cmp.isVisible()).toBe(true);
                });
            Charts.chartsPolarPanel().visible()
                .and(function(){
                    expect(this.future.cmp.isVisible()).toBe(true);
                });
            Charts.chartsStackedPanel().visible()
                .and(function(){
                    expect(this.future.cmp.isVisible()).toBe(true);
                });
            Charts.chartsBarPanel().visible()
                .and(function(){
                    expect(this.future.cmp.isVisible()).toBe(true);
                });
            Charts.chartsGaugePanel().visible()
                .and(function(){
                    expect(this.future.cmp.isVisible()).toBe(true);
                });
            Charts.chartsPie3dPanel().visible()
                .and(function(){
                    expect(this.future.cmp.isVisible()).toBe(true);
                });
        });
        it('Should be correct data counts for all chart', function(){
            for(var i = 0; i < 6; i++){
                expect(Charts.getTheChartDataLength(i)).toBe(chartsDataCount[i]);
            }
        });
        it('Should be correct titles for all chart', function(){
            for(var i = 0; i < 6; i++){
                Charts.isTitleForChart(i, chartsName[i]);
            }
        });
    });
    describe('Zoom and Pan chart', function(){
        afterAll(function(){
            Charts.scrollChartsElement(0);
        });
        for(var i = 0; i < 5; i++){
            Charts.createSwipeIt(i);
        }
    });
});
