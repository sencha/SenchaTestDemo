/**
 * @file gauge.js
 * Gauge
 **/

describe("gauge", function() {
    var prefix = 'default-gauge ';
    beforeAll(function () {
        // redirect to page Components>Gauge
        Lib.beforeAll("#default-gauge", prefix);
    });
    afterAll(function(){
        Lib.afterAll(prefix);
    });

    // Gauge is loaded correctly
    describe("Gauge is loaded correctly", function() {
        it('Gauge main page is loaded', function () {
            ST.component("default-gauge")
                .visible()
                .and(function(component){
                    expect(component.isVisible()).toBeTruthy();
                });
        });
    });

    // Green gague is loaded correctly
    describe("Green Gauge is loaded correctly", function() {
        it('Green Gauge main page is loaded', function () {
            ST.component("gauge[_ui=green]")
                .visible()
                .and(function(component){
                    expect(component.isVisible()).toBeTruthy();
                });
        });
    });

    // Default gague is loaded correctly
    describe("Defalut Gauge is loaded correctly", function() {
        it('Defalut Gauge main page is loaded', function () {
            ST.component("gauge[_trackStart=135]")
                .visible()
                .and(function(component){
                    expect(component.isVisible()).toBeTruthy();
                });
        });
    });

    // Sliderfield is loaded correctly
    describe("Sliderfield is loaded correctly", function() {
        it('Sliderfield is loaded', function () {
            ST.component("sliderfield[flex=1]")
                .visible()
                .and(function(component){
                    expect(component.isVisible()).toBeTruthy()
                });
        });
    });

    var fiftyValue = 50;

    // Both gauges moved to 50%
    describe("Both gauges moved to 50%", function() {
        it('Both gauges moved to 50%', function () {
            ST.component(prefix + "slider[maxValue=100]")
                .click()
                .wait(function(){
                    return !Ext.AnimationQueue.isRunning;
                });
            ST.component("gauge[_trackStart=135]")
                .and(function (el) {
                    expect(el.getValue()).toBe(fiftyValue);
                });
        });
    });

    // Sliderfield test
    describe("Sliderfield test", function() {
        it('Blue gauge moved to less %', function () {
            ST.component(prefix + "slider[maxValue=100]")
                .click(100,11);
            ST.play([
                { type: "tap", target: prefix + "slider[maxValue=100]", x: 100, y: 11 }
            ]);
            ST.component(prefix + "slider[maxValue=100]")
                .wait(function(){
                    return !Ext.AnimationQueue.isRunning;
                });
            ST.component("gauge[_trackStart=135]")
                .and(function (el) {
                    expect(el.getValue()).toBeLessThan(fiftyValue);
                });
        });
        it('Green gauge moved to less %', function () {
            ST.component("gauge[_ui=green]")
                .and(function (el) {
                    expect(el.getValue()).toBeLessThan(fiftyValue);
                });
        });
        it('Blue gauge moved to more %', function () {
            ST.play([
                { type: "tap", target: prefix + "slider[maxValue=100]", x: 640, y: 8 }
            ]);
            ST.component(prefix + "slider[maxValue=100]")
                .wait(function(){
                    return !Ext.AnimationQueue.isRunning;
                });
            ST.component("gauge[_trackStart=135]")
                .and(function (el) {
                    expect(el.getValue()).not.toBeLessThan(fiftyValue);
                });
        });
        it('Green gauge moved to more %', function () {
            ST.component("gauge[_ui=green]")
                .and(function (el) {
                    expect(el.getValue()).not.toBeLessThan(fiftyValue);
                });
        });
    });
});