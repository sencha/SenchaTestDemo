/**
 * @file MonthView.js
 * @name ExtJS Calendar 6.2-Modern/MonthView/MonthView.js
 * @created 2016/11/9
 *
 * Tested on: Ubuntu 16.04 (Chrome, Firefox, Opera)
 *      iOS (iPhone 6)
 *      Windows 10 desktop (Edge, IE, Chrome, Firefox, Opera)
 *      Windows 10 tablet (Edge, IE)
 *      Windows 8.1 (Tablet & Desktop IE)
 *      phones: Android 4, 5, 6
 *      tablets: iOS 10, Android 6
 * Sencha Test: 2.1.0.80
 * Passed on: All tested
 **/
describe('Calendar 6.5 - Month view', function () {
    /**
     * Custom variables for application
     */
    var examplePrefix = 'app-calendar[id^=ext-app-calendar]{isVisible()} ';
    var eventName = 'Month - Auto TEST';
    var CalendarGroupName = ['Work Calendar', 'Personal', 'Project Zeus'];
    var Calendar = {
        getComponent: function (prefix, item, key) {
            return ST.component(examplePrefix + prefix + ' ' + item + (key ? '[' + key + ']' : ''));
        },
        getCalendar: function () {
            return this.getComponent('', '', '');
        },
        getButton: function (key) {
            return this.getComponent('', 'button', key);
        },
        getButtonWithText: function (text) {
            return ST.button('[text=' + text + ']:first');
        },
        getEvent: function (title) {
            return ST.element('calendar-event[title=' + title + ']:first');
        },
        getTooltip: function () {
            return ST.component('tooltip[id^=ext-tooltip]');
        },
        isVisibleTooltip: function (value) {
            var fn = function () {
                expect(this.future.cmp.isVisible()).toBe(value);
            };
            if (value) {
                this.getTooltip().visible().and(fn);
            }
            else {
                this.getTooltip().hidden().and(fn);
            }
        },
        checkTextButton: function (key, qText) {
            this.getButton(key).visible()
                .and(function () {
                    expect(this.future.cmp.getText()).toBe(qText);
                });
        },
        getCalendarListGroup: function () {
            return this.getComponent('calendar-list', '');
        },
        isNameOfXGroups: function (index, qText) {
            this.getComponent('calendar-list', '')
                .and(function () {
                    expect(this.future.cmp.dataItems[index].textContent).toBe(qText);
                });
        },
        isVisibleButton: function (key, visible) {
            var fn = function () {
                expect(this.getElement().isVisible()).toBe(visible);
            };
            if (visible) {
                this.getButton(key).visible().and(fn);
            }
            else {
                this.getButton(key).hidden().and(fn);
            }
        },
        isMonthTitle: function (qTitle) {
            this.getComponent('toolbar', 'component', 'referenceKey=calTitle')
                .and(function () {
                    expect(this.future.cmp.getHtml()).toBe(qTitle);
                });
        },
        clickOnCalendarGroupItem: function (index, check) {
            if (check) {
                ST.dataView('calendar-list').itemAt(index).click()
                    .and(function () {
                        expect(this.future.el.dom.children[0].className).toBe('x-calendar-list-item-hidden');
                    });
            } else {
                ST.dataView('calendar-list').itemAt(index).click();
            }
        },
        createItHiddenAllEventsOfCalendarId: function (index) {
            it('All events of group ' + CalendarGroupName[index] + ' are hidden', function () {
                Calendar.clickOnCalendarGroupItem(index, true);
                Calendar.getCalendarListGroup()
                    .and(function () {
                        var events = Ext.ComponentQuery.query('calendar-event');
                        for (var ev = 0; ev < events.length; ev++) {
                            expect(events[ev].el.dom.dataset.calendarid).not.toBe(index + 1);
                        }
                    });
                Calendar.clickOnCalendarGroupItem(index, false);
            });
        },
        /**
         * Get string for month and year
         * @param step - step < 0 - previous month, step = 0 - actual month, step > 0 - next month)
         * @return {var} - string at format 'F Y'
         */
        getStringDate: function (step) {
            var today = new Date();
            var month = Ext.Date.add(today, Ext.Date.MONTH, step);
            return Ext.Date.format(month, 'F Y');
        },
        clickMenuButton: function (text) {
            this.getButtonWithText(text).click()
                .and(function () {
                    Ext.first('sheet').hide();
                });
        },
        clickOnXMoreWhenEventOverflow: function (name, row, col) {
            var count = Ext.ComponentQuery.query('calendar-event[title=' + name + ']').length;
            ST.element('calendar-monthview => .x-calendar-weeks-row:nth-child(' + (row + 1) + ') .x-calendar-weeks-cell:nth-child(' + (col + 1) + ') .x-calendar-weeks-overflow')
                .and(function () {
                    if (this.future.el.dom.innerText !== '' && this.future.el.dom.offsetWidth !== 0) {
                        this.future.click();
                    }
                });
            return count;
        },
        destroyEventsOnlyShowMonth: function () {
            ST.component('calendar-monthview:first{isVisible()}').and(function () {
                var events = Ext.ComponentQuery.query('calendar-event');
                for (var i = events.length; i > 0; i--) {
                    events[i - 1].destroy();
                }
            });
        },
        getElement: function (field, dateDay) {
            for (var i = 0; i < field.length; i++) {
                if (field[i].dom.classList.contains('x-current-month')) {
                    return "@" + field[i + dateDay - 1].el.getId();
                }
            }
        },
        setDayPickerslotOnValue: function (value) {
            if (Lib.isPhone) {
                ST.dataView('datepicker pickerslot[_name=day]{isVisible()}')
                    .wait(function (dv) {
                        return Ext.get(dv.getItemAt(value - 1));
                    }).wait(500) //pickerslot is visible, target item is visible but there is some timing issue and it won't scroll item into view
                    .and(function (dv) {
                        this.future.cmp.scrollToItem(Ext.get(dv.getItemAt(value - 1)));
                    }).wait(function (dv) {
                    return dv.getSelection().get('value') === value;
                });
                ST.button("button[_text=Done]").click();
            } else {
                Lib.waitOnAnimations();
                Calendar.getCalendar().and(function () {
                    var cells = Ext.ComponentQuery.query('datepanel dateview')[1].bodyCells.elements;
                    //ORION-1706
                    if (ST.isIE) {
                        var d = new Date();
                        d.setDate(value);
                        Ext.first('datepanel').setValue(d);
                    }
                    else {
                        ST.element(Calendar.getElement(cells, value))
                            .click();
                        Lib.waitOnAnimations();
                    }
                    ST.element("datepanel")
                        .hidden();

                    ST.wait(function () {
                        return value === Ext.first('datepanel').getValue().getDate();
                    })
                });
            }

        }
    };
    beforeAll(function () {
        if (!Lib.isDesktop) {
            Calendar.getButton('_handler=onMenuButtonTap').click();
            Calendar.clickMenuButton('Month');
        }
        ST.options.eventDelay = 500;
    });
    afterAll(function () {
        ST.options.eventDelay = 500;
    });
    if (Lib.isDesktop) {
        describe('Desktop', function () {
            describe('Defualt display UI', function () {
                Lib.panelRendered('Ext JS Calendar');
                it('All buttons are displayed with correctly text', function () {
                    Calendar.checkTextButton('text=Day', 'Day');
                    Calendar.checkTextButton('text=Week', 'Week');
                    Calendar.checkTextButton('text=Month', 'Month');
                    Calendar.checkTextButton('text=<', '<');
                    Calendar.checkTextButton('text=\ >', '>');
                    Calendar.checkTextButton('text=Today', 'Today');
                    Calendar.checkTextButton('text=Sign in with Google', 'Sign in with Google');
                    Calendar.checkTextButton('text=Create', 'Create');
                });
                it('Sign in button is displayed and Sign out button is hidden', function () {
                    Calendar.isVisibleButton('_text=Sign in with Google', true);
                    Calendar.isVisibleButton('_text=Sign out', false);
                });
                it('Should be displayed three groups for event', function () {
                    for (var i = 0; i < 3; i++) {
                        Calendar.isNameOfXGroups(i, CalendarGroupName[i]);
                    }
                });
                it('Month title should have correctly month & year', function () {
                    Calendar.isMonthTitle(Calendar.getStringDate(0));
                });
            });
            describe('Click on a calendar buttons', function () {
                afterEach(function () {
                    Calendar.getButtonWithText('Today').click();
                });
                Lib.testButtons(' ', 'Month');
                Lib.testButtons(' ', "'<'");
                Lib.testButtons(' ', "'>'");
                Lib.testButtons(' ', 'Today');
                it('Button \'>\' Should work correctly, Month title is the next month', function () {
                    Calendar.getButtonWithText('\\>').click();
                    Calendar.isMonthTitle(Calendar.getStringDate(1));
                    Calendar.getButtonWithText('\\>').click();
                    Calendar.isMonthTitle(Calendar.getStringDate(2));
                });
                it('Button \'<\' Should work correctly, Month title is previous month', function () {
                    Calendar.getButtonWithText('<').click();
                    Calendar.isMonthTitle(Calendar.getStringDate(-1));
                    Calendar.getButtonWithText('<').click();
                    Calendar.isMonthTitle(Calendar.getStringDate(-2));
                });
                it('Button Today Should work correctly', function () {
                    Calendar.getButtonWithText('<').click();
                    Calendar.getButtonWithText('<').click();
                    Calendar.getButtonWithText('Today').click();
                    Calendar.isMonthTitle(Calendar.getStringDate(0));
                });
            });
            // Disabled Calendar group tests due to EXTJS-26120 as it broke all the tests
            xdescribe('Calendar groups', function () {
                var groupId = [];
                beforeAll(function () {
                    Calendar.getCalendarListGroup()
                        .and(function () {
                            groupId[0] = this.future.cmp.getViewItems()[0].id;
                            groupId[1] = this.future.cmp.getViewItems()[1].id;
                            groupId[2] = this.future.cmp.getViewItems()[2].id;
                        });
                });
                it('All events are hidden', function () {
                    Calendar.clickOnCalendarGroupItem(0, true);
                    Calendar.clickOnCalendarGroupItem(1, true);
                    Calendar.clickOnCalendarGroupItem(2, true);
                    Calendar.clickOnCalendarGroupItem(0, false);
                    Calendar.clickOnCalendarGroupItem(1, false);
                    Calendar.clickOnCalendarGroupItem(2, false);
                });
                for (var i = 0; i < 3; i++) {
                    Calendar.createItHiddenAllEventsOfCalendarId(i);
                }
            });
            describe('Events', function () {
                var overflow = 0;

                function setOverflowWhenEventIsOverflow(name, row, col) {
                    ST.component(examplePrefix).and(function () {
                        overflow = Calendar.clickOnXMoreWhenEventOverflow(name, row, col);
                    });
                }

                function pendingExtJS_22507() {
                    if (overflow < 1) {
                        pending('EXTJS-22507 - Cannot drag events that are stacked in tooltip');
                    }
                }

                describe('Move with event', function () {
                    beforeEach(function () {
                        Lib.createMonthlyEvent(eventName, 1, 0, 2, 0);
                        setOverflowWhenEventIsOverflow(eventName, 1, 1);
                    });
                    afterEach(function () {
                        setOverflowWhenEventIsOverflow(eventName, 1, 1);
                        Lib.deleteEvent(eventName);
                    });
                    it('Move with event to other row', function () {
                        pendingExtJS_22507();
                        var previousY;
                        Calendar.getEvent(eventName)
                            .and(function () {
                                previousY = this.future.el.dom.offsetTop;
                                var dX = this.future.el.dom.offsetWidth / 2;
                                var dY = this.future.el.dom.offsetHeight / 2;
                                ST.play([
                                    {type: 'mousedown', target: this.future.el, x: dX, y: dY, detail: 1},
                                    {type: 'mousemove', target: this.future.el, x: dX, y: dY + 150, buttons: 1},
                                    {type: 'mouseup', target: this.future.el, x: dX, y: dY + 150, buttons: 1}
                                ]);
                            }).wait(function () {
                            return previousY !== this.el.dom.offsetTop;
                        }).and(function () {
                            expect(previousY !== this.future.el.dom.offsetTop).toBeTruthy();
                        });
                        setOverflowWhenEventIsOverflow(eventName, 2, 2);
                    });
                    it('Move with event to other column', function () {
                        pendingExtJS_22507();
                        var previousX;
                        Calendar.getEvent(eventName)
                            .and(function () {
                                previousX = this.future.el.dom.offsetTop;
                                var dX = this.future.el.dom.offsetWidth / 2;
                                var dY = this.future.el.dom.offsetHeight / 2;
                                ST.play([
                                    {type: 'mousedown', target: this.future.el, x: dX, y: dY, detail: 1},
                                    {type: 'mousemove', target: this.future.el, x: dX + 150, y: dY, buttons: 1},
                                    {type: 'mouseup', target: this.future.el, x: dX + 150, y: dY, buttons: 1}
                                ]);
                            }).wait(function () {
                            return previousX !== this.el.dom.offsetTop;
                        }).and(function () {
                            expect(previousX !== this.future.el.dom.offsetTop).toBeTruthy();
                        });
                        setOverflowWhenEventIsOverflow(eventName, 1, 3);
                    });
                });
                describe('Editing events', function () {
                    beforeEach(function () {
                        Lib.createMonthlyEvent(eventName, 1, 0, 3, 0);
                        setOverflowWhenEventIsOverflow(eventName, 1, 0);
                    });
                    afterEach(function () {
                        setOverflowWhenEventIsOverflow(eventName, 1, 0);
                        Lib.deleteEvent(eventName);
                    });
                    it('Change end date to greater than before', function () {
                        var oldEndDate;
                        setOverflowWhenEventIsOverflow(eventName, 1, 0);
                        Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                        ST.component('datepickerfield[_name=endDate]').visible()
                            .and(function () {
                                oldEndDate = this.future.cmp.getValue();
                                Lib.DatePanel.pickDate('datepickerfield[_name=endDate]', 26, oldEndDate.getMonth()+1, oldEndDate.getFullYear());
                            });

                        Lib.ghostClick('button[text=Save]', undefined, 1);
                        setOverflowWhenEventIsOverflow(eventName, 1, 0);
                        Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                        ST.component('datepickerfield[_name=endDate]').visible()
                            .and(function () {
                                expect(this.future.cmp.getValue().getDate()).toBe(26);
                                expect(this.future.cmp.getValue()).toBeGreaterThan(oldEndDate);
                            });
                        Lib.ghostClick('button[_text=Cancel]');

                    });
                    it('Change end date to less than before', function () {
                        var oldEndDate;
                        setOverflowWhenEventIsOverflow(eventName, 1, 0);
                        Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                        ST.component('datepickerfield[_name=endDate]').visible()
                            .and(function () {
                                oldEndDate = this.future.cmp.getValue();
                                Lib.DatePanel.pickDate('datepickerfield[_name=endDate]', 10, oldEndDate.getMonth()+1, oldEndDate.getFullYear());
                            });
                        Lib.ghostClick('button[_text=Save]');
                        setOverflowWhenEventIsOverflow(eventName, 1, 0);
                        Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                        ST.component('datepickerfield[_name=endDate]').visible()
                            .and(function () {
                                expect(this.future.cmp.getValue().getDate()).toBe(10);
                                expect(this.future.cmp.getValue()).toBeLessThan(oldEndDate);
                            });
                        Lib.ghostClick('button[_text=Cancel]');
                    });
                    it('Change end date to prior start date', function () {
                        pending('EXTJS-21356 - Calendar should prevent setting End date prior to Start day');
                        var oldEndDate, startDate;
                        setOverflowWhenEventIsOverflow(eventName, 1, 0);
                        Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                        ST.component('datepickerfield[_name=startDate]').visible()
                            .and(function () {
                                startDate = this.future.cmp.getValue();
                            });
                        ST.component('datepickerfield[_name=endDate]').visible()
                            .and(function () {
                                oldEndDate = this.future.cmp.getValue();
                                Lib.DatePanel.pickDate('datepickerfield[_name=endDate]', 1, oldEndDate.getMonth()+1, oldEndDate.getFullYear());
                            });
                        Lib.ghostClick('button[_text=Save]');
                        setOverflowWhenEventIsOverflow(eventName, 0, 6);
                        Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                        ST.component('datepickerfield[_name=endDate]').visible()
                            .and(function () {
                                expect(this.future.cmp.getValue().getDate()).toBe(1);
                                expect(this.future.cmp.getValue()).toBeLessThan(oldEndDate);
                                expect(this.future.cmp.getValue()).toBeLessThan(startDate);
                            });
                        Lib.ghostClick('button[_text=Cancel]');
                    });
                    it('Change start date to less than before', function () {
                        var oldStartDate;
                        setOverflowWhenEventIsOverflow(eventName, 1, 0);
                        Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                        ST.component('datepickerfield[_name=startDate]').visible()
                            .and(function () {
                                oldStartDate = this.future.cmp.getValue();
                                Lib.DatePanel.pickDate('datepickerfield[_name=startDate]', 1, oldStartDate.getMonth()+1, oldStartDate.getFullYear());
                            });
                        Lib.ghostClick('button[_text=Save]');
                        setOverflowWhenEventIsOverflow(eventName, 1, 0);
                        Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                        ST.component('datepickerfield[_name=startDate]').visible()
                            .and(function () {
                                expect(this.future.cmp.getValue().getDate()).toBe(1);
                                expect(this.future.cmp.getValue()).toBeLessThan(oldStartDate);
                            });
                        Lib.ghostClick('button[_text=Cancel]');
                    });
                });
                describe('More events on the same days', function () {
                    beforeAll(function () {
                        Lib.createMonthlyEvent(eventName, 1, 0, 4, 0);
                        Lib.createMonthlyEvent(eventName + '2', 1, 0, 4, 0);
                        Lib.createMonthlyEvent(eventName + '3', 1, 0, 4, 0);
                        Lib.createMonthlyEvent(eventName + '4', 1, 0, 4, 0);
                        Lib.createMonthlyEvent(eventName + '5', 1, 0, 4, 0);
                        Calendar.getCalendar().and(function () {
                            Ext.Element.query('tr td div div.x-calendar-weeks-overflow').filter(function (el) {
                                return el.innerText !== ""
                            })[0].click();
                        });
                        setOverflowWhenEventIsOverflow(eventName + '5', 1, 0);
                        Lib.waitOnAnimations();
                    });
                    afterAll(function () {
                        setOverflowWhenEventIsOverflow(eventName + '5', 1, 0);
                        Lib.deleteEvent(eventName + '5');
                        setOverflowWhenEventIsOverflow(eventName + '4', 1, 0);
                        Lib.deleteEvent(eventName + '4');
                        setOverflowWhenEventIsOverflow(eventName + '3', 1, 0);
                        Lib.deleteEvent(eventName + '3');
                        setOverflowWhenEventIsOverflow(eventName + '2', 1, 0);
                        Lib.deleteEvent(eventName + '2');
                        setOverflowWhenEventIsOverflow(eventName, 1, 0);
                        Lib.deleteEvent(eventName);
                    });
                    it('All events should be created', function () {
                        Calendar.getEvent(eventName).visible()
                            .and(function () {
                                expect(this.future.el.isVisible()).toBe(true);
                            });
                        Calendar.getEvent(eventName + '2').visible()
                            .and(function () {
                                expect(this.future.el.isVisible()).toBe(true);
                            });
                        Calendar.getEvent(eventName + '3').visible()
                            .and(function () {
                                expect(this.future.el.isVisible()).toBe(true);
                            });
                        Calendar.getEvent(eventName + '4').visible()
                            .and(function () {
                                expect(this.future.el.isVisible()).toBe(true);
                            });
                        Calendar.getEvent(eventName + '5').visible()
                            .and(function () {
                                expect(this.future.el.isVisible()).toBe(true);
                            });
                    });
                    it('Shorter event is hidden, but show when click on +X more', function () {
                        Lib.createMonthlyEvent(eventName + ' - S', 2, 1, 3, 1);
                        Calendar.isVisibleTooltip(false);
                        setOverflowWhenEventIsOverflow(eventName + ' - S', 2, 1);
                        Calendar.getEvent(eventName + ' - S').visible()
                            .and(function () {
                                expect(0).toBe(overflow);
                            });
                        Calendar.isVisibleTooltip(true);
                        Lib.deleteEvent(eventName + ' - S');
                    });
                    it('Larger event is visible', function () {
                        Lib.createMonthlyEvent(eventName + ' - L', 0, 0, 5, 0);
                        Calendar.isVisibleTooltip(false);
                        setOverflowWhenEventIsOverflow(eventName + ' - L', 0, 6);
                        Lib.waitOnAnimations();
                        Calendar.getEvent(eventName + ' - L').visible()
                            .and(function () {
                                expect(overflow).toBeGreaterThan(0);
                            });
                        Lib.deleteEvent(eventName + ' - L');
                    });
                });
            });
        });
    } else {
        describe('Mobile & tablet', function () {
            describe('Default display UI', function () {
                it('Month title should have correctly date', function () {
                    Calendar.isMonthTitle(Calendar.getStringDate(0));
                });
                it('All buttons are displayed/hidden correctly', function () {
                    Calendar.isVisibleButton('_handler=onMenuButtonTap', true);
                    Calendar.isVisibleButton('_handler=onCreateTap', true);
                    Calendar.getComponent('', 'sheet', 'id^=ext-sheet').hidden()
                        .and(function () {
                            expect(this.future.cmp.isVisible()).toBe(false);
                        });
                    Calendar.isVisibleButton('_text=Day', false);
                    Calendar.isVisibleButton('_text=Week', false);
                    Calendar.isVisibleButton('_text=Month', false);
                    Calendar.isVisibleButton('_text=Sign in with Google', false);
                    Calendar.isVisibleButton('_text=Sign out', false);
                });
                describe('After click on the menu button', function () {
                    beforeAll(function () {
                        Calendar.getButton('_handler=onMenuButtonTap').click();
                    });
                    afterAll(function () {
                        ST.component('sheet').and(function () {
                            this.future.cmp.hide();
                        });
                    });
                    Lib.panelRendered('Ext JS Calendar');
                    it('Sheet menu should be displayed buttons', function () {
                        Calendar.isVisibleButton('_text=Day', true);
                        Calendar.isVisibleButton('_text=Week', true);
                        Calendar.isVisibleButton('_text=Month', true);
                        Calendar.isVisibleButton('_text=Sign in with Google', true);
                        Calendar.isVisibleButton('_text=Sign out', false);
                    });
                    it('Should be displayed three groups for event', function () {
                        for (var i = 0; i < 3; i++) {
                            Calendar.isNameOfXGroups(i, CalendarGroupName[i]);
                        }
                    });
                });
            });
            describe('Calendar groups', function () {
                var groupId = [];
                beforeAll(function () {
                    Calendar.getButton('_handler=onMenuButtonTap').click();
                    Calendar.getCalendarListGroup()
                        .and(function () {
                            groupId[0] = this.future.cmp.getViewItems()[0].id;
                            groupId[1] = this.future.cmp.getViewItems()[1].id;
                            groupId[2] = this.future.cmp.getViewItems()[2].id;
                        });
                });
                afterAll(function () {
                    ST.component('sheet').and(function () {
                        this.future.cmp.hide();
                    });
                });
                it('All events are hidden', function () {
                    Calendar.clickOnCalendarGroupItem(0, true);
                    Calendar.clickOnCalendarGroupItem(1, true);
                    Calendar.clickOnCalendarGroupItem(2, true);
                    Calendar.clickOnCalendarGroupItem(0, false);
                    Calendar.clickOnCalendarGroupItem(1, false);
                    Calendar.clickOnCalendarGroupItem(2, false);
                });
                for (var i = 0; i < 3; i++) {
                    Calendar.createItHiddenAllEventsOfCalendarId(i);
                }
            });
            describe('Editing events', function () {
                var overflow = 0;

                function setOverflowWhenEventIsOverflow(name, row, col) {
                    ST.component(examplePrefix).and(function () {
                        overflow = Calendar.clickOnXMoreWhenEventOverflow(name, row, col);
                    });
                }

                function pendingExtJS_22507() {
                    if (overflow < 1) {
                        pending('EXTJS-22507 - Cannot drag events that are stacked in tooltip');
                    }
                }

                beforeEach(function () {

                    Lib.createMonthlyEvent(eventName, 1, 0, 1, 6);
                    setOverflowWhenEventIsOverflow(eventName, 1, 0);
                    Lib.waitOnAnimations();

                });
                afterEach(function () {
                    setOverflowWhenEventIsOverflow(eventName, 1, 0);
                    Lib.deleteEvent(eventName);
                    Lib.waitOnAnimations();
                });
                it('Change end date to greater than before', function () {
                    var oldEndDate;
                    setOverflowWhenEventIsOverflow(eventName, 1, 0);
                    Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);

                    ST.component('datepickerfield[_name=endDate]').visible()
                        .and(function () {
                            oldEndDate = this.future.cmp.getValue();
                        });
                    ST.component('datepickerfield[_name=endDate] datetrigger')
                        .click();
                    Calendar.setDayPickerslotOnValue(20);
                    ST.button('button[_text=Save]').click();
                    setOverflowWhenEventIsOverflow(eventName, 1, 0);
                    Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                    ST.component('datepickerfield[_name=endDate]').visible()
                        .and(function () {
                            expect(this.future.cmp.getValue().getDate()).toBe(20);
                            expect(this.future.cmp.getValue()).toBeGreaterThan(oldEndDate);
                        });
                    ST.button('button[_text=Cancel]').click();

                });
                it('Change end date to lesser than before', function () {
                    var oldEndDate;
                    setOverflowWhenEventIsOverflow(eventName, 1, 0);
                    Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                    ST.component('datepickerfield[_name=endDate]').visible()
                        .and(function () {
                            oldEndDate = this.future.cmp.getValue();
                        });
                    ST.component('datepickerfield[_name=endDate] datetrigger')
                        .click();
                    Calendar.setDayPickerslotOnValue(10);
                    ST.button('button[_text=Save]').click();
                    setOverflowWhenEventIsOverflow(eventName, 1, 0);
                    Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                    ST.component('datepickerfield[_name=endDate]').visible()
                        .and(function () {
                            expect(this.future.cmp.getValue().getDate()).toBe(10);
                            expect(this.future.cmp.getValue()).toBeLessThan(oldEndDate);
                        });
                    ST.button('button[_text=Cancel]').click();
                });
                it('Change end date to prior start date', function () {
                    pending('EXTJS-21356 - Calendar should prevent setting End date prior to Start day');
                    var oldEndDate, startDate;
                    setOverflowWhenEventIsOverflow(eventName, 1, 0);
                    Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                    ST.component('datepickerfield[_name=startDate]').visible()
                        .and(function () {
                            startDate = this.future.cmp.getValue();
                        });
                    ST.component('datepickerfield[_name=endDate]').visible()
                        .and(function () {
                            oldEndDate = this.future.cmp.getValue();
                        }).click();
                    Calendar.setDayPickerslotOnValue(1);
                    ST.button('button[_text=Save]').click();
                    setOverflowWhenEventIsOverflow(eventName, 0, 6);
                    Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                    ST.component('datepickerfield[_name=endDate]').visible()
                        .and(function () {
                            expect(this.future.cmp.getValue().getDate()).toBe(1);
                            expect(this.future.cmp.getValue()).toBeLessThan(oldEndDate);
                            expect(this.future.cmp.getValue()).toBeLessThan(startDate);
                        });
                    ST.button('button[_text=Cancel]').click();
                });
                it('Change start date to lesser than before', function () {
                    var oldStartDate;
                    setOverflowWhenEventIsOverflow(eventName, 1, 0);
                    Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                    ST.component('datepickerfield[_name=startDate]').visible()
                        .and(function () {
                            oldStartDate = this.future.cmp.getValue();
                        });
                    ST.component('datepickerfield[_name=startDate] datetrigger')
                        .click();
                    Calendar.setDayPickerslotOnValue(1);
                    ST.button('button[_text=Save]').click();
                    setOverflowWhenEventIsOverflow(eventName, 1, 0);
                    Lib.ghostClick('calendar-event[title=' + eventName + ']:first', true);
                    ST.component('datepickerfield[_name=startDate]').visible()
                        .and(function () {
                            expect(this.future.cmp.getValue().getDate()).toBe(1);
                            expect(this.future.cmp.getValue()).toBeLessThan(oldStartDate);
                        });
                    ST.button('button[_text=Cancel]').click();
                });
            });
            describe('Change month', function () {
                it('Swiped to previous month, Month title should display correct month', function () {
                    Calendar.destroyEventsOnlyShowMonth();
                    Lib.swipeCalendar('calendar-month', 200);
                    Calendar.isMonthTitle(Calendar.getStringDate(-1));
                    Calendar.destroyEventsOnlyShowMonth();
                    Lib.swipeCalendar('calendar-month', 200);
                    Calendar.isMonthTitle(Calendar.getStringDate(-2));
                    Calendar.destroyEventsOnlyShowMonth();
                    Lib.swipeCalendar('calendar-month', -200);
                    Calendar.destroyEventsOnlyShowMonth();
                    Lib.swipeCalendar('calendar-month', -200);
                });
                it('Swiped to next month, Month title should display correct month', function () {
                    Calendar.destroyEventsOnlyShowMonth();
                    Lib.swipeCalendar('calendar-month', -200);
                    Calendar.isMonthTitle(Calendar.getStringDate(1));
                    Calendar.destroyEventsOnlyShowMonth();
                    Lib.swipeCalendar('calendar-month', -200);
                    Calendar.isMonthTitle(Calendar.getStringDate(2));
                    Calendar.destroyEventsOnlyShowMonth();
                    Lib.swipeCalendar('calendar-month', 200);
                    Calendar.destroyEventsOnlyShowMonth();
                    Lib.swipeCalendar('calendar-month', 200);
                });
            });
        });
    }
});