/**
 * @file listSwiper.js
 * @name Lists/List Swiper
 * @created 2017/04/24
 * Tested on browsers : Chrome, FF, IE11, Edge, Safari 10
 * Tested on Tablets : Android 6, iOS10
 * Tested on Phones : Android 6, iOS9
 *
 * Passed on : All tested devices
 */
describe("List Swiper", function () {
    var urlHash = '#basic-step-swiper';
    var prefix = 'basic-step-swiper ';

    beforeAll(function () {
        Lib.beforeAll(urlHash, prefix);
    });

    var List = {
        filterFn: function (textToFind) {
            //wrap filtering function so it can be parametrized
            return function (textToFind) {
                return function (record) {
                    return (record.get('firstName') + ' ' + record.get('lastName') === textToFind);
                }
            }(textToFind);
        },
        list: function () {
            return ST.component(prefix);
        },
        checkItemContent: function (listitem, expectedText) {
            var textContent = listitem.el.dom.textContent;
            expect(textContent).toBe(expectedText);
        },
        getDeltaX: function (listitem, delta) {
            return Math.floor(delta * listitem.el.getWidth() / 100);
        },
        getMsgBoxByTitle: function (title) {
            return ST.component('messagebox[title=' + title + ']');
        },
        swipeItemLeftToLimit : function (dragLimit,name) {
            Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                .and(function (listitem) {
                    var deltaX = List.getDeltaX(listitem, dragLimit);
                    Lib.Lists.dragLeftBy(listitem, deltaX);
                });
        },
        dragAndCheckMsgBoxVisible : function (name,dragLimit,msgTitle){
            Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                .and(function (listitem) {
                    var deltaX = List.getDeltaX(listitem, dragLimit);
                    Lib.Lists.dragLeftBy(listitem, deltaX);
                    List.getMsgBoxByTitle(msgTitle)
                        .visible()
                        .and(function (msgBox) {
                            expect(msgBox.isVisible()).toBe(true);
                        });
                });
        },
        checkAlertBox : function (msgTitle, name) {
            describe('Alert box', function () {
                it('has title "'+msgTitle+'"', function () {
                    List.getMsgBoxByTitle(msgTitle)
                        .visible()
                        .and(function (msgBox) {
                            expect(msgBox.getTitle()).toBe(msgTitle);
                        });
                });
                it('contains name of dragged list item ' + name, function () {
                    List.getMsgBoxByTitle(msgTitle)
                        .visible()
                        .and(function (msgBox) {
                            var text = msgBox._message.el.dom.innerText;
                            expect(text).toContain(name);
                        });
                });
                it('should close when clicked OK', function () {
                    List.getMsgBoxByTitle(msgTitle).down('button[text=OK]')
                        .visible()
                        .click()
                        .hidden();
                });
            });
        },
        testItemSwipe : function (name) {
            describe('Item swiping', function () {
                describe('Swipe to left', function () {
                    describe('Message item', function () {
                        var msgTitle = 'Send To';
                        var controller;
                        beforeEach(function () {
                            List.list().and(function (list) {
                                controller = list.getController();
                                spyOn(controller, 'onMessage').and.callThrough();
                            });

                        });
                        afterEach(function () {
                            if (Ext.first('messagebox[title=Send To]')) {
                                Ext.first('messagebox[title=Send To]').hide();
                            }
                        });
                        afterAll(function () {
                            if (Ext.first('messagebox[title=Send To]')) {
                                Ext.first('messagebox[title=Send To]').hide();
                            }
                        });
                        it('should not trigger action when dragged bellow treshold 25%', function () {
                            // % of list item width
                            var dragLimit = 25;
                            Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                .and(function (listitem) {
                                    var deltaX = List.getDeltaX(listitem, dragLimit);
                                    Lib.Lists.dragLeftBy(listitem, deltaX);
                                    expect(controller.onMessage).not.toHaveBeenCalled();
                                });
                        });
                        describe('show messageBox when dragged by 26% of item width', function () {
                            // % of list item width
                            var dragLimit = 26;
                            beforeEach(function () {
                                List.swipeItemLeftToLimit(dragLimit,name);
                            });
                            describe('Message box', function () {
                                it('has title Send To', function () {
                                    List.getMsgBoxByTitle(msgTitle)
                                        .visible()
                                        .and(function (msgBox) {
                                            expect(msgBox.getTitle()).toBe('Send To');
                                        });
                                });
                                it('contains name of dragged list item ' + name, function () {
                                    List.getMsgBoxByTitle(msgTitle)
                                        .visible()
                                        .and(function (msgBox) {
                                            var text = msgBox._message.el.dom.innerText;
                                            expect(text).toContain(name);
                                        });
                                });
                                describe('text field accepts value', function () {
                                    beforeEach(function () {
                                        spyOn(console, 'log');
                                    });
                                    it('and logs value into console when submitted', function () {
                                        List.getMsgBoxByTitle(msgTitle).down('button[text=OK]')
                                            .click()
                                            .hidden()
                                            .and(function () {
                                                expect(console.log).toHaveBeenCalledWith('Send message:', '');
                                            });
                                    });
                                    it('and logs user input into console when submitted', function () {
                                        List.getMsgBoxByTitle(msgTitle).gotoTextField('textfield')
                                            .type(name);
                                        List.getMsgBoxByTitle(msgTitle).down('button[text=OK]')
                                            .click()
                                            .hidden()
                                            .and(function () {
                                                expect(console.log).toHaveBeenCalledWith('Send message:', name);
                                            });
                                    });
                                    it('and does not log into console when Cancel button is clicked', function () {
                                        List.getMsgBoxByTitle(msgTitle).gotoTextField('textfield')
                                            .type(name);
                                        List.getMsgBoxByTitle(msgTitle).down('button[text=Cancel]')
                                            .click()
                                            .hidden()
                                            .and(function () {
                                                expect(console.log).not.toHaveBeenCalledWith('Send message:', name);
                                            });
                                    });
                                });
                            });
                        });
                        describe('drag treshold between 26 and 49%', function () {
                            it('should trigger action when dragged to 49% of item width', function () {
                                var dragLimit = 49;
                                List.dragAndCheckMsgBoxVisible(name,dragLimit,msgTitle);
                            });
                            it('should trigger action when dragged to 50% of item width', function () {
                                var dragLimit = 50;
                                List.dragAndCheckMsgBoxVisible(name,dragLimit,msgTitle);
                            });
                        });
                    });
                    describe('Settings item', function () {
                        var msgTitle = 'Edit Settings';
                        afterEach(function () {
                            if (Ext.first('messagebox[title=Edit Settings]')) {
                                Ext.first('messagebox[title=Edit Settings]').hide();
                            }
                        });
                        describe('show messageBox when dragged by 51% of item width', function () {
                            // % of list item width
                            var dragLimit = 51;
                            beforeEach(function () {
                                List.swipeItemLeftToLimit(dragLimit,name);
                            });
                            List.checkAlertBox(msgTitle,name);
                        });
                        describe('drag treshold', function () {
                            it('should trigger action when dragged to 76% of item width', function () {
                                var dragLimit = 76;
                                List.dragAndCheckMsgBoxVisible(name,dragLimit,msgTitle);
                            });
                            it('should trigger action when dragged to 100% of item width', function () {
                                var dragLimit = 100;
                                List.dragAndCheckMsgBoxVisible(name,dragLimit,msgTitle);
                            });
                        });
                    });
                });
                describe('Swipe to right', function () {
                    describe('Phone item', function () {
                        var msgTitle = 'Call';
                        var controller;
                        beforeEach(function () {
                            List.list().and(function (list) {
                                controller = list.getController();
                                spyOn(controller, 'onCall').and.callThrough();
                            });
                        });
                        afterEach(function () {
                            if (Ext.first('messagebox[title=Call]')) {
                                Ext.first('messagebox[title=Call]').hide();
                            }
                        });
                        it('should not trigger action when dragged bellow treshold 25%', function () {
                            // % of list item width
                            var dragLimit = 25;
                            Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                .and(function (listitem) {
                                    var deltaX = List.getDeltaX(listitem, dragLimit);
                                    Lib.Lists.dragRightBy(listitem, deltaX);
                                    expect(controller.onCall).not.toHaveBeenCalled();
                                });
                        });
                        describe('show messageBox when dragged by 26% of item width', function () {
                            // % of list item width
                            var dragLimit = 26;
                            beforeEach(function () {
                                Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                    .and(function (listitem) {
                                        var deltaX = List.getDeltaX(listitem, dragLimit);
                                        Lib.Lists.dragRightBy(listitem, deltaX);
                                    });
                            });
                            List.checkAlertBox(msgTitle, name);
                        });
                        describe('drag treshold', function () {
                            it('should trigger action when dragged to 76% of item width', function () {
                                var dragLimit = 76;
                                Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                    .and(function (listitem) {
                                        var deltaX = List.getDeltaX(listitem, dragLimit);
                                        Lib.Lists.dragRightBy(listitem, deltaX);
                                        List.getMsgBoxByTitle(msgTitle)
                                            .visible()
                                            .and(function (msgBox) {
                                                expect(msgBox.isVisible()).toBe(true);
                                            });
                                    });
                            });
                            it('should trigger action when dragged to 100% of item width', function () {
                                var dragLimit = 100;
                                Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                    .and(function (listitem) {
                                        var deltaX = List.getDeltaX(listitem, dragLimit);
                                        Lib.Lists.dragRightBy(listitem, deltaX);
                                        List.getMsgBoxByTitle(msgTitle)
                                            .visible()
                                            .and(function (msgBox) {
                                                expect(msgBox.isVisible()).toBe(true);
                                            });
                                    });
                            });
                        });
                    });
                });
            });
        }
    };

    afterAll(function () {
        Lib.afterAll(prefix);
    });
    describe('Example loads', function () {
        var firstName = 'Alana Scannell';
        beforeAll(function () {
            Lib.Lists.getListItemByIndex(0,prefix).visible();
        });
        it('list has more than 20 records initially visible', function () {
            List.list().visible()
                .and(function (list) {
                    // there is various item count based on device size it is usually 20+
                    expect(list.getItemCount()).toBeGreaterThan(20);
                });
        });
        it('first item is ' + firstName, function () {
            Lib.Lists.getListItemByIndex(0, prefix)
                .and(function (listitem) {
                    List.checkItemContent(listitem, firstName);
                });
        });
        it('screenshots are same', function () {
            Lib.screenshot("KS_Basic_Step_Swiper");
        });
    });
    describe('First item', function () {
        List.testItemSwipe('Alana Scannell');
    });
    describe('Last item', function () {
        var lastItemName = 'Zebora Lockley';
        beforeAll(function () {
            List.list()
                .visible()
                .and(function (list) {
                    // get a record and scroll to it
                    var rec = list.getStore().last();
                    list.scrollToRecord(rec);
                });
            Lib.Lists.getListItemByText(prefix,List.filterFn(lastItemName))
                .visible();
        });
        describe('Last item', function () {
            List.testItemSwipe(lastItemName);
        });
    });
    it("should open source window when clicked", function() {
        Lib.sourceClick(prefix);
    });
});