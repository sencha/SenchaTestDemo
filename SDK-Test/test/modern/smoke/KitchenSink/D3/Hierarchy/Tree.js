/**
 * @file Tree.js
 * @name D3/Hierarchy/Tree
 * @created 2016/11/25
 * Tested on Chrome, Firefox, IE11, Edge, iOS phone, iOS Tablet, Android tablet, Android phone
 *
 * 28. 7. 2017
 * tested on:
 *      desktop:
 *          Chrome 59
 *          Edge 15
 *          FF 54
 *          IE 11
 *          Safari 11
 *      tablet:
 *          Edge 14
 *          Safari 10
 *          Android 7.1
 *      phone:
 *          Android 5, 6, 7.0
 */

 describe("Tree", function(){
    var interactions = null;
    var desc = "Hierarchy Tree";
    var initialAnimationDelay = 250;
    var scaling;
    var wrapperTuple;

    var Tree = {
        treeItself : function(){
            return ST.component("d3-tree");
        },
        nthNode : function(nth){
            return ST.element("d3-tree => .x-d3-node:nth-child(" + nth + ")");
        },
        scene : function(){
            return ST.element("d3-tree => .x-d3-scene");
        },
        getScaledCoords: function(scene, node){
            var scale = {x:0, y:-1000};
            //due to Edge bug EXTJS-23800
            if(scene.dom.getAttribute("transform").indexOf("scale") < 0){
                scale.x = 1;
            }
            else{
                scale = Lib.D3.tupleFromText(scene.dom.getAttribute("transform").substr(scene.dom.getAttribute("transform").indexOf("scale")));

            }
            if(((ST.browser.is.Edge || ST.browser.is.IE) && ((scale.y > 1) || (scale.y < 0.1))) || isNaN(scale.y)){
                scale.y = scale.x;
            }
            var coords = Lib.D3.tupleFromText(node.dom.getAttribute("transform"));
            if((ST.browser.is.Edge && coords.y == "NaN") || isNaN(coords.y)){
                coords.y = 0;
            }
            var scaledCoords = {x:0, y:0};
            scaledCoords.x = coords.x * scale.x + wrapperTuple.x;
            scaledCoords.y = coords.y * scale.y + wrapperTuple.y;

            var coordsToClick = Lib.D3.tupleFromText(scene.dom.getAttribute("transform"), scaledCoords.x, scaledCoords.y);
            return coordsToClick;

        },
        /* @param coords - expected array of two numbers*/
        expandCollapseNode: function(d3ChartType, counter, coords){
                var willBeExpanded = 1;
                ST.component(Ext.first(d3ChartType).parent)
                    .and(function(panel){
                        ST.element(d3ChartType + " => .x-d3-node:nth-child(" + counter + ")")
                            .and(function(node){
                                if(node.dom.className.baseVal.indexOf('x-d3-expanded') >= 0){
                                    willBeExpanded = 0;
                                }
                                ST.component("panel[id=" + panel.getId() + "]")
                                    .and(function(){
                                        Lib.Chart.doubleClick(d3ChartType, coords.x, coords.y);
                                    })
                                    .wait(function(){
                                        var value = node.dom.className.baseVal.indexOf('x-d3-expanded');
                                        if(willBeExpanded) {
                                            return value >= 0;
                                        }
                                        else{
                                            return value < 0;
                                        }
                                    })
                            })
                            .and(function(node){
                                if(willBeExpanded) {
                                    expect(node.dom.className.baseVal).toContain("x-d3-expanded");
                                }
                                else{
                                    expect(node.dom.className.baseVal).not.toContain("x-d3-expanded");
                                }
                            });
                    });
        },
        getScaling: function(){
            scaling = 0.9;
            Lib.isPhone ? scaling = 0.2 : scaling;
            Lib.isTablet ? scaling = 0.6 : scaling;
            return scaling;
        }
    };

    beforeAll(function(){
        Lib.D3.beforeAll("#d3-view-tree");
        ST.options.timeout = 15000;
        ST.component('d3-tree')
            .wait(function(tree){
                return tree.el.dom.clientHeight > 0;
            })
            .wait(function(){
                return Ext.ComponentQuery.query("d3-tree")[0].getStore() !== null;
            })
            .rendered();
        ST.component('d3-tree')
            .wait(16*initialAnimationDelay)
            //there has to be wait for rendering nodes
            .wait(function(d3){
                return d3.nodes.length > 20;
            });
        ST.component('d3-tree')
            .down('=> .x-d3-node:nth-child(25)')
            .wait(function(node) {
                var firstX;

                var firstXForm = node.dom.transform.baseVal.getItem(0);
                if (firstXForm.type === SVGTransform.SVG_TRANSFORM_TRANSLATE){
                    firstX = firstXForm.matrix.e;
                }
                return (firstX >= 250)
            })
            .wait(2*initialAnimationDelay);
        ST.component('d3-tree')
            .and(function(){
                //backup positon
                var x = Ext.ComponentQuery.query("d3-tree")[0].getInteractions()[0].translation[0];
                var y = Ext.ComponentQuery.query("d3-tree")[0].getInteractions()[0].translation[1];

                //set scaling
                Ext.ComponentQuery.query("d3-tree")[0].getInteractions()[0].setScaling(Tree.getScaling(), Tree.getScaling());

                //restore position (for having root vertically in the middle
                Ext.ComponentQuery.query("d3-tree")[0].getInteractions()[0].setTranslation(x, y);
            })
            .down('>> g.x-d3-wrapper')
            .and(function(wrapper){
                //getting wrapper transform (d3chart padding)
                wrapperTuple = Lib.D3.tupleFromText(wrapper.dom.getAttribute("transform"));
            })


    });

    afterAll(function(){
        Lib.D3.afterAll("d3-view-tree");
        ST.options.timeout = 5000;
    });

    describe("Take screenshot", function(){
        it("Should take screenshot", function(){
            Lib.screenshot(desc);
        });
    });

    describe("Selecting nodes", function(){
        var counter = 20;
        for(var i = 0; i < 10; i++){
            it("Should select node " + (i + counter) + " on click " + i, function(){
                var coordsToClick;
                Tree.scene()
                    .wait(2 * initialAnimationDelay)
                    .and(function(scene){
                        Tree.nthNode(counter)
                            .and(function(node){
                                coordsToClick = Tree.getScaledCoords(scene, node);
                            })
                            .wait(2 * initialAnimationDelay)
                            .and(function(){
                                //in case of trouble, just use
                                if(!Lib.isPhone) {
                                    ST.element("d3-tree => .x-d3-node:nth-child(" + counter++ + ")").down('circle').click(1,1);
                                }
                                else{
                                    Lib.D3.clickOnCoordinates("d3-tree", counter++, undefined, coordsToClick);
                                }
                            });
                    })
                    .wait(2 * initialAnimationDelay);
            });
        }
    });

    describe("Checking tooltips", function(){
        var counter = 25;
        for(var i = 0; i < 10; i++){
            it("Should display tooltip on node " + (i + counter), function(){
                Tree.scene()
                    .and(function(scene){
                        Tree.nthNode(counter)
                            .and(function(node){
                                var count = node.dom.__data__.data.childNodes.length;
                                var toolString = count + ' item' + (count === 1 ? '' : 's') + ' inside.';
                                //probably was kind of workaround - keep commented for possible future use
                                /*
                                if(!Lib.isPhone){
                                   ST.element("d3-tree => .x-d3-node:nth-child(" + counter++ + ")").down('circle').click(1, 1);
                                   ST.component("tooltip[id^=ext-tooltip]")
                                       .and(function(cmp){
                                           expect(cmp._html).toContain(toolString);
                                       });
                                }
                                */
                                Lib.D3.checkTooltipsOnCoordinates(desc, "d3-tree", counter++, undefined, toolString, Tree.getScaledCoords(scene, node));
                            });
                        
                    });           
            });
        }
    });

    describe("Checking drag support", function(){
        it("Should drag", function(){
            Tree.treeItself()
                .and(function(tree){
                    Lib.Chart.pan(desc, "d3-tree", 1, false, false );  
                });
        });
    });

    describe("Checking source window", function(){
        it("Should open source window when clicked", function() {
            Lib.sourceClick("d3-tree");
        });
    });
});