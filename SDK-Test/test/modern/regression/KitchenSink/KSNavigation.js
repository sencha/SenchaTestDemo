/**
 * @file Sliders.js
 * @name KSNAvigation.js
 * @created 2016/19/08
 *
 * @updated: 19. 7. 2017
 *
 * tested on
 * Desktop: Chrome 59, FF 54, Edge 15, IE 11, Opera 46
 * Phone: Android 7, iOS 9
 * Tablet: Android 5, iOS 10
 *
 */
describe("Navigation", function() {
    var SourceCodePanel;
    var Store;
    var Phone = false;
    var Names = ["Components", "Grids", "Trees", "Charts", "Calendar", "Pivot Grids", "D3"];
    var Stuff = {
        sourceView : function() {
            return ST.component("sourceoverlay");
        },
        sourceButton : function() {
            return ST.component("sourceoverlay paneltool:visible()");
        },
        breadcrumbButton : function(text){
            return Phone ? ST.button("button:first") : ST.component("breadcrumb button[_text=" + text + "]");
        },
        dataView : function(){
            return Phone ? ST.component("container list[hidden=false]:first") : ST.dataView("contentPanel[hidden=false] dataview:last");
        },
        toolbarExample : function(){
            return ST.component('docked-toolbars');
        },
        burgerButton : function(){
            return ST.component("desktopnavigationbar button[_iconCls=menu]");
        },
        burgerInnerButton : function(name){
            return ST.component(Components.menuradioitem(name));
        },
        sourcecodePanel : function(){
            return ST.component("sourceoverlay");
        },
        visibleView : function(){
            return ST.component("viewport");
        },
        checkTheme : function(buttonName){
            it("Should change theme to " + buttonName, function(){
                Stuff.burgerButton()
                    .click();
                Stuff.burgerInnerButton(buttonName)
                    .click();
                ST.wait(function(){
                    return Stuff.visibleView().destroyed();
                });
                ST.wait(function(){
                    return Stuff.visibleView().visible();
                });
                Stuff.visibleView()
                    .visible()
                    .and(function(){
                        expect(Ext.theme.name).toBe(buttonName.replace(' Theme', ''));
                    });
            });
        },

        clickBreadcrumbPhone: function(buttonName){
            Stuff.breadcrumbButton(buttonName)
                .click();
        },
        //@params
        /*
            nthChild - integer, order of list item to be clicked at
            countItems - integer, number of items in list which apears after click
            returnBack - boolean, return back to first page or not
            checkNumbers - boolean, check that correct number of list item is present on page
        */
        clickListItemPhone: function(nthChild, countItems, returnBack, checkNumbers){
            returnBack = typeof returnBack !== 'undefined' ? returnBack : true;
            checkNumbers = typeof checkNumbers !== 'undefined' ? checkNumbers : true;
            Stuff.dataView()
                .visible();
            ST.wait(function(){
                return Ext.first("simplelistitem");
            });

            ST.component("container list[hidden=false]:first simplelistitem[$datasetIndex="+nthChild+"]")
                .click();
            Lib.waitOnAnimations();

            if(checkNumbers){                    
                ST.wait(function(){
                    //Check count children equals displayed items
                    return Ext.first("list[hidden=false]").getItemCount() === countItems;
                })
                .and(function(){
                    expect(countItems).toBe(Ext.first("list[hidden=false]").getItemCount());
                });
            }
            if(returnBack){
                Stuff.clickBreadcrumbPhone("Kitchen Sink");
                Lib.waitOnAnimations();
            }
        }
    };

    beforeAll(function () {
        KitchenSink.app.redirectTo("#all");
        ST.wait(function(){
                if(Lib.isPhone){
                    return (Ext.ComponentQuery.query("sourceoverlay").length >= 0 
                        && Ext.ComponentQuery.query("#ext-list-1").length > 0 
                        && Ext.ComponentQuery.query("#ext-list-1")[0].getStore().getCount() > 0);
                }else{
                    return (Ext.ComponentQuery.query("sourceoverlay").length >= 0 
                        && Ext.ComponentQuery.query("#thumbnails2").length > 0 
                        && Ext.ComponentQuery.query("#thumbnails2")[0].getStore().getCount() > 0);
                }
            }).and(function(){
                Store = Lib.isPhone ? Ext.ComponentQuery.query("#ext-list-1")[0].getStore()
                        : Ext.ComponentQuery.query("#thumbnails2")[0].getStore();
                Phone = Lib.isPhone;
                for(var i = 0; i < 7; i++){
                    Names[i] = Store.getData().items[i].data.text;
                }
            });
    });

    describe("Close tab if opened on desktop and open it again", function(){
        it("should close tab on desktop and open it after that", function(){
            if(Lib.isDesktop){
                Stuff.sourceButton()
                    .click();
                Stuff.sourcecodePanel()
                    .wait(function(panel){
                        return panel.getFlex()===null;
                    })
                    .and(function(panel){
                        expect(panel.getFlex()).toBe(null);
                    });

                Stuff.sourceButton()
                    .click();
                Stuff.sourcecodePanel()
                    .wait(function(panel){
                        return panel.getFlex()===1;
                    })
                    .and(function(panel){
                        expect(panel.getFlex()).toBe(1);
                    });
            }
        });
    });

    describe("Details panel", function(){
        //close tab if opened
        beforeAll(function(){
            Stuff.sourcecodePanel()
                .and(function(panel) {
                    if (Lib.isTablet && (panel.getWidth() !== null)) {
                        Stuff.sourceButton()
                            .click();
                        Stuff.sourcecodePanel()
                            .wait(function(panel2){
                                return panel2.getWidth()===null;
                            })
                    }
                })
                .and(function(panel){
                    if(Lib.isDesktop && (panel.getFlex() === 1)){
                        Stuff.sourceButton()
                            .click();
                        Stuff.sourcecodePanel()
                            .wait(function(panel2){
                                return panel2.getFlex()===null;
                            })
                    }
                })
        });
        //return to initial position (tablet close, desktop opened
        afterAll(function(){
            //open tab on desktop, close on tablets
            Stuff.sourcecodePanel()
                .and(function(panel) {
                    if (Lib.isTablet && (panel.getWidth() !== null)) {
                        Stuff.sourceButton()
                            .click();
                        Stuff.sourcecodePanel()
                            .wait(function(panel2){
                                return panel2.getWidth()===null;
                            })
                    }
                })
                .and(function(panel){
                    if(Lib.isDesktop && (panel.getFlex() === null)){
                        Stuff.sourceButton()
                            .click();
                        Stuff.sourcecodePanel()
                            .wait(function(panel2){
                                return panel2.getFlex()===1;
                            })
                    }
                })
        });
        it("Should expand/collapse on tablet or desktop", function(){
            if(Lib.isDesktop){
                Stuff.sourceButton()
                    .click();
                Stuff.sourcecodePanel()
                    .wait(function(panel){
                        return panel.getFlex()===null;
                    })
                    .and(function(panel){
                        expect(panel.getFlex()).toBe(null);
                    });

                Stuff.sourcecodePanel()
                    .wait(function(panel){
                        return panel.getFlex()===1;
                    })
                    .and(function(panel){
                        expect(panel.getFlex()).toBe(1);
                    });
            }
            else if(Lib.isTablet){
                Stuff.sourceButton()
                    .click();
                Stuff.sourcecodePanel()
                    .wait(function(panel){
                        return panel.getWidth() > 1;
                    })
                    .and(function(panel){
                        expect(panel.getWidth()).toBeGreaterThan(0);
                    });
                Stuff.sourceButton()
                    .click();
                Stuff.sourcecodePanel()
                    .wait(function(panel){
                        return panel.getWidth() === null;
                    })
                    .and(function(panel){
                        expect(panel.getWidth()).toBe(null);
                    });
            }
            else{
                pending('not supported on phones');
            }
        });
    });

    describe("Test top level example links", function(){
            var counter = 0;
            var countChildren = 7;
            for(var j = 0; j < countChildren; j++ ){
                it("Should click on " + Names[j], function(){
                    var name;
                    var childrenCounts = [];
                    for(var i = 0; i < 7; i++){
                        childrenCounts[i] = Store.getData().getAt(i).childNodes.length;
                    }
                    if(Lib.isPhone){
                        Lib.waitOnAnimations();
                        Stuff.clickListItemPhone(counter, childrenCounts[counter++]);
                    }else{
                        Stuff.dataView()
                            .itemAt(counter)
                            .click()
                            .and(function(){
                                countChildren = Store.getData().items[counter].childNodes.length;
                                name = Store.getData().items[counter++].data.text;
                            })
                            .and(function(){
                                Stuff.breadcrumbButton(name)
                                    .visible()
                                    .and(function(){
                                        expect(Ext.ComponentQuery.query('contentPanel[hidden=false] thumbnails')[0].getStore().getData().length).toBe(countChildren);
                                    });
                                ST.button("breadcrumb button[_text=All]")
                                    .click();
                                Lib.waitOnAnimations();
                            });
                        Stuff.dataView()
                            .and(function () {
                                var el = Ext.dom.Query.select('div.thumbnail-text:contains(Components)')[0];
                                el = Ext.fly(el);
                                ST.element(el).visible();
                            })
                    }
                });                           
            } 
    });

    describe("Get to example", function(){
        it("Should go to Toolbar example", function(){
            var name;
            var countChildren;
            if(Phone){
                //Tooltips missing for phones
                Stuff.clickListItemPhone(0, 23, false);
                //Toolbar Overflow missing in phone
                Stuff.clickListItemPhone(21, 3, false);
                Stuff.clickListItemPhone(1, null, false, false);
                Stuff.toolbarExample()
                     .visible();

                Stuff.clickBreadcrumbPhone("Toolbars");
                Stuff.clickBreadcrumbPhone("Components");
                Stuff.clickBreadcrumbPhone("Kitchen Sink");
            }else{
                Stuff.dataView()
                    .itemAt(0)
                    .click()
                    .dataView()
                    .and(function(dView){
                        countChildren = Store.getData().items[0].childNodes.length;
                        name = Store.getData().items[0].data.text;
                        expect(dView.getStore().getData().items[0].childNodes.length).toBe(countChildren);
                    });
                Lib.waitOnAnimations();

                Stuff.dataView()
                    .itemAt(21)
                    .focus()
                    .click()
                    .dataView()
                    .and(function(dView){
                        countChildren = Store.getData().items.length;
                        name = Store.getData().items[0].parentNode.data.text;
                        expect(dView.getStore().getData().length).toBe(countChildren);
                    })
                    .and(function(){
                        Stuff.breadcrumbButton(name)
                            .visible();
                    });
                Lib.waitOnAnimations();

                Stuff.dataView()
                    .itemAt(1)
                    .click();
                Lib.waitOnAnimations();

                Stuff.toolbarExample()
                    .visible();

                ST.button("breadcrumb button[_text=Toolbars]")
                    .click();
                Lib.waitOnAnimations();

                ST.button("breadcrumb button[_text=Components]")
                    .click();
                Lib.waitOnAnimations();

                ST.button("breadcrumb button[_text=All]")
                    .click();
                Lib.waitOnAnimations();
            }
        });

        it("Should go to Toolbar example and back", function(){
            if(Phone){
                pending('test would be the same')
            }else{
                Stuff.dataView()
                    .itemAt(0)
                    .click();
                Lib.waitOnAnimations();

                Stuff.dataView()
                    .itemAt(21)
                    .click();
                Lib.waitOnAnimations();

                Stuff.dataView()
                    .itemAt(1)
                    .click();
                Stuff.toolbarExample()
                    .visible();

                //back immediately
                ST.button("breadcrumb button[_text=All]")
                    .click();
                Lib.waitOnAnimations();
            }
        });
    });

    //This is going to have to be implemented in Sencha Studio 2.0, since it redirects out of current page
    xdescribe("Check different themes", function(){
        var buttonNames = ["Material Theme", "iOS Theme", "Triton Theme", "Neptune Theme"];
        buttonNames.forEach(function(i){
            Stuff.checkTheme(i);
        })
    });
});
