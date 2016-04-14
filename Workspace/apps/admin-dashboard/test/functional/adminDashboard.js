describe("adminDashboard", function() {
    /*
     * Futures enable tests to practice the DRY (Don’t Repeat Yourself) principle.
     * Instead of creating the future instance at the point of need,
     * consider the following alternative.
     **/
    var Dash = {
        // Sencha Test provides multiple ways to locate an element from a text string
        // A locator solves the same problem as a CSS selector but is a super-set of CSS selector syntax.
        // The locator syntax is more expressive than selectors to provide more options for testing real-world applications.
        // When testing applications, ideally the application developers provide a reliable way for testers
        // to locate application components and elements.
        // More info can be found in documentation http://docs.sencha.com/sencha_test/ST.Locator.html

        // Following locates ExtJS TreeList component based on it's xtype - this locator is called ComponentQuery
        // and can be used to locate Components in applications built using Sencha frameworks.
        // The majority of logic operates at a layer above elements: Components.
        // It is therefore more desirable to locate and operate on components than raw DOM elements.
        // http://docs.sencha.com/extjs/6.0/6.0.2-classic/#!/api/Ext.ComponentQuery
        treeList: function () {
            // ST.component('treelist') looks for instance of Ext.Tree.List component in application,
            // in this case it means app navigation menu.
            return ST.component('treelist');
        },
        hamburger: function() {
            // using at-path to locate Menu Toggle element by it's id
            // more info about at-path can be found in documentation
            // http://docs.sencha.com/sencha_test/ST.Locator.html
            // user might use different locators to achieve same result
            // ComponentQuery - 'toolbar #main-navigation-btn'
            // xpath - '//a[@id="main-navigation-btn"]'
            return ST.component('#main-navigation-btn');
        },
        menuItem: function(itemName) {
            // Another example of ComponentQuery used to lookup Ext.list.TreeItem component by xtype and text property
            return ST.component('treelistitem[text='+itemName+']');
        },
        toolbarItem: function(itemName) {
            // ComponentQuery using href property to locate right button in Top toolbar.
            return ST.button('toolbar button[href=#'+itemName+']');
        },
        // Following locators are in test used to verify if correct view is loaded in application.
        emailView: function() {
            return ST.component('email');
        },
        profileView: function(){
            return ST.component('profile');
        },
        searchView: function() {
            return ST.component('searchresults');
        },
        blankPageView: function() {
            return ST.component('pageblank');
        },
        loginView: function() {
            return ST.component('login');
        },
        isDesktop : ST.os.deviceType == "Desktop"
    };
    beforeEach(function(){
        Admin.app.redirectTo("#dashboard"); // make sure you are on dashboard homepage
    });
    describe("Example loads correctly", function(){
        it("Admin dashboard page screenshot should match baseline", function(done) {
            // Screenshots are only supported when running tests via CLI test runner
            Dash.treeList().visible().and(function(){
                ST.screenshot('dash-navigation',done);
            });
        }, 1000 * 20);
    });
    describe('App navigation', function(){
        describe("Tree menu", function(){
            it("treelist menu should be initially expanded", function(){
                Dash.treeList()
                    // Waiting is needed in this case to make sure test won't progress before all necessary parts are in place
                    .visible()
                    .and(function(navMenu){
                        // If Tree List is expanded micro should be null.
                        expect(navMenu.getMicro()).toBeFalsy();
                    });
            });
            it("clicking on hamburger should toggle treelist navigation mode - collapse", function() {
                Dash.hamburger()
                    .click();
                Dash.treeList()
                    .and(function(navMenu){
                        expect(navMenu.getMicro()).toBe(true);
                    });
                //return to initial state
                Dash.hamburger().click();
            });
            it("clicking on hamburger should toggle treelist navigation mode - collapse and expand", function(){
                Dash.hamburger()
                    .click()
                    .click();
                Dash.treeList()
                    .and(function(navMenu){
                        expect(navMenu.getMicro()).toBe(false);
                    });
            });
            describe('click in menu', function(){
                // Click in menu and check if correct view is loaded
                it('and navigate to email view', function(){
                    Dash.menuItem('Email')
                        .click()
                        // if selected it should be highlighted with right class
                        .hasCls('x-treelist-item-selected')
                        .and(function(menuItem){
                            expect(menuItem.el.hasCls('x-treelist-item-selected')).toBe(true);
                        });
                    Dash.emailView().visible();
                });
                it('and navigate to profile view', function(){
                    Dash.menuItem('Profile')
                        .click()
                        .hasCls('x-treelist-item-selected')
                        .and(function(menuItem){
                            expect(menuItem.el.hasCls('x-treelist-item-selected')).toBe(true);
                        });
                    Dash.profileView().visible();
                });
            });
            describe('navigate in nested menu', function(){
                beforeEach(function(){
                    //Need to ensure menu item is collapsed
                    Dash.menuItem('Pages')
                        .and(function(menuItem){
                            menuItem.collapse();
                        });
                });
                it('click to expand menu item', function(){
                    Dash.menuItem('Pages')
                        .and(function(menuItem){
                            expect(menuItem.isExpanded()).toBe(false);
                        })
                        .click()
                        // waiting to make sure proper state will be available
                        .wait(function (menuItem) {
                            return menuItem.isExpanded();
                        }) 
                        .and(function(menuItem){
                            expect(menuItem.isExpanded()).toBe(true);
                        });
                });
                describe('click in nested menu', function(){
                    // Click in nested menu and check if correct view is loaded
                    beforeEach(function(){
                        //Need to ensure nested menu items will be visible for testing
                        Dash.menuItem('Pages')
                            .and(function(menuItem){
                                menuItem.expand();
                            }).wait(function (menuItem) {
                                return menuItem.isExpanded();
                            });
                    });
                    it('and navigate to Blank Page',function(done){
                        Dash.menuItem('Blank Page')
                            .click();
                        Dash.blankPageView().visible();
                        done();
                    }, 30000);
                    it('and navigate to Login view', function(done){
                        Dash.menuItem('Login')
                            .click();
                        Dash.loginView().visible();
                        done();
                    }, 30000);
                });
            });
        });
        describe("Toolbar", function(){
            it("tooltip should be shown on mouse over", function(){
                //tooltips on desktop are shown on mouseover
                if(Dash.isDesktop){
                    ST.play([
                        { type: "mouseover", target: "toolbar button[href=#searchresults]", x: 10, y: 10 }
                    ]);
                }else{
                    //but you need to click to show tooltip on tablet
                    Dash.toolbarItem('searchresults')
                        .click();
                }
                // Member expressions from candidate Components may be tested.
                // If the expression returns a truthy value, the candidate Component will be included in the query result
                // locator returns that is currently visible.
                ST.component('tooltip{isVisible()}')
                    .contentLike(/See latest search/);
            });
            describe('navigate to pages using toolbar',function(){
                // these test cases aren't executed on mobile devices
                if(Dash.isDesktop){
                    // just click toolbar item and if right view is loaded in app's main container
                    it("clicking on magnifier tool should navigate you to Search page", function(){
                        Dash.toolbarItem('searchresults')
                            .click();
                        Dash.searchView().visible();
                    });
                    it("clicking on email tool should navigate you to Email page", function(){
                        Dash.toolbarItem('email')
                            .click();
                        Dash.emailView().visible();
                    });
                    it("clicking on FAQ tool should navigate you to FAQ page", function(){
                        Dash.toolbarItem('faq')
                            .click();
                        ST.component('faq').visible();
                    });
                    it("clicking on profile tool should navigate you to FAQ page", function(){
                        Dash.toolbarItem('profile')
                            .click();
                        Dash.profileView().visible();
                    });
                }
            });
        });
    });
});
