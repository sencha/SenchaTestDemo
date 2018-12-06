describe("adminDashboard", function() {
    var Dash = {
        treeList: function () {
            return ST.component('treelist');
        },
        hamburger: function() {
            return ST.component('button[_iconCls~=fa-bars]');
        },
        navContainer : function () {
            return ST.component('[reference=navigation]');
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
        loadMask: function() {
            return ST.component('loadmask[userCls=main-nav-mask]');
        },
        dashView: function(){
            return ST.component('admindashboard');
        },
        isDesktop : Lib.isDesktop
        ,
        isPhone : Lib.isPhone

    };
    beforeEach(function () {
        Lib.beforeAll("#dashboard", "admindashboard", undefined, "admin");
    });
    afterAll(function(){
        //Lib.afterAll("admindashboard");//It is not need destroyed
        ST.options.eventDelay = 500;
    });

    describe('App navigation', function(){
        describe("Tree menu", function(){
            it("treelist menu should be hidden on phone and visible otherwise", function(){
                if(Dash.isPhone){
                    Dash.navContainer()
                        .visible()
                        .hasCls("main-nav-slid-out")
                        .and(function (navCont) {
                            expect(navCont.el.hasCls("main-nav-slid-out")).toBeTruthy();
                    });
                }else{
                    Dash.treeList()
                        .visible()
                        .and(function(navMenu){
                            expect(navMenu.getMicro()).toBeFalsy();
                        });
                }

            });
            it("clicking on hamburger should toggle treelist navigation mode", function() {
                Dash.hamburger()
                    .click();
                if(Dash.isPhone){
                    Dash.loadMask()
                        .visible()
                        .and(function(mask){
                            expect(mask).toBeDefined();
                        });}
                    else{
                        Dash.treeList()
                            .wait(function(treeList){
                                return treeList.getMicro();
                            })
                            .and(function(treeList){
                                expect(treeList.getMicro()).toBeTruthy();
                        });

                    }

                //return to initial state
                if(Dash.isPhone){
                    Dash.menuItem('Dashboard').click();

                }else{
                    Dash.hamburger().click();
                }/*else{
                    console.log('here')
                    Dash.navContainer().and(function(nav){
                        nav.toggleCls('main-nav-collapsed',true);
                    });
                    ST.component('[reference=logo]').and(function(logo){
                        logo.toggleCls('main-nav-collapsed');
                    })
                    Dash.treeList().and(function(treeList){

                        treeList.setMicro(false);
                    });
                };*/

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
            describe('navigate to pages using toolbar',function(){
                //if(Dash.isDesktop){ // Prevented due to issue when clicking toolbar buttons fails on tablets - https://sencha.jira.com/browse/ORION-588
                    it("clicking on magnifier tool should navigate you to Search page", function(){

                        Dash.toolbarItem('searchresults')
                            .click();
                        Dash.searchView()
                            .visible();

                    });
                    it("clicking on email tool should navigate you to Email page", function(){

                        Dash.toolbarItem('email')
                            .click();
                        Dash.emailView()
                            .visible();
                    });
                    it("clicking on FAQ tool should navigate you to FAQ page", function(){

                        Dash.toolbarItem('faq')
                            .click();
                        ST.component('faq')
                            .visible();
                    });
                    it("clicking on dashboard tool should navigate you to Dashboard page", function(){

                        Dash.toolbarItem('dashboard')
                            .click();
                        Dash.dashView()
                            .visible();
                    });
                //}
            });
        });
    });
});
