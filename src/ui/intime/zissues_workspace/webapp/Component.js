sap.ui.loader.config({ paths: { "jira/lib": "/sap/bc/ui5_ui5/sap/zjiralib" } });

sap.ui.define([
    "jira/lib/Component",
    "sap/ui/Device",
    "intime/zissues_workspace/model/models"
], function(UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("intime.zissues_workspace.Component", {

        metadata: {
            manifest: "json"
        },

        /**
         * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
         * @public
         * @override
         */
        init: function() {
            UIComponent.prototype.init.apply(this, arguments);

            this.getRouter().initialize();

            this.setModel(models.createDeviceModel(), "device");
        }
    });
});