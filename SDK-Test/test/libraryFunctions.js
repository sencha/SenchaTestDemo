
/**
 * important variable for easily setting data for functions working with buttons
 * @type {{panel: Components.panel, panelRegex: Components.panelRegex, splitButton: Components.splitButton, button: Components.button, menuitem: Components.menuitem}}
 */
var Components = {
    panel: function(panelTitle){
        return 'panel[title=' + panelTitle + ']';
    },

    panelRegex: function(textStarts, textEnds){
        textEnds = textEnds||'';
        return 'panel[title^=' + textStarts + '][title$=' + textEnds + ']';
    },

    splitButton : function (text,order)  {
        order = order||1;
        return 'splitbutton[text=' + text + ']:nth-child(' + order + ')';
    },

    button : function (text,order)  {
        order = order||1;
        return 'button[text=' + text + ']:nth-child(' + order + ')';
    },

    menuitem : function (text,order)  {
        order = order||1;
        return 'menuitem[text=' + text + ']:nth-child(' + order + ')';
    },

    menuradioitem : function (text,order) {
        order = order||1;
        return 'menuradioitem[text=' + text + ']:nth-child(' + order + ')';
    },

    menucheckitem : function (text,order) {
        order = order||1;
        return 'menucheckitem[text=' + text + ']:nth-child(' + order + ')';
    },

    hamburgerButton : function (iconCls,order)  {
        order = order||1;
        return 'button[@iconCls=' + iconCls + ']:nth-child(' + order + ')';
    },

    treeListItem : function (treelistItemName,order)  {
        order = order||1;
        return 'treelistitem[text=' + treelistItemName + ']:nth-child(' + order + ')';
    },

    calendarEventTitle : function(eventName) {
        return '//span[@class = "x-calendar-event-title" and text() = "' + eventName + '"]';
    },

    calendarEventHandle : function(eventName) {
        return '//span[text() = "' + eventName + '"]/following-sibling::div[@class = "x-calendar-event-resizer"]';
    },

    calendarHourIndex: function(day, hour) {
        return "//td[@class='x-calendar-days-day-column' and @data-index='" + day + "']//div[@class='x-calendar-days-marker'][" + hour + "]";
    },

    calendarAllDay: function(day) {
        return "//table[@class='x-calendar-days-table x-calendar-days-allday-events']/tbody/tr[2]/td[" + day + "]";
    },

    calendarDay: function(year, month, day) {
        return '//td[contains(@data-date, "' + year  + '-' + month + '-' + day + '")]';
    },

    calendarGetEventStartTime : function(eventName) {
        return '//span[text() = "' + eventName + '"]/preceding-sibling::div[@class="x-calendar-event-time"]/span[1]';
    },

    calendarGetEventEndTime : function(eventName) {
        return '//span[text() = "' + eventName + '"]/preceding-sibling::div[@class="x-calendar-event-time"]/span[3]';
    },

    trigger : function (element) {
        return element + ' => div.x-expandtrigger';
    }
};

/**
 * text lorem ipsum
 * @type {string}
 */
var innerText = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore" +
    " et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea" +
    " commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla" +
    " pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";



//------------------------------------------------functions-------------------------------------------------------//

/**
 * Object of all library functions
 * @type {{testButtons: Lib.testButtons, testCheckButtons: Lib.testCheckButtons, ...}}
 */
