describe("adminDashboard", function() {
    var Dash = {
        treeList: function () {
            return ST.component('treelist');
        },
        hamburger: function() {
            return ST.component('@main-navigation-btn');
        },
        menuItem: function(itemName) {
            return ST.component('treelistitem[text='+itemName+']');
        },
        toolbarItem: function(itemName) {
            return ST.button('toolbar button[href=#'+itemName+']');
        },
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

    describe('App navigation', function(){
        describe("Tree menu", function(){
            it("treelist menu should be initially expanded", function(){
                Dash.treeList()
                    .visible()
                    .and(function(navMenu){
                        expect(navMenu.getMicro()).toBeFalsy();
                    });
            });
            it("clicking on hamburger should toggle treelist navigation mode - collapse", function() {
                Dash.hamburger()
                    .visible()
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
                    .visible()
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
                            });
                    });
                    it('and navigate to Blank Page',function(){
                        Dash.menuItem('Blank Page')
                            .click()
                            .and(function(menuItem){
                                expect(menuItem.el.hasCls('x-treelist-item-selected')).toBe(true);
                            });
                        Dash.blankPageView().visible();
                    });
                    it('and navigate to Login view', function(){
                        Dash.menuItem('Login')
                            .click()
                            .and(function(menuItem){
                                expect(menuItem.el.hasCls('x-treelist-item-selected')).toBe(true);
                            });
                        Dash.loginView().visible();
                    });
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
                ST.component('tooltip{isVisible()}')
                    .contentLike(/See latest search/);
            });
            describe('navigate to pages using toolbar',function(){
                if(Dash.isDesktop){ // Prevented due to issue when clicking toolbar buttons fails on tablets - https://sencha.jira.com/browse/ORION-588
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
