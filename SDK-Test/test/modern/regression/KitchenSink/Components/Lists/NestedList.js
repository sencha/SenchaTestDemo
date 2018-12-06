/**
 * @file Nested List.js
 * @name Nested List
 * @updated 2017/05/18
 * @created 2016/07/25
 *
 * @date 2017/07/19
 * tested on:
 *      desktop:
 *          Chrome 55, Edge 15, FF 54, IE 11, Opera 46
 *      tablet:
 *          Android 5, iOS 10
 *      phones:
 *          Android 7, iOS 9
 */
describe("Nested List", function() {
    /**
     *  Custom variables for applicaiton
     **/
    var examplePrefix = "nested-list";
    var exampleUrlPostfix = "#nested-list";

    var Comp = {

        list: function(num) {
            return Ext.ComponentQuery.query(examplePrefix + " list")[num];
        },
        titleBar: function() {
            return ST.component(examplePrefix + " titlebar");
        }
    };

    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, "#kitchensink-view-lists-nestedlist");
        ST.wait(function() {
            return ST.element(examplePrefix + " list").visible();
        });
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-lists-nestedlist");
    });

    /**
     *  Testing UI of the application
     **/
    it("should load correctly", function() {

        ST.element(examplePrefix + " list")
            .visible();
        Lib.screenshot("UI_nested_List");
    });

    it("should move forward and back in list", function () {
        ST.component(Comp.list(0)).visible().down("simplelistitem:first").click();
        Comp.titleBar().visible()
            .and(function (title) {
                expect(title._title).toBe("Cars");
                ST.component(Comp.list(1)).visible().down("simplelistitem").click()
                    .and(function () {
                        expect(title._title).toBe("Asia");
                    });
                ST.component(Comp.list(0)).visible().down("simplelistitem").click()
                    .and(function () {
                        expect(title._title).toBe("Japan");

                    });
                Comp.titleBar().down("button").click()
                    .wait(function (btn) {
                        return btn.getText() === 'Cars'
                    })
                    .and(function () {
                        expect(title._title).toBe("Asia");

                    });
                Comp.titleBar().down("button").click()
                    .wait(function (btn) {
                        return btn.getText() === 'Back'
                    })
                    .and(function () {
                        expect(title._title).toBe("Cars");
                        ST.button(examplePrefix + " button").click();
                    });
                Comp.titleBar()
                    .wait(function (titleCmp) {
                        return titleCmp._title === '';
                    })
                    .and(function () {
                        expect(title._title).toBe("");
                    });
            });
    });

    describe("Edit tests", function() {

        beforeAll(function() {
            ST.component(Comp.list(0)).down("simplelistitem").click()
                .and(function() {
                    ST.component(Comp.list(1)).down("simplelistitem[$datasetIndex=1]").click();
                });
        });

        beforeEach(function() {
            ST.component(Comp.list(0)).down("simplelistitem[$datasetIndex=2]").click();
            ST.component("dialog[title=Dialog]").visible();
            ST.wait(500);
        });

        it("Save changes - ORION-1482 - IE bug", function() {
            ST.element("textfield[label='Name'] => input")
                .click()
                .type(" Sagaris")
                .wait(function(el) {
                    return el.dom.value === "TVR Sagaris";
                });

            ST.component("dialog[title=Dialog]").visible()
                .and(function (dialog) {
                    ST.button("dialog[title=Dialog] button[_text=OK]").click();
                }).hidden()
                .and(function (dialog) {
                    expect(dialog.isHidden()).toBe(true);
                });
            ST.component(Comp.list(0)).down("simplelistitem[$datasetIndex=2]")
                .and(function (item) {
                    expect(item.dom.textContent).toBe("TVR Sagaris");

                });
        });


        it("Cancel changes", function () {
            ST.component(Comp.list(0)).down("simplelistitem[$datasetIndex=2]")
                .and(function () {
                    ST.element("textfield[label='Name'] => input").click()
                        .type("Lamborghini");
                    ST.button("dialog[title=Dialog] button[text=Cancel]")
                        .click();
                    ST.component("dialog[title=Dialog]")
                        .hidden()
                        .and(function (dialog) {
                            expect(dialog.isHidden()).toBe(true);
                        });
                    ST.component(Comp.list(0)).down("simplelistitem[$datasetIndex=2]")
                        .wait(function (item) {
                            return item.dom.textContent === 'TVR'
                        })
                        .and(function (item) {
                            expect(item.dom.textContent).toBe('TVR');
                        });
                });
        });

        it("Clear text field", function() {
            ST.component("textfield[label='Name']")
                .wait(function(tf){
                    return tf.el.dom.clientWidth > 0;
                })
                .and(function(tf){
                    if(tf.getValue().length === 0){
                        tf.setValue('TVR');
                    }
                });
            ST.component(">> div.x-cleartrigger").visible().click();
            ST.element("textfield[label='Name'] => input").click()
                .wait(function(el) {
                    return el.dom.value === "";
                });
            ST.button("dialog[title=Dialog] button[text=Cancel]").click();
            ST.component("dialog[title=Dialog]")
                .hidden()
                .and(function (dialog) {
                    expect(dialog.isHidden()).toBe(true);
                });
        });

        it("Editable", function() {
            ST.component(Comp.list(0)).down("simplelistitem[$datasetIndex=2]")
                .and(function(item) {
                    var value = item.dom.textContent;
                    ST.element("textfield[label='Name'] => input")
                        .click()
                        .type(" Turbo")
                        .and(function(el) {
                            expect(el.dom.value).toBe(value + " Turbo");
                        });
                    ST.button("dialog[title=Dialog] button[text=Cancel]").click();
                });
            ST.component("dialog[title=Dialog]")
                .hidden()
                .and(function (dialog) {
                    expect(dialog.isHidden()).toBe(true);
                });
        });

    });

    it("should open source window when clicked", function() {

        Lib.sourceClick("NestedList");
    });

});
