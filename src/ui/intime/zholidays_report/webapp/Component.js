sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/JSON/JSONModel",
    "sap/ui/model/resource/ResourceModel"

], function (UIComponent, JSONModel, ResourceModel) {
    "use strict";
    return UIComponent.extend("intime.zholiday_report.Component", {
        metadata : {
            interfaces: ["sap.ui.core.IAsyncContentCreation"],
            manifest: "json"
      }, 
        init: function () {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            // set data model
            this.getRouter().initialize();

            //set i18n model
            //let i18nModel = new ResourceModel({
            //    bundleName: "course.UI5_prog.i18n.i18n"
            //});
            //this.setModel(i18nModel, "i18n");
        }

    });
});