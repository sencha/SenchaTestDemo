/**
 * @file listAccordionSwiperUndoable.js
 * @name Lists/List Undoable Accordion Swiper
 * @created 2017/06/07
 * Tested on browsers : Chrome, FF, IE11, Edge, Safari 10
 * Tested on Tablets : Android 6, iOS10
 * Tested on Phones : Android 6, iOS9
 *
 * Passed on : All tested devices
 */
describe("Undoable List Accordion Swiper", function () {
    var urlHash = '#undoable-accordion-swiper';
    var prefix = 'undoable-accordion-swiper ';

    var rightBtnWidthByTheme = {
        Material: 48,
        Triton: 48,
        iOS: 48,
        Neptune: 48
    };


    var rightBtnWidth;

    beforeAll(function () {
        Lib.beforeAll(urlHash, prefix);
        Lib.cloneStore(prefix);
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
        getListAccordionItem: function (index) {
            return ST.component('listswiperaccordion{ownerCmp.$datasetIndex==' + index + '}');
        },
        getListAccordionItemButton: function (index, commitFn) {
            return ST.button('listswiperaccordion{ownerCmp.$datasetIndex==' + index + '} button[commit=' + commitFn + ']');
        },
        getUndoButton: function (index, ui) {
            ui = ui ? '[ui~=' + ui + ']' : '';
            return ST.button('listswiperaccordion{ownerCmp.$datasetIndex==' + index + '} button[text=Undo]' + ui);
        },
        swipeItemLeftToLimit: function (dragLimit, name) {
            Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                .and(function (listitem) {
                    var deltaX = List.getDeltaX(listitem, dragLimit);
                    Lib.Lists.dragLeftBy(listitem, deltaX);
                });
        },
        dismissListSwiperAccordion: function (index) {
            return List.getListAccordionItem(index)
                .and(function (listitem) {
                    listitem.dismiss();
                }).hidden();
        },
        dragAndCheckMsgBoxVisible: function (name, dragLimit, msgTitle) {
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
        checkAlertBox: function (msgTitle, name) {
            describe('Alert box', function () {
                it('has title "' + msgTitle + '"', function () {
                    List.getMsgBoxByTitle(msgTitle)
                        .visible()
                        .and(function (msgBox) {
                            expect(msgBox.getTitle()).toBe(msgTitle);
                            msgBox.hide();
                        })
                        .hidden();
                });
                it('contains name of dragged list item ' + name, function () {
                    List.getMsgBoxByTitle(msgTitle)
                        .visible()
                        .and(function (msgBox) {
                            var text = msgBox._message.el.dom.innerText;
                            expect(text).toContain(name);
                            msgBox.hide();
                        })
                        .hidden();
                });
                it('should close when clicked OK', function () {
                    List.getMsgBoxByTitle(msgTitle).down('button[text=OK]')
                        .visible()
                        .click()
                        .hidden();
                });
            });
        },
        testItemSwipe: function (name) {
            describe('Item swiping', function () {
                var itemIndex;
                beforeAll(function () {
                    itemIndex = Lib.Lists.getIndexByText(prefix, List.filterFn(name));
                    Lib.Lists.getListItemByIndex(itemIndex, prefix)
                        .visible();
                    rightBtnWidth = rightBtnWidthByTheme[Ext.theme.name];
                });
                describe('Swipe to left', function () {
                    var btnWidth,
                        swipeRange;

                    beforeAll(function () {
                        // I need to extract item button width and commit threshold
                        // Width is used as threshold for opening swiper
                        Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                            .and(function (listitem) {
                                Lib.Lists.dragLeftBy(listitem, rightBtnWidth);
                            }).wait(300); // waitForAnimations is failing on phones during consecutive runs

                        List.getListAccordionItemButton(itemIndex, 'onMessage')
                            .and(function (btn) {
                                btnWidth = btn.el.getWidth();
                            });
                        List.getListAccordionItem(itemIndex)
                            .and(function (accordionSwiper) {
                                swipeRange = accordionSwiper.getSwipeRange();
                            });
                        List.dismissListSwiperAccordion(itemIndex);
                    });
                    afterEach(function () {
                        if (Ext.first('listswiperaccordion{ownerCmp.$datasetIndex==' + itemIndex + '}')) {
                            List.dismissListSwiperAccordion(itemIndex);
                        }
                    });
                    it('should not show list action items when dragged bellow button width', function () {
                        Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                            .and(function (listitem) {
                                // need to divide by 2 because whole item
                                // is moving, resulting in incorrect behaviour
                                Lib.Lists.dragLeftBy(listitem, (btnWidth - 1) / 2);
                                var listswiperstepper = Ext.first('listswiperaccordion');
                                expect(listswiperstepper).toBeNull();
                            });
                    });
                    it('should show list action items when dragged above button width - EXTJS-25833', function () {
                        Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                            .and(function (listitem) {
                                Lib.Lists.dragLeftBy(listitem, btnWidth + 2 / 2);
                                List.getListAccordionItem(itemIndex)
                                    .visible()
                                    .and(function (listAccordionItem) {
                                        expect(listAccordionItem.isVisible()).toBe(true);
                                    });
                                List.getListAccordionItemButton(itemIndex, 'onMessage').visible()
                                    .click();
                                List.getMsgBoxByTitle('Send To')
                                    .and(function (msgBox) {
                                        msgBox.hide();
                                    }).hidden();
                            });
                    });
                    it('should trigger last action item when dragged to the end', function () {
                        Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                            .and(function (listitem) {
                                Lib.Lists.dragLeftBy(listitem, swipeRange);
                                List.getUndoButton(itemIndex).visible()
                                    .click();
                                List.getListAccordionItem(itemIndex)
                                    .hidden()
                                    .and(function (listitem) {
                                        expect(listitem.isVisible()).toBe(false);
                                    });
                            });
                    });
                    describe('Message item', function () {
                        var msgTitle = 'Send To';
                        beforeEach(function () {
                            Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                .and(function (listitem) {
                                    Lib.Lists.dragLeftBy(listitem, btnWidth);
                                });
                            List.getListAccordionItemButton(itemIndex, 'onMessage')
                                .click();
                        });
                        afterEach(function () {
                            if (Ext.first('messagebox[title=Send To]')) {
                                List.getMsgBoxByTitle(msgTitle)
                                    .and(function (msgBox) {
                                        msgBox.hide();
                                    }).hidden();
                            }
                        });
                        describe('Message box', function () {
                            beforeEach(function () {
                                List.getMsgBoxByTitle(msgTitle).visible();
                            });
                            it('has title Send To', function () {
                                List.getMsgBoxByTitle(msgTitle)
                                    .visible()
                                    .and(function (msgBox) {
                                        expect(msgBox.getTitle()).toBe('Send To');
                                        msgBox.hide();
                                    }).hidden();
                            });
                            it('contains name of dragged list item ' + name, function () {
                                List.getMsgBoxByTitle(msgTitle)
                                    .visible()
                                    .and(function (msgBox) {
                                        var text = msgBox._message.el.dom.innerText;
                                        expect(text).toContain(name);
                                        msgBox.hide();
                                    })
                                    .hidden();
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
                    describe('Call item', function () {
                        var msgTitle = 'Call';
                        var controller;
                        beforeEach(function () {
                            Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                .and(function (listitem) {
                                    Lib.Lists.dragLeftBy(listitem, btnWidth);
                                });
                            List.getListAccordionItemButton(itemIndex, 'onCall')
                                .click();
                            List.list().and(function (list) {
                                controller = list.getController();
                                spyOn(controller, 'onCall').and.callThrough();
                            });
                        });
                        afterEach(function () {
                            if (Ext.first('messagebox[text=Call]')) {
                                List.getMsgBoxByTitle(msgTitle)
                                    .and(function (msgBox) {
                                        msgBox.hide();
                                    }).hidden();
                            }
                        });
                        it('should not commit action after clicking on button - Undo button is visible', function () {
                            List.getUndoButton(itemIndex)
                                .visible()
                                .and(function (btn) {
                                    expect(btn.isVisible()).toBe(true);
                                })
                                .click()
                                .hidden();
                        });
                        it('should revert action after clicking on Undo button', function () {
                            List.getUndoButton(itemIndex)
                                .visible()
                                .and(function (btn) {
                                    expect(btn.isVisible()).toBe(true);
                                })
                                .click()
                                .hidden()
                                .and(function () {
                                    expect(controller.onCall).not.toHaveBeenCalled();
                                });

                        });
                        describe('Call messagebox', function () {
                            beforeEach(function () {
                                List.getListAccordionItem(itemIndex)
                                    .click()
                                    .hidden();
                                List.getMsgBoxByTitle(msgTitle).visible();
                            });
                            List.checkAlertBox(msgTitle, name);
                        });
                    });
                    describe('Remove item', function () {
                        var controller;

                        beforeEach(function () {
                            List.list().and(function (list) {
                                controller = list.getController();
                                spyOn(controller, 'onDeleteItem').and.callThrough();
                                spyOn(controller, 'onCommitDeleteItem').and.callThrough();
                                spyOn(controller, 'onUndoDeleteItem').and.callThrough();
                            });
                        });
                        describe('UNDO', function () {
                            beforeEach(function () {
                                Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                    .and(function (listitem) {
                                        Lib.Lists.dragLeftBy(listitem, swipeRange);
                                    });
                            });
                            var undoUi = 'decline';
                            it('Undo button is visible', function () {
                                List.getUndoButton(itemIndex, undoUi)
                                    .visible()
                                    .and(function (btn) {
                                        expect(btn.isVisible()).toBe(true);
                                    })
                                    .click()
                                    .hidden();
                            });
                            it('should not commit until confirmed', function () {
                                List.getUndoButton(itemIndex, undoUi)
                                    .visible()
                                    .and(function () {
                                        expect(controller.onCommitDeleteItem).not.toHaveBeenCalled();
                                    })
                                    .click()
                                    .hidden();
                            });
                            it('should pre-commit', function () {
                                List.getUndoButton(itemIndex, undoUi)
                                    .visible()
                                    .and(function () {
                                        expect(controller.onDeleteItem).toHaveBeenCalled();
                                    })
                                    .click()
                                    .hidden();
                            });
                            describe('revert', function () {
                                it('should revert action when clicked on Undo button', function () {
                                    List.getUndoButton(itemIndex, undoUi)
                                        .visible()
                                        .click()
                                        .hidden()
                                        .and(function () {
                                            expect(controller.onUndoDeleteItem).toHaveBeenCalled();
                                        });
                                });

                            });


                        });
                        describe('confirm remove', function () {
                            var item, itemName;
                            beforeAll(function () {
                                Lib.Lists.getListItemByText(prefix, List.filterFn(name))
                                    .and(function (listitem) {
                                        Lib.Lists.dragLeftBy(listitem, swipeRange);
                                    });
                                List.getListAccordionItem(itemIndex)
                                    .click()
                                    .hidden();
                                List.list()
                                    .wait(function (list) {
                                        item = list.getStore().getAt(0);
                                        itemName = item.get('firstName') + ' ' + item.get('lastName');
                                        return itemName != name;
                                    });
                            });

                            it('item is removed', function () {
                                List.list()
                                    .and(function () {
                                        expect(itemName).not.toBe(name);
                                    })
                            });
                        });
                    });
                });
            });
        }
    };
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
        it('list has more than 20 records initially visible', function () {
            List.list().visible()
                .and(function (list) {
                    // there is various item count based on device size it is usually 28+
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
            Lib.Lists.getListItemByText(prefix, List.filterFn(lastItemName))
                .visible();
        });

        describe('Last item', function () {
            List.testItemSwipe(lastItemName);
        });
    });
    it("should open source window when clicked", function () {
        Lib.sourceClick(prefix);
    });
});