var Lib = {

    /**
     * function for setting delay and redirecting for all charts
     * @param redirectName
     * @param componentToBeVisible - optional
     * @param delay - optional
     * @param typeApp - optional - defaultValue is "KitchenSink"
     */
    beforeAll: function(redirectName, componentToBeVisible, delay, typeApp){
        delay = delay || 250;
        ST.options.eventDelay = delay;

        typeApp = typeApp || "ks";
        if(typeApp == "admin" || typeApp == "Admin") {
            Admin.app.redirectTo(redirectName);
        }
        else if(typeApp === "KitchenSink" || typeApp === "kitchensink" || typeApp === "KS" || typeApp ==="ks"){
            KitchenSink.app.redirectTo(redirectName);
        }

        if(componentToBeVisible){
            //wait for chart to has non-zero width
            if(componentToBeVisible === 'chart' || componentToBeVisible === 'panel polar'){
                ST.component(componentToBeVisible)
                    .visible()
                    .and(function(ch){
                        ST.component('#' + ch.el.id + '-main')
                            .wait(function (c) {
                                return c.el.dom.clientWidth > 0;
                            })
                    })
            }
            else{
                return ST.component(componentToBeVisible).visible();
            }

        }
    },

    /**
     * function for destroy component after test + setting delay back to default value
     * @param componentNameToDestroy
     */
    afterAll: function(componentNameToDestroy){
        ST.options.eventDelay = 500;
        Ext.first(componentNameToDestroy).destroy();
        // ST.component(componentNameToDestroy)
        //     .and(function (cmp) {
        //         cmp.destroy();
        //     });
        var msgBox = Ext.ComponentQuery.query('messagebox');
        for(var i = 0; i< msgBox.length;i++){
            Ext.first('#'+msgBox[i].getId()).hide();
            ST.component('#'+msgBox[i].getId())
                // .and(function (msgbox) {
                //     msgbox.hide();
                // })
                .hidden();
        }
    },

    /**
     * function for clicking Buttons who disappears after click
     * @param loc - locator for target element
     * @param forDesktopToo - even for desktop is provided mousedown + mouseup without click
     */
    ghostClick: function (loc, forDesktopToo) {
        
        forDesktopToo = forDesktopToo || false;
        var fieldForPlay = [
            {type: "mousedown", target: loc,  detail: 1},
            {type: "mouseup", target: loc,  detail: 1}
        ];

        if(Ext.platformTags.desktop && !forDesktopToo){
            fieldForPlay.push({type: "click", animation: false, delay: 0, target: loc,  detail: 1})
        }

        ST.play(fieldForPlay);
    },

    /**
     * function for testing source code view
     * @param codeText - unique source code text for respective example, e.g.: title of example[BasicList]
     */
    sourceClick: function (codeText) {
        pending('due to EXTJS-23893');
        var oldDelay,
            delay = 500;

        if (Lib.isPhone){
            var platform = "titlebar";
            var name = 'View Source';
            oldDelay = ST.options.eventDelay;
            ST.options.eventDelay = delay;

            ST.component("titlebar button[action=burger]{isVisible()}")
                .click();
            ST.component("button[_text='View Source']{isVisible()}").click();
            ST.component("sourceoverlay")
                .wait(function(overlay) {
                    var text = overlay.el.dom.textContent;
                    return overlay.isVisible()&&text.indexOf(codeText)>=0;
                })
                .and(function(overlay) {
                    expect(overlay.el.dom.textContent).toContain(codeText);
                });
            ST.component("sourceoverlay button[action=closeSource]").click();
            ST.component("sourceoverlay").hidden();
            ST.options.eventDelay = oldDelay;


        } else if (Lib.isDesktop) {
            //check if source panel is visible or collapsed
            if(Ext.first('sourceoverlay[_top=0]')){
                //and expand it if it's collapsed
                ST.component("button[action=viewSource]{isVisible()}")
                    .click();
            }
            ST.component("button[action=viewSource]{isVisible()}")
                .click();
            ST.element("sourceoverlay")
                .wait(function (overlay) {
                    //sometimes '0px' is represents as '' (JZ)
                    return (overlay.dom.style.right != "0px") && (overlay.dom.style.right != '');
                })
                .and(function(overlay) {
                    expect(overlay.dom.style.right).not.toBe("0px");
                    expect(overlay.dom.style.right).not.toBe('');
                });
            ST.component("button[action=viewSource]{isVisible()}")
                .click();
            ST.element("sourceoverlay")
                .wait(function (overlay) {
                    //sometimes '0px' is represents as '' (JZ)
                    return (overlay.dom.style.right === "0px") || (overlay.dom.style.right === '');
                })
                .wait(function(overlay) {
                    var text = overlay.dom.textContent;
                    return overlay.isVisible()&&text.indexOf(codeText)>=0;
                })
                .and(function(overlay) {
                    var zeroPixels = overlay.dom.style.right;
                    if(zeroPixels === ''){
                        zeroPixels = "0px";
                    }
                    expect(zeroPixels).toBe("0px");
                    expect(overlay.dom.textContent).toContain(codeText);
                });

        } else if (Lib.isTablet) {

            ST.component("button[action=viewSource]{isVisible()}")
                .click();
            ST.element("sourceoverlay")
                .wait(function (overlay) {
                    return (overlay.dom.style.right === "0px") || (overlay.dom.style.right === '');
                })
                .wait(function(overlay) {
                    var text = overlay.dom.textContent;
                    return overlay.isVisible()&&text.indexOf(codeText)>=0;
                })
                .and(function(overlay) {
                    var zeroPixels = overlay.dom.style.right;
                    if(zeroPixels === ''){
                        zeroPixels = "0px";
                    }
                    expect(zeroPixels).toBe("0px");
                    expect(overlay.dom.textContent).toContain(codeText);
                });
            ST.component("button[action=viewSource]{isVisible()}")
                .click();
            ST.element("sourceoverlay")
                .wait(function (overlay) {
                    return (overlay.dom.style.right != "0px") && (overlay.dom.style.right != '');
                })
                .and(function(overlay) {
                    var zeroPixels = overlay.dom.style.right;
                    if(zeroPixels === ''){
                        zeroPixels = "0px";
                    }
                    expect(zeroPixels).not.toBe("0px");
                    expect(overlay.dom.style.right).not.toBe('');
                });
        }

    },

    /**
     * function for using XPath to find element
     * @param query - XPath query in string e.g. "//div[contains(@class, header)]/button"
     */

    xpath: function (query){
        var result = document.evaluate(query, document.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return result;
    },

    /**
     * screenshot centralized here for case that API change again...
     * @param desc name of created screenshot
     * @param tolerance optional diff in percentage, default value is 1.5%
     * @param shouldFail optional true if screenShot should be different, default value is false
     */
    screenshot: function(desc, tolerance, shouldFail){

        //mute screenshots
        return;

        tolerance = tolerance || 1.5;

        var delay;
        var tolerance_in_pixels;
        var clientWidth;
        var clientHeight;
        //disable visual feedback for this one
        ST.component('viewport')
            .and(function(){
                ST.options.visualFeedback = false;
                //save event delay
                delay = ST.options.eventDelay;
                //set it to 1000
                ST.options.eventDelay = 1000;
            })
            //recounting pixels to percentage
            .and(function(viewport){
                clientHeight = viewport.clientHeight;
                clientWidth = viewport.clientWidth;
                tolerance_in_pixels = clientHeight * clientWidth * tolerance * 0.01;
            });

        //let's wait little be more to be sure, that screenshot are done when example is stable
        //it is that much because of ORION-1017 - so there is wait for possible unfinished action and - this is most important here - for hidden red dot from cursor
        ST.wait(2000);


        ST.component('viewport')
            .and(function(){
                //need to be tested on server
                ST.screenshot(desc, tolerance_in_pixels);
                //I saw red dot in screenshot which should be visible AFTER screenshot, so I am giving wait after screenshot too. Red dot is little bit pain in the ass
                ST.wait(1000);
                //if screenshot should fail, ST.expectFailure will be provided
                if(shouldFail){
                    ST.expectFailure(['/^Expected screenshot (\s|\S)* to match baseline\.$/g']);
                }
            })
            .and(function(){
                //let's go back
                ST.options.eventDelay = delay;

                //enable at the end again
                ST.options.visualFeedback = true;
            });

    },

    /**
     * function for testing Buttons
     * has to have defined variable Components.button
     * need function 'clickAndCheckButtonsCls'
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param button - if Button has Text on it, it should be provided here, or you can use 'null' if button have not a text
     * @param order - if you have more than one button of same name (it could be null), order >= 1 specified the button. It is optional parameter
     * @param messageBox - if you need to check, if messageBox was fired, provide text of the message
     */
    testButtons: function (panelText, button, order, messageBox, offsetQuery) {
        var desc = 'When click on ' + order + '. button with text ' + button;
        if (order === undefined) {
            desc = 'When click on ' + button + ' button';
        }
        if(messageBox !== undefined){
            desc += ' and check message box'
        }
        desc += ST.isModern?' cls contains x-pressing':' cls contains x-btn-pressed';
        desc = desc.replace("text null", "no text");
        desc = desc.replace('null', '');
        it(desc, function () {
            var button1 = Components.button(button, order);
            if(Lib.isPhone && offsetQuery) {
                var offset = null;
                ST.wait(function(){
                        return Ext.first(offsetQuery) !== null;
                    })
                    .and(function(){
                        offset = Ext.first(offsetQuery).el.dom.offsetTop;
                    });
                ST.component(panelText).and(function (example) {
                    offset += Ext.first(button1).el.dom.offsetTop;
                    example.getScrollable().scrollTo(0, offset);
                });
            }
            clickAndCheckButtonsCls(panelText, button1, messageBox);
        });
    },

    /**
     * function for testing Buttons - Deprecated!!!
     */
    testTabButtons: function (panelText, button, order, messageBox){
        this.testButtons(panelText, button, order, messageBox);
    },

    /**
     * function for testing CheckButtons (x-menu-item-active; x-menu-item-checked / x-menu-item-unchecked)
     * has to have defined variable Components.menuitem
     * need function 'testMenuItemProcedure'
     * browser has to have focus for passing this test
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param button - if Button has Text on it, it should be provided here, or you can use 'null' if button have not a text
     * @param shouldBeCheckedAfter - if button should be checked after click on it or no - takes true / false
     * @param order - if you have more than one button of same name (it could be null), order >= 1 specified the button. It is optional parameter
     * @param buttonAfter - if Button has different Text after click on it, it should be provided here. It is optional parameter
     * @param order2 - if you have more than one buttonAfter of same name (it could be null), order >= 1 specified the buttonAfter. It is optional parameter
     * @param messageBox - if you need to check, if messageBox was fired, provide text of the message
     */
    testCheckButtons: function (panelText, button, shouldBeCheckedAfter, order, buttonAfter, order2, messageBox) {
        var desc = 'Cls contains x-menu-item-active when click on ' + order + '. checkbutton with text ' + button;
        if (order === undefined) {
            desc = 'Cls contains x-menu-item-active when click on checkbutton ' + button;
        }

        if(messageBox !== undefined){
            desc += ' and check message box'
        }
        desc = desc.replace("text null", "no text");
        desc = desc.replace('null', '');
        //check if is active when click on it
        it(desc, function () {
            var button1 = Components.menuitem(button, order);
            testMenuItemProcedure(panelText, button1, messageBox);
        });

        //check if check or uncheck after click on it
        if (shouldBeCheckedAfter) {
            desc = desc.replace('x-menu-item-active', 'x-menu-item-checked');
        }
        else {
            desc = desc.replace('x-menu-item-active', 'x-menu-item-unchecked');
        }
        it(desc, function () {
            var button2 = Components.menuitem(button, order);
            if (buttonAfter !== undefined) {
                button2 = Components.menuitem(buttonAfter, order);
            }
            ST.element(button2)
                .and(function (button, done) {
                    if (shouldBeCheckedAfter) {
                        expect(button.dom.className).toContain('x-menu-item-checked');
                    }
                    else {
                        expect(button.dom.className).toContain('x-menu-item-unchecked');
                    }
                    done();
                });
        })
    },

    /**
     * function for testing orderable parameter in buttons
     * has to have defined variable Components.button
     * need function 'justMoveButton'
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param button - if Button has Text on it, it should be provided here, or you can use 'null' if button have not a text
     * @param moveX - how much could be button moved? Give a number or nothing - it is optional parameter
     * @param order - if you have more than one button of same name (it could be null), order >= 1 specified the button. It is optional parameter
     */
    moveButtons: function (panelText, button, moveX, order) {
        var desc = 'Move and check order of ' + order + '. button with text ' + button;
        if (order === undefined) {
            desc = 'Move and check order of button ' + button;
        }
        desc = desc.replace("text null", "no text");
        desc = desc.replace('null', '');
        it(desc, function () {
            var button1 = Components.button(button, order);
            button1 = panelText + ' ' + button1;
            var buttonCurrentOrder = 1;
            //1 === to the right, -1 === to the left
            var direction = 1;
            //check and go there
            ST.component(button1)
                .and(function (button_function, done) {
                    var allButtons = Ext.ComponentQuery.query(panelText + ' button');
                    var index = 0;
                    //test for button order
                    for (var i = 0; i < allButtons.length; i++) {
                        if (allButtons[index].text === button) {
                            buttonCurrentOrder = index;
                            if (index === allButtons.length - 1) {
                                direction = -1;
                            }
                            ST.button(allButtons[index + direction]).and(function (btn) {
                                if (moveX === undefined) {
                                    moveX = btn.el.dom.offsetWidth;
                                }
                                justMoveButton(button1, 30, moveX, direction);
                            });
                            break;
                        }
                        index++;
                    }
                    done();
                });
            //check and go back
            ST.component(button1)
                .and(function (button_function, done) {
                    var allButtons = Ext.ComponentQuery.query(panelText + ' button');
                    var index = 0;
                    //test for button order
                    for (var i = 0; i < allButtons.length; i++) {
                        if (allButtons[index].text === button) {
                            if (button_function.reorderable || button_function.reorderable === undefined) {
                                expect(buttonCurrentOrder).not.toBe(index);
                                ST.button(allButtons[index - direction]).and(function (btn) {
                                    if (moveX === undefined) {
                                        moveX = btn.el.dom.offsetWidth;
                                    }
                                    justMoveButton(button1, 30, moveX, direction * (-1));
                                });
                            }
                            else {
                                expect(buttonCurrentOrder).toBe(index);
                            }
                            break;
                        }
                        index++;
                    }
                    done();
                });
        });
    },

    /**
     * function for swipe element to given direction
     * @param element - eg.: panel[title=Title] or panel[@componentCls=x-panel]
     * @param direction - '1' means, that panel is moving in positive way, '-1' means, that panel is moving in negative way
     * @param verticalMove - optional parameter - set 'true' if move should be vertical ↑↓
     */
    swipeElement: function(element, direction, verticalMove) {
        var side = 'horizotaly';
        if(verticalMove){
            side = 'verticaly';
        }
        var directionString = 'positive';
        if(direction == -1){
            directionString = 'negative';
        }
        it('Swipe ' + element + ' to the ' + side + ' in a ' + directionString + ' way', function () {
            justSwipe(element, direction, verticalMove);
        });
    },

    /**
     * function for swipe calendar element in Modern toolkit
     * @param calendar - eg.: calendar-day or calendar-week
     * @param movement - amount and direction of movement. Eg.: -200 or 200 for left or right move
     */
    swipeCalendar: function(calendar, movement){
        var origin_day;

        ST.element(calendar)
            .wait(1000)
            .and(function (el) {
                origin_day = Ext.ComponentQuery.query("#ext-component-1")[0]._html;
                var standardX = el.dom.offsetWidth / 4;
                var standardY = el.dom.offsetHeight / 4;
                ST.play([
                    {type: "touchstart", target: el, x: standardX, y: standardY},
                    {type: "touchend", target: el, x: standardX +movement, y: standardY}
                ]);
            })
            .and(function () {
                var previous_day = Ext.ComponentQuery.query("#ext-component-1")[0]._html;
                expect(previous_day !== origin_day).toBe(true);
            });
    },

    /**
     *    function for remove calendar event from calendar with given viewXpath
     *    WARNING: Method is waiting for Store to be empty, it may cause test failure if you try to clear store which is already empty
     *    @param viewXpath {string} - xpath of the calendar component. Usually calendar-weekview or calendar-monthview
     */
    clearCalendarStore: function(viewXpath){
        ST.component(viewXpath)
            .wait(function(calendar) {
                return calendar && calendar.getEventSource().data.length > 0;
            })
            .and(function(calendar) {
                var calendarCount = calendar.getStore().getData().length;
                for (i = 0; i < calendarCount; i++) {
                    calendar.getStore().getData().getAt(i).events().removeAll();
                }
            });
    },

    /**
     *    function for adding calendar event to calendar store with given viewXpath and refresh caledar view
     *    @param viewXpath {string} - xpath of the calendar component. Usually calendar-weekview or calendar-monthview
     *    @param calendarId {number} - id of calendar. Usually there are 2 types of events distinguished by color, indexed from 1
     *    @param title {string} - title for calendar event
     *    @param startDate {date} - date indicating start of the calendar event in UTC format
     *    @param endDate {date} - date indicating end of the calendar event in UTC format
     *    @param allDay {boolean} - is calendar event all day event? WARNING: you need to set endDate to day after startDay
     */
    addEventToCalendarStore: function(viewXpath, calendarId, title, startDate, endDate, allDay, description){
        allDay = allDay||0;
        var eventModelConfig;

        ST.component(viewXpath)
            .wait(function(cal){
                var calStore = cal.getStore();
                return calStore.isLoaded() && !calStore.isLoading() && calStore.getById(1) && calStore.getById(1)._eventStore.isLoaded();
            })
            .and(function (cal) {
                //allow using config object
                if(typeof calendarId !== 'number'){
                    eventModelConfig = calendarId;
                    if(calendarId.allDay){
                        eventModelConfig.endDate.setDate(calendarId.endDate.getDate() + 1);
                    }
                }else{
                    eventModelConfig = {
                        calendarId: calendarId,
                        title: title,
                        startDate: startDate,
                        endDate: endDate,
                        allDay: allDay,
                        description : description
                    }
                }
                var store = cal.getStore(),
                    calId = eventModelConfig.calendarId || 1,
                    EventModel = store.getById(calId)._eventStore.getModel(),
                    newEvent;
                var curDate = new Date();

                // default config
                var config = {
                    "calendarId": calId,
                    "startDate": curDate.toISOString(),
                    "endDate": Ext.Date.add(curDate,Ext.Date.DAY,1).toISOString(),
                    "title": "No event title",
                    "description": "You did not fill event description"
                };
                config = Ext.apply(config,eventModelConfig);
                newEvent = new EventModel(config);
                store.getById(calId)._eventStore.add(newEvent);
            });
    },

    /**
     * function for moving panel to all direction and test its position while doing so - →←↓↑
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param moveLength - how much should be panel moved →←↓↑
     * @param onlyHorizontal - optional parameter - set 'true' if panel should move only horizontaly
     */
    movePanelComplex: function(panelText, moveLength, onlyHorizontal){
        var startPosition = 30;
        it(panelText + ' is moving ' + moveLength + ' to the right (checkPosition before and after move)', function () {
            justMovePanel(panelText, startPosition, moveLength, 1);
        });
        it(panelText + ' is moving ' + moveLength + ' back to the left (checkPosition before and after move)', function () {
            justMovePanel(panelText, startPosition, moveLength - startPosition, -1);
        });
        if(!onlyHorizontal) {
            it(panelText + ' is moving ' + moveLength + ' down (checkPosition before and after move)', function () {
                justMovePanel(panelText, startPosition, moveLength, 1, true);
            });
            it(panelText + ' is moving ' + moveLength + ' back up (checkPosition before and after move)', function () {
                justMovePanel(panelText, startPosition, moveLength - startPosition, -1, true);
            });
        }
    },

    /**
     * function for moving panel to specific direction and test its position after that
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param moveLength - how much should be panel moved →←↓↑
     * @param direction - '1' means, that panel is moving in positive way, '-1' means, that panel is moving in negative way
     * @param startPosition - optional parameter - value with start position in moving direction
     * @param verticalMove - optional parameter - set 'true' if move should be vertical ↑↓
     */
    movePanel: function(panelText, moveLength, direction, startPosition, verticalMove) {
        if (startPosition === undefined) {
            startPosition = 30;
        }
        var side = 'horizotaly';
        if(verticalMove){
            side = 'verticaly';
        }
        var directionString = 'positive';
        if(direction == -1){
            directionString = 'negative';
            moveLength -= startPosition;
        }
        it(panelText + ' is moving ' + moveLength + ' ' + side + ' in a ' + directionString + ' way, position is checked before and after move', function () {
            justMovePanel(panelText, startPosition, moveLength, direction, verticalMove);
        });
    },

    /**TODO
     * function for moving panel to all direction and test its position while doing so - →←↓↑
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param moveLength - how much should be panel moved →←↓↑
     * @param onlyHorizontal - optional parameter - set 'true' if panel should move only horizontaly
     */
    resizePanelComplex: function(panelText, moveLength, onlyHorizontal){
        it(panelText + ' is resizing ' + moveLength + ' to the right (checkPosition before and after)', function () {
            justResizePanel(panelText, moveLength, 1);
        });
        it(panelText + ' is resizing ' + moveLength + ' back to the left (checkPosition before and after)', function () {
            justResizePanel(panelText, moveLength, -1);
        });
        if(!onlyHorizontal) {
            it(panelText + ' is resizing ' + moveLength + ' down (checkPosition before and after)', function () {
                justResizePanel(panelText, moveLength, 1, true);
            });
            it(panelText + ' is resizing ' + moveLength + ' back up (checkPosition before and after)', function () {
                justResizePanel(panelText, moveLength, -1, true);
            });
        }
    },
    /**TODO
     * function for moving panel to specific direction and test its position after that
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param moveLength - how much should be panel moved →←↓↑
     * @param direction - '1' means, that panel is moving in positive way, '-1' means, that panel is moving in negative way
     * @param verticalMove - optional parameter - set 'true' if move should be vertical ↑↓
     */
    resizePanel: function(panelText, moveLength, direction, verticalMove) {
        var side = 'horizotaly';
        if(verticalMove){
            side = 'verticaly';
        }
        var directionString = 'positive';
        if(direction == -1){
            directionString = 'negative';
        }
        it(panelText + ' is resizing ' + moveLength + ' ' + side + ' in a ' + directionString + ' way, position is checked before and after.', function () {
            justResizePanel(panelText, moveLength, direction, verticalMove);
        });
    },

    /**
     * function for testing tooltips on button
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param button - if Button has Text on it, it should be provided here, or you can use 'null' if button have not a text
     * @param tooltip - text of tooltip
     * @param order - if you have more than one button of same name (it could be null), order >= 1 specified the button. It is optional parameter
     */
    checkTooltips: function (panelText, button, tooltip, order) {
        var desc = 'Click on tooltip (@ext-quicktips-tip-innerCt) on ' + order + '. button with text ' + button;
        if (order === undefined) {
            desc = 'Check tooltip (@ext-quicktips-tip-innerCt) of ' + button;
        }
        desc = desc.replace("text null", "no text");
        desc = desc.replace('null', '');
        it(desc, function () {
            var button1 = Components.button(button, order);
            checkTooltipsProcedure(panelText, button1, tooltip);
        });
    },

    /**
     * function for testing SplitButtons
     * has to have defined variable Components.splitButton and Components.menuitem
     * browser has to have focus for passing this test
     * need function 'clickAndCheckButtonsCls'
     * need function 'testMenuItemProcedure'
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param button - if Button has Text on it, it should be provided here, or you can use 'null' if button have not a text
     * @param menuItem - text of menuItem - for example'Menu Item 1'
     * @param isBig - true if button is Big, optional parameter
     * @param order - if you have more than one button of same name (it could be null), order >= 1 specified the button. It is optional parameter
     * @param messageBox - if you need to check, if messageBox was fired, provide text of the message
     * @param messageBoxItem - if you need to check, if messageBox was fired, provide text of the item message
     */
    testSplitButtons: function (panelText, button, menuItem, isBig, order, messageBox, messageBoxItem) {
        var desc = 'When click on ' + order + '. button with text ' + button;
        if (order === undefined) {
            desc = 'When click on ' + button + ' button';
        }
        if((messageBox !== undefined) || (messageBoxItem !== undefined)){
            desc += ', check message box'
        }
        desc += ' cls contains x-btn-pressed and menuItem contains x-menu-item-active';
        desc = desc.replace("text null", "no text");
        desc = desc.replace('null', '');
        it(desc, function () {
            var button1 = Components.splitButton(button, order);
            clickAndCheckButtonsCls(panelText, button1, messageBox);
            ST.component(panelText + ' ' + button1).and(function (component) {
                if (isBig) {
                    //doesn't work on Safari 7 and Safari 8 - bug: https://sencha.jira.com/browse/ORION-147
                    ST.element('@' + component.id + '-arrowEl')
                        .click(0, 75) //75 for arrows on the bottom of the big buttons
                        .and(function () {
                            testMenuItemProcedure(panelText, Components.menuitem(menuItem), messageBoxItem);
                        })
                }
                else {
                    ST.element('@' + component.id + '-arrowEl')
                        .and(function () {
                            clickOnSomething('@' + component.id + '-arrowEl');
                        })
                        .and(function () {
                            testMenuItemProcedure(panelText, Components.menuitem(menuItem), messageBoxItem);
                        })
                }
            });
        });
    },

    /**
     * function for testing MenuButtons
     * browser has to have focus for passing this test
     * has to have defined variable Components.menuitem
     * has to have defined variable Components.button
     * need function 'testMenuItemProcedure'
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param button - if Button has Text on it, it should be provided here, or you can use 'null' if button have not a text
     * @param menuItem - text of menuItem - for example'Menu Item 1'
     * @param order - if you have more than one button of same name (it could be null), order >= 1 specified the button. It is optional parameter
     * @param messageBoxItem - if you need to check, if messageBox was fired, provide text of the item message
     */
    testMenuButton: function (panelText, button, menuItem, order, messageBoxItem) {
        var desc = 'Cls contains x-menu-item-active when click on menuItem in ' + order + '. menuButton with text ' + button;
        if (order === undefined) {
            desc = 'Cls contains x-menu-item-active when click on menuItem in menuButton ' + button;
        }
        if(messageBoxItem !== undefined){
            desc += ' and check message box'
        }
        desc = desc.replace("text null", "no text");
        desc = desc.replace('null', '');
        it(desc, function () {
            var button1 = Components.button(button, order);
            //clickAndCheckButtonsCls(panelText, button1);
            ST.component(panelText + ' ' + button1)
            // .and(function () {
            //     clickOnSomething(panelText + ' ' + button1);
            // })
                .click()
                .and(function () {
                    testMenuItemProcedure(panelText, Components.menuitem(menuItem), messageBoxItem);
                })
        });
    },

    /**
     * function for testing menuItems inside menu
     * browser has to have focus for passing this test
     * need function 'testMenuItemProcedure'
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param menuItem - text of menuItem - for example'Menu Item 1'
     * @param messageBox - if you need to check, if messageBox was fired, provide text of the message
     */
    testMenuItem: function (panelText, menuItem, messageBox) {
        desc = 'Cls contains x-menu-item-active when click on menuItem ' + menuItem;
        if (panelText != null && panelText != undefined) {
            desc += ' in panel ' + panelText;
        }
        if(messageBox !== undefined){
            desc += ' and check message box'
        }
        it(desc, function () {
            testMenuItemProcedure(panelText, menuItem, messageBox);
        });
    },

    /**
     * function for testing menuItems inside menu and choosing color
     * browser has to have focus for passing this test
     * need function 'testMenuItem' and 'clickOnSomething'
     * @param panelText - eg.: panel[title=Title] or panel[@componentCls=x-panel]; use variable Component.panel or Component.panelRegex
     * @param menuItem - text of menuItem - for example'Menu Item 1'
     * @param messageBox - if you need to check, if messageBox was fired, provide text of the message
     */
    testMenuItemChooseColor: function (panelText, menuItem, messageBox) {
        this.testMenuItem(panelText, menuItem);

        desc = 'Cls contains x-color-picker-selected for randomly chosen color on menuItem ' + menuItem;
        if (panelText != null && panelText != undefined) {
            desc += ' in panel ' + panelText;
        }
        if(messageBox !== undefined){
            desc += ' and check message box'
        }
        it(desc, function () {
            var button1 = menuItem;
            if (panelText !== null) {
                button1 = panelText + ' ' + menuItem;
            }
            clickOnSomething(button1);
            ST.component('colorpicker')
                .and(function (picker) {
                    var randNumber = Math.floor((Math.random() * 39) + 1);
                    if(messageBox === undefined) {
                        ST.element('@' + picker.getId() + '/a[' + randNumber + ']')
                            .click()
                            .and(function (oneColorSquare) {
                                expect(oneColorSquare.dom.className).toContain('x-color-picker-selected');
                            });
                    }
                    else{
                        ST.play([
                            { type: "click", target: '@' + picker.getId() + '/a[' + randNumber + ']'},
                            { animation: null, delay: 1000, target: "@msg-div", fn: function (done) {
                                expect(this.targetEl.dom.textContent).toMatch(messageBox);
                                ST.element('@' + picker.getId() + '/a[' + randNumber + ']')
                                    .and(function (oneColorSquare) {
                                        expect(oneColorSquare.dom.className).toContain('x-color-picker-selected');
                                    });
                                done();
                            }}
                        ]);
                    }
                })
        });
    },

    /**
     * function for testing if panel is visible and rendered
     * has to have defined variable Components.panel
     * @param panelTitle text of panel title
     */
    panelRendered: function (panelTitle) {
        it('Panel with title ' + panelTitle + ' is visible and rendered', function () {
            ST.component(Components.panel(panelTitle))
                .visible()
                .and(function (page) {
                    expect(page.rendered).toBeTruthy();
                });
        });
    },

    /**
     * function for testing if panel is visible and rendered
     * has to have defined variable Components.panel
     * @param textStarts text of first few chars of panel title
     * @param textEnds text of last few chars of panel title
     */
    panelRenderedRegex: function (textStarts, textEnds) {
        it('Panel ' + textStarts + ' ... ' + textEnds + ' is visible and rendered', function () {
            ST.component(Components.panelRegex(textStarts, textEnds))
                .visible()
                .and(function (page) {
                    expect(page.rendered).toBeTruthy();
                });
        });
    },

    /**
     * function for testing if panel has text lorem ipsum (defined in variable innerText) or has provided textInPanel
     * has to have defined variable Components.panel
     * has to have defined variable innerText
     * @param panelTitle - text of panel title
     * @param textInPanel - text that should be inside panel - optional parameter
     */
    textInPanel: function (panelTitle, textInPanel) {
        if (textInPanel === undefined) {
            textInPanel = innerText;
        }
        var desc = 'Panel \'' + panelTitle + '\' has text \'' + textInPanel.substring(0, 11) + '...\'';
        it(desc, function () {
            ST.component(Components.panel(panelTitle))
                .and(function (page) {
                    //FF 38 don't support innerText
                    expect(page.body.dom.innerHTML).toContain(textInPanel);
                });
        });
    },

    /**
     * function for testing if panel has text lorem ipsum (defined in variable innerText) or has provided textInPanel
     * has to have defined variable Components.panel
     * has to have defined variable innerText
     * @param textStarts text of first few chars of panel title
     * @param textEnds text of last few chars of panel title
     * @param textInPanel - text that should be inside panel - optional parameter
     */
    textInPanelRegex: function (textStarts, textEnds, textInPanel) {
        if (textInPanel === undefined) {
            textInPanel = innerText;
        }
        var desc = 'Panel \'' + textStarts + ' ... ' + textEnds + '\' has text \'' + textInPanel.substring(0, 11) + '...\'';
        it(desc, function () {
            ST.component(Components.panelRegex(textStarts, textEnds))
                .and(function (page) {
                    //FF 38 don't support innerText
                    expect(page.body.dom.innerHTML).toContain(textInPanel);
                });
        });
    },

    /**
     * Choose whole date
     * @param panelTitle: optional - 'panel title' if there is more datepickers on the page
     * @param clickOnSplitButton: optional - set 'false' if just Month (not Date) Picker is present
     * @param buttons: optional - if there is no 'OK' or 'Cancel' buttons, set 'false'
     * @param messageBox - if you need to check, if messageBox was fired, provide text of the message
     * highly recommended open and close monthpicker before getting buttons 'OK' or 'Cancel', they are not loaded yet
     * beforeAll(function(){
     *      var splitButtonText = "splitbutton[tooltip ^= Choose]";
     *      var okButtonText = ">> div.x-monthpicker-buttons a:first-child";
     *
     *      if(panelTitle !== undefined){
     *          splitButtonText = "panel[title=" + panelTitle +"] " + splitButtonText;
     *          okButtonText = "panel[title=" + panelTitle +"] " + okButtonText;
     *      }
     *      //TODO - open datepicker - related to example
     *      ST.button(splitButtonText)
     *          .visible()
     *          .click();
     *
     *      ST.component(okButtonText)
     *          .click();
     *
     *      ST.component(Components.panel("Standard"))
     *          .click();
     *
     *  });
     */
    chooseRandomDateInDatepicker: function (panelTitle, clickOnSplitButton, buttons, messageBox) {
        var day = Math.floor((Math.random() * 29) + 1);
        var month = Math.floor((Math.random() * 11) + 1);
        var year = Math.floor((Math.random() * 100) + 1950);
        this.chooseMonthAndYearInDatepicker(month, year, panelTitle, clickOnSplitButton, buttons);
        this.chooseDayInDatepicker(day, panelTitle, messageBox);
    },

    /**
     * Choose whole date
     * @param day: day of the month
     * @param month: month
     * @param year: year
     * @param panelTitle: optional - 'panel title' if there is more datepickers on the page
     * @param clickOnSplitButton: optional - set 'false' if just Month (not Date) Picker is present
     * @param buttons: optional - if there is no 'OK' or 'Cancel' buttons, set 'false'
     * @param messageBox - if you need to check, if messageBox was fired, provide text of the message
     * highly recommended open and close monthpicker before getting buttons 'OK' or 'Cancel', they are not loaded yet
     * beforeAll(function(){
     *      var splitButtonText = "splitbutton[tooltip ^= Choose]";
     *      var okButtonText = ">> div.x-monthpicker-buttons a:first-child";
     *
     *      if(panelTitle !== undefined){
     *          splitButtonText = "panel[title=" + panelTitle +"] " + splitButtonText;
     *          okButtonText = "panel[title=" + panelTitle +"] " + okButtonText;
     *      }
     *      //TODO - open datepicker - related to example
     *      ST.button(splitButtonText)
     *          .visible()
     *          .click();
     *
     *      ST.component(okButtonText)
     *          .click();
     *
     *      ST.component(Components.panel("Standard"))
     *          .click();
     *
     *  });
     */
    chooseDateInDatepicker: function (day, month, year, panelTitle, clickOnSplitButton, buttons, messageBox) {
        this.chooseMonthAndYearInDatepicker(month, year, panelTitle, clickOnSplitButton, buttons);
        this.chooseDayInDatepicker(day, panelTitle, messageBox);
    },

    /**
     * Choose whole date
     * @param date: new Date(year, month, day);
     * @param panelTitle: optional - 'panel title' if there is more datepickers on the page
     * @param clickOnSplitButton: optional - set 'false' if just Month (not Date) Picker is present
     * @param buttons: optional - if there is no 'OK' or 'Cancel' buttons, set 'false'
     * @param messageBox - if you need to check, if messageBox was fired, provide text of the message
     * highly recommended open and close monthpicker before getting buttons 'OK' or 'Cancel', they are not loaded yet
     * beforeAll(function(){
     *      var splitButtonText = "splitbutton[tooltip ^= Choose]";
     *      var okButtonText = ">> div.x-monthpicker-buttons a:first-child";
     *
     *      if(panelTitle !== undefined){
     *          splitButtonText = "panel[title=" + panelTitle +"] " + splitButtonText;
     *          okButtonText = "panel[title=" + panelTitle +"] " + okButtonText;
     *      }
     *      //TODO - open datepicker - related to example
     *      ST.button(splitButtonText)
     *          .visible()
     *          .click();
     *
     *      ST.component(okButtonText)
     *          .click();
     *
     *      ST.component(Components.panel("Standard"))
     *          .click();
     *
     *  });
     */
    chooseDateInDatepickerDate: function (date, panelTitle, clickOnSplitButton, buttons, messageBox) {
        //month has to be +1, because in Date structure is month numbered from 0
        this.chooseDateInDatepicker(date.getDate(), date.getMonth() + 1, date.getFullYear(), panelTitle, clickOnSplitButton, buttons, messageBox);
    },

    /**
     * Choose day of the month in a datepicker
     * @param day: day of the month
     * @param panelTitle: optional - 'panel title' if there is more datepickers on the page
     * @param messageBox - if you need to check, if messageBox was fired, provide text of the message
     */
    chooseDayInDatepicker: function (day, panelTitle, messageBox) {
        var desc = "set day in datepicker and controll if chosen activeDay is " + day + ".";
        if (panelTitle !== undefined) {
            desc += " in " + panelTitle;
        }
        if(messageBox !== undefined){
            desc += ' and check message box'
        }

        it(desc, function () {
            chooseDayInDatepickerProcedure(day, panelTitle, messageBox);
            //controll day
            var activeDay = "datepicker => td.x-datepicker-active";
            if (panelTitle !== undefined) {
                activeDay = "panel[title=" + panelTitle + "] " + activeDay
            }
            ST.component(activeDay).and(function (component) {
                expect(component.getValue().getDate()).toBe(day);
            });
        });
    },

    /**
     * for library
     * Choose month and year
     * @param month: month
     * @param year: year
     * @param clickOnSplitButton: optional - set 'false' if just Month (not Date) Picker is present
     * @param panelTitle: optional - 'panel title' if there is more datepickers on the page
     * @param buttons: optional - if there is no 'OK' or 'Cancel' buttons, set 'false'
     * @param messageBox - if you need to check, if messageBox was fired, provide text of the message
     * highly recommended open and close monthpicker before getting buttons 'OK' or 'Cancel', they are not loaded yet
     * beforeAll(function(){
     *      var splitButtonText = "splitbutton[tooltip ^= Choose]";
     *      var okButtonText = ">> div.x-monthpicker-buttons a:first-child";
     *
     *      if(panelTitle !== undefined){
     *          splitButtonText = "panel[title=" + panelTitle +"] " + splitButtonText;
     *          okButtonText = "panel[title=" + panelTitle +"] " + okButtonText;
     *      }
     *      //TODO - open datepicker - related to example
     *      ST.button(splitButtonText)
     *          .visible()
     *          .click();
     *
     *      ST.component(okButtonText)
     *          .click();
     *
     *      ST.component(Components.panel("Standard"))
     *          .click();
     *
     *  });
     */
    chooseMonthAndYearInDatepicker: function (month, year, panelTitle, clickOnSplitButton, buttons) {
        var desc = "set month (" + month + ") and year (" + year + ")";
        if (panelTitle === undefined) {
            panelTitle = 'datepicker';
        }
        else {
            desc += " in " + panelTitle;
            panelTitle = "panel[title=" + panelTitle + "]";
        }

        it(desc, function () {
            chooseMonthAndYearInDatepickerProcedure(month, year, panelTitle, clickOnSplitButton, buttons);
            //controll month and year
            ST.component(panelTitle + " => div.x-monthpicker-years").and(function (component) {
                expect(component.getValue()[0] + 1).toBe(month);
                expect(component.getValue()[1]).toBe(year);
            });
        });
    },

    /**
     * function for pressing Today button in calendar and verify if correct day is chosen
     * @param panelTitle: optional - 'panel title' if there is more datepickers on the page
     * @param messageBox - if you need to check, if messageBox was fired, provide text of the message
     */
    dateTodayButton: function (panelTitle, messageBox) {
        var desc = "Set today button and verify day, month and year";
        var datepicker = "datepicker";
        if (panelTitle !== undefined) {
            datepicker = "panel[title=" + panelTitle + "] " + datepicker;
            desc += " in " + panelTitle;
        }
        if(messageBox !== undefined){
            desc += ' and check message box'
        }
        it(desc, function () {
            if(messageBox === undefined) {
                ST.button("button[text = Today]").click();
            }
            else{
                ST.play([
                    { type: "click", target: "button[text = Today]"},
                    { animation: null, delay: 1000, target: "@msg-div", fn: function (done) {
                        expect(this.targetEl.dom.textContent).toMatch(messageBox);
                        done();
                    }}
                ]);
            }

            ST.picker(datepicker).and(function (picker) {
                //controll values
                var d = new Date();
                expect(picker.getValue().getFullYear()).toBe(d.getFullYear());
                expect(picker.getValue().getMonth()).toBe(d.getMonth());
                expect(picker.getValue().getDate()).toBe(d.getDate());
            });

        });
    },

    /**
     * Checks for device type
     */
    isPhone : ST.os.deviceType === "Phone",
    isDesktop : ST.os.deviceType === "Desktop",
    isTablet : ST.os.deviceType === "Tablet",
    isTouch : function() {
        return Ext.platformTags.touch;
    },

    /**
     * Checks KS example title
     * @param {string} title - Example name, without any leading parent
     * @param {string} [parentTitle=Components] - Optional - defines example prefix
     */
    checkExampleTitle : function (title,parentTitle) {
        //fallback to Components if parentTitle is not defined
        parentTitle = parentTitle || 'Components';
        var ksNavigationBarId = "#mainNavigationBar";

        return ST.component(ksNavigationBarId)
            .visible()
            .and(function (titleBar) {
                //this is new...
                var txtToCheck = Lib.isPhone ? title : "Ext JS Kitchen Sink";
                var titleTxt = titleBar.getTitle();
                expect(titleTxt).toBe(txtToCheck);
            });
    },

    /**
     * Control if element contain given text - ATTENTION - it has to be inside it - it could be just part of your test
     * @param element - element or component e.g.: 'tree-list component[id^=ext-component]'
     * @param givenText - text inside dom
     */
    textInsideElement: function(element, givenText){
        //sometimes need to have focus
        ST.element(element).and(function(el) {
            //need to be tested, but ST.browser.is.IE && ST.browser.version < 9 don't support innerHTML
            //textContent gives better - more relevant - result and (this is most important why use it) note for running test
            var textContent = el.dom.textContent || el.dom.innerHTML;
            expect(textContent).toContain(givenText);
        });
    },

    /**
     * Scroll to element - ATTENTION - it has to be inside it - it could be just part of your test
     * @param element - element or component e.g.: 'tree-list component[id^=ext-component]'
     * @param stringForSelectParent - identificator of scrollable parent - e.g.: 'container'
     * @param direction - optional parameter, if 'x' is given, than horizontal direction it is,
     *                      if 'y' is given, vertical direction is provided, otherwise both directions are set
     */
    scrollToElement: function(element, stringForSelectParent, direction){
        var xCoordinates = 0;
        var yCoordinates = 0;
        if(direction == 'x'){
            xCoordinates = Ext.ComponentQuery.query(element)[0].el.dom.offsetLeft;
        }
        if(direction == 'y'){
            yCoordinates = Ext.ComponentQuery.query(element)[0].el.dom.offsetTop;
        }
        else{
            xCoordinates = Ext.ComponentQuery.query(element)[0].el.dom.offsetLeft;
            yCoordinates = Ext.ComponentQuery.query(element)[0].el.dom.offsetTop;
        }

        if(stringForSelectParent !== undefined){
            Ext.ComponentQuery.query(element)[0].up(stringForSelectParent).getScrollable().scrollTo(xCoordinates, yCoordinates);
        }
        else{
            Ext.ComponentQuery.query(element)[0].getScrollable().scrollTo(xCoordinates, yCoordinates);
        }

    },



    /**
     * Given element is expanded (or collapsed) by expander and than is there controll if status (expanded) is changed
     * @param element - element which we want to expand (it could be something into the ST.element(HERE)) or number of row for treelist item inside grid
     * @param id - optional parameter - it has to be set if you want to call this function again with same parameters
     * @param andBack - optional parameter - set to true if you want to restore original state
     * @param name - optional parameter - name is using when is set and when element is ST.element and not a string
     * @param grid - optional parameter - grid locator
    */
    expandElement: function(element, id, andBack, name, grid){
        var desc = 'Expand / Collapse';
        desc += ' element and control if it finished successfully';
        if(andBack){
            desc += ' and return it back to initial state'
        }
        //id is for repeating call expandElement
        if(id !== undefined){
            desc += ' (id: ' + id + ')';
        }
        grid = grid || 'grid';
        var isTreeGrid = false;
        it(desc, function () {
            if(typeof element === 'number'){
                stElement = ST.grid(grid).rowAt(element).reveal().down('>> .x-treecell');
                //just renaming describe
                desc = desc.replace('Object', '');
                desc = desc.replace('object', '');
                if(name !== undefined){
                    desc = desc.replace('[ ]', name);
                }
                isTreeGrid = true;
            }
            else if(typeof element === 'string') {
                var stElement = ST.element(element);
            }
            else{
                console.log('Error in Lib.expandElement');
            }
            expandCollapse(stElement, isTreeGrid);
            if(andBack){
                expandCollapse(stElement, isTreeGrid);
            }
        });
    },

    DatePanel: {
        /**
         * Return an array with days of current month
         * @param dateview - number of current dateview of datepanel
        */
        getDays: function(dateview) {
            var month = [];
            var cells = Ext.first('datepanel:visible dateview[_monthOffset='+dateview+']').bodyCells;
            for (var i = 0; i < cells.length; i++) {
                if (cells[i].className.indexOf('x-current-month') !== -1) {
                    month.push(cells[i]);
                }
            }
            return month;
        },
/**
         * Return an array with days of current month
         * @param dateview - number of current dateview of datepanel
        */
       getDaysById: function(id) {
        var month = [];
        var cells = Ext.first('datepanel:visible dateview#'+id).bodyCells;
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].className.indexOf('x-current-month') !== -1) {
                month.push(cells[i]);
            }
        }
        return month;
    },

        /**
         * Pick a date from datepanel
         * @param element - query selector of datefield
         * @param day - choosen day on datepanel
         * @param month - choosen month on datepanel
         * @param year - choosen year in yearpicker - works only in non-material theme or on phones
        */
        pickDate: function(element, day, month, year) {

            var date = new Date;
            var currentYear = date.getFullYear();

            ST.component(element)
                .focus();
            ST.component(element + ' datetrigger')
                .click();

            if (Lib.isPhone){

                ST.component('pickerslot[_name=month]')
                    .and(function(m){
                        var item = m.getItemAt(month-1);
                        item = Ext.get(item);
                        m.scrollToItem(item);
                        ST.element(item).click();
                    });

                ST.component('pickerslot[_name=day]')
                    .and(function(d){
                        var item = d.getItemAt(day-1);
                        item = Ext.get(item);
                        d.scrollToItem(item);
                        ST.element(item).click();
                    });

                ST.component('pickerslot[_name=year]')
                    .and(function(y){
                        var item = y.getItemAt(20+(year-currentYear));
                        item = Ext.get(item);
                        y.scrollToItem(item);

                        ST.element(item).visible().click();
                    });

                Lib.waitOnAnimations();
                ST.component('datepicker button[_text=Done]')
                    .click();

            } else {

                date = date.getMonth()+1
                var offset = 0;

                if(Ext.theme.name != 'Material') {
                    if(currentYear > year){
                        offset = (currentYear - year) * (-12);
                    } else {
                        offset = (year - currentYear) * 12;
                    }

                    ST.component('datetitle')
                        .click();
                    var index = year - 1918;
                    ST.component('yearpicker')
                        .and(function(){
                            ST.component('yearpicker simplelistitem[_recordIndex='+index+']')
                                .click();
                        });
                }

                ST.component('dateview:first')
                    .and(function(){
                        if(date < month){
                            date = month - date;
                            offset = offset + date;
                            for (var i = 0; i < date; i++) {
                                ST.component('datepanel tool[_itemId=nextMonth]')
                                    .click();
                            }
                        } else if (date > month) {
                            date = date - month;
                            offset = offset + date*(-1);
                            for (var i = 0; i < date; i++) {
                                ST.component('datepanel tool[_itemId=previousMonth]')
                                    .click();
                            }
                        }
                    }).and(function(){
                        ST.component('dateview[_monthOffset='+offset+']')
                            .and(function() {
                                var dates = Lib.DatePanel.getDays(offset);
                                ST.element(dates[day-1])
                                    .click();
                                ST.element("datepanel")
                                    .hidden();
                                ST.wait(function () {
                                    return day === Ext.first('datepanel').getValue().getDate();
                                });
                            });
                        });
            }
        }
    },

    Forms: {

        /**
         * Validate form field by given input and check an error
         * @param query - query of respective field
         * @param state - bool state if field should be valid or invalid
         * @param input - field input
         * @param error - optional parameter - set error when field is invalid
        */
        validateError: function(query, state, input, error){

            ST.field(query)
                .type(input)
                .and(function(f) {
                    if(state){
                        expect(f.el.dom.className).not.toContain('invalid');
                        if(f._errorMessage !== null){
                            expect(f._errorMessage).toBe('');
                        }
                    } else {
                        expect(f.el.dom.className).toContain('invalid');
                        expect(f._errorMessage).toContain(error);
                    }
                });
        },

        /**
         * Validate value of form field by given input
         * @param query - query of respective field
         * @param input - field input
         * @param mask - optional parameter - input mask for fields with inputMask
        */
        validateInput: function(query, input, mask){

            ST.field(query)
                .type(input)
                .down('=> input')
                .and(function(inValue){
                    if(mask !== undefined) {
                        expect(inValue.dom.value).toBe(mask);
                    } else {
                        expect(inValue.dom.value).toBe(input);
                    }
                });
        },

        /**
         * Display tooltip with respective error of invalid field
         * @param element - query selector of invalid field
         * @param error - displayed tooltip error
        */
        tooltipError: function(element, error){

            ST.component(element)
                .click();

            var offsetHeight = Ext.first(element).el.dom.clientHeight-20;

            if(Lib.isDesktop) {
                ST.play([
                    { type: "mouseover", target: element, y:offsetHeight}
                ]);
            }
          
            ST.component('tooltip')
                .visible()
                .and(function(tip) {
                    expect(tip._html).toContain(error);
                }).hidden();
        },

        /**
         * Validate if form datefield contains correct date
         * @param query - component query of respective datefield
         * @param day - date to check
         * @param month - month to check
         * @param year - year to check
        */
        validateField: function(query, day, moth, year) {

            var date = new Date;

            ST.field(query)
                .valueNotEmpty()
                .and(function(){
                    var value = Ext.first(query).getValue();
                    expect(value.getDate()).toBe(day);
                    expect(value.getMonth()+1).toBe(moth);
                    if(Ext.theme.name == 'Material' && Lib.isPhone == false) {
                        expect(value.getFullYear()).toBe(date.getFullYear());
                    } else {
                        expect(value.getFullYear()).toBe(year);
                    }
                });
        },
        /**
         * Select value from comboBox and check if value is correct
         * @param element - element which we want test - selectfield (it could be something into the ST.element(HERE))
         * @param type - Name of value which you are inputing. For example - state, color, name. You find out it - ("wantedSelectfield simplelistitem")[].getRecord() there you should find value which you looking for
         * @param name - name of item, which you want to choose
         * @param [expectedValue] - expected value, if not defined name will be used, this is handy when displayValue and valueField are different
         * TODO auto-suggest
         */
        testCombobox: function (element, type, name, expectedValue) {
            expectedValue = expectedValue || name;
            Lib.Picker.clickToShowPicker(element);
            Lib.Picker.selectValueInPickerSlot(element, name, type);
            Lib.Picker.checkCorrectValue(element, expectedValue);
        }
    },

    Picker: {
        // will return list or picker based on device
        pickerID: function (el) {
            return Ext.first(el).getPicker().getId();
        },
        pickerSlot: function (el) {
            var pId = Ext.first(el).getPicker().getItems().keys[0];
            return ST.component('#' + pId);
        },
        trigger: function (el) {
            return ST.component(Components.trigger(el));
        },
        comboBoxField: function (el) {
            return ST.comboBox(el);
        },
        checkCorrectValue: function (element, expectedValue) {
            Lib.Picker.comboBoxField(element)
                .and(function (field) {
                    var value = field.getValue()
                    expect(value).toBe(expectedValue)
                });
        },
        selectValueInPickerSlot: function (el, selectName, selectType) {
            var number //this will be location of wanted state
            if (Lib.isPhone) {
                ST.component('#' + Ext.first(el).getPicker().getItems().keys[0])
                    .and(function (cmp) {
                        var list1 = cmp.getStore().data.items;
                        for (i = 0; i < list1.length; i++) {
                            var item = list1[i];
                            if (item.data[selectType] === selectName) {
                                number = i
                                return;
                            }
                        }
                    })
                    .and(function (cmp) {
                        //need to scroll to desired item to ensure it's visible before click
                        var item = cmp.getItemAt(number);
                        item = Ext.get(item);
                        cmp.scrollToItem(item);
                        ST.element(item)
                            .click();
                        ST.button('picker:visible button[text=Done]').click()
                    });

            } else {
                ST.component('#' + Lib.Picker.pickerID(el)).visible()
                    .and(function (cmp) {
                        Lib.ghostClick('#' + Lib.Picker.pickerID(el) + ' simplelistitem{getRecord().get("' + selectType + '")==="' + selectName + '"}', true);
                    });
            }
        },
        clickToShowPicker: function (el) {
            //navigate to "State" picker for chance to be visible (bug explored in iOS 7 iPhone)
            Lib.Picker.trigger(el).click()
                .wait(function () {
                    return Ext.first('#' + Lib.Picker.pickerID(el)).isVisible()
                });

        },
        clickToHidePicker: function (el) {
            //tear down - click Cancel on phone or click out of list on other devices
            if (Lib.isPhone) {
                ST.button('picker:visible button[text=Cancel]').click()
                    .and(function (cmp) {
                        ST.component('#' + Lib.Picker.pickerID(el)).expect(picker.isVisible().toBe(false))
                    })
            } else {
                Lib.Picker.trigger(el).click()
            }
        },
        afterAll: function(el){
            ST.component('#' + Lib.Picker.pickerID(el))
                .wait(function(picker){
                    return picker.isHidden() === true;
                });
        }
    },

    DnD: {
        /**
         * Drag and drop element or component
         * @param {object} el - dom element or Ext.component
         * @param {int} moveX - move in x axis
         * @param {int} moveY - move in y axis
         * @param {int} [startX=center] - value where click on element (default is center)
         * @param {int} [startY=center] - value where click on element (default is center)
         * @param {boolean} - if true it should perform mouseUp event on target coordinations
         */
        dragBy: function (el, moveX, moveY, startX, startY, mouseUpOnTargetDestination) {

            if (el.isComponent) {
                el = el.el;
            }
            var standardX = startX || el.dom.offsetWidth / 2;
            var standardY = startY || el.dom.offsetHeight / 2;
            var targetX = standardX + moveX;
            var targetY = standardY + moveY;

            if (Lib.isDesktop) {
                ST.play([
                    {type: "mousedown", target: el, x: standardX, y: standardY, detail: 1},
                    {type: "mousemove", target: el, x: standardX, y: standardY, buttons: 1},
                    {type: "mousemove", target: el, x: targetX, y: targetY, buttons: 1},
                    {type: "mouseup", target: el, x: mouseUpOnTargetDestination?targetX:standardX, y: mouseUpOnTargetDestination?targetY:standardY, detail: 1}
                ]);
            }
            else {
                ST.play([
                    {type: "touchstart", target: el, x: standardX, y: standardY, detail: 1},
                    {type: "touchmove", target: el, x: standardX, y: standardY, buttons: 1},
                    {type: "touchmove", target: el, x: targetX, y: targetY, buttons: 1},
                    {type: "touchend", target: el, x: mouseUpOnTargetDestination?targetX:standardX, y: mouseUpOnTargetDestination?targetY:standardY, detail: 1}
                ]);
            }
        },
        /**
         * Drag and drop element or component
         * @param {object} el - dom element or Ext.component
         * @param {int} moveX - move in x axis
         * @param {int} moveY - move in y axis
         * @param {function} fn - function after move and before mouseup
         * @param {int} [startX=center] - value where click on element (default is center)
         * @param {int} [startY=center] - value where click on element (default is center)
         */
        dragByWithFunction: function (el, moveX, moveY, fn, startX, startY) {

            if (el.isComponent) {
                el = el.el;
            }
            var standardX = startX || el.dom.offsetWidth / 2;
            var standardY = startY || el.dom.offsetHeight / 2;

            if (Lib.isDesktop) {
                ST.play([
                    {type: "mousedown", target: el, x: standardX, y: standardY, detail: 1},
                    {type: "mousemove", target: el, x: standardX, y: standardY, buttons: 1},
                    {type: "mousemove", target: el, x: standardX + moveX, y: standardY + moveY, buttons: 1},
                    {fn: fn},
                    {type: "mouseup", target: el, x: standardX, y: standardY, detail: 1}
                ]);
            }
            else {
                ST.play([
                    {type: "touchstart", target: el, x: standardX, y: standardY, detail: 1},
                    {type: "touchmove", target: el, x: standardX, y: standardY, buttons: 1},
                    {type: "touchmove", target: el, x: standardX + moveX, y: standardY + moveY, buttons: 1},
                    {fn: fn},
                    {type: "touchend", target: el, x: standardX, y: standardY, detail: 1}
                ]);
            }
        },
        /**
         * Drag and drop element or component to another component or element
         * @param {object} startEl - dom element or Ext.component to be dragged
         * @param {object} destEl - dom element or Ext.component where startEl shall be dragged
         * @param {int} startOffsetX [startOffset = 0] - x offset of startEl
         * @param {int} startOffsetY [startOffsetY = 0] - y offset of startEl
         * @param {int} destOffsetX [destOffsetX = 0] - x offset of destEl
         * @param {int} destOffsetY [destOffsetY = 0] - y offset of destEl
         * @param {function} fn [fn = { }] - function after move and before mouseup
         */
        dragByToElement : function(startEl, destEl, startOffsetX, startOffsetY, destOffsetX, destOffsetY, fn) {
            startOffsetX = startOffsetX || 0;
            startOffsetY = startOffsetY || 0;
            destOffsetX = destOffsetX || 0;
            destOffsetY = destOffsetY || 0;
            fn = fn || function() { };

            if (Lib.isDesktop) {
                ST.play([
                    {type: "mousedown", target: startEl, x:startOffsetX, y:startOffsetY, detail: 1},
                    {type: "mousemove", target: startEl, x:startOffsetX, y:startOffsetY, buttons: 1},
                    {type: "mousemove", target: destEl, x:destOffsetX, y:destOffsetY, buttons: 1},
                    {type: "mouseup", target: destEl, x:destOffsetX, y:destOffsetY, detail: 1},
                    {fn: fn}
                ]);
            }
            else {
                ST.play([
                    {type: "touchstart", target: startEl, x:startOffsetX, y:startOffsetY, detail: 1},
                    {type: "touchmove", target: startEl, x:startOffsetX, y:startOffsetY, buttons: 1},
                    {type: "touchmove", target: destEl, x:destOffsetX, y:destOffsetY, buttons: 1},
                    {type: "touchend", target: destEl, x:destOffsetX, y:destOffsetY, detail: 1},
                    {fn: fn}
                ]);
            }
        }
    },
    Pivot: {
        /**
         * Normalize string number 10,100.00 -> 10100. If input is string, it return string.
         * @param string
         * @returns {*}
         */
        normalizeNumber: function(string) {
            string = string == '' ? '0' : string;
            if (isNaN(parseInt(string.replace(',', '').split('.')[0])))
                return string;
            else
                return parseInt(string.replace(',', '').split('.')[0]);
        },

        /**
         * Divide array to parts
         * @param a - Array
         * @param n - parts of array
         * @returns {Array} - array of arrays
         */
        divideArray: function (a, n) {

            var len = a.length,
                out = [],
                i = 0,
                size;

            if (len % n === 0) {
                size = Math.floor(len / n);
                while (i < len) {
                    out.push(a.slice(i, i += size));
                }
            }
            return out;
        },
        /**
         * Sort array
         * @param direction string 'ASC' or 'DESC'
         * @returns {Function}
         */
        sortArray: function(direction){
            direction = direction || 'ASC';

            if (direction == 'ASC') {
                return function(a, b){return a > b};
            } else {
                return function(a, b){return a < b};
            }
        },
        /**
         * Function for check if array is sorted
         * @param array
         * @param fn
         * @returns {boolean}
         */
        isSorted: function(array, fn) {
            var array2 = array.slice();
            array2.sort(fn);
            for (var i = 0; i < array.length; i++) {
                if (array[i] != array2[i])
                    return false;
            }
            return true;
        },
        /**
         * Function for pushing text from cell to array
         * @param array
         * @param columnNumber
         * @param rowNumber
         * @param locator
         */
        pushNumbersToArray: function(array, columnNumber, rowNumber, locator) {
            ST.grid(locator? locator : 'grid')
                .rowAt(rowNumber)
                .cellAt(columnNumber)
                .and(function (cell) {
                    array.push(Lib.Pivot.normalizeNumber(cell.el.dom.innerText));
                });
        }
    },
    Chart: {
        /**
         * function for setting delay and redirecting for all charts
         * @param redirectName
         * @param componentToBeVisible - optional
         * @param delay - optional
         * @param animation - optional
         * @param getStore - optional
         */
        beforeAll: function(redirectName, componentToBeVisible, delay, animation, getStore){
            componentToBeVisible = componentToBeVisible || 'chart';
            Lib.beforeAll(redirectName, componentToBeVisible, delay);

            if(getStore !== false) {
                ST.component(componentToBeVisible)
                    .and(function (el) {
                        document['dataFromStore'] = [];
                        if(el.getStore().data.items[0].data.g1 !== undefined){
                            var arraySize = el.getStore().data.items.length;
                            if(arraySize > 25){
                                for (var i = 0; i < el.getStore().data.items.length; i++) {
                                    document['dataFromStore'].push(Ext.clone(el.getStore().data.items[i].data));
                                }
                            }
                            else{
                                document['dataFromStore'] = [
                                    { id: 0, g1: 128.97897066529825, g2: 311.5464858566771, g3: 244.28934675374316, g4: 453.3122313023251, g5: 579.1792885069732, g6: 798.0088061009042, name: "A" }   ,
                                    { id: 1, g1: 72.74937832384134, g2: 183.07046176404157, g3: 188.4143708775038, g4: 327.4249074057776, g5: 542.2018240621768, g6: 810.0733156538904, name: "B" }    ,
                                    { id: 2, g1: 142.8202980606411, g2: 76.58817584267979, g3: 293.09368365156297, g4: 473.5838906564094, g5: 691.1624017917886, g6: 679.4855330800564, name: "C" }    ,
                                    { id: 3, g1: 71.52948527165276, g2: 138.16524248306484, g3: 424.6062701263737, g4: 515.6257719225276, g5: 680.068135034452, g6: 580.4973857514988, name: "D" }     ,
                                    { id: 4, g1: 230.91600977318183, g2: 83.68687134422697, g3: 308.91416081285723, g4: 553.0733739338575, g5: 635.4356297171596, g6: 536.6800969352647, name: "E" }   ,
                                    { id: 5, g1: 193.0498014146733, g2: 89.26355032711456, g3: 331.62391738793644, g4: 700.8545969319359, g5: 496.2385576031321, g6: 402.54147050286406, name: "F" }   ,
                                    { id: 6, g1: 95.83782845814864, g2: 38.38385225551548, g3: 281.79787853473715, g4: 619.1245133035809, g5: 481.6089471161406, g6: 277.745313947826, name: "G" }     ,
                                    { id: 7, g1: 66.82588560637089, g2: 108.59666943753777, g3: 176.3514439634999, g4: 731.365540933549, g5: 382.9684488149078, g6: 139.66967634882627, name: "H" }    ,
                                    { id: 8, g1: 59.126268866326996, g2: 71.14594178684325, g3: 184.9611321134298, g4: 776.2162644280374, g5: 392.37873032467326, g6: 190.36473137011433, name: "I" }  ,
                                    { id: 9, g1: 111.20017052172986, g2: 133.28542387128402, g3: 320.5793513298472, g4: 848.2292647078846, g5: 300.07363236755725, g6: 98.53751628316772, name: "J" }  ,
                                    { id: 10, g1: 22.86150038701959, g2: 70.41313188789906, g3: 443.61161985113677, g4: 828.3648249132987, g5: 437.0632218670803, g6: 180.5615196296854, name: "K" }   ,
                                    { id: 11, g1: 3.6367248165987576, g2: 212.072270223827, g3: 559.7233297034106, g4: 757.9803068348979, g5: 505.25623989475434, g6: 60.37055123170575, name: "L" }   ,
                                    { id: 12, g1: 8.242655511347266, g2: 227.69556429549118, g3: 655.773376426559, g4: 841.1456479138806, g5: 494.3632297713284, g6: 37.14842266930316, name: "M" }    ,
                                    { id: 13, g1: 121.6458539660178, g2: 161.50944511072623, g3: 754.6147063777748, g4: 944.6873565577557, g5: 632.2177028716169, g6: 125.48607630140856, name: "N" }  ,
                                    { id: 14, g1: 148.51072548038718, g2: 39.62300716562268, g3: 746.843709378519, g4: 869.9590784631873, g5: 668.7012727812679, g6: 73.8161366418606, name: "O" }     ,
                                    { id: 15, g1: 53.320165965686954, g2: 73.26807729168912, g3: 804.7387928401428, g4: 974.5931877330408, g5: 814.5302704511993, g6: 220.36781963235933, name: "P" }  ,
                                    { id: 16, g1: 205.14745179632814, g2: 36.39273614463025, g3: 886.2148547550114, g4: 951.3684397115812, g5: 926.9896098945437, g6: 123.32099756877335, name: "Q" }  ,
                                    { id: 17, g1: 78.7056507321505, g2: 4.632411623866403, g3: 868.7312760449857, g4: 1105.7383151283937, g5: 835.8897004372742, g6: 40.29165853070566, name: "R" }    ,
                                    { id: 18, g1: 54.59147575425632, g2: 110.59893428523884, g3: 1024.2868914730045, g4: 1023.2943077529305, g5: 816.0484465963932, g6: 177.45050549227466, name: "S" },
                                    { id: 19, g1: 137.85105857370974, g2: 100.39388886724888, g3: 931.7900599216775, g4: 930.0674374282444, g5: 717.4922932261841, g6: 39.99058588974793, name: "T" }  ,
                                    { id: 20, g1: 16.393645475264577, g2: 95.75477324859918, g3: 879.9245159055349, g4: 833.4489661104027, g5: 594.17745260594, g6: 21.792249361966128, name: "U" }    ,
                                    { id: 21, g1: 165.54578882245755, g2: 33.434580316892024, g3: 818.8422348774491, g4: 969.5483146053764, g5: 669.7026966192483, g6: 44.87346934088269, name: "V" }  ,
                                    { id: 22, g1: 260.88604229166117, g2: 111.4184306420783, g3: 770.1243422513088, g4: 895.9076984345525, g5: 714.1261985722344, g6: 51.16503359768137, name: "W" }   ,
                                    { id: 23, g1: 288.8144613662917, g2: 2.7041101131187872, g3: 819.0297947383701, g4: 934.9175015900998, g5: 680.8977616077299, g6: 90.59744375679821, name: "X" }   ,
                                    { id: 24, g1: 258.6710555278447, g2: 64.65724749245587, g3: 953.2876976075308, g4: 997.0001925349725, g5: 816.1014055053004, g6: 159.5840442090622, name: "Y" }
                                ];
                                document['dataFromStore'] = document['dataFromStore'].slice(0, arraySize);
                            }
                        }
                        else{
                            for (var i = 0; i < el.getStore().data.items.length; i++) {
                                document['dataFromStore'].push(Ext.clone(el.getStore().data.items[i].data));
                            }
                        }

                        el.getStore().loadData(document['dataFromStore']);

                    });
            }
            if(animation !== false){
                Lib.waitOnAnimations();
            }
            return ST.component(componentToBeVisible)
                .and(function(el) {
                    document['graph_id'] = '#' + el.el.id;
                    document['graph_id_main'] = document['graph_id'] + '-main';
                    ST.component(document['graph_id_main'])
                        .and(function (c) {
                            document['w'] = c.el.dom.clientWidth;
                            document['h'] = c.el.dom.clientHeight;
                        });
                });
        },

        /**
         * function for destroy chart and buttons after each chart example + setting delay back to default value
         * @param buttonFieldToDestroy
         * @param componentNameToDestroy - optional
         * @param destroyChart - optional
         */
        afterAll: function(componentNameToDestroy, destroyChart, buttonFieldToDestroy){
            componentNameToDestroy = componentNameToDestroy || 'chart';
            //restore back to initial state of all examples

            Lib.afterAll(componentNameToDestroy);
            if(buttonFieldToDestroy) {
                for (var i = 0; i < buttonFieldToDestroy.length; i++) {
                    ST.button(Components.button(buttonFieldToDestroy[i]))
                        .and(function (btn) {
                            btn.destroy();
                        })
                        .destroyed()
                }
            }
            if(destroyChart){
                if(Ext.first('chart') !== null){
                    Ext.first('chart').destroy();
                }
            }

            delete document['dataFromStore'];
            delete document['graph_id'];
            delete document['graph_id_main'];
            delete document['w'];
            delete document['h'];
        },

        /**
         * after each 'it' restore data and default theme
         * @param initDataFromStore - backedUp data for restoring
         * @param componentNameWhereStoreIs - optional
         */
        afterEach: function(initDataFromStore, componentNameWhereStoreIs){
            componentNameWhereStoreIs = componentNameWhereStoreIs || 'chart';
            ST.component(componentNameWhereStoreIs)
                .and(function(){
                    Ext.first(componentNameWhereStoreIs).getStore().loadData(initDataFromStore);
                    Ext.first(componentNameWhereStoreIs).setTheme('default');
                    Lib.waitOnAnimations();
                });
        },

        /**
         * first it in each chart example for controll if 'chart' component is properly loaded
         * @param desc - description for screenShot comparison
         * @param componentName - optional
         */
        isRendered: function (desc, componentName) {
            componentName = componentName || 'chart';
            ST.component(componentName)
                .visible()
                .and(function (chart) {
                    expect(chart.rendered).toBeTruthy();
                });
            Lib.screenshot(desc + '_basic');
        },

        /**
         * IT INSIDE
         * click on provided button Theme and check if baseColor is changed and than
         * click on provided button Theme 7-times and check if change its color everytime
         * @param desc - description for screenShot comparison
         * @param themeButton - optional - name of theme button
         * @param componentWhereChartIs - optional
         */
        themeComplex: function(desc, themeButton, componentWhereChartIs){
            it('Theme and check if baseColor is changed', function(){
                Lib.Chart.theme(desc, themeButton, componentWhereChartIs);
            });

            it('Theme choose 7-times and check if change its color everytime', function(){
                Lib.Chart.theme7times(themeButton, componentWhereChartIs);
            });
        },

        /**
         * click on provided button Theme and check if baseColor is changed
         * @param desc - description for screenShot comparison
         * @param themeButton - optional - name of theme button
         * @param componentWhereChartIs - optional
         */
        theme: function(desc, themeButton, componentWhereChartIs){
            if(Ext.browser.is.IE){
                pending('IE11 - ORION-1897');
                return;
            }
            themeButton = themeButton || 'Theme';
            componentWhereChartIs = componentWhereChartIs || 'chart';
            var currentColor = Ext.first(componentWhereChartIs).getTheme()._colors[0];

            var buttonQuery = Components.button(themeButton);
            if(Lib.isPhone){
                buttonQuery = "button[_iconCls*=fa-picture-o]";
            }
            ST.button(buttonQuery)
                .click()
                .and(function(btn){
                    if(btn.getMenu().getHidden()){
                        btn.getMenu().show();
                    }
                })
                .wait(function(btn){
                    return (btn.getMenu().el.dom.clientHeight > 0)
                });

            ST.component(Components.menuradioitem("Midnight"))
                .click()
                .wait(function(){
                    var newColor = Ext.first(componentWhereChartIs).getTheme()._colors[0];
                    return newColor != currentColor;
                })
                .and(function(){
                    expect(Ext.first(componentWhereChartIs).getTheme()._colors[0]).not.toBe(currentColor);
                    if(!Ext.first(buttonQuery).getMenu().getHidden()){
                        Ext.first(buttonQuery).getMenu().hide();
                    }
                });

            Lib.screenshot(desc + '_theme');

            ST.button(buttonQuery)
                .click()
                .and(function(btn){
                    if(btn.getMenu().getHidden()){
                        btn.getMenu().show();
                    }
                })
                .wait(function(btn){
                    return (btn.getMenu().el.dom.clientHeight > 0)
                });

            ST.component(Components.menuradioitem("Default"))
                .click()
                .wait(function(){
                    var newColor = Ext.first(componentWhereChartIs).getTheme()._colors[0];
                    return newColor === currentColor;
                })
                .and(function(){
                    expect(Ext.first(componentWhereChartIs).getTheme()._colors[0]).toBe(currentColor);
                    if(!Ext.first(buttonQuery).getMenu().getHidden()){
                        Ext.first(buttonQuery).getMenu().hide();
                    }
                });
        },

        /**
         * click on provided button Theme 7-times and check if change its color everytime
         * @param themeButton - optional - name of theme button
         * @param componentWhereChartIs - optional
         */
        theme7times: function(themeButton, componentWhereChartIs){
            if(Ext.browser.is.IE){
                pending('IE11 - ORION-1897');
                return;
            }
            var themes = ["Midnight", "Green", "Muted", "Purple", "Sky"];
            themeButton = themeButton || 'Theme';
            componentWhereChartIs = componentWhereChartIs || 'chart';
            var currentColor = null;
            var buttonQuery = Components.button(themeButton);
            if(Lib.isPhone){
                buttonQuery = "button[_iconCls*=fa-picture-o]";
            }
            ST.button(buttonQuery)
                .click()
                .and(function(btn){
                    if(btn.getMenu().getHidden()){
                        btn.getMenu().show();
                    }
                })
                .wait(function(btn){
                    return (btn.getMenu().el.dom.clientHeight > 0)
                });

            for(var i = 0; i < themes.length; i++) {
                ST.component(Components.menuradioitem(themes[i]))
                    .click()
                    .wait(function(){
                        var newColor = Ext.first(componentWhereChartIs).getTheme()._colors[0];
                        return newColor !== currentColor;
                    })
                    .and(function(){
                        expect(Ext.ComponentQuery.query(componentWhereChartIs)[0].getTheme()._colors[0]).not.toBe(currentColor);
                        currentColor = Ext.ComponentQuery.query(componentWhereChartIs)[0].getTheme()._colors[0];

                        if(Ext.first(buttonQuery).getMenu().getHidden()){
                            Ext.first(buttonQuery).getMenu().show();
                        }
                    });
            }

            ST.component(Components.menucheckitem("Default"))
                .click()
                .and(function(){
                    if(!Ext.first(buttonQuery).getMenu().getHidden()){
                        Ext.first(buttonQuery).getMenu().hide();
                    }
                });
        },

        /**
         * IT INSIDE
         * click on refresh button and control if data has changed
         * refresh 4 times and control if data has changed every time
         * @param desc - description for screenShot comparison
         * @param initDataFromStore - initial data
         * @param refreshButton - optional - name of refresh button
         * @param componentWhereChartIs - optional
         */
        refreshComplex: function(desc, initDataFromStore, refreshButton, componentWhereChartIs){
            Lib.Chart.refresh(desc, initDataFromStore, refreshButton, componentWhereChartIs);
            Lib.Chart.refresh4times(initDataFromStore, refreshButton, componentWhereChartIs);
        },

        /**
         * click on refresh button and control if data has changed
         * @param desc - description for screenShot comparison
         * @param initDataFromStore - initial data
         * @param refreshButton - optional - name of refresh button
         * @param componentWhereChartIs - optional
         */
        refresh: function(desc, initDataFromStore, refreshButton, componentWhereChartIs){
            refreshButton = refreshButton || 'Refresh';
            componentWhereChartIs = componentWhereChartIs || 'chart';
            var fieldCurrent = [];
            var buttonQuery = Components.button(refreshButton);
            if(Lib.isPhone){
                buttonQuery = "button[_iconCls*=fa-refresh]";
            }
            ST.button(buttonQuery)
                .click();
            ST.component(componentWhereChartIs)
                .and(function(el){
                    for(var i = 0; i < el.getStore().data.items.length; i++) {
                        fieldCurrent.push(Ext.clone(el.getStore().data.items[i].data));
                    }
                    expect(Lib.Chart.compareFields(fieldCurrent, initDataFromStore)).not.toBeTruthy();
                });
            Lib.waitOnAnimations();
            Lib.screenshot(desc + '_refresh');
        },

        /**
         * refresh 4 times and control if data has changed every time
         * @param initDataFromStore - initial data
         * @param refreshButton - optional - name of refresh button
         * @param componentWhereChartIs - optional
         */
        refresh4times: function(initDataFromStore, refreshButton, componentWhereChartIs){
            refreshButton = refreshButton || 'Refresh';
            componentWhereChartIs = componentWhereChartIs || 'chart';
            var fieldCurrent = [];
            var fieldNewBegin = [];
            var buttonQuery = Components.button(refreshButton);
            if(Lib.isPhone){
                buttonQuery = "button[_iconCls*=fa-refresh]";
            }
            ST.button(buttonQuery)
                .click();
            ST.component(componentWhereChartIs)
                .and(function (el) {
                    for(var i = 0; i < el.getStore().data.items.length; i++) {
                        fieldNewBegin.push(Ext.clone(el.getStore().data.items[i].data));
                    }
                    expect(Lib.Chart.compareFields(initDataFromStore, fieldNewBegin)).not.toBeTruthy();
                });
            Lib.waitOnAnimations();
            for (var i = 0; i < 4; i++) {
                ST.button(buttonQuery)
                    .click();
                ST.component(componentWhereChartIs)
                    .and(function (el) {
                        fieldCurrent = [];
                        for(var i = 0; i < el.getStore().data.items.length; i++) {
                            fieldCurrent.push(Ext.clone(el.getStore().data.items[i].data));
                        }
                        expect(Lib.Chart.compareFields(fieldNewBegin, fieldCurrent)).not.toBeTruthy();
                        expect(Lib.Chart.compareFields(initDataFromStore, fieldCurrent)).not.toBeTruthy();
                        fieldNewBegin = fieldCurrent.slice();
                    });
                Lib.waitOnAnimations();
            }
        },

        /**
         * Check if download button is present in desktop, write that it is not supported test for mobile devices
         * @param downloadButton - optional
         */
        download: function(downloadButton){
            downloadButton = downloadButton || 'Download';
            if(Lib.isDesktop){
                ST.button(Components.button(downloadButton))
                    .visible();
            }
            else{
                pending('can not run on phone');
            }
        },
        /**
         * Check if preview button is present in mobile devices, write that test is not supported for desktop
         * @param desc - description for screenShot comparison
         * @param previewButton - optional
         */
        preview: function(desc, previewButton){
            previewButton = previewButton || 'Preview';
            if(Lib.isDesktop) {
                pending('cannot run on desktop');
            }
            else {
                ST.button(Components.button(previewButton))
                    .click();
                Lib.screenshot(desc + '_preview');
                //close preview by clicking behind it
                ST.component('viewport mask[@id=ext-mask-1]')
                    .visible()
                    .click();
            }
        },

        /**
         * Control if chart is stacked, click on 'Group' button, control if is grouped, screenshot, click on Stack button, control if stacked again
         * @param desc - description for screenShot comparison
         * @param groupButton - optional
         * @param stackButton - optional
         * @param componentWhereChartIs - optional
         */
        group: function(desc, groupButton, stackButton, componentWhereChartIs){
            groupButton = groupButton || 'Group';
            stackButton = stackButton || 'Stack';
            componentWhereChartIs = componentWhereChartIs || 'chart';

            var groupButtonQuery = Components.button(groupButton);
            var stackButtonQuery = Components.button(stackButton);
            if(Lib.isPhone){
                groupButtonQuery = "button[_iconCls*=fa-bar-chart]";
                stackButtonQuery = "button[_iconCls*=fa-bars]";
            }

            expect(Ext.ComponentQuery.query(componentWhereChartIs)[0].getSeries()[0].getStacked()).toBeTruthy();
            ST.button(groupButtonQuery)
                .click();
            Lib.waitOnAnimations();
            ST.button(groupButtonQuery)
                .and(function(){
                    expect(Ext.ComponentQuery.query(componentWhereChartIs)[0].getSeries()[0].getStacked()).not.toBeTruthy();
                });

            Lib.screenshot(desc + '_group');

            ST.button(stackButtonQuery)
                .click();
            Lib.waitOnAnimations();
            ST.button(stackButtonQuery)
                .and(function(){
                    expect(Ext.ComponentQuery.query(componentWhereChartIs)[0].getSeries()[0].getStacked()).toBeTruthy();
                });

        },

        /**
         * Click on each legend item, check if last stays enabled, click again on each, check if one stays disabled,
         * click for the last time to restore initial state and check if last element is now enabled.
         * 6 screenShots are provided during life time this function
         * @param desc - description for screenShot comparison
         * @param componentWhereLegendIs - id of legend
         * @param fullWidth - width when legend is on one row
         * @param componentWhereChartIs - optional
         */
        legend: function(desc, componentWhereLegendIs, fullWidth, componentWhereChartIs){
            var componentWhereChartIs = componentWhereChartIs || 'cartesian';
            var numberOfItems = Ext.first(componentWhereChartIs).legendStore.data.length;
            var lines = 1;
            var itemsInLine = numberOfItems;
            var legendWidth = fullWidth;
            var clientWidth = 0;
            var clientHeight = 0;
            var firstCoordinate = 0;
            var rightMove = 0;
            var distanceFromTop = 0;

            ST.element(componentWhereLegendIs)
            //set variables
                .and(function (e) {
                    clientWidth = e.dom.clientWidth;
                    clientHeight = e.dom.clientHeight;
                    //1 line
                    if (clientHeight <= 65) {   //59 except iOS - iOS is bigger
                        lines = 1;
                    }
                    //2 lines
                    else if (clientHeight <= 95) {  //88 except iOS - iOS is bigger
                        lines = 2;
                    }
                    //3 lines (clientHeight === 117)
                    else {
                        lines = 3;
                    }
                    legendWidth /= lines;
                    itemsInLine = Math.ceil(numberOfItems / lines);
                    firstCoordinate = (clientWidth - legendWidth) / 2;
                    rightMove = legendWidth/(2*itemsInLine);
                    distanceFromTop = clientHeight/(lines+1);
                })
                .and(function(){
                    //clicks are adapted to number of rows in legend
                    ST.element(componentWhereLegendIs)
                        .click(firstCoordinate + rightMove, distanceFromTop);

                    if(numberOfItems > 1) {
                        ST.element(componentWhereLegendIs)
                            .click(firstCoordinate + ((3 % (2 * itemsInLine))) * rightMove, distanceFromTop);
                    }
                    Lib.screenshot(desc + '_legend1');

                    if(numberOfItems > 2) {
                        if(itemsInLine === 2){
                            ST.element(componentWhereLegendIs)
                                .click(firstCoordinate + ((5 % (2 * itemsInLine))) * rightMove, 2 * distanceFromTop);
                        }
                        else{
                            ST.element(componentWhereLegendIs)
                                .click(firstCoordinate + ((5 % (2 * itemsInLine))) * rightMove, (4 % lines + 1) * distanceFromTop);
                        }
                        if(numberOfItems > 3) {
                            ST.element(componentWhereLegendIs)
                                .click(firstCoordinate + ((7 % (2 * itemsInLine))) * rightMove, (1 % lines + 1) * distanceFromTop);

                            Lib.screenshot(desc + '_legend2');

                            if(numberOfItems > 4) {
                                ST.element(componentWhereLegendIs)
                                    .click(firstCoordinate + ((9 % (2 * itemsInLine))) * rightMove, (5 % lines + 1) * distanceFromTop);

                                if(numberOfItems > 5) {
                                    ST.element(componentWhereLegendIs)
                                        .click(firstCoordinate + ((11 % (2 * itemsInLine))) * rightMove, (5 % lines + 1) * distanceFromTop);
                                }
                            }
                        }
                        else{
                            Lib.screenshot(desc + '_legend2');
                        }
                    }

                    //verify
                    ST.component(componentWhereChartIs)
                        .and(function(e){
                            for(var i = 0; i < e.legendStore.data.items.length-2; i++){
                                expect(e.legendStore.data.items[i].data.disabled).toBe(true);
                            }
                            //because it is sorted by columns and not by lines, so sometimes it could happend, that not last is disabled, but one before.
                            if(e.legendStore.data.items[e.legendStore.data.items.length-2].data.disabled) {
                                expect(e.legendStore.data.items[e.legendStore.data.items.length - 1].data.disabled).toBe(false);
                            }
                            else{
                                expect(e.legendStore.data.items[e.legendStore.data.items.length - 1].data.disabled).toBe(true);
                            }

                        });
                    Lib.screenshot(desc + '_legend3');

                    ST.element(componentWhereLegendIs)
                        .click(firstCoordinate + rightMove, distanceFromTop);

                    if(numberOfItems > 1) {
                        ST.element(componentWhereLegendIs)
                            .click(firstCoordinate + ((3 % (2 * itemsInLine))) * rightMove, distanceFromTop);
                    }
                    Lib.screenshot(desc + '_legend4');

                    if(numberOfItems > 2) {
                        if(itemsInLine === 2){
                            ST.element(componentWhereLegendIs)
                                .click(firstCoordinate + ((5 % (2 * itemsInLine))) * rightMove, 2 * distanceFromTop);
                        }
                        else{
                            ST.element(componentWhereLegendIs)
                                .click(firstCoordinate + ((5 % (2 * itemsInLine))) * rightMove, (4 % lines + 1) * distanceFromTop);
                        }

                        if(numberOfItems > 3) {
                            ST.element(componentWhereLegendIs)
                                .click(firstCoordinate + ((7 % (2 * itemsInLine))) * rightMove, (1 % lines + 1) * distanceFromTop);

                            Lib.screenshot(desc + '_legend5');

                            if(numberOfItems > 4) {
                                ST.element(componentWhereLegendIs)
                                    .click(firstCoordinate + ((9 % (2 * itemsInLine))) * rightMove, (5 % lines + 1) * distanceFromTop);

                                if(numberOfItems > 5) {
                                    ST.element(componentWhereLegendIs)
                                        .click(firstCoordinate + ((11 % (2 * itemsInLine))) * rightMove, (5 % lines + 1) * distanceFromTop);
                                }
                            }
                        }
                        else{
                            Lib.screenshot(desc + '_legend5');
                        }
                    }

                    //verify
                    ST.component(componentWhereChartIs)
                        .and(function(e){
                            for(var i = 0; i < e.legendStore.data.items.length-2; i++){
                                expect(e.legendStore.data.items[i].data.disabled).toBe(false);
                            }
                            if(e.legendStore.data.items[e.legendStore.data.items.length-2].data.disabled) {
                                expect(e.legendStore.data.items[e.legendStore.data.items.length - 1].data.disabled).toBe(false);
                            }
                            else{
                                expect(e.legendStore.data.items[e.legendStore.data.items.length - 1].data.disabled).toBe(true);
                            }
                        });
                    Lib.screenshot(desc + '_legend6');

                    //restore to initial state
                    ST.element(componentWhereLegendIs)
                        .click(firstCoordinate + (((numberOfItems*2 - 1) % (2 * itemsInLine))) * rightMove, (5 % lines + 1) * distanceFromTop);

                    //verify
                    ST.component(componentWhereChartIs)
                        .and(function(e){
                            expect(e.legendStore.data.items[e.legendStore.data.items.length-1].data.disabled).toBe(false);
                        });
                })
        },

        /**
         * mouseOver with screenShot comparison, than cursor is moved to position [0,0]
         * @param desc - description for screenShot comparison
         * @param chart - target for ST.play
         * @param xCoordinates
         * @param yCoordinates
         * @param tooltip optional text for tooltip
         * @param tooltipTitle optional text for tooltip title
         * @param highlightedItem optional which item should be highlighted
         *          (if value is negative - it is not transparent, but brightness)
         *          it could be array when more columns are in one column, than in [x,y] - x is item, y is "dimension"
         *              so for example [2,3] = 2. column and 3. dimmension (3rd part of 2nd column)
         * @param color optional color of highlighted item
         */
        mouseover: function(desc, chart, xCoordinates, yCoordinates, tooltip, tooltipTitle, highlightedItem, color) {
            if(Lib.isDesktop) {
                ST.play([
                    { type: "mouseenter", target: chart, x: xCoordinates, y: yCoordinates },
                    { type: "mousemove", target: chart, x: xCoordinates, y: yCoordinates }, //has to be more, if not - it doesn't work properly
                    { type: "mouseover", target: chart, x: xCoordinates, y: yCoordinates },
                    { type: "mousemove", target: chart, x: xCoordinates, y: yCoordinates }
                ]);
            }
            else{
                ST.play([
                    { type: "tap", target: chart, x: xCoordinates, y: yCoordinates }
                ]);
            }

            Lib.screenshot(desc + '_mouseover ' + yCoordinates);
            //due to EXTJS-23864
            if(Lib.isDesktop && tooltip){
                ST.component('tooltip:visible')
                    .and(function(cmp){
                        if(tooltipTitle) {
                            expect(cmp.getTitle()).toContain(tooltipTitle);
                        }
                        expect(cmp.getHtml()).toContain(tooltip);

                    })
            }
            if(highlightedItem){
                var instances;
                //if field - get second number, else 1
                var highlihtedDimension = 0;
                if(highlightedItem.constructor === Array){
                    highlihtedDimension = highlightedItem[1];
                    highlightedItem = highlightedItem[0];
                }
                ST.component(chart.replace('-main', ''))
                    .and(function(el){
                        for(var i = 0; i <el.getSeries()[0].getSurface().getItems().length; i++){
                            if(el.getSeries()[0].getSurface().getItems()[i].type === 'instancing') {
                                instances = el.getSeries()[0].getSurface().getItems()[i].instances;
                                if (highlihtedDimension === 0) {
                                    break;
                                }
                                highlihtedDimension--;
                            }
                            else if(el.getSeries()[0].getSurface().getItems()[i].type === 'lineSeries' || el.getSeries()[0].getSurface().getItems()[i].type === 'radar') {
                                instances = el.getSeries()[0].getSurface().getItems()[i].dataMarker.instances;
                                if (highlihtedDimension === 0) {
                                    break;
                                }
                                highlihtedDimension--;
                            }
                        }
                    })
                    .wait(function(){
                        if(color){
                            return (instances[highlightedItem].fillStyle === color) && instances[highlightedItem].highlighted;
                        }
                        else if(highlightedItem < 0){
                            highlightedItem *= -1;
                            return instances[highlightedItem].brightnessFactor > 0;
                        }
                        else{
                            return instances[highlightedItem].highlighted;
                        }
                    })
                    .and(function(){
                        if(color){
                            expect(instances[highlightedItem].fillStyle).toBe(color);
                            expect(instances[highlightedItem].highlighted).toBe(true);
                        }
                        else if(highlightedItem < 0){
                            expect(instances[highlightedItem].brightnessFactor).toBeGreaterThan(0);
                        }
                        else{
                            expect(instances[highlightedItem].highlighted).toBe(true);
                        }
                    })
            }
            //due to EXTJS-23864
            if(tooltip && Lib.isDesktop){
                ST.component('tooltip[id^=ext-tooltip]:visible')
                    .and(function(cmp){
                        if(cmp.isVisible()){
                            cmp.hide();
                        }
                    })
                    .wait(function(tt){
                        return tt.isHidden();
                    });
            }
            if(!Lib.isDesktop){
                ST.play([
                    { type: "tap", target: chart, x: 0, y: 0}
                ]);
            }
        },

        /**
         * Make zoom by create rectangle by drag & drop from 9.5% of width and height to 85.5%
         * @param element - element where coordinates are counted and swipe is provided
         * @param desc - description for screenShot comparison
         * @param beginPercent - how far (%) from left swipe should begin
         * @param endPercent - how far (%) from the bottom swipe should end
         * @param startX - optional - start X coordinate
         * @param startY - optional - start Y coordinate
         * @param differentScreenshot - optional true for screenShot to be different, false (default) for the same screenshot
         */
        swipeZoom: function(element, desc, beginPercent, endPercent, startX, startY, differentScreenshot){
            var horizontal = 1;
            var vertical = 1;
            var width = 0;
            var height = 0;
            beginPercent = beginPercent/100 || 0.05;
            endPercent = endPercent/100 || 0.95;
            startX = startX || 0;
            startY = startY || height;
            ST.element(element)
                .and(function (p){
                    width = p.dom.scrollWidth * horizontal;
                    height = p.dom.scrollHeight * vertical;

                    var firstPositionHorizontal = beginPercent*width;
                    var secondPositionHorizontal = endPercent*width;

                    var firstPositionVertical = endPercent*height;
                    var secondPositionVertical = beginPercent*height;
                    var offset = 0.05;
                    if(endPercent < beginPercent){
                        offset *= -1;
                    }

                    if (Lib.isDesktop) {
                        ST.play([
                            {type: "mouseenter", target: element, x: startX, y: startY*vertical},
                            {type: "mousedown", target: element, x: startX, y: startY},
                            {type: "mousemove", target: element, x: firstPositionHorizontal, y: firstPositionVertical},
                            {type: "mousemove", target: element, x: firstPositionHorizontal+offset*width, y: firstPositionVertical-offset*height},
                            {type: "mousemove", target: element, x: firstPositionHorizontal + (secondPositionHorizontal - firstPositionHorizontal)/4, y: firstPositionVertical + (secondPositionVertical - firstPositionVertical)/4},
                            {type: "mousemove", target: element, x: firstPositionHorizontal + (secondPositionHorizontal - firstPositionHorizontal)/2, y: firstPositionVertical + (secondPositionVertical - firstPositionVertical)/2}
                        ]);
                        if(desc){
                            Lib.screenshot(desc + '_swipeZoom', undefined, differentScreenshot);
                        }
                        ST.play([
                            {type: "mousemove", target: element, x: firstPositionHorizontal + (secondPositionHorizontal - firstPositionHorizontal)*3/4, y: firstPositionVertical + (secondPositionVertical - firstPositionVertical)*3/4},
                            {type: "mousemove", target: element, x: secondPositionHorizontal, y: secondPositionVertical},
                            {type: "mouseup", target: element, x: secondPositionHorizontal, y: secondPositionVertical},
                            {type: "mouseleave", target: element, x: secondPositionHorizontal, y: secondPositionVertical}
                        ]);
                    }
                    else {
                        ST.play([
                            { type: "tap", target: element, x: startX, y: startY*vertical},
                            {type: "touchstart", target: element, x: startX, y: startY},
                            {type: "touchmove", target: element, x: firstPositionHorizontal, y: firstPositionVertical},
                            {type: "touchmove", target: element, x: firstPositionHorizontal+offset*width, y: firstPositionVertical-offset*height},
                            {type: "touchmove", target: element, x: firstPositionHorizontal + (secondPositionHorizontal - firstPositionHorizontal)/4, y: firstPositionVertical + (secondPositionVertical - firstPositionVertical)/4},
                            {type: "touchmove", target: element, x: firstPositionHorizontal + (secondPositionHorizontal - firstPositionHorizontal)/2, y: firstPositionVertical + (secondPositionVertical - firstPositionVertical)/2}
                        ]);
                        if(desc){
                            Lib.screenshot(desc + '_swipeZoom', undefined, differentScreenshot);
                        }
                        ST.play([
                            {type: "touchmove", target: element, x: firstPositionHorizontal + (secondPositionHorizontal - firstPositionHorizontal)*3/4, y: firstPositionVertical + (secondPositionVertical - firstPositionVertical)*3/4},
                            {type: "touchmove", target: element, x: secondPositionHorizontal, y: secondPositionVertical},
                            {type: "touchend", target: element, x: secondPositionHorizontal, y: secondPositionVertical}
                        ]);
                    }
                    if(desc){
                        Lib.screenshot(desc + '_swipeZoomEnd', undefined, differentScreenshot);
                    }
                })
        },

        /**
         * doubleclick on desktop or mobile devices
         * @param elementWhereDoubleClick
         * @param xCoordinates
         * @param yCoordinates
         */
        doubleClick: function(elementWhereDoubleClick, xCoordinates, yCoordinates){
            if (Lib.isDesktop) {
                ST.play([
                    {type: "dblclick", target: elementWhereDoubleClick, x: xCoordinates, y: yCoordinates}
                ]);
            }
            else {
                ST.play([
                    {type: "tap", target: elementWhereDoubleClick, x: xCoordinates, y: yCoordinates},
                    {type: "tap", target: elementWhereDoubleClick, delay: 10, animation: false, x: xCoordinates, y: yCoordinates}
                ]);
            }
        },

        /**
         * Click on  Zoom (Pan) button, check if has cls 'x-pressed' and Pan (Zoom) doesn't.
         * Click on the second button and check if Pan (Zoom) is selected and Zoom (Pan) is not.
         * @param isZoomSelected - optional true, if Zoom is selected, otherwise suppose, that Pan is selected
         * @param zoomButtonText - optional
         * @param panButtonText - optional
         */
        panZoomButtons: function(isZoomSelected, panButtonText, zoomButtonText){
            if(!Lib.isDesktop){
                pending("Pan and Zoom buttons are not present on touch devices");
            }

            panButtonText = panButtonText || 'Pan';
            zoomButtonText = zoomButtonText || 'Zoom';
            isZoomSelected = isZoomSelected || false;

            if(isZoomSelected){
                var temp = panButtonText;
                panButtonText = zoomButtonText;
                zoomButtonText = temp;
            }

            //change button
            ST.button(Components.button(zoomButtonText))
                .visible()
                .click()
                .hasCls('x-pressed');

            ST.button(Components.button(panButtonText))
                .visible()
                .missingCls('x-pressed');

            //change back to initial state
            ST.button(Components.button(panButtonText))
                .visible()
                .click()
                .hasCls('x-pressed');
            ST.button(Components.button(zoomButtonText))
                .visible()
                .missingCls('x-pressed');
        },

        /**
         * function provides pan with following parameters, screenshot after pan and screenshot after restoring initial state
         * optionaly is possible to click to zoom for pan to be working, in the end for unzoom again
         * @param desc - description for screenShot comparison
         * @param graphId - ID of graph which want to pan
         * @param firstDirection - optional - default '-1' means left or up, '1' means right or down
         * @param isVertical - optional - default is horizontal, if value is 'true', than pan is provided verticaly
         * @param twoTimesBack - optional - if going back should be provided 2 times for beeing sure, that initial state is properly restored
         * be careful - it is setting for zoomButton (if provided) too
         * @param zoomButton - optional - text on button for zoom, there is zoom before start pan and in the end for restore
         * @param panButton - optional - text on button for pan, there is click on it for start pan
         */
        pan: function(desc, graphId, firstDirection, isVertical, twoTimesBack, zoomButton, panButton){
            if(zoomButton !== undefined){
                ST.button(Components.button(zoomButton))
                    .click();
                if (Lib.isDesktop) {
                    justSwipe(graphId, firstDirection, isVertical);
                }
                else{
                    pending('can\'t simulate zoom on touchDevices - ORION-1113');
                    return;
                }
                panButton = panButton || 'Pan';
            }
            if(panButton !== undefined) {
                ST.button(Components.button(panButton))
                    .click();
            }

            firstDirection = firstDirection || -1;
            justSwipe(graphId, firstDirection, isVertical);
            Lib.screenshot(desc + '_pan1');
            justSwipe(graphId, firstDirection*(-1), isVertical);
            if(twoTimesBack) {
                justSwipe(graphId, firstDirection*(-1), isVertical); // just for sure
            }
            Lib.screenshot(desc + '_pan2');

            //end with zoomButton selected if provided
            if(zoomButton !== undefined){
                ST.button(Components.button(zoomButton))
                    .click();
                justSwipe(graphId, firstDirection*(-1), isVertical);
                //when use zoom in pan function, it should be at the end in initial state, so it will un-zoom as much as possible
                justSwipe(graphId, firstDirection*(-1), isVertical);
                justSwipe(graphId, firstDirection*(-1), isVertical); // just for sure
            }
        },

        /**
         * function provides zoom with following parameters, screenshot after zoom and screenshot after un-zoom
         * zoom is not supported on touch-devices now, optionaly is possible to click on zoom and pan button if needed to start zoom or restore initial state
         * @param desc - description for screenShot comparison
         * @param graphId - ID of graph which want to pan
         * @param firstDirection - optional - default '-1' means left or up, '1' means right or down
         * @param isVertical - optional - default is horizontal, if value is 'true', than pan is provided verticaly
         * @param twoTimesBack - optional - if going back should be provided 2 times for beeing sure, that initial state is properly restored
         * @param zoomButton - optional - text on button for zoom, there is click on it for start zooming
         * @param panButton - optional - text on button for pan, there is click on it and move for initial coordinates
         */
        zoom: function(desc, graphId, firstDirection, isVertical, twoTimesBack, zoomButton, panButton){
            if(zoomButton !== undefined){
                ST.button(Components.button(zoomButton))
                    .click();
            }

            if (Lib.isDesktop) {
                justSwipe(graphId, firstDirection, isVertical);
                Lib.screenshot(desc + '_zoom1');
                justSwipe(graphId, firstDirection*(-1), isVertical);
                if(twoTimesBack) {
                    justSwipe(graphId, firstDirection*(-1), isVertical);
                    justSwipe(graphId, firstDirection*(-1), isVertical);
                }
                Lib.screenshot(desc + '_zoom2');

                if(panButton){
                    ST.button(Components.button(panButton))
                        .click();
                    justSwipe(graphId, firstDirection*(-1), isVertical);
                    justSwipe(graphId, firstDirection*(-1), isVertical);
                    justSwipe(graphId, firstDirection*(-1), isVertical); // back to initial state, but it is zoomed and can't to un-zoom to exact initial state
                }
            }
            else {
                pending('can\'t simulate zoom on touchDevices - ORION-1113');
                // swipe(graph_id, -1);
                // Lib.screenshot(desc + '_zoomMobile');
                // swipe(graph_id, 1);
            }
        },


        rotate: function(desc, graph_id, beginCoordination, endCoordination){
            beginCoordination = beginCoordination || 35;
            endCoordination = endCoordination || 65;
            var rotation;
            var newRotation;
            ST.component('polar')
                .and(function(p){
                    rotation = p.getSeries()[0].getRotation();
                    Lib.Chart.swipeZoom(graph_id, desc, beginCoordination, endCoordination);
                })
                .wait(function(p){
                    newRotation = p.getSeries()[0].getRotation();
                    return newRotation !== rotation;
                })
                .and(function(){
                    expect(rotation).not.toBe(newRotation);
                    Lib.Chart.swipeZoom(graph_id, desc, endCoordination, beginCoordination);
                })
                .wait(function(p){
                    rotation = p.getSeries()[0].getRotation();
                    rotation = Math.round(newRotation * 10) / 10;
                    return newRotation !== rotation;
                })
                .and(function(){
                    expect(rotation).not.toBe(newRotation);
                });
        },

        biggerSector: function(componentName, xCoordinates, yCoordinates, instance, tooltip, margin, marginAfter){
            margin = margin || 20;
            instance = instance || 0;
            marginAfter = marginAfter || 0;
            var instances;
            ST.component(componentName)
                .and(function (c) {
                    instances = c.getSeries()[0].getSurface().getItems();
                    expect(instances[instance].attr.margin).toBe(0);

                    if (Lib.isDesktop) {
                        ST.play([
                            {type: "mouseenter", target: '#' + c.getId() + '-main', x: xCoordinates, y: yCoordinates},
                            {type: "mousemove", target: '#' + c.getId() + '-main', x: xCoordinates, y: yCoordinates}, //has to be more, if not - it doesn't work properly
                            {type: "mouseover", target: '#' + c.getId() + '-main', x: xCoordinates + marginAfter, y: yCoordinates + marginAfter},
                            {type: "mousemove", target: '#' + c.getId() + '-main', x: xCoordinates + marginAfter, y: yCoordinates + marginAfter}
                        ]);
                    }
                    else {
                        ST.play([
                            {type: "tap", target: '#' + c.getId() + '-main', x: xCoordinates, y: yCoordinates}
                        ]);
                    }
                })

                .wait(function (el) {
                    instances = el.getSeries()[0].getSurface().getItems();
                    return instances[instance].attr.margin === margin;
                })
                .and(function (c) {
                    expect(instances[instance].attr.margin).toBe(margin);

                    if(Lib.isDesktop && tooltip){
                        ST.component('tooltip[id^=ext-tooltip]:visible')
                            .and(function(cmp){
                                if(cmp.isVisible()){
                                    cmp.hide();
                                }
                            })
                            .wait(function(tt){
                                return tt.isHidden();
                            });
                    }

                    ST.play([
                        {type: "tap", target: '#' + c.getId() + '-main', x: 0, y: 0}
                    ]);
                });



        },

        /**
         * Compare 2 fields with charts values
         * @param field1
         * @param field2
         * @returns {boolean} - 'true' if are the same or 'false' when different
         */
        compareFields: function(field1, field2){
            var isEqual = true;
            for(var i = 0; i < field1.length; i++){
                if(field1[i].g0 !== field2[i].g0){
                    isEqual = false;
                }
                else if(field1[i].g1 !== field2[i].g1){
                    isEqual = false;
                }
                else if(field1[i].g2 !== field2[i].g2){
                    isEqual = false;
                }
                else if(field1[i].g3 !== field2[i].g3){
                    isEqual = false;
                }
                else if(field1[i].g4 !== field2[i].g4){
                    isEqual = false;
                }
                else if(field1[i].g5 !== field2[i].g5){
                    isEqual = false;
                }
                else if(field1[i].g6 !== field2[i].g6){
                    isEqual = false;
                }
            }
            return isEqual;
        }
    },
    Lists: {
        /**
         * Returns index of listitem identified by filter function
         * @param listLocator - query for list
         * @param filterFn - function used for store's findBy method - details in docs
         * @return index of item or -1 if not found
         * Help for filterFn - http://docs.sencha.com/extjs/6.5.0/modern/Ext.data.Store.html#method-findBy
         */
        getIndexByText: function (listLocator, filterFn) {
            var list = Ext.first(listLocator),
                store = list.getStore();
            return store.findBy(filterFn);
        },
        /**
         * Returns listitem component identified filter function
         * @param listLocator - query for list
         * @param filterFn - function used for store's findBy method - details in docs
         * @return ST.component of found listitem
         * Help for filterFn - http://docs.sencha.com/extjs/6.5.0/modern/Ext.data.Store.html#method-findBy
         */
        getListItemByText: function (listLocator, filterFn) {
            var index = Lib.Lists.getIndexByText(listLocator, filterFn);
            return ST.component(listLocator + 'simplelistitem[recordIndex=' + index + ']');
        },
        /**
         * Returns listitem component identified by it's id
         * @param index - list item index
         * @param listLocator - query for list
         * @return ST.component of found listitem
         */
        getListItemByIndex: function (index, listLocator) {
            return ST.component((listLocator ? listLocator : "") + 'simplelistitem[recordIndex=' + index + ']');
        },
        /**
         * Drags list item to the left by deltaX pixels
         * @param listitem - listitem object to drag
         * @param deltaX - number of pixels to move listitem element to the left
         */
        dragLeftBy: function (listitem, deltaX) {
            Lib.DnD.dragBy(listitem, -deltaX, 0, null, null, true);
        },
        /**
         * Drags list item to the right by deltaX pixels
         * @param listitem - listitem object to drag
         * @param deltaX - number of pixels to move listitem element to the right
         */
        dragRightBy: function (listitem, deltaX) {
            Lib.DnD.dragBy(listitem, deltaX, 0, null, null, true);
        }
    },
    /**
     * Waiting on finish all of animations
     * Note: They should be added immediately after the event, where disappears element while clicking
     */
    waitOnAnimations: function(){
        return ST.wait(function(){
        	return !Ext.AnimationQueue.isRunning;
        });
    },
    /**
     * Create an event in monthly or weekly or daily view for all devices
     * Desktops are creating due to DnD, Tablets and Mobiles are creating due to Add buttons
     * @param eventName - name of created event
     * @param rowStart - starting point of the event, 0-based coord in calendar grid
     * @param rowEnd - end point of the event
     * @param colStart - starting col of the event
     * @param colEnd - end point of the event
     * @param type - choose calendar view type 0 = monthview, 1 = weekview, 2 = dayview
     * @param calendarId[String] - allows you to change target calendar when creating new event
     */
    createEvent: function(eventName, rowStart, rowEnd, colStart, colEnd, type, calendarId){
        rowStart = rowStart||0;
        colStart = colStart||0;
        rowEnd = rowEnd||0;
        colEnd = colEnd||0;
        rowStart = rowStart < 0 ? 0 : rowStart;
        colStart = colStart < 0 ? 0 : colStart;
        rowEnd = rowEnd < 0 ? 0 : rowEnd;
        colEnd = colEnd < 0 ? 0 : colEnd;
        var index = type;
        if (typeof(index) === 'undefined' || index < 0 || index > 2){
            index = 0;
            var xTypes = ['calendar-monthview', 'calendar-weekview', 'calendar-dayview'];
            while ( Ext.ComponentQuery.query('calendar-multiview')[0].child().child().xtype !== xTypes[index] && index < 3){
                index++;
            }
        }
        function createFn(row,col){
            var xPaths = [
                'calendar-monthview => tr[data-week="'+row+'"] td.x-calendar-weeks-cell[data-index="'+col+'"]',
                '=>td.x-calendar-days-day-column[data-index="'+col+'"] div.x-calendar-days-marker:nth-child('+(row+1)+')',
                '=>td.x-calendar-days-day-column[data-index="0"] div.x-calendar-days-marker:nth-child('+(row+1)+')'
            ];
            return xPaths[index];
        }
        var getDomEl = createFn(rowStart,colStart);
        var getDomEl1 = createFn(rowEnd,colEnd);
        if (Lib.isDesktop){//&& !ST.isWindows){
            ST.play([
                {type: "mousedown", target: getDomEl, x: 1, y: 1, detail: 1},
                {type: "mousemove", target: getDomEl, x: 5, y: 5, buttons: 1},
                {type: "mousemove", target: getDomEl1, x: 5, y: 5, buttons: 1},
                {type: "mouseup", target: getDomEl1, x: 5, y: 5, detail: 1}
            ]);
        } else {
		    ST.button('[_handler=onCreateTap]').click();
            Lib.waitOnAnimations();
            if(index !== 0){
		        if(Lib.isPhone){
                    ST.component('calendar-form-add fieldset').and(function(){
                        this.future.cmp.getScrollable().getScrollElement().dom.scrollTop = 200;
                    });
                }
		        ST.component('checkboxfield[id^=ext-checkbox]').down('>>input.x-input-el').click();
                Lib.waitOnAnimations();
                ST.component('calendar-timefield[_name=endTime]').visible().click();
                Lib.waitOnAnimations();
		        if(Lib.isPhone){
			        /*
		            var oneTap = {type: 'tap', target: 'pickerslot', x: 150, y: 120};
			        var allPlay = [];
			        allPlay[0] = oneTap;
			        for(var i = 1; i < (rowEnd - rowStart) * 4 + 1; i++){
				        allPlay[i] = oneTap;
			        }
			        ST.play(allPlay);
			        */

                    ST.component('calendar-timefield[_name=endTime]')
                        .wait(function(){
                            return Ext.first('calendar-timefield[_name=endTime]').getPicker().isHidden() === false;
                        })
                        .and(function(){
                            var time = new Date();
                            time.setHours(rowEnd);
                            time.setMinutes(15);
                            Ext.first('calendar-timefield[_name=endTime]').setValue(time);

                            var picker = Ext.first('calendar-timefield[_name=endTime]').getPicker();
                            if(!picker.isHidden()){
                                picker.hide();
                            }
                        });

                    ST.component('calendar-form-add fieldset').and(function(){
                        this.future.cmp.getScrollable().getScrollElement().dom.scrollTop = 0;
                    });

		        } else {
			        ST.dataView('list').itemAt(rowEnd*4).reveal().visible().click();
		        }
            } else {
                var d = new Date();
                var datePanelPicker;
                if(Lib.isPhone){
                    datePanelPicker = "datepicker";
                }
                else{
                    datePanelPicker = "datepanel";
                }

                Lib.waitOnAnimations();
                ST.component('datepickerfield[_name=startDate]').visible().click();
                Lib.waitOnAnimations();
		        ST.element(getDomEl + ' span.x-calendar-weeks-day-text').and(function(domEl){
                    //hide picker
                    if(Lib.isPhone){
                        Lib.waitOnAnimations();
                        //should be better location
                        ST.component('button[text=Done]:first')
                            .click();
                    }
                    else{
                        var picker = Ext.first('datepickerfield[_name=startDate]');
                        if(!picker.isHidden()){
                            picker.getPicker().hide();
                        }
                    }
                    Lib.waitOnAnimations();
                    d.setDate(domEl.dom.textContent);
                    Ext.first(datePanelPicker + ':first').setValue(d);
                });
                Lib.waitOnAnimations();

                ST.component('datepickerfield[_name=endDate]').visible().click();
                Lib.waitOnAnimations();
		        ST.element(getDomEl1 + ' span.x-calendar-weeks-day-text').and(function(domEl){
                    //hide picker
                    if(Lib.isPhone){
                        Lib.waitOnAnimations();
                        ST.component('button[text=Done]:last')
                            .click();
                    }
                    else{
                        var picker = Ext.first('datepickerfield[_name=endDate]');
                        if(!picker.isHidden()){
                            picker.getPicker().hide();
                        }
                    }
                    Lib.waitOnAnimations();
                    d.setDate(domEl.dom.textContent);
                    Ext.first(datePanelPicker + ':last').setValue(d);
                });
            }
	    }
        // change target calendar (Work, Personal) if needed
        if (calendarId) {
            // need to wait until form is scrolled back to top, otherwise click event isn't performed properly
            ST.textField('calendar-form-add textfield[name="calendarId"]').wait(100).visible().click();
            if (Lib.isPhone) {
                ST.component('pickerslot[name=calendarId]')
                    .and(function (slot) {
                        var calIndex, store, item;
                        store = slot.getStore();
                        calIndex = store.find('title', calendarId);
                        item = slot.getItemAt(calIndex === -1 ? 0 : calIndex);
                        item = Ext.get(item);
                        slot.scrollToItem(item);
                        ST.element(item).click();
                        ST.button('picker[userCls=x-calendar-picker-list] button[text=Done]')
                            .click();
                    });
            } else {
                ST.element('simplelistitem{_record.get("title")==="' + calendarId + '"}')
                .click();               
            }

        }
        ST.textField("textfield[name=title]")
        //mute due to ORION-1666
        //.type(eventName);
            .and(function(){
                Ext.first('textfield[name=title]').setValue(eventName);
            });
        //Lib.ghostClick("button[text=Save]");
        ST.button("button[text=Save]").click();
    },
    /**
     * Create an event in monthly view
     * @param eventName - Name of the event
     * @param rowStart - starting point of the event, 0-based coord in calendar grid
     * @param colStart - starting col of the event
     * @param rowEnd - end point of the event
     * @param colEnd - end point of the event     *
     * @param calendarId[String] - allows you to change target calendar when creating new event
     */
    createMonthlyEvent: function(eventName, rowStart, colStart, rowEnd, colEnd, calendarId) {
        Lib.createEvent(eventName, rowStart, rowEnd, colStart, colEnd, 0, calendarId);
    },
    /**
     * Create an event in weekly view
     * @param eventName - Name of the event
     * @param rowStart - starting point of the event, 0-based coord in calendar grid
     * @param rowEnd - end point of the event
     * @param dayN - number of the day in the view
     * @param calendarId[String] - allows you to change target calendar when creating new event
     */
    createWeeklyEvent: function(eventName, rowStart, rowEnd, dayN, calendarId) {
        Lib.createEvent(eventName, rowStart, rowEnd, dayN, dayN, 1, calendarId);
    },
    /**
     * Create an event in day view
     * @param eventName - Name of the event
     * @param rowStart - starting point of the event, 0-based coord in calendar grid
     * @param rowEnd - end point of the event
     * @param calendarId[String] - allows you to change target calendar when creating new event
     * @param calendarId[String] - allows you to change target calendar when creating new event
     */
    createDailyEvent: function(eventName, rowStart, rowEnd, calendarId) {
        Lib.createEvent(eventName, rowStart, rowEnd, 0, 0, 2, calendarId);
    },
    /**
     * Resize the event within calendar component with specific name (first case) by value for daily and weekly views
     * @param eventName - Name of the event
     * @param stepMove - resize by step, 1 step is 30 minutes
     * @return {ST.element} - modified the event
     */
    resizeEventByDnD: function(eventName, stepMove){
	    ST.element('calendar-event[title='+eventName+']:first').and(function(){
		    var dx = this.future.el.dom.offsetWidth / 2;
		    var dy = this.future.el.dom.offsetHeight / 2;
		    ST.play([{type: 'mouseover', target: this.future.el, x: dx, y: dy, detail: 1}]);
		    ST.element('calendar-event[title=' + eventName + ']:first => div.x-calendar-event-resizer')
                .and(function(){
                    this.future.el.dom.style.display = 'block';
                    Lib.DnD.dragBy(this.future.el, 0, stepMove*21);
                })
                .wait(1);
	    });
        return ST.element('calendar-event[title='+eventName+']:first');
    },
    /**
     * Delete an event within calendar component with specific name
     * @param event_name name of deleted event
     */
    deleteEvent: function(event_name){
        Lib.ghostClick("calendar-event[title=" + event_name + "]:first", true);
        //Lib.ghostClick("button[text=Delete]:first");
        ST.button("button[text=Delete]:first").click();
    },
    D3: {
        /**
         * function for setting delay and redirecting for D3 charts
         * @param redirectName
         * @param componentToBeVisible - optional
         * @param delay - optional
         */
        beforeAll: function(redirectName, componentToBeVisible, delay){
            Lib.beforeAll(redirectName, componentToBeVisible, delay);
        },

        /**
         * function for destroy D3 chart after D3 chart example + setting delay back to default value
         * @param componentNameToDestroy - optional
         */
        afterAll: function(componentNameToDestroy){
            Lib.afterAll(componentNameToDestroy);
            if(Ext.first("tooltip[id^=ext-tooltip]") !== null) {
                Ext.first("tooltip[id^=ext-tooltip]").destroy();
            }
            // ST.component("tooltip[id^=ext-tooltip]")
            //     .and(function (tooltip) {
            //         tooltip.destroy();
            //     });
        },

        /**
         * Parse and create tuple with coordinates from given text
         * @param text text that looks like '*(xCoordinate,yCoordinate)*' or '*(xCoordinate yCoordinate)*'
         * @param paddingX - optional - value is added to x coordinate or 0 if not set
         *                      paddingX could be a tuple {x: x, y: y}
         * @param paddingY - optional - value is added to y coordinate or paddingX is provided if not set
         * @returns {{x: *, y: *}}
         */
        tupleFromText: function(text, paddingX, paddingY){
            var x, y, txt;
            if (paddingX === undefined) {
                paddingX = 0;
            }
            if (paddingY === undefined) {
                paddingY = paddingX;
            }
            txt = text.split("(")[1].split(")")[0];
            var splitCharacter = ',';
            if(text.indexOf(',') == -1) splitCharacter = ' '; //IE has spaces
            x = parseFloat(txt.split(splitCharacter)[0]);
            y = parseFloat(txt.split(splitCharacter)[1]);

            if(paddingX instanceof Object){
                return {x:x + paddingX.x, y:y + paddingX.y};
            }
            return {x:x + paddingX, y:y + paddingY};
        },

        /**
         * Calculate polar coordinates (x and y) from cartesian (radius and angle)
         * @param radius
         * @param angle
         * @returns {{x: number, y: number}}
         */
        polarToCartesian: function(radius, angle){
            var x = radius * Math.cos((Number(angle) * (Math.PI / 180)));
            var y = radius * Math.sin((Number(angle) * (Math.PI / 180)));

            return {
                x: x,
                y: y
            };
        },

        /**
         * Get index into field where elementText is part of field[i].data.innerHTML or field[i].data.id
         * @param field
         * @param elementText
         * @returns {index}
         */
        getIndex: function(field, elementText){
            var fieldElement;
            for(var i = 0; i < field.length; i++){
                fieldElement = field[i].data.innerHTML || field[i].data.id;
                if(fieldElement.indexOf(elementText) >= 0){
                    return i;
                }
            }
            return false;
        },

        /**
         * Click on given element or coordinates and check if x-d3-selected appear
         * @param d3ChartType - d3Chart where click is provided
         * @param counter - order of element ( OR dara-id of element ) where click should be provided
         * @param padding - optional - padding of d3Chart (has affect only when coordinates variable is not set
         *                  padding could be a tuple {x: x, y: y}
         * @param coordinates - optional - tuple with coordinates looks like {x: *, y: *}
         *                      if not set, Lib.D3.tupleFromText is called with element's attribute '.dom.attributes.transform.value'
         */
        clickOnCoordinates: function(d3ChartType, counter, padding, coordinates){
            padding = padding || 0;
            ST.component(Ext.first(d3ChartType).parent)
                .and(function(panel){
                    var element = d3ChartType + " => .x-d3-node[data-id=" + counter + "]";
                    if(Number(counter)){
                        element = d3ChartType + " => .x-d3-node:nth-child(" + counter + ")";
                    }
                    ST.element(element)
                        .and(function(node){
                            coordinates = coordinates || Lib.D3.tupleFromText(node.dom.attributes.transform.value, padding);
                            ST.component("panel[id=" + panel.getId() + "]")
                                .click(coordinates)
                                .and(function(){
                                    expect(node.dom.className.baseVal).toContain("x-d3-selected");
                                })
                        })
                })
        },

        /**
         * Check if text of tooltips contain provided one
         * @param desc - description for screenshot
         * @param d3ChartType - d3Chart where mouseover is provided
         * @param counter - order of element ( OR dara-id of element ) where click should be provided
         * @param padding - optional - padding of d3Chart (has affect only when coordinates variable is not set
         * @param tooltipSubstring - part of tooltip appears when mouseover given element in counter parameter
         * @param coordinates - optional - tuple with coordinates looks like {x: *, y: *}
         *                      if not set, Lib.D3.tupleFromText is called with element's attribute '.dom.attributes.transform.value'
         */
        checkTooltipsOnCoordinates: function(desc, d3ChartType, counter, padding, tooltipSubstring, coordinates){
            padding = padding || 0;
            ST.component(Ext.first(d3ChartType).parent)
                .and(function(panel){
                    var element = d3ChartType + " => .x-d3-node[data-id=" + counter + "]";
                    if(Number(counter)){
                        element = d3ChartType + " => .x-d3-node:nth-child(" + counter + ")";
                    }
                    ST.element(element)
                        .and(function(node){
                            var coords = coordinates || Lib.D3.tupleFromText(node.dom.attributes.transform.value, padding);
                            ST.component("panel[id=" + panel.getId() + "]")
                                .and(function(){
                                    Lib.Chart.mouseover(desc, d3ChartType, coords.x, coords.y);
                                    ST.component("tooltip[id^=ext-tooltip]")
                                        .and(function(cmp){
                                            expect(cmp._html).toContain(tooltipSubstring);
                                        })
                                })
                        })
                })
        },

        /**
         * Expand or (collapse) node by dblclick and check if class x-d3expanded is (or is not) provided
         * @param d3ChartType - d3Chart where mouseover is provided
         * @param counter - order of element ( OR dara-id of element ) where dblclick should be provided
         * @param paddingX - optional - padding X coordinates, 0 if not set
         * @param paddingY - optional - padding Y coordinates, paddingX if not set
         */
        expandCollapseNode: function(d3ChartType, counter, paddingX, paddingY){
            var willBeExpanded = 1;
            ST.element(d3ChartType + " => .x-d3-node:nth-child(" + counter + ")")
                .and(function(node){
                    if(node.dom.className.baseVal.indexOf('x-d3-expanded') >= 0){
                        willBeExpanded = 0;
                    }
                    var coords = Lib.D3.tupleFromText(node.dom.attributes.transform.value, paddingX, paddingY);
                    Lib.Chart.doubleClick(d3ChartType, coords.x, coords.y);
                })
                .wait(Ext.first('d3-pack').getTransitions().layout.duration)
                .and(function(node){
                    if(willBeExpanded) {
                        expect(node.dom.className.baseVal).toContain("x-d3-expanded");
                    }
                    else{
                        expect(node.dom.className.baseVal).not.toContain("x-d3-expanded");
                    }
                })
        },

        waitDuration: function(componentName){
            return Ext.first(componentName).getTransitions().layout.duration;
        }
    },
    /**
    * Clones the store so it can be restored, data are stored in testfile scope
    * @param cmpName - locator of component which store is to be cloned
    */
    cloneStore: function (cmpName) {
        var name = Ext.String.createVarName(cmpName+'Data');
        var outData = []
        this[name] = outData;
        return ST.component(cmpName)
            .visible()
            .wait(function (cmp) {
                // make sure store is loaded before we start manipulating it
                var store = cmp.getStore();
                return store&&store.isLoaded()&&store.getData().length>1;
            })
            .and(function (cmp) {
                var store = cmp.getStore(),
                    data = store.getData(),
                    n = data.length,
                    i;
                for(i=0;i<n;i++){
                    outData.push(Ext.clone(data.items[i]));
                }
                document[name] = outData;
            }).wait(100);
    },
    /**
     * Restores data
     * @param cmpName - locator of component which store is to be restored
     */
    restoreStore: function (cmpName) {
        var name = Ext.String.createVarName(cmpName+'Data');
        return ST.component(cmpName)
            .and(function (cmp) {
                cmp.getStore().setData(document[name]);
                delete document[name];
            });

    }
};


