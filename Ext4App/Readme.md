# Ext4App/app

This folder contains the javascript files for the application.

# Ext4App/resources

This folder contains static resources (typically an `"images"` folder as well).

# Ext4App/overrides

This folder contains override classes. All overrides in this folder will be 
automatically included in application builds if the target class of the override
is loaded.

# Ext4App/sass/etc

This folder contains misc. support code for sass builds (global functions, 
mixins, etc.)

# Ext4App/sass/src

This folder contains sass files defining css rules corresponding to classes
included in the application's javascript code build.  By default, files in this 
folder are mapped to the application's root namespace, 'Ext4App'. The
namespace to which files in this directory are matched is controlled by the
app.sass.namespace property in Ext4App/.sencha/app/sencha.cfg. 

# Ext4App/sass/var

This folder contains sass files defining sass variables corresponding to classes
included in the application's javascript code build.  By default, files in this 
folder are mapped to the application's root namespace, 'Ext4App'. The
namespace to which files in this directory are matched is controlled by the
app.sass.namespace property in Ext4App/.sencha/app/sencha.cfg. 
