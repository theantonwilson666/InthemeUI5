sap.ui.define([
    "sap/ui/core/UIComponent",
    "intheme/zjira_project_register/ViewBinder",
    "intheme/zjira_project_register/model/models",
    "sap/ui/Device"
], function (UIComponent, ViewBinder, models, Device) {
    "use strict";

    return UIComponent.extend("intheme.zjira_project_register.Component", {

        metadata: {
            manifest: "json",
            aggregations: {
                viewBinder: {
                    type: "intheme.zjira_project_register.ViewBinder",
                    multiple: false
                },
            }
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            
            // Set View Binder in Component
            if (!this.getViewBinder()) {
                this.setViewBinder(new ViewBinder());
            }
            
            // enable routing
            this.getRouter().initialize();
            
            // set the device model
            this.setModel(models.createDeviceModel(),"device");
        }
    });
});