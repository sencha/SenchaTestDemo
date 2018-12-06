describe('Search results', function() {
    var Search = {
        searchTitleTab: function (title) {
            return ST.element('tab[_title=' + title +']');
        }
    };
    var Msg = {
        getInbox: function (order) {
            return ST.grid('searchresults inbox').rendered().rowAt(order).reveal();
        },
        getUsers: function (order) {
            return ST.grid('searchusers').rendered().rowAt(order).reveal();
        }
    };
    var View = {
        getAll:function (order) {
            return ST.dataView('allresults').rendered().itemAt(order);
        },
        getInbox: function (order) {
            return ST.dataView('searchresults inbox').rendered().itemAt(order);
        },
        getUsers: function (order) {
            return ST.dataView('searchusers').rendered().itemAt(order);
        }
    };

    beforeAll(function () {
        // make sure you are on search results page
        Lib.beforeAll("#searchresults", "searchresults", undefined, "admin");
    });
    afterAll(function(){
        //Lib.afterAll("searchresults");//It is not need destroyed
        ST.options.eventDelay = 500;
    });

    describe("Example loads correctly", function() {
        it ("Search results page correctly loaded", function() {
            ST.panel("searchresults")
                .rendered()
                .and(function (page){
                    expect(page.rendered).toBeTruthy();
            });
        });

    });

    describe('Check tab "All"', function() {
        var links = ["www.et.com", "www.magna.com", "www.ea.com", "www.labore.com",
                     "www.duis.com", "www.Lorem.com", "www.anim.com", "www.exercitation.com",
                     "www.nisi.com", "www.aliquip.com", "www.proident.com", "www.minim.com",
                     "www.consequat.com", "www.ut.com", "www.tempor.com", "www.dolore.com",
                     "www.aliqua.com", "www.reprehenderit.com", "www.occaecat.com", "www.ea.com</a>",
                     "www.sunt.com", "www.sint.com", "www.ullamco.com", "www.ut.com</a>", "www.nulla.com"];

        function clickOnItem (link,order) {
            it('Check item "' + link + '" on "All" tab', function() {
                // get specific item from dataView
                View.getAll(order)
                    .visible()
                    .click()
                    .selected()
                    .and(function(record){
                        // check if item is selected
                        expect(record.el.dom.className).toContain('search-result-item-selected');
                        // check link
                        expect(record.el.dom.innerHTML).toContain(link);
                    });
            });
        }

        function checkLink (link) {
            ST.element("//a[contains(text(),'" + link + "')]")
                .click()
                .and(function(contentPage) {
                    expect(contentPage.dom.innerHTML).toBe(link);
                });
            // check redirection after using link
            ST.element('treelist => .x-treelist-root-container').down('>> .fa-search').click();
            ST.component("searchresults").visible();
        }

        it('"All" title is active', function() {
            Search.searchTitleTab('All')
                .click()
                .and(function(title) {
                    expect(title.dom.textContent).toBe('All');
                    expect(title.dom.className).toContain("x-active");
                });
        });

        it('Compare screenshot on "All" tab', function(){
            // take a screenshot
            Lib.screenshot('searchResults-all');
        });

        describe("Check all items", function() {
            //there is bug, that for the first time it won't click properly
            //but second time usually will, so here are 2 clicks before tested click
            //workaround due to ORION-1607
            //will prevent random bugs (possibly not all of them, but most for sure)
            it("ORION-1607", function() {
                View.getAll(1)
                    .visible()
                    .click(1,1);
                View.getAll(0)
                    .visible()
                    .click(1,1);
            });

            for (var i=1 ; i<links.length ; i++) {
                clickOnItem(links[i],i);
            }
        });

        describe("Check links", function() {
            it("Check first link", function () {
                checkLink(links[0]);
            });
            it("Check last link", function () {
                checkLink(links[links.length - 1]);
            });
        });

    });


    describe('Check tab "Users"', function() {
        var names = ['#', 'User', 'Name', 'Email', 'Date', 'Subscription'],
            usersStore;

        function sortColumn(column, direction) {
            it("Check column " + column + " if is sorted " +direction, function() {
                if(Ext.ComponentQuery.query('searchusers gridcolumn[text=' + column + ']')[0]._sortable) {
                    ST.grid('searchusers gridcolumn[text="' + column + '"]')
                        .click();
                    ST.grid('searchusers')
                        .rendered()
                        .and(function(){
                            expect(usersStore.getSorters().getAt(0).getDirection()).toBe(direction);
                        });
                    }
            });
        }

        function clickOnRow(order) {
            it("Select row number" + order, function(){
                var selectRow;
                if (Lib.isPhone){
                    // get specific item from dataView
                    View.getUsers(order)
                        .click(1,1)
                        .and (function(row){
                            selectRow = row;
                        })
                        .and(function(){
                            expect(selectRow.el.dom.className).toContain("x-selected");
                        });
                }else{
                    // get specific row from grid
                    Msg.getUsers(order)
                        .click(1,1)
                        .and (function(row){
                            selectRow = row;
                        })
                        .grid()
                        .selectedAt(order)
                        .and(function(){
                            expect(selectRow.el.dom.className).toContain("x-selected");
                        });

                }

            });
        }
        beforeAll(function () {
            Search.searchTitleTab('Users')
                .click();
        });

        it('"Users" title is active', function() {
            Search.searchTitleTab('Users')
                .and(function(title) {
                    expect(title.dom.textContent).toBe('Users');
                    expect(title.dom.className).toContain("x-active");
                });
            if (Lib.isPhone){
                ST.dataView('searchusers')
                    .wait(function(dataView){
                         usersStore = dataView.getStore();
                         return usersStore;
                    });

            }else{
                ST.grid('searchusers')
                    .wait(function(grid){
                        usersStore = grid.getStore();
                        return usersStore;
                    });
            }
        });

        it('Compare screenshot on "Users" tab', function(){
            // take a screenshot
            Lib.screenshot('searchResults-users');
        });


        describe("Click on the all rows into table - ORION-2196", function(){
            it("due to ORION-1607", function() {
                if (Lib.isPhone){
                    View.getUsers(1)
                        .click(1,1);

                    View.getUsers(0)
                        .click(1,1);
                }else{
                    Msg.getUsers(0)
                        .click(1,1)
                }
            });
            for (var i=1 ; i<11 ; i++) {
                clickOnRow(i);
            }
        });


        if (Lib.isPhone) {
                xit ("PHONE: Sort is not possible on phone");
        } else {
            describe("DESKTOP/TABLET: Sort every column into Users tab", function() {
                for (var i=0 ; i<names.length ; i++) {
                    sortColumn(names[i],'ASC');
                    sortColumn(names[i],'DESC');
                }
            });
        }
    });

    describe('Check tab "Messages"', function() {
        function selectMessage(order) {
            it('Select ' + (order+1) + '. message', function() {
                var selectMsg;
                // get specific row from grid
                Msg.getInbox(order)
                    .click(1,1)
                    .and (function(msg){
                        selectMsg = msg;
                    })
                    .grid()
                    .selectedAt(order)
                    .and(function(){
                        expect(selectMsg.el.dom.className)
                            .toContain("x-selected");
                    });
            });
        }

        function selectMsgPhone(order) {
            it('Select ' + (order+1) + '. message on phone', function(){
                var selectRow;
                 // get specific item from dataView
                View.getInbox(order)
                    .click()
                    .and (function(row){
                        selectRow = row;
                    })
                    .dataView()
                    .selectedAt(order)
                    .and(function(){
                        expect(selectRow.el.dom.className).toContain("x-selected");
                    });
            });
        }

        function deselectMessage(order) {
            it('Deselect ' + (order+1) + '. message', function() {
                var selectMsg;
                // get specific row from grid
                Msg.getInbox(order)
                    .click(1,1)
                    .and (function(msg){
                        selectMsg = msg;
                    })
                    .grid()
                    .deselectedAt(order)
                    .and(function(){
                        expect(selectMsg.el.dom.className)
                            .not.toContain("x-selected");
                    });
            });
        }

        function checkReadFavoriteAttach(order) {
            // get specific row from grid
            Msg.getInbox(order)
                .and(function(msg){
                    // according to className check readed msg
                    expect(msg.el.dom.className).toContain("inbox-read");
                    // according to className check favorite on msg
                    expect(msg.el.dom.firstChild.children[0].firstChild.className)
                        .toContain("inbox-favorite-icon");
                    // according to className check attachment on msg
                    expect(msg.el.dom.firstChild.children[3].firstChild.className)
                        .toContain("fa-paperclip");
                })

        }

        function checkNoReadFavoriteAttach(order) {
            // get specific row from grid
            Msg.getInbox(order)
                .and(function(msg){
                    // according to className check unreaded msg
                    expect(msg.el.dom.className).not.toContain("inbox-read");
                    // according to className check no favorite on msg
                    expect(msg.el.dom.firstChild.children[1].firstChild.className)
                        .not.toContain("inbox-favorite-icon");
                    // according to className check no attachment on msg
                    expect(msg.el.dom.firstChild.children[4].firstChild.className)
                        .not.toContain("fa-paperclip");
                });
        }

        function checkReadFavoriteAttachPhone(order) {
            // get specific item from view
            View.getInbox(order)
                    .and(function(item){
                        //read
                        expect(item.el.dom.firstChild.children[0].className)
                            .toContain("inbox-read");
                        //favorite inbox-favorite-icon
                        expect(item.el.dom.firstChild.children[1].children[1].firstChild.className)
                            .toContain("inbox-favorite-icon");
                        //attachment  fa-paperclip
                        expect(item.el.dom.firstChild.children[0].children[1].firstChild.className)
                            .toContain("fa-paperclip");
                    });
        }

        function checkNoReadFavoriteAttachPhone(order) {
            // get specific item from view
            View.getInbox(order)
                    .and(function(item){
                        //read
                        expect(item.el.dom.firstChild.children[0].className)
                            .toContain("inbox-unread");
                        //favorite
                        expect(item.el.dom.firstChild.children[1].children[1].firstChild.className)
                            .not.toContain("inbox-favorite-icon");
                        //attachment  inbox-attachment
                        expect(item.el.dom.firstChild.children[0].children[1].firstChild.className)
                            .not.toContain("fa-paperclip");
                    });
        }
        beforeAll(function () {
            Search.searchTitleTab('Messages')
                .click();
        });

        it('Check tab "Messages" is active', function() {
            Search.searchTitleTab('Messages')
                .and(function(title) {
                    expect(title.dom.textContent).toBe('Messages');
                    expect(title.dom.className).toContain("x-active");
                });
        });

        it('Compare screenshot on "Messages" tab', function(){
            // take a screenshot
            Lib.screenshot('searchResults-messages');
        });

        // it's neccesary to divide it on Phone and Desktop/Tab part
        // example has got totally diferent structure
        if (Lib.isPhone){
            describe("Phone", function(){
                describe("Select all messages on phone", function(){
                    for (var i=0 ; i<20 ; i++) {
                        selectMsgPhone(i);
                    }
                });

                it("Check read message with favorite and attachement on Phone", function(){
                    checkReadFavoriteAttachPhone(6);
                });

                it("Check unread message without favorite and without attachement on Phone", function(){
                    checkNoReadFavoriteAttachPhone(5);
                });
            });
        } else
        {
            describe("Desktop/Tablet", function(){
                /* - muted due to ORION-1607
                describe("Select all messages on Desktop/Tablet", function(){
                    for (var i=0 ; i<20 ; i++) {
                        selectMessage(i);
                    }
                });

                describe("Unselect all messages on Desktop/Tablet", function(){
                    for (var j=0 ; j<20 ; j++) {
                        deselectMessage(j);
                    }
                });
                */
                it("Check read message with favorite and attachement on Desktop/Tablet", function(){
                    checkReadFavoriteAttach(10);
                });

                it("Check unread message without favorite and without attachement on Desktop/Tablet", function(){
                    checkNoReadFavoriteAttach(11);
                });
            });
        }
    });
});
