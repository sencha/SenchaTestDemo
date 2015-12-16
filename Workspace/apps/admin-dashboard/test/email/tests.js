describe("Email tests", function() {
    describe("opening the compose window", function() {
        it("should open the compose window and set the title", function() {
            Orion.component('#emailCompose').click();

            Orion.component('#emailComposeWindow').and(function(win) {
                expect(win.getTitle()).toBe('Compose Message');
            });

            Orion.button('#emailComposeWindow [reference=discardButton]').click();
        });
    });

    describe("composing messages", function() {
        beforeEach(function() {
            Orion.component('#emailCompose').click();
        });

        afterEach(function() {
            Orion.button('#emailComposeWindow [reference=discardButton]').click();
        });

        it("should accept user input in the 'To' field", function() {
            Orion.component('#emailComposeWindow [reference=toField] => input').
                click().
                focus().
                type('George Washington').wait(50).
                and(function(input) {
                    expect(input.value).toBe('George Washington');
                });
        });
    });
});