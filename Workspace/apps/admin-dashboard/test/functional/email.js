describe("email", function() {
    var Dash = {
        treeList: function () {
            return ST.component('treelist');
        },
        hamburger: function() {
            return ST.component('@main-navigation-btn');
        },
        sideMenuItem: function(itemName) {
            return ST.component('menuitem[text='+itemName+']');
        },
        toolbarItem: function(itemName) {
            return ST.component('toolbar button[href=#'+itemName+']');
        },
        emailGrid: function() {
            return ST.grid('inbox');
        },
        emailDetails : function() {
            return ST.panel('emaildetails');
        },
        backButton : function() {
            return ST.button('button[iconCls~=fa-angle-left]');
        },
        gridColumn : function(columnName) {
            return ST.component('inbox gridcolumn[text='+columnName+']');
        },
        mainPanelScrollY: function(scroll){
                return ST.component('container[id=main-view-detail-wrap]').and(function(panel){
                    panel.setScrollY(scroll);
                });
        },
        isDesktop : ST.os.deviceType == "Desktop"
    };
    beforeEach(function(next){
        Admin.app.redirectTo("#email");
        // navigate app to correct page and wait to be visible
        ST.component('email').visible()
            .and(next);

    });
    describe("Example loads correctly", function(){
        it("Email page screenshot should match baseline", function(next) {
            ST.screenshot('email',next);
        }, 1000 * 20);
    });
    describe("Inbox panel", function(){
        describe('Grid actions', function(){
            var gridStore;
            beforeAll(function(){
                Dash.emailGrid()
                    .viewReady()
                    .and(function(grid){
                        gridStore = grid.getStore();
                    });
            });
            describe('should show email detail', function(){
                it('when clicking on grid row', function(){
                    Dash.mainPanelScrollY(0);
                    Dash.emailGrid()
                        .rowAt(0)
                        .click();
                    Dash.emailDetails()
                        .visible();

                    Dash.backButton().click(); //navigate back to email page

                });
            });
            describe('columns are sortable', function(){
                afterAll(function(next){
                    Dash.emailGrid()
                        .and(function(grid){
                            //reset sorting after tests
                            grid.getView().getScrollable().scrollBy(-1000,0);
                            grid.getStore().getSorters().clear();
                            grid.getStore().load(next);
                        });
                });
                describe('by clicking on header', function(){
                    beforeAll(function(){
                        Dash.mainPanelScrollY(0);
                    });
                    var sorter;
                    it('\'From\' should sort emails by sender ASC', function(){
                        Dash.gridColumn('From')
                            .click(10,10)
                            .wait(50)
                            .and(function(){
                                sorter = gridStore.getSorters().getAt(0);
                                expect(sorter.getDirection()).toBe('ASC');
                                expect(sorter.getProperty()).toBe('from');
                                expect(gridStore.getAt(0).get('from')).toBe('Adam Gullner');
                            });
                    });
                    it('\'Title\' should sort emails by Title ASC', function(){
                        Dash.gridColumn('Title')
                            .click(10,10)
                            .wait(50)
                            .and(function(){
                                sorter = gridStore.getSorters().getAt(0);
                                expect(sorter.getDirection()).toBe('ASC');
                                expect(sorter.getProperty()).toBe('title');
                                expect(gridStore.getAt(0).get('title')).toBe('Ad amet aute officia non culpa ullamco non pariatur sit excepteur consequat nulla minim tempor.');
                            });
                    });
                    it('\'Received\' should sort emails by date ASC', function(){
                        //column might be scrolled out ov view on small screens, so we need to scroll it into view before testing
                        Dash.emailGrid().
                            and(function(grid){
                                grid.getView().getScrollable().scrollBy(1000,0);
                        });
                        Dash.gridColumn('Received')
                            .click(10,10)
                            .wait(50)
                            .and(function(){
                                sorter = gridStore.getSorters().getAt(0);
                                expect(sorter.getDirection()).toBe('ASC');
                                expect(sorter.getProperty()).toBe('received_on');
                                expect(gridStore.getAt(0).get('received_on')).toEqual(new Date('2014-02-11T04:24:27.000Z'));
                            });
                    });
                });
                describe('by using header menu', function(){
                    function sortColumnDesc(text,prop,expectedVal){
                        var sorter,x,y;
                        if(Dash.isDesktop){
                            //1st we need to show header menu trigger for desktop and then open menu
                            ST.play([
                                { type: "mouseover", target: 'inbox gridcolumn[text='+text+']', x: 15, y: 2 }
                            ]);
                            ST.component('inbox gridcolumn[text='+text+'] => div.x-column-header-trigger')
                                .click();
                        }else{
                            //or open header menu on tablet
                            ST.component('inbox gridcolumn[text='+text+']').and(function(col){
                                x = col.getWidth()-5;
                                y = col.getHeight();
                                ST.component('inbox gridcolumn[text='+text+']').click(x,y/2);
                            });

                        }
                        ST.component('menuitem[text="Sort Descending"]')
                            .click()
                            .and(function(){
                                sorter = gridStore.getSorters().getAt(0);
                                expect(sorter.getDirection()).toBe('DESC');
                                expect(sorter.getProperty()).toBe(prop);
                                expect(gridStore.getAt(0).get(prop)).toEqual(expectedVal);
                            });
                        if(Dash.isDesktop){
                            ST.play([
                                { type: "mouseout", target: 'inbox gridcolumn[text='+text+']', x: 15, y: 2 } //remove highlight from column as would happen when user moves mouse out of column
                            ]);
                        }
                    }
                    it('\'From\' should sort DESC', function(){
                        sortColumnDesc('From','from','Tammi Merrill');
                    });
                    it('\'Title\' should sort DESC', function(){
                        sortColumnDesc('Title','title','Sunt labore qui velit nulla officia laboris do.');
                    });
                    it('\'Received\' should sort DESC', function(){
                        sortColumnDesc('Received','received_on',new Date('2015-02-08T05:40:31.000Z'));
                    });
                });
            });
            describe('can select rows', function(){
                //user should be able to select single,multiple or all rows.
                var selModel;
                describe('by checkbox', function(){
                    afterEach(function(){
                        //remove grid row selection before each test
                        selModel.deselectAll();
                    });
                    beforeEach(function(next){
                        Dash.emailGrid().viewReady().and(function(grid){
                            selModel = grid.getSelectionModel();
                            next();
                        })
                    });

                    it('single row selection', function(done){
                        Dash.emailGrid()
                            .rowAt(0)
                            .cellAt(0)
                            .click()
                            .wait(50)
                            .and(function(){
                                expect(selModel.isSelected(0)).toBeTruthy();
                                done();
                            });
                    });
                    it('multiple row selection', function(){
                        Dash.emailGrid()
                            .rowAt(0).cellAt(0)
                            .click()
                            .wait(50)
                            .grid().rowAt(1).cellAt(0)
                            .click()
                            .wait(50)
                            .and(function(){
                                expect(selModel.isSelected(0)).toBeTruthy();
                                expect(selModel.isSelected(1)).toBeTruthy();

                            });
                    });
                    it('select all rows', function(){
                        ST.component('inbox gridcolumn{isCheckerHd}')
                            .click()
                            .wait(50)
                            .and(function(){
                                expect(selModel.isRangeSelected(0,19)).toBe(true);
                            });
                    });
                });
            });
        });
        describe("Email detail", function(){
            beforeEach(function(){
                //ensure email detail is visible before each spec
                Dash.emailGrid()
                    .viewReady()
                    .rowAt(0)
                    .click();

            });
            afterEach(function(){
                //need to navigate back after each spec
                ST.button('button[iconCls~=fa-angle-left]').click();
            });
            it('should have correct email subject name', function(){
                ST.component('#emailSubjectContainer')
                    .contentLike('Estela Gibbs');
            });
            it('should accept user input in the reply textarea', function(){
                ST.component('htmleditor')
                    .and(function(htmleditor){
                        //writing plain text instead of HTML formatted
                        htmleditor.toggleSourceEdit(true);
                    });
                ST.component('htmleditor')
                    .visible()
                    .click()
                    .focus()// textarea needs to be focused before typing
                    .type('Empowering organizations to rapidly design, deploy, and manage mission-critical cross-platform web apps.')
                    .and(function(editor){
                        expect(editor.getValue()).toBe('Empowering organizations to rapidly design, deploy, and manage mission-critical cross-platform web apps.');
                    });
            });
        });
        if(Dash.isDesktop){
            describe('Keyboard navigation', function(){
                describe('using tab', function(){
                    //checks if correct cells are focused when user TABs in grid
                    it('should tab between header and grid', function(){
                        ST.component('inbox gridcolumn{isCheckerHd}')
                            .focus();
                        ST.play([
                            { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//div[contains(@class, 'x-column-header-first')]", key: "Tab" },
                            { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[1]", key: "Tab" }
                        ]);
                        Dash.emailGrid()
                            .rowAt(0)
                            .cellAt(0)
                            .focused();
                    });
                    it('should tab between grid and header', function(){
                        Dash.emailGrid()
                            .rowAt(0)
                            .cellAt(0)
                            .focus();

                        ST.play([
                            { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[1]", key: "Tab" , shift : true},
                            { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//div[contains(@class, 'x-column-header-first')]", key: "Tab", shift : true }

                        ]);
                        ST.component('inbox gridcolumn{isCheckerHd}')
                            .focused();
                    });
                });
                describe('using arrows', function(){
                    describe('in grid header', function(){
                        beforeEach(function(){
                            //focus header to ensure same staring point for following tests
                            ST.component('inbox gridcolumn{isCheckerHd}')
                                .focus();
                        });
                        it('right arrow should move to next header column', function(){
                            ST.play([
                                { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//div[contains(@class, 'x-column-header-first')]", key: "ArrowRight" },
                                { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//div[contains(@class, 'x-box-target')]/div[contains(@class, 'x-column-header') and position()=2]", key: "ArrowRight" }
                            ]);
                            ST.component('inbox gridcolumn[dataIndex=favorite]')
                                .focused();
                        });
                        it('left arrow should move to previous header column', function(){
                            ST.play([
                                { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//div[contains(@class, 'x-column-header-first')]", key: "ArrowRight" },
                                { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//div[contains(@class, 'x-box-target')]/div[contains(@class, 'x-column-header') and position()=6]", key: "ArrowRight" }
                            ]);
                            ST.component('inbox gridcolumn[dataIndex=received_on]')
                                .focused();
                        });
                    });
                    describe('in grid body', function(){
                        beforeEach(function(){
                            //focus 1st row/1st cell to ensure same staring point for following tests
                            Dash.emailGrid()
                                .rowAt(0)
                                .cellAt(0)
                                .focus();
                        });
                        it('right arrow should move to next cell',function(){
                            ST.play([
                                { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[1]", key: "ArrowRight" },
                                { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[2]", key: "ArrowRight" }
                            ]);
                            Dash.emailGrid()
                                .rowAt(0)
                                .cellAt(1)
                                .focused();
                        });
                        it('right arrow on last cell should move focus to first cell on next row', function(){
                            Dash.emailGrid()
                                .rowAt(0)
                                .cellAt(5)
                                .focus();
                            ST.play([
                                { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[6]", key: "ArrowRight" },
                                { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='1']/tbody/tr/td[1]", key: "ArrowRight" }
                            ]);
                            Dash.emailGrid()
                                .rowAt(1)
                                .cellAt(0)
                                .focused();
                        });
                        it('left arrow should move to previous cell',function(){
                            Dash.emailGrid()
                                .rowAt(0)
                                .cellAt(1)
                                .focus();
                            ST.play([
                                { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[2]", key: "ArrowLeft" },
                                { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[1]", key: "ArrowLeft" }
                            ]);
                            Dash.emailGrid()
                                .rowAt(0)
                                .cellAt(0)
                                .focused();
                        });
                        it('left arrow on first cell of second row should move focus to last cell on first row', function(){
                            Dash.emailGrid()
                                .rowAt(0)
                                .cellAt(0)
                                .focus();
                            ST.play([
                                { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='1']/tbody/tr/td[1]", key: "ArrowLeft" },
                                { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[6]", key: "ArrowLeft" }
                            ]);
                            Dash.emailGrid()
                                .rowAt(0)
                                .cellAt(5)
                                .focused();
                        });
                    });
                });


            });
        }

    });
    describe("Side panels", function(){
        describe("Compose email", function(){
            it("check window title", function() {
                Dash.sideMenuItem('Compose').click();
                ST.component('emailwindow').and(function(win) {
                    expect(win.getTitle()).toBe('Compose Message');
                });
                ST.button('emailwindow button[text=Discard]').click();
            });
            it("can close window by close tool", function(){
                Dash.sideMenuItem('Compose').click();
                ST.component('emailwindow tool[type=close]')
                    .click();
                expect(Ext.WindowManager.getActive()).not.toBeDefined();
            });
            describe("type into fields", function(){
                beforeEach(function(){
                    Dash.sideMenuItem('Compose').click();
                });
                afterEach(function(){
                    ST.button('emailwindow button[text=Discard]').click();
                });
                it("should accept user input in the 'To' field", function() {
                    ST.textField('emailwindow textfield[fieldLabel=To]').
                    click().
                    focus().
                    type('George Washington').wait(50).
                    and(function(input) {
                        expect(input.getValue()).toBe('George Washington');
                    });
                });
                it("should accept user input in the 'Subject' field", function() {
                    ST.textField('emailwindow textfield[fieldLabel=Subject]').
                    click().
                    focus().
                    type('Sencha').wait(50).
                    and(function(input) {
                        expect(input.getValue()).toBe('Sencha');
                    });
                });
                it("should accept user input in the 'Message' textarea", function() {
                    ST.component('emailwindow htmleditor')
                        .and(function(htmleditor){
                            //need to enable source editing to avoid messing with iframe
                            htmleditor.toggleSourceEdit(true);
                        });
                    ST.component('emailwindow htmleditor')
                        .click()
                        .focus()
                        .type('Empowering organizations to rapidly design, deploy, and manage mission-critical cross-platform web apps.')
                        .and(function(editor){
                            expect(editor.getValue()).toBe('Empowering organizations to rapidly design, deploy, and manage mission-critical cross-platform web apps.');
                        });
                });
            });
        });
        describe("Email panel", function(){
            // checking correct item count
            it("menu should consist of 5 items", function(){
                ST.component('emailmenu').and(function(list){
                    var emailMenuLen = list.query('menuitem').length;
                    expect(emailMenuLen).toBe(5);
                });
            });
        });
        describe("Friend panel", function(){
            // checking correct item count
            it("6 friends should be shown", function(){
                ST.component('emailfriendslist').and(function(list){
                    var friendListMenuLen = list.query('menuitem').length;
                    expect(friendListMenuLen).toBe(6);
                });
            });
        });
    });
        
});
