/**
* @file Particles.js
* @name Kitchen Sink (Modern)/D3/CustomCanvas/Particies.js
* @created 2016/10/18
* @date 18.10.2016
* @edited 2016/12/16
* 
* Tested on: Ubuntu 16.04 (Chrome, Firefox, Opera), Android 4, 5, 6,
*            Windows 10 Edge, Windows 8.1 phone, iOS 8, 9 Safari(iPad, iPhone)
* Passed on: All tested
*/
describe('Particles', function(){
    /**
     * Custom variables for application
     **/
    var examplePrefix = 'd3-view-particles[id^=kitchensink-view-d3-custom-canvas-particles]{isVisible()} ';
    var exampleUrlPostfix='#d3-view-particles';
    var Canvas = {
        /**
         * Get Component
         * @param prefix - prefix/path from XType for the component
         * @param item - XType for the item which we want
         * @param key - unique key which clearly identifies the component 
         * @return {ST.component}
         **/
        getComponent: function(prefix, item, key){
            return ST.component(examplePrefix + prefix + ' '
                        + item + (key? '[' + key + ']' : ''));
        },
    };
    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, examplePrefix, 200);
    });
    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });
    it('Canvas should be visible and rendered', function(done){
        Canvas.getComponent('', 'd3-canvas', 'isCanvas=true')
            .visible()
            .and(function(){
                expect(this.future.cmp.isRendered()).toBeTruthy();
            });
        done();
    });
    describe('Source code', function(){    
        it('Source code view should work correctly', function(){
                Lib.sourceClick('.d3.custom.canvas.Particles');
        });
    });
});
