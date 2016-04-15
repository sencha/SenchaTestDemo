describe("adminProfile", function() {
    /*
     * Futures enable tests to practice the DRY (Don’t Repeat Yourself) principle.
     * Instead of creating the future instance at the point of need,
     * consider the following alternative.
     **/
    var Profile = {
        // Using ComponentQuery to locate right Ext.panel.Panel by xtype and one of it's properties
        // in this case we use iconCls or text of button to identify right test target
        // More about Locators can be found in Sencha Test documentation
        // http://docs.sencha.com/sencha_test/ST.Locator.html
        buttonByClass : function(className){
            return ST.button('profile button[iconCls='+className+']');
        },
        buttonByText : function(text){
            return ST.button('profile button[text='+text+']');
        },
        // locate User Profile view by it's xtype
        view : function(){
            return ST.component("profile");
            // or xpath "//div[contains(@class, 'userProfile-container')]"
            // or DOM query ">>div.userProfile-container"
        }
    };
    beforeEach(function(){
        Admin.app.redirectTo("#profile"); // make sure you are on Profile homepage.
    });
    it('Page loaded correctly', function () {
        Profile.view() // check if Profile page loaded correctly.
          .visible();
    });
    it('Take a screenshot', function (done) {
        // comparing actual screen with expected screen.
        ST.screenshot('adminProfile', done);
    }, 1000 * 20);
    it('TextArea is editable', function () {
        // Type string into textarea.
        // Locator uses one of text area configs to identify right target
	    ST.component("textarea[emptyText=What's on your mind?]")     
		    .click()
		    .focus() //need to focus text area before typing
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
