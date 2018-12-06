describe("webSystemStatus", function () {
    var Cmp = {
        tooltip: function () {
            return Ext.first('tooltip{isVisible()}');
        }
    };
    beforeAll(function () {
        // open Notepad before testing
        ST.element('dataview => [data-recordindex=\"3\"]')
            .click();
    });
    it('Click on legend in polar chart', function () {

        ST.component('polar')
            .visible()
            .click(100, 200)
            .wait(400)
            .and(function () {
                ST.play([
                    {type: "mousemove", target: "polar", x: 100, y: 200}
                ]);
            })
            .wait(function () {
                return Cmp.tooltip();
            })
            .and(function () {
                ST.play([
                    {type: "mousemove", target: "polar", x: 200, y: 200}
                ]);
            })
            .wait(function () {
                return Cmp.tooltip();
            })
            .and(function () {
                ST.play([
                    {type: "mousemove", target: "polar", x: 100, y: 100}
                ]);
            })
            .wait(function () {
                return Cmp.tooltip();
            });
    });
    describe("Tool should works", function () {

        it('should maximize system status', function () {
            ST.component('window[id=systemstatus] >> tool[type=maximize]:first')
                .visible()
                .click();
        });

        it('should minimize system status', function () {
            ST.component('window[id=systemstatus] >> tool[type=minimize]:first')
                .visible()
                .click();
        });

        it('should open system status', function () {
            ST.button('button[text=System Status]')
                .visible()
                .click();
        });

        it('should close system status', function () {
            ST.component('window[id=systemstatus] >> tool[type=close]:first')
                .visible()
                .click();
        });
    });
});