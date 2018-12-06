/**
 * @file Sliders.js
 * @name Components/Forms/Sliders
 * @created 2016/09/08
 *
 * @updated: 15. 5. 2017
 * Tested on:
 *      desktop: Chrome 58, IE 11, Edge 14
 *      tablets: Android 5 and iOS 10
 *      phones: Android 6 and iOS 9
 */
describe("Sliders", function() {
    var prefix = '#kitchensink-view-forms-sliders ';
    var IDs;
    var Sliders = {
        mySlider : function(id) {
            return ST.component(prefix + 'slider[id=' + id + ']');
        },
        myThumb : function (id) {
            return ST.component("thumb[id=" + id + "]");
        }
    };
    beforeAll(function() {
        Lib.beforeAll("#form-sliders", prefix);
        ST.wait(function(){
                return Ext.ComponentQuery.query(prefix + 'slider').length >= 0;
            })
            .and(function(){
                IDs = Ext.ComponentQuery.query(prefix + 'slider');
            });
    });
    afterAll(function(){
        Lib.afterAll(prefix);
    });

    describe("Single slider", function(){
        describe("Clicking all over the slider", function(){
            it("Should click at the value 0", function(){
                var value = 0;
                Sliders.mySlider(IDs[0].id)
                    .and(function(slider){
                        value = slider.getValue();
                    })
                    .click(0, IDs[0].el.getHeight() / 2)
                    //wait for preventing random bugs (JZ)
                    .wait(function(slider){
                        return (slider.getValue() < 2);
                    })
                    .and(function(slider){
                        expect(slider.getValue()).toBeLessThan(2);
                        expect(slider.getValue()).not.toBe(value);
                    });
            });

            it("Should click at the value 25", function(){
                var value = 0;
                Sliders.mySlider(IDs[0].id)
                    .and(function(slider){
                        value = slider.getValue();
                    })
                    .click(IDs[0].el.getWidth() * 0.25, IDs[0].el.getHeight() / 2)
                    .and(function(slider){
                        expect(slider.getValue()).toBeLessThan(26);
                    });
            });

            it("Should click at the value 50", function(){
                var value = 0;
                Sliders.mySlider(IDs[0].id)
                    .and(function(slider){
                        value = slider.getValue();
                    })
                    .click()
                    .and(function(slider){
                        expect(slider.getValue()).toBe(50);
                        expect(slider.getValue()).not.toBe(value);
                    });
            });
        });

        describe("Draging slider all over the place", function(){
            it("Should drag slider to 100", function(){
                var thumbID = IDs[0].getThumbs()[0].id;

                Sliders.myThumb(thumbID)
                    .and(function(thumb){
                        Lib.DnD.dragBy(thumb, IDs[0].el.getWidth(), 0);
                    });

                Sliders.mySlider(IDs[0].id)
                    .and(function(slider){
                        expect(slider.getValue()).toBe(100);
                    });
            });

            it("Should drag the slider to 0", function(){
                var thumbID = IDs[0].getThumbs()[0].id;

                Sliders.myThumb(thumbID)
                    .and(function(thumb){
                        Lib.DnD.dragBy(thumb, -IDs[0].el.getWidth(), 0);
                    });

                Sliders.mySlider(IDs[0].id)
                    .and(function(slider){
                        expect(slider.getValue()).toBe(0);
                    });
            });
        });
    });

    describe("Disabled slider", function(){
        it("Should click second slider and make sure it's disabled.", function(){
            var value = 0;

            Sliders.mySlider(IDs[1].id)
                .and(function(slider){
                    value = slider.getValue();
                })
                .click()
                .and(function(slider){
                    //check that value didn't change
                    expect(slider.getValue()).toBe(value);
                    expect(slider.getDisabled()).toBe(true);
                });
        });

        it("Should be disabled to drag", function(){
            var value = 0;
            var thumbID = IDs[1].getThumbs()[0].id;

            Sliders.mySlider(IDs[1].id)
                .and(function(slider){
                    value = slider.getValue();
                });

            Sliders.myThumb(thumbID)
                .and(function(thumb){
                    Lib.DnD.dragBy(thumb, IDs[1].el.getWidth(), 0);
                });

            Sliders.mySlider(IDs[1].id)
                .and(function(slider){
                    //check that value didn't change
                    expect(slider.getValue()).toBe(value);
                });

        });
    });

    describe("Double slider", function(){
        it("EXTJS-22310 - Should not be able to drag first thumb over second", function(){
            var thumbID = IDs[2].getThumbs()[0].id;

            Sliders.mySlider(IDs[2].id)
                .and(function(slider){
                    expect(slider.getValue()[0]).toBeLessThan(slider.getValue()[1]);
                });

            Sliders.myThumb(thumbID)
                .and(function(thumb){
                    Lib.DnD.dragBy(thumb, IDs[2].el.getWidth(), 0);
                });

            Sliders.mySlider(IDs[2].id)
                .and(function(slider){
                    //Bug: EXTJS-22310
                    expect(slider.getValue()[0]).toBeLessThan(slider.getValue()[1]);
                });
        });
    });

    describe("Toggle slider", function(){
        it("Should toggle by click", function(){
            var value = 50;

            Sliders.mySlider(IDs[3].id)
                .and(function(slider){
                    value = slider.getValue();
                })
                .click();
            Lib.waitOnAnimations();
            Sliders.mySlider(IDs[3].id)
                .and(function(slider){
                    expect(slider.getValue()).toBe(0);
                    expect(slider.getValue()).not.toBe(value);
                }).click();
            Lib.waitOnAnimations();
            Sliders.mySlider(IDs[3].id)
                .and(function(slider){
                    expect(slider.getValue()).toBe(1);
                    expect(slider.getValue()).toBe(value);
                });
        });

        it("Should toggle by dragging", function(){
            var value = 50;
            var thumbID = IDs[3].getThumbs()[0].id;

            Sliders.mySlider(IDs[3].id)
                .and(function(slider){
                    value = slider.getValue();
                });

            Sliders.myThumb(thumbID)
                .and(function(thumb){
                    Lib.DnD.dragBy(thumb, -100, 0);
                });

            Sliders.mySlider(IDs[3].id)
                .and(function(slider){
                    expect(slider.getValue()).toBe(0);
                    expect(slider.getValue()).not.toBe(value);
                });

            Sliders.myThumb(thumbID)
                .and(function(thumb){
                    Lib.DnD.dragBy(thumb, 100, 0);
                });

            Sliders.mySlider(IDs[3].id)
                .and(function(slider){
                    expect(slider.getValue()).toBe(1);
                    expect(slider.getValue()).toBe(value);
                });
        });
    });

    describe("Source window test", function(){
        it("Should open, check and close", function () {
            Lib.sourceClick("Demonstrates a tabbed form panel.");
        });
    });
});