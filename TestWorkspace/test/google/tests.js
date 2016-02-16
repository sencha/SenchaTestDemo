describe("tests.js", function() {
    it("should pass", function() {
        expect(1).toBe(1);
    });
    
    it("should play recordings", function(){
        ST.play([
            { type: "tap", target: "@lst-ib", x: 262, y: 13 },
            { type: "keydown", target: "@lst-ib", key: "Shift", shiftKey: true },
            { type: "keydown", target: "@lst-ib", key: "S", shiftKey: true },
            { type: "keyup", target: "@lst-ib", key: "Shift" },
            { type: "keyup", target: "@lst-ib", key: "s" },
            { type: "type", target: "@lst-ib", text: "encha" },
            { type: "type", target: "@lst-ib", text: " e" },
            { type: "type", target: "@lst-ib", text: "x" },
            { type: "type", target: "@lst-ib", text: "tjs" }
        ]);
        
    });
});