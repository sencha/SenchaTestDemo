/**
 * modern KS > D3 > Hierarchy > Pack
 * tested on:
 *          desktop:
 *              Chrome 59
 *              Firefox 54
 *              IE 11
 *              Edge 15
 *              Opera 46
 *          tablet:
 *              Safari 10
 *              Android 5
 *          mobile:
 *              Safari 9
 *              Android 7
 *          Sencha Test:
 *              2.1.1.31
 */

describe("Pack", function(){
    var nodeNames = ["test", "CONTRIBUTING.md", "LICENSE", "Makefile", "README.md", "bower.json", "component.json", "composer.json", "d3.js", "d3.min.js", "index.js", "lib", "package.js", "package.json", "src", "bin", "xhr", "arrays", "assert.js", "color", "core", "data", "dsv", "event", "format", "geo", "geom", "XMLHttpRequest.js", "interpolate", "layout", "load.js", "locale", "math", "scale", "selection", "start.js", "svg", "time", "transition", "index-test.js", "colorbrewer", "geographiclib", "penner", "polymaps", "protovis", "rhill-voronoi", "science", "xhr", "behavior", "color", "compat", "core", "d3.js", "dsv", "end.js", "event", "format", "geo", "arrays", "interpolate", "layout", "locale", "math", "scale", "selection", "start.js", "svg", "time", "transition", "geom", "component", "meteor", "start", "uglify"];
    var tooltips = [];
    var desc = "Hierarchy Pack";
    var toolbar = "toolbar[id^=ext-toolbar]";
    var wasExpanded = false;
    var componentName = "d3-pack";

    var Pack = {
        nodeElement: function(nth){
            return ST.element(componentName + " => .x-d3-node:nth-child(" + nth + ")");
        },
        panelComponent: function(){
            return ST.component(Ext.first(componentName).parent);
        },
        getNode: function(nth){
            return Ext.first(componentName).getStore().root.childNodes[nth];
        },
        getNodes: function(counter){
            var element;
            for(var i = 0; i < counter; i++){
                element = Pack.getNode(i);
                if(!element.data.leaf) {
                    tooltips[i] = element.data.children.length + ' files inside';
                }
                else if(element.data.size >= 1000){
                    tooltips[i] = (Math.round((element.data.size*10)/1024))/10 + ' KB';
                }
                else{
                    tooltips[i] = element.data.size + ' bytes';
                }
            }
        },
        checkNodes: function(counter){
            for (var i = 0; i < counter; i++) {
                expect(nodeNames[i]).toBe(Ext.first(componentName).getStore().root.childNodes[i].data.name);
            }

        },
        collapseIfNotExpanded: function(childNodesIndex){
            ST.component(componentName)
                .and(function(d3p){
                    d3p.getStore().root.childNodes[childNodesIndex].collapse();
                })
                .wait(Lib.D3.waitDuration(componentName)) //500 is transitions.layout.duration
                .wait(function(d3p){
                    return !d3p.getStore().root.childNodes[childNodesIndex].data.expanded;
                });
            //to prevent random bug on Android tablet and maybe elsewhere
            ST.wait(Lib.D3.waitDuration(componentName))
        },
        expandIfWasExpanded: function(childNodesIndex){
            ST.component(componentName)
                .and(function(d3p){
                    d3p.getStore().root.childNodes[childNodesIndex].expand();
                })
                .wait(Lib.D3.waitDuration(componentName)) //500 is transitions.layout.duration
                //control of previous state
                .wait(function(d3p){
                    return d3p.getStore().root.childNodes[childNodesIndex].data.expanded;
                });
            //to prevent random bug on Android tablet and maybe elsewhere
            ST.wait(Lib.D3.waitDuration(componentName))
        }
    };

    beforeAll(function () {
        Lib.D3.beforeAll("#d3-view-pack", componentName);
        ST.component(componentName)
            .visible()
            .wait(function(){
                return Ext.first(componentName)&&Ext.first(componentName).getStore() !== null;
            })
            .wait(function () {
                return Ext.first(componentName).el.dom.clientHeight > 0;
            })
            .wait(function () {
                return Ext.first(componentName).nodes !== null;
            })
            .wait(function () {
                return Ext.first(componentName).nodes.length > 1;
            })
            .and(function(){
                Pack.getNodes(Ext.first(componentName).getStore().root.childNodes.length);
            })
    });

    afterAll(function(){
        Lib.D3.afterAll(componentName);
    });

    it("Verify loading and verify count of 16 root items", function(){
        ST.wait(function(){
                return Ext.first(componentName).getStore() !== null;
            })
            .and(function(){
                Pack.checkNodes(Ext.first(componentName).getStore().root.childNodes.length);
                expect(tooltips.length).toBe(16);
            })
    });

    describe("Clicking on nodes and check x-d3-selected (without Root, because could click on something else)", function(){
        it("Check if \"Root\" has cls x-d3-root", function(){
            Pack.panelComponent()
                .and(function(panel){
                    Pack.nodeElement(1)
                        .and(function(node){
                            ST.component("panel[id=" + panel.getId() + "]")
                                .and(function(){
                                    expect(node.dom.className.baseVal).toContain("x-d3-root");
                                })
                        })
                })
        });

        Array.apply(null, Array(5)).map(function (_, i) {return i;}).forEach(function(i){
            it("Should click on node " + nodeNames[i], function(){
                var paddingCoords;
                ST.element(componentName).down('>>g')
                    .and(function(node){
                        paddingCoords = Lib.D3.tupleFromText(node.dom.attributes.transform.value);
                        wasExpanded = Ext.first(componentName).getStore().root.childNodes[i].data.expanded;
                        if(wasExpanded) {
                            Pack.collapseIfNotExpanded(i);
                        }
                        Lib.D3.clickOnCoordinates(componentName, 2+i, paddingCoords);
                        if(wasExpanded){
                            Pack.expandIfWasExpanded(i);
                        }
                        else{
                            ST.wait(function(){
                                return !Ext.first(componentName).getStore().root.childNodes[i].data.expanded;
                            })
                        }
                    })
            })
        });
        Array.apply(null, Array(6)).map(function (_, i) {return i+10;}).forEach(function(i){
            it("Should click on node " + nodeNames[i], function(){
                var paddingCoords;
                ST.element(componentName).down('>>g')
                    .and(function(node){
                        paddingCoords = Lib.D3.tupleFromText(node.dom.attributes.transform.value);
                        wasExpanded = Ext.first(componentName).getStore().root.childNodes[i].data.expanded;
                        if(wasExpanded) {
                            Pack.collapseIfNotExpanded(i);
                        }
                        Lib.D3.clickOnCoordinates(componentName, 2+i, paddingCoords);
                        if(wasExpanded){
                            Pack.expandIfWasExpanded(i);
                        }
                        else{
                            ST.wait(function(){
                                return !Ext.first(componentName).getStore().root.childNodes[i].data.expanded;
                            })
                        }
                    })
            })
        });
    });

    describe("Mouseover and check if tooltip text fits", function(){
        Array.apply(null, Array(16)).map(function (_, i) {return i;}).forEach(function(i){
            it("Mouseover " + nodeNames[i], function(){
                var paddingCoords;
                ST.element(componentName).down('>>g')
                    .and(function(node){
                        paddingCoords = Lib.D3.tupleFromText(node.dom.attributes.transform.value);
                        wasExpanded = Ext.first(componentName).getStore().root.childNodes[i].data.expanded;
                        if(wasExpanded) {
                            Pack.collapseIfNotExpanded(i);
                        }
                        Lib.D3.checkTooltipsOnCoordinates(desc, componentName, 2 + i, paddingCoords, tooltips[i]);
                        if(wasExpanded){
                            Pack.expandIfWasExpanded(i);
                        }
                        else{
                            ST.wait(function(){
                                return !Ext.first(componentName).getStore().root.childNodes[i].data.expanded;
                            })
                        }
                    })
            });
        });
    });
});
