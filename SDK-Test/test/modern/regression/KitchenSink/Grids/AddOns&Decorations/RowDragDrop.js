describe("RowDragDrop", function() {

    beforeAll(function() {
        Lib.beforeAll("#dd-grid-row");
    });

    var row = 'dd-grid-row[id="kitchensink-view-grid-addons-rowdd"]';
    var Grid = {
        rowCheckBox: function(id) {
            return ST.component('checkcell[xtype="checkcell"]:nth-child(' + id + ')');
        },

        gridRow: function(id) {
            var target = ' gridrow[id=ext-gridrow-' + id + ']';
            return target;
        },
    };

    /**
     * dragX, dragY - x and y co-ordinates from where the row has to be dragged from
     * dropX, dropY - x and y co-ordinates to where the dragged row to be dropped to
     */
    function dragAndDrop(dragX, dragY, dropX, dropY, dragTarget, dropTarget) {
        ST.play([{
            type: 'draganddrop',
            target: 'dd-grid-row',
            dragTarget: row + Grid.gridRow(dragTarget),
            dragX: dragX,
            dragY: dragY,
            dropTarget: row + Grid.gridRow(dropTarget),
            dropX: dropX,
            dropY: dropY

        }]);
    }

    it("Should drag and drop row", function() {
        dragAndDrop(7, 24, 38, 35, 1, 2);
        ST.component(row + Grid.gridRow(1)).textLike('Mark Guerrant');
        ST.component(row + Grid.gridRow(2)).textLike('Don Griffin');
    });

    it("Should retain checkmark afterdrag and drop", function() {
        Grid.rowCheckBox(1).click();
        dragAndDrop(7, 24, 38, 35, 1, 2);
        ST.component(row + Grid.gridRow(2)).hasCls('x-selected')
            .and(function(el) {
                expect(el.el.dom.className).toContain('x-selected');
            });
        Grid.rowCheckBox(2).click();
    });

    it("Check for multiple item drag and drop", function() {
        Grid.rowCheckBox(1).click();
        Grid.rowCheckBox(2).click();
        dragAndDrop(76, 20, 97, 36, 1, 3);

        ST.component(row + Grid.gridRow(2)).hasCls('x-selected')
            .and(function(el) {
                expect(el.el.dom.className).toContain('x-selected');
            });
        ST.component(row + Grid.gridRow(3)).hasCls('x-selected')
            .and(function(el) {
                expect(el.el.dom.className).toContain('x-selected');
            });
        ST.component(row + Grid.gridRow(1)).textLike('Phil Kravchenko');
        ST.component(row + Grid.gridRow(2)).textLike('Don Griffin');
        ST.component(row + Grid.gridRow(3)).textLike('Mark Guerrant');
    });
});
