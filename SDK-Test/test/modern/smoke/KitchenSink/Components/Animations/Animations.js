/**
 * @file Animations.js
 * @name Components/Animations
 * @created 2016/08/16
 */
 
describe("Animations", function() {
    /**
     *  Custom variables for applicaiton
     **/
    var prefix = "animations";
    var exampleUrlPostfix="#animations";
    
    var Comp = {

		card: function() {
            return ST.component(prefix + " container[_hidden=false]");
		},

        wait: function() {
            ST.wait(function () {
                return Ext.ComponentQuery.query(prefix + " container[_hidden=false]{isVisible()}").length === 1;
            });
        },

        transform: function() {
            return Ext.first(prefix + " container[_hidden=false]").el.dom.style.transitionProperty;
        }
 	};
 	
 	beforeAll(function() {
 	    Lib.beforeAll(exampleUrlPostfix, prefix);
    });

 	afterAll(function(){
 	    Lib.afterAll(prefix);
    });

    beforeEach(function() {
        Comp.wait();
    });
    
        /**
         *  Testing UI of the application
         **/
	    it("should load correctly", function() {
	        
            Comp.card().visible();
            Lib.screenshot("UI_animations");
        });

        describe('Animations - EXTJS-23721', function () {
            /**
             *   Testing every animations by checking animation and transition duration
             **/
            it("Slide left animation", function() {

                Comp.card().down("button[_text=Slide Left]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Slide Left]").click();
            });

            it("Slide right animation", function() {

                Comp.card().down("button[_text=Slide Right]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Slide Right]").click();
            });

            it("Slide Top animation", function() {

                Comp.card().down("button[_text=Slide Top]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Slide Top]").click();
            });

            it("Slide Bottom animation", function() {

                Comp.card().down("button[_text=Slide Bottom]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Slide Bottom]").click();
            });

            it("Cover left animation", function() {

                Comp.card().down("button[_text=Cover Left]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Cover Left]").click();
            });

            it("Cover right animation", function() {

                Comp.card().down("button[_text=Cover Right]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Cover Right]").click();
            });

            it("Cover Top animation", function() {

                Comp.card().down("button[_text=Cover Top]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Cover Top]").click();
            });

            it("Cover Bottom animation", function() {

                Comp.card().down("button[_text=Cover Bottom]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Cover Bottom]").click();
            });

            it("Reveal left animation", function() {

                Comp.card().down("button[_text=Reveal Left]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Reveal Left]").click();
            });

            it("Reveal right animation", function() {

                Comp.card().down("button[_text=Reveal Right]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Reveal Right]").click();
            });

            it("Reveal Top animation", function() {

                Comp.card().down("button[_text=Reveal Top]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Reveal Top]").click();
            });

            it("Reveal Bottom animation", function() {

                Comp.card().down("button[_text=Reveal Bottom]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Reveal Bottom]").click();
            });

            it("Pop animation", function() {

                Comp.card().down("button[_text=Pop]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Pop]").click();
            });

            it("Flip animation", function() {

                Comp.card().down("button[_text=Flip]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Flip]").click();
            });

            it("Fade animation - EXTJS-23528", function() {

                Comp.card().down("button[_text=Fade]").click()
                    .and(function(){
                        expect(Comp.transform()).not.toBe("");
                        expect(Ext.AnimationQueue.isRunning).toBe(true);
                    });
                Comp.wait();
                Comp.card().down("button[_text=Fade]").click();
            });

        });

        it("should open source window when clicked", function() {
            
           Lib.sourceClick("Animations");
        });
        
});