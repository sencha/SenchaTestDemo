/**
 * @file ToolbarOverflow.js
 * @name Component/Toolbars/ToolbarOverflow.js
 * @created 2017/8/30
 */

describe("Toolbars Overflow", function() {

    if (Lib.isPhone) {
        it('Example is not available on phone devices', function() {
            pending('This examples are not for mobile devices');
        });
    }
    else{
        var prefix = '#kitchensink-view-toolbars-overflow ';
        var examplePrefix = "toolbar-overflow"

        var menuBar = ['Menu','Cut','Copy','Paste','Format','Bold', 'Underline', 'Italic']
        var overflowbarRight,overflowbarTop

        var Toolbar = {
            //type = direct of move - up,down,left, right
            panelTool : function(direct,count,sw) {
                if(Lib.isDesktop){
                    it("click on paneltool "+direct +" for "+count+ "-time.", function() {
                        return ST.component(prefix + 'paneltool[type=scroll-'+direct+']').click();
                    })
                }
                else {
                    //TODO swipe by touch
                    Lib.swipeElement('toolbar-overflow toolbar-overflowbar:nth-child('+sw+')', -1, false)
                }
            },
            buttonInBar : function(docked,num) { //docked=top or right
                return ST.button(prefix + 'toolbar-overflowbar[_docked='+docked+'] button[_text='+menuBar[num]+']').click()
            },
            menuButton : function(button,i) {
                it("click menu Button "+ menuBar[i], function() {
                    if(button.getMenu().isVisible()){
                        var menuItems = button.getMenu().getInnerItems()

                        ST.component('#'+button.id)
                            .and(function(){
                                for(var a = 0; a < menuItems.length; a++){
                                    ST.component('#'+menuItems[a].id)
                                }
                            })
                    }
                })
            }
        }

        beforeAll(function() {
            Lib.beforeAll('#' + examplePrefix, examplePrefix);
            ST.wait(function(){
                    return Ext.ComponentQuery.query(prefix + 'toolbar-overflowbar').length > 1;
                })
                .and(function(){
                    overflowbarRight = Ext.ComponentQuery.query(prefix + 'toolbar-overflowbar[_docked=right] button')
                    overflowbarTop = Ext.ComponentQuery.query(prefix + 'toolbar-overflowbar[_docked=top] button')
                })
        });

        afterAll(function(){
            Lib.afterAll(examplePrefix);
        });

        describe("Example loads correctly", function () {
            it("should load correctly", function() {
                Lib.screenshot("UI_toolbars_toolbarOverflow");
            });
        });

        describe("Testing of source panel", function () {
            it("Source code", function() {
                Lib.sourceClick('controller.toolbar-overflow');
            });
        });
    }
})
