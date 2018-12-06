/**
 * @file Vector Icons.js
 * @name Components/Icons/Vector Icons
 * @created 2016/09/08
 */
describe("Vector Icons", function() {
    /**
     *  Custom variables for applicaiton
     **/
    var examplePrefix = "vector-icons";
    var exampleUrlPostfix = "#vector-icons";

    var Comp = {

        paint: function() {
            return ST.element('>> .x-surface-canvas');
        },
        icons: function(num) {
            return Ext.ComponentQuery.query(examplePrefix + " surface[id*=row]")[num];
        },
        width: function() {
            return parseInt(Ext.ComponentQuery.query(examplePrefix + " surface[id*=row]")[0].el.dom.style.width);
        }
    };

    beforeAll(function() {
        //add timeout for source to be ready on time (failed in IE11 and in Android 4.4) (JZ)
        if(ST.os.is('Android') || ST.os.is('IE')) {
            ST.options.timeout = 30000;
        }
        Lib.beforeAll(exampleUrlPostfix, "#kitchensink-view-icons-vectoricons");
        ST.wait(function() {
            return Comp.paint().visible();
        });
    });
    afterAll(function(){
        //back to default value (JZ)
        if(ST.os.is('Android') || ST.os.is('IE')) {
            ST.options.timeout = 5000;
        }
        Lib.afterAll("#kitchensink-view-icons-vectoricons");
    });

    /**
     *  Testing UI of the application
     **/
    it("should load correctly", function() {

        Comp.paint().visible();
        Lib.screenshot("UI_vector_icons");

    });

    /**
     *  Testing displaying of the icons by screenshot function
     **/
    it("should display left arrow icon when it's clicked", function() {
        ST.component(Comp.icons(1)).click(Comp.width() / 6, 10);
        Lib.screenshot("Left_arrow_vector_icon");

    });

    it("should display power off icon when it's clicked", function() {

        ST.component(Comp.icons(36)).click();
        Lib.screenshot("Power_off_vector_icon");

    });

    it("should display svg icon when it's clicked", function() {

        ST.component(Comp.icons(73)).click(Comp.width() - 50, 10)
        Lib.screenshot("Svg_vector_icon");

    });

    it("should open source window when clicked", function() {

        Lib.sourceClick("VectorIcons");
    });

});
