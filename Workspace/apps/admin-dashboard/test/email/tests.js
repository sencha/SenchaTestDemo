describe("Email tests", function() {
    describe("opening the compose window", function() {
        it("should open the compose window and set the title", function() {
            ST.component('#emailCompose').click();

            ST.component('#emailComposeWindow').and(function(win) {
                expect(win.getTitle()).toBe('Compose Message');
            });

            ST.button('#emailComposeWindow [reference=discardButton]').click();
        });
    });

    describe("composing messages", function() {
        beforeEach(function() {
            ST.component('#emailCompose').click();
        });

        afterEach(function() {
            ST.button('#emailComposeWindow [reference=discardButton]').click();
        });

        it("should accept user input in the 'To' field", function() {
            ST.component('#emailComposeWindow [reference=toField] => input').
                click().
                focus().
                type('George Washington').wait(50).
                and(function(input) {
                    expect(input.value).toBe('George Washington');
                });
        });
    });
});