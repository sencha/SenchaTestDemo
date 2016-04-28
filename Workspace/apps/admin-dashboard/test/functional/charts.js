describe("Checking charts", function() {
      /*
       * Futures enable tests to practice the DRY (Don’t Repeat Yourself) principle.
       * Instead of creating the future instance at the point of need,
       * consider the following alternative.
       **/
    var Dash = {
        // Test uses ComponentQuery locators to identify single Charts within Chart page by xtype.
        // All chart classes are defined with unique xtype so we can use these as a shortcut for each panel
        // Inspect /apps/admin-dashboard/app/view/charts to find out how xtype is defined
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
    it('Take a screenshot', function (done) {
        // comparing actual screen with expected screen
        Dash.chartsPage().visible().rendered(); // make sure all charts are visible and laid out properly
        ST.screenshot('adminCharts', done);
    }, 1000 * 20);
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
