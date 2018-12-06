/**
 * @file BottomTabs.js
 * UI - Bottom Tabs
 **/
describe('Bottom tabs', function () {
    var prefix = '#kitchensink-view-tabs-bottomtabs ';

    beforeAll(function() {
        Lib.beforeAll("#bottom-tabs", prefix);
        ST.component(prefix + 'container[title=About]')
            .visible();
    });
    afterAll(function(){
        Lib.afterAll(prefix);
    });

    // Bottom tabs are loaded correctly
    if (ST.os.is.Desktop) {
        describe("Bottom tabs are loaded correctly", function () {
            it('Bottom Tabs tittle is visible', function () {
                ST.component("breadcrumb button[_text=Bottom Tabs]")
                    .visible()
                    .rendered()
                    .and(function (el) {
                        expect(el.getValue()).toContain('bottom-tabs');
                    });
            });
        });
    }

    // Tab About is clicked by default
    describe("Tab About is clicked by default", function() {
        it('Tab has selected class', function () {
            ST.component(prefix + "tabbar tab[_title=About]")
                .hasCls("x-active")
                .and(function (el) {
                    expect(el.el.dom.className).toContain('x-active');
                });
        });
        it('Tab About text is visible', function () {
            ST.component(prefix + "container[title=About]")
                .visible()
                .rendered()
                .and(function (el) {
                    expect(el.el.dom.innerText).toContain('Docking tabs to the bottom will automatically change their style.');
                });
        });
    });

    // Tab Favourites is loaded correctly
    describe("Tab Favorites is loaded correctly", function() {
        it('Tab Favorites has correct title visible', function () {
            ST.component(prefix + "tabbar tab[_title=Favorites]")
                .click()
                .and(function (el) {
                    expect(el._title).toContain('Favorites');
                });
        });
        it('Successfully switched to Favorites section', function () {
            ST.component(prefix + "container[title=Favorites]")
                .visible()
                .rendered()
                .and(function (el) {
                    expect(el.el.dom.innerText).toMatch('(like the 4, below)');
                });
        });
    });

    // Badge is visible
    describe("Badge is visible", function() {
        it('Badge is visible', function () {
            ST.component(prefix + "container[title=Favorites][badgeText=4]")
                .visible()
                .rendered()
                .and(function (el) {
                    expect(el.badgeText).toContain('4');
                });
        });
    });

    // Tab Downloads is loaded correctly
    describe("Tab Downloads is loaded correctly", function() {
        it('Tab Downloads has correct title visible', function () {
            ST.component(prefix + "tabbar tab[_title=Downloads]")
                .click()
                .and(function (el) {
                    expect(el._title).toContain('Downloads');
                });
        });
        it('Successfully switched to Downloads section', function () {
            ST.component(prefix + "container[title=Downloads]")
                .visible()
                .rendered()
                .and(function (el) {
                    expect(el.el.dom.innerText).toMatch('(Badge labels)');
                });
        });
    });

    // Badge is visible
    describe("Badge Downloads is visible", function() {
        it('Badge Downloads is visible', function () {
            ST.component(prefix + "container[title=Downloads][badgeText=Overflow test]")
                .visible()
                .rendered()
                .and(function (el) {
                    expect(el.badgeText).toContain('Overflow test');
                });
        });
    });

    // Tab Settings is loaded correctly
    describe("Tab Settings is loaded correctly", function() {
        it('Tab Settings has correct title visible', function () {
            ST.component(prefix + "tabbar tab[_title=Settings]")
                .click()
                .and(function (el) {
                    expect(el._title).toContain('Settings');
                });
        });
        it('Successfully switched to Settings section', function () {
            ST.component(prefix + "container[title=Settings]")
                .visible()
                .rendered()
                .and(function (el) {
                    expect(el.el.dom.innerText).toMatch('(Tabbars are)');
                });
        });
    });

    // Tab User is loaded correctly
    describe("Tab User is loaded correctly", function() {
        it('Tab User has correct title visible', function () {
            ST.component(prefix + "tabbar tab[_title=User]")
                .click()
                .and(function (el) {
                    expect(el._title).toContain('User');
                });
        });
        it('Successfully switched to User section', function () {
            ST.component(prefix + "container[title=User]")
                .visible()
                .rendered()
                .and(function (el) {
                    expect(el.el.dom.innerText).toMatch('(User tapped User)');
                });
        });
    });
});