/**
 ********************************************************************************************************************
 * help functions - don't use them directly
 ********************************************************************************************************************
 */

/**
 ********************************************************************************************************************
 * datepicker functions - don't use them directly
 ********************************************************************************************************************
 */
/**
 * help function for chooseDayInDatepicker, chooseDateInDatepickerDate, chooseDateInDatepicker
 */
function chooseDayInDatepickerProcedure(day, panelTitle, messageBox) {
    //setting up variables
    var datepickerId = Ext.ComponentQuery.query("datepicker")[0].id;
    if (day === undefined) {
        day = 1;
    }
    if (panelTitle !== undefined) {
        datepickerId = Ext.ComponentQuery.query("panel[title=" + panelTitle + "] datepicker")[0].id;
    }
    //indexes for cycle
    var dayIndex = 0;
    var dayIndexInsideAnd = 0;
    //indicator for stop doing job after job is done
    var searching = true;
    //7 days in one week
    for (var i = 0; i < 7; i++) {
        //searching through first week to find 1st day of the month
        ST.element('@' + datepickerId + "-cell-" + dayIndex++)
            .and(function (element) {
                //first day with following class will lead us to wanted day of the month
                if (searching && element.hasCls('x-datepicker-active')) {
                    if(messageBox === undefined) {
                        ST.element('@' + datepickerId + "-cell-" + (dayIndexInsideAnd + day - 1))
                            .click();
                    }
                    else{
                        ST.play([
                            { type: "click", target: '@' + datepickerId + "-cell-" + (dayIndexInsideAnd + day - 1)},
                            { animation: null, delay: 1000, target: "@msg-div", fn: function (done) {
                                expect(this.targetEl.dom.textContent).toMatch(messageBox);
                                done();
                            }}
                        ]);
                    }
                    //job is done
                    searching = false;
                }
                dayIndexInsideAnd++;
            });
    }
}

