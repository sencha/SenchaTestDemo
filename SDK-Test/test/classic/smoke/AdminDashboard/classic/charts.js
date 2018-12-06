/**
 * @file charts.js
 * @date 9.3.2016
 *
 * Tested on: Chrome, Firefox, Opera, Safari, Android6 and iOS9
 * Passed on: all tested platforms
 */

describe("Checking charts", function() {

    var Dash = {
        chartsAreaPanel : function () {
            return ST.component('chartsareapanel');
        },

        chartsPolarPanel : function () {
            return ST.component('chartspolarpanel');
        },

        chartsStackedPanel : function () {
            return ST.component('chartsstackedpanel');
        },

        chartsBarPanel : function () {
            return ST.component('chartsbarpanel');
        },

        chartsGaugePanel : function () {
            return ST.component('chartsgaugepanel');
        },

        chartsPie3dPanel : function () {
            return ST.component('chartspie3dpanel');
        },

        chartsPage : function () {
            return ST.component('charts');
        }
    };
        
    beforeEach(function(){
        Admin.app.redirectTo("#charts"); // make sure you are on dashboard homepage
    });

    it('Take a screenshot', function () {
        // comparing actual screen with expected screen
        Dash.chartsPage().visible().wait(500); // make sure all charts are visible and laid out properly
        Lib.screenshot('adminCharts');
    });
    
    it('Charts loaded correctly', function () {
        Dash.chartsAreaPanel()
            .visible();

        Dash.chartsPolarPanel()
            .visible();

        Dash.chartsStackedPanel()
            .visible();

        Dash.chartsBarPanel()
            .visible();
            
        Dash.chartsGaugePanel()
            .visible();

        Dash.chartsPie3dPanel()
             .visible();
    });
});
