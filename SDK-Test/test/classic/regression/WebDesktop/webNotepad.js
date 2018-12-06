describe("webNotepad", function () {

    it("Click on icon Accordion Window", function () {
        ST.element('>> #Notepad-shortcut').click();
    });

    describe("Click on buttons", function () {

        it("Testing of component", function () {
            ST.play([
                {type: "tap", target: "dataview => [data-recordindex=\"2\"]", x: 22, y: 63},
                {type: "tap", target: "component[itemId=\"fontSelect\"]", x: 127, y: 16},
                {type: "tap", target: "component[itemId=\"fontSelect\"]", x: 44, y: 98},
                {type: "tap", target: "component[itemId=\"fontSelect\"]", x: 134, y: 10},
                {type: "tap", target: "component[itemId=\"fontSelect\"]", x: 56, y: 120}
            ]);
        });

        it('button bold', function () {
            ST.button('button[itemId=\"bold\"]').click();
        });
        it('button italic', function () {
            ST.button('button[itemId=\"italic\"]').click();
        });
        it('button underline', function () {
            ST.button('button[itemId=\"underline\"]').click();
        });
        it('button increasefontsize', function () {
            ST.button('button[itemId=\"increasefontsize\"]').click();
        });
        it('button backcolor', function () {
            ST.button('button[itemId=\"backcolor\"]').click();
        });
        it('button justifyleft', function () {
            ST.button('button[itemId=\"justifyleft\"]').click();
        });
        it('button justifycenter', function () {
            ST.button('button[itemId=\"justifycenter\"]').click();
        });
        it('button justifyright', function () {
            ST.button('button[itemId=\"justifyright\"]').click();
        });
    });

    it('Take a screenshot', function () {
        // comparing actual screen with expected screen
        Lib.screenshot('webNotepad');
    });

    describe("Tool should works", function () {

        it('maximize notepad', function () {
            ST.component('window[id=notepad] tool[type=maximize]:first')
                .visible()
                .click()
                .and(function () {
                    ST.panel('panel[title=Notepad]{isVisible()}')
                        .and(function (panel) {
                            expect(panel.getWidth()).toBe(Ext.first('viewport').getWidth());
                            expect(panel.getHeight()).toBe(Ext.first('viewport').getHeight() - 36); // 36px is height of navigation strip
                        });
                });
        });

        it('minimize notepad', function () {
            ST.component('window[id=notepad] tool[type=minimize]:first')
                .visible()
                .click();
        });

        it('open notepad', function () {
            ST.button('button[text=Notepad]')
                .visible()
                .click()
                .and(function () {
                    ST.panel('panel[title=Notepad]{isVisible()}')
                        .and(function (panel) {
                            expect(panel.getWidth()).toBe(Ext.first('viewport').getWidth());
                            expect(panel.getHeight()).toBe(Ext.first('viewport').getHeight() - 36); // 36px is height of navigation strip
                        });
                });
        });

        it('Close notepad', function () {
            ST.component('window[id=notepad] tool[type=close]:first')
                .visible()
                .click();
        });
    });
});
