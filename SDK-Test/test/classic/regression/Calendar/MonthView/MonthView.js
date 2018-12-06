describe("Calendar 6.2 - Month view", function() {
    beforeAll(function () {
        ST.options.eventDelay = 250;
    });

    describe("General", function () {
        Lib.panelRendered('Ext JS Calendar');
    });

    describe("Month tab", function () {
        beforeEach(function () {
            ST.element('button[text=Month]')
                .click();
        });

        Lib.testTabButtons(" ", "Month");

        describe("next month pressed", function () {
            Lib.testTabButtons(" ", "'>'");
        });

        describe("previous month pressed", function () {
            Lib.testTabButtons(" ", "'<'");
        });

        describe("event", function () {
            //NOTE: please run these tests on big screen
            beforeAll(function () {
                Lib.createMonthlyEvent("Auto TEST", 0,0,1,0);
            });

            afterAll(function () {
                ST.element(">> .x-calendar-event")
                    .click().wait(50);
                ST.element("button[text=Delete]")
                    .click();
            });

            it("was created", function () {
                ST.element(">> .x-calendar-event")
                    .and(function (element) {
                        expect(element).not.toMatch("undefined");
                    });
            });

            describe("with another events", function () {
                beforeAll(function () {
                    // Creating necessary events
                    Lib.createMonthlyEvent("Auto TEST2", 0,0,1,0);
                    Lib.createMonthlyEvent("Auto TEST3", 0,0,1,0);
                    Lib.createMonthlyEvent("Auto TEST4", 0,0,1,0);
                });

                afterAll(function () {
                    // Deleting of previously created necessary events
                    ST.element("calendar-event:nth-child(2)")
                        .click();
                    ST.element("button[text=Delete]")
                        .click();
                    ST.element("calendar-event:nth-child(2)")
                        .click();
                    ST.element("button[text=Delete]")
                        .click();
                    ST.element("calendar-event:nth-child(2)")
                        .click();
                    ST.element("button[text=Delete]")
                        .click();
                });

                it("is visible", function () {
                    //@TODO find way how to locate events that might be collapsed in +x more
                    expect(Ext.ComponentQuery.query("calendar-event[title=Auto TEST]")[0]
                        || Ext.ComponentQuery.query("calendar-event[title=Auto TEST2]")[0])
                        .not.toBe(undefined);
                });

                it("within hidden list is visible", function () {

                    var list_index = "";
                    ST.element(">> .x-calendar-event")
                        .and(function () {
                            var x = document.getElementsByClassName('x-calendar-weeks-overflow');
                            for (var i = 0; i < x.length; i++) {
                                if (x[i].childNodes.length >= 1) {
                                    list_index = i + 1;
                                    break;
                                }
                            }
                            ST.element("calendar-monthview => .x-calendar-weeks-cell:nth-child(" + list_index + ")")
                                .down('>> .x-calendar-weeks-cell-inner')
                                .down('>> .x-calendar-weeks-overflow')
                                .click()
                                .and(function () {
                                    expect(document.getElementsByClassName("x-calendar-weeks-overflow-popup")[0].style.display)
                                        .toBe("");
                                });
                            ST.element("button[text=Month]")
                                .click();
                        });
                });
            });
        });
    });
});