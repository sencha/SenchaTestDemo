describe("Panel", function() {
    var prefix = "#kitchensink-view-panels-basicpanel";
    var panelBuiltToolValues = ['minimize', 'refresh', 'search', 'save', 'menu'];
    var panelCustomToolValues = ['x-fa fa-wrench', 'x-fa fa-reply', 'x-fa fa-reply-all'];
    
    var Components = {
        panelWithoutTitle : function(){
            return ST.component(prefix + " panel[_title=null]");
        },
        panelWithTitle: function(){
            return ST.component(prefix + " panel[_title=Title]");
        },
        panelBuiltIn: function(){
            return ST.component(prefix + " panel[_title^=Built]");
        },
        panelCustomTools: function(){
            return ST.component(prefix + " panel[_title^=Custom]");
        },
        panelBuiltInChilds: function(type){
           return ST.component(prefix + " panel[_title^=Built] paneltool[_type="+ type +"]");
        },
        panelCustomToolsChilds: function(icon){
           return ST.component(prefix + " panel[_title^=Custom] paneltool[_iconCls="+ icon+"]");
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

    function checkHoverOver(value){
        if(ST.os.is.Desktop){
            if(value.indexOf('x-fa fa-')>-1){
                it("Test of mouse hover over the button with _iconCls: " + value, function(){
                    Components.panelCustomToolsChilds(value)
                    .and(function(panelTool){
                        stPlayForHoverOver(panelTool);
                    });
                });
            }else{
                it("Test of mouse hover over the button with _type: " + value, function(){
                    Components.panelBuiltInChilds(value)
                    .and(function(panelTool){
                        stPlayForHoverOver(panelTool);
                    });
                });
            }
        }
    }
    
    function checkPress(value){
        if(value.indexOf('x-fa fa-')>-1){
            it("Test of mouse press over the button with _iconCls: " + value, function(){
                Components.panelCustomToolsChilds(value)
                .and(function(panelTool){
                    stPlayForPress(panelTool);
                });
            });
        }else{
           it("Test of mouse press over the button with _type: " + value, function(){
                Components.panelBuiltInChilds(value)
                .and(function(panelTool){
                    stPlayForPress(panelTool);
                });
            }); 
        }
    }
    
    function checkIconNames(value){
        if(value.indexOf('x-fa fa-')>-1){
            it("Test of pressence of icon with _iconCls: " + value, function(){
                Components.panelCustomToolsChilds(value)
                .and(function(panelTool){
                    expect(panelTool._iconCls).toContain(value);
                });
            });
        }else{
           it("Test of pressence of icon with _type: " + value, function(){
                Components.panelBuiltInChilds(value)
                .and(function(panelTool){
                    expect(panelTool._type).toContain(value);
                });
            }); 
        }
    }
    
    
    beforeAll(function(){
        Lib.beforeAll('#panel-basic', prefix);
    });
    
    afterAll(function(){
        Lib.afterAll(prefix);
    });
    
    describe("All Panels are loaded and rendered", function(){
        it('screenshot should be same', function () {
            Lib.screenshot("modern_panels");
        });
        it("Panel without title is loaded", function(){
            Components.panelWithoutTitle()
            .visible()
            .and(function(panel){
               expect(panel.rendered).toBeTruthy();
            });
        });
       
        it("Panel with title Title is loaded", function(){
            Components.panelWithTitle()
            .visible()
            .and(function(panel){
               expect(panel.rendered).toBeTruthy();
            });
        });
       
        it("Panel with title 'Built In Tools' is loaded", function(){
            Components.panelBuiltIn()
            .visible()
            .and(function(panel){
               expect(panel.rendered).toBeTruthy();
            });
        });
       
        it("Panel with title 'Custom Tools' is loaded", function(){
            Components.panelCustomTools()
            .visible()
            .and(function(panel){
               expect(panel.rendered).toBeTruthy();
            });
        });
    });
    
    describe("Panel Tests", function(){
        describe("Test of Panel with Built in buttons", function(){
            for(var i = 0; i < panelBuiltToolValues.length; i++){
                describe("Test of button " + panelBuiltToolValues[i], function(){
                    checkIconNames(panelBuiltToolValues[i]);
                    checkHoverOver(panelBuiltToolValues[i]);
                    checkPress(panelBuiltToolValues[i]);
                });
            }
        });
        
        describe("Test of Panel with Custom icons", function(){
            for(var i = 0; i < panelCustomToolValues.length; i++){
                describe("Test of button with IconCls " + panelCustomToolValues[i], function(){
                    checkIconNames(panelCustomToolValues[i]);
                    checkHoverOver(panelCustomToolValues[i]);
                    checkPress(panelCustomToolValues[i]);
                });
            }
        });
    });
    it("should open source window when clicked", function() {
        Lib.sourceClick('KitchenSink.view.panels.BasicPanel');
    });
});