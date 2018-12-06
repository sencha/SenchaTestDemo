describe("Calendar 6.2 - Day view", function(){
    beforeAll( function(){
        ST.options.eventDelay = 200;
    });

    describe("General", function(){
        Lib.panelRendered('Ext JS Calendar');
    });

    describe("Day tab", function() {
        beforeEach(function(){
            ST.element('button[text=Day]')
                .click();
        });
        
        Lib.testTabButtons(" ", "Day");
        describe("next day pressed", function () {
            Lib.testTabButtons(" ", "'>'");
        });
        describe("previous day pressed", function () {
            Lib.testTabButtons(" ", "'<'");
        });
        describe('time marker', function(){
            it("is visible", function(){
                //get actual time
                var date = new Date();
                var current_hours = date.getHours();
                var current_minutes = date.getMinutes();
                var assumption_top = current_hours * 41.76 + current_minutes * 0.7;
                var marker_position = parseFloat(document.getElementsByClassName('x-calendar-days-now-marker')[0].style.cssText.substring(5,10));
                var marker = document.getElementsByClassName('x-calendar-days-now-marker');
                expect(marker !== 'undefined' && ( Math.abs(marker_position - assumption_top) < 10)).toBe(true);
            });
        });

       describe('events', function() {
           beforeEach(function () {
               Lib.createWeeklyEvent("Auto TEST",0,5,0);
           });

           afterEach(function () {
               Lib.deleteEvent("Auto TEST");
           });

           it("resizing event", function () {
               ST.element("calendar-event[title=Auto TEST]")
                   .and(function (element) {
                       var standardX = element.dom.offsetWidth / 2;
                       var standardY = element.dom.offsetHeight / 2;
                       var resizer =
                           ST.play([
                               {type: "mouseover", target: element, x: standardX, y: standardY, detail: 1},

                           ]);
                       ST.element("calendar-event[title=Auto TEST] => div.x-calendar-event-resizer")
                           .and(function (el) {
                               el.dom.style.display = 'block';
                               Lib.DnD.dragBy(el, 0, 50);
                           });
                   }).wait(3000);
           });
       });
    });
});