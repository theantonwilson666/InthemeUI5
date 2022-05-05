sap.ui.loader.config({ paths: { "jira/lib": "/sap/bc/ui5_ui5/sap/zjiralib" } });

sap.ui.define([
    "jira/lib/Component",
    "sap/ui/Device",
    "intime/zpartners_registry/model/models"
], function(UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("intime.zpartners_registry.Component", {

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

            this.getModel().metadataLoaded().then(function (){
                // this.getModel().setDeferredGroups(["changes", "projectChange", "adminChange"]);
            }.bind(this));
        }
    });
});