/**
 ********************************************************************************************************************
 * datepicker functions - don't use them directly
 ********************************************************************************************************************
 */
/**
 * help function for chooseMonthAndYearInDatepicker, chooseDateInDatepickerDate, chooseDateInDatepicker
 */
function chooseMonthAndYearInDatepickerProcedure(month, year, panelTitle, clickOnSplitButton, buttons) {
    //setting up variables
    if(month === undefined){
        month = 1;
    }
    if(year === undefined){
        year = 2012;
    }
    if(clickOnSplitButton || clickOnSplitButton === undefined){
        ST.button(panelTitle + " splitbutton[tooltip ^= Choose]")
            .visible()
            .click();
    }
    var okButton;
    if(buttons || buttons === undefined){
        okButton = ST.button(panelTitle + " => div.x-monthpicker-buttons a:nth-child(1)");
    }
    var yearsInMonthPicker = 10;
    //index is from 0, but I am using index+2, because first two elements are '<<' and '>>' button
    //so in field definition are right indexes- counting is like 2,4,6,8,10,3,5,7,9,11 because of 2 columns
    var yearIndexes = [2,4,6,8,10,3,5,7,9,11];
    //indexes in monthIndexes are little bit different from yearIndexes
    var monthIndexes = [1,3,5,7,9,11,2,4,6,8,10,12];
    var yearObject = {
        choosingYear: function(){
            return ST.component(panelTitle + " => div.x-monthpicker-years");
        },
        //type is 'prev' or 'next'
        changeYearPalet: function(type){
            return ST.component(panelTitle + " => div.x-monthpicker-yearnav-button-ct a.x-monthpicker-yearnav-" + type);
        }
    };
    //choose month
    ST.element(panelTitle + " => div.x-monthpicker-months div.x-monthpicker-item:nth-child(" + monthIndexes[month - 1] + ")").visible().click();

    //choose year
    yearObject.choosingYear().and(function(component){
        var activeYear = component.activeYear;

        //cycle for going to the history
        while(activeYear > year){
            (yearObject.changeYearPalet('prev')).visible().click().wait(100);
            activeYear -= yearsInMonthPicker;
        }
        //cycle for going to the future
        //activeYear + yearsInMonthPicker because I wanna see last visible year
        while(activeYear + yearsInMonthPicker < year){
            (yearObject.changeYearPalet('next')).visible().click().wait(100);
            activeYear += yearsInMonthPicker;
        }

        //choose year
        ST.element(panelTitle + " => div.x-monthpicker-years div.x-monthpicker-item:nth-child(" + yearIndexes[year - activeYear] + ")").visible().click();

        //if buttons are present - click on it
        if(buttons){
            okButton.visible().click();
        }
    });
}

