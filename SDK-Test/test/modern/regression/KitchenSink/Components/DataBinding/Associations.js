/**
* @file Associations.js
* @name Data binding/Binding Associations
* @created 2016/09/19
*/

describe("Associations - EXTJS-25168", function() {
    var prefix = '#kitchensink-view-binding-association ';
    var Dash = {	
    	lengthOfSimpleTextField : function (num) {   //need to know count of items. Input 1 or 2 
            var len = Ext.ComponentQuery.query(prefix + 'list')[num].query('simplelistitem').length;
            return len; 
        },
        titleBar : function () {    //substr Tittle upper second dataview
            var title = Ext.ComponentQuery.query(prefix + 'list[flex=3] titlebar')[0].getTitle();
            title = title.substring(13,title.length);
            return title; 
        },
        itemName : function (numberItem) {    //return string with name. Name is take from first dataview      	            
            var name = Ext.first(prefix + 'list[title=People] simplelistitem:nth-child(' + numberItem + ')').el.dom.innerText.replace('\n','');
            return name;
        },
        dataKey : function (numberItem) {    //return key from first dataview. It's take from 'database'.
            var key = Ext.ComponentQuery.query(prefix + 'list[flex=3] simplelistitem[recordIndex='+numberItem+']')[0].getRecord().data.accountKey;
            return key;
        },
        stringKey : function (numberItem) {    //return key from second dataview. It's take from string. 
            var key = Ext.ComponentQuery.query(prefix + 'list[flex=3] simplelistitem[recordIndex='+numberItem+']')[0].el.el.dom.innerText;
            key = key.split('Key: ')[1].trim();
            return key;
        }
	};

    function clickOnItems(counter){
        var desc = "Title has correct text, Values are correctly loaded. Item- "+(counter+1);
        if(counter > 0){
            desc =  (counter + 1) + " row is not available";
        }
        it(desc, function() {
            ST.element(prefix + 'list[title=People] simplelistitem[recordIndex='+counter+']')  //this part is for clicking in dataview
                .click()
                .hasCls('x-selected');
            ST.component(prefix + 'list[flex=3] titlebar')
                .wait(function (titleBar) {
                    var itemName = Dash.itemName(counter+1);
                    //substring('\n', '') deosn't work in IE properly, because character there is probably not just '\n' - (JZ)
                    if(ST.browser.is('IE')) {
                          itemName = itemName.substr(1);
                    }
                    return (titleBar.getTitle()).indexOf(itemName) >=0;
                })
                .and(function(){
                    var itemName = Dash.itemName(counter+1);
                    //substring('\n', '') doesn't work in IE properly, because character there is probably not just '\n' - (JZ)
                    if(ST.browser.is('IE')) {
                        itemName = itemName.substr(1);
                    }
                    expect(itemName).toBe(Dash.titleBar());
                    var number = Dash.lengthOfSimpleTextField(1);
                    for (var i = 0; i < number; i++){
                        expect(Dash.dataKey(i)).toBe(Dash.stringKey(i));             
                    }                
                });    
        });
    }

    beforeAll(function() {
        Lib.beforeAll("#binding-associations", "#kitchensink-view-binding-association");
        ST.component(prefix + 'list[title=People] simplelistitem[recordIndex=0]')
            .visible();
    });
    afterAll(function(){
        Lib.afterAll("#kitchensink-view-binding-association");
    });
    
    describe("Click and check Values", function() {
        for(var i = 0; i < 5; i++){
            clickOnItems(i);
        }
    });
});
