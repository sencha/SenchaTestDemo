/**
 * @file HorizontalDataView.js
 * @date 25.8.2016
 *
 * Tested on: Chrome, Firefox, Opera, Android6 phone, Android6 tablet, iOS9 tablet, iOS9 phone, Edge phone.
 * Passed on: all tested
 */
describe('Horizontal DataView example', function () {
    var itemNumber = 6;
    //var examplePrefix = "*[$className=KitchenSink.view.dataview.HorizontalDataView] ";

    var Cmp = {
        dataView: function () {
            return ST.dataView('*[xtype=dataview-horizontal] dataview');
        },
        tooltip: function () {
            return Ext.first('tooltip{isVisible()}');
        },
        clickOnImgItem: function (itemAt) {
            if (Lib.isDesktop) {
                Cmp.dataView()
                    .itemAt(itemAt)
                    .down('>> div.img')
                    .and(function (img) {
                        ST.play([
                            {type: "mouseover", target: img, delay: 1000}
                        ]);
                    });
            } else {
                Cmp.dataView()
                    .itemAt(itemAt)
                    .down('>> div.img')
                    .click();
            }
        }
    };

    beforeAll(function () {
        Lib.beforeAll("#dataview-horizontal", "dataview-horizontal dataview");
    });

    afterAll(function () {
        Lib.afterAll("dataview-horizontal");
    });


    it('screenshot should be same', function(){
        Lib.screenshot("modern_BasicDataView");
    });
    
    it('is loaded properly - ORION-1363', function () {
        ST.component('dataview-horizontal dataview')
        //sometimes it is not fully rendered
            .wait(function(){
                var dv = Ext.first('dataview-horizontal dataview');
                return dv && dv.el.dom.clientHeight > 0;
            })
            .wait(function(){
                var dv = Ext.first('dataview-horizontal dataview');
                return dv.dataItems[0] && dv.dataItems[0].innerText.indexOf('Battelle') >= 0;
            });

        Cmp.dataView()
            .itemAt(0)
            .and(function (item) {
                // item has 2 childNodes - div.img and div.content)
                expect(item.el.dom.childNodes.length).toBe(2);
            });
    });

    it('is scrollable', function () {
        Cmp.dataView()
            .and(function (dataview) {
                var x = (105 * itemNumber);                
                dataview.getScrollable().scrollBy(x, 0);
            })
            .itemAt(itemNumber)
            .and(function () {
                ST.element('*[xtype=dataview-horizontal] => .x-scroller')
                    .and(function (scroller) {
                        expect(scroller.dom.scrollLeft).toBeGreaterThan(0);
                    });
            });

    });

    describe('Item', function () {
        it('has tooltip after tap/hover', function () {
            Cmp.clickOnImgItem(itemNumber);
            Cmp.dataView()
                .wait(function () {
                    return Cmp.tooltip();
                })
                .and(function () {
                    expect(Cmp.tooltip().isVisible()).toBeTruthy();
                });
        });

        describe('Tooltip', function () {
            var expectedName;

            beforeEach(function () {
                Cmp.dataView()
                    .itemAt(itemNumber)
                    .and(function (item) {
                        expectedName = item.el.dom.innerText.split('\n')[0];
                    });
                if (!Cmp.tooltip()||(Cmp.tooltip()&&!Cmp.tooltip().isVisible())) {
                    Cmp.clickOnImgItem(itemNumber);
                }
                Cmp.dataView()
                    .wait(function () {
                        return Cmp.tooltip();
                    });
            });

            //TODO test for hiding
            afterEach(function(){
                ST.component('viewport').click(1,1);
            });

            it('has correct name in text', function () {
                expect(Cmp.tooltip().el.dom.innerText).toContain(expectedName);
            });

            it('has correct name in text after next display content', function () {
                var expectedName2;
                //click on item + 2 record in dataView
                var itemNumber2 = itemNumber + 2;
                Cmp.dataView()
                    .and(function (dataview) {
                        dataview.getScrollable().scrollBy(2 * 105, 0);
                    })
                    .itemAt(itemNumber2)
                    .and(function (item) {
                        expectedName2 = item.el.dom.innerText.split('\n')[0];
                    });

                Cmp.clickOnImgItem(itemNumber2);
                Cmp.dataView()
                    .wait(function () {
                        return Cmp.tooltip();
                    })
                    .and(function () {
                        expect(Cmp.tooltip().el.dom.innerText).toContain(expectedName2);
                    });

            })
        });
    });

    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('HorizontalDataView');
        });
    });
});
