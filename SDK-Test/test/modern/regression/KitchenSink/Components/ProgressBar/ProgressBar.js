describe("ProgressBar", function() {
    
    var barValues = ['Marshmallows', 'Graham Crackers', 'Chocolate', 'Fire Pit', 'Stick', 'Smiles'];
    
    var Components = {
        barWithText: function(){
            return ST.component("progress[_text^=Loading]");
        },
        label: function(){
            return ST.component("component[_html^=Loading]");  
        },
        barWithoutText: function(){
            return ST.component("progress[_text=null]");
        }
    };
    
    function testProgressBarWithText(valueOfBar){
        it("Progress Bar value " + valueOfBar + " is present", function(){
            Components.barWithText()
            .wait(function(progressBar){
                return progressBar.getText().indexOf(valueOfBar) >-1;
            })
            .and(function(progressBar){
                expect(progressBar.getText()).toContain(valueOfBar);
            });
        });
    }
    
    function testProgressBarWithoutText(valueOfBar){
        it("Label value " + valueOfBar + " is present", function(){
            Components.label()
            .wait(function(label){
               return label.getHtml().indexOf(valueOfBar) >-1;
            })
            .and(function(label){
                expect(label.getHtml()).toContain(valueOfBar);
            });
        });
    }
    
    
    beforeAll(function (){
        ST.options.timeout = 30000;
	Lib.beforeAll("#progress-decorated");
    });
    
    afterAll(function(){
        ST.options.timeout = 5000;
        Lib.afterAll("progress-decorated")
    });
    
    describe("Both Progress Bars and Label are loaded correctly", function(){
        it("ProgressBar with text loaded", function(){
            Components.barWithText()
            .visible()
            .and(function(progressText){
                expect(progressText.rendered).toBeTruthy();  
            });
        });
        
        it("Label is loaded", function(){
            Components.label()
            .visible()
            .and(function(label){
                expect(label.rendered).toBeTruthy();
            });
        });
        
        it("ProgressBar without text loaded", function(){
            Components.barWithoutText()
            .visible()
            .and(function(progressNoText){
                expect(progressNoText.rendered).toBeTruthy();  
            });
        });
    });
    
    describe("Progress bars with text works", function(){
        for(var i = 0; i < barValues.length; i++){
            testProgressBarWithText(barValues[i]);
        }
    });
    
    describe("Progress bars without text works", function(){
        for(var i = 0; i < barValues.length; i++){
            testProgressBarWithoutText(i);
        }
     });
    it("should open source window when clicked", function() {
        Lib.sourceClick('KitchenSink.view.ProgressBar');
    });
});
