describe('FAQ', function () {
    /*
     * Futures enable tests to practice the DRY (Don’t Repeat Yourself) principle.
     * Instead of creating the future instance at the point of need,
     * consider the following alternative.
     */
    var Faq = {
        // Using ComponentQuery to locate right Ext.panel.Panel by xtype and title text
        // More about Locators can be found in Sencha Test documentation
        // http://docs.sencha.com/sencha_test/ST.Locator.html
        panel : function (title) {
            return ST.panel('panel[title=' + title + ']');
        },

        // Using ComponentQuery to locate right target for clicking in test
        // Same can be done using Composite Query
        // 'panel[title^=' + title + '] panel:nth-child(' + order + ') => div.x-title'
        subPanelHeader : function (title, order) {
            return ST.component('panel[title^=' + title + '] panel:nth-child(' + order + ') > header');
        },

        // Using ComponentQuery to locate right Ext.panel.Panel by xtype and order
        subPanel : function (title, order) {
            return ST.panel('panel[title^=' + title + '] panel:nth-child(' + order + ')');
        }
    };

    beforeAll(function () {
        // redirect to page route #faq
        Admin.app.redirectTo("#faq");
    });

    it('loads correctly', function () {
        Faq.panel('FAQs').visible();
    });

    it('make a screenshot', function () {
        ST.screenshot('faq'); // take a screenshot
    });

    it('check Useful tips panel', function () {
        //If width is below 1000 px side panels are not visible
        if (window.innerWidth > 1000) {
            Faq.panel('Useful Tips').visible();
            Faq.panel('Can\'t find the answer?').visible();

            ST.button('panel[title=Can\'t find the answer?] button')
                .click();
            // no function is binded to this button so there is nothing to check
            // but in real app one would add .and() method if correct action was performed
            // .and(function(){
            //      check if correct action is performed
            // });
        }
    });

    describe('FAQ panel', function () {
        function checkSubPanel(title, i){
            it('should expand sub panel '+ i +' by clicking on header ', function () {
                Faq.subPanelHeader(title, i).click();

                Faq.subPanel(title, i)
                    .and(function (panel) {
                        expect(panel.collapsed).toBeFalsy();
                    });
            });
        }

        function checkPanel(title, sumSubPanel) {
            describe(title, function () {
                afterEach(function(){
                    Faq.panel(title)
                        .and(function(panel){
                            //Expand first item after each spec to ensure same baseline for all tests
                            panel.items.items[0].expand();
                        });
                });

                it('should collapse first sub panel and expand second sub panel by clicking on header', function () {
                    Faq.panel(title);
                    Faq.subPanelHeader(title, 1).click();

                    Faq.subPanel(title, 1)
                        .and(function (panel) {
                            expect(panel.collapsed).toBe('top');
                        });

                    Faq.subPanel(title,2)
                        .and(function(panel){
                            expect(panel.collapsed).toBeFalsy();
                        });
                });

                //loop through child panels and expand/collapse them
                for (var i = 2; i <= sumSubPanel; i++) {
                    checkSubPanel(title,i);
                }
            });
        }

        checkPanel('General', 4);
        checkPanel('Account', 4);
        checkPanel('Payment', 3);
    });
});
