describe("Calendar 6.2 - Week view", function() {

   beforeAll(function(){
       ST.options.eventDelay = 200;
   });
   
   describe("General", function(){
       Lib.panelRendered('Ext JS Calendar');
   });
   
   describe("Week tab", function(){
       beforeEach(function(){
           ST.element('button[text=Week]')
               .click();
       });
       
       Lib.testTabButtons(" ", "Week");
       describe("next week pressed", function(){
           Lib.testTabButtons(" ", "'>'");
       });
       
       describe("previous week pressed", function(){
           Lib.testTabButtons(" ", "'<'");
       });

       describe("time marker",function(){
           it(" is visible", function(){
               var date = new Date();
               var day = date.getDay();//counting from 0=Sunday
               var current_hours = date.getHours();
               var current_minutes = date.getMinutes();
               var assumption_top = current_hours * 41.76 + current_minutes * 0.7;
               var marker_position;
               var marker = document.getElementsByClassName("x-calendar-days-day-column")[day].getElementsByClassName('x-calendar-days-now-marker')[0];
               if (typeof marker !== "undefined") {
                   marker_position = parseFloat(marker.style.cssText.substring(5, 10));
                   expect(Math.abs(marker_position - assumption_top) < 10).toBe(true);
               }
           });
       });

       describe("events", function(){
           beforeEach(function(){
               Lib.createWeeklyEvent("Auto TEST",0,5,0);
               calendar = Ext.ComponentQuery.query("calendar")[0];
               if (calendar.isComponent) {
                   calendar = calendar.el;
               }
           });

           afterEach(function(){
               Lib.deleteEvent("Auto TEST");
           });

           it("resizing event", function(){
               ST.element("calendar-event[title=Auto TEST]")
                   .and(function(element){
                       var standardX =  element.dom.offsetWidth/2;
                       var standardY = element.dom.offsetHeight/2 ;
                       var resizer =
                           ST.play([
                               {type: "mouseover", target: element, x: standardX, y: standardY, detail: 1},
                           ]);
                       ST.element("calendar-event[title=Auto TEST] => div.x-calendar-event-resizer")
                           .and(function(el){
                               el.dom.style.display = 'block';
                               Lib.DnD.dragBy(el,0,50);
                           });
                   }).wait(3000);
           });

           it('moving event', function () {
               var previousX;
               ST.element("calendar-event[title=Auto TEST]")
                   .and(function (el) {
                       var standardX =  el.dom.offsetWidth / 2;
                       var standardY = el.dom.offsetHeight / 2;
                       previousX = el.dom.offsetTop;
                       ST.play([
                           {type: "mousedown", target: el, x: standardX, y: standardY, detail: 1},
                           {type: "mousemove", target: el, x: standardX, y: standardY + 150, buttons: 1},
                           {type: "mouseup", target: calendar}
                       ]);
                   });
               ST.element("calendar-event[title=Auto TEST]")
                   .and(function(el){
                       expect(previousX !== el.dom.offsetTop).toBeTruthy();
                   });
           });

           describe('multiple events', function(){
               beforeEach(function(){
                   Lib.createWeeklyEvent("Auto TEST2",0,5,0);
               });

               afterEach(function(){
                   Lib.deleteEvent("Auto TEST2");
               });

                it("are visible", function(){
                    var zIndexEvent1 = Ext.ComponentQuery.query("calendar-event[title=Auto TEST]")[0].el.dom.style.zIndex;
                    var zIndexEvent2 = Ext.ComponentQuery.query("calendar-event[title=Auto TEST2]")[0].el.dom.style.zIndex;
                    expect(zIndexEvent1).toBeLessThan(zIndexEvent2);
                });
           });
       });
   });
});