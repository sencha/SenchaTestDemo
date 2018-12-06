/**
 * @file BasicDataView.js
 * @date 25.8.2016
 *
 * Tested on: Chrome, Firefox, Opera, Android6 phone, Android6 tablet, iOS9 tablet, iOS9 phone, Edge phone.
 * Passed on: all tested, expect iOS9 phone - sometimes spec "is loaded properly" fails (for no reason)
 */
describe('Basic DataView example', function () {
    var itemNumber = 10;
    //var examplePrefix = "*[$className=KitchenSink.view.dataview.BasicDataView] ";

    var Cmp = {
        dataView: function () {
            return ST.dataView('*[xtype=dataview-basic] dataview');
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
        Lib.beforeAll("#dataview-basic", "dataview-basic dataview");
    });

    afterAll(function () {
        Lib.afterAll("dataview-basic");
    });
    
    it('screenshot should be same', function(){
        Lib.screenshot("modern_BasicDataView");
    });

    it('is loaded properly - ORION-1363', function () {
        ST.component('dataview-basic dataview')
            //sometimes it is not fully rendered
            .wait(function(){
                return Ext.first('dataview-basic dataview') && Ext.first('dataview-basic dataview').el.dom.clientHeight > 0;
            })
            .wait(function(){
                return Ext.first('dataview-basic dataview').dataItems[0] && Ext.first('dataview-basic dataview').dataItems[0].innerText.indexOf('John Battelle') >= 0;
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
            .itemAt(itemNumber)
            .reveal()
            .and(function () {
                ST.element('*[xtype=dataview-basic] => .x-scroller')
                    .and(function (scroller) {
                        expect(scroller.dom.scrollTop).toBeGreaterThan(0);
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
                    .itemAt(itemNumber2)
                    .reveal()
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

            });
        });
    });

    describe('Source code', function () {
        it('should open, check and close', function () {
            Lib.sourceClick('BasicDataView');
        });
    });
});
