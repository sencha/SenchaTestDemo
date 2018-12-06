/**
 * @file calendarPanel.js
 * @date 10.1.2017
 * @lastEdit 22.3.2017
 *
 * Tested on: 
 *  Desktop: 
 *      Chrome 55, 
 *      Firefox 50, 
 *      Opera 42,
 *      Safari 10
 *      IE 11
 *      Edge
 *  Phones:
 *      Android 4 - Chrome 55
 *      Android 5 - Chrome 55
 *      Android 6 - Chrome 55
 *  iOS:
 *      iOS 7 - Safari 7
 *      iOS 9 - Safari 9
 *      iOS 10 - Safari 10
 *
 */
 
 describe('Calendar panel example', function() {
    var eventPersonal = {
            calendar: 'Personal',
            title:'Title - Personal event',
            calendarId : 2,
            allDay: true,
            description:'Description of personal event',
            startDate: getToday(1),
            endDate: getToday(3),
            startTime: '',
            endTime: ''
        },
        eventWork = {
            calendar: 'Work Calendar',
            calendarId : 1,
            title:'Title - Work event', 
            allDay: false, 
            description:'Description of work event',
            startDate: getToday(1),
            endDate: getToday(1),
            startTime: '',
            endTime: ''
        },
        eventZeus = {
            calendar: 'Project Zeus',
            title:'Title - Zeus event - All day', 
            allDay: false,
            calendarId : 3,
            description:'Description of zeus event.',
            startDate: getToday(5),
            endDate: getToday(5),
            startTime: '',
            endTime: ''
        };
        
    var AddForm = {
        textfield: function (name) {
            return ST.textField("calendar-form-add textfield[name='" + name + "']");
        },
        textinput: function (name) {
            return ST.element("calendar-form-add textinput[_name='" + name + "']");
        },
        button: function (name) {
            return ST.button("calendar-form-add button[_text='" + name + "']");
        },
        checkbox: function () {
            return ST.checkBox("calendar-form-add checkbox[name='allDay']");
        },
        form: function () {
            return ST.panel('calendar-form-add');
        },
        calendarPickerField : function () {
            return ST.component('calendar-form-add calendar-calendar-picker');
        }
    },
    EditForm = {
        textfield: function (name) {
            return ST.element("calendar-form-edit textfield[_name='" + name + "']");
        },
        textEdit: function (name) {
            return ST.textField("calendar-form-edit textfield[_name='" + name + "']");
        },
        button: function (name) {
            return ST.button("calendar-form-edit button[_text='" + name + "']");
        },
        form: function () {
            return ST.panel('calendar-form-edit');
        },
        checkbox: function () {
            return ST.checkBox("calendar-form-edit checkbox[_name='allDay']");
        }
    },
    Button = {
        common: function (text) {
            return ST.button("calendar-panel button[_text='" + text +"']");
        },
        phone: function (handler) {
            return ST.button("calendar-panel button[_handler='" + handler +"']");
        },
        picker: function (text) {
            return ST.button("picker button[_text='" + text +"']");
        },
        //the same for phones, because I changed picker to datepicker (JZ)
        pickerOrder: function (text, order) {
            if (order === 0) {
                return Ext.ComponentQuery.query("datepicker button[_text='"+text+"']")[order].el.id;
            }
            else {
                var id1, id2;
                id1 = Ext.ComponentQuery.query("datepicker button[_text='"+text+"']")[order-1].el.id;
                id2 = Ext.ComponentQuery.query("datepicker button[_text='"+text+"']")[order].el.id;
                if (id1 > id2) {
                    return id1;
                }
                else {
                    return id2;
                }
            }
        }
    };
    
    // get today date + days into Date format
    function getToday (days) {
        var today = new Date();
        today.setDate(today.getDate() + days);
        return ( today );
    }
    
    // convert to format necessary for adding / editing form
    function dateForForm (date) {
        return Ext.Date.format(date, 'm/d/Y');
    }
    
    // concert to format necessary for searching of event in view
    function dateToJSON (date) {
        return Ext.Date.format(date, 'Y-m-d');
    }
    
    // if you want create and also check event => check=true
    function createEventViaButton (calendar, title, startDate, endDate, allDay, description, check) {
        describe ("Event is created - " + title, function() {
            it ("Add form is opened", function(){
                if(ST.os.is.Desktop) {
                    Button.common("Create").click();
                } else {
                    Button.phone("onCreateTap").click();
                }
            });
            if (calendar !== "") {
                it (calendar + " type is selected", function(){
                    selectCalendar(calendar);
                });
            }
            it (title + " title is entered", function(){
                enterText("title", title);
            });
            if (allDay !== "") {
                it ("All day is configured to " + allDay, function(){
                    setAllDay(allDay);
                });
            }
            if (startDate !== "") {
                it ("Start date is entered " + dateForForm(startDate), function(){
                    setDate("startDate",startDate,0);
                });
            }
            if (endDate !== "") {
                it ("End date is entered " + dateForForm(endDate), function(){
                    setDate("endDate",endDate,1);
                });
            }
            if (description !== "") {
                it (description + " description is entered", function(){
                    enterText("description", description);
                });
            }
            it ("Event is created", function(){
                Lib.ghostClick("calendar-form-add button[_text='Save']",true);
            });
        });
        if (check) {
            describe("Event is checked - " + title, function() {
                // TODO can be removed when ORION-1669 is fixed
                afterAll(function () {
                    EditForm.form().and(function (form) {
                        form.onCancelTap();
                    });
                });
                checkEvent(calendar, title, allDay, startDate, endDate, description);
            });
        }
    }
    
    function setDate (field, date, start) {
        // TODO can be removed when ORION-1669 is fixed
        //override to fix tests, sets date programatically
        AddForm.textfield(field).and(function (dateField) {
            dateField.setValue(date);
        });

        /*AddForm.textinput(field)
            .click();
        Lib.waitOnAnimations();
        AddForm.textinput(field)
            .and(function() {
                pickerDate(date, start);
            });
         */
        AddForm.textfield(field)
            .visible()
            .down(">>input")
            .textLike(dateForForm(date))
            .visible()
            .and(function (textfield) {
                expect(textfield.dom.value).toBe(dateForForm(date));
        });
    }
    
    function getHigherId(type, date, start) {
        var partDate;
        switch (type) {
            case 'month':
                partDate = date.getMonth();
                break;
            case 'day':
                // calculate ID selected day (ID started from '0' => date.getDate()-1)
                partDate = date.getDate()-1;
                break;
            case 'year':
                // calculate ID selected year (ID started from 1980 => date.getFullYear()-1980)
                partDate = date.getFullYear()-1980;
                break;
        }
        // extract ID according to partDate. Need to find higher ID due to troubles on IE and Edge
        if (start === 0) {
            return Ext.ComponentQuery.query("pickerslot[_name=" + type +"]")[start].innerElement.dom.firstChild.children[partDate].id;
        }
        else {
            var id1, id2;
            id1 = Ext.ComponentQuery.query("pickerslot[_name=" + type +"]")[0].innerElement.dom.firstChild.children[partDate].id;
            id2 = Ext.ComponentQuery.query("pickerslot[_name=" + type +"]")[1].innerElement.dom.firstChild.children[partDate].id;
            //number should be compared - not strings (JZ)
            if (Number(id1.replace ( /[^\d.]/g, '' )) < Number(id2.replace ( /[^\d.]/g, '' ))) {
                return id2;
            } 
            else {
                console.log('chosen: ' + id1);
                return id1;
            }
        }
    }
    
    function pickerDate(date,start) {
        var firstId, idScroller;
        firstId = getHigherId("month", date, start);
        ST.element("@"+firstId)
            .click();
        firstId = getHigherId("day", date, start);
        idScroller = Ext.ComponentQuery.query("pickerslot[_name=day]")[start].innerElement.up('div');
        // scroll to specified date => without scroller is unreliable selecting of day in pickerslot
        // without scrollIntoView it sometimes fails for mobile devices
        Ext.get(firstId).scrollIntoView(idScroller);
        Lib.waitOnAnimations();
        ST.element("@"+firstId)
            .click();
        firstId = getHigherId("year", date, start);
        ST.element("@"+firstId)
            .click()
            .and(function(){
                //removed code - not needed due to change Button.pickerOrder (JZ)
                var loc_button = Button.pickerOrder('Done',start);
                ST.element("@" + loc_button).click();
            });
        Lib.waitOnAnimations();
    }
    
    function enterText (field, text) {
        AddForm.textfield(field)
            // TODO can be removed when ORION-1669 is fixed
            //Orion issue workaround ORION-1666
            .down('>>input')
            .type(text);
            
        AddForm.textfield(field)
            .value(text)
            .and(function (textfield) {
                expect(textfield.getValue()).toBe(text);
            });
    }
    
    function editText (field, text) {
        EditForm.textEdit(field)
            .and(function (textfield) {
                textfield.setValue('');
            })
            // TODO can be removed when ORION-1669 is fixed
            //Orion issue workaround ORION-1666
            .down('>>textarea')
            .type(text);
            
        EditForm.textEdit(field)
            .value(text)
            .and(function (textfield) {
                expect(textfield.getValue()).toBe(text);
            });
    }
    
    function selectCalendar (type) {
        // Work Calendar => $dataIndex=0
        // Personal => $dataIndex=1
        // Project Zeus => $dataIndex=2
        var Cals = {'Work Calendar' : 0, 'Personal' : 1, 'Project Zeus' : 2},
            pId;

        AddForm.calendarPickerField()
            .click()
            .wait(function (field) {
                return field.getPicker();
            })
            .and(function (field) {
                pId = field.getPicker().getId();
                if (Lib.isPhone) {
                    Lib.ghostClick('#' + pId + ' simplelistitem[$dataIndex=' + Cals[type] + ']', true)
                }else{
                    ST.component('pickerslot:visible')
                        .and(function (cmp) {
                            var item = cmp.getItemAt(Cals[type]);
                            item = Ext.get(item);
                            cmp.scrollToItem(item);
                            ST.element(item)
                                .click();
                            ST.button('#' + pId + " button[_text='Done']").click();
                        });
                }
        });
        AddForm.textfield("calendarId")
            .and(function(textfield){
                expect(textfield.getSelection().get('title')).toBe(type);
            });
    }
    
    function setAllDay (allDay) {
        if (!allDay) {
            var idScroller;
            ST.element("calendar-form-add => div.x-scroller")
                .and(function (scroller){
                  idScroller = scroller.dom.children[0].children[0].children[0].id;
                });
            AddForm.checkbox()
                .and(function (checkbox) {
                    Ext.get(checkbox.id).scrollIntoView(idScroller);
                })
                .checked()
                .click()
                .unchecked()
                .and(function (checkbox) {
                    expect(checkbox._checked).toBeFalsy();
                });
        }
    }
    
    function findEvent (title, myDate) {
        var event = null;
            ST.panel("calendar-panel")
                .rendered()
                .and(function(){
                    if (Ext.ComponentQuery.query("calendar-event[_title='" + title +"']") == "" && myDate !== "") {
                        ST.element("calendar-monthview => td[data-date='" + myDate + "']>div>div")
                            .click()
                            .and(function(){
                                event = Ext.ComponentQuery.query("calendar-event[_title='" + title +"']")[0];
                                Lib.ghostClick("@" + event.id, true);
                            });
                    } else {
                        event = Ext.ComponentQuery.query("calendar-event[_title='" + title +"']")[0];
                        Lib.ghostClick("@" + event.id, true);
                    }
                });
    }
    
    function checkEvent (calendar, title, allDay, startDate, endDate, description) {
        it ("Event is found", function(){
            findEvent(title, dateToJSON(startDate));
        });
        if (calendar !== "") {
            it ("Event type is checked " + calendar, function(){
                checkText("calendarId", calendar);
            });
        }
        it ("Title is checked" + title, function(){
            checkText("title", title);
        });
        if (startDate !== "") {
            it("Start date is correct", function(){
                checkText("startDate", dateForForm(startDate));
            })
        }
        if (endDate !== "") {
            it("End date is correct", function(){
                if(allDay){
                    endDate.setDate(endDate.getDate() - 1);
                }
                checkText("endDate", dateForForm(endDate));
            })
        }
        if (allDay !== "") {
            it ("Is it all day?", function(){
                checkAllDay(allDay);
            });
        }
        if (description !== "") {
            it ("Description is checked "+description, function(){
                checkTextArea("description", description);
            });
        }
    }
    
    function checkText (field, text) {
        EditForm.textfield(field)
            .down(">>input")
            .textLike(text)
            .and(function (textfield) {
                expect(textfield.dom.value).toBe(text);
            });
    }
    
    function checkTextArea (field, text) {
        EditForm.textfield(field)
            .down(">>textarea")
            .textLike(text)
            .and(function (textfield) {
                expect(textfield.dom.value).toBe(text);
            });
    }
    
    function checkAllDay (state) {
        if (state) {
            EditForm.checkbox()
                .checked()
                .and(function (checkbox) {
                    expect(checkbox._checked).toBeTruthy();
                });
        } else {
            EditForm.checkbox()
                .unchecked()
                .and(function (checkbox) {
                    expect(checkbox._checked).toBeFalsy();
                });
        }
    }
    
    function editEvent (date, title, attribute, value) {
        describe('Event edit', function(){
            afterAll(function(){
                // ensure this is performed no matter what error is thrown during execution
                EditForm.form().and(function (form) {
                    if(form&&form.isVisible())form.onSaveTap();
                }).hidden();
            });
            it("Event is edited", function(){
                findEvent(title, dateToJSON(date));
                editText("description", value);
            });
        })

    }

     function checkMyEvent(event) {
         describe("Event is checked - " + event.title, function() {
             afterAll(function () {
                 EditForm.form().and(function (form) {
                     form.onCancelTap();
                 });
             });
             checkEvent(event.calendar, event.title, event.allDay, event.startDate, event.endDate, event.description);
         });
     }
    
    function moveEvent(title,oldDate) {
        if (ST.os.deviceType === "Desktop") {
            it("Move with event",function() {
                var event,calendar;
                var standardX = 10 || this.future.el.dom.offsetWidth / 2;
                var standardY = 10 || this.future.el.dom.offsetHeight / 2;
                ST.panel("calendar-panel")
                        .rendered()
                        .and(function(){
                            event = Ext.ComponentQuery.query("calendar-event[_title='" + title +"']")[0];
                            ST.element("@" + event.id)
                                .and(function(el){
                                    el.dom.style.display = 'block';
                                    calendar = Ext.ComponentQuery.query("calendar-monthview")[0];
                                    if (calendar.isComponent) {
                                        calendar = calendar.el;
                                    }
                                    ST.play([
                                        {type: "mousedown", target: el, x: standardX, y: standardY, detail: 1},
                                        {type: "mousemove", target: el, x: standardX + 30, y: standardY + 30, buttons: 1},
                                        {type: "mouseup", target: calendar, x: standardX + 30, y: standardY + 30, detail: 1},
                                    ]);
                                });
                        });
            });
            it ("Event is re-scheduled", function() {
                findEvent(title, "");
                EditForm.textfield("startDate")
                    .down(">>input")
                    .textNotLike(oldDate)
                    .and(function (textfield) {
                        expect(textfield.dom.value).not.toBe(oldDate);
                    });
                Lib.ghostClick("calendar-form-edit button[_text='Cancel']", true);
            })
        } else {
            // TODO: moving on mobile devices, it's highlty unreliable
            xit ("TODO: Re-scheduling of events via drag&drop on mobile devices");
        }
    }
    
    beforeAll(function(){
        // make sure you are on calendar panel page
        Lib.beforeAll("#calendar-panel"); 
    });

     afterAll(function () {
         Lib.afterAll("calendar-panel");
     });
    
    describe('Calendar correctly loaded', function() {
        it ("Calendar panel page correctly loaded", function() {
            ST.panel("calendar-panel")
                .visible()
                .and(function (page){
                    expect(page.rendered).toBeTruthy();
            });
        });
    });
    
    describe('Create events', function() {
        beforeAll(function () {
            Lib.clearCalendarStore("calendar-monthview");
        });

        // Work event
        it('Create Work event', function(){
            Lib.addEventToCalendarStore('calendar-monthview', eventWork);
        });
        it('Create Personal event', function(){
            Lib.addEventToCalendarStore('calendar-monthview', eventPersonal);
        });
        it('Create Zeuse project event', function(){
            Lib.addEventToCalendarStore('calendar-monthview', eventZeus);
        });

        checkMyEvent(eventWork);
        checkMyEvent(eventPersonal);
        checkMyEvent(eventZeus);

        // TODO can be removed when ORION-1669 is fixed
        // Not creating events via button but doing that only programatically
        // closing event windows when not clicked on button properly
        /*createEventViaButton(eventWork.calendar, eventWork.title, eventWork.startDate, eventWork.endDate,
            eventWork.allDay, eventWork.description, true);
        // Personal event
        createEventViaButton(eventPersonal.calendar, eventPersonal.title, eventPersonal.startDate, eventPersonal.endDate,
            eventPersonal.allDay, eventPersonal.description, true);
        // Zeus event
        createEventViaButton(eventZeus.calendar, eventZeus.title, eventZeus.startDate, eventZeus.endDate,
                                eventZeus.allDay, eventZeus.description, true);*/
    });
    
    describe('Events ' + eventWork.calendar + ' are editable', function() {
        beforeAll(function () {
            Lib.clearCalendarStore("calendar-monthview");
            Lib.addEventToCalendarStore('calendar-monthview', eventWork);
        });
        editEvent (eventWork.startDate, eventWork.title, "description", 'changed description');
        checkMyEvent({
            calendar: 'Work Calendar',
            calendarId : 1,
            title:'Title - Work event',
            allDay: false,
            description:'changed description',
            startDate: getToday(1),
            endDate: getToday(1),
            startTime: '',
            endTime: ''
        });
    });
    
    describe('Events ' + eventPersonal.calendar + ' are moveable', function() {
        beforeAll(function () {
            Lib.clearCalendarStore("calendar-monthview");
            Lib.addEventToCalendarStore('calendar-monthview', eventWork);
        });
        afterAll(function () {
            EditForm.form().and(function (form) {
                form.onCancelTap();
            });
        });
        //createEventViaButton (eventWork.calendar, eventWork.title, "", "", "", "", false);
        moveEvent (eventWork.title,dateForForm(getToday(0)));
    });
    
 });