/**
 ********************************************************************************************************************
 * datepicker functions - don't use them directly
 ********************************************************************************************************************
 */
/**
 * help function for moveButtons
 */
function justMoveButton(button, xCoordinates, moveX, direction){
    if(direction > 0){
        moveX += xCoordinates;
    }
    ST.component(button).focus().focused();

    if(Lib.isDesktop) {
        ST.play([
            // press button
            { type: "mousedown", target: button, x: xCoordinates, detail: 1 },
            { type: "mousemove", target: button, x: xCoordinates, buttons: 1 },
            { type: "mousemove", target: button, x: moveX*direction, buttons: 1 },
            { type: "mouseup", target: button, x: xCoordinates, detail: 1 }
        ]);
    }
    //tablets and mobiles use click for showing tooltips
    else{
        ST.play([
            // press button
            { type: "touchstart", target: button, x: xCoordinates, detail: 1 },
            { type: "touchmove", target: button, x: xCoordinates, buttons: 1 },
            { type: "touchmove", target: button, x: moveX*direction, buttons: 1 },
            { type: "touchend", target: button, x: xCoordinates, detail: 1 }
        ]);
    }

    ST.component(button).focus().focused();
}

/**
 *
 * @param element
 * @param direction - positive or negative direction
 * @param isVertical - true or false
 * @param firstPosition - optional
 * @param secondPosition - is set when firstPosition is set
 */
