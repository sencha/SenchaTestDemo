/**
 * @file profile.js
 * @date 2.8.2016
 *
 * Tested on: Chrome, Firefox, Opera, Safari, IE11, Edge, Android5 and iOS9
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
        },
        listButtons = ['x-fa fa-video-camera','x-fa fa-camera','x-fa fa-file',
                        'Share','Follow','x-fa fa-facebook','x-fa fa-twitter',
                        'x-fa fa-google-plus','x-fa fa-envelope'],
        listNames = ['Video Camera','Camera','File','Share','Follow','Facebook',
                        'Twitter','Google Plus','Envelope'],
        startSocial = "Jessica Warren",
        endSocial = "CEO",
        startDescription = "San Jose, CA",
        endDescription = "About Me",
        startNotification = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        endNotification = "The generated Lorem Ipsum is therefore always free from repetition",
        startTimeline = "Lorem ipsum dolor sit amet.",
        endTimeline = "Like The Article.";
    
    function clickButton(name, locator) {
        it('Button ' + name + ' is clicked', function () {
            if (locator.indexOf('x-fa') !== -1) {
                Profile.buttonByClass(locator)
                    .click();
            } else {
                Profile.buttonByText(locator)
        		    .click();
            }
        });
    }
    
    function checkWidget(name, start, end) {
        it('Check ' + name + ' widget', function() {
            ST.component(name)
                .visible()
                .and(function(profil) {
                    expect(profil.el.el.dom.textContent).toMatch(start);
                    expect(profil.el.el.dom.textContent).toMatch(end);
                });
        });
    }

    beforeEach(function () {
        // make sure you are on Profile homepage.
        Lib.beforeAll("#profile", "profile", undefined, "admin");
    });
    afterAll(function(){
        //Lib.afterAll("profile");//It is not need destroyed
        ST.options.eventDelay = 500;
    });

    it('Example loads correctly', function () {
        Profile.view() // check if Profile page loaded correctly.
          .visible()
          .and(function (page){
              expect(page.rendered).toBeTruthy();
          });
    });

    it('Take a screenshot', function(){
        // comparing actual screen with expected screen.
        Lib.screenshot('adminProfile');
    });
   
    it('Check "What\'s on your mind" panel', function () {
        //Need to use Composite query for selection of textarea. Without it ST works with div above.
	    ST.element("textareafield[placeholder=What\'s on your mind?] => textarea")
		    .click()
		    .type('It\'s just a magic!!!')
		    .and(function (editor){
		        expect(editor.dom.value).toBe('It\'s just a magic!!!');
	    });
    });
    
    // click on the all buttons and profilesocial widget
    describe('Check "Social panel" panel', function() {
        for (var i=0 ; i<listButtons.length ; i++) {
            clickButton(listNames[i],listButtons[i]);
        }
        checkWidget("profilesocial", startSocial, endSocial);
    });
    
    // profiledescription
    checkWidget("profiledescription", startDescription, endDescription);
    
    // profilenotification
    checkWidget("profilenotifications", startNotification, endNotification);

    // profiletimeline
    checkWidget("profiletimeline", startTimeline, endTimeline);

});