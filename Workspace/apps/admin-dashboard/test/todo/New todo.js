describe("New todo", function() {
    it("should pass", function() {
        expect(1).toBe(1);
    });
    it('should appear in list', function() {
    ST.play([
        { type: "tap", target: "@new-task-text-inputEl", x: 41, y: 8 },
        { type: "keydown", target: "@new-task-text-inputEl", key: "Shift", shiftKey: true },
        { type: "keydown", target: "@new-task-text-inputEl", key: "T", shiftKey: true },
        { type: "keyup", target: "@new-task-text-inputEl", key: "T", shiftKey: true },
        { type: "keyup", target: "@new-task-text-inputEl", key: "Shift" },
        { type: "type", target: "@new-task-text-inputEl", text: "est new functionality" },
        { type: "tap", target: "@button-1080-btnIconEl", x: 12, y: -1 },
        { fn: function(done) {
            expect(this.targetEl.dom.innerHTML).toBe('Test new functionality');
            done();
        }, target: "@tableview-1078-record-95/tbody/tr/td[2]/div", x: 250, y: 17 }
    ]);
        
    });
    it('should clear new task field', function() {
        var fld = ST.find('#new-task-text => input');
        expect(fld.value.length).toBe(0);
    });
});

