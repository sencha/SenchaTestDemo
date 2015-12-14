Ext.define('Admin.view.authentication.Login', {
    extend: 'Admin.view.authentication.AuthBase',
    xtype: 'login',

    requires: [
        'Ext.field.Checkbox',
        'Ext.field.Password',
        'Ext.field.Text',
        'Ext.layout.HBox'
    ],

    items: [{
        xtype: 'panel',

        items: [{
            padding: '20 0 0 20',
            html: 'Sign into your account'
        },{
            xtype: 'container',
            padding: 20,
            defaults: {
                margin:'0 0 10 0'
            },
            items: [{
                xtype: 'textfield',
                placeHolder: 'Email',
                userCls: 'text-border'
            },{
                xtype: 'passwordfield',
                placeHolder: 'Password',
                userCls: 'text-border'
            },{
                layout: 'hbox',
                items: [{
                    xtype: 'checkboxfield'
                },{
                    html: 'Remember Me',
                    userCls: 'checkbox-text-adjustment',
                    style: 'marginRight:20px'
                },{
                    html: '<a href="#passwordreset">Forgot Password</a>',
                    userCls: 'checkbox-text-adjustment'
                }]
            },{
                xtype: 'button',
                text: 'Login',
                iconAlign: 'right',
                iconCls: 'x-fa fa-angle-right',
                ui: 'confirm',
                handler: function(){
                    window.location.href = "#dashboard";
                }
            },{
                xtype: 'button',
                text: 'Login with Facebook',
                iconAlign: 'right',
                iconCls: 'x-fa fa-facebook',
                ui: 'facebook',
                handler: function(){
                    window.location.href = "#dashboard";
                }
            },{
                xtype: 'button',
                text: 'Create Account',
                ui: 'gray-button',
                iconAlign: 'right',
                iconCls: 'x-fa fa-user-plus',
                handler: function(){
                    window.location.href= "#register";
                }
            }]
        }]
    }]
});
