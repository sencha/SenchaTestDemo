/**
 * @file PullRefresh.js
 * @name Lists/Pull refresh list
 * @created 2017/07/04
 * Tested on browsers : Chrome, FF, IE11, Edge
 * Tested on Tablets : Android 6, iOS9, iOS10
 * Tested on Phones : Android 6, iOS9, iOS10
 *
 * Passed on : All tested devices
 */
describe("List Swiper Undoable", function () {
    var urlHash = '#pullrefresh-list';
    var prefix = 'pullrefresh-list ';

    var List = {
        list: function () {
            return ST.component(prefix);
        },
        checkFirstNotSame: function (firstItem) {
            List.list()
                .and(function (list) {
                    var item = list.getStore().first();
                    expect(item).not.toBe(firstItem);
                });
        },
        checkLastNotSame: function (lastItem) {
            List.list()
                .and(function (list) {
                    var item = list.getStore().last();
                    expect(item).not.toBe(lastItem);
                });
        },
        checkCounterIncreased: function (refreshCounter) {
            List.list()
                .and(function (list) {
                    expect(refreshCounter + 1).toBe(list.refreshCounter);
                });
        }
    };

    beforeAll(function () {
        Lib.beforeAll(urlHash, prefix)
            .wait(function (list) {
                // this ensures that list is initially loaded
                return list.refreshCounter === 1;
            });
    });

    afterAll(function () {
        Lib.afterAll(prefix);
    });

    it('example loads correctly', function () {
        List.list()
            .visible()
            .and(function (list) {
                expect(list.isVisible()).toBe(true);
            });
    });
    describe('pull to refresh store', function () {
        var firstItem, lastItem, refreshCounter;
        afterEach(function () {
            Lib.waitOnAnimations();
        });
        describe('drag bellow limit', function () {
            beforeEach(function () {
                List.list()
                    .and(function (list) {
                        refreshCounter = list.refreshCounter;
                        var store = list.getStore();
                        firstItem = store.first();
                        lastItem = store.last();
                    });
                Lib.Lists.getListItemByIndex(0, prefix)
                    .and(function (li) {
                        Lib.DnD.dragBy(li, 0, 30, null, null, true);
                    })
                    .wait(500);
            });
            it('refresh counter should remain same', function () {
                List.list()
                    .and(function (list) {
                        expect(refreshCounter).toBe(list.refreshCounter);
                    });
            });
            it('first item should remain unchanged', function () {
                List.list()
                    .and(function (list) {
                        var item = list.getStore().first();
                        expect(item).toBe(firstItem);
                    });
            });
            it('last item should remain unchanged', function () {
                List.list()
                    .and(function (list) {
                        var item = list.getStore().last();
                        expect(item).toBe(lastItem);
                    });
            });


        });
        describe('drag above the limit', function () {
            describe('drag few pixels above the limit', function () {
                var liToDrag;
                beforeAll(function () {
                    List.list()
                        .and(function (list) {
                            refreshCounter = list.refreshCounter;
                            var store = list.getStore();
                            firstItem = store.first();
                            lastItem = store.last();
                        });
                    Lib.Lists.getListItemByIndex(0, prefix)
                        .and(function (li) {
                            liToDrag = li;
                            Lib.DnD.dragBy(liToDrag, 0, 100, null, null, true);
                        });
                    List.list()
                        .wait(function (list) {
                            // wait for refresh to complete
                            return refreshCounter + 1 === list.refreshCounter;
                        })
                });
                it('refresh counter should increase', function () {
                    List.checkCounterIncreased(refreshCounter);
                });
                it('first item should be updated', function () {
                    List.checkFirstNotSame(firstItem);
                });
                it('last item should be updated', function () {
                    List.checkLastNotSame(lastItem);
                });
            });
            describe('drag to the bottom of the list', function () {
                beforeAll(function () {
                    var listHeight;
                    List.list()
                        .and(function (list,done) {
                            refreshCounter = list.refreshCounter;
                            var store = list.getStore();
                            firstItem = store.first();
                            lastItem = store.last();
                            listHeight = list.getHeight() || list.el.getHeight(); // due to auto-heighted elements on phones
                            list.scrollToRecord(firstItem).then(done);
                        });
                    Lib.Lists.getListItemByIndex(0, prefix)
                        .visible()
                        .and(function (li) {
                            Lib.DnD.dragBy(li, 0, listHeight, null, null, true);
                        });
                    List.list()
                        .wait(function (list) {
                            return refreshCounter + 1 === list.refreshCounter;
                        });
                });
                it('refresh counter should increase', function () {
                    List.checkCounterIncreased(refreshCounter);
                });
                it('first item should be updated', function () {
                    List.checkFirstNotSame(firstItem);
                });
                it('last item should be updated', function () {
                    List.checkLastNotSame(lastItem);
                });
            });
        });
        describe('is prevented', function () {
            beforeAll(function (done) {
                List.list()
                    .and(function (list) {
                        refreshCounter = list.refreshCounter;
                        var store = list.getStore();
                        firstItem = store.first();
                        lastItem = store.last();
                        //scroll to record 20 before test
                        list.scrollToRecord(20).then(done);
                    });
                Lib.Lists.getListItemByIndex(20, prefix)
                    .and(function (li) {
                        Lib.DnD.dragBy(li, 0, 100, null, null, true);
                    })
                    .wait(500);
            });
            describe('when not at the top of the list', function () {
                it('refresh counter should remain same', function () {
                    List.list()
                        .and(function (list) {
                            expect(refreshCounter).toBe(list.refreshCounter);
                        });
                });
                it('first item should remain unchanged', function () {
                    List.list()
                        .and(function (list) {
                            var item = list.getStore().first();
                            expect(item).toBe(firstItem);
                        });
                });
                it('last item should remain unchanged', function () {
                    List.list()
                        .and(function (list) {
                            var item = list.getStore().last();
                            expect(item).toBe(lastItem);
                        });
                });
            });
        });

    });

});