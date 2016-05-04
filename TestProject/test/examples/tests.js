describe("tests.js", function() {
    it("should pass", function() {
        expect(1).toBe(1);
    });
    
    it("should play recordings", function(){
        ST.play([
            { type: "tap", target: "@ext-element-14", x: 13, y: 37 },
            { type: "tap", target: "@ext-element-19", x: 17, y: 28 },
            { type: "tap", target: "@ext-element-24", x: 32, y: 24 },
            { type: "tap", target: "@ext-element-10", x: 45, y: 42 }
        ]);
    });
});