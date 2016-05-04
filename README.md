# SenchaTestDemo
Example applications and workspaces to demonstrate use of Sencha Test.  Each of these
has been decorated with a few starter tests.

## Workspace
This is a workspace with two applications: the admin dashboard and the Sencha Cmd
"starter" application. This workspace needs a copy of Ext JS 6.0.1 extracted into its 
`"ext"` directory before it can be opened in Sencha Studio.

When you open this workspace in Sencha Test and view the **Runs** tab, you will see
a set of test runs copied from a Sencha Test Archive Server. See the
[walkthrough](walkthrough/Workspace/Readme.md) for the story being told by the test
runs for this project.

The **Admin** application in this workspace has a complete Functional test suite as
well as examples of Unit tests as well as Integration tests.

## TestProject
This is a stand-alone test workspace. There is no Sencha framework or even an application
in this project. This type of project is common for Test Engineers or Test Automation
Engineers because the application ("test subject") is most likely hosted on a QA server.

## AdminDashboard
This is a single-application project using the Ext JS 6.0.1 application template. 
It needs a copy of Ext JS 6.0.1 extracted into its `"ext"` directory before it can
be opened in Sencha Studio.

## Ext5App
This is a single-application project using Ext JS 5.1.1. It needs a copy of Ext JS 5.1.1 
extracted into its `"ext"` directory.

After the framework is in place, you will need to run the following command before 
running tests:

    sencha app build -dev

## Ext4App
This is a single-application project using Ext JS 4.2.5. It needs a copy of Ext JS 4.2.5 
extracted into its `"ext"` directory.

After the framework is in place, you will need to run the following command before 
running tests:

    sencha app build -dev

## Touch2App
This is a single-application project using Sencha Touch 2.4.2. It needs a copy of 
Sencha Touch 2.4.2 extracted into its `"touch"` directory.

After the framework is in place, you will need to run the following command before 
running tests:

    sencha app build -dev
