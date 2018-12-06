/**
* @file email.js
* @name AdminDashboard-Modern/email.js
* @created 2016/07/13
* 
* Tested on: Ubuntu 16.04 (Chrome, Firefox), Android 4, 6, iOS 8, 9 (iPhone, iPad),
*           Windows 10 (Edge, IE), Windows Phone 10
* Passed on: All tested
*/
describe('Email', function(){
    /**
     * Custom variables for application
     */
    var examplePrefix = 'email[routeId=email]{isVisible()} ';
    var exampleUrlPostfix = '#email';
    var Email = {
        /**
         * Get Email view workspace component (email)
         * @return {ST.component}
         */
        getEmailView: function(){
            return ST.component(examplePrefix);
        },
        getEmailGrid: function(){
            return ST.grid(examplePrefix + 'inbox');
        },
        getInboxList: function(){
            return ST.dataView(examplePrefix + 'inbox');
        },
        /**
         * Get container for Email and Friends panels, but container is visible only when width is more than 999
         * @return {ST.component}
         */
        getEmailContainer: function(){
            return ST.component(examplePrefix + 'container[_userCls=email-controls]');
        },
        getEmailMenuButton: function(itemName){
            return ST.button(examplePrefix + 'panel[title=Email] button[text=' + itemName + ']');
        },
        getFriendsMenuButton: function(itemName){
            return ST.button(examplePrefix + 'panel[title=Friends] button[text=' + itemName + ']');
        },
        getComposeWindow: function(){
            return ST.panel('viewport compose[_title=Compose]');
        },
        /**
         * Close compose window by clicking on Close icon
         */
        clickOnCloseIconOfComposeWindow: function(){
            //Lib.ghostClick('viewport compose[_title=Compose] paneltool');
            ST.button('viewport compose[_title=Compose] paneltool')
                .click();
        },
        /**
         * Show action menu for emails. Because Email panel doesn't have to been displayed for touch devices 
         */
        showActionMenu: function(){
            Email.getEmailView()
                .visible()
                .and(function(view){
                    view.getController().showActions();
                });

            Email.getEmailView()
                .wait(function(view){
                    return view.getController().actions.el.dom.clientWidth > 0;
                });

        },
        /**
         * Show action menu for emails by drag. Must mouse down in right side, move to left and mouse up. Then should be shown modal window for Action menu.
         * @param width - it should be closely window width or 0 (0 = close Action menu)
         */
        showActionMenuWithDrag: function(width){
            if(width === 0){//close
                ST.play([
                    {type: 'mousedown', target: 'viewport[id^=ext-viewport]{isVisible()}', x: 2, detail: 1},
                    {type: 'mousemove', target: 'viewport[id^=ext-viewport]{isVisible()}', x: 1, detail: 1},
                    {type: 'mouseup', target: 'viewport[id^=ext-viewport]{isVisible()}', x: 1, detail: 1}
                ]);
            } else {
                ST.play([
                    {type: 'mousedown', target: 'viewport[id^=ext-viewport]{isVisible()}', x: width - 10, detail: 1},
                    {type: 'mousemove', target: 'viewport[id^=ext-viewport]{isVisible()}', x: width - 11, detail: 1},
                    {type: 'mouseup', target: 'viewport[id^=ext-viewport]{isVisible()}', x: width - 11, detail: 1}
                ]);
            }
        },
        getActionMenuButton: function(name){
            ST.component('viewport emailactions button[text=' + name + ']')
                .click()
                .and(function(){
                    if(!Ext.first('viewport emailactions').isHidden()){
                        Ext.first('viewport emailactions').hide();
                    }
                })
                .wait(function(){
                    return Ext.first('viewport emailactions').isHidden();
                });
        },
        getActionMenu: function(){
            return ST.component('viewport emailactions');
        },
        /**
         * Close the Compose window with clien up programatically to ensure nothing gets broken here
         */
        closeComposeWindow: function(){
            var controller = null;
            Email.getEmailView()
                .visible()
                .and(function(email){
                    controller = email.getController();
                    controller.closeComposer();
                });

            Email.getEmailView()
                .wait(function(){
                    return controller.composer === null;
                })

        },
        closeMenuWindow: function(){
            Email.getEmailView()
                .visible()
                .and(function(email){
                    var controller = email.getController();
                    if(controller.actions !== null) {
                        controller.actions.hide();
                    }
                });

            Email.getEmailView()
                .wait(function(view){
                    return view.getController().actions.el.dom.clientWidth === 0;
                });
        },
        /**
         * Green plus button is only on phone.
         */
        getPlusButton: function(){
            return ST.button('button[_userCls="pop-out"]');
        },
        columnHeader: function(name){
            return ST.component(examplePrefix + 'inbox column[_dataIndex=' + name + ']');
        },
        /**
         * Checks if a column is sorted and sort direction is set on correctly value
         * @param name - name column
         * @param index - index column
         * @param direction - type sorting: ASC/DESC
         */
        isSortColumn: function(name, index, direction){
            var array = [];
            Email.columnHeader(name).click()
                .and(function(something){
                    for(var i = 0; i < something.visibleCount; i++){
                        Lib.Pivot.pushNumbersToArray(array, index, i);
                    }
                    expect(something.sortState).toBe(direction);
                })
                .and(function(){
                    var fn = Lib.Pivot.sortArray(direction);
                    expect(Lib.Pivot.isSorted(array, fn)).toBeTruthy();
                });
        },
        /**
         * Create describe with "it" for columns sorting
         * @param name - it is column name
         * @param index - it is column index
         */
        createDescribeForSortable: function(name, index){
            describe('Column[' + index + '] ' + name + ' is sortable', function(){
                it('is sorted ASC', function(){
                    Email.isSortColumn(name, index, 'ASC');
                });
                it('is sorted DESC', function(){
                    Email.isSortColumn(name, index, 'DESC');
                });
            });
        },
        getComposeField: function(name){
            return ST.field('viewport compose textfield[_name=' + name + ']');
        },
        isVisibleComposeWindow: function(expectValue){
            this.getComposeWindow().visible()
                .and(function(){
                    expect(this.future.cmp.isVisible()).toBe(expectValue);
                })
                .wait(function(window){
                    return window.el.dom.clientWidth > 0;
                })
        }
    };
    var sizeWindow = [ Ext.ComponentQuery.query('viewport')[0].getWindowWidth(), Ext.ComponentQuery.query('viewport')[0].getWindowHeight()];
    beforeAll(function(){
        Lib.beforeAll(exampleUrlPostfix, examplePrefix, 200, 'admin');
        ST.component('viewport[id^=ext-viewport]{isVisible()}').visible()
            .and(function(){
                sizeWindow[0] = this.future.cmp.getWindowWidth();
                sizeWindow[1] = this.future.cmp.getWindowHeight();
            });
    });
    afterAll(function(){
        //Lib.afterAll("email");//It is not need destroyed
        ST.options.eventDelay = 500;
    });
    describe('Default display UI', function(){
        it('Should load correctly', function(){
            Email.getEmailView().visible();
            Lib.screenshot('UI_appMain_AdminDashboard_Email');
        });
        if(Lib.isPhone){
            it('Should be displayed green plus button', function(){
                Email.getPlusButton().visible()
                    .and(function(){
                        expect(this.future.cmp.isVisible()).toBeTruthy();
                    });
            });
        } else {
            it('Container for Email and Friends panels should display only when window width is greater than 1000', function(){
                if(sizeWindow[0] < 1000){
                    Email.getEmailContainer().hidden()
                        .and(function(){
                            expect(this.future.cmp.isVisible()).toBeFalsy();
                        });
                } else {
                    Email.getEmailContainer().visible()
                        .and(function(){
                            expect(this.future.cmp.isVisible()).toBeTruthy();
                        });
                }
            });
        }
        it('Should be able to open Actions menu with drag only for width less than 1000px', function(){
            Email.showActionMenuWithDrag(sizeWindow[0]);
            if(sizeWindow[0] < 1000){
                Email.getActionMenu().visible()
                    .wait(function(){ return this.cmp.isVisible(); })
                    .and(function(){
                        expect(Ext.ComponentQuery.query('emailactions').length).toBe(1);
                        expect(this.future.cmp.isVisible()).toBe(true);
                    });
                Email.showActionMenuWithDrag(0);
                Email.getActionMenu().hidden()
                    .and(function(){
                        expect(this.future.cmp.isVisible()).toBe(false);
                    });
            } else {
                Email.getEmailView().visible()
                    .and(function(){
                        expect(Ext.ComponentQuery.query('emailactions').length).toBe(0);
                    });
            }
        });
    });
    describe('Compose email window', function(){
        afterAll(function(){
            Email.closeMenuWindow();
        });
        describe('Open Compose window', function(){
            afterEach(function(){
                //clean up programmatically to ensure nothing gets broken here
                Email.closeComposeWindow();
            });
            if(Lib.isPhone){
                it('by clicking on PLUS button on phone', function(){
                    //Lib.ghostClick('button[_userCls="pop-out"]');
                    ST.element('button[_userCls="pop-out"]').click();
                    Email.isVisibleComposeWindow(true);
                });
            } else if(sizeWindow[0] >= 1000){
                it('by clicking on Compose menu item on desktop', function(){
                    Email.getEmailMenuButton('Compose').click();
                    Email.isVisibleComposeWindow(true);
                });
                it('Should set email address according to clicked friend', function(){
                    var name = 'Torres Tran';
                    Email.getFriendsMenuButton(name).click();
                    Email.getComposeField('to')
                        .visible()
                        .and(function(field){
                            expect(field.getValue()).toBe(name);
                        });
                });
            }
            if(sizeWindow[0] < 1000) {
                it('by clicking on Compose menu item in Actions menu', function () {
                    Email.showActionMenu();
                    Email.getActionMenuButton('Compose');
                    Email.isVisibleComposeWindow(true);
                });
            }
        });
        describe('Dismiss Compose window', function(){
            var composeWindow;
            beforeEach(function(){
                // need to open compose window manually before each spec
                Email.showActionMenu();
                Email.getActionMenuButton('Compose');
                Email.getComposeWindow()
                    .visible()
                    .and(function(){
                        composeWindow = this.future.cmp;
                    });
            });
            afterEach(function(){
                // need to do clean up in case something got broken and compose window wasn't closed properly
                Email.closeComposeWindow();
                composeWindow = null;
                Email.closeMenuWindow();
            });
            if(!Lib.isPhone){
                it('ORION-588 - Should destroy compose window by clicking on close tool on desktop/tablet', function(){
                    Email.clickOnCloseIconOfComposeWindow();
                    Email.getEmailView()
                        .wait(function(){
                            return composeWindow.isDestroyed;
                        })
                        .and(function(){
                            expect(composeWindow.isDestroyed).toBeTruthy();
                        });
                });
                it('should destroy compose window by clicking on Send button on desktop/tablet', function(){
                    //Lib.ghostClick('panel[title=Compose] button[text=Send]');
                    ST.button('panel[title=Compose] button[text=Send]')
                        .click();
                    Email.getEmailView()
                        .wait(function(){
                            return composeWindow.isDestroyed;
                        })
                        .and(function(){
                            expect(composeWindow.isDestroyed).toBeTruthy();
                        });
                });
                it('should destroy compose window by clicking on Discard button on desktop/tablet', function(){
                    //Lib.ghostClick('panel[title=Compose] button[text=Discard]');
                    ST.button('panel[title=Compose] button[text=Discard]')
                        .click();
                    Email.getEmailView()
                        .wait(function(){
                            return composeWindow.isDestroyed;
                        })
                        .and(function(){
                            expect(composeWindow.isDestroyed).toBeTruthy();
                        });
                });
            }
            if(Lib.isPhone){
                it('should destroy compose window by clicking on trash button on phone', function(){
                    ST.button('panel[title=Compose] button[iconCls~=fa-trash]').click();
                    Email.getEmailView()
                        .wait(function(){
                            return composeWindow.isDestroyed;
                        })
                        .and(function(){
                            expect(composeWindow.isDestroyed).toBeTruthy();
                        });
                });
                it('should destroy compose window by clicking on Send button on phone', function(){
                    ST.element('panel[title=Compose] tool[iconCls~=fa-send]').click();
                    Email.getEmailView()
                        .wait(function(){
                            return composeWindow.isDestroyed;
                        })
                        .and(function(){
                            expect(composeWindow.isDestroyed).toBeTruthy();
                        });
                });
            }
        });
        describe('Type into fields', function(){
            //there shouldn't be wait, but it sometimes something goes too quickly or so slow,
            //that without wait there is plenty of random bugs
            beforeAll(function(){
                ST.wait(1000);
                // need to open compose window manually before specs
                Email.showActionMenu();
                ST.wait(1000);
                Email.getActionMenuButton('Compose');
                ST.wait(1000);
                Email.getComposeWindow().visible();
                ST.wait(1000);
            });
            afterAll(function(){
                // need to do clean up in case something got broken and compose window wasn't closed properly
                Email.closeComposeWindow();
                Email.closeMenuWindow();
            });
            describe('TO field', function(){
                var name = 'to';
                var text = 'sencha@sencha.com';
                afterEach(function(){
                    //make sure field is cleaned up after each spec
                    Email.getComposeField(name)
                        .and(function(){
                            this.future.cmp.setValue('');
                        }).textEmpty();
                });
                it('should be able to type into TO field', function(){
                    Email.getComposeField(name).click().focus()
                        .type(text)
                        .and(function(){
                            expect(this.future.cmp.getValue()).toBe(text);
                        });
                });
                it('should be able to clear TO field', function(){
                    var txtField = Email.getComposeField(name)
                        .and(function(field){
                            field.setValue(text);
                        })
                        .wait(function(){
                            return this.cmp.getValue() == text;
                        });
                    Lib.ghostClick('compose field[name=' + name + '] => div.x-cleartrigger>div.x-icon-el', Lib.isDesktop? false : true);
                    txtField
                        .wait(function(){
                            return this.cmp.getValue() == '';
                        })
                        .and(function(){
                            expect(this.future.cmp.getValue()).toBe('');
                    });
                });
            });
            describe('Subject field', function(){
                var name = 'subject';
                var text = 'ExtJS 7.0';
                afterEach(function(){
                    //make sure field is cleaned up after each spec
                    Email.getComposeField(name)
                        .and(function(){
                            this.future.cmp.setValue('');
                        });
                });
                it('should be able to type into Subject field', function(){
                    Email.getComposeField(name).click().focus()
                        .type(text)
                        .and(function(){
                            expect(this.future.cmp.getValue()).toBe(text);
                        });
                });
                it('should be able to clear Subject field', function(){
                    var txtField = Email.getComposeField(name)
                        .and(function(){
                            this.future.cmp.setValue(text);
                        })
                        .wait(function(){
                            return this.cmp.getValue() === text;
                        });
                    Lib.ghostClick('compose field[name=' + name + '] => div.x-cleartrigger>div.x-icon-el', Lib.isDesktop? false : true);
                    txtField
                        .wait(function(){
                            return this.cmp.getValue() === '';
                        })
                        .and(function(){
                            expect(this.future.cmp.getValue()).toBe('');
                        });
                });
            });
            describe('Message field', function(){
                var name = 'message';
                var text = 'Hi folks';
                afterEach(function(){
                    //make sure field is cleaned up after each spec
                    Email.getComposeField(name)
                        .and(function(){
                            this.future.cmp.setValue('');
                        });
                });
                it('should be able to type into Message field', function(){
                    Email.getComposeField(name).click().focus()
                        .type(text)
                        .and(function(){
                            expect(this.future.cmp.getValue()).toBe(text);
                        });
                });
            });
        });
    });
    //it uses grid to show emails on desktop and tablets
    // and dataview list on phones
    describe('Email list', function(){
        describe('email selection', function(){
            it('should select 3rd row when clicked on 3rd email', function(){
                if(Lib.isPhone){
                    Email.getInboxList()
                        .visible()
                        .itemAt(0)
                        .click()
                        .selected()
                        .dataView()
                        .and(function(){
                            var selValue = this.future.cmp.getSelection().get('from');
                            expect(selValue).toBe('Estela Gibbs');
                        });
                } else {
                    Email.getEmailGrid()
                        .visible();
                        /* - ORION-1607, ORION-1363
                    Email.getEmailGrid()
                        .rowAt(2)
                        .click()
                        .selected()
                        .grid()
                        .and(function(g){
                            var selValue = g.getSelection().get('from');
                            expect(selValue).toBe('Tammi Merrill');
                        });
                        */
                }
            });
        });
        if(!Lib.isPhone){
            describe('email sorting', function(){
                afterAll(function(){
                    Admin.app.redirectTo(exampleUrlPostfix);
                    Email.getEmailView().visible(); 
                });
                var cols = ['favorite','from', 'title','has_attachments', 'received_on'];
                for(var i = 0; i<cols.length; i++){
                    Email.createDescribeForSortable(cols[i], i);
                }
            });
        }
    });
});
