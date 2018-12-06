/********************
 * @file CalendarDayView.js
 * Calendar Day view
 *
 * Works on
 * PC - Firefox,Opera,Chrome,IE,Edge,Safari
 * iOS - iOS10@iPhone 6, iOS8@iPhone4
 * Android - tablets
 * Fails on - android4.4 - TO DO.
 * Fails also on WindowsPhone 8.1
 *
 * tested on
 * Desktop: Chrome 58, FF 53, Edge 14, IE 11
 * Phone: Android 6, iOS 9
 * Tablet: Android 5, iOS 10
 ********************/

describe("CalendarDayView", function () {

    var prefix = '#kitchensink-view-calendar-days';

    var Calendar = {
        calendarList : function () {
            return ST.component('calendar-days-view calendar-list');
        },
        eventByTitle : function (title) {
            return ST.component('calendar-event[_title='+title+']');
        }
    };

    beforeAll(function () {
        // redirect to page Calendar>Calendar day view
        Lib.beforeAll("#calendar-days-view");
    });
    afterAll(function () {
        Lib.afterAll(prefix);
    });

    // calendar day view
    describe("calendar day view is loaded correctly", function () {
        it('calendar day view main page is loaded', function () {
            ST.component("calendar-days-view")
                .visible()
                .and(function (component) {
                    expect(component.isVisible()).toBeTruthy()
                });
        });
    });

    // filter work/personal calendar
    if (!Lib.isPhone) {
        describe("filter work/personal calendar", function () {
            var delay;
            beforeAll(function () {
                delay = ST.options.eventDelay;
                ST.options.eventDelay = 500;
            });
            afterAll(function () {
                ST.options.eventDelay = delay;
            });
            it('work calendar is hidden', function () {
                Calendar.calendarList()
                    .click(20, 10)
                    .and(function () {
                        expect(Ext.first('calendar-event[_title=All Day]')).toBe(null);
                    });
                // turn it on again
                Calendar.calendarList()
                    .click(20, 10);
            });
            it('work calendar is visible again', function () {
                Calendar.calendarList()
                    .click(20, 10);
                Calendar.calendarList()
                    .click(20, 10)
                    .and(function () {
                        expect(Ext.first('calendar-event[_title=All Day]')).not.toBe(null);
                    });
            });
            it('personal calendar is hidden', function () {
                Calendar.calendarList()
                    .click(20, 35)
                    .and(function () {
                        expect(Ext.first('calendar-event[_title=Call Accountant]')).toBe(null);
                    });
                Calendar.calendarList()
                    .click(20, 35);
            });
            it('personal calendar is visible again', function () {
                Calendar.calendarList()
                    .click(20, 35);
                Calendar.calendarList()
                    .click(20, 35)
                    .and(function () {
                        expect(Ext.first('calendar-event[_title=Call Accountant]')).not.toBe(null);
                    });
            });
        });
    }

    // creating events
    if (Lib.isDesktop) { //events can be created only on desktop browsers
        describe("creating events", function () {
            it('creating work calendar event', function () {
                Lib.createWeeklyEvent('Work calendar event', 2, 3, 1, 'Work');
                Calendar.eventByTitle('"Work calendar event"')
                    .and(function (component) {
                        expect(component.el.isVisible()).toBeTruthy()
                    });
                Calendar.eventByTitle("Work calendar event")
                    .and(function (el) {
                        expect(el.el.dom.innerHTML).toContain("rgb(244, 67, 54)"); // This is color for Work event
                    });
            });
            it('creating personal calendar event', function () {
                Lib.createWeeklyEvent('Personal calendar event', 2, 3, 1, 'Personal');
                Calendar.eventByTitle('"Personal calendar event"')
                    .and(function (component) {
                        expect(component.el.isVisible()).toBeTruthy()
                    });
                Calendar.eventByTitle('"Personal calendar event"')
                    .and(function (el) {
                        expect(el.el.dom.innerHTML).toContain("rgb(63, 81, 181)"); // This is color for Personal event
                    });
            });
        });
    }

    // deleting event
    describe("deleting event", function () {
        it('event is deleted correctly', function () {
            Lib.deleteEvent('All Day');
            ST.wait(function () {
                return !Ext.first('calendar-event[_title=All Day]');
            }).and(function () {
                expect(Ext.first('calendar-event[_title=All Day]')).toBe(null);
            });
        });
    });

    // editing event
    describe("edit event", function () {
        beforeEach(function () {
            Calendar.eventByTitle("Gym")
                .and(function(g){
                    Ext.first("calendar-daysview").scrollable.scrollTo(0, g.el.dom.offsetTop);
                })
                .click();
            ST.component("calendar-form-edit").visible();
        });
        afterEach(function(){
            ST.component("calendar-daysview")
                .and(function(cd){
                    cd.scrollable.scrollTo(0, 0);
                });
        });
        it('editing screen is opened', function () {
            ST.component("calendar-form-edit")
                .and(function (component) {
                    expect(component.isVisible()).toBeTruthy();
                });
            //Lib.ghostClick("calendar-form-edit button[_text=Save]", true);
            ST.button("calendar-form-edit button[text=Save]").click();

        });
        describe('edit time', function () {
            afterEach(function () {
                //Lib.ghostClick("calendar-form-edit button[_text=Save]", true);
                ST.button("calendar-form-edit button[text=Save]").click();
            });
            it('Change default time', function () {
                if (!Lib.isPhone) {
                    ST.component("calendar-timefield[_name=startTime]")
                        .click();
                    ST.component("boundlist[_hidden=false]")
                        .and(function(boundlist){
                            var oneRowHeight = boundlist.innerItems[53].el.dom.clientHeight;
                            boundlist.getScrollable().scrollTo(0, 53*oneRowHeight);

                        });

                    ST.element("boundlist[_hidden=false] simplelistitem:nth-child(54)")
                        .click();
                    ST.component("calendar-timefield[_name=startTime]")
                        .and(function (el) {
                            expect(el._value.data.text).toContain("1:15 PM");
                        });
                } else {
                    ST.component("calendar-timefield[_name=startTime]")
                        .click();
                    ST.element("//div[contains(text(),'10:00 AM')]")
                        .click();
                    ST.component("calendar-timefield[_name=startTime]")
                        .and(function (el) {
                            expect(el._value.data.text).toContain("5:30 PM");
                        });
                }
            });
        });

        it('change event name', function () {
            ST.component("calendar-form-edit textfield[_label=Title]")
                .click()
                .and(function (textfield) {
                    textfield.setValue(''); // otherwise on WinPhone value will be 2Gym instead of Gym2
                })
                .down('>>input') // workaround
                .type("Gym2");
            //Lib.ghostClick("calendar-form-edit button[_text=Save]", true);
            ST.button("calendar-form-edit button[_text=Save]").click();
            Calendar.eventByTitle("Gym2")
                .visible();
        });
    });

    describe("resizing event", function () {
        it("event is resized correctly", function () {
            Lib.resizeEventByDnD('Team Lunch', 4);
            Calendar.eventByTitle('"Team Lunch"')
                .and(function (el) {
                    expect(el.el.dom.clientHeight).toBe(102);
                    expect(el.el.dom.clientHeight + 2*el.el.dom.clientTop).toBe(el._height);
                });
        });
    });
});        