function justSwipe(element, direction, isVertical, firstPosition, secondPosition){
    var horizontal = 1;
    var vertical = 0;
    if(isVertical){
        horizontal = 0;
        vertical = 1;
    }
    var width = 0;
    var height = 0;
    var move;
    ST.element(element)
    //.focus()
        .and(function (p){
            width = p.dom.scrollWidth * horizontal;
            height = p.dom.scrollHeight * vertical;
            move = width;
            var initialPosition = 0;
            if(isVertical){
                move = height;
                initialPosition = 0;
            }

            if(firstPosition === undefined) {
                firstPosition = 0.2 * move;
                secondPosition = 0.8 * move;
                if(direction < 0) {
                    initialPosition = width;
                    if (isVertical) {
                        initialPosition = height;
                    }
                }
            }
            else{
                initialPosition = firstPosition;
            }

            if(direction < 0){
                var temp = firstPosition;
                firstPosition = secondPosition;
                secondPosition = temp;
            }

            if (Lib.isDesktop) {
                ST.play([
                    {type: "mouseenter", target: element, x: initialPosition*horizontal + 1, y: initialPosition*vertical},
                    {type: "mousemove", target: element, x: firstPosition*horizontal + 1, y: firstPosition*vertical},
                    {type: "mouseover", target: element, x: firstPosition*horizontal + 1, y: firstPosition*vertical},
                    {type: "mouseover", target: element, x: firstPosition*horizontal + 1, y: firstPosition*vertical},
                    {type: "mousedown", target: element, x: firstPosition*horizontal + 1, y: firstPosition*vertical},
                    {type: "mousemove", target: element, x: firstPosition*horizontal + 1, y: firstPosition*vertical},
                    {type: "mousemove", target: element, x: firstPosition*horizontal+0.1*width*horizontal*direction, y: firstPosition*vertical+0.1*height*vertical*direction},
                    {type: "mousemove", target: element, x: firstPosition*horizontal + (secondPosition*horizontal - firstPosition*horizontal)/4, y: firstPosition*vertical + (secondPosition*vertical - firstPosition*vertical)/4},
                    {type: "mousemove", target: element, x: firstPosition*horizontal + (secondPosition*horizontal - firstPosition*horizontal)*3/4, y: firstPosition*vertical + (secondPosition*vertical - firstPosition*vertical)*3/4},
                    {type: "mousemove", target: element, x: secondPosition*horizontal, y: secondPosition*vertical},
                    {type: "mouseup", target: element, x: secondPosition*horizontal, y: secondPosition*vertical},
                    {type: "mouseleave", target: element, x: secondPosition*horizontal, y: secondPosition*vertical}
                ]);
            }
            else {
                ST.play([
                    {type: "tap", target: element, x: initialPosition*horizontal + 1, y: initialPosition*vertical},
                    {type: "touchmove", target: element, x: firstPosition*horizontal + 1, y: firstPosition*vertical},
                    {type: "touchmove", target: element, x: firstPosition*horizontal + 1, y: firstPosition*vertical},
                    {type: "touchstart", target: element, x: firstPosition*horizontal + 1, y: firstPosition*vertical},
                    {type: "touchmove", target: element, x: firstPosition*horizontal + 1, y: firstPosition*vertical},
                    {type: "touchmove", target: element, x: firstPosition*horizontal+0.1*width*horizontal*direction, y: firstPosition*vertical+0.1*height*vertical*direction},
                    {type: "touchmove", target: element, x: firstPosition*horizontal + (secondPosition*horizontal - firstPosition*horizontal)/4, y: firstPosition*vertical + (secondPosition*vertical - firstPosition*vertical)/4},
                    {type: "touchmove", target: element, x: firstPosition*horizontal + (secondPosition*horizontal - firstPosition*horizontal)*3/4, y: firstPosition*vertical + (secondPosition*vertical - firstPosition*vertical)*3/4},
                    {type: "touchmove", target: element, x: secondPosition*horizontal, y: secondPosition*vertical},
                    {type: "touchend", target: element, x: secondPosition*horizontal, y: secondPosition*vertical}
                ]);
            }
        })
}
/**
 * help function for drag & drop panel
 */
