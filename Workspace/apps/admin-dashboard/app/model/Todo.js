/**
 * Created by nickrogers on 4/8/16.
 */
Ext.define('Admin.model.Todo', {
    extend: 'Admin.model.Base',
    requires: [
        'Ext.data.field.Date'
    ],

    fields: [
        {
            type: 'int',
            name: 'id'
        },
        {
            type: 'string',
            name: 'task'
        },
        {
            type: 'boolean',
            name: 'done'
        },
        {
            type: 'date',
            name: 'completedDate'
        }
    ],

    set: function(name, value) {
        var data = name;

        if (typeof name === 'string') {
            if (name !== 'done') {
                data = [name, value];
            } else {
                data = [{
                    completedDate: done ? new Date() : null
                }];
                data[0].done = done;
            }
        } else {
            if (data.done !== undefined) {
                data = [Ext.apply({
                    completedDate: data.done ? new Date() : null
                }, data)];
            } else {
                data = [name];
            }
        }

        return this.callParent(data);
    }
});
