describe("email", function() {
    /*
    * Futures enable tests to practice the DRY (Don’t Repeat Yourself) principle.
    * Instead of creating the future instance at the point of need,
    * consider the following alternative.
    **/
    var Email = {
        // Sencha Test provides multiple ways to locate an element from a text string
        // A locator solves the same problem as a CSS selector but is a super-set of CSS selector syntax.
        // The locator syntax is more expressive than selectors to provide more options for testing real-world applications.
        // When testing applications, ideally the application developers provide a reliable way for testers
        // to locate application components and elements.
        // More info can be found in documentation http://docs.sencha.com/sencha_test/ST.Locator.html

        // Following locates ExtJS Grid component based on it's xtype - this locator is called ComponentQuery
        // and can be used to locate Components in applications built using Sencha frameworks.
        // The majority of logic operates at a layer above elements: Components.
        // It is therefore more desirable to locate and operate on components than raw DOM elements.
        // http://docs.sencha.com/extjs/6.0/6.0.2-classic/#!/api/Ext.ComponentQuery
        emailGrid: function() {
            // Same Component can be located using itemId in ComponentQuery locator
            // ST.grid('#emailMainContainer');
            // You need to ensure locator returns single Component to avoid interacting with undesired Components
            return ST.grid('inbox');
        },
        sideMenuItem: function(itemName) {
            // Another example of ComponentQuery used to lookup Ext.menu.Item component by xtype and text property
            return ST.component('menuitem[text='+itemName+']');
        },
        emailDetails : function() {
            // Locates Email Detail panel that is shown when user clicks an email
            return ST.panel('emaildetails');
        },
        backButton : function() {
            // Various properties can be used to identify exact Component.
            // This one identifies button by iconCls property.
            // ST.button() returns ST.future.Button that provides methods specific to ExtJS Buttons
            return ST.button('button[iconCls~=fa-angle-left]');
        },
        gridColumn : function(columnName) {
            // Components can be found by their relation to other Components
            return ST.component('inbox gridcolumn[text='+columnName+']');
        },
        // Scrolls app main container to desired Y offset
        mainPanelScrollY: function(scroll){
            return ST.component('container[id=main-view-detail-wrap]').and(function(panel){
                panel.setScrollY(scroll);
            });
        },
        emailView : function() {
            // Locate Email component by xpath
            return ST.component('email');
        },
        composeEmailEditor : function() {
            // locate html editor within "Compose Email" window
            return ST.component('emailwindow htmleditor');
        },
        // Member expressions from candidate Components may be tested.
        // If the expression returns a truthy value, the candidate Component will be included in the query result
        // 'inbox gridcolumn{isCheckerHd}' locator returns check column in checkbox model
        checkAllCheckbox : function(){
            return ST.component('inbox gridcolumn{isCheckerHd}');
        },
        isDesktop : ST.os.deviceType == "Desktop"
    };
    beforeEach(function(done){
        Admin.app.redirectTo("#email");
        // navigate app to correct page and wait to be visible
        Email.emailView().visible()
            .and(done);
    });
    describe("Example loads correctly", function(){
        it("Email page screenshot should match baseline", function(done) {
            // Screenshots are only supported when running tests via CLI test runner
            ST.screenshot('email',done);
        }, 1000 * 20);
    });
    describe("Inbox panel", function(){
        describe('Grid actions', function(){
            var gridStore;
            beforeAll(function(){
                // wait to load grid data and show rows before proceeding in test
                Email.emailGrid()
                    .viewReady()
                    .and(function(grid){
                        gridStore = grid.getStore();
                    });
            });
            describe('should show email detail', function(){
                it('when clicking on grid row', function(){
                    Email.mainPanelScrollY(0);
                    Email.emailGrid()
                        .rowAt(0) // get first row
                            .reveal() // and scroll the row into view
                            .click();
                    Email.emailDetails()
                        .visible();

                    Email.backButton().click(); //navigate back to email page

                });
            });
            describe('columns are sortable', function(){
                afterAll(function(done){
                    Email.emailGrid()
                        .and(function(grid){
                            //reset sorting after tests to have same baseline for all specs
                            grid.getView().getScrollable().scrollBy(-1000,0);
                            grid.getStore().getSorters().clear();
                            grid.getStore().load(done);
                        });
                });
                describe('by clicking on header', function(){
                    beforeAll(function(){
                        Email.mainPanelScrollY(0);
                    });
                    var sorter;
                    it('\'From\' should sort emails by sender ASC', function(){
                        Email.gridColumn('From')
                            .click(10,10)
                            .wait(50)
                            .and(function(){
                                sorter = gridStore.getSorters().getAt(0);
                                // check correct grid sorting - verifying sort direction, sort property and if first row shows expected result
                                expect(sorter.getDirection()).toBe('ASC');
                                expect(sorter.getProperty()).toBe('from');
                                expect(gridStore.getAt(0).get('from')).toBe('Adam Gullner');
                            });
                    });
                    it('\'Title\' should sort emails by Title ASC', function(){
                        Email.gridColumn('Title')
                            .click(10,10)
                            .wait(50)
                            .and(function(){
                                sorter = gridStore.getSorters().getAt(0);
                                // check correct grid sorting - verifying sort direction, sort property and if first row shows expected result
                                expect(sorter.getDirection()).toBe('ASC');
                                expect(sorter.getProperty()).toBe('title');
                                expect(gridStore.getAt(0).get('title')).toBe('Ad amet aute officia non culpa ullamco non pariatur sit excepteur consequat nulla minim tempor.');
                            });
                    });
                    it('\'Received\' should sort emails by date ASC', function(){
                        //column might be scrolled out of view on small screens, so we need to scroll it into view before testing
                        Email.emailGrid().
                            and(function(grid){
                                grid.getView().getScrollable().scrollBy(1000,0);
                        });
                        Email.gridColumn('Received')
                            .click(10,10)
                            .wait(50)
                            .and(function(){
                                sorter = gridStore.getSorters().getAt(0);
                                // check correct grid sorting - verifying sort direction, sort property and if first row shows expected result
                                expect(sorter.getDirection()).toBe('ASC');
                                expect(sorter.getProperty()).toBe('received_on');
                                expect(gridStore.getAt(0).get('received_on')).toEqual(new Date('2014-02-11T04:24:27.000Z'));
                            });
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
                    beforeEach(function(done){
                        Email.emailGrid()
                            .viewReady() // waits until grid rows are rendered
                            .and(function(grid){
                                selModel = grid.getSelectionModel();
                            done();
                        })
                    });

                    it('single row selection', function(done){
                        Email.emailGrid()
                            .rowAt(0) // first row
                                .cellAt(0) // first cell
                                .reveal() // and scroll cell into view
                                .click()
                                .wait(50) // let framework process click event and check result
                                .and(function(){
                                    expect(selModel.isSelected(0)).toBeTruthy();
                                    done();
                                });
                    });
                    it('multiple row selection', function(){
                        Email.emailGrid()
                            .rowAt(0) // row index
                                .cellAt(0) // cell index
                                .reveal() // scroll into view
                                .click()
                                .wait(50)
                            .grid().rowAt(1) // pick different row
                                .cellAt(0)
                                .reveal()
                                .click()
                                .wait(50)
                                .and(function(){
                                    expect(selModel.isSelected(0)).toBeTruthy();
                                    expect(selModel.isSelected(1)).toBeTruthy();

                                });
                    });
                    it('select all rows', function(){

                        Email.checkAllCheckbox()
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
                Email.emailGrid()
                    //waits until grid rows are rendered
                    .viewReady()
                    .rowAt(0)
                        .reveal()
                        .click();

            });
            afterEach(function(){
                //need to navigate back after each spec
                Email.backButton().click();
            });
            it('should have correct email subject name', function(){
                ST.component('#emailSubjectContainer')
                    .contentLike('Estela Gibbs');
            });
            it('should accept user input in the reply textarea', function(){
                ST.component('emaildetails htmleditor')
                    .and(function(htmleditor){
                        //writing plain text instead of HTML formatted
                        htmleditor.toggleSourceEdit(true);
                    });
                ST.component('emaildetails htmleditor')
                    .visible()
                    .click()
                    .focus()// textarea needs to be focused before typing
                    .type('Empowering organizations to rapidly design, deploy, and manage mission-critical cross-platform web apps.')
                    .and(function(editor){
                        expect(editor.getValue()).toBe('Empowering organizations to rapidly design, deploy, and manage mission-critical cross-platform web apps.');
                    });
            });
        });
        // no need to test keyboard navigation on keyboardless devices
        if(Email.isDesktop){
            describe('Keyboard navigation', function(){
                describe('using tab', function(){
                    //checks if correct cells are focused when user TABs in grid
                    it('should tab between header and grid', function(){
                        Email.checkAllCheckbox()
                            .focus();
                        // using xpath to locate desired DOM elements
                        // XPath is probably the most powerful supported locator syntax.
                        // Sencha Test uses the document.evaluate method of the browser,
                        // but also a polyfill when this method is not present.
                        // http://docs.sencha.com/sencha_test/ST.Locator.html
                        ST.play([
                            { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//div[contains(@class, 'x-column-header-first')]", key: "Tab" },
                            { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[1]", key: "Tab" }
                        ]);
                        Email.emailGrid()
                            .rowAt(0)
                                .cellAt(0)
                                .focused();
                    });
                    it('should tab between grid and header', function(){
                        Email.emailGrid()
                            .rowAt(0)
                                .cellAt(0)
                                .focus();

                        ST.play([
                            { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[1]", key: "Tab" , shift : true},
                            { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//div[contains(@class, 'x-column-header-first')]", key: "Tab", shift : true }

                        ]);
                        Email.checkAllCheckbox()
                            .focused();
                    });
                });
                describe('using arrows', function(){
                    describe('in grid header', function(){
                        beforeEach(function(){
                            //focus header to ensure same staring point for following tests
                            Email.checkAllCheckbox()
                                .focus();
                        });
                        it('right arrow should move to next header column', function(){
                            // using xpath to locate desired DOM elements
                            // XPath is probably the most powerful supported locator syntax.
                            // Sencha Test uses the document.evaluate method of the browser,
                            // but also a polyfill when this method is not present.
                            // http://docs.sencha.com/sencha_test/ST.Locator.html
                            ST.play([
                                { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//div[contains(@class, 'x-column-header-first')]", key: "ArrowRight" },
                                { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//div[contains(@class, 'x-box-target')]/div[contains(@class, 'x-column-header') and position()=2]", key: "ArrowRight" }
                            ]);
                            ST.component('inbox gridcolumn[dataIndex=favorite]')
                                .focused();
                        });
                        it('left arrow should move to previous header column', function(){
                            //again using xpath to locate single DOM element and trigger event for desired element
                            // it's crucial to pick right elements when trying to mimic native events
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
                            Email.emailGrid()
                                .rowAt(0)
                                .cellAt(0)
                                .focus();
                        });
                        it('right arrow should move to next cell',function(){
                            ST.play([
                                { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[1]", key: "ArrowRight" },
                                { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[2]", key: "ArrowRight" }
                            ]);
                            Email.emailGrid()
                                .rowAt(0)
                                .cellAt(1)
                                .focused();
                        });
                        it('right arrow on last cell should move focus to first cell on next row', function(){
                            Email.emailGrid()
                                .rowAt(0)
                                .cellAt(5)
                                .focus();
                            ST.play([
                                { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[6]", key: "ArrowRight" },
                                { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='1']/tbody/tr/td[1]", key: "ArrowRight" }
                            ]);
                            Email.emailGrid()
                                .rowAt(1)
                                .cellAt(0)
                                .focused();
                        });
                        it('left arrow should move to previous cell',function(){
                            Email.emailGrid()
                                .rowAt(0)
                                .cellAt(1)
                                .focus();
                            ST.play([
                                { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[2]", key: "ArrowLeft" },
                                { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[1]", key: "ArrowLeft" }
                            ]);
                            Email.emailGrid()
                                .rowAt(0)
                                .cellAt(0)
                                .focused();
                        });
                        it('left arrow on first cell of second row should move focus to last cell on first row', function(){
                            Email.emailGrid()
                                .rowAt(0)
                                .cellAt(0)
                                .focus();
                            ST.play([
                                { type: "keydown", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='1']/tbody/tr/td[1]", key: "ArrowLeft" },
                                { type: "keyup", target: "//div[contains(@class,'email-inbox-panel')]//table[@data-recordindex='0']/tbody/tr/td[6]", key: "ArrowLeft" }
                            ]);
                            Email.emailGrid()
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
                Email.sideMenuItem('Compose').click();
                ST.component('emailwindow').and(function(win) {
                    expect(win.getTitle()).toBe('Compose Message');
                });
                ST.button('emailwindow button[text=Discard]').click();
            });
            it("can close window by close tool", function(){
                Email.sideMenuItem('Compose').click();
                ST.component('emailwindow tool[type=close]')
                    .click();
                expect(Ext.WindowManager.getActive()).not.toBeDefined();
            });
            describe("type into fields", function(){
                beforeEach(function(){
                    Email.sideMenuItem('Compose').click();
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
                    Email.composeEmailEditor()
                        .and(function(htmleditor){
                            //need to enable source editing to avoid messing with iframe
                            htmleditor.toggleSourceEdit(true);
                        });
                    Email.composeEmailEditor()
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
