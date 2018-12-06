/**
 * @file amf0.js
 * Amfo
 **/

describe("amf0", function() {
    var prefix = "#kitchensink-view-enterprise-amf0 ";
    var t;
    beforeAll(function () {
        // redirect to page Components>Enterprise>soap
        t = ST.options.timeout;
        ST.options.timeout = 10000;
        Lib.beforeAll("#amf-zero", prefix + 'gridcell[value="Danish"]');

    });
    afterAll(function(){
        Lib.afterAll(prefix);
        ST.options.timeout = t;
    });
    var Amf = {
        grid : function () {
            return ST.grid(prefix);
        }
    };
    // amf-zero is loaded correctly
    describe("amf-zero is loaded correctly", function() {
        it('amf-zero main page is loaded', function () {
            Amf.grid()
                .visible()
                .and(function(grid) {
                    expect(grid.isVisible()).toBeTruthy()}
                );
        });
        it('amf-zero main page has 14 records', function () {
            Amf.grid()
                .and(function(list) {
                    expect(list.getStore().getCount()).toBe(14);
                });
        });
    });

    // first column contains Languages
    describe("first column contains Languages", function() {
        var languages = ['Danish','German','Greek','English','Spanish','French','Irish Gaelic','Hungarian','Icelandic','Japanese (Hiragana)','Japanese (Katakana)','Hebrew','Polish','Russian'];
        function languagesLoop(languages,i){
            it(languages +  ' Language', function () {
                Amf.grid()
                    .rowAt(i)
                    .cellAt(0)
                    .and(function(record){
                        expect(record.el.dom.textContent).toContain(''+ languages +'');
                    });
            });
        }
        for(var i = 0; i < 14; i++) {
            languagesLoop(languages[i],i);
        }
    });

    // second column contains Pangram
    describe("second column contains Pangram", function() {
        var pangrams = ['Quizdeltagerne','größeren','μυρτιὲς','quick','pingüino','Fête','hÓighe','Árvíztűrő','bæði','あさきゆ','ヱヒモセスン','הקליטה','łódź','цитрус'];
        function checkPangramRow(pangram,i){
            it(pangram +  ' Pangram', function () {
                Amf.grid()
                    .rowAt(i) // row at i
                    .cellAt(1)
                    .and(function(record){
                        expect(record.el.dom.textContent).toContain(pangram);
                    });
            });
        }
        for(var i = 0; i < 14; i++) {
            checkPangramRow(pangrams[i],i);
        }
    });

    // sorting test
    describe("sorting test", function() {
        var column = ['Language','Pangram'];
        var cell = ['0','1'];
        var text = ['Danish','D\'fhuascail Íosa, Úrmhac na hÓighe Beannaithe, pór Éava agus Ádhaimh'];
        var text2 = ['Spanish','イロハニホヘト チリヌルヲ ワカヨタレソ ツネナラム ウヰノオクヤマ ケフコエテ アサキユメミシ ヱヒモセスン'];
        function sorting(column,cell,text,text2) {
            it('should sort column ' + column + ' ASC and DESC by clicking on header', function () {
                ST.grid(prefix + "headercontainer gridcolumn[_text=" + column + "]")
                    .click();
                Amf.grid()
                    .rowAt(0)
                    .cellAt(cell)
                    .and(function (cell) {
                        expect(cell.el.dom.textContent).toBe(text);
                    });
                ST.grid(prefix + "headercontainer gridcolumn[text=" + column + "]")
                    .click();
                Amf.grid()
                    .rowAt(0)
                    .cellAt(cell)
                    .and(function (cell) {
                        expect(cell.el.dom.textContent).toBe(text2);
                    });
            });
        }
        for(var i = 0; i < column.length; i++) {
            sorting(column[i],cell[i],text[i],text2[i]);
        }
    });
});