sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
], function(Controller, Fragment){
    "use strict";

    return Controller.extend("tms.lib.BaseController", {

        getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName) || this.getView().getModel(sName);
        },
        
        getProperty: function (sPath) {
			return this.getModel().getProperty(sPath);
        },
        
        getStateProperty: function (sPath, oContext) {
			return this.getModel("state").getProperty(sPath, oContext);
        },
        
        getViewBinder: function () {
			return this.viewBinder;
        },
        
        getRouter: function () {
			return this.getOwnerComponent().getRouter();
		}
    });
});