/**
 * @file faq.js
 * @date 4.8.2016
 *
 * Tested on: Chrome, Firefox, Opera, Android5 and iOS9
 * Passed on: all tested platforms
 */
 
describe('FAQ', function () {
    var Panel = {
            panel : function (title) {
                return ST.element('faqitems[_title^=' + title + ']').visible();
            },
            // need to whole panel for check of expand
            subPanel : function (title, order) {
                return ST.element('faqitems[_title^=' + title + '] => div.x-dataview-item:nth-child(' 
                            + order + ')').visible();
            },
            // need to return faq-question div for expanding panel via click
            subPanelText : function (title, order) {
                return ST.element('faqitems[_title^=' + title + '] => div.x-dataview-item:nth-child(' 
                            + order + ') div.faq-question').visible();
            }
        },
        generalTitles = ["How can I access high resolution images?","Can I download the application on my PC?",
                         "How often does the database get updated?",
                         "Can I use the downloaded images on a commercial website?"],
        accountTitles = ["What are the different membership plans?","Can I change my plan in between?",
                         "How can I deactivate my account?"],
        paymentTitles = ["What are the payment methods you accept?","What is the refund policy?",
                         "How long does it take to process my payment?"],
        text = "It has survived not only five centuries",
        i;

    beforeAll(function () {
        // redirect to page #faq
        Lib.beforeAll("#faq", "faq", undefined, "admin");
    });
    afterAll(function(){
        //Lib.afterAll("faq");//It is not need destroyed
        ST.options.eventDelay = 500;
    });
    
    it('FAQ page is loaded correctly', function () {
        ST.panel("faq")
            .rendered()
            .and(function (page){
                expect(page.rendered).toBeTruthy();
            });
    });
    
    it('Make a screenshot', function(){
        Lib.screenshot('faq'); // take a screenshot
    });
    
    describe("Check all panels", function() {
        function checkItem(title, order){
            it('Check expanding of item '+ order +' on panel ' + title, function () {
                Panel.panel(title)
                    .visible();
                Panel.subPanelText(title, order)
                    .click()
                    .and(function(text) {
                        if (title == "General") {
                            expect(text.dom.innerText).toBe(generalTitles[order-1]);
                        } else if (title == "Account") {
                            expect(text.dom.innerText).toBe(accountTitles[order-1]);
                        } else {
                            expect(text.dom.innerText).toBe(paymentTitles[order-1]);
                        }
                    });
                Panel.subPanel(title, order)
                    .and(function (panel) {
                        // check if panel is expanded via class
                        expect(panel.dom.className).toContain("faq-expanded");
                        expect(panel.dom.textContent).toContain(text);
                    });
            });
        }
        
        function checkPanel(title, count){
            describe('Check panel ' + title, function () {
                for (i=1 ; i<=count ; i++) {
                    checkItem(title,i);
                }
            });
        }
        
        checkPanel("General",4);
        checkPanel("Account",3);
        checkPanel("Payment",3);
    });
});