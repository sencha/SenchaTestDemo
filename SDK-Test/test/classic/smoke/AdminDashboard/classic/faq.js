describe('FAQ', function () {
    var Panel = {
        panel : function (title) {
            return ST.panel('panel[title=' + title + ']').rendered().and(function (panel) {
                expect(panel.rendered).toBeTruthy();
            });
        },
        subPanelHeader : function (title, order) {
            return ST.panel('panel[title^=' + title + '] panel:nth-child(' + order + ') > header');
        },
        subPanel : function (title, order) {
            return ST.panel('panel[title^=' + title + '] panel:nth-child(' + order + ')').rendered().and(function (panel) {
                expect(panel.rendered).toBeTruthy();
            });
        }
    };
    beforeAll(function () {
        // redirect to page #faq
        Admin.app.redirectTo("#faq");
    });

    it('loads correctly', function () {
        Panel.panel('FAQs');

    });

    it('make a screenshot', function () {
        Lib.screenshot('form'); // take a screenshot
    });

    it('check Useful tips panel', function () {
        //If width is below 1000 px side panels are not visible
        if (window.innerWidth > 1000) {
            Panel.panel('Useful Tips').visible();
            Panel.panel('Can\'t find the answer?').visible();
            ST.button('panel[title=Can\'t find the answer?] button')
                .rendered()
                .click();
        }
    });


    describe('FAQ panel', function () {

        function checkSubPanel(title, i){
            it('should expand sub panel '+ i +' by clicking on header ', function () {
                Panel.subPanelHeader(title, i).click();
                Panel.subPanel(title, i)
                    .and(function (panel) {
                        expect(panel.collapsed).toBeFalsy();
                    });
            });
        }
        function checkPanel(title, sumSubPanel) {
            describe(title, function () {

                afterEach(function(){
                    Panel.panel(title)
                        .and(function(panel){
                            //first item expand
                            panel.items.items[0].expand();
                        });

                });
                
                it('should collapse first sub panel and expand second sub panel by clicking on header', function () {
                    Panel.panel(title);
                    Panel.subPanelHeader(title, 1).click();
                    Panel.subPanel(title, 1)
                        .and(function (panel) {
                            expect(panel.collapsed).toBe('top');
                        });
                    Panel.subPanel(title,2)
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
