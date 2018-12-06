/**
 * @file profile.js
 * @date 3.3.2016
 *
 * Tested on: Chrome, Firefox, Opera, Safari, IE11, Edge, Android6 and iOS9
 * Passed on: all tested platforms
 */
    
describe("adminProfile", function() {

    var Profile = {
        buttonByClass : function(className){
            return ST.button('profile button[iconCls='+className+']');
        },
        buttonByText : function(text){
            return ST.button('profile button[text='+text+']');
        },
        view : function(){
            return ST.component("profile");
        }
    };

    beforeEach(function(){
        Admin.app.redirectTo("#profile"); // make sure you are on Profile homepage.
    });

    it('Page loaded correctly', function () {
        Profile.view() // check if Profile page loaded correctly.
          .visible();
    });

    it('Take a screenshot', function () {
        // comparing actual screen with expected screen.
        Lib.screenshot('adminProfile');
    });
   
    it('TextArea is editable', function () {
        //Insert string into textarea.
	    ST.component("textarea[emptyText=What's on your mind?]")     
		    .click()
		    .focus()
		    .type('Silence!!! I kill you!!!')
		    .and(function (editor){
		        expect(editor.getValue()).toBe('Silence!!! I kill you!!!');
	    });
    });

    describe("Buttons", function() {
        // Check if buttons are loaded and clickable
        it('Button Video Camera', function () {
            Profile.buttonByClass('x-fa fa-video-camera')
                .click();            
        });
        it('Button Camera', function () {
            Profile.buttonByClass('x-fa fa-camera')
                .click();
        });
        it('Button Submit', function () {
            Profile.buttonByClass('x-fa fa-file')
                .click();
        });
        it('Button Share', function () {
            Profile.buttonByText('Share')
    		    .click();
        });
        it('Button Follow', function () {
            Profile.buttonByText('Follow')
    		    .click();
        });
        it('Button Facebook', function () {
            Profile.buttonByClass('x-fa fa-facebook')
    		    .click();
        });
        it('Button Twitter', function () {
            Profile.buttonByClass('x-fa fa-twitter')
                .click();
        });
        it('Button Google Plus', function () {
            Profile.buttonByClass('x-fa fa-google-plus')
                .click();
        });
        it('Button Envelope', function () {
            Profile.buttonByClass('x-fa fa-envelope')
                .click();                     
        });
    });
});
