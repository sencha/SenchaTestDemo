/**
 * @file InlineDataView.js
 * @date 25.8.2016 - last update: 11.10.2016 (Chrome, firefox, Edge phone)
 *
 * Tested on: Chrome, Firefox, Opera, Android6 phone, Android6 tablet, iOS9 tablet, iOS9 phone, Edge phone.
 * Passed on: all tested
 */
describe('Inline DataView example', function () {
    var itemNumber = 19;
    // var expectedName = "Adam is an entrepreneur with experience in a broad range of industry sectors.  " +
    //     "He’s been involved in early stages with companies in software, product design, video games, genetics research, " +
    //     "and online sales.  The common thread through all of these is that his role has always been helping talented and " +
    //     "creative people achieve extraordinary results.  Currently, he’s the President of Syyn Labs, a collection of " +
    //     "extraordinarily talented technology artists all formerly trained in a wide variety of disciplines including " +
    //     "robotics, physics, software engineering, and design.  Leading this team, Adam orchestrated the build of the " +
    //     "massive Rube Goldberg machine for the OK Go music video “This Too Shall Pass”, and the “organ” built from 24 " +
    //     "automobiles played by Gary Numan in an online commercial for DieHard Battery.";

    //var examplePrefix = "dataview[xtype=dataview][_cls^=dataview-inline] ";
    var contentHeight, clientHeight, expectedName;

    var Cmp = {
        dataView: function (scrollEl) {
            if(scrollEl){
                return ST.element('dataview[xtype=dataview] => .x-dataview-inner');
            }
            return ST.dataView('dataview[xtype=dataview][_cls^=dataview-inline]');
        },
        dvItem: function () {
            return ST.element('dataview[xtype=dataview][_cls^=dataview-inline] => div.x-dataview-item');
        },
        tooltip: function () {
            return Ext.first('tooltip{isVisible()}');
        },
        clickOnImgItem: function (itemAt) {
                Cmp.dataView()
                    .itemAt(itemAt)
                    .reveal();

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
        Lib.beforeAll("#dataview-inline", "dataview-inline");
        //should wait for dataview item to be visible before proceeding - this should avoid random failures caused by ORION-1363 - viewOnReady doesn't work
        Cmp.dvItem().visible();
        Cmp.dataView()
            .and(function (item) {
                expectedName = item.el.dom.innerText;
                clientHeight = item.el.dom.clientHeight;
            });
    });

    afterAll(function () {
        Lib.afterAll("dataview-inline");
    });

    it('screenshot should be same', function(){
        Lib.screenshot("modern_BasicDataView");
    });

    it('is loaded properly', function () {
        Cmp.dataView()
            .visible();
        Cmp.dataView()
            .itemAt(0)
            .and(function (item) {
                // item has 1 child - div.img
                expect(item.el.dom.childNodes.length).toBe(1);
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
                    expect(Cmp.tooltip()).toBeTruthy();
                });
        });

        describe('Tooltip', function () {
            afterEach(function () {
                if(contentHeight > 1.25 * clientHeight){
                    Cmp.dataView()
                        .itemAt(0)
                        .reveal();
                }
            });

            it('has correct name in text', function () {
                var expectedName = 'Syyn Labs';
                if (!Cmp.tooltip()||(Cmp.tooltip()&&!Cmp.tooltip().isVisible())) {
                    Cmp.clickOnImgItem(itemNumber);
                }
                Cmp.dataView()
                    .wait(function () {
                        return Cmp.tooltip();
                    })
                    .wait(function () {
                        return Cmp.tooltip().el.dom.innerText.length > 2;
                    })
                    .and(function(){
                        expect(Cmp.tooltip().el.dom.innerText).toContain(expectedName);
                    });
            });

            it('has correct name in text after next display content', function () {
                var expectedName2 = 'SimpleGeo';
                //click on item + 2 record in dataView
                var itemNumber2 = itemNumber + 2;
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
            Lib.sourceClick('InlineDataView');
        });
    });
});