function justMovePanel(panelText, xCoordinates, moveX, direction, isVertical){
    if(direction > 0){
        moveX += xCoordinates;
    }
    var horizontal = 1;
    var vertical = 0;
    if(isVertical){
        horizontal = 0;
        vertical = 1;
    }

    var panel = Ext.ComponentQuery.query(panelText)[0];
    var panelGhostId = "@" + panel.getId() + "-ghost_header";
    var panelId = "@" + panel.getId() + "_header";
    var before;
    ST.component(panel)
        .focus()
        .focused()
        .and(function (p){
            before = p.x;
            if(isVertical) {
                before = p.y;
            }
            var standardX = horizontal*(xCoordinates);
            var standardY = vertical*(xCoordinates);
            if (Lib.isDesktop) {
                ST.play([
                    {type: "mousedown", target: panelId, x: standardX, y: standardY, detail: 1},
                    {type: "mousemove", target: panelGhostId, x: standardX, y: standardY, buttons: 1},
                    {type: "mousemove", target: panelGhostId, x: horizontal*(moveX * direction), y: vertical*(moveX * direction), buttons: 1},
                    {type: "mouseup", target: panelGhostId, x: standardX, y: standardY, detail: 1}
                ]);
            }
            else {
                ST.play([
                    {type: "touchstart", target: panelId, x: standardX, y: standardY, detail: 1},
                    {type: "touchmove", target: panelGhostId, x: standardX, y: standardY, buttons: 1},
                    {type: "touchmove", target: panelGhostId, x: horizontal*(moveX * direction), y: vertical*(moveX * direction), buttons: 1},
                    {type: "touchend", target: panelGhostId, x: standardX, y: standardY, detail: 1}
                ]);
            }
        })
        .and(function (p) {
            var after = p.x;
            if(isVertical) {
                after = p.y;
            }
            expect(after).toBe(before + (direction * (moveX - (direction * xCoordinates))));
        });

    ST.component(panel).focus().focused();
}

