/**
 * modern KS > D3 > Hierarchy > Zoomable Sunburst
 * tested on:
 *          desktop:
 *              Chrome 54
 *              Firefox 45
 *              IE 11
 *              Edge 14
 *              Opera 41
 *          tablet:
 *              Safari 7, 8
 *              Android 5, 6
 *              Windows 10 Edge
 *          mobile:
 *              Safari 9
 *              Android 5,6
 *              Windows phone 10 Edge
 *          themes:
 *              Triton
 *              Neptune
 *              iOS
 *              Material
 *          OS:
 *              Windows 10 (desktop, tablet, mobile)
 *              iOS 7, 8, 9
 *              Android 5,6
 *          Sencha Test:
 *              2.0.0.236
 */

describe("Zoomable Sunburst", function(){
    var initialAnimationDelay = 250;

    var nodeNames = ["test", "CONTRIBUTING.md", "LICENSE", "Makefile", "README.md", "bower.json", "component.json", "composer.json", "d3.js", "d3.min.js", "index.js", "lib", "package.js", "package.json", "src", "bin", "xhr", "arrays", "assert.js", "color", "core", "data", "dsv", "event", "format", "geo", "geom", "XMLHttpRequest.js", "interpolate", "layout", "load.js", "locale", "math", "scale", "selection", "start.js", "svg", "time", "transition", "index-test.js", "colorbrewer", "geographiclib", "penner", "polymaps", "protovis", "rhill-voronoi", "science", "xhr", "behavior", "color", "compat", "core", "d3.js", "dsv", "end.js", "event", "format", "geo", "arrays", "interpolate", "layout", "locale", "math", "scale", "selection", "start.js", "svg", "time", "transition", "geom", "component", "meteor", "start", "uglify"];
    var namesByChildrenCount = ["test", "xhr", "arrays", "assert.js", "color", "core", "data", "dsv", "event", "format", "geo", "geom","XMLHttpRequest.js", "interpolate", "layout", "load.js", "locale", "math", "scale", "selection","start.js", "svg", "time", "transition", "index-test.js", "CONTRIBUTING.md", "LICENSE","Makefile", "README.md", "bower.json", "component.json", "composer.json", "d3.js", "d3.min.js","index.js", "lib", "colorbrewer", "geographiclib", "penner", "polymaps", "protovis","rhill-voronoi", "science", "package.js", "package.json", "src", "xhr", "behavior", "color","compat", "core", "d3.js", "dsv", "end.js", "event", "format", "geo", "arrays", "interpolate", "layout", "locale", "math", "scale", "selection", "start.js", "svg", "time", "transition", "geom", "bin","component", "meteor", "start", "uglify"];
    var tooltips = [];
    var desc = "Hierarchy Zoomable Sunburst";
    var toolbar = "toolbar[id^=ext-toolbar]";

    var childrenNodes;
    var clientWidth;
    var clientHeight;

    var Sunburst = {
        nodeElement: function(nth){
            return ST.element("d3-sunburst => .x-d3-node:nth-child(" + nth + ")");
        },
        panelComponent: function(){
            return ST.component(Ext.first("d3-sunburst").parent);
        },
        getNode: function(nth){
            return Ext.ComponentQuery.query('d3-sunburst')[0].getStore().root.childNodes[nth];
        },
        getNodes: function(counter){
            var element;
            for(var i = 0; i < counter; i++){
                element = Sunburst.getNode(i);
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
                expect(namesByChildrenCount[i]).toBe(Ext.ComponentQuery.query('d3-sunburst')[0].getStore().getData().getAt(i).data.name);
            }
        }
    };

    beforeAll(function () {
        Lib.D3.beforeAll("#d3-view-sunburst-zoom", "d3-sunburst");
        ST.wait(function(){
                return Ext.first("d3-sunburst")&&Ext.first("d3-sunburst").getStore() !== null;
            })
            .wait(function(){
                return Ext.first("d3-sunburst").el.dom.clientHeight > 0;
            })
            .wait(function(){
                return Ext.first("d3-sunburst").nodes !== null;
            })
            .wait(function(){
                return Ext.first("d3-sunburst").nodes.length > 1;
            })
            .and(function(){
                childrenNodes = Ext.first("d3-sunburst").nodes;
                Sunburst.getNodes(Ext.ComponentQuery.query('d3-sunburst')[0].getStore().root.childNodes.length);
            });
        ST.element("d3-sunburst")
            .and(function(s){
                clientWidth = s.dom.clientWidth;
                clientHeight = s.dom.clientHeight;
            })
            //this is probably important for Safari 8 iPhone - it is failing when only some subtests are running
            .wait(1000);
    });

    afterAll(function(){
        Lib.D3.afterAll("d3-sunburst");
    });

    it("Verify loading and verify count of 16 root items", function(){
        ST.wait(function(){
                return Ext.first("d3-sunburst").getStore() !== null;
            })
            .and(function(){
                Sunburst.checkNodes(74);
                expect(tooltips.length).toBe(16);
            });
    });

    describe("Check if store is not changed", function(){
        Array.apply(null, Array(nodeNames.length)).map(function (_, i) {return i;}).forEach(function(i){
            it("Should fit name " + nodeNames[i] + " or " + namesByChildrenCount[i] + " and order: " + i, function(){
                expect(nodeNames[i]).toBe(childrenNodes[i + 1].data.raw.name);
                ST.element("d3-sunburst => .x-d3-node:nth-child(" + Number(i+2) + ")")
                    .and(function(node) {
                        expect(nodeNames[i]).toBe(node.dom.textContent);
                    });
            });
        });
    });

    describe("Clicking on nodes in 1st level and check x-d3-selected (without Root)", function() {
        it("Check if \"Root\" has cls x-d3-root", function () {
            Sunburst.panelComponent()
                .and(function (panel) {
                    Sunburst.nodeElement(1)
                        .and(function (node) {
                            ST.component("panel[id=" + panel.getId() + "]")
                                .and(function () {
                                    expect(node.dom.className.baseVal).toContain("x-d3-root");
                                });
                        });
                });
        });
        
        //CONTRIBUTING.md make test fail when run after 'bin', because tooltip covers middle node, so it can't be selected (even by finger)
        ['test', 'lib', 'src', 'bin', 'CONTRIBUTING.md'].forEach(function (i) {
            it("Should click on node " + i + " and check if selected", function () {
                var nodes;
                var index;
                ST.element("d3-sunburst => .x-d3-node[data-id=\"d3/" + i + "\"] text")
                    .and(function (node) {
                        nodes = Ext.ComponentQuery.query("d3-sunburst")[0].nodes;
                        index = Lib.D3.getIndex(nodes, i);
                        
                        var radius = node.dom.getAttribute('x');
                        var rotate = node.dom.getAttribute('transform').replace('rotate(', '').replace(')', '');
                        var padding = node.dom.getAttribute('dx');
                        //*1 because otherwise there is concatenation instead of addition
                        radius = radius * 1 + 2 * padding;

                        //counting x, y coordinates from polar coordinates
                        var coordinates = Lib.D3.polarToCartesian(radius, rotate);
                        //putting coordinates in the middle of the svg canvas
                        coordinates = {
                            x: coordinates.x + (clientWidth / 2),
                            y: (clientHeight / 2) + coordinates.y
                        };

                        Lib.D3.clickOnCoordinates("d3-sunburst", "\"d3/" + i + "\"", 20, coordinates);
                    })
                if(Lib.isPhone){
                    ST.component("d3-sunburst")
                        .click(1,1);
                }
                ST.wait(4 * initialAnimationDelay);
                //click back on "root" for going to initial state
                ST.element("d3-sunburst")
                    .click((5 + (clientWidth/2)), (5 + clientHeight/2));
                if(Lib.isPhone){
                    ST.component("d3-sunburst")
                        .click(1,1);
                }
                //wait for finnish animation
                ST.wait(4 * initialAnimationDelay);
            });
        });
    });
    
    describe("Clicking on nodes in 2nd level and check x-d3-selected", function(){
        ['test/geom', 'lib/colorbrewer', 'src/xhr', 'bin/uglify'].forEach(function(i){
            it("Should click on node " + i + " and check if selected", function(){
                ST.element("d3-sunburst => .x-d3-node[data-id=\"d3/" + i + "\"] text")
                    .and(function(node) {
                        var radius = node.dom.getAttribute('x');
                        var rotate = node.dom.getAttribute('transform').replace('rotate(', '').replace(')', '');
                        var padding = node.dom.getAttribute('dx');
                        //*1 because otherwise there is concatenation instead of addition
                        radius = radius*1 + 2*padding;

                        //counting x, y coordinates from polar coordinates
                        var coordinates = Lib.D3.polarToCartesian(radius, rotate);
                        //putting coordinates in the middle of the svg canvas
                        coordinates = {
                            x: coordinates.x + (clientWidth / 2), 
                            y: (clientHeight / 2) + coordinates.y
                        };

                        Lib.D3.clickOnCoordinates("d3-sunburst", "\"d3/" + i + "\"", 20, coordinates);
                    })
                    .wait(4*initialAnimationDelay)
                    .and(function(){
                        var d = Ext.DomQuery.select('.x-d3-node[data-id="root"] path')[0].getAttribute('d').replace('M0,', '').replace('M 0 0 Z', '0');
                        expect(parseFloat(d)).toBe(0);
                    });

                //click back on "root" (twice) for going to initial state
                if(Lib.isPhone){
                    ST.component("d3-sunburst")
                        .click(1,1);
                }
                ST.element("d3-sunburst")
                    .wait(500, function(){
                        var d = Ext.DomQuery.select('.x-d3-node[data-id="root"] path')[0].getAttribute('d');
                        return d === "M0,0Z" || d === "M 0 0 Z";
                    })
                    .and(function(){
                        var d = Ext.DomQuery.select('.x-d3-node[data-id="root"] path')[0].getAttribute('d').replace('M0,', '').replace('M 0 ', '').replace('0Z', '0');
                        expect(parseFloat(d)).toBe(0);
                    })
                    .click((5 + (clientWidth/2)), (5 + clientHeight/2))
                    .wait(4*initialAnimationDelay)
                    .click((5 + (clientWidth/2)), (5 + clientHeight/2))
                    //wait for finnish animation
                    .wait(4*initialAnimationDelay);
            });
        });
    });

    describe("Mouseover and check if tooltip text fits - 1st level", function(){
        afterEach(function(){
            if(!Lib.isDesktop){
                ST.wait(4*initialAnimationDelay);
                ST.component("d3-sunburst")
                    .click((5 + (clientWidth/2)), (5 + clientHeight/2));
                ST.wait(4*initialAnimationDelay);
            }
            else{
                ST.component("d3-sunburst")
                    .click(1,1);
            }
            
        });

        Array.apply(null, Array(16)).map(function (_, i) {return i;}).forEach(function(i){
            it("Mouseover " + nodeNames[i], function(){
                ST.element("d3-sunburst => .x-d3-node[data-id=\"d3/" + nodeNames[i] + "\"] text")
                    .and(function(node) {
                        var radius = node.dom.getAttribute('x');
                        var rotate = node.dom.getAttribute('transform').replace('rotate(', '').replace(')', '');
                        var padding = node.dom.getAttribute('dx');

                        //*1 because otherwise there is concatenation instead of addition
                        radius = radius * 1 + 2 * padding;

                        //counting x, y coordinates from polar coordinates
                        var coordinates = Lib.D3.polarToCartesian(radius, rotate);
                        //putting coordinates in the middle of the svg canvas
                        coordinates = {
                            x: coordinates.x + (clientWidth / 2),
                            y: (clientHeight / 2) + coordinates.y
                        };
                        Lib.D3.checkTooltipsOnCoordinates( desc, "d3-sunburst", "\"d3/" + nodeNames[i] + "\"", 20, tooltips[i], coordinates);
                    })
                if(Lib.isPhone){
                    ST.component("d3-sunburst")
                        .click(1,1);
                }
            }, 30 * 1000);
        });
    });

    describe("Mouseover and check if tooltip text fits - 2nd level", function(){
        afterEach(function(){
            if(!Lib.isDesktop){
                ST.wait(4*initialAnimationDelay);
                ST.component("d3-sunburst")
                    .click((5 + (clientWidth/2)), (5 + clientHeight/2));
                ST.wait(4*initialAnimationDelay);
            }
            else{
                ST.component("d3-sunburst")
                    .click(1,1);
            }
        });
        var tooltips2 = {
            geom: '5 files inside.',
            colorbrewer: '3 files inside.',
            xhr: '6 files inside.',
            uglify: '890 bytes'
        };
        
        ['test/geom', 'lib/colorbrewer', 'src/xhr', 'bin/uglify'].forEach(function(i){
            it("Mouseover " + i, function(){
                ST.element("d3-sunburst => .x-d3-node[data-id=\"d3/" + i + "\"] text")
                    .and(function(node) {
                        var radius = node.dom.getAttribute('x');
                        var rotate = node.dom.getAttribute('transform').replace('rotate(', '').replace(')', '');
                        var padding = node.dom.getAttribute('dx');

                        //*1 because otherwise there is concatenation instead of addition
                        radius = radius*1 + 2*padding;

                        //counting x, y coordinates from polar coordinates
                        var coordinates = Lib.D3.polarToCartesian(radius, rotate);
                        //putting coordinates in the middle of the svg canvas
                        coordinates = {
                            x: coordinates.x + (clientWidth / 2), 
                            y: (clientHeight / 2) + coordinates.y
                        };
                        
                        Lib.D3.checkTooltipsOnCoordinates( desc, "d3-sunburst", "\"d3/" + i + "\"", 20, tooltips2[i.split('\/')[1]], coordinates);
                    })
                    if(Lib.isPhone){
                        ST.component("d3-sunburst")
                            .click(1,1);
                    }
                    if(!Lib.isDesktop){
                        ST.component("d3-sunburst")
                            .click((5 + (clientWidth/2)), (5 + clientHeight/2));
                    }
                        
            }, 30 * 1000);
        });
        
        //TODO
        //ST.component("d3-sunburst => .x-d3-node[data-id=\"d3/" + i.split('\/')[0] + "\"]")
        //                      .click()
    });

    //expanded is always true for non-leaf nodes
    describe("Verify 2-level tree - expanded is always true in non-leaf nodes", function(){
        it("Verify 'bin/uglify'", function(){
            var nodes;
            var index;
            ST.element("d3-sunburst => .x-d3-node[data-id=\"d3/bin/uglify\"] text")
                .and(function(node) {
                    var radius = node.dom.getAttribute('x');
                    var rotate = node.dom.getAttribute('transform').replace('rotate(', '').replace(')', '');
                    var padding = node.dom.getAttribute('dx');

                    //*1 because otherwise there is concatenation instead of addition
                    radius = radius*1 + 2*padding;

                    //counting x, y coordinates from polar coordinates
                    var coordinates = Lib.D3.polarToCartesian(radius, rotate);
                    //putting coordinates in the middle of the svg canvas
                    coordinates = {
                        x: coordinates.x + (clientWidth / 2),
                        y: (clientHeight / 2) + coordinates.y
                    };
                    ST.component(Ext.first("d3-sunburst").parent)
                        .click(coordinates)
                        .and(function(){
                            nodes = Ext.ComponentQuery.query("d3-sunburst")[0].nodes;
                            index = Lib.D3.getIndex(nodes, 'bin/uglify');
                            console.log(index);
                            expect(nodes[index].data.data.leaf).toBeTruthy();
                            expect(nodes[index].data.data.expanded).toBeFalsy();
                        })
                        .and(function(){
                            nodes = Ext.ComponentQuery.query("d3-sunburst")[0].nodes;
                            index = Lib.D3.getIndex(nodes, 'bin');
                            console.log(index);
                            expect(nodes[index].data.data.expanded).toBeTruthy();
                        })
                        .wait(4*initialAnimationDelay);
            });
            if(!Lib.isDesktop){
                ST.component("d3-sunburst")
                    .click(1,1);
            }
            ST.component("d3-sunburst")
                .click((5 + (clientWidth/2)), (5 + clientHeight/2))
                .and(function(){
                    nodes = Ext.ComponentQuery.query("d3-sunburst")[0].nodes;
                    index = Lib.D3.getIndex(nodes, 'bin');
                    expect(nodes[index].data.data.expanded).toBeTruthy();
                })
                .wait(4*initialAnimationDelay);
                
            ST.component("d3-sunburst")
                .click((5 + (clientWidth/2)), (5 + clientHeight/2))
                .and(function(){
                    nodes = Ext.ComponentQuery.query("d3-sunburst")[0].nodes;
                    expect(nodes[0].data.data.expanded).toBeTruthy();
                })
                .and(function(){
                    nodes = Ext.ComponentQuery.query("d3-sunburst")[0].nodes;
                    index = Lib.D3.getIndex(nodes, 'bin');
                    expect(nodes[index].data.data.expanded).toBeTruthy();
                })
                .wait(4*initialAnimationDelay);

            if(!Lib.isDesktop){
                ST.component("d3-sunburst")
                    .click(1,1);
            }
        });
    });
});
