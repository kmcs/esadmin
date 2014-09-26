/* ************************************************************************
 
 Copyright (c) 2014 "kmcs" Timo Kiefer
 
 License: GPL
 
 Authors: Timo Kiefer <timo.kiefer@kmcs.de>
 
 ************************************************************************ */

/**
 * This is the main application class of your custom application "esadmin"
 */
qx.Class.define("kmcs.esadmin.Application", {
    extend: qx.application.Standalone,
    /*
     *****************************************************************************
     MEMBERS
     *****************************************************************************
     */

    members: {
        /**
         * This method contains the initial application code and gets called 
         * during startup of the application
         * 
         * @lint ignoreDeprecated(alert)
         */
        main: function ()
        {
            // Call super class
            this.base(arguments);

            // Enable logging in debug variant
            if (qx.core.Environment.get("qx.debug")) {
                // support native logging capabilities, e.g. Firebug for Firefox
                qx.log.appender.Native;
                // support additional cross-browser console. Press F7 to toggle visibility
                qx.log.appender.Console;
            }

            /*
             -------------------------------------------------------------------------
             Below is your actual application code...
             -------------------------------------------------------------------------
             */

            // Create main viewport
            var main = new kmcs.esadmin.ui.Main();

            // Document is the application root
            var doc = this.getRoot();
            
            // Add main viewport to the qx root element
            doc.add(main, {width: "100%",
                height: "100%"});
        }
    }
});