/**
 ********************************************************************************************************************
 * help functions - don't use them directly
 ********************************************************************************************************************
 */
/**
 * help function for resize panel
 */
function justResizePanel(panelText, moveX, direction, isVertical){
    var panel = Ext.ComponentQuery.query(panelText)[0];
    var handlerId = "@" + panel.getId();

    var horizontal = 1;
    var vertical = 0;
    if(direction > 0){
        //down ↓
        if(isVertical){
            horizontal = 0;
            vertical = 1;
            handlerId += "-south";
        }
        //right →
        else{
            handlerId += "-east";
        }
    }
    else{
        //up ↑
        if(isVertical){
            horizontal = 0;
            vertical = 1;
            handlerId += "-north";
        }
        //left ←
        else{
            handlerId += "-west";
        }
    }
    handlerId += "-handle";

    var before;

    ST.component(panel)
        .focus()
        .focused()
        .and(function (p){
            before = p.width;
            if(isVertical) {
                before = p.height;
            }
            var standardX = horizontal;
            var standardY = vertical;
            if (Lib.isDesktop) {
                ST.play([
                    {type: "mousedown", target: handlerId, x: standardX, y: standardY, detail: 1},
                    {type: "mousemove", target: handlerId, x: standardX, y: standardY, buttons: 1},
                    {type: "mousemove", target: handlerId, x: horizontal*(moveX * direction), y: vertical*(moveX * direction), buttons: 1},
                    {type: "mouseup", target: handlerId, x: standardX, y: standardY, detail: 1}
                ]);
            }
            else {
                ST.play([
                    {type: "touchstart", target: handlerId, x: standardX, y: standardY, detail: 1},
                    {type: "touchmove", target: handlerId, x: standardX, y: standardY, buttons: 1},
                    {type: "touchmove", target: handlerId, x: horizontal*(moveX * direction), y: vertical*(moveX * direction), buttons: 1},
                    {type: "touchend", target: handlerId, x: standardX, y: standardY, detail: 1}
                ]);
            }
        })
        .and(function (p) {
            var after = p.width;
            if(isVertical) {
                after = p.height;
            }
            expect(after).toBe(before + moveX - direction);
        })
        .and(function(){
            var standardX = horizontal;
            var standardY = vertical;
            direction *= -1;
            if (Lib.isDesktop) {
                ST.play([
                    {type: "mousedown", target: handlerId, x: standardX, y: standardY, detail: 1},
                    {type: "mousemove", target: handlerId, x: standardX, y: standardY, buttons: 1},
                    {type: "mousemove", target: handlerId, x: horizontal*(moveX * direction), y: vertical*(moveX * direction), buttons: 1},
                    {type: "mouseup", target: handlerId, x: standardX, y: standardY, detail: 1}
                ]);
            }
            else {
                ST.play([
                    {type: "touchstart", target: handlerId, x: standardX, y: standardY, detail: 1},
                    {type: "touchmove", target: handlerId, x: standardX, y: standardY, buttons: 1},
                    {type: "touchmove", target: handlerId, x: horizontal*(moveX * direction), y: vertical*(moveX * direction), buttons: 1},
                    {type: "touchend", target: handlerId, x: standardX, y: standardY, detail: 1}
                ]);
            }
        })
        .and(function (p) {
            var after = p.width;
            if(isVertical) {
                after = p.height;
            }
            expect(after).toBe(before + ( 2 * direction));
        });

    ST.component(panel).focus().focused();
}
/**
 ********************************************************************************************************************
 * help functions - don't use them directly
 ********************************************************************************************************************
 */
/**
 * help function for testButtons and testSplitButtons
 */
function clickAndCheckButtonsCls(panelText, button1, messageBox){
    button1 = panelText + ' ' + button1;
    // we have to use mousedown/mouseup methods for checking pressing button
    // via mousedown/mouseup we divide click on the 'click/unclick' operations
    // via click method isn't possible to check if button was pressed
    ST.play([
        // press button
        { type: "mouseenter", target: button1 },
        { type: "mousedown", target: button1 }
    ]);
    //class depends on toolkit
    var cls = ST.isModern?'x-pressing':'x-btn-pressed';
    ST.button(button1).hasCls(cls);

    var fieldForPlay = [
        { type: "mouseleave", target: button1 },
        { type: "mouseup", target: button1 },
        { type: "tap", target: button1 }
    ];

    if(messageBox !== undefined){
        fieldForPlay.push({
            //IE ignore animation:null
            animation: null, delay: 0, target: "@msg-div", fn: function (done) {
                expect(this.targetEl.dom.textContent).toMatch(messageBox);
                done();
            }
        });
    }
    ST.play(fieldForPlay);
}
/**
 ********************************************************************************************************************
 * help functions - don't use them directly
 ********************************************************************************************************************
 */
/**
 * help function for testMenuButton, testSplitButtons, testCheckButtons
 */
function testMenuItemProcedure(panelText, button1, messageBox){
    if(panelText !== null){
        button1 = panelText + ' ' + button1;
    }

    if(Lib.isDesktop) {
        ST.play([
            // press button
            {type: "mouseover", target: button1},
            {type: "mouseenter", target: button1}
        ]);
    }
    //tablets and mobiles use click for showing tooltips
    else{
        ST.play([
            // press button
            { type: "touchstart", target: button1 }
        ]);
    }

    ST.component(button1).hasCls('x-menu-item-active');

    var fieldForPlay;
    if(Lib.isDesktop) {
        fieldForPlay = [
            // press button
            { type: "mouseleave", target: button1 },
            { type: "click", target: button1 }
        ];
    }
    //tablets and mobiles use click for showing tooltips
    else{
        fieldForPlay = [
            // press button
            { type: "touchend", target: button1 },
            { type: "click", target: button1 }
            //{ type: "tap", target: button1 }
        ];
    }

    if(messageBox !== undefined){
        fieldForPlay.push({
            animation: null, delay: 1000, target: "@msg-div", fn: function (done) {
                expect(this.targetEl.dom.textContent).toMatch('.*' + messageBox + '.*');
                done();
            }
        });
    }

    ST.play(fieldForPlay);
}

/**
 ********************************************************************************************************************
 * help functions - don't use them directly
 ********************************************************************************************************************
 */
/**
 * help function for checkTooltips
 */
function checkTooltipsProcedure(panelText, button1, tooltip){
    if(panelText !== null){
        button1 = panelText + ' ' + button1;
    }

    if(Lib.isDesktop) {
        ST.play([
            // press button
            {type: "mouseover", target: button1},
            {type: "mouseenter", target: button1}
        ]);
    }
    //tablets and mobiles use click for showing tooltips
    else{
        ST.play([
            // press button
            { type: "touchstart", target: button1 },
            { type: "touchend", target: button1 }
        ]);
    }
    ST.element('@ext-quicktips-tip-innerCt')
        .visible()
        .text(tooltip);
    if(Lib.isDesktop) {
        ST.play([
            // unpress button
            { type: "mouseleave", target: button1 },
            { type: "touchend", target: button1 },
            { type: "tap", target: panelText }
        ]);
    }
}

/**
 ********************************************************************************************************************
 * help functions - don't use them directly
 ********************************************************************************************************************
 */
/**
 * help function - correct click provided by ST.play
 */
function clickOnSomething(button1, messageBox){
    var fieldForPlay = [
        { type: "mouseover", target: button1 },
        { type: "touchstart", target: button1 },
        { type: "mouseenter", target: button1 },
        { type: "mouseleave", target: button1 },
        { type: "touchend", target: button1 }
        //is it still needed???
        //{ type: "click", target: button1 }
    ];

    if(messageBox !== undefined){
        fieldForPlay.push({
            animation: null, delay: 1000, target: "@msg-div", fn: function (done) {
                expect(this.targetEl.dom.textContent).toMatch(messageBox);
                done();
            }
        });
    }

    ST.play(fieldForPlay);
}


/**
 ********************************************************************************************************************
 * help functions - don't use them directly
 ********************************************************************************************************************
 */
/**
 * help function for expanding / collapsing items
 */
function expandCollapse(stElement, isGrid){
    var firstClass = 'x-treelist-item-collapsed';
    var secondClass = 'x-treelist-item-expanded';
    if(isGrid){
        firstClass = 'x-collapsed';
        secondClass = 'x-expanded';
    }
    stElement.and(function(el){
        //scroll
        Lib.scrollToElement('#' + el.dom.id, 'container');
        var classes = el.dom.className;
        if(classes.indexOf('x-treelist-item-expanded') > 0){
            firstClass = secondClass;
            secondClass = 'x-treelist-item-collapsed';
        }
        else if(isGrid && classes.indexOf('x-expanded') > 0){
            firstClass = secondClass;
            secondClass = 'x-collapsed';
        }
        expect(classes).toContain(firstClass);
    });
    if(isGrid){
        stElement.down('>> .x-expander-el')
            .click();
    }
    else{
        stElement.down('>> .x-treelist-item-expander').click();
    }
    stElement.and(function(el){
        expect(el.dom.className).toContain(secondClass);
    });
}
/**
 * help function - click on element which then disappear provided by ST.play
 * failing to perform click because overlay already disappear on mouseup event
 */
