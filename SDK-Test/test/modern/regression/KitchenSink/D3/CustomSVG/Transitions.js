/**
* @file Transitions.js
* @name Kitchen Sink (Modern)/D3/CustomSVG/Transitions.js
* @created 2016/10/18
* @date 18.10.2016
* @edited 2016/12/16
* 
* Tested on: Ubuntu 16.04 (Chrome, Firefox, Opera), Android 4, 5, 6,
*            Windows 10 Edge, Windows 8.1 phone, iOS 8, 9 Safari(iPad, iPhone)
* Passed on: All tested
*/
describe('Transitions', function(){
    /**
     * Custom variables for application
     **/
    var examplePrefix = 'd3-view-transitions[id=kitchensink-view-d3-custom-svg-transitions]{isVisible()} ';
    var exampleUrlPostfix='#d3-view-transitions';
    var SVG = {
        /**
         * Get Component
         * @param prefix - prefix/path from XType for the component
         * @param item - XType for the item which we want
         * @param key - unique key which clearly identifies the component 
         * @return {ST.component}
         **/
        getComponent: function(prefix, item, key){
            return ST.component(examplePrefix + prefix + ' '
                        + item + (key? '[' + key + ']': ''));
        },
        getD3: function(prefix, key) {
            return this.getComponent(prefix, 'd3', (key? key : 'isSvg=true'));
        },
        getElement: function(prefix, item, key, postfix){
            return ST.element(examplePrefix + prefix + ' '
                        + (item ? item : 'd3') + (key ? '[' + key + ']' : '')
                        + (postfix ? ' => ' + postfix : ' => circle'));
        },
        /**
         * Checks changes position for some selected circle between real values with expected values
         * Info: to fixed decimal part of number, because iOS (Apple devices) has saved the number different than other devices with other operation system, hence decimal part of number can be different
         * @param prefix - prefix/path from XType for the component
         * @param item - XType for the item which we want
         * @param key - unique key which clearly identifies the component 
         * @param postfix - first part for select an element type
         * @param selectChild - second part for select the element
         * @param requiredPossionX - expected result for X axis
         * @param requiredPossionY - expected result for Y axis
         **/
        circleChangesPosition: function(prefix, item, key, postfix, selectChild, requiredPossionX, requiredPossionY){
            SVG.getElement(prefix, item, key, postfix+selectChild).visible()
                .wait(function(){ 
                    return this.el.dom.cx.animVal.value.toFixed(7) === requiredPossionX.toFixed(7) 
                        && this.el.dom.cy.animVal.value.toFixed(7) === requiredPossionY.toFixed(7)}
                    )
                .and(function(){
                    expect(this.future.el.dom.cx.animVal.value).toBeCloseTo(requiredPossionX, 7);
                    expect(this.future.el.dom.cy.animVal.value).toBeCloseTo(requiredPossionY, 7);
                });
        },
        oneRoundItem125: function(){
            var position = {
                cx: function(index){
                    var array = [
                        -109.34529113769531,
                        -102.71292114257812,
                        -61.97927474975586,
                        -107.42676544189453,
                        -0.5173321962356567,
                        -45.13161849975586
                    ];
                    return array[index];
                },
                cy: function(index){
                    var array = [
                        -102.68206787109375,
                        -96.45384979248047,
                        -58.202415466308594,
                        -100.88044738769531,
                        -0.48580726981163025,
                        -42.38140869140625
                    ];
                    return array[index];
                }
            }; 
            for(var i = 0; i < 6; i++)
            {
                this.circleChangesPosition('', 'd3', 'isSvg=true', 'svg g.x-d3-wrapper g.x-d3-scene g circle', ':nth-child(125)',
                    position.cx(i), position.cy(i));
            }
        },
    };
    var defaultTimeout = ST.options.timeout;
    // We must change timeout due to 'it':'Should chnages position for the circle 125'
    beforeAll(function(){
        Lib.beforeAll(exampleUrlPostfix, examplePrefix, 200);
        ST.options.timeout = 10000;
    });
    //Change timeout to defaultTimeout
    afterAll(function(){
        Lib.afterAll(examplePrefix);
        ST.options.timeout = defaultTimeout;
    });
    it("Should load correctly", function(){
        SVG.getD3('', '').visible();
        Lib.screenshot('UI_appMain_SVG_Transitions');
    });
    it('Should be 201 circles in D3', function(){
        SVG.getElement('', 'd3', 'isSvg=true', 'svg g.x-d3-wrapper g.x-d3-scene g')
            .visible().and(function(){
                expect(this.future.el.dom.childElementCount).toBe(201);
            });
    });
    it('Should changes position for the circle 125', function(){
        SVG.oneRoundItem125();
    });
    describe('Source code', function(){
        it('Source code view should work correctly', function(){
            Lib.sourceClick('.d3.custom.svg.Transitions');
        });
    });
});
