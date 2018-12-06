/**
 * @file Treemap.js
 * @date 18.8.2016
 * Tested: Chrome, Firefox, Edge, IE11, Safari 7, Android phone/tablet, iPad, iPhone
 *
 */

 describe("Treemap example", function(){
    var nodeNames = ["SomeNode1", "SomeNode2", "SomeNode3", "SomeNode4", "SomeNode5", "SomeNode6", "SomeNode7", "SomeNode8", "SomeNode9", "SomeNode10"];
    var nodeNumbers = [];
    var Treemap = {
        treemapItself: function () {
            return ST.component("d3-treemap");
        },
        nodeElement: function(nth){
            return ST.element("d3-treemap => .x-d3-node:nth-child(" + nth + ")");
        },
        panelComponent: function(){
            return ST.component(Ext.first("d3-treemap").parent);
        },
        nodeElementPosition: function(nth){
            return Treemap.nodeElement(nth);
        },
        //returned coordinates are moved by 2.5 to ensure that cursor is inside of the node
        tupleFromText: function(text){
            var x, y, txt;
            txt = text.split("(")[1].split(")")[0];
            if(Ext.browser.is.IE || Ext.browser.engineName == "Edge"){
                x = parseFloat(txt.split(" ")[0]);
                y = parseFloat(txt.split(" ")[1]);
            }else{
                x = parseFloat(txt.split(",")[0]);
                y = parseFloat(txt.split(",")[1]);
            }
            x = x || 0;
            y = y || 0;
            return {x:x+2.5, y:y+2.5 };
        },
        tooltip: function(){
            return ST.component("tooltip[renderer=onTooltip]");
        }
    };

    beforeAll(function () {
        Lib.D3.beforeAll("#d3-view-treemap", "d3-treemap");
        ST.wait(function(){
            return Ext.first("d3-treemap")&&Ext.first("d3-treemap").getStore() !== null;
        });
        ST.component("d3-treemap")
            .wait(function(treemap){
                return treemap.el.dom.clientHeight > 0;
            });
        //wait for animation to finish
        ST.wait(function(){
            return !Ext.AnimationQueue.isRunning;
        })
    });

    afterAll(function() {
        Lib.D3.afterAll("d3-treemap");
    });

    describe("Screenshot", function(){
        it("Should look like usual", function(){
            Lib.screenshot("D3_treemap");
        })
    });

    describe("Clicking on nodes", function(){
        var counter =22;
        for(var i = 0; i < 10; i++){
            it("Should click node " + nodeNames[i], function(){
                Lib.D3.clickOnCoordinates("d3-treemap", counter++, 2.5);
                ST.component('viewport')
                    .click(2,2)
            });
        }
    });

    describe("Hovering over nodes", function(){
        var counter = 32;
        for(var i = 0; i < 10; i++){
            it("Should select node " + nodeNames[i] + " on hover", function(){
                Treemap.panelComponent()
                    .and(function(panel){
                        Treemap.nodeElement(counter++) 
                            .and(function(node){
                                var coords = Treemap.tupleFromText(node.dom.attributes.transform.value);
                                if(ST.os.deviceType === "Desktop"){
                                    ST.play([
                                                { type: "mouseover", target: "panel[id=" + panel.getId() + "]", x: coords.x, y: coords.y },
                                                function(){expect(node.dom.className.baseVal).toContain("x-d3-selected");}
                                            ]);
                                }else{
                                    ST.play([
                                                { type: "tap", target: "panel[id=" + panel.getId() + "]", x: coords.x, y: coords.y },
                                                function(){expect(node.dom.className.baseVal).toContain("x-d3-selected");}
                                            ]);
                                }
                                //To ensure that node isn't obscured by tooltip
                                ST.component('viewport')
                                    .click(2,2);
                            });
                    });
            });
        }
    });

    describe("Tooltip", function(){
        var counter = 4;
        for(var i = 0; i < 10; i++){
            it("Should open on long hover " + nodeNames[i], function(){
                Treemap.panelComponent()
                    .and(function(panel){
                        //element and data in store are two indexes apart
                        Treemap.nodeElement(counter)
                            .and(function(node){
                                var coords = Treemap.tupleFromText(node.dom.attributes.transform.value);
                                Treemap.treemapItself()
                                    .and(function(){
                                        if(ST.os.deviceType === "Desktop"){
                                            ST.play([
                                                { type: "mouseover", target: "panel[id=" + panel.getId() + "]", x: coords.x, y: coords.y }
                                            ]);
                                        }else{
                                            ST.play([
                                                { type: "tap", target: "panel[id=" + panel.getId() + "]", x: coords.x, y: coords.y }
                                            ]);
                                        }
                                    })
                                    .and(function(tpl){
                                        var substring = tpl.getStore().getData().getAt(0).data.children[counter-4].description;
                                        if(substring === undefined){
                                            substring = tpl.getStore().getData().getAt(0).data.children[counter-4].name;
                                        }
                                        Treemap.tooltip()
                                            .wait(function(cmp){
                                                return cmp.getHtml().indexOf(substring) !== -1;
                                            })
                                            .and(function(cmp){
                                                expect(cmp.getHtml()).toContain(substring);
                                                counter++;
                                            });
                                    });
                                //To ensure that node isn't obscured by tooltip
                                ST.component('viewport')
                                    .click(2,2);
                            });
                    });
            });
        }
    });
 });