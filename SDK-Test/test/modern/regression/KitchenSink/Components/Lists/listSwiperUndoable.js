/**
 * @file listSwiperUndoable.js
 * @name Lists/List Swiper Undoable
 * @created 2017/04/25
 * Tested on browsers : Chrome, FF, IE11, Edge
 * Tested on Tablets : Android 6
 * Tested on Phones : Android 6
 *
 * Passed on : All tested devices
 */
describe("List Swiper Undoable", function () {
    var urlHash = '#undoable-step-swiper';
    var prefix = 'undoable-step-swiper ';
    var initialStoreData = [];
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
        undoButton: function (index) {
            return ST.button('listswiperstepper{ownerCmp.$datasetIndex==' + index + '} button');
        },
        undoItem: function (index) {
            return ST.component('listswiperstepper{ownerCmp.$datasetIndex==' + index + '}');
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
        dragLeftAndCheckMsgBox : function (msgTitle,name,dragLimit) {
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
        dragUndoItemLeftAndCheckMsgBox : function (msgTitle,name,dragLimit,itemIndex) {
            Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                .and(function (listitem) {
                    var deltaX = List.getDeltaX(listitem, dragLimit);
                    Lib.Lists.dragLeftBy(listitem, deltaX);
                    List.undoItem(itemIndex)
                        .click()
                        .hidden();
                    List.getMsgBoxByTitle(msgTitle)
                        .visible()
                        .and(function (msgBox) {
                            expect(msgBox.isVisible()).toBe(true);
                        });
                });
        },
        clickUndoBtn : function (itemIndex) {
            return List.undoButton(itemIndex)
                .click()
                .hidden();
        },
        testItemSwipe: function (name) {
            describe('Item swiping', function () {
                var itemIndex;
                beforeAll(function () {
                    itemIndex = Lib.Lists.getIndexByText(prefix, List.filterFn(name));
                });
                describe('Swipe to left', function () {
                    describe('Message action', function () {
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
                                List.dragLeftAndCheckMsgBox(msgTitle,name,dragLimit);
                            });
                            it('should trigger action when dragged to 50% of item width', function () {
                                var dragLimit = 50;
                                List.dragLeftAndCheckMsgBox(msgTitle,name,dragLimit);
                            });
                        });
                    });
                    describe('Call action', function () {
                        var msgTitle = 'Call';
                        afterEach(function () {
                            if (Ext.first('messagebox[title=Call]')) {
                                Ext.first('messagebox[title=Call]').hide();
                            }
                        });
                        describe('swipe item', function () {
                            // % of list item width
                            var dragLimit = 51;
                            beforeEach(function () {
                                List.swipeItemLeftToLimit(dragLimit,name);
                            });
                            afterEach(function () {
                                // If item is in undoable state click Undo
                                if (Ext.first('listswiperstepper{ownerCmp.$datasetIndex==' + itemIndex + '} button')) {
                                    List.clickUndoBtn(itemIndex);
                                }

                            });
                            describe('UNDO', function () {
                                var controller;
                                beforeEach(function () {
                                    List.list().and(function (list) {
                                        controller = list.getController();
                                        spyOn(controller, 'onCall').and.callThrough();
                                    });
                                });
                                it('should undo action when clicked on UNDO button', function () {
                                    List.clickUndoBtn(itemIndex)
                                        .and(function () {
                                            expect(controller.onCall).not.toHaveBeenCalled();
                                        });
                                });

                            });
                            describe('Commit action', function () {
                                var controller;
                                beforeEach(function () {
                                    List.list().and(function (list) {
                                        controller = list.getController();
                                        spyOn(controller, 'onCall').and.callThrough();
                                    });
                                });
                                it('should commit action when clicked on item', function () {
                                    List.undoItem(itemIndex)
                                        .click()
                                        .hidden()
                                        .and(function () {
                                            expect(controller.onCall).toHaveBeenCalled();
                                        });
                                });
                                it('should commit action when scrolled', function () {
                                    //scroll to itemIndex that is out of view
                                    var li = List.undoItem(itemIndex);
                                    List.list()
                                        .visible()
                                        .and(function (list) {
                                            // get a record and scroll to it
                                            var rec = list.getStore().getAt(Math.abs(itemIndex - 15));
                                            list.scrollToRecord(rec);
                                        });
                                    li.hidden()
                                        .and(function () {
                                            expect(controller.onCall).toHaveBeenCalled();
                                        });
                                    List.getMsgBoxByTitle('Call')
                                        .and(function (msgBox) {
                                            msgBox.hide();
                                        })
                                        .hidden();
                                    //scroll back to top
                                    List.list()
                                        .and(function (list) {
                                            // get a record and scroll to it
                                            var rec = list.getStore().getAt(itemIndex);
                                            list.scrollToRecord(rec);
                                        });
                                    Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                        .visible();
                                });
                            });
                            describe('Alert box', function () {
                                beforeEach(function () {
                                    //click on undoitem to commit action
                                    List.undoItem(itemIndex)
                                        .visible()
                                        .click()
                                        .hidden();
                                });
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

                        });
                        describe('drag treshold', function () {
                            afterEach(function () {
                                // If item is in undoable state click Undo
                                if (Ext.first('listswiperstepper{ownerCmp.$datasetIndex==' + itemIndex + '} button')) {
                                    List.clickUndoBtn(itemIndex);
                                }
                            });
                            it('should trigger action when dragged to 60% of item width', function () {
                                var dragLimit = 60;
                                List.dragUndoItemLeftAndCheckMsgBox(msgTitle,name,dragLimit,itemIndex);
                            });
                            it('should trigger action when dragged to 75% of item width', function () {
                                var dragLimit = 75;
                                List.dragUndoItemLeftAndCheckMsgBox(msgTitle,name,dragLimit,itemIndex);
                            });
                        });
                    });
                    describe('Remove action', function () {
                        describe('swipe item', function () {
                            // % of list item width
                            var dragLimit = 76;
                            var controller;
                            afterEach(function () {
                                // If item is in undoable state click Undo
                                if (Ext.first('listswiperstepper{ownerCmp.$datasetIndex==' + itemIndex + '} button')) {
                                    List.clickUndoBtn(itemIndex);
                                }
                            });
                            describe('UNDO', function () {
                                beforeEach(function () {
                                    List.list().and(function (list) {
                                        controller = list.getController();
                                        // undo handler
                                        spyOn(controller, 'onUndoDeleteItem').and.callThrough();
                                        // pre-commit handler
                                        spyOn(controller, 'onDeleteItem').and.callThrough();
                                        // commit handler
                                        spyOn(controller, 'onCommitDeleteItem').and.callThrough();
                                    });
                                    Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                        .and(function (listitem) {
                                            var deltaX = List.getDeltaX(listitem, dragLimit);
                                            Lib.Lists.dragLeftBy(listitem, deltaX);
                                        });
                                });
                                it('should call pre-commit handler when dragged', function () {
                                    List.undoButton(itemIndex)
                                        .visible()
                                        .and(function () {
                                            expect(controller.onDeleteItem).toHaveBeenCalled();
                                            expect(controller.onCommitDeleteItem).not.toHaveBeenCalled();
                                            expect(controller.onUndoDeleteItem).not.toHaveBeenCalled();
                                        });
                                });
                                it('should call unUndoDelete handler when UNDO button clicked', function () {
                                    List.undoButton(itemIndex)
                                        .visible()
                                        .click()
                                        .and(function () {
                                            expect(controller.onDeleteItem).toHaveBeenCalled();
                                            expect(controller.onCommitDeleteItem).not.toHaveBeenCalled();
                                            expect(controller.onUndoDeleteItem).toHaveBeenCalled();
                                        });
                                });

                            });
                            describe('Commit action', function () {
                                var listItem,
                                    itemFuture;
                                beforeAll(function () {
                                    Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                        .and(function (listitem) {
                                            listItem = listitem;
                                            var deltaX = List.getDeltaX(listitem, dragLimit);
                                            Lib.Lists.dragLeftBy(listitem, deltaX);
                                        });
                                    itemFuture = List.undoItem(itemIndex)
                                        .click()
                                        .hidden();
                                });
                                it('should commit action when clicked on item', function () {
                                    itemFuture.and(function (item) {
                                        expect(item.isDestroyed).toBe(true)
                                    });

                                });
                                it('should remove item when is action commited', function () {
                                    //scroll to itemIndex that is out of view
                                    ST.absent(listItem);
                                });
                            });
                        });
                    });
                });
            });
        }
    };
    beforeAll(function () {
        Lib.beforeAll(urlHash, prefix);
        Lib.cloneStore(prefix);
    });

    afterAll(function () {
        Lib.restoreStore(prefix)
            .and(function () {
                Lib.afterAll(prefix);
        });
    });

    describe('Example loads', function () {
        var firstName = 'Alana Scannell';
        beforeAll(function () {
            Lib.Lists.getListItemByIndex(0, prefix).visible();
        });
        it('list has more than 28 records initially visible', function () {
            List.list().visible()
                .and(function (list) {
                    // there is various item count based on device size it is usually 28+
                    expect(list.getItemCount()).toBeGreaterThan(28);
                });
        });
        it('first item is ' + firstName, function () {
            Lib.Lists.getListItemByIndex(0, prefix)
                .and(function (listitem) {
                    List.checkItemContent(listitem, firstName);
                });
        });
        it('screenshots are same', function () {
            Lib.screenshot("KS_Undoable_Step_Swiper");
        });

    });
    describe('first item', function () {
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
            Lib.Lists.getListItemByText(prefix, List.filterFn(lastItemName))
                .visible();
        });
        List.testItemSwipe(lastItemName);
    });
    it("should open source window when clicked", function() {
        Lib.sourceClick(prefix);
    });
});
