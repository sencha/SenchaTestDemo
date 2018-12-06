/**
* @file HtmlTooltips.js
* @name Kitchen Sink (Modern)/Components/Tooltips/HtmlTooltips.js
* @created 2016/10/24
* @date 24.10.2016
* @edited 2016/12/16
* 
* Tested on: Ubuntu 16.04 (Chrome, Firefox, Opera), Android 5, 6,
*            Windows 10 Edge, iOS 8, 9 Safari (iPad, iPhone)
* Passed on: All tested
*/
describe('HtmlTooltips', function() {
    /**
     * Tooltips examples were not implementation for all of mobile devices.
     **/
    if(Lib.isPhone){
        it('Example is not available on phone devices', function(){
            pending('This examples are not for mobile devices!!!');
        });
    } else {
    /**
     * Custom variables for application
     **/
    var examplePrefix = 'component[id=kitchensink-view-tip-htmltooltips]{isVisible()} ';
    var exampleUrlPostfix='#html-tooltips';
    var Tooltips = {
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
        getTooltip: function(){
            return ST.component('#ext-global-tooltip');
        }
    };
    beforeAll(function(){
        Lib.beforeAll(exampleUrlPostfix, examplePrefix, 200);
    });
    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });
    describe('Default display UI', function(){
        it('Should load correctly', function(){
            Lib.screenshot('UI_appMain_HTML_Tooltips');
        });
        it('Should be 4 items for tooltips (plus 1 CSS animation node)', function(){
            Tooltips.getComponent('','', '')
                .visible()
                .and(function(){
                    expect(this.future.cmp.el.dom.childElementCount).toBe(5);   // 4 nodes for tooltips, plus 1 CSS animation node = 5
                    expect(this.future.cmp.el.dom.childNodes.length).toBe(5);
                });
        });
        it('None tooltip should not be chosen', function(){
            Tooltips.getTooltip()
                //need to be done for IE
                .wait(function(f){
                    return f._hidden;
                })
                //.hidden()
                .and(function(){
                    if(!this.future.cmp.getAnchorToTarget()){
                        expect(this.future.cmp.getHtml()).toBeNull();
                    }
                });
        });
        it('Should be displayed correctly texts', function(){
            Tooltips.getComponent('','', '')
                .visible()
                //needed for IE
                .wait(function(f){
                    return (f.el.dom.childNodes[0].textContent == 'Inline Tip');
                })
                .and(function(){
                    expect(this.future.cmp.el.dom.childNodes[0].textContent).toBe('Inline Tip');
                    expect(this.future.cmp.el.dom.childNodes[1].textContent).toBe('Fixed width inline tip');
                    expect(this.future.cmp.el.dom.childNodes[2].textContent).toBe('Inline tip with title');
                    expect(this.future.cmp.el.dom.childNodes[3].textContent).toBe('Inline tip align top');
                });
        });
    });
    describe('Mouse hover over the elements', function(){
        afterEach(function(){
            if(ST.os.deviceType === 'Desktop'){
                ST.play([
                    {type: 'mouseenter', target: '#kitchensink-view-tip-htmltooltips', x: 250, y: 250},
                    {type: 'mousemove', target: '#kitchensink-view-tip-htmltooltips', x: 250, y: 250},
                    {type: 'mouseover', target: '#kitchensink-view-tip-htmltooltips', x: 250, y: 250},
                    {type: 'mousemove', target: '#kitchensink-view-tip-htmltooltips', x: 250, y: 250}
                ]);
            } else {
                ST.play([
                    { type: 'touchstart', target: '#kitchensink-view-tip-htmltooltips', x: 250, y: 250 },
                    { type: 'touchmove', target: '#kitchensink-view-tip-htmltooltips', x: 250, y: 250 },
                    { type: 'touchend', target: '#kitchensink-view-tip-htmltooltips', x: 250, y: 250 }
                ]);
            }
        });
        it('Should be inline Tip 1', function(){
            if(ST.os.deviceType === 'Desktop'){
                ST.play([
                    {type: 'mouseenter', target: "//div[@class='qtip-item color1']"},
                    {type: 'mousemove', target: "//div[@class='qtip-item color1']"},
                    {type: 'mouseover', target: "//div[@class='qtip-item color1']"},
                    {type: 'mousemove', target: "//div[@class='qtip-item color1']"}
                ]);
            } else {
                ST.play([
                    { type: 'touchstart', target:"//div[@class='qtip-item color1']" },
                    { type: 'touchend', target:"//div[@class='qtip-item color1']" }
                ]);
            }
            Tooltips.getTooltip()
                .visible()
                //needed for IE
                .wait(function(f){
                    return (f.getHtml() != null);
                })
                .and(function(){
                    expect(this.future.cmp.getHtml()).toBe('This tip is inline');
                    expect(this.future.cmp.getAlign()).toBe('?');
                });
        });
        it('Should be Fixed width inline Tip 2', function(){
            if (ST.os.deviceType === 'Desktop') {
                ST.play([{type: 'mouseover', target: "//div[@class='qtip-item color2']"}]);
            } else {
                ST.play([
                    { type: 'touchstart', target:"//div[@class='qtip-item color2']" },
                    { type: 'touchend', target:"//div[@class='qtip-item color2']" }
                ]);
            }
            Tooltips.getTooltip().visible()
                .and(function(){
                    expect(this.future.cmp.getHtml()).toBe('This tip has a fixed width');
                    expect(this.future.cmp.getAlign()).toBe('?');
                    expect(this.future.cmp.getWidth()).toBe(400);
                });
        });
        it('Should be inline Tip 3 with title', function(){
            if(ST.os.deviceType === 'Desktop'){
                ST.play([{type: 'mouseover', target: "//div[@class='qtip-item color3']"}]);
            } else {
                ST.play([
                    { type: 'touchstart', target:"//div[@class='qtip-item color3']" },
                    { type: 'touchend', target:"//div[@class='qtip-item color3']" }
                ]);
            }
            Tooltips.getTooltip()
                .visible()
                //needed for IE
                .wait(function(f){
                    return (f.getHtml() != null);
                })
                .and(function(){
                    expect(this.future.cmp.getHtml()).toBe('This tip has a title');
                    expect(this.future.cmp.getTitle()).toBe('The title');
                    expect(this.future.cmp.getAlign()).toBe('?');
                });
        });
        it('Should be inline Tip 4 align top', function(){
            if(ST.os.deviceType === 'Desktop'){
                ST.play([{type: 'mouseover', target: "//div[@class='qtip-item color4']"}]);
            } else {
                ST.play([
                    { type: 'touchstart', target:"//div[@class='qtip-item color4']" },
                    { type: 'touchend', target:"//div[@class='qtip-item color4']" }
                ]);
            }
            Tooltips.getTooltip()
                .visible()
                //needed for IE
                .wait(function(f){
                    return (f.getHtml() != null);
                })
                .and(function(){
                    expect(this.future.cmp.getHtml()).toBe('Aligned top');
                    expect(this.future.cmp.getAlign()).toBe('bl-tl?');
                });
        });
        /**
         * These function getTooltipVisible and getTooltipHidden are due to warning message "Don't make function within a loop."
         **/
        function getTooltipVisible(){
            Tooltips.getTooltip().visible()
                .and(function(){
                    expect(this.future.cmp.getHidden()).toBe(false);
                });
        }
        function getTooltipHidden(){
            Tooltips.getTooltip().hidden()
                .and(function(){
                    expect(this.future.cmp.getHidden()).toBe(true);
                });
        }
        it('Should automatically hide tips', function(){
            var cmdPlay;
            var cmdOutside;
            if(ST.os.deviceType === 'Desktop'){
                cmdPlay = [
                    [{ type: 'mouseover', target:"//div[@class='qtip-item color1']" }],
                    [{ type: 'mouseover', target:"//div[@class='qtip-item color2']" }],
                    [{ type: 'mouseover', target:"//div[@class='qtip-item color3']" }],
                    [{ type: 'mouseover', target:"//div[@class='qtip-item color4']" }]
                ];
                cmdOutside = [{ type: "mouseover", target: "#kitchensink-view-tip-htmltooltips", x: 250, y: 250 }];
            } else {
                cmdPlay= [
                    [{ type: 'touchstart', target:"//div[@class='qtip-item color1']" },
                    { type: 'touchend', target:"//div[@class='qtip-item color1']" }],
                    [{ type: 'touchstart', target:"//div[@class='qtip-item color2']" },
                    { type: 'touchend', target:"//div[@class='qtip-item color2']" }],
                    [{ type: 'touchstart', target:"//div[@class='qtip-item color3']" },
                    { type: 'touchend', target:"//div[@class='qtip-item color3']" }],
                    [{ type: 'touchstart', target:"//div[@class='qtip-item color4']" },
                    { type: 'touchend', target:"//div[@class='qtip-item color4']" }]
                ];
                cmdOutside = [
                    { type: 'touchstart', target: '#kitchensink-view-tip-htmltooltips', x:250, y:250 },
                    { type: 'touchend', target: '#kitchensink-view-tip-htmltooltips', x:250, y:250 }
                ];
            }
            for( var i = 0; i < 4; i++){
                ST.play(cmdPlay[i]);
                getTooltipVisible();
                ST.play(cmdOutside);
                getTooltipHidden();
            }
        });
    });
    describe('Source code', function(){
        it('Source code view should work correctly', function(){
            Lib.sourceClick('.tip.HtmlToolTips');
        });
    });
    }
});
