/**
 * @file HeaderPosition.js
 * @name Component/Panels/HeaderPosition.js
 * @created 2017/5/30
 */

describe("HeaderPosition", function() {
    var prefix = '#kitchensink-view-panels-headerposition ';

    var examplePrefix = "panel-headerposition";
    var exampleUrlPostfix = "#panel-headerposition";

    var btn = ["Top","Right","Bottom","Left"];
    var tools = ["help","print"];
    var buttons;

    var Panels = {
        myButton : function(id) {
            return ST.button(prefix + 'button[id=' + id + ']');
        },
        getHeaderPosition : function() {
            return Ext.first('panel[_title=Panel Title]')._headerPosition;
        },
        myTool : function(type) {
            return ST.component(prefix + 'panel[_title=Panel Title] tool[type='+type+']');
        }
    };

    function testHeaderButton(i){
        it("Click on Button "+btn[i], function () {
            Panels.myButton(buttons[i].id)
                .click()
                .wait(function () {
                    return Panels.getHeaderPosition() == btn[i].toLowerCase();
                })
                .and(function(){
                    expect(Panels.getHeaderPosition()).toBe(btn[i].toLowerCase());
                });
        });
    }

    function stPlayForHoverOver(panelTool){
        ST.play([
            { type: "mouseover", target:panelTool.el},
            { fn:function(){expect(panelTool.el.dom.className).toContain(panelTool.hoveredCls);}},
            { type: "mouseout", target:panelTool.el},
            { fn:function(){expect(panelTool.el.dom.className).not.toContain(panelTool.hoveredCls);}}
        ]);
    }

    function stPlayForPress(panelTool){
        ST.play([
            { type: "mousedown", target: panelTool.el },
            { fn:function(){expect(panelTool.el.dom.className).toContain(panelTool.pressedCls);}},
            { type: "mouseup", target: panelTool.el },
            { type: "click", target: panelTool.el}
        ]);
    }

    function checkHoverOver(i){
        it("Test of mouse hover over the tool: "+tools[i], function(){
            if(Lib.isDesktop){
                Panels.myTool(tools[i])
                    .and(function(panelTool){
                        stPlayForHoverOver(panelTool);
                    });
            }
        });
    }

    function checkPress(i){
        it("Test of mouse press over the tool "+tools[i], function(){
            Panels.myTool(tools[i])
                .and(function(panelTool){
                    stPlayForPress(panelTool);
                });
        });
    }

    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, examplePrefix);
        ST.wait(function(){
                return Ext.ComponentQuery.query(prefix + 'segmentedbutton button').length >= 0;
            })
            .and(function(){
                buttons = Ext.ComponentQuery.query(prefix +'segmentedbutton button');
            });
    });

    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });

    describe("Example loads correctly", function () {
        it("should load correctly", function() {
            Lib.screenshot("UI_panels_headerPosition");
        });
    });

    describe('Test Segmented buttons', function () {
        for (var i = 0; i < btn.length; i++) {
            Lib.testButtons("",btn[i]);
        }
    });

    describe("Is Header position correct?", function () {
        for (var i = 0; i < btn.length; i++) {
            testHeaderButton(i);
        }
    });

    describe("Check hover tool", function () {
        for (var i = 0; i < tools.length; i++) {
            checkHoverOver(i);
        }
    });

    describe("Check press tool", function () {
        for (var i = 0; i < tools.length; i++) {
            checkPress(i);
        }
    });

    describe("Testing of source panel", function () {
        it("Source code", function() {
            Lib.sourceClick('panels.headerPosition');
        });
    });
});
