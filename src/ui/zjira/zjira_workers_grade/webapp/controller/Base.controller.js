sap.ui.define([
    "jira/lib/BaseController",
    "intheme/zjira_workers_grade/formatter/CommonFormatter",
    "sap/ui/core/Fragment"
], function(Controller, Formatter, Fragment) {
    "use strict";

    return Controller.extend("intheme.zjira_workers_grade.controller.Base", {

        commonFormatter: Formatter,

        getRouter: function() {
            return this.getOwnerComponent().getRouter();
        },

        bindView: function(mParameters) {
            this._initViewBinder();
            return this.viewBinder.bind(mParameters);
        },

        _initViewBinder: function() {
            var ViewBinderClass = this.getOwnerComponent().getViewBinder().getMetadata().getClass();
            this.viewBinder = new ViewBinderClass();
            this.viewBinder.setModel(this.getModel());
            this.viewBinder.setView(this.getView());
        },

        getViewBinder: function() {
            return this.viewBinder;
        },

        setStateProperty: function(sPath, oValue, oContext, bAsyncUpdate) {
            return this.getModel("state").setProperty(sPath, oValue, oContext, bAsyncUpdate);
        },

        getStateProperty: function(sPath, oContext) {
            return this.getModel("state").getProperty(sPath, oContext)
        },

        getModel: function(sName) {
            return this.getOwnerComponent().getModel(sName) || this.getView().getModel(sName);
        },

        onDataRequested: function(oEvent) {

        },

        onFireSearchAfterSelectSmartVariant: function(sFilterBarId) {
            if (typeof sFilterBarId === "string" && sFilterBarId.length > 0) {
                this.byId(sFilterBarId).fireSearch();
                return true;
            }
            return false;
        },

        navTo: function(sName, oParameters, bReplace) {
            this.getRouter().navTo(sName, oParameters, bReplace);
        },

        getSmartTable: function() {
            return this.getView().byId("userSmartTab");
        },

        submitChanges: function(oEvents) {
            return this.getModel().submitChanges(oEvents);
        },

        i18n: function(sKey, aArgs) {
            return this.getResourceBundle().getText(sKey, aArgs);
        },

        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },
    });
});