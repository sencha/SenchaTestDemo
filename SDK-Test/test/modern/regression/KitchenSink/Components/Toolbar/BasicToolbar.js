/**
 * @file BasicToolbar.js
 * @name Component/Toolbars/BasicToolbar.js
 * @created 2017/5/30
 */

describe("BasicToolbar", function() {
    var prefix = '#kitchensink-view-toolbars-toolbars ';

    var examplePrefix = "basic-toolbar";
    var exampleUrlPostfix = "#basic-toolbar";

    var btn = ["Default","Option 1","Option 2","Action"];

    var Toolbars = {
        myButton : function(id) {
            return ST.button(prefix + 'button[id=' + id + ']');
        },
        myPanel : function(title) {
            return Ext.first(prefix + 'panel[_title='+ title +']');
        },
        myTool : function(type) {
            return ST.component(prefix + 'panel[_title=Panel Title] tool[type='+type+']');
        }
    };

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

    function checkSegButton(i){
        it("button "+ i +" should load correctly", function() {
            var x = i?0:1;
            Toolbars.myButton(buttons[i].id)
                .click()
                .and(function(button){
                    expect(button.el.dom.className).toContain('x-pressed');
                })
                Toolbars.myButton(buttons[x].id)
                        .and(function(button){
                            expect(button.el.dom.className).not.toContain('x-pressed');
                        });
        });
    }

    describe("Example loads correctly", function () {
        it("should load correctly", function() {
            Lib.screenshot("UI_toolbars_basicToolbars");
        });
    });

    describe('Test Segmented buttons', function () {
        for (var i = 0; i < btn.length; i++) {
            Lib.testButtons("",btn[i]);
        }
    });

    describe('Is Segmented button correctly pressed?', function () {
        for (var i = 0; i < 2; i++) {
            checkSegButton(i);
        }
    });

    describe("Testing of source panel", function () {
        it("Source code", function() {
            Lib.sourceClick('toolbars-basicToolbars');
        });
    });
});
