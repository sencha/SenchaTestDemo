describe("Email.js", function() {
    describe('Compose', function () {
        var compose;
        
        beforeEach(function (done) {
            compose = Ext.create({
                xtype: 'window',
                title: 'Compose',
                layout: 'fit',
                x: 0,
                y: 0,
                width: 600,
                height: 450,
                items: [{
                    xtype: 'emailcompose'
                }],
                lookup: function (ref) {
                    return this.getComponent(0).lookup(ref);
                }
            });
            compose.show();

            Ext.defer(done, 500); // allow window to repaint/reflow
        });
        
        afterEach(function (done) {
            compose = Ext.destroy(compose);
            Ext.defer(done, 500);
        });
        
        it('should open', function () {
            expect(compose.el).toBeTruthy();
        });
        
        it('should close', function () {
            var win = ST.component(compose);
            
            ST.textField(compose.lookup('subjectField')).
                focus().
                type('Hello').
                and(function (field) {
                    expect(field.getValue()).toBe('foo');
                }).
                wait(1000);
            
            ST.button(compose.lookup('discardButton')).
                click(10, 10);

            win.
                destroyed().
                and(function (w) {
                    expect(w.destroyed).toBe(true);
                });
        });
    });

    it("should pass", function() {
        expect(1).toBe(1);
    });
});
