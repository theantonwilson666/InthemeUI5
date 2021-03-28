sap.ui.define([
    "sap/ui/core/UIComponent",
    "jira/lib/ViewBinder",
    "jira/lib/BaseController"
], function(UIComponent, ViewBinder, BaseController) {

    return UIComponent.extend("jira.lib.Component", {

        metadata: {
            manifest: "json",
            aggregations: {
                viewBinder: {
                    type: "jira.lib.ViewBinder",
                    multiple: false
                }
            },
            events: {
                ready: {},
                fail: {}
            }
        },

        init: function() {
            UIComponent.prototype.init.apply(this, arguments);
         
            // Set View Binder in Component
            if (!this.getViewBinder()) {
                this.setViewBinder(new ViewBinder());
            }

        },

        getStartupParameter: function(sParameterName) {
            var oStartupParams = this.getComponentData().startupParameters;
            var sValue = oStartupParams[sParameterName];
            if (Array.isArray(oStartupParams[sParameterName])) {
                sValue = oStartupParams[sParameterName][0];
            } else if (sValue === undefined) {
                sValue = null;
            }
            return sValue;
        },

        checkExistError: function() {
            new BaseController().isExistError();
        },

        showBusyDialog: function() {
            new BaseController().showBusyDialog();
        },

        closeBusyDialog: function() {
            new BaseController().closeBusyDialog();
        },


    });

});