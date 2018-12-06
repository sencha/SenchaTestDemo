/**
 * @file DockedToolbars.js
 * @name Component/Toolbars/DockedToolbars.js
 * @created 2017/6/6
 */

describe("DockedToolbars", function() {
    var prefix = '#kitchensink-view-toolbars-dockedtoolbars ';

    var examplePrefix = "docked-toolbars";
    var exampleUrlPostfix = "#docked-toolbars";
    var but;
    var Toolbars = {
        myButton : function(id) {
            return ST.button(prefix + 'button[id=' + id + ']');
        },
        myPanel : function(title) {
            return Ext.first(prefix + 'panel[_title='+ title +']');
        },
        myTool : function(type) {
            return ST.component(prefix + 'panel[_title=Panel Title] tool[type='+type+']');
        },
        myMessageBox : function(text) {
            return ST.component('messagebox component[_html=You clicked on the "'+text+'" button!]');
        }
    };

    function stPlayForHoverOver(button){
        ST.play([
            { type: "mouseenter", target:button.el},
            { type: "mousemove", target:button.el},
            { type: "mouseover", target:button.el},
            { type: "mouseout", target:button.el},

            { fn:function(){expect(button.el.dom.className).toContain(button.hoveredCls);}},
            { type: "mouseout", target:button.el},

            { type: "mousemove", target: button.el, x: 0, y: 0 },
            { type: "mouseup", target: button.el, x: 0, y: 0 },
            { type: "mouseleave", target: button.el, x: 0, y: 0 },

            { fn:function(){ST.wait(function(){return button.el.dom.className.split(" ")[7]!='x-hovered';})}},
            { fn:function(){expect(button.el.dom.className).not.toContain(button.hoveredCls);}}
        ]);
    }

    function checkHoverOver(i){
        if(Lib.isDesktop){
            it("Test of mouse hover over the tool: "+i, function(){
                Toolbars.myButton(but[i].id)
                    .and(function(button){
                        stPlayForHoverOver(button);
                    });
            });
        }
    }

    function stPlayForPress(button){
        ST.play([
            { type: "mousedown", target: button.el },
            { fn:function(){expect(button.el.dom.className).toContain('x-pressing');}},
            { type: "mouseup", target: button.el },
            { type: "click", target: button.el}
        ]);
    }

    function checkPress(i){
        it("Test of mouse press over the tool "+i, function(){
            Toolbars.myButton(but[i].id)
                .and(function(button){
                    stPlayForPress(button);
                });
        });
    }

    function buttonsPanel(textBut,text){
        beforeAll(function() {
            ST.button('button[_text='+textBut+'][handler=on' + text + ']')
                .click()
                .visible()
                .and(function(){
                    Toolbars.myMessageBox(text).visible()
                })
        });
        it('Test messagebox - You clicked on the "'+text+'" button!', function () {
            Toolbars.myMessageBox(text)
                .and(function(){
                    ST.component('messagebox[_title=Button Click] button')
                        .click()
                })
                .hidden(); // will timeout and produce an error
        });
    }

    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, examplePrefix);
        ST.wait(function(){
                return Ext.ComponentQuery.query(prefix + 'button').length >= 20;
            })
            .and(function(){
                var ab = Ext.ComponentQuery.query(prefix+ 'button');
                but = ab.slice(0, (ab.length-3));
            });
    });

    afterAll(function(){
        Lib.afterAll(examplePrefix);
    });

    describe("Example loads correctly", function () {
        it("should load correctly", function() {
            Lib.screenshot("UI_toolbars_basicToolbars");
        });
    });

    describe('Test pressing buttons', function () {
        for (var i = 0; i < 18; i++) {
            checkPress(i);
        }
    });

    describe('Test Hover buttons', function () {
        for (var i = 0; i < 18; i++) {
            checkHoverOver(i);
        }
    });

    describe('Test buttons in button panel', function () {
        describe('Test OK button', function () {
            buttonsPanel('OK','Ok')
        });

        describe('Test Cancel button', function () {
            buttonsPanel('Cancel','Cancel')
        });

        describe('Test Help button', function () {
            buttonsPanel('Help','Help')
        });
    });

    describe("Testing of source panel", function () {
        it("Source code", function() {
            Lib.sourceClick('toolbars-dockedToolbars');
        });
    });
});
