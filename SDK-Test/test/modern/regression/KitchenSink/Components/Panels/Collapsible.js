/**
 * @file Collapsible.js
 * @name Component/Panels/Collapsible.js
 * @created 2017/5/30
 */

describe("Panel Collapsible", function() {
    var prefix = '#kitchensink-view-panels-collapsible ';

    var examplePrefix = "panel-collapsible";
    var exampleUrlPostfix = "#panel-collapsible";

    var panelTitle = ["Right collapsible","Top Collapsible Panel"];

    var tools;

    var Panels = {
        myTool : function(id) {
            return ST.component(prefix + ' paneltool[id='+id+']');
        },
        isTopPanelCollapsed : function(id) {
            return Ext.first(prefix).getCollapsed();
        },
        isRightPanelCollapsed : function(id) {
            return Ext.first(prefix+'panel').getCollapsed();
        }
    };

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
        it("Test of mouse hover over the tool on panel: "+panelTitle[i], function(){
            Panels.myTool(tools[i].id)
                .and(function(panelTool){
                    stPlayForHoverOver(panelTool);
                });
        });
    }

    function checkPress(i){
        it("Test of mouse press over the tool on panel "+panelTitle[i], function(){
            Panels.myTool(tools[i].id)
                .and(function(panelTool){
                    stPlayForPress(panelTool);
                });
        });
    }

    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, examplePrefix);
        ST.wait(function(){
                return Ext.ComponentQuery.query(prefix + 'tool').length >= 0;
            })
            .and(function(){
                tools = Ext.ComponentQuery.query(prefix +' paneltool').reverse(); // 0 - right, 1 - top.
            });
    });

    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });

    describe("Example loads correctly", function () {
        it("should load correctly", function() {
            Lib.screenshot("UI_panels_collapsible");
        });
    });

    describe("Check Collapsing", function () {

        it("Is right panel collapsed?", function(){
            var isCol;
            Panels.myTool(tools[0].id)
                .and(function(){
                    isCol = Panels.isRightPanelCollapsed();
                })
                .click()
                .wait(function () {
                    Lib.waitOnAnimations();
                    return (Panels.isRightPanelCollapsed() != isCol);
                })
                .and(function(){
                    expect(Panels.isRightPanelCollapsed()).not.toBe(isCol);
                })
                .click();
        });

        it("Is top panel collapsed?", function(){
            var isCola;
            Panels.myTool(tools[1].id)
                .and(function(){
                    isCola = Panels.isTopPanelCollapsed();
                })
                .click()
                .wait(function () {
                    Lib.waitOnAnimations();
                    return (Panels.isTopPanelCollapsed() != isCola);
                })
                .and(function(){
                    expect(Panels.isTopPanelCollapsed()).not.toBe(isCola);
                })
                .click();
        });
    });
    if(Lib.isDesktop) {
        describe("Check hover tool", function () {
            for (var i = 0; i < 2; i++) {
                checkHoverOver(i);
            }
        });
    }

    describe("Check press tool", function () {
        for (var i = 0; i < 2; i++) {
            checkPress(i);
        }
    });

    describe("Testing of source panel", function () {
        it("Source code", function() {
            Lib.sourceClick('panels.Collapsible');
        });
    });
});
