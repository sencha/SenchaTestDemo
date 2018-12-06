/**
* @file Two Way Formulas.js
* @name Calendar/Drag&Resize Validation
* @created 2016/11/23
*/

describe("Calendar/Drag&Resize Validation", function() {
    /**
    * Custom variables for applicaiton
    **/
    var exampleUrlPostfix = "#calendar-validation";
    var examplePrefix = "calendar-validation[id=kitchensink-view-calendar-validation]";
    /**
    *
    **/
    // Constat for answering dialog for confirming change in event properties
    var Dialog = {
        YES    : "Yes",
        NO    : "No",
    };

    // Constant for determinating day (column) in the calendar
    var Column = {
        LEFT    : 0,
        RIGHT    : 1
    };
    /**
    *
    **/
    var Dash = {

        hourToIndex : function(hour) {
            return hour + 1 - 8;            
        },

        moveElementToHour : function(arg) {
            //drag & drop
            ST.element(arg.dragBy)
                .and(function(el) {
                    Lib.DnD.dragByToElement(el, arg.dragTo, 1, 1, 10, 1);
                })
                .and(function() {
                    if(arg.answer !== undefined) {
                        ST.component('toolbar button[_text="' + arg.answer + '"]')
                            .click()
                            .hidden();
                    }
                })
                .and(function() {
                    ST.element(Components.calendarGetEventStartTime(arg.eventName))
                        .and(function(el) {
                            expect(el.dom.innerText).toBe(arg.reqStartHour);
                        });
                    ST.element(Components.calendarGetEventEndTime(arg.eventName))
                        .and(function(el) {
                            expect(el.dom.innerText).toBe(arg.reqEndHour);
                        });
                });
        }
    };
    /**
    *
    **/
    beforeAll(function() {
        Lib.beforeAll(exampleUrlPostfix, examplePrefix, 500);
    });

    afterAll(function() {
        Lib.afterAll(examplePrefix);
    });
    /**
    *
    **/
    describe("Drag&Resize Validation example", function() {
        // Test disabled for phones/tablets due EXTJS-21304
        if (ST.os.deviceType === "Desktop" && !ST.browser.is('Edge') && !ST.browser.is('IE')) {
            it("Should check for timeline", function() {
                var d = new Date();
                if(8<d.getHours() && d.getHours()<18){
                    ST.element('//div[@class = "x-calendar-days-now-marker"]')
                        .visible()
                        .and(function(el) {
                            expect(el).toBeDefined();
                        });
                }else{
                    var el = Ext.query('.x-calendar-days-now-marker');
                    expect(el.length).toBe(0);
                }

            });
        }

        describe('Testing "Not draggable" event', function() {
            var eventToTest = "Not draggable";
            var defaultStart = "09:00";
            var defaultEnd = "10:00";
            var defaultHeight = 41;

            it('Should try to move "Not draggable" event', function() {
                Dash.moveElementToHour({
                    eventName     : eventToTest,
                    dragBy        : Components.calendarEventTitle(eventToTest),
                    dragTo        : Components.calendarHourIndex(Column.LEFT, Dash.hourToIndex(15)),
                    day            : Column.LEFT,
                    reqStartHour: defaultStart,
                    reqEndHour    : defaultEnd,
                    reqHeight     : defaultHeight
                });
            });

            it('Should expand "Not draggable" event', function() {
                ST.element(Components.calendarEventHandle(eventToTest))
                    .and(function(el){
                        el.dom.style.display = 'block';
                    })
                    .and(function() {
                        Dash.moveElementToHour({
                            eventName     : eventToTest,
                            dragBy        : Components.calendarEventHandle(eventToTest),
                            dragTo        : Components.calendarHourIndex(Column.LEFT, Dash.hourToIndex(12)),
                            day            : Column.LEFT,
                            answer        : Dialog.YES,
                            reqStartHour: defaultStart,
                            reqEndHour    : "12:00",
                            reqHeight     : 85
                        });
                    });
            });

            it('Should shrink "Not draggable" event', function() {
                ST.element(Components.calendarEventHandle(eventToTest))
                    .and(function(el){
                        el.dom.style.display = 'block';
                    })
                    .and(function() {
                        Dash.moveElementToHour({
                            eventName     : eventToTest,
                            dragBy        : Components.calendarEventHandle(eventToTest),
                            dragTo        : Components.calendarHourIndex(Column.LEFT, Dash.hourToIndex(11)),
                            day            : Column.LEFT,
                            answer        : Dialog.YES,
                            reqStartHour: defaultStart,
                            reqEndHour    : "11:00",
                            reqHeight     : 63
                        });
                    });
            });

            it('Should resize "Not draggable" event, deny it', function() {
                ST.element(Components.calendarEventHandle(eventToTest))
                    .and(function(el){
                        el.dom.style.display = 'block';
                    })
                    .and(function() {
                        Dash.moveElementToHour({
                            eventName     : eventToTest,
                            dragBy        : Components.calendarEventHandle(eventToTest),
                            dragTo        : Components.calendarHourIndex(Column.LEFT, Dash.hourToIndex(16)),
                            day            : Column.LEFT,
                            answer        : Dialog.NO,
                            reqStartHour: defaultStart,
                            reqEndHour    : "11:00",
                            reqHeight     : 63
                        });
                    });
            });
        });

        describe('Testing "Not draggable/resizable" event', function() {
            var eventToTest = "Not draggable/resizable";
            var defaultStart = "13:00";
            var defaultEnd = "14:00";
            var defaultHeight = 41;

            it('Should try to move "Not draggable/resizable" event', function() {
                Dash.moveElementToHour({
                    eventName     : eventToTest,
                    dragBy        : Components.calendarEventTitle(eventToTest),
                    dragTo        : Components.calendarHourIndex(Column.LEFT, Dash.hourToIndex(15)),
                    day            : Column.LEFT,
                    reqStartHour: defaultStart,
                    reqEndHour    : defaultEnd,
                    reqHeight     : defaultHeight
                });
            });

            it('Should try to resize "Not draggable/resizable" event', function() {
                ST.element(Components.calendarEventHandle(eventToTest))
                    .and(function(el){
                        el.dom.style.display = 'block';
                    })
                    .and(function() {
                        Dash.moveElementToHour({
                            eventName     : eventToTest,
                            dragBy        : Components.calendarEventHandle(eventToTest),
                            dragTo        : Components.calendarHourIndex(Column.LEFT, Dash.hourToIndex(16)),
                            day            : Column.LEFT,
                            reqStartHour: defaultStart,
                            reqEndHour    : defaultEnd,
                            reqHeight     : defaultHeight
                        });
                    });
            });
        });

        describe('Testing "Not resizable" event', function() {
            var eventToTest = "Not resizable";
            var defaultStart = "09:00";
            var defaultEnd = "10:00";
            var defaultHeight = 41;

            it('Should try to resize "Not resizable" event', function() {
                ST.element(Components.calendarEventHandle(eventToTest))
                    .and(function(el){
                        el.dom.style.display = 'block';
                    })
                    .and(function() {
                        Dash.moveElementToHour({
                            eventName     : eventToTest,
                            dragBy        : Components.calendarEventHandle(eventToTest),
                            dragTo        : Components.calendarHourIndex(Column.RIGHT, Dash.hourToIndex(16)),
                            day            : Column.RIGHT,
                            reqStartHour: defaultStart,
                            reqEndHour    : defaultEnd,
                            reqHeight     : defaultHeight
                        });
                    });
            });


            it('Should move "Not resizable" event, deny it', function() {
                Dash.moveElementToHour({
                    eventName     : eventToTest,
                    dragBy        : Components.calendarEventTitle(eventToTest),
                    dragTo        : Components.calendarHourIndex(Column.RIGHT, Dash.hourToIndex(15)),
                    day            : Column.RIGHT,
                    answer        : Dialog.NO,
                    reqStartHour: defaultStart,
                    reqEndHour    : defaultEnd,
                    reqHeight     : defaultHeight
                });
            });

            it('Should move "Not resizable" event', function() {
                Dash.moveElementToHour({
                    eventName     : eventToTest,
                    dragBy        : Components.calendarEventTitle(eventToTest),
                    dragTo        : Components.calendarHourIndex(Column.RIGHT, Dash.hourToIndex(12)),
                    day            : Column.RIGHT,
                    answer        : Dialog.YES,
                    reqStartHour: "12:00",
                    reqEndHour    : "13:00",
                    reqHeight     : defaultHeight
                });
            });
        });

        describe('Testing "Unrestricted" event', function() {
            var eventToTest = "Unrestricted";
            var defaultStart = "13:00";
            var defaultEnd = "14:00";
            var defaultHeight = 41;

            it('Should move "Unrestricted" event, deny it', function() {
                Dash.moveElementToHour({
                    eventName     : eventToTest,
                    dragBy        : Components.calendarEventTitle(eventToTest),
                    dragTo        : Components.calendarHourIndex(Column.RIGHT, Dash.hourToIndex(16)),
                    day            : Column.RIGHT,
                    answer        : Dialog.NO,
                    reqStartHour: defaultStart,
                    reqEndHour    : defaultEnd,
                    reqHeight     : defaultHeight
                });
            });

            it('Should expand "Unrestricted" event', function() {
                ST.element(Components.calendarEventHandle(eventToTest))
                    .and(function(el){
                        el.dom.style.display = 'block';
                    })
                    .and(function() {
                        Dash.moveElementToHour({
                            eventName     : eventToTest,
                            dragBy        : Components.calendarEventHandle(eventToTest),
                            dragTo        : Components.calendarHourIndex(Column.RIGHT, Dash.hourToIndex(16)),
                            day            : Column.RIGHT,
                            answer        : Dialog.YES,
                            reqStartHour: defaultStart,
                            reqEndHour    : "16:00",
                            reqHeight     : 125
                        });
                    });
            });

            it('Should resize "Unrestricted" event, deny it', function() {
                ST.element(Components.calendarEventHandle(eventToTest))
                    .and(function(el){
                        el.dom.style.display = 'block';
                    })
                    .and(function() {
                        Dash.moveElementToHour({
                            eventName     : eventToTest,
                            dragBy        : Components.calendarEventHandle(eventToTest),
                            dragTo        : Components.calendarHourIndex(Column.RIGHT, Dash.hourToIndex(14)),
                            day            : Column.RIGHT,
                            hour        : 17,
                            answer        : Dialog.NO,
                            reqStartHour: defaultStart,
                            reqEndHour    : "16:00",
                            reqHeight     : 83
                        });
                    });
            });

            it('Should shrink "Unrestricted" event', function() {
                ST.element(Components.calendarEventHandle(eventToTest))
                    .and(function(el){
                        el.dom.style.display = 'block';
                    })
                    .and(function() {
                        Dash.moveElementToHour({
                            eventName     : eventToTest,
                            dragBy        : Components.calendarEventHandle(eventToTest),
                            dragTo        : Components.calendarHourIndex(Column.RIGHT, Dash.hourToIndex(14)),
                            day            : Column.RIGHT,
                            answer        : Dialog.YES,
                            reqStartHour: defaultStart,
                            reqEndHour    : "14:00",
                            reqHeight     : 41
                        });
                    });
            });

            it('Should move "Unrestricted" event', function() {
                Dash.moveElementToHour({
                    eventName     : eventToTest,
                    dragBy        : Components.calendarEventTitle(eventToTest),
                    dragTo        : Components.calendarHourIndex(Column.RIGHT, Dash.hourToIndex(16)),
                    day            : Column.RIGHT,
                    answer        : Dialog.YES,
                    reqStartHour: "16:00",
                    reqEndHour    : "17:00",
                    reqHeight     : 41
                });
            });
        });
    });
});
