/**
* @file HelloWord.js
* @name Component/DateBindings/HelloWord.js
* @created 2017/5/16
*/

describe("Hello Word", function() {
    var examplePrefix = "binding-hello-world";
    var exampleUrlPostfix = "#binding-hello-world";
    var Binding = {
        btn: function() {
            return ST.button('button[_text=A button]');
        },
        form: function() {
            return ST.component('#kitchensink-view-binding-helloworld');
        }
    };

    beforeAll(function () {
        Lib.beforeAll(exampleUrlPostfix, examplePrefix);
        ST.wait(function () {
            return Ext.first('button[_text=A button]');
        });
    });

    afterAll(function(){
       Lib.afterAll(examplePrefix);
    });

    it("should load correctly", function() {
        Binding.form()
            .visible();
        Lib.screenshot("UI_HelloWorld");
    });

    describe('Test button', function () {
        Lib.testButtons('panel[_itemId=kitchensink-view-binding-helloworld]','A button')
    });

    describe('Source code', function(){
        it('should open, check and close', function(){
            Lib.sourceClick('KitchenSink.view.binding.HelloWorld');
        });
    });
});
