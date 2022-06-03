sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "intime/ztelegram_app/model/models"
], function(UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("intime.ztelegram_app.Component", {

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