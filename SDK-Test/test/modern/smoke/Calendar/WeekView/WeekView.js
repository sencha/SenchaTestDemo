/**
 * @file WeekView.js
 * @name ExtJS Calendar 6.2-Modern/WeekView/WeekView.js
 * @created 2016/11/9
 * 
 * Tested on: Ubuntu 16.04 (Chrome, Firefox, Opera), iPhone 4 iOS 7, 8
 *      iPad iOS 7, 10, Android 4.4, 5, 6, Windows 10 desktop (Edge, IE),
 *      Windows 8.1 (tablet & desktop - IE)
 * Sencha Test: 2.0.0.310
 * Passed on: All tested
 *
 * Tested on:
 *      desktop:    IE 11, Chrome 58, Safari 10, FF 53, Edge 15, Opera 45
 *      tablets:    Android 4.4, 6, iOS 10
 *      phones:     iOS 9, Chrome 6
 **/
describe('Calendar 6.5 - Week view', function(){
    /**
     * Custom variables for application
     */
    var examplePrefix = 'app-calendar[id^=ext-app-calendar]{isVisible()} ';
    var eventName = 'Auto TEST';
    var CalendarGroupName = ['Work Calendar', 'Personal', 'Project Zeus'];
    var Calendar = {
        getComponent: function(prefix, item, key){
            return ST.component(examplePrefix + prefix + ' ' + item + (key? '[' + key + ']' : ''));
        },
        getButton: function(key){
            return this.getComponent('', 'button', key);
        },
        getButtonWithText: function(text){
            return ST.button('[text=' + text + ']:first');
        },
        getEvent: function(title){
            return ST.element('calendar-event[title=' + title + ']:first');
        },
        checkTextButton: function (key, qText){
            this.getButton(key).visible()
                .and(function(){
                    expect(this.future.cmp.getText()).toBe(qText);
                });
        },
        getCalendarListGroup: function(){
            return this.getComponent('calendar-list', '', '');
        },
        isNameOfXGroups: function(index, qText){
            this.getComponent('calendar-list', '', '')
                .and(function(){
                    expect(this.future.cmp.dataItems[index].textContent).toBe(qText);
                });
        },
        isVisibleButton: function(key, visible){
            var fn = function(){
                expect(this.getElement().isVisible()).toBe(visible);
            };
            if(visible){
                this.getButton(key).visible().and(fn);
            }
            else {
                this.getButton(key).hidden().and(fn);
            }
        },
        isWeekTitle: function(qTitle){
            this.getComponent('toolbar', 'component', 'referenceKey=calTitle')
                .and(function(){
                    expect(this.future.cmp.getHtml()).toBe(qTitle);
                });
        },
        clickOnCalendarGroupItem: function(index, check){
            if(check){ 
                ST.dataView('calendar-list').itemAt(index).click()
                    .and(function(){
                        expect(this.future.el.dom.children[0].className).toBe('x-calendar-list-item-hidden');
                    });
            } else {
                ST.dataView('calendar-list').itemAt(index).click();
            }
        },
        createItHiddenAllEventsOfCalendarId: function(index){
            it('All events of group ' + CalendarGroupName[index] + ' are hidden', function(){
                Calendar.clickOnCalendarGroupItem(index, true);
                Calendar.getCalendarListGroup()
                    .and(function(){
                        var events = Ext.ComponentQuery.query('calendar-event');
                        for(var ev = 0; ev < events.length; ev++){
                            expect(events[ev].el.dom.dataset.calendarid).not.toBe(index + 1);
                        }
                    });
                Calendar.clickOnCalendarGroupItem(index, false);
            });
        },
        /**
         * Get string for a range date
         * @param step - step < 0 - previous week, step = 0 - actual week, step > 0 - next week)
         * @return {var} - string at format 'j M - j M Y'
         */
        getStringRangeDate: function(step){
            var today = new Date();
            var day = Ext.Date.add(today, Ext.Date.DAY, 7 * step - today.getDay());
            var title = Ext.Date.format(day, 'j M - ');
            day = Ext.Date.add(day, Ext.Date.DAY, 6);
            return title += Ext.Date.format(day,'j M Y');
        },
        clickMenuButton: function(text){
            this.getButtonWithText(text).click()
                .and(function(){
                    Ext.first('sheet').hide();
                });
        }
    };
    beforeAll(function(){
        if(Lib.isDesktop){
            Calendar.getButtonWithText('Week').click();
        } else {
            Calendar.getButton('_handler=onMenuButtonTap').click();
            Calendar.clickMenuButton('Week');
        }
        ST.options.eventDelay = 200;
    });
    afterAll(function(){
        if(Lib.isDesktop){
            Calendar.getButtonWithText('Month').click();
        } else {
            Calendar.getButton('_handler=onMenuButtonTap').click();
            Calendar.clickMenuButton('Month');
        }
        ST.options.eventDelay = 500;
    });
    if (Lib.isDesktop){
        describe('Desktop', function(){
            describe('Default display UI', function(){
                Lib.panelRendered('Ext JS Calendar');
                it('All buttons are displayed with correctly text', function(){
                    Calendar.checkTextButton('text=Day', 'Day');
                    Calendar.checkTextButton('text=Week', 'Week');
                    Calendar.checkTextButton('text=Month', 'Month');
                    Calendar.checkTextButton('text=<', '<');
                    Calendar.checkTextButton('text=\ >', '>');
                    Calendar.checkTextButton('text=Today', 'Today');
                    Calendar.checkTextButton('text=Sign in with Google', 'Sign in with Google');
                    Calendar.checkTextButton('text=Create', 'Create');
                });
                it('Sign in button is displayed and Sign out button is hidden', function(){
                    Calendar.isVisibleButton('_text=Sign in with Google', true);
                    Calendar.isVisibleButton('_text=Sign out', false);
                });
                it('Should be displayed three groups for event', function(){
                    for(var i = 0; i < 3; i++){
                        Calendar.isNameOfXGroups(i, CalendarGroupName[i]);
                    }
                });
                it('Time marker should be visibled', function () {
                    var date = new Date();
                    var current_hours = date.getHours();
                    var current_minutes = date.getMinutes();
                    var assumption_top = current_hours * 41.76 + current_minutes * 0.7;
                    var marker = document.getElementsByClassName('x-calendar-days-day-column')[date.getDay()]
                        .getElementsByClassName('x-calendar-days-now-marker')[0];
                    if (typeof marker !== 'undefined') {
                        var marker_position = parseFloat(marker.style.cssText.substring(5, 10));
                        expect(Math.abs(marker_position - assumption_top) < 10).toBe(true);
                    }
                });
                it('Week title should have correctly range date', function(){
                    Calendar.isWeekTitle(Calendar.getStringRangeDate(0));
                });
            });
            describe('Click on a calendar buttons', function(){
                beforeAll(function(){
                    Calendar.getButtonWithText('Today').click();
                });
                afterEach(function(){
                    Calendar.getButtonWithText('Today').click();
                });
                Lib.testButtons(' ', 'Week');
                Lib.testButtons(' ', "'<'");
                Lib.testButtons(' ', "'>'");
                Lib.testButtons(' ', 'Today');
                it('Button \'>\' Should work correctly, Week title is the next week', function(){
                    Calendar.getButtonWithText('\\>').click();
                    Calendar.isWeekTitle(Calendar.getStringRangeDate(1));
                    Calendar.getButtonWithText('\\>').click();
                    Calendar.isWeekTitle(Calendar.getStringRangeDate(2));
                });
                it('Button \'<\' Should work correctly, Week title is previous week', function(){
                    Calendar.getButtonWithText('<').click();
                    Calendar.isWeekTitle(Calendar.getStringRangeDate(-1));
                    Calendar.getButtonWithText('<').click();
                    Calendar.isWeekTitle(Calendar.getStringRangeDate(-2));
                });
                it('Button Today Should work correctly', function(){
                    Calendar.getButtonWithText('<').click();
                    Calendar.getButtonWithText('<').click();
                    Calendar.getButtonWithText('Today').click();
                    Calendar.isWeekTitle(Calendar.getStringRangeDate(0));
                });
            });
            describe('Resizing/Editing events', function(){
                var heightEvent = 0, elCalendar;
                beforeEach(function(){
                    var cellHeight = Ext.first('calendar-weekview').getSlotStyle().hourHeight;
                    Ext.first('calendar-weekview').scrollable.scrollTo(0,cellHeight*4);

                    Lib.createWeeklyEvent(eventName, 4, 6, 1);
                    Calendar.getEvent(eventName)
                        .and(function(){
                            heightEvent = this.future.el.dom.offsetHeight;
                        });
                    elCalendar = Ext.ComponentQuery.query('calendar')[0];
                    if(elCalendar.isComponent){ elCalendar = elCalendar.el; }
                });
                afterEach(function(){
                    Lib.deleteEvent(eventName);
                    Ext.first('calendar-weekview').scrollable.scrollTo(0,0);
                });
                it('Event should be enlarged', function(){
                    Lib.resizeEventByDnD(eventName, 3)
                        .wait(function(){ return this.el.dom.offsetHeight !== 0; })
                        .and(function(){
                            expect(this.future.el.dom.offsetHeight).toBeGreaterThan(heightEvent);
                        });
                });
                it('Event should be reduced', function(){
                    Lib.resizeEventByDnD(eventName, -2)
                        .wait(function(){ return this.el.dom.offsetHeight !== 0; })
                        .and(function(){
                            expect(this.future.el.dom.offsetHeight).toBeLessThan(heightEvent);
                        });
                });
                it('Resize due to change end time', function(){
                    Calendar.getEvent(eventName).click();
                    ST.component('calendar-timefield[_name=endTime]').visible().click();
                    ST.dataView('list').itemAt(60).reveal().visible().click();
                    Lib.ghostClick('button[_text=Save]');
                    Calendar.getEvent(eventName)
                        .and(function(){
                            expect(this.future.el.dom.offsetHeight).toBeGreaterThan(heightEvent);
                        });
                });
                it('Move with event to other time', function(){
                    var previousY;
                    Calendar.getEvent(eventName).visible()
                        .and(function(){
                            previousY = this.future.el.dom.offsetTop;
                            var dX = this.future.el.dom.offsetWidth / 2;
                            var dY = this.future.el.dom.offsetHeight / 2;
                            ST.play([
                                {type: 'mousedown', target: this.future.el, x: dX, y: dY, detail: 1},
                                {type: 'mousemove', target: this.future.el, x: dX, y: dY + 150, buttons: 1},
                                {type: 'mouseup', target: elCalendar}
                            ]);
                        }).wait(function(){
                            return previousY !== this.el.dom.offsetTop;
                        }).and(function(){
                            expect(previousY !== this.future.el.dom.offsetTop).toBeTruthy();
                        });
                });
                it('Move with event to other day', function(){
                    var previousX;
                    Calendar.getEvent(eventName).visible()
                        .and(function(){
                            previousX = this.future.el.dom.offsetTop;
                            var dX = this.future.el.dom.offsetWidth / 2;
                            var dY = this.future.el.dom.offsetHeight / 2;
                            ST.play([
                                {type: 'mousedown', target: this.future.el, x: dX, y: dY, detail: 1},
                                {type: 'mousemove', target: this.future.el, x: dX + 150, y: dY, buttons: 1},
                                {type: 'mouseup', target: elCalendar}
                            ]);
                        }).wait(function(){
                            return previousX !== this.el.dom.offsetTop;
                        }).and(function(){
                            expect(previousX !== this.future.el.dom.offsetTop).toBeTruthy();
                        });
                });
            });
            // Disabled Calendar group tests due to EXTJS-26120 as it broke all the tests
            xdescribe('Calendar groups', function(){
                var groupId = [];
                beforeAll(function(){
                    Calendar.getCalendarListGroup()
                        .and(function(){
                            groupId[0] = this.future.cmp.getViewItems()[0].id;
                            groupId[1] = this.future.cmp.getViewItems()[1].id;
                            groupId[2] = this.future.cmp.getViewItems()[2].id;
                        });
                });
                it('All events are hidden', function(){
                    Calendar.clickOnCalendarGroupItem(0, true);
                    Calendar.clickOnCalendarGroupItem(1, true);
                    Calendar.clickOnCalendarGroupItem(2, true);
                    Calendar.clickOnCalendarGroupItem(0, false);
                    Calendar.clickOnCalendarGroupItem(1, false);
                    Calendar.clickOnCalendarGroupItem(2, false);
                });
                for(var i = 0; i < 3; i++){
                    Calendar.createItHiddenAllEventsOfCalendarId(i);
                }
            });
            describe('Multiple events', function(){
                beforeAll(function(){
                    Lib.createWeeklyEvent(eventName, 8, 11, 1);
                    Lib.createWeeklyEvent(eventName + '2', 8, 11, 1);
                });
                afterAll(function(){
                    Lib.deleteEvent(eventName);
                    Lib.deleteEvent(eventName + '2');
                });
                it('Should be visible', function(){
                    Calendar.getEvent(eventName).visible()
                        .and(function(){
                            var zIndexEvent2 = Ext.ComponentQuery.query('calendar-event[title=' + eventName + '2]')[0].el.dom.style.zIndex;
                            expect(this.future.el.dom.style.zIndex).toBeLessThan(zIndexEvent2);
                        });
                });
                it('Short event ahead of other events', function(){
                    Lib.createWeeklyEvent(eventName + '3', 9, 10, 1);
                    Calendar.getEvent(eventName).visible()
                        .and(function(){
                            var zIndexEvent2 = Ext.ComponentQuery.query('calendar-event[title=' + eventName + '2]')[0].el.dom.style.zIndex;
                            var zIndexEvent3 = Ext.ComponentQuery.query('calendar-event[title=' + eventName + '3]')[0].el.dom.style.zIndex;
                            expect(this.future.el.dom.style.zIndex).toBeLessThan(zIndexEvent3);
                            expect(zIndexEvent2).toBeLessThan(zIndexEvent3);
                        });
                    Lib.deleteEvent(eventName + '3');
                });
                it('Larger event behind other events', function(){
                    Lib.createWeeklyEvent(eventName + '3', 7, 13, 1);
                    Calendar.getEvent(eventName).visible()
                        .and(function(){
                            var zIndexEvent2 = Ext.ComponentQuery.query('calendar-event[title=' + eventName + '2]')[0].el.dom.style.zIndex;
                            var zIndexEvent3 = Ext.ComponentQuery.query('calendar-event[title=' + eventName + '3]')[0].el.dom.style.zIndex;
                            expect(this.future.el.dom.style.zIndex).toBeGreaterThan(zIndexEvent3);
                            expect(zIndexEvent2).toBeGreaterThan(zIndexEvent3);
                        });
                    Lib.deleteEvent(eventName + '3');
                });
            });
        });
    } else {
        describe('Mobile & tablet', function(){
            describe('Default display UI', function(){
                it('Week title should have correctly range date', function(){
                    Calendar.isWeekTitle(Calendar.getStringRangeDate(0));
                });
                it('All buttons are displayed/hidden correctly', function(){
                    Calendar.isVisibleButton('_handler=onMenuButtonTap', true);
                    Calendar.isVisibleButton('_handler=onCreateTap', true);
                    Calendar.getComponent('', 'sheet', 'id^=ext-sheet').hidden()
                        .and(function(){
                            expect(this.future.cmp.isVisible()).toBe(false);
                        });
                    Calendar.isVisibleButton('_text=Day', false);
                    Calendar.isVisibleButton('_text=Week', false);
                    Calendar.isVisibleButton('_text=Month', false);
                    Calendar.isVisibleButton('_text=Sign in with Google', false);
                    Calendar.isVisibleButton('_text=Sign out', false);
                });
                describe('After click on the menu button', function(){
                    beforeAll(function(){
                        Lib.waitOnAnimations();
                        Calendar.getButton('_handler=onMenuButtonTap').click();
                        Lib.waitOnAnimations();
                    });
                    afterAll(function(){
                        ST.component('sheet')
                            .and(function(sheet){
                                sheet.hide();
                            })
                            .wait(function(sheet){
                                return sheet.getHidden() === true;
                            });
                    });
                    Lib.panelRendered('Ext JS Calendar');
                    it('Sheet menu should be displayed buttons', function(){
                        Calendar.isVisibleButton('_text=Day', true);
                        Calendar.isVisibleButton('_text=Week', true);
                        Calendar.isVisibleButton('_text=Month', true);
                        Calendar.isVisibleButton('_text=Sign in with Google', true);
                        Calendar.isVisibleButton('_text=Sign out', false);
                    });
                    it('Should be displayed three groups for event', function(){
                        for(var i = 0; i < 3; i++){
                            Calendar.isNameOfXGroups(i, CalendarGroupName[i]);
                        }
                    });
                });
            });
            describe('Change week', function(){
                it('Swiped to previous week, Week title should display correct week', function(){
                    Lib.swipeCalendar('calendar-week', 200);
                    Calendar.isWeekTitle(Calendar.getStringRangeDate(-1));
                    Lib.swipeCalendar('calendar-week', 200);
                    Calendar.isWeekTitle(Calendar.getStringRangeDate(-2));
                    Lib.swipeCalendar('calendar-week', -200);
                    Lib.swipeCalendar('calendar-week', -200);
                });
                it('Swiped to next week, Week title should display correct week', function(){
                    Lib.swipeCalendar('calendar-week', -200);
                    Calendar.isWeekTitle(Calendar.getStringRangeDate(1));
                    Lib.swipeCalendar('calendar-week', -200);
                    Calendar.isWeekTitle(Calendar.getStringRangeDate(2));
                    Lib.swipeCalendar('calendar-week', 200);
                    Lib.swipeCalendar('calendar-week', 200);
                });
            });
            describe('Resizing/Editing events', function(){
                var heightEvent = 0;
                beforeEach(function(){
                    Lib.createWeeklyEvent(eventName, 9, 12, 1);
                    Calendar.getEvent(eventName)
                        .and(function(){
                            heightEvent = this.future.el.dom.offsetHeight;
                        });
                });
                afterEach(function(){
                    Lib.deleteEvent(eventName);
                });
                it('Event should be enlarged', function(){
                    Lib.resizeEventByDnD(eventName, 3)
                        .and(function(){
                            expect(this.future.el.dom.offsetHeight).toBeGreaterThan(heightEvent);
                        });
                });
                it('Event should be reduced', function(){
                    Lib.resizeEventByDnD(eventName, -2)
                        .and(function(){
                            expect(this.future.el.dom.offsetHeight).toBeLessThan(heightEvent);
                        });
                });
                it('Resize due to change end time', function(){
                    Calendar.getEvent(eventName).click();
                    if(Lib.isPhone){
                        ST.component('calendar-form-edit fieldset').and(function(){
                            this.future.cmp.getScrollable().getScrollElement().dom.scrollTop = 200;
                        });
                    }
                    ST.component('calendar-timefield[_name=endTime]').visible().click();
                    if(Lib.isPhone){
                        Lib.waitOnAnimations();
                        ST.component('pickerslot[_name=value]')
                            .and(function(ps){
                                var height = Ext.first('pickerslot[_name=value]').dataItems[0].clientHeight;
                                Ext.first('pickerslot[_name=value]').getScrollable().scrollTo(0, height*4*14);
                            });
                        ST.play([
                            {type: 'tap', target: 'pickerslot', x: 150, y: 120},
                            {type: 'tap', target: 'pickerslot', x: 150, y: 120},
                            {type: 'tap', target: 'pickerslot', x: 150, y: 120},
                            {type: 'tap', target: 'pickerslot', x: 150, y: 120},
                            {type: 'tap', target: 'pickerslot', x: 150, y: 120}
                        ]);
                        ST.button('[_text=Done]').visible().click();
                    } else {
                        ST.dataView('list').itemAt(52).reveal().visible().click();
                    }
                    ST.button('[_text=Save]').visible().click();
                    Calendar.getEvent(eventName)
                        .and(function(){
                            expect(this.future.el.dom.offsetHeight).toBeGreaterThan(heightEvent);
                        });
                });
            });
            // Disabled Calendar group tests due to EXTJS-26120 as it broke all the tests
            xdescribe('Calendar groups', function(){
                var groupId = [];
                beforeAll(function(){
                    Calendar.getButton('_handler=onMenuButtonTap').click();
                    Calendar.getCalendarListGroup()
                        .and(function(){
                            groupId[0] = this.future.cmp.getViewItems()[0].id;
                            groupId[1] = this.future.cmp.getViewItems()[1].id;
                            groupId[2] = this.future.cmp.getViewItems()[2].id;
                        });
                });
                afterAll(function(){
                    ST.component('sheet')
                        .and(function(sheet){
                            sheet.hide();
                        })
                        .wait(function(sheet){
                            return sheet.getHidden() === true;
                        });
                });
                it('All events are hidden', function(){
                    Calendar.clickOnCalendarGroupItem(0, true);
                    Calendar.clickOnCalendarGroupItem(1, true);
                    Calendar.clickOnCalendarGroupItem(2, true);
                    Calendar.clickOnCalendarGroupItem(0, false);
                    Calendar.clickOnCalendarGroupItem(1, false);
                    Calendar.clickOnCalendarGroupItem(2, false);
                });
                for(var i = 0; i < 3; i++){
                    Calendar.createItHiddenAllEventsOfCalendarId(i);
                }
            });
        });
    }